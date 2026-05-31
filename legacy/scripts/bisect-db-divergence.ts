import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

type FingerprintTable = {
  rowCount: number;
  rowHash: string;
};

type FingerprintArtifact = {
  tables: Record<string, FingerprintTable>;
};

type RawTrafficExchange = {
  sequence: number;
};

type RawTrafficArtifact = {
  exchanges: RawTrafficExchange[];
};

type ProbeRecord = {
  leftFingerprintPath: string;
  prefix: number;
  rightFingerprintPath: string;
  unequal: boolean;
};

type BisectReport = {
  firstDivergentPrefix: number | null;
  leftArtifactPath: string;
  maxPrefix: number;
  probes: ProbeRecord[];
  rightArtifactPath: string;
  verifiedFullPrefixDiverges: boolean;
  verifiedZeroPrefixEqual: boolean;
};

type Config = {
  composeFile: string;
  leftArtifactPath: string;
  maxPrefix?: number;
  outPath: string;
  rightArtifactPath: string;
  targetBaseUrl?: string;
  version: "1.0.3" | "2.0.0";
};

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactRoots = [resolve(repoRoot, "tmp/validation"), resolve(repoRoot, "tmp/agents")];

function usage(): string {
  return [
    "Usage:",
    "  bun ./legacy/scripts/bisect-db-divergence.ts --left-artifact <runtime-raw.json> --right-artifact <upstream-raw.json> --version <1.0.3|2.0.0> [--max-prefix <N>] [--target-base-url <url>] [--compose-file <path>] [--out <path>]",
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

  const leftArtifactPath = getFlagValue(args, "--left-artifact");
  const rightArtifactPath = getFlagValue(args, "--right-artifact");
  const version = getFlagValue(args, "--version");
  if (!leftArtifactPath || !rightArtifactPath || !version) {
    throw new Error(`--left-artifact, --right-artifact, and --version are required.\n\n${usage()}`);
  }

  if (version !== "1.0.3" && version !== "2.0.0") {
    throw new Error("--version must be either 1.0.3 or 2.0.0.");
  }

  const maxPrefixRaw = getFlagValue(args, "--max-prefix");
  let maxPrefix: number | undefined;
  if (maxPrefixRaw) {
    const parsed = Number.parseInt(maxPrefixRaw, 10);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new Error("--max-prefix must be a non-negative integer.");
    }

    maxPrefix = parsed;
  }

  return {
    composeFile: getFlagValue(args, "--compose-file") ?? "ops/compose/lrsql/podman-compose.yml",
    leftArtifactPath: resolve(leftArtifactPath),
    maxPrefix,
    outPath: resolveSafeArtifactPath(
      getFlagValue(args, "--out") ?? resolve(repoRoot, "tmp/validation/oracles/db-bisect", `${Date.now()}.json`),
    ),
    rightArtifactPath: resolve(rightArtifactPath),
    targetBaseUrl: getFlagValue(args, "--target-base-url"),
    version,
  };
}

function createVersionEnvironment(version: "1.0.3" | "2.0.0"): Record<string, string> {
  if (version === "1.0.3") {
    return {
      LRSQL_ENABLE_STRICT_VERSION: "true",
      LRSQL_SUPPORTED_VERSIONS: "1.0.3",
      XAPI_VERSION: version,
    };
  }

  return {
    LRSQL_ENABLE_STRICT_VERSION: "false",
    LRSQL_SUPPORTED_VERSIONS: "1.0.3,2.0.0",
    XAPI_VERSION: version,
  };
}

async function runCommand(command: string, args: string[], env: Record<string, string>): Promise<number> {
  const subprocess = Bun.spawn({
    cmd: [command, ...args],
    cwd: repoRoot,
    env: {
      ...process.env,
      ...env,
    },
    stderr: "inherit",
    stdin: "inherit",
    stdout: "inherit",
  });

  return await subprocess.exited;
}

async function runRequiredCommand(
  command: string,
  args: string[],
  env: Record<string, string>,
  context: string,
): Promise<void> {
  const exitCode = await runCommand(command, args, env);
  if (exitCode !== 0) {
    throw new Error(`${context} exited with status ${exitCode}`);
  }
}

async function ensureLrsql(version: "1.0.3" | "2.0.0"): Promise<void> {
  const env = createVersionEnvironment(version);
  await runRequiredCommand("bash", ["./ops/scripts/lrsql-reset-best-effort.sh"], env, "LRSQL reset");
  await runRequiredCommand("bash", ["./ops/scripts/lrsql-wait.sh"], env, "LRSQL wait");
  await runRequiredCommand("bash", ["./ops/scripts/lrsql-auth-check.sh"], env, "LRSQL auth check");
}

