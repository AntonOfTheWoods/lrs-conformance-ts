import { describe, expect, test } from "bun:test";

import {
  compareParityRunOutputs,
  compareParityTrees,
  compareRuntimeRunOutputs,
  normalizeParityTree,
} from "../comparison";

describe("parity comparison normalizer", () => {
  test("normalizes runtime-style trees into canonical case paths", () => {
    const tree = {
      id: "run.1.0.3",
      title: "xAPI 1.0.3",
      status: "passed",
      children: [
        {
          id: "suite.statement",
          title: "Statement Resource",
          status: "passed",
          children: [
            {
              id: "case.statement.post",
              title: "accepts statement POST",
              status: "passed",
              log: [],
            },
          ],
          log: [],
        },
      ],
      log: [],
    };

    const records = normalizeParityTree(tree, "runtime", { includeRoot: false });

    expect(records).toEqual([
      {
        source: "runtime",
        kind: "suite",
        key: "statement resource",
        path: ["Statement Resource"],
        title: "Statement Resource",
        status: "passed",
        id: "suite.statement",
        requirement: undefined,
        error: undefined,
      },
      {
        source: "runtime",
        kind: "case",
        key: "statement resource / accepts statement post",
        path: ["Statement Resource", "accepts statement POST"],
        title: "accepts statement POST",
        status: "passed",
        id: "case.statement.post",
        requirement: undefined,
        error: undefined,
      },
    ]);
  });

  test("compares runtime and upstream leaf outcomes by canonical path", () => {
    const runtimeTree = {
      id: "run.1.0.3",
      title: "xAPI 1.0.3",
      status: "passed",
      children: [
        {
          id: "suite.statement",
          title: "Statement Resource",
          status: "passed",
          children: [
            {
              id: "case.statement.post",
              title: "accepts statement POST",
              status: "passed",
              log: [],
            },
          ],
          log: [],
        },
      ],
      log: [],
    };

    const upstreamTree = {
      title: "Statement Resource",
      name: "Statement Resource",
      requirement: "4.1.6.1 Statement Resource",
      status: "passed",
      tests: [
        {
          title: "accepts statement POST",
          name: "accepts statement POST",
          requirement: "4.1.6.1 Statement Resource",
          status: "passed",
          tests: [],
        },
      ],
    };

    const comparison = compareParityTrees(runtimeTree, upstreamTree, {
      leftIncludeRoot: false,
      rightIncludeRoot: true,
    });

    expect(comparison.matched).toHaveLength(1);
    expect(comparison.statusMismatches).toHaveLength(0);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(0);
    expect(comparison.matched[0]).toEqual({
      key: "statement resource / accepts statement post",
      left: {
        source: "runtime",
        kind: "case",
        key: "statement resource / accepts statement post",
        path: ["Statement Resource", "accepts statement POST"],
        title: "accepts statement POST",
        status: "passed",
        id: "case.statement.post",
        requirement: undefined,
        error: undefined,
      },
      right: {
        source: "upstream",
        kind: "case",
        key: "statement resource / accepts statement post",
        path: ["Statement Resource", "accepts statement POST"],
        title: "accepts statement POST",
        status: "passed",
        id: undefined,
        requirement: "4.1.6.1 Statement Resource",
        error: undefined,
      },
    });
  });

  test("flags divergent outcomes and unmatched leaves", () => {
    const leftTree = {
      title: "Statement Resource",
      status: "passed",
      tests: [
        {
          title: "accepts statement POST",
          status: "passed",
          tests: [],
        },
      ],
    };

    const rightTree = {
      title: "Statement Resource",
      status: "passed",
      tests: [
        {
          title: "accepts statement POST",
          status: "failed",
          tests: [],
        },
        {
          title: "rejects bad statement POST",
          status: "passed",
          tests: [],
        },
      ],
    };

    const comparison = compareParityTrees(leftTree, rightTree, {
      leftIncludeRoot: true,
      rightIncludeRoot: true,
    });

    expect(comparison.statusMismatches).toHaveLength(1);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(1);
    const [unmatchedRecord] = comparison.rightOnly;
    expect(unmatchedRecord).toBeDefined();
    expect(unmatchedRecord?.key).toBe("statement resource / rejects bad statement post");
  });

  test("compares actual runner-shaped outputs through the runtime adapters", () => {
    const runtimeRun = {
      root: {
        id: "run.1.0.3",
        title: "xAPI 1.0.3",
        status: "passed",
        children: [
          {
            id: "suite.statement",
            title: "Statement Resource",
            status: "passed",
            children: [
              {
                id: "case.statement.post",
                title: "accepts statement POST",
                status: "passed",
                log: [],
              },
            ],
            log: [],
          },
        ],
        log: [],
      },
    };

    const upstreamRecord = {
      log: {
        title: "Statement Resource",
        name: "Statement Resource",
        status: "passed",
        tests: [
          {
            title: "accepts statement POST",
            name: "accepts statement POST",
            status: "passed",
            tests: [],
          },
        ],
      },
    };

    const comparison = compareParityRunOutputs(runtimeRun, upstreamRecord);

    expect(comparison.matched).toHaveLength(1);
    expect(comparison.statusMismatches).toHaveLength(0);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(0);
  });

  test("compares two runtime run outputs directly for saved artifact comparison", () => {
    const leftRun = {
      root: {
        id: "run.2.0.0",
        title: "xAPI 2.0.0",
        status: "passed",
        children: [
          {
            id: "suite.statement",
            title: "Statement Resource",
            status: "passed",
            children: [
              {
                id: "case.statement.post",
                title: "accepts statement POST",
                status: "passed",
                log: [],
              },
            ],
            log: [],
          },
        ],
        log: [],
      },
    };

    const rightRun = {
      root: {
        id: "run.1.0.3",
        title: "xAPI 1.0.3",
        status: "passed",
        children: [
          {
            id: "suite.statement",
            title: "Statement Resource",
            status: "passed",
            children: [
              {
                id: "case.statement.post",
                title: "accepts statement POST",
                status: "passed",
                log: [],
              },
            ],
            log: [],
          },
        ],
        log: [],
      },
    };

    const comparison = compareRuntimeRunOutputs(leftRun, rightRun);

    expect(comparison.matched).toHaveLength(1);
    expect(comparison.statusMismatches).toHaveLength(0);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(0);
  });

  test("unwraps exported run payload wrappers", () => {
    const leftExported = {
      generatedAt: "2026-05-24T00:00:00.000Z",
      run: {
        id: "metadata",
        root: {
          id: "run.2.0.0",
          title: "xAPI 2.0.0",
          status: "passed",
          children: [
            {
              id: "suite.statement",
              title: "Statement Resource",
              status: "passed",
              children: [
                {
                  id: "case.statement.post",
                  title: "accepts statement POST",
                  status: "passed",
                  log: [],
                },
              ],
              log: [],
            },
          ],
          log: [],
        },
      },
    };

    const rightExported = {
      run: {
        root: {
          id: "run.1.0.3",
          title: "xAPI 1.0.3",
          status: "passed",
          children: [
            {
              id: "suite.statement",
              title: "Statement Resource",
              status: "passed",
              children: [
                {
                  id: "case.statement.post",
                  title: "accepts statement POST",
                  status: "passed",
                  log: [],
                },
              ],
              log: [],
            },
          ],
          log: [],
        },
      },
    };

    const comparison = compareRuntimeRunOutputs(leftExported, rightExported);

    expect(comparison.matched).toHaveLength(1);
    expect(comparison.statusMismatches).toHaveLength(0);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(0);
  });
});
