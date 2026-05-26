import { describe, expect, test } from "bun:test";

import { createFromTemplate } from "../../src/describe-runtime/templates.ts";

describe("template fixture resolution", () => {
  test("loads shared fixtures for both versions", async () => {
    const v1Template = await createFromTemplate("v1_0_3", [{ verb: "{{verbs.default}}" }]);
    const v2Template = await createFromTemplate("v2_0", [{ verb: "{{verbs.default}}" }]);

    expect(v1Template).toEqual(v2Template);
    expect(v1Template.verb).toMatchObject({
      id: expect.any(String),
      display: expect.any(Object),
    });
  });

  test("keeps v2-only fixtures version-scoped", async () => {
    const v2Template = await createFromTemplate("v2_0", [{ context: "{{contexts.context_agents}}" }]);

    expect(v2Template.context).toMatchObject({
      contextAgents: expect.any(Array),
    });

    let errorMessage = "";

    try {
      await createFromTemplate("v1_0_3", [{ context: "{{contexts.context_agents}}" }]);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    expect(errorMessage).toMatch(/Template fixture not found/);
  });
});
