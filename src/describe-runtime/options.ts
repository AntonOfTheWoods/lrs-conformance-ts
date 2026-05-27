import {
  defaultXapiVersion,
  getSpecFromFolder,
  resolveXapiVersionFolder,
  type SupportedXapiVersion,
} from "./spec-config.ts";
import { getMigrationLedgerUnitByUnitKey } from "./migration-ledger.ts";

export interface RunnerInputOptions {
  xapiVersion?: string;
  directory?: string[];
  unitKeys?: string[];
  optional?: string[];
  endpoint?: string;
  grep?: string;
  basicAuth?: boolean;
  authUser?: string;
  authPass?: string;
  oAuth1?: boolean;
  consumer_key?: string;
  consumer_secret?: string;
  token?: string;
  token_secret?: string;
  verifier?: string;
  request_token_path?: string;
  auth_token_path?: string;
  authorization_path?: string;
  bail?: boolean;
  errors?: boolean;
}

export interface NormalizedRunnerOptions {
  xapiVersion: SupportedXapiVersion;
  directory: string[];
  endpoint: string;
  grep?: string;
  unitKeys?: string[];
  optional?: string[];
  basicAuth: boolean;
  authUser?: string;
  authPass?: string;
  oAuth1: boolean;
  consumer_key?: string;
  consumer_secret?: string;
  token?: string;
  token_secret?: string;
  verifier?: string;
  request_token_path?: string;
  auth_token_path?: string;
  authorization_path?: string;
  bail: boolean;
  errors: boolean;
}

export class RunnerOptionsError extends Error {}

function isUriLike(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:.+/.test(value);
}

function normalizeOptionalDirectories(optional: string[] | undefined): string[] {
  if (!optional || optional.length === 0) {
    return [];
  }

  return [...optional];
}

function normalizeUnitKeys(unitKeys: string[] | undefined): string[] {
  if (!unitKeys || unitKeys.length === 0) {
    return [];
  }

  return [...new Set(unitKeys)];
}

function inferXapiVersionFromUnitKeys(unitKeys: string[]): SupportedXapiVersion | undefined {
  const versions = [
    ...new Set(unitKeys.map((unitKey) => getMigrationLedgerUnitByUnitKey(unitKey)?.version).filter(Boolean)),
  ];

  if (versions.length === 0) {
    return undefined;
  }

  if (versions.length > 1) {
    throw new RunnerOptionsError(
      `Multiple unit keys specified which refer to different versions of the xAPI spec: ${versions.join(" vs. ")}`,
    );
  }

  const version = versions[0];
  if (version !== "1.0.3" && version !== "2.0.0") {
    return undefined;
  }

  return version;
}

function inferDirectoriesFromUnitKeys(unitKeys: string[]): string[] {
  return [...new Set(unitKeys.map((unitKey) => getMigrationLedgerUnitByUnitKey(unitKey)?.directory).filter(Boolean))];
}

function inferXapiVersionFromDirectories(directories: string[]): SupportedXapiVersion {
  let matchedVersion: SupportedXapiVersion | undefined;

  for (const directory of directories) {
    const directoryVersion = getSpecFromFolder(directory);
    if (!directoryVersion) {
      continue;
    }

    if (!matchedVersion) {
      matchedVersion = directoryVersion;
      continue;
    }

    if (matchedVersion !== directoryVersion) {
      throw new RunnerOptionsError(
        `Multiple directories specified which refer to different versions of the xAPI spec: ${directoryVersion} vs. ${matchedVersion}`,
      );
    }
  }

  if (!matchedVersion) {
    throw new RunnerOptionsError(
      `Unable to determine which version of xAPI to test against with directories: ${directories.join(", ")}`,
    );
  }

  return matchedVersion;
}

