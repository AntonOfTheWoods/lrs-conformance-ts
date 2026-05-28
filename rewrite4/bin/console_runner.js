const { readFileSync } = require("fs");
const { resolve } = require("path");
const { pathToFileURL } = require("url");

const candidateRuntimeModeField = "lrsConformanceRuntimeMode";

function isCandidateRuntimeMode(value) {
  return value === "legacy-node" || value === "bun-ts";
}

function readPackageRuntimeMode() {
  const packageJsonPath = resolve(__dirname, "../package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const runtimeMode = packageJson[candidateRuntimeModeField];
  return isCandidateRuntimeMode(runtimeMode) ? runtimeMode : "legacy-node";
}

function resolveCandidateRuntimeMode() {
  const runtimeModeFromEnvironment = process.env.LRS_CANDIDATE_RUNTIME_MODE;
  if (isCandidateRuntimeMode(runtimeModeFromEnvironment)) {
    return runtimeModeFromEnvironment;
  }

  return readPackageRuntimeMode();
}

(async function main() {
  const runtimeMode = resolveCandidateRuntimeMode();
  if (runtimeMode !== "bun-ts") {
    console.error(`Unsupported runtime mode for rewrite4: ${runtimeMode}. This candidate now requires bun-ts.`);
    process.exit(1);
    return;
  }

  if (!process.versions || !process.versions.bun) {
    console.error("bun-ts runtime mode requires Bun. Re-run this suite with the Bun candidate lane.");
    process.exit(1);
    return;
  }

  const modulePath = pathToFileURL(resolve(__dirname, "../bun-runtime/console-runner.ts")).href;
  const runtimeModule = await import(modulePath);
  const exitCode = await runtimeModule.main(process.argv.slice(2));
  process.exit(exitCode);
})().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
