import type { JsonObject } from "../../domain/contracts";

export interface ActivityStateDocumentFixture extends JsonObject {
  bookmark: string;
  progress: {
    attempts: number;
    complete: boolean;
  };
  context: {
    location: string;
  };
}

export interface ActivityStateIdentityFixture extends Record<string, string> {
  activityId: string;
  agent: string;
  stateId: string;
}

const defaultStateAgent = {
  objectType: "Agent",
  mbox: "mailto:learner@example.test",
  name: "Learner Example",
};

export const defaultActivityStateDocumentFixture: ActivityStateDocumentFixture = {
  bookmark: "chapter-5",
  progress: {
    attempts: 2,
    complete: true,
  },
  context: {
    location: "lab-1",
  },
};

export const defaultActivityStateIdentityFixture: ActivityStateIdentityFixture = {
  activityId: "https://example.test/xapi/activities/state-proof-slice",
  agent: JSON.stringify(defaultStateAgent),
  stateId: "proof-state-document",
};

export function buildActivityStateDocumentFixture(): ActivityStateDocumentFixture {
  return structuredClone(defaultActivityStateDocumentFixture) as ActivityStateDocumentFixture;
}

export function buildActivityStateIdentityFixture(
  overrides: Partial<ActivityStateIdentityFixture> = {},
): ActivityStateIdentityFixture {
  return {
    activityId: overrides.activityId ?? defaultActivityStateIdentityFixture.activityId,
    agent: overrides.agent ?? defaultActivityStateIdentityFixture.agent,
    stateId: overrides.stateId ?? defaultActivityStateIdentityFixture.stateId,
  };
}
