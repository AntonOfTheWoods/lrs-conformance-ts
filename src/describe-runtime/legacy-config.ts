import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { runInNewContext } from "node:vm";

import { resolveLegacyConfigRoot, resolveLegacyTemplateRoot, type LegacyVersionFolder } from "./upstream";

export interface LegacyConfigCase {
  name: string;
  templates?: Array<Record<string, unknown>>;
  json?: unknown;
  expect?: unknown[];
}

export interface LegacyConfigGroup {
  name: string;
  config: LegacyConfigCase[];
}

type LegacyConfigModule = {
  config?: () => unknown;
};

type LegacyTemplateMapping = Record<string, Record<string, unknown>>;

const templateMapCache = new Map<LegacyVersionFolder, LegacyTemplateMapping>();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function loadLegacyConfigModule(filePath: string): LegacyConfigModule {
  const source = readFileSync(filePath, "utf8");
  const module = { exports: {} as LegacyConfigModule };
  const helperStub = new Proxy(
    {
      generateUUID: () => "00000000-0000-4000-8000-000000000000",
    },
    {
      get(target, property) {
        if (typeof property === "string" && property in target) {
          return target[property as keyof typeof target];
        }

        throw new Error(`Unsupported helper usage while evaluating ${basename(filePath)}: ${String(property)}`);
      },
    },
  );

  const localRequire = (specifier: string) => {
    if (specifier.endsWith("helper.js") || specifier.endsWith("helper")) {
      return helperStub;
    }

    throw new Error(`Unsupported legacy config require in ${basename(filePath)}: ${specifier}`);
  };

  runInNewContext(source, { module, require: localRequire }, { filename: filePath });

  return module.exports;
}

function assertLegacyConfigGroups(value: unknown, fileName: string): LegacyConfigGroup[] {
  if (!Array.isArray(value)) {
    throw new Error(`Legacy config ${fileName} did not return an array.`);
  }

  return value.map((entry, index) => {
    if (!isPlainObject(entry) || typeof entry.name !== "string" || !Array.isArray(entry.config)) {
      throw new Error(`Legacy config ${fileName} has invalid group shape at index ${index}.`);
    }

    return {
      name: entry.name,
      config: entry.config.map((testCase, caseIndex) => {
        if (!isPlainObject(testCase) || typeof testCase.name !== "string") {
          throw new Error(`Legacy config ${fileName} has invalid case shape at ${index}:${caseIndex}.`);
        }

        return cloneValue({
          name: testCase.name,
          templates: Array.isArray(testCase.templates)
            ? (testCase.templates as Array<Record<string, unknown>>)
            : undefined,
          json: testCase.json,
          expect: Array.isArray(testCase.expect) ? testCase.expect : undefined,
        });
      }),
    };
  });
}

function buildTemplateMap(version: LegacyVersionFolder): LegacyTemplateMapping {
  const templateRoot = resolveLegacyTemplateRoot(version);
  const mapping: LegacyTemplateMapping = {};

  for (const folder of readdirSync(templateRoot, { withFileTypes: true })) {
    if (!folder.isDirectory()) {
      continue;
    }

    const folderPath = join(templateRoot, folder.name);
    const fileMapping: Record<string, unknown> = {};

    for (const file of readdirSync(folderPath, { withFileTypes: true })) {
      if (!file.isFile() || !file.name.endsWith(".json")) {
        continue;
      }

      const filePath = join(folderPath, file.name);
      const key = file.name.slice(0, -".json".length);
      fileMapping[key] = JSON.parse(readFileSync(filePath, "utf8"));
    }

    mapping[folder.name] = fileMapping;
  }

  return mapping;
}

function getTemplateMap(version: LegacyVersionFolder): LegacyTemplateMapping {
  const cached = templateMapCache.get(version);
  if (cached) {
    return cached;
  }

  const mapping = buildTemplateMap(version);
  templateMapCache.set(version, mapping);
  return mapping;
}

function resolveTemplateReference(version: LegacyVersionFolder, reference: string): unknown {
  const mapping = getTemplateMap(version);
  const cleanReference = reference.slice(2, -2);
  const segments = cleanReference.split(".");

  let current: unknown = mapping;
  for (const segment of segments) {
    if (!isPlainObject(current) || !(segment in current)) {
      throw new Error(`Not mapped: ${reference}`);
    }

    current = current[segment];
  }

  return cloneValue(current);
}

function mergeDeep(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      mergeDeep(targetValue, cloneValue(sourceValue));
      continue;
    }

    target[key] = cloneValue(sourceValue);
  }
}

export function loadLegacyConfigFile(version: LegacyVersionFolder, fileName: string): LegacyConfigGroup[] {
  const configRoot = resolveLegacyConfigRoot(version);
  const filePath = join(configRoot, fileName);

  if (!existsSync(filePath)) {
    throw new Error(`Invalid configuration "missing name": ${fileName}`);
  }

  const configModule = loadLegacyConfigModule(filePath);
  if (typeof configModule.config !== "function") {
    throw new Error(`Legacy config ${fileName} does not export config().`);
  }

  return assertLegacyConfigGroups(configModule.config(), fileName);
}

export function convertLegacyTemplates(
  version: LegacyVersionFolder,
  templates: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return templates.map((item) => {
    const key = Object.keys(item)[0];
    if (!key) {
      return cloneValue(item);
    }

    const value = item[key];
    if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
      return {
        [key]: resolveTemplateReference(version, value),
      };
    }

    return cloneValue(item);
  });
}

export function createLegacyTestObject(array: Array<Record<string, unknown>>): Record<string, unknown> {
  const reversed = array.map((entry) => cloneValue(entry)).reverse();
  let from: Record<string, unknown> = {};

  reversed.forEach((to, index) => {
    if (index === 0) {
      from = to;
      return;
    }

    const toKey = to[Object.keys(to)[0] ?? ""];
    if (!isPlainObject(toKey)) {
      throw new Error("Legacy template merge expects object values at each merge step.");
    }

    mergeDeep(toKey, from);
    from = to;
  });

  return from;
}

export function expandLegacyCasePayload(version: LegacyVersionFolder, legacyCase: LegacyConfigCase): unknown {
  if (legacyCase.templates) {
    return createLegacyTestObject(convertLegacyTemplates(version, legacyCase.templates));
  }

  if (legacyCase.json !== undefined) {
    return cloneValue(legacyCase.json);
  }

  throw new Error(`Invalid legacy case: ${legacyCase.name}`);
}

export function resolveLegacyCaseRequestBody(version: LegacyVersionFolder, legacyCase: LegacyConfigCase): unknown {
  if (legacyCase.templates) {
    const expanded = expandLegacyCasePayload(version, legacyCase);
    if (!isPlainObject(expanded)) {
      throw new Error(`Legacy template case did not expand to an object: ${legacyCase.name}`);
    }

    const keys = Object.keys(expanded);
    if (keys.length !== 1) {
      throw new Error(`Legacy template case expected exactly one root key: ${legacyCase.name}`);
    }

    return cloneValue(expanded[keys[0]!] as unknown);
  }

  if (legacyCase.json !== undefined) {
    return cloneValue(legacyCase.json);
  }

  throw new Error(`Invalid legacy case: ${legacyCase.name}`);
}
