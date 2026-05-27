import { resolve } from "node:path";

import { parseConsoleRunnerArgv } from "./cli-args.ts";
import {
  runNormalizedConsoleRunner,
  type ConsoleRunnerDependencies,
  type ConsoleRunnerExecution,
  type ConsoleRunnerLogger,
} from "./console-runner.ts";
import { normalizeRunnerOptions, type NormalizedRunnerOptions } from "./options.ts";

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type CommandRunner = (command: string[], env: Record<string, string>) => Promise<void>;

export interface DescribeRunDependencies extends ConsoleRunnerDependencies {
  commandRunner?: CommandRunner;
  fetchImpl?: FetchLike;
}

type VersionProbeResult = {
  bodyText: string;
  status: number;
};

const localLrsqlHosts = new Set(["127.0.0.1", "::1", "localhost"]);

function createVersionProbeUrl(endpoint: string): string {
  const base = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  return new URL("statements?limit=1", base).toString();
}

function createLocalLrsqlEnvironment(options: NormalizedRunnerOptions): Record<string, string> {
  const endpointUrl = new URL(options.endpoint);
  const isV1 = options.xapiVersion === "1.0.3";

  return {
    LRSQL_API_KEY_DEFAULT: options.authUser ?? "janedoe",
    LRSQL_API_SECRET_DEFAULT: options.authPass ?? "supersecret",
    LRSQL_ENABLE_STRICT_VERSION: isV1 ? "true" : "false",
    LRSQL_PORT: endpointUrl.port || (endpointUrl.protocol === "https:" ? "443" : "80"),
    LRSQL_SUPPORTED_VERSIONS: isV1 ? "1.0.3" : "1.0.3,2.0.0",
    XAPI_VERSION: options.xapiVersion,
  };
}

async function defaultCommandRunner(command: string[], env: Record<string, string>): Promise<void> {
  const child = Bun.spawn(command, {
    cwd: resolve(import.meta.dir, "..", ".."),
    env: {
      ...process.env,
      ...env,
    },
    stderr: "pipe",
    stdout: "pipe",
  });

  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);

  if (exitCode === 0) {
    return;
  }

  const output = [stdout.trim(), stderr.trim()].filter((value) => value.length > 0).join("\n");
  throw new Error(`Command failed (${command.join(" ")}):${output.length > 0 ? `\n${output}` : ""}`);
}

async function probeEndpointVersion(
  options: NormalizedRunnerOptions,
  fetchImpl: FetchLike,
): Promise<VersionProbeResult> {
  const headers: Record<string, string> = {
    "X-Experience-API-Version": options.xapiVersion,
  };

  if (options.basicAuth && options.authUser && options.authPass) {
    headers.Authorization = `Basic ${Buffer.from(`${options.authUser}:${options.authPass}`).toString("base64")}`;
  }

  const response = await fetchImpl(createVersionProbeUrl(options.endpoint), {
    headers,
    method: "GET",
  });

  return {
    bodyText: await response.text(),
    status: response.status,
  };
}

function isInvalidVersionProbeResult(probe: VersionProbeResult): boolean {
  return probe.status === 400 && /X-Experience-API-Version header invalid/i.test(probe.bodyText);
}

export function isLocalLrsqlEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return localLrsqlHosts.has(url.hostname) && url.pathname.replace(/\/+$/, "") === "/xapi";
  } catch {
    return false;
  }
}

export async function ensureCompatibleLocalLrsqlMode(
  options: NormalizedRunnerOptions,
  dependencies: DescribeRunDependencies = {},
): Promise<void> {
  if (!isLocalLrsqlEndpoint(options.endpoint) || !options.basicAuth || !options.authUser || !options.authPass) {
    return;
  }

  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const logger = dependencies.logger ?? console;
  const commandRunner = dependencies.commandRunner ?? defaultCommandRunner;
  const initialProbe = await probeEndpointVersion(options, fetchImpl);

  if (!isInvalidVersionProbeResult(initialProbe)) {
    return;
  }

  logger.log(`Local LRSQL rejected xAPI ${options.xapiVersion}; resetting it into a compatible mode.`);

  const env = createLocalLrsqlEnvironment(options);
  await commandRunner(["bash", "./scripts/lrsql-reset-best-effort.sh"], env);
  await commandRunner(["bash", "./scripts/lrsql-wait.sh"], env);
  await commandRunner(["bash", "./scripts/lrsql-auth-check.sh"], env);

  const finalProbe = await probeEndpointVersion(options, fetchImpl);
  if (finalProbe.status !== 200) {
    const responseDetail = finalProbe.bodyText.trim();
    throw new Error(
      responseDetail.length > 0
        ? `Local LRSQL still rejected xAPI ${options.xapiVersion} after reset: ${finalProbe.status}. Response: ${responseDetail}`
        : `Local LRSQL still rejected xAPI ${options.xapiVersion} after reset: ${finalProbe.status}.`,
    );
  }

  logger.log(`Local LRSQL is ready for xAPI ${options.xapiVersion}.`);
}

export async function runDescribeRunArgv(
  argv: string[],
  dependencies: DescribeRunDependencies = {},
): Promise<ConsoleRunnerExecution> {
  const parsedOptions = parseConsoleRunnerArgv(argv);
  const normalizedOptions = normalizeRunnerOptions(parsedOptions);

  await ensureCompatibleLocalLrsqlMode(normalizedOptions, dependencies);

  const execution = await runNormalizedConsoleRunner(normalizedOptions, dependencies);
  return {
    ...execution,
    parsedOptions,
  };
}

export async function main(argv: string[], dependencies: DescribeRunDependencies = {}): Promise<number> {
  const logger: ConsoleRunnerLogger = dependencies.logger ?? console;

  try {
    const execution = await runDescribeRunArgv(argv, dependencies);
    return execution.runRecord.summary.failed;
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.main) {
  const exitCode = await main(process.argv.slice(2));
  process.exit(exitCode);
}
