import { existsSync } from "node:fs";
import { resolve } from "node:path";

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type TemplateLayer = Record<string, JsonValue>;

const templateReferencePattern = /^\{\{([a-z0-9_]+)\.([a-z0-9_]+)\}\}$/i;

function getFixturesRoot(): string {
  return resolve(import.meta.dir, "..", "fixtures");
}

function getTemplatePathCandidates(directory: string, group: string, name: string): string[] {
  return [directory, "shared"].map((segment) =>
    resolve(getFixturesRoot(), segment, "templates", group, `${name}.json`),
  );
}

function cloneJsonValue<T extends JsonValue>(value: T): T {
  return structuredClone(value);
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSingleEntry(layer: TemplateLayer): [string, JsonValue] {
  const entries = Object.entries(layer);
  const entry = entries[0];
  if (!entry || entries.length !== 1) {
    throw new Error("Each template layer must contain exactly one top-level key.");
  }

  return entry;
}

function parseTemplateReference(value: string): { group: string; name: string } | undefined {
  const match = templateReferencePattern.exec(value);
  if (!match) {
    return undefined;
  }

  return {
    group: match[1] ?? "",
    name: match[2] ?? "",
  };
}

function resolveTemplatePath(
  directory: string,
  group: string,
  name: string,
  pathExists: (path: string) => boolean = existsSync,
): string {
  const candidatePaths = getTemplatePathCandidates(directory, group, name);

  for (const candidatePath of candidatePaths) {
    if (pathExists(candidatePath)) {
      return candidatePath;
    }
  }

  return candidatePaths[0] ?? "";
}

async function loadTemplateReference(directory: string, value: string): Promise<JsonValue> {
  const reference = parseTemplateReference(value);
  if (!reference) {
    throw new Error(`Template value is not a valid reference: ${value}`);
  }

  const templatePath = resolveTemplatePath(directory, reference.group, reference.name);
  if (!existsSync(templatePath)) {
    throw new Error(`Template fixture not found: ${templatePath}`);
  }

  return (await Bun.file(templatePath).json()) as JsonValue;
}

function deepMergeJson(target: JsonValue, source: JsonValue): JsonValue {
  if (isJsonObject(target) && isJsonObject(source)) {
    const mergedTarget = cloneJsonValue(target);
    for (const [key, sourceValue] of Object.entries(source)) {
      const existingValue = mergedTarget[key];
      mergedTarget[key] =
        typeof existingValue === "undefined" ? cloneJsonValue(sourceValue) : deepMergeJson(existingValue, sourceValue);
    }

    return mergedTarget;
  }

  return cloneJsonValue(source);
}

export async function convertTemplateLayers(directory: string, layers: TemplateLayer[]): Promise<TemplateLayer[]> {
  const convertedLayers: TemplateLayer[] = [];

  for (const layer of layers) {
    const [key, value] = getSingleEntry(layer);
    if (typeof value === "string") {
      const reference = parseTemplateReference(value);
      if (reference) {
        convertedLayers.push({
          [key]: await loadTemplateReference(directory, value),
        });
        continue;
      }
    }

    convertedLayers.push({
      [key]: cloneJsonValue(value),
    });
  }

  return convertedLayers;
}

export function createTestObject(layers: TemplateLayer[]): JsonObject {
  let currentObject: JsonObject | undefined;

  for (const layer of [...layers].reverse()) {
    if (!currentObject) {
      currentObject = cloneJsonValue(layer as JsonObject);
      continue;
    }

    const [key, value] = getSingleEntry(layer);
    if (!isJsonObject(value)) {
      throw new Error(`Template root "${key}" must resolve to an object.`);
    }

    currentObject = {
      [key]: deepMergeJson(value, currentObject),
    };
  }

  return currentObject ?? {};
}

export async function createFromTemplate(directory: string, layers: TemplateLayer[]): Promise<JsonObject> {
  const convertedLayers = await convertTemplateLayers(directory, layers);
  return createTestObject(convertedLayers);
}
