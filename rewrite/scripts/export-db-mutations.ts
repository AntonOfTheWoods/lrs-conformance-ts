import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import type { FingerprintArtifact } from "./compare-db-fingerprints.ts";

type PsqlCommandResult = {
  exitCode: number;
  stderr: string;
  stdout: string;
};

type ReaderLike = {
  read(): Promise<{ done: boolean; value?: Uint8Array }>;
};

export class MutationPsqlSession {
  private readonly encoder = new TextEncoder();

  private readonly decoder = new TextDecoder();

  private readonly stderrPromise: Promise<string>;

  private readonly subprocess: Bun.PipedSubprocess;

  private readonly stdoutReader: ReaderLike;

  private readonly stdinSink: Bun.PipedSubprocess["stdin"];

  private buffer = "";

  private closed = false;

  private querySequence = 0;

  constructor(options: MutationCaptureOptions = {}) {
    const config = createConfig(options);
    this.subprocess = Bun.spawn({
      cmd: [
        "podman",
        "compose",
        "-f",
        config.composeFile,
        "exec",
        "-T",
        config.service,
        "psql",
        "-U",
        config.user,
        "-d",
        config.database,
        "-v",
        "ON_ERROR_STOP=1",
        "-q",
        "-X",
        "-t",
        "-A",
        "-P",
        "pager=off",
      ],
      cwd: repoRoot,
      env: process.env,
      stdin: "pipe",
      stderr: "pipe",
      stdout: "pipe",
    });
    this.stdoutReader = this.subprocess.stdout.getReader() as unknown as ReaderLike;
    this.stdinSink = this.subprocess.stdin;
    this.stderrPromise = readStreamText(this.subprocess.stderr);
  }

  async query(sql: string): Promise<string> {
    this.ensureOpen();

    const marker = `__CONFORMANCE_MUTATION_SESSION_MARKER_${++this.querySequence}__`;
    const normalizedSql = sql.trim().replace(/;\s*$/, "");
    await this.stdinSink.write(this.encoder.encode(`${normalizedSql};\nselect ${sqlLiteral(marker)};\n`));
    return this.readUntilMarker(marker);
  }

  async close(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;
    try {
      await this.stdinSink.write(this.encoder.encode("\\q\n"));
    } catch {
      // Ignore shutdown races; the subprocess may already be gone.
    }

    try {
      await this.stdinSink.end();
    } catch {
      // Ignore shutdown races; the subprocess may already be gone.
    }

    if (!(await this.waitForExit(2500))) {
      try {
        this.subprocess.kill("SIGTERM");
      } catch {
        // Ignore best-effort termination failures.
      }
    }

    if (!(await this.waitForExit(1000))) {
      try {
        this.subprocess.kill("SIGKILL");
      } catch {
        // Ignore best-effort termination failures.
      }
    }

    const exitCode = await this.subprocess.exited;
    const stderr = await this.stderrPromise;
    if (exitCode !== 0) {
      throw new Error(`psql session failed with status ${exitCode}: ${stderr.trim()}`);
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error("psql session is already closed.");
    }
  }

  private async readLine(): Promise<string | null> {
    while (true) {
      const newlineIndex = this.buffer.indexOf("\n");
      if (newlineIndex >= 0) {
        const line = this.buffer.slice(0, newlineIndex).replace(/\r$/, "");
        this.buffer = this.buffer.slice(newlineIndex + 1);
        return line;
      }

      const result = await this.stdoutReader.read();
      if (result.done) {
        if (this.buffer.length === 0) {
          return null;
        }

        const line = this.buffer.replace(/\r$/, "");
        this.buffer = "";
        return line;
      }

      this.buffer += this.decoder.decode(result.value, { stream: true });
    }
  }

  private async readUntilMarker(marker: string): Promise<string> {
    const lines: string[] = [];
    while (true) {
      const line = await this.readLine();
      if (line === null) {
        const exitCode = await this.subprocess.exited;
        const stderr = await this.stderrPromise;
        throw new Error(`psql session ended before marker ${marker} (status ${exitCode}): ${stderr.trim()}`);
      }

      if (line === marker) {
        return lines.join("\n").trim();
      }

      lines.push(line);
    }
  }

