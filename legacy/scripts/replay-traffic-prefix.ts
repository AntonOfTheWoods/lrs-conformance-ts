import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type RawTrafficMessage = {
  bodyBase64: string;
  headers: Array<[string, string]>;
};

type RawTrafficExchange = {
  request: RawTrafficMessage & {
    method: string;
    targetUrl: string;
  };
  response: RawTrafficMessage & {
    status: number;
  };
  sequence: number;
};

type RawTrafficArtifact = {
  exchanges: RawTrafficExchange[];
};

type Config = {
  artifactPath: string;
  assertStatus: boolean;
  prefixLength: number;
  targetBaseUrl?: string;
};

const hopByHopHeaders = new Set(["connection", "host", "content-length", "transfer-encoding", "accept-encoding"]);

function usage(): string {
  return [
    "Usage:",
    "  bun ./legacy/scripts/replay-traffic-prefix.ts --artifact <raw-artifact.json> --prefix <N> [--target-base-url <url>] [--no-assert-status]",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function parseConfig(args: string[]): Config {
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const artifactPath = getFlagValue(args, "--artifact");
  const prefixRaw = getFlagValue(args, "--prefix");
  if (!artifactPath || !prefixRaw) {
    throw new Error(`--artifact and --prefix are required.\n\n${usage()}`);
  }

  const prefixLength = Number.parseInt(prefixRaw, 10);
  if (!Number.isInteger(prefixLength) || prefixLength < 0) {
    throw new Error("--prefix must be a non-negative integer.");
  }

  return {
    artifactPath: resolve(artifactPath),
    assertStatus: !args.includes("--no-assert-status"),
    prefixLength,
    targetBaseUrl: getFlagValue(args, "--target-base-url"),
  };
}

function decodeBody(bodyBase64: string): Uint8Array | undefined {
  if (!bodyBase64) {
    return undefined;
  }

  const buffer = Buffer.from(bodyBase64, "base64");
  if (buffer.byteLength === 0) {
    return undefined;
  }

  return new Uint8Array(buffer);
}

function mapTargetUrl(originalUrl: string, targetBaseUrl?: string): string {
  if (!targetBaseUrl) {
    return originalUrl;
  }

  const original = new URL(originalUrl);
  const targetBase = new URL(targetBaseUrl);

  const targetPrefix = targetBase.pathname.replace(/\/$/, "");
  const originalPath = original.pathname;
  const relativePath = originalPath.startsWith(targetPrefix) ? originalPath.slice(targetPrefix.length) : originalPath;
  const finalPath = `${targetPrefix}${relativePath.startsWith("/") ? relativePath : `/${relativePath}`}`;

  const mapped = new URL(targetBase.origin);
  mapped.pathname = finalPath;
  mapped.search = original.search;
  return mapped.toString();
}

function normalizeRequestHeaders(entries: Array<[string, string]>): Headers {
  const headers = new Headers();
  for (const [nameRaw, value] of entries) {
    const name = nameRaw.toLowerCase();
    if (hopByHopHeaders.has(name)) {
      continue;
    }

    headers.set(name, value);
  }

  return headers;
}

async function loadArtifact(pathValue: string): Promise<RawTrafficArtifact> {
  const raw = await readFile(pathValue, "utf8");
  return JSON.parse(raw) as RawTrafficArtifact;
}

async function replayPrefix(config: Config): Promise<void> {
  const artifact = await loadArtifact(config.artifactPath);
  const exchanges = [...artifact.exchanges].sort((left, right) => left.sequence - right.sequence);
  const selected = exchanges.slice(0, config.prefixLength);

  for (let index = 0; index < selected.length; index += 1) {
    const exchange = selected[index];
    if (!exchange) {
      continue;
    }

    const targetUrl = mapTargetUrl(exchange.request.targetUrl, config.targetBaseUrl);
    const method = exchange.request.method.toUpperCase();
    const headers = normalizeRequestHeaders(exchange.request.headers);
    const body = decodeBody(exchange.request.bodyBase64);

    const response = await fetch(targetUrl, {
      body,
      headers,
      method,
      redirect: "manual",
    });

    if (config.assertStatus && response.status !== exchange.response.status) {
      throw new Error(
        `Status mismatch at action ${index} (sequence ${exchange.sequence}): expected ${exchange.response.status}, received ${response.status}.`,
      );
    }
  }

  console.log(JSON.stringify({ actionCount: selected.length, replayedFrom: config.artifactPath }, null, 2));
}

await replayPrefix(parseConfig(process.argv.slice(2)));
