import type { RuntimeNodeResult, RuntimeRunResult } from "./runtime.ts";

export interface RuntimeRunRecordFlags {
  endpoint?: string;
  basicAuth?: boolean;
  authUser?: string;
  oAuth1?: boolean;
  consumer_key?: string;
  grep?: string;
  unitKeys?: string[];
  optional?: string[];
}

export interface RuntimeRunRecordMetadata {
  name?: string | null;
  owner?: string | null;
  flags?: RuntimeRunRecordFlags;
  options?: Record<string, unknown>;
  lrsSettingsUUID?: string | null;
  rollupRule?: string;
  uuid?: string;
}

export interface RuntimeLogRecord {
  title: string;
  name: string;
  requirement: string;
  log: string;
  status: string;
  error?: string;
  tests: RuntimeLogRecord[];
}

export interface RuntimeRunRecord {
  name: string | null;
  owner: string | null;
  flags: RuntimeRunRecordFlags;
  options: Record<string, unknown>;
  lrsSettingsUUID: string | null;
  rollupRule: string;
  uuid: string;
  startTime: number;
  endTime: number;
  duration: number;
  state: RuntimeRunResult["state"];
  summary: {
    total: number;
    passed: number;
    failed: number;
    version?: string;
  };
  log: RuntimeLogRecord;
}

function toLogRecord(node: RuntimeNodeResult): RuntimeLogRecord {
  return {
    title: node.title,
    name: node.name,
    requirement: node.requirement,
    log: node.log.join(""),
    status: node.status,
    error: node.error,
    tests: node.children.map(toLogRecord),
  };
}

function createUuid(): string {
  return globalThis.crypto.randomUUID();
}

export function createRunRecord(
  runResult: RuntimeRunResult,
  metadata: RuntimeRunRecordMetadata = {},
): RuntimeRunRecord {
  return {
    name: metadata.name ?? null,
    owner: metadata.owner ?? null,
    flags: metadata.flags ?? {},
    options: metadata.options ?? {},
    lrsSettingsUUID: metadata.lrsSettingsUUID ?? null,
    rollupRule: metadata.rollupRule ?? "mustPassAll",
    uuid: metadata.uuid ?? createUuid(),
    startTime: runResult.startTime,
    endTime: runResult.endTime,
    duration: runResult.duration,
    state: runResult.state,
    summary: {
      total: runResult.summary.total,
      passed: runResult.summary.passed,
      failed: runResult.summary.failed,
      version: runResult.summary.version,
    },
    log: toLogRecord(runResult.root),
  };
}
