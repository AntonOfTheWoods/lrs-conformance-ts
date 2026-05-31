import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

type FingerprintTable = {
  columnNames: string[];
  rowCount: number;
  rowHash: string;
};

export type FingerprintArtifact = {
  composeFile: string;
  database: string;
  generatedAt: string;
  schema: string;
  service: string;
  tables: Record<string, FingerprintTable>;
  user: string;
};

export interface ExportDbFingerprintOptions {
  composeFile?: string;
  database?: string;
  excludedTables?: Iterable<string>;
  outPath: string;
  schema?: string;
  service?: string;
  tableFilterRegex?: RegExp;
  user?: string;
}

type Config = {
  composeFile: string;
  database: string;
  excludedTables: Set<string>;
  outPath: string;
  schema: string;
  service: string;
  tableFilterRegex?: RegExp;
  user: string;
};

type PsqlCommandResult = {
  exitCode: number;
  stderr: string;
  stdout: string;
};

const tableListCache = new Map<string, string[]>();
const combinedFingerprintSqlCache = new Map<string, string>();

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactRoots = [resolve(repoRoot, "tmp/validation"), resolve(repoRoot, "tmp/agents")];

const volatileSeedTables = new Set(["admin_account", "credential_to_scope", "lrs_credential"]);
const documentContentTables = new Set(["activity_profile_document", "agent_profile_document", "state_document"]);

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/export-db-fingerprint.ts [--out <path>] [--compose-file <path>] [--service db] [--schema public] [--user <db-user>] [--database <db-name>] [--table-filter <regex>] [--exclude-table <name>] [--include-volatile-seed-tables]",
    "",
    "Defaults:",
    "  --out tmp/validation/oracles/db-fingerprint/<timestamp>.json",
    "  --compose-file compose/lrsql/podman-compose.yml",
    "  --service db",
    "  --schema public",
    "  --user $LRSQL_DB_USER or lrsql_user",
    "  --database $LRSQL_DB_NAME or lrsql_db",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function isWithinPath(basePath: string, candidatePath: string): boolean {
  const relativePath = relative(basePath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function collectFlagValues(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag) {
      const value = args[index + 1];
      if (value) {
        values.push(value);
      }
    }
  }

  return values;
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

function parseConfig(args: string[]): Config {
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const outPath = resolveSafeArtifactPath(
    getFlagValue(args, "--out") ?? resolve(repoRoot, "tmp/validation/oracles/db-fingerprint", `${Date.now()}.json`),
  );
  const composeFile = getFlagValue(args, "--compose-file") ?? "compose/lrsql/podman-compose.yml";
  const service = getFlagValue(args, "--service") ?? "db";
  const schema = getFlagValue(args, "--schema") ?? "public";
  const user = getFlagValue(args, "--user") ?? process.env["LRSQL_DB_USER"] ?? "lrsql_user";
  const database = getFlagValue(args, "--database") ?? process.env["LRSQL_DB_NAME"] ?? "lrsql_db";
  const tableFilter = getFlagValue(args, "--table-filter");
  const excludedTables = new Set(collectFlagValues(args, "--exclude-table"));
  if (!args.includes("--include-volatile-seed-tables")) {
    for (const tableName of volatileSeedTables) {
      excludedTables.add(tableName);
    }
  }

  return {
    composeFile,
    database,
    excludedTables,
    outPath,
    schema,
    service,
    tableFilterRegex: tableFilter ? new RegExp(tableFilter) : undefined,
    user,
  };
}

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function createTableListCacheKey(config: Config): string {
  return JSON.stringify({
    excludedTables: [...config.excludedTables].sort(),
    schema: config.schema,
    tableFilterFlags: config.tableFilterRegex?.flags ?? null,
    tableFilterSource: config.tableFilterRegex?.source ?? null,
  });
}

function createCombinedFingerprintSqlCacheKey(schema: string, tableNames: string[]): string {
  return JSON.stringify({
    schema,
    tableNames,
  });
}

export function isRetryablePsqlExecFailure(result: PsqlCommandResult): boolean {
  const stderr = result.stderr;
  if (!stderr) {
    return false;
  }

  const retryablePatterns = [
    /can only create exec sessions on running containers/i,
    /container state improper/i,
    /no container with name or id .* found/i,
    /container .* not found/i,
    /terminating connection due to administrator command/i,
    /server closed the connection unexpectedly/i,
    /connection to server was lost/i,
    /the database system is (starting up|shutting down)/i,
    /could not connect to server/i,
    /connection reset by peer/i,
  ];

  return retryablePatterns.some((pattern) => pattern.test(stderr));
}

export async function resolvePsqlCommandOutput(
  runCommand: () => Promise<PsqlCommandResult>,
  options?: {
    maxAttempts?: number;
    retryDelayMs?: number;
  },
): Promise<string> {
  const maxAttempts = options?.maxAttempts ?? 8;
  const retryDelayMs = options?.retryDelayMs ?? 500;

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

export function buildFingerprintRowJsonExpression(tableName: string, rowAlias = "t"): string {
  if (!documentContentTables.has(tableName)) {
    return `to_jsonb(${rowAlias})`;
  }

  return [
    "case",
    `  when ${rowAlias}.contents is null then to_jsonb(${rowAlias})`,
    "  else jsonb_set(",
    `    to_jsonb(${rowAlias}),`,
    "    '{contents}',",
    "    to_jsonb(",
    "      regexp_replace(",
    "        regexp_replace(",
    `          encode(${rowAlias}.contents, 'escape'),`,
    "          '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',",
    "          '<uuid>',",
    "          'gi'",
    "        ),",
    "        '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})',",
    "        '<isoTimestamp>',",
    "        'g'",
    "      )",
    "    ),",
    "    true",
    "  )",
    "end",
  ].join("\n");
}

export function buildCombinedFingerprintSql(schema: string, tableNames: string[]): string {
  if (tableNames.length === 0) {
    return "select '{}'::json;";
  }

  const tableSelects = tableNames.map((tableName) => {
    const rowJsonExpression = buildFingerprintRowJsonExpression(tableName);
    const qualifiedTable = `${sqlIdentifier(schema)}.${sqlIdentifier(tableName)}`;

    return [
      "select",
      `  ${sqlLiteral(tableName)} as table_name,`,
      "  json_build_object(",
      "    'rowCount', count(*),",
      "    'rowHash', coalesce(md5(string_agg(row_md5, '' order by row_md5)), md5('')),",
      "    'columnNames', (",
      "      select coalesce(array_agg(column_name order by ordinal_position), array[]::text[])",
      "      from information_schema.columns",
      `      where table_schema = ${sqlLiteral(schema)} and table_name = ${sqlLiteral(tableName)}`,
      "    )",
      "  ) as fingerprint",
      "from (",
      "  select md5(",
      "    regexp_replace(",
      "      regexp_replace(",
      `        (${rowJsonExpression})::text,`,
      "        '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',",
      "        '<uuid>',",
      "        'gi'",
      "      ),",
      "      '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})',",
      "      '<isoTimestamp>',",
      "      'g'",
      "    )",
      "  ) as row_md5",
      `  from ${qualifiedTable} t`,
      ") row_material",
    ].join("\n");
  });

  return [
    "select coalesce(json_object_agg(table_name, fingerprint), '{}'::json)",
    "from (",
    tableSelects.join("\nunion all\n"),
    ") table_fingerprints;",
  ].join("\n");
}

async function runPsql(config: Config, sql: string): Promise<string> {
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

async function listTables(config: Config): Promise<string[]> {
  const cacheKey = createTableListCacheKey(config);
  const cachedTables = tableListCache.get(cacheKey);
  if (cachedTables) {
    return cachedTables;
  }

  const sql = `select tablename from pg_tables where schemaname = ${sqlLiteral(config.schema)} order by tablename;`;
  const output = await runPsql(config, sql);
  if (!output) {
    return [];
  }

  const tables = output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((tableName) => !config.excludedTables.has(tableName));

  const filteredTables = config.tableFilterRegex
    ? tables.filter((tableName) => config.tableFilterRegex?.test(tableName))
    : tables;

  tableListCache.set(cacheKey, filteredTables);
  return filteredTables;
}

async function loadTableFingerprints(config: Config, tableNames: string[]): Promise<Record<string, FingerprintTable>> {
  if (tableNames.length === 0) {
    return {};
  }

  const cacheKey = createCombinedFingerprintSqlCacheKey(config.schema, tableNames);
  const sql = combinedFingerprintSqlCache.get(cacheKey) ?? buildCombinedFingerprintSql(config.schema, tableNames);
  combinedFingerprintSqlCache.set(cacheKey, sql);

  const output = await runPsql(config, sql);
  if (!output) {
    throw new Error("Missing fingerprint output.");
  }

  const parsed = JSON.parse(output) as Record<string, FingerprintTable>;
  const fingerprints: Record<string, FingerprintTable> = {};

  for (const tableName of tableNames) {
    const fingerprint = parsed[tableName];
    if (!fingerprint) {
      throw new Error(`Missing fingerprint output for table ${tableName}.`);
    }

    fingerprints[tableName] = {
      columnNames: fingerprint.columnNames,
      rowCount: fingerprint.rowCount,
      rowHash: fingerprint.rowHash,
    };
  }

  return fingerprints;
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function exportDbFingerprint(options: ExportDbFingerprintOptions): Promise<FingerprintArtifact> {
  const config: Config = {
    composeFile: options.composeFile ?? "compose/lrsql/podman-compose.yml",
    database: options.database ?? process.env["LRSQL_DB_NAME"] ?? "lrsql_db",
    excludedTables: new Set(options.excludedTables ?? volatileSeedTables),
    outPath: resolveSafeArtifactPath(options.outPath),
    schema: options.schema ?? "public",
    service: options.service ?? "db",
    tableFilterRegex: options.tableFilterRegex,
    user: options.user ?? process.env["LRSQL_DB_USER"] ?? "lrsql_user",
  };

  const tables = await listTables(config);
  const tableFingerprints = await loadTableFingerprints(config, tables);

  const artifact: FingerprintArtifact = {
    composeFile: config.composeFile,
    database: config.database,
    generatedAt: new Date().toISOString(),
    schema: config.schema,
    service: config.service,
    tables: tableFingerprints,
    user: config.user,
  };

  await writeJson(config.outPath, artifact);
  return artifact;
}

async function main(): Promise<void> {
  const config = parseConfig(process.argv.slice(2));
  const artifact = await exportDbFingerprint(config);
  console.log(JSON.stringify({ outPath: config.outPath, tableCount: Object.keys(artifact.tables).length }, null, 2));
}

if (import.meta.main) {
  await main();
}
