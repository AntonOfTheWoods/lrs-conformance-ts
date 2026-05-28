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

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactsRoot = resolve(repoRoot, "tmp/agents");

const volatileSeedTables = new Set(["admin_account", "credential_to_scope", "lrs_credential"]);
const documentContentTables = new Set(["activity_profile_document", "agent_profile_document", "state_document"]);

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/export-db-fingerprint.ts [--out <path>] [--compose-file <path>] [--service db] [--schema public] [--user <db-user>] [--database <db-name>] [--table-filter <regex>] [--exclude-table <name>] [--include-volatile-seed-tables]",
    "",
    "Defaults:",
    "  --out tmp/agents/db-fingerprint/<timestamp>.json",
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
  if (!isWithinPath(allowedArtifactsRoot, absolutePath)) {
    throw new Error(`Output path ${absolutePath} is outside ${allowedArtifactsRoot}.`);
  }

  return absolutePath;
}

function parseConfig(args: string[]): Config {
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const outPath = resolveSafeArtifactPath(
    getFlagValue(args, "--out") ?? resolve(repoRoot, "tmp/agents/db-fingerprint", `${Date.now()}.json`),
  );
  const composeFile = getFlagValue(args, "--compose-file") ?? "compose/lrsql/podman-compose.yml";
  const service = getFlagValue(args, "--service") ?? "db";
  const schema = getFlagValue(args, "--schema") ?? "public";
  const user = getFlagValue(args, "--user") ?? process.env.LRSQL_DB_USER ?? "lrsql_user";
  const database = getFlagValue(args, "--database") ?? process.env.LRSQL_DB_NAME ?? "lrsql_db";
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

async function runPsql(config: Config, sql: string): Promise<string> {
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
  if (exitCode !== 0) {
    throw new Error(`psql command failed with status ${exitCode}: ${stderr.trim()}`);
  }

  return stdout.trim();
}

async function listTables(config: Config): Promise<string[]> {
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

  if (!config.tableFilterRegex) {
    return tables;
  }

  return tables.filter((tableName) => config.tableFilterRegex?.test(tableName));
}

async function loadTableFingerprint(config: Config, tableName: string): Promise<FingerprintTable> {
  const rowJsonExpression = buildFingerprintRowJsonExpression(tableName);
  const sql = [
    "with row_material as (",
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
    `  from ${JSON.stringify(config.schema)}.${JSON.stringify(tableName)} t`,
    "),",
    "column_material as (",
    "  select array_agg(column_name order by ordinal_position) as column_names",
    "  from information_schema.columns",
    `  where table_schema = ${sqlLiteral(config.schema)} and table_name = ${sqlLiteral(tableName)}`,
    ")",
    "select json_build_object(",
    "  'rowCount', (select count(*) from row_material),",
    "  'rowHash', coalesce((select md5(string_agg(row_md5, '' order by row_md5)) from row_material), md5('')),",
    "  'columnNames', coalesce((select column_names from column_material), array[]::text[])",
    ");",
  ].join("\n");

  const output = await runPsql(config, sql);
  if (!output) {
    throw new Error(`Missing fingerprint output for table ${tableName}.`);
  }

  const parsed = JSON.parse(output) as FingerprintTable;
  return {
    columnNames: parsed.columnNames,
    rowCount: parsed.rowCount,
    rowHash: parsed.rowHash,
  };
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function exportDbFingerprint(options: ExportDbFingerprintOptions): Promise<FingerprintArtifact> {
  const config: Config = {
    composeFile: options.composeFile ?? "compose/lrsql/podman-compose.yml",
    database: options.database ?? process.env.LRSQL_DB_NAME ?? "lrsql_db",
    excludedTables: new Set(options.excludedTables ?? volatileSeedTables),
    outPath: resolveSafeArtifactPath(options.outPath),
    schema: options.schema ?? "public",
    service: options.service ?? "db",
    tableFilterRegex: options.tableFilterRegex,
    user: options.user ?? process.env.LRSQL_DB_USER ?? "lrsql_user",
  };

  const tables = await listTables(config);

  const tableFingerprints: Record<string, FingerprintTable> = {};
  for (const tableName of tables) {
    tableFingerprints[tableName] = await loadTableFingerprint(config, tableName);
  }

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
