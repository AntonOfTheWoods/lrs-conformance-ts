import { describe, expect, test } from "bun:test";

import {
  createLegacyTestObject,
  expandLegacyCasePayload,
  loadLegacyConfigFile,
  convertLegacyTemplates,
} from "../src/describe-runtime/legacy-config";
import { defineLegacyConfigSuites } from "../src/describe-runtime/register";

const formattingGroups = loadLegacyConfigFile("v2_0", "formatting.js");
const sampledFormattingGroups = formattingGroups.slice(0, 2);

describe("describe-runtime legacy config loader", () => {
  test("loads upstream formatting config groups with original titles", () => {
    expect(formattingGroups[0]?.name).toBe(
      'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
    );
    expect(formattingGroups[0]?.config[0]?.name).toBe('statement "actor" missing');
    expect(formattingGroups[1]?.name).toBe(
      'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
    );
  });

  test("expands template references using upstream fixture JSON", () => {
    const firstCase = formattingGroups[0]?.config[0];
    expect(firstCase?.templates).toBeDefined();

    const converted = convertLegacyTemplates("v2_0", firstCase?.templates ?? []);
    const expanded = createLegacyTestObject(converted) as {
      statement?: {
        actor?: unknown;
        verb?: { id?: string };
        object?: { id?: string };
      };
    };

    expect(expanded.statement?.actor).toBeUndefined();
    expect(expanded.statement?.verb?.id).toBe("http://adlnet.gov/expapi/verbs/attended");
    expect(expanded.statement?.object?.id).toBe("http://www.example.com/meetings/occurances/34534");
  });

  test("merges override objects like the upstream helper", () => {
    const nullOverrideCase = formattingGroups[3]?.config[0];
    expect(nullOverrideCase?.templates).toBeDefined();

    const expanded = expandLegacyCasePayload("v2_0", nullOverrideCase!) as {
      statement?: {
        actor?: { name?: string | null; mbox?: string };
      };
    };

    expect(expanded.statement?.actor?.mbox).toBe("mailto:xapi@adlnet.gov");
    expect(expanded.statement?.actor?.name).toBeNull();
  });
});

describe("describe-runtime registration", () => {
  defineLegacyConfigSuites(sampledFormattingGroups, ({ testCase }) => {
    const expanded = expandLegacyCasePayload("v2_0", testCase) as Record<string, unknown>;
    const rootKey = Object.keys(expanded)[0];

    expect(rootKey).toBe("statement");
  });
});
