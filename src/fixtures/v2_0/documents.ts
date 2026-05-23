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

export interface ActivityProfileDocumentFixture extends JsonObject {
  summary: string;
  metadata: {
    audience: string;
    level: string;
  };
}

export interface ActivityProfileIdentityFixture extends Record<string, string> {
  activityId: string;
  profileId: string;
}

export interface AgentProfileDocumentFixture extends JsonObject {
  preference: string;
  notifications: {
    email: boolean;
    digest: string;
  };
}

export interface AgentProfileIdentityFixture extends Record<string, string> {
  agent: string;
  profileId: string;
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

export const defaultActivityProfileDocumentFixture: ActivityProfileDocumentFixture = {
  summary: "activity-profile-proof",
  metadata: {
    audience: "qa",
    level: "proof",
  },
};

export const defaultActivityProfileIdentityFixture: ActivityProfileIdentityFixture = {
  activityId: "https://example.test/xapi/activities/profile-proof-slice",
  profileId: "proof-activity-profile",
};

export const defaultAgentProfileDocumentFixture: AgentProfileDocumentFixture = {
  preference: "compact",
  notifications: {
    email: true,
    digest: "daily",
  },
};

export const defaultAgentProfileIdentityFixture: AgentProfileIdentityFixture = {
  agent: JSON.stringify(defaultStateAgent),
  profileId: "proof-agent-profile",
};

export function buildActivityStateDocumentFixture(): ActivityStateDocumentFixture {
  return structuredClone(defaultActivityStateDocumentFixture) as ActivityStateDocumentFixture;
}

export function buildActivityProfileDocumentFixture(): ActivityProfileDocumentFixture {
  return structuredClone(defaultActivityProfileDocumentFixture) as ActivityProfileDocumentFixture;
}

export function buildAgentProfileDocumentFixture(): AgentProfileDocumentFixture {
  return structuredClone(defaultAgentProfileDocumentFixture) as AgentProfileDocumentFixture;
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

export function buildActivityProfileIdentityFixture(
  overrides: Partial<ActivityProfileIdentityFixture> = {},
): ActivityProfileIdentityFixture {
  return {
    activityId: overrides.activityId ?? defaultActivityProfileIdentityFixture.activityId,
    profileId: overrides.profileId ?? defaultActivityProfileIdentityFixture.profileId,
  };
}

export function buildAgentProfileIdentityFixture(
  overrides: Partial<AgentProfileIdentityFixture> = {},
): AgentProfileIdentityFixture {
  return {
    agent: overrides.agent ?? defaultAgentProfileIdentityFixture.agent,
    profileId: overrides.profileId ?? defaultAgentProfileIdentityFixture.profileId,
  };
}