  private async waitForExit(timeoutMs: number): Promise<boolean> {
    return Promise.race([
      this.subprocess.exited.then(() => true),
      new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  }
}

async function readStreamText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  let output = "";

  while (true) {
    const result = await reader.read();
    if (result.done) {
      break;
    }

    output += decoder.decode(result.value, { stream: true });
  }

  output += decoder.decode();
  return output;
}

export interface MutationCaptureOptions {
  composeFile?: string;
  database?: string;
  schema?: string;
  service?: string;
  user?: string;
}

export interface ExportDbMutationFingerprintOptions extends MutationCaptureOptions {
  outPath: string;
  sinceJournalId: number;
}

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactRoots = [resolve(repoRoot, "tmp/validation"), resolve(repoRoot, "tmp/agents")];

const defaultMutationTables = [
  "activity",
  "activity_profile_document",
  "actor",
  "agent_profile_document",
  "attachment",
  "reaction",
  "state_document",
  "statement_to_activity",
  "statement_to_actor",
  "statement_to_statement",
  "xapi_statement",
] as const;

type MutationConfig = {
  composeFile: string;
  database: string;
  schema: string;
  service: string;
  user: string;
};

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function isWithinPath(basePath: string, candidatePath: string): boolean {
  const relativePath = relative(basePath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function resolveSafeArtifactPath(pathValue: string): string {
  const absolutePath = resolve(pathValue);
  const allowed = allowedArtifactRoots.some((rootPath) => isWithinPath(rootPath, absolutePath));
  if (!allowed) {
    throw new Error(
      `Output path ${absolutePath} is outside allowed artifact roots (${allowedArtifactRoots.join(", ")}).`,
    );
  }

  return absolutePath;
}

function createConfig(options: MutationCaptureOptions): MutationConfig {
  return {
    composeFile: options.composeFile ?? "compose/lrsql/podman-compose.yml",
    database: options.database ?? process.env.LRSQL_DB_NAME ?? "lrsql_db",
    schema: options.schema ?? "public",
    service: options.service ?? "db",
    user: options.user ?? process.env.LRSQL_DB_USER ?? "lrsql_user",
  };
}

function createMutationTableArraySql(): string {
  return `array[${defaultMutationTables.map((tableName) => sqlLiteral(tableName)).join(", ")}]`;
}

export function isRetryablePsqlExecFailure(result: PsqlCommandResult): boolean {
  if (result.exitCode !== 255) {
    return false;
  }

  return /can only create exec sessions on running containers|container state improper/i.test(result.stderr);
}

export async function resolvePsqlCommandOutput(
  runCommand: () => Promise<PsqlCommandResult>,
  options?: {
    maxAttempts?: number;
    retryDelayMs?: number;
  },
): Promise<string> {
  const maxAttempts = options?.maxAttempts ?? 5;
  const retryDelayMs = options?.retryDelayMs ?? 250;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await runCommand();
    if (result.exitCode === 0) {
      return result.stdout.trim();
    }

    const error = new Error(`psql command failed with status ${result.exitCode}: ${result.stderr.trim()}`);
    if (!isRetryablePsqlExecFailure(result) || attempt === maxAttempts) {
      throw error;
    }

    await Bun.sleep(retryDelayMs * attempt);
  }

  throw new Error("psql command failed without producing a result.");
}

async function runPsql(config: MutationConfig, sql: string): Promise<string> {
  return resolvePsqlCommandOutput(async () => {
    const subprocess = Bun.spawn({
      cmd: [
        "podman",
        "compose",
        "-f",
        config.composeFile,
        "exec",
        "-T",
        config.service,
        "psql",
        "-U",
        config.user,
        "-d",
        config.database,
        "-v",
        "ON_ERROR_STOP=1",
        "-t",
        "-A",
        "-c",
        sql,
      ],
      cwd: repoRoot,
      env: process.env,
      stderr: "pipe",
      stdout: "pipe",
    });

    const stdout = await new Response(subprocess.stdout).text();
    const stderr = await new Response(subprocess.stderr).text();
    const exitCode = await subprocess.exited;

    return {
      exitCode,
      stderr,
      stdout,
    } satisfies PsqlCommandResult;
  });
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function ensureMutationCapture(
  options: MutationCaptureOptions = {},
  session?: MutationPsqlSession,
): Promise<void> {
  const config = createConfig(options);
  const sql = [
    "create table if not exists public.conformance_mutation_journal (",
    "  journal_id bigserial primary key,",
    "  table_name text not null,",
    "  op text not null,",
    "  normalized_row jsonb not null",
    ");",
    "",
    "create or replace function public.conformance_capture_mutation()",
    "returns trigger",
    "language plpgsql",
    "as $$",
    "declare",
    "  payload jsonb;",
    "begin",
    "  if TG_OP = 'DELETE' then",
    "    payload := to_jsonb(OLD);",
    "  else",
    "    payload := to_jsonb(NEW);",
    "  end if;",
    "",
    "  payload := payload - array[",
    "    'id',",
    "    'statement_id',",
    "    'actor_id',",
    "    'activity_id',",
    "    'attachment_id',",
    "    'stored',",
    "    'timestamp',",
    "    'updated_at',",
    "    'created_at'",
    "  ];",
    "",
    "  if payload ? 'contents' then",
    "    payload := jsonb_set(payload, '{contents}', to_jsonb(jsonb_build_object('present', true)), true);",
    "  end if;",
    "",
    "  insert into public.conformance_mutation_journal (table_name, op, normalized_row)",
    "  values (TG_TABLE_NAME, TG_OP, payload);",
    "",
    "  return null;",
    "end;",
    "$$;",
    "",
    "do $$",
    "declare",
    `  tables text[] := ${createMutationTableArraySql()};`,
    "  table_name text;",
    "  trigger_name text := 'conformance_capture_mutation_trigger';",
    "begin",
    "  foreach table_name in array tables loop",
    "    if to_regclass(format('%I.%I', 'public', table_name)) is null then",
    "      continue;",
    "    end if;",
    "",
    "    execute format('drop trigger if exists %I on %I.%I', trigger_name, 'public', table_name);",
    "    execute format(",
    "      'create trigger %I after insert or update or delete on %I.%I for each row execute function public.conformance_capture_mutation()',",
    "      trigger_name,",
    "      'public',",
    "      table_name",
    "    );",
    "  end loop;",
    "end;",
    "$$;",
  ].join("\n");

  if (session) {
    await session.query(sql);
    return;
  }

  await runPsql(config, sql);
}

export async function resetMutationCapture(
  options: MutationCaptureOptions = {},
  session?: MutationPsqlSession,
): Promise<void> {
  const config = createConfig(options);
  const sql = "truncate table public.conformance_mutation_journal restart identity;";

  if (session) {
    await session.query(sql);
    return;
  }

  await runPsql(config, sql);
}

export async function exportDbMutationFingerprint(
  options: ExportDbMutationFingerprintOptions,
  session?: MutationPsqlSession,
): Promise<{ artifact: FingerprintArtifact; maxJournalId: number }> {
  const config = createConfig(options);
  const outPath = resolveSafeArtifactPath(options.outPath);
  const sinceJournalId =
    Number.isInteger(options.sinceJournalId) && options.sinceJournalId >= 0 ? options.sinceJournalId : 0;

  const sql = [
    "with limits as (",
    `  select coalesce(max(journal_id), 0)::bigint as max_journal_id from public.conformance_mutation_journal where journal_id > ${sinceJournalId}`,
    "),",
    "bucketed as (",
    "  select",
    "    concat(table_name, '|', op, '|', md5(",
    "      regexp_replace(",
    "        regexp_replace(normalized_row::text, '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', '<uuid>', 'gi'),",
    "        '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})',",
    "        '<isoTimestamp>',",
    "        'g'",
    "      )",
    "    )) as signature_key,",
    "    count(*)::bigint as row_count",
    "  from public.conformance_mutation_journal",
    `  where journal_id > ${sinceJournalId}`,
    "  group by 1",
    "),",
    "tables as (",
    "  select coalesce(",
    "    json_object_agg(",
    "      signature_key,",
    "      json_build_object(",
    "        'columnNames', array[]::text[],",
    "        'rowCount', row_count,",
    "        'rowHash', md5(signature_key)",
    "      )",
    "    ),",
    "    '{}'::json",
    "  ) as payload",
    "  from bucketed",
    ")",
    "select json_build_object(",
    "  'maxJournalId', (select max_journal_id from limits),",
    "  'tables', (select payload from tables)",
    ")::text;",
  ].join("\n");

  const output = session ? await session.query(sql) : await runPsql(config, sql);
  if (!output) {
    throw new Error("Missing mutation fingerprint output.");
  }

  const parsed = JSON.parse(output) as { maxJournalId?: unknown; tables?: unknown };
  const maxJournalId = typeof parsed.maxJournalId === "number" ? parsed.maxJournalId : sinceJournalId;
  const artifact: FingerprintArtifact = {
    tables: (parsed.tables ?? {}) as FingerprintArtifact["tables"],
  };

  await writeJson(outPath, artifact);
  return {
    artifact,
    maxJournalId,
  };
}
