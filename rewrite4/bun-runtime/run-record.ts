export interface RuntimeRunRecordFlags {
  endpoint?: string;
  basicAuth?: boolean;
  authUser?: string;
  oAuth1?: boolean;
  consumer_key?: string;
  grep?: string;
  optional?: string[];
  file?: string[];
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
  state: string;
  summary: {
    total: number | null;
    passed: number | null;
    failed: number | null;
    version?: string;
  };
  log?: RuntimeLogRecord;
}

export type SerializableRunRecord = Omit<RuntimeRunRecord, "log"> & { log?: RuntimeLogRecord };

export function filterFailedLogRecord(log: RuntimeLogRecord | undefined): RuntimeLogRecord | undefined {
  if (!log || log.status !== "failed") {
    return undefined;
  }

  return {
    ...log,
    tests: log.tests.map(filterFailedLogRecord).filter((child): child is RuntimeLogRecord => Boolean(child)),
  };
}

export function createOutputRunRecord(record: RuntimeRunRecord, errorsOnly: boolean): SerializableRunRecord {
  if (!errorsOnly) {
    return record;
  }

  return {
    ...record,
    log: filterFailedLogRecord(record.log),
  };
}