export function normalizeRunnerOptions(input: RunnerInputOptions): NormalizedRunnerOptions {
  if (!input.endpoint) {
    throw new RunnerOptionsError("You must specify an endpoint (-e or --endpoint) for your LRS.");
  }

  if (!isUriLike(input.endpoint)) {
    throw new RunnerOptionsError(`Endpoint must be a URI: ${input.endpoint}`);
  }

  const directorySpecified = Array.isArray(input.directory) && input.directory.length > 0;
  const versionSpecified = typeof input.xapiVersion === "string" && input.xapiVersion.length > 0;
  const unitKeys = normalizeUnitKeys(input.unitKeys);
  const unitKeysSpecified = unitKeys.length > 0;

  if (directorySpecified && versionSpecified) {
    throw new RunnerOptionsError("Cannot specify both an xAPI Version and a Directory.");
  }

  const optionalDirectories = normalizeOptionalDirectories(input.optional);
  const selectedUnitVersion = inferXapiVersionFromUnitKeys(unitKeys);
  if (unitKeysSpecified) {
    for (const unitKey of unitKeys) {
      if (!getMigrationLedgerUnitByUnitKey(unitKey)) {
        throw new RunnerOptionsError(`Unknown migration unit key: ${unitKey}`);
      }
    }
  }

  let xapiVersion: SupportedXapiVersion;
  let directories: string[];

  if (versionSpecified) {
    const resolvedDirectory = resolveXapiVersionFolder(input.xapiVersion!);
    if (!resolvedDirectory) {
      throw new RunnerOptionsError(
        `Unknown version of the xAPI spec: ${input.xapiVersion}. Unable to find appropriate test suite.`,
      );
    }

    xapiVersion = resolvedDirectory === "v1_0_3" ? "1.0.3" : "2.0.0";
    directories = unitKeysSpecified ? inferDirectoriesFromUnitKeys(unitKeys) : [resolvedDirectory];
  } else if (directorySpecified) {
    directories = [...input.directory!];
    xapiVersion = inferXapiVersionFromDirectories(directories);
  } else if (unitKeysSpecified) {
    if (!selectedUnitVersion) {
      throw new RunnerOptionsError(
        `Unable to determine which version of xAPI to test against with unit keys: ${unitKeys.join(", ")}`,
      );
    }

    xapiVersion = selectedUnitVersion;
    directories = inferDirectoriesFromUnitKeys(unitKeys);
  } else {
    xapiVersion = defaultXapiVersion;
    directories = [resolveXapiVersionFolder(defaultXapiVersion)!];
  }

  if (selectedUnitVersion && selectedUnitVersion !== xapiVersion) {
    throw new RunnerOptionsError(
      `Selected unit keys target xAPI ${selectedUnitVersion}, but the current run is configured for ${xapiVersion}.`,
    );
  }

  if (unitKeysSpecified) {
    const selectedDirectories = new Set(directories);
    const missingDirectories = inferDirectoriesFromUnitKeys(unitKeys).filter(
      (directory) => !selectedDirectories.has(directory),
    );
    if (missingDirectories.length > 0) {
      throw new RunnerOptionsError(
        `Selected unit keys require directories that were not included in this run: ${missingDirectories.join(", ")}`,
      );
    }
  }

  return {
    xapiVersion,
    directory: [...optionalDirectories, ...directories],
    endpoint: input.endpoint,
    grep: input.grep,
    unitKeys: unitKeysSpecified ? unitKeys : undefined,
    optional: optionalDirectories.length > 0 ? optionalDirectories : undefined,
    basicAuth: input.basicAuth ?? false,
    authUser: input.authUser,
    authPass: input.authPass,
    oAuth1: input.oAuth1 ?? false,
    consumer_key: input.consumer_key,
    consumer_secret: input.consumer_secret,
    token: input.token,
    token_secret: input.token_secret,
    verifier: input.verifier,
    request_token_path: input.request_token_path,
    auth_token_path: input.auth_token_path,
    authorization_path: input.authorization_path,
    bail: input.bail ?? false,
    errors: input.errors ?? false,
  };
}
