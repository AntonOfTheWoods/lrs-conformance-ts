import { describe, expect, test } from "bun:test";

import { createRunRecord } from "../../src/describe-runtime/run-record.ts";
import { createDescribeRuntime } from "../../src/describe-runtime/runtime.ts";

describe("describe runtime core", () => {
  test("runs nested suites with before hooks and mixed callback or async tests", async () => {
    const steps: string[] = [];
    const runtime = createDescribeRuntime({
      rootTitle: "xAPI 2.0.0",
      version: "2.0.0",
    });

    runtime.before(async () => {
      steps.push("root before");
    });

    runtime.describe("Statement Resource (4.1.6.1 Statement Resource)", () => {
      runtime.before("set up suite", (done) => {
        steps.push("suite before");
        done();
      });

      runtime.it("accepts statement POST", (done) => {
        steps.push("post");
        done();
      });

      runtime.it("accepts statement GET", async () => {
        steps.push("get");
      });
    });

    const result = await runtime.run();

    expect(steps).toEqual(["root before", "suite before", "post", "get"]);
    expect(result.summary).toEqual({
      total: 2,
      passed: 2,
      failed: 0,
      skipped: 0,
      cancelled: 0,
      version: "2.0.0",
    });
    expect(result.root).toEqual({
      kind: "suite",
      title: "xAPI 2.0.0",
      name: "xAPI 2.0.0",
      requirement: "",
      status: "passed",
      error: undefined,
      log: [],
      children: [
        {
          kind: "suite",
          title: "Statement Resource (4.1.6.1 Statement Resource)",
          name: "Statement Resource",
          requirement: "4.1.6.1 Statement Resource",
          status: "passed",
          error: undefined,
          log: [],
          children: [
            {
              kind: "case",
              title: "accepts statement POST",
              name: "accepts statement POST",
              requirement: "",
              status: "passed",
              error: undefined,
              log: [],
              children: [],
            },
            {
              kind: "case",
              title: "accepts statement GET",
              name: "accepts statement GET",
              requirement: "",
              status: "passed",
              error: undefined,
              log: [],
              children: [],
            },
          ],
        },
      ],
    });
  });

  test("cancels remaining matching tests after a failure when bail is enabled", async () => {
    const steps: string[] = [];
    const runtime = createDescribeRuntime({
      rootTitle: "xAPI 1.0.3",
      bail: true,
    });

    runtime.describe("Formatting Requirements", () => {
      runtime.it("first failure", () => {
        steps.push("first");
        throw new Error("boom");
      });

      runtime.it("second test", () => {
        steps.push("second");
      });
    });

    const result = await runtime.run();

    expect(steps).toEqual(["first"]);
    expect(result.summary).toEqual({
      total: 2,
      passed: 0,
      failed: 1,
      skipped: 0,
      cancelled: 1,
      version: undefined,
    });
    expect(result.root.children[0]).toEqual({
      kind: "suite",
      title: "Formatting Requirements",
      name: "Formatting Requirements",
      requirement: "",
      status: "failed",
      error: undefined,
      log: [],
      children: [
        {
          kind: "case",
          title: "first failure",
          name: "first failure",
          requirement: "",
          status: "failed",
          error: "Error: boom",
          log: [],
          children: [],
        },
        {
          kind: "case",
          title: "second test",
          name: "second test",
          requirement: "",
          status: "cancelled",
          error: undefined,
          log: [],
          children: [],
        },
      ],
    });
  });

  test("counts a failing before hook as a failed run and cancels descendant cases", async () => {
    const steps: string[] = [];
    const runtime = createDescribeRuntime({
      rootTitle: "xAPI 2.0.0",
      version: "2.0.0",
    });

    runtime.before(() => {
      steps.push("root before");
      throw new Error("setup failed");
    });

    runtime.describe("Formatting Requirements", () => {
      runtime.it("first test", () => {
        steps.push("first test");
      });

      runtime.it("second test", () => {
        steps.push("second test");
      });
    });

    const result = await runtime.run();

    expect(steps).toEqual(["root before"]);
    expect(result.summary).toEqual({
      total: 2,
      passed: 0,
      failed: 1,
      skipped: 0,
      cancelled: 2,
      version: "2.0.0",
    });
    expect(result.root).toEqual({
      kind: "suite",
      title: "xAPI 2.0.0",
      name: "xAPI 2.0.0",
      requirement: "",
      status: "failed",
      error: "Error: setup failed",
      log: [],
      children: [
        {
          kind: "suite",
          title: "Formatting Requirements",
          name: "Formatting Requirements",
          requirement: "",
          status: "cancelled",
          error: undefined,
          log: [],
          children: [
            {
              kind: "case",
              title: "first test",
              name: "first test",
              requirement: "",
              status: "cancelled",
              error: undefined,
              log: [],
              children: [],
            },
            {
              kind: "case",
              title: "second test",
              name: "second test",
              requirement: "",
              status: "cancelled",
              error: undefined,
              log: [],
              children: [],
            },
          ],
        },
      ],
    });
  });

  test("filters registered cases by grep against full titles", async () => {
    const steps: string[] = [];
    const runtime = createDescribeRuntime({
      rootTitle: "xAPI 2.0.0",
      grep: /statement resource accepts statement GET/i,
    });

    runtime.describe("Statement Resource", () => {
      runtime.it("accepts statement POST", () => {
        steps.push("post");
      });

      runtime.it("accepts statement GET", () => {
        steps.push("get");
      });
    });

    const result = await runtime.run();

    expect(steps).toEqual(["get"]);
    expect(result.summary).toEqual({
      total: 1,
      passed: 1,
      failed: 0,
      skipped: 0,
      cancelled: 0,
      version: undefined,
    });
    expect(result.root.children[0]?.children).toEqual([
      {
        kind: "case",
        title: "accepts statement GET",
        name: "accepts statement GET",
        requirement: "",
        status: "passed",
        error: undefined,
        log: [],
        children: [],
      },
    ]);
  });

  test("adapts runtime results into the upstream-style run record shape", async () => {
    const timestamps = [100, 130];
    const runtime = createDescribeRuntime({
      rootTitle: "xAPI 2.0.0",
      version: "2.0.0",
      now: () => timestamps.shift() ?? 130,
    });

    runtime.describe("Statement Resource (4.1.6.1 Statement Resource)", () => {
      runtime.it("accepts statement POST", () => {});
    });

    const result = await runtime.run();
    const record = createRunRecord(result, {
      name: "console",
      owner: "Admin",
      flags: {
        endpoint: "http://localhost:8000/xapi",
        basicAuth: true,
        authUser: "admin",
        oAuth1: false,
        consumer_key: "consumer-key",
        grep: "Statement",
        optional: ["Parameters"],
      },
      options: {
        errors: true,
      },
      lrsSettingsUUID: "settings-1",
      rollupRule: "mustPassAll",
      uuid: "run-123",
    });

    expect(record).toEqual({
      name: "console",
      owner: "Admin",
      flags: {
        endpoint: "http://localhost:8000/xapi",
        basicAuth: true,
        authUser: "admin",
        oAuth1: false,
        consumer_key: "consumer-key",
        grep: "Statement",
        optional: ["Parameters"],
      },
      options: {
        errors: true,
      },
      lrsSettingsUUID: "settings-1",
      rollupRule: "mustPassAll",
      uuid: "run-123",
      startTime: 100,
      endTime: 130,
      duration: 30,
      state: "finished",
      summary: {
        total: 1,
        passed: 1,
        failed: 0,
        version: "2.0.0",
      },
      log: {
        title: "xAPI 2.0.0",
        name: "xAPI 2.0.0",
        requirement: "",
        log: "",
        status: "passed",
        error: undefined,
        tests: [
          {
            title: "Statement Resource (4.1.6.1 Statement Resource)",
            name: "Statement Resource",
            requirement: "4.1.6.1 Statement Resource",
            log: "",
            status: "passed",
            error: undefined,
            tests: [
              {
                title: "accepts statement POST",
                name: "accepts statement POST",
                requirement: "",
                log: "",
                status: "passed",
                error: undefined,
                tests: [],
              },
            ],
          },
        ],
      },
    });
  });
});
