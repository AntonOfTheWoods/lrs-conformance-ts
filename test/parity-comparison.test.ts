import { describe, expect, test } from "bun:test";

import { compareParityRunOutputs, compareParityTrees, normalizeParityTree } from "../src/parity/comparison";

describe("parity comparison normalizer", () => {
  test("normalizes rewrite-style trees into canonical case paths", () => {
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

    const records = normalizeParityTree(tree, "rewrite", { includeRoot: false });

    expect(records).toEqual([
      {
        source: "rewrite",
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
        source: "rewrite",
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

  test("compares rewrite and upstream leaf outcomes by canonical path", () => {
    const rewriteTree = {
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

    const comparison = compareParityTrees(rewriteTree, upstreamTree, {
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
        source: "rewrite",
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
    const rewriteRun = {
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

    const comparison = compareParityRunOutputs(rewriteRun, upstreamRecord);

    expect(comparison.matched).toHaveLength(1);
    expect(comparison.statusMismatches).toHaveLength(0);
    expect(comparison.leftOnly).toHaveLength(0);
    expect(comparison.rightOnly).toHaveLength(0);
  });
});
