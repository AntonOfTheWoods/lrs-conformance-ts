import { AsyncLocalStorage } from "node:async_hooks";

export const captureOwnerHeaderName = "x-lrs-conformance-owner";

export type ExecutionPhase = "before" | "case";

export interface ActiveExecutionMetadata {
  casePath: string[] | null;
  hookTitle: string | null;
  phase: ExecutionPhase;
  suitePath: string[];
}

export interface CaptureExecutionMetadata extends ActiveExecutionMetadata {
  directory: string;
  ownerLabel: string;
  sourceFilePath: string | null;
  sourceSymbol: string | null;
  unitKey: string;
  version: string;
}

const executionMetadataStorage = new AsyncLocalStorage<ActiveExecutionMetadata>();

function clonePath(path: string[] | null): string[] | null {
  return path ? [...path] : null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isExecutionPhase(value: unknown): value is ExecutionPhase {
  return value === "before" || value === "case";
}

export function formatExecutionOwnerLabel(metadata: ActiveExecutionMetadata): string {
  if (metadata.phase === "before") {
    const hookSegment = metadata.hookTitle ? `[before] ${metadata.hookTitle}` : "[before]";
    return [...metadata.suitePath, hookSegment].join(" > ");
  }

  return (metadata.casePath ?? metadata.suitePath).join(" > ");
}

export function createCaptureExecutionMetadata(options: {
  directory: string;
  execution: ActiveExecutionMetadata;
  sourceFilePath: string | null;
  sourceSymbol: string | null;
  unitKey: string;
  version: string;
}): CaptureExecutionMetadata {
  return {
    casePath: clonePath(options.execution.casePath),
    directory: options.directory,
    hookTitle: options.execution.hookTitle,
    ownerLabel: formatExecutionOwnerLabel(options.execution),
    phase: options.execution.phase,
    sourceFilePath: options.sourceFilePath,
    sourceSymbol: options.sourceSymbol,
    suitePath: [...options.execution.suitePath],
    unitKey: options.unitKey,
    version: options.version,
  };
}

export function encodeCaptureExecutionMetadata(metadata: CaptureExecutionMetadata): string {
  return encodeURIComponent(JSON.stringify(metadata));
}

export function decodeCaptureExecutionMetadata(value: string | null): CaptureExecutionMetadata | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const runtime = parsed as Partial<CaptureExecutionMetadata>;
    if (
      typeof runtime.directory !== "string" ||
      typeof runtime.ownerLabel !== "string" ||
      typeof runtime.unitKey !== "string" ||
      typeof runtime.version !== "string" ||
      (typeof runtime.sourceFilePath !== "string" && runtime.sourceFilePath !== null) ||
      (typeof runtime.sourceSymbol !== "string" && runtime.sourceSymbol !== null) ||
      (typeof runtime.hookTitle !== "string" && runtime.hookTitle !== null) ||
      !isExecutionPhase(runtime.phase) ||
      !isStringArray(runtime.suitePath) ||
      (!isStringArray(runtime.casePath) && runtime.casePath !== null)
    ) {
      return null;
    }

    return {
      casePath: clonePath(runtime.casePath),
      directory: runtime.directory,
      hookTitle: runtime.hookTitle,
      ownerLabel: runtime.ownerLabel,
      phase: runtime.phase,
      sourceFilePath: runtime.sourceFilePath,
      sourceSymbol: runtime.sourceSymbol,
      suitePath: [...runtime.suitePath],
      unitKey: runtime.unitKey,
      version: runtime.version,
    };
  } catch {
    return null;
  }
}

export function decodeCaptureOwnerLabel(value: string | null): string | null {
  if (!value) {
    return value;
  }

  const metadata = decodeCaptureExecutionMetadata(value);
  if (metadata) {
    return metadata.ownerLabel;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getActiveExecutionMetadata(): ActiveExecutionMetadata | undefined {
  const metadata = executionMetadataStorage.getStore();
  if (!metadata) {
    return undefined;
  }

  return {
    casePath: clonePath(metadata.casePath),
    hookTitle: metadata.hookTitle,
    phase: metadata.phase,
    suitePath: [...metadata.suitePath],
  };
}

export function getActiveExecutionPath(): string[] | undefined {
  const metadata = getActiveExecutionMetadata();
  if (!metadata) {
    return undefined;
  }

  return metadata.phase === "before"
    ? [...metadata.suitePath, metadata.hookTitle ? `[before] ${metadata.hookTitle}` : "[before]"]
    : [...(metadata.casePath ?? metadata.suitePath)];
}

export function runWithExecutionMetadata<T>(metadata: ActiveExecutionMetadata, fn: () => T): T {
  return executionMetadataStorage.run(
    {
      casePath: clonePath(metadata.casePath),
      hookTitle: metadata.hookTitle,
      phase: metadata.phase,
      suitePath: [...metadata.suitePath],
    },
    fn,
  );
}

export function runWithExecutionPath<T>(path: string[], fn: () => T): T {
  const lastSegment = path.at(-1);
  if (typeof lastSegment === "string" && lastSegment.startsWith("[before] ")) {
    return runWithExecutionMetadata(
      {
        casePath: null,
        hookTitle: lastSegment.slice("[before] ".length),
        phase: "before",
        suitePath: path.slice(0, -1),
      },
      fn,
    );
  }

  return runWithExecutionMetadata(
    {
      casePath: [...path],
      hookTitle: null,
      phase: "case",
      suitePath: path.slice(0, -1),
    },
    fn,
  );
}