async function readJson<T>(pathValue: string): Promise<T> {
  const raw = await readFile(pathValue, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isFingerprintEqual(left: FingerprintArtifact, right: FingerprintArtifact): boolean {
  const leftTables = Object.keys(left.tables).sort();
  const rightTables = Object.keys(right.tables).sort();
  if (leftTables.length !== rightTables.length) {
    return false;
  }

  for (let index = 0; index < leftTables.length; index += 1) {
    const leftTableName = leftTables[index];
    const rightTableName = rightTables[index];
    if (!leftTableName || !rightTableName || leftTableName !== rightTableName) {
      return false;
    }

    const leftTable = left.tables[leftTableName];
    const rightTable = right.tables[rightTableName];
    if (!leftTable || !rightTable) {
      return false;
    }

    if (leftTable.rowCount !== rightTable.rowCount || leftTable.rowHash !== rightTable.rowHash) {
      return false;
    }
  }

  return true;
}

async function getActionCount(pathValue: string): Promise<number> {
  const artifact = await readJson<RawTrafficArtifact>(pathValue);
  return artifact.exchanges.length;
}

async function probePrefix(
  config: Config,
  prefix: number,
  label: string,
): Promise<{ leftFingerprintPath: string; rightFingerprintPath: string; unequal: boolean }> {
  const probeDir = resolve(dirname(config.outPath), "probes", `prefix-${prefix}`);
  const leftFingerprintPath = resolve(probeDir, `${label}-left.json`);
  const rightFingerprintPath = resolve(probeDir, `${label}-right.json`);

  await ensureLrsql(config.version);
  await runRequiredCommand(
    "bun",
    [
      "./legacy/scripts/replay-traffic-prefix.ts",
      "--artifact",
      config.leftArtifactPath,
      "--prefix",
      String(prefix),
      ...(config.targetBaseUrl ? ["--target-base-url", config.targetBaseUrl] : []),
      "--no-assert-status",
    ],
    createVersionEnvironment(config.version),
    `Replay left prefix ${prefix}`,
  );
  await runRequiredCommand(
    "bun",
    ["./legacy/scripts/export-db-fingerprint.ts", "--compose-file", config.composeFile, "--out", leftFingerprintPath],
    createVersionEnvironment(config.version),
    `Export left fingerprint prefix ${prefix}`,
  );

  await ensureLrsql(config.version);
  await runRequiredCommand(
    "bun",
    [
      "./legacy/scripts/replay-traffic-prefix.ts",
      "--artifact",
      config.rightArtifactPath,
      "--prefix",
      String(prefix),
      ...(config.targetBaseUrl ? ["--target-base-url", config.targetBaseUrl] : []),
      "--no-assert-status",
    ],
    createVersionEnvironment(config.version),
    `Replay right prefix ${prefix}`,
  );
  await runRequiredCommand(
    "bun",
    ["./legacy/scripts/export-db-fingerprint.ts", "--compose-file", config.composeFile, "--out", rightFingerprintPath],
    createVersionEnvironment(config.version),
    `Export right fingerprint prefix ${prefix}`,
  );

  const left = await readJson<FingerprintArtifact>(leftFingerprintPath);
  const right = await readJson<FingerprintArtifact>(rightFingerprintPath);
  return {
    leftFingerprintPath,
    rightFingerprintPath,
    unequal: !isFingerprintEqual(left, right),
  };
}

async function findFirstDivergentPrefix(config: Config): Promise<BisectReport> {
  const leftCount = await getActionCount(config.leftArtifactPath);
  const rightCount = await getActionCount(config.rightArtifactPath);
  const maxPrefix = Math.min(config.maxPrefix ?? Number.MAX_SAFE_INTEGER, leftCount, rightCount);

  const probes: ProbeRecord[] = [];

  const zeroProbe = await probePrefix(config, 0, "zero");
  probes.push({
    leftFingerprintPath: zeroProbe.leftFingerprintPath,
    prefix: 0,
    rightFingerprintPath: zeroProbe.rightFingerprintPath,
    unequal: zeroProbe.unequal,
  });

  if (zeroProbe.unequal) {
    return {
      firstDivergentPrefix: 0,
      leftArtifactPath: config.leftArtifactPath,
      maxPrefix,
      probes,
      rightArtifactPath: config.rightArtifactPath,
      verifiedFullPrefixDiverges: true,
      verifiedZeroPrefixEqual: false,
    };
  }

  const fullProbe = await probePrefix(config, maxPrefix, "full");
  probes.push({
    leftFingerprintPath: fullProbe.leftFingerprintPath,
    prefix: maxPrefix,
    rightFingerprintPath: fullProbe.rightFingerprintPath,
    unequal: fullProbe.unequal,
  });

  if (!fullProbe.unequal) {
    return {
      firstDivergentPrefix: null,
      leftArtifactPath: config.leftArtifactPath,
      maxPrefix,
      probes,
      rightArtifactPath: config.rightArtifactPath,
      verifiedFullPrefixDiverges: false,
      verifiedZeroPrefixEqual: true,
    };
  }

  let low = 0;
  let high = maxPrefix;

  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    const probe = await probePrefix(config, mid, `mid-${mid}`);
    probes.push({
      leftFingerprintPath: probe.leftFingerprintPath,
      prefix: mid,
      rightFingerprintPath: probe.rightFingerprintPath,
      unequal: probe.unequal,
    });

    if (probe.unequal) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return {
    firstDivergentPrefix: high,
    leftArtifactPath: config.leftArtifactPath,
    maxPrefix,
    probes,
    rightArtifactPath: config.rightArtifactPath,
    verifiedFullPrefixDiverges: true,
    verifiedZeroPrefixEqual: true,
  };
}

async function main(): Promise<void> {
  const config = parseConfig(process.argv.slice(2));
  const report = await findFirstDivergentPrefix(config);
  await writeJson(config.outPath, report);
  console.log(JSON.stringify({ outPath: config.outPath, firstDivergentPrefix: report.firstDivergentPrefix }, null, 2));
}

await main();
