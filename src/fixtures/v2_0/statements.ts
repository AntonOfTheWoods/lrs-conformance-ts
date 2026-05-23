import type { JsonObject } from "../../domain/contracts";

export interface StatementFixture extends JsonObject {
  id: string;
  actor: JsonObject;
  verb: JsonObject;
  object: JsonObject;
  timestamp: string;
}

export interface FixtureTransform {
  operation: "set" | "remove";
  path: string[];
  value?: unknown;
}

export const defaultStatementFixture: StatementFixture = {
  id: "11111111-1111-4111-8111-111111111111",
  actor: {
    objectType: "Agent",
    mbox: "mailto:learner@example.test",
    name: "Learner Example",
  },
  verb: {
    id: "https://example.test/xapi/verbs/completed",
    display: {
      "en-US": "completed",
    },
  },
  object: {
    objectType: "Activity",
    id: "https://example.test/xapi/activities/first-proof-slice",
  },
  timestamp: "2026-05-23T12:00:00Z",
};

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function setAtPath(target: JsonObject, path: string[], value: unknown): void {
  const [head, ...rest] = path;
  if (!head) {
    return;
  }

  if (rest.length === 0) {
    target[head] = value;
    return;
  }

  const next = target[head];
  const child = typeof next === "object" && next !== null && !Array.isArray(next) ? (next as JsonObject) : {};
  target[head] = child;
  setAtPath(child, rest, value);
}

function removeAtPath(target: JsonObject, path: string[]): void {
  const [head, ...rest] = path;
  if (!head || !(head in target)) {
    return;
  }

  if (rest.length === 0) {
    delete target[head];
    return;
  }

  const next = target[head];
  if (typeof next !== "object" || next === null || Array.isArray(next)) {
    return;
  }

  removeAtPath(next as JsonObject, rest);
}

export function buildStatementFixture(transforms: FixtureTransform[] = []): StatementFixture {
  const next = cloneValue(defaultStatementFixture) as StatementFixture;

  for (const transform of transforms) {
    if (transform.operation === "remove") {
      removeAtPath(next, transform.path);
      continue;
    }

    setAtPath(next, transform.path, transform.value);
  }

  return next;
}
