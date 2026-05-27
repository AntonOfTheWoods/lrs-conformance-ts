import { AsyncLocalStorage } from "node:async_hooks";

export const captureOwnerHeaderName = "x-lrs-conformance-owner";

const executionPathStorage = new AsyncLocalStorage<string[]>();

export function getActiveExecutionPath(): string[] | undefined {
  const path = executionPathStorage.getStore();
  return path ? [...path] : undefined;
}

export function runWithExecutionPath<T>(path: string[], fn: () => T): T {
  return executionPathStorage.run([...path], fn);
}
