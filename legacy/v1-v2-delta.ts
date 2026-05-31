import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { resolveUpstreamTestRoot } from "./upstream-root";

const v103Root = resolveUpstreamTestRoot("v1_0_3");
const v20Root = resolveUpstreamTestRoot("v2_0");

const xapiRequirementIdPattern = /XAPI-\d{5}/g;

export interface VersionSuiteInventory {
  root: string;
  topLevelSpecFiles: string[];
  configFiles: string[];
  templateFiles: string[];
  requirementIds: string[];
}

export interface PairSimilaritySummary {
  candidatePairs: number;
  exactIdenticalPairs: number;
  normalizedIdenticalPairs: number;
}

export interface OriginalSuiteDeltaMatrix {
  v103: VersionSuiteInventory;
  v20: VersionSuiteInventory;
  overlap: {
    sharedConfigBasenames: string[];
    sharedTemplateRelativePaths: string[];
    v103OnlyConfigBasenames: string[];
    v20OnlyConfigBasenames: string[];
    v103OnlyTemplateRelativePaths: string[];
    v20OnlyTemplateRelativePaths: string[];
  };
  similarity: {
    configPairs: PairSimilaritySummary;
    templatePairs: PairSimilaritySummary;
    totalPairs: PairSimilaritySummary;
  };
  requirementIds: {
    v103UniqueCount: number;
    v20UniqueCount: number;
    intersectionCount: number;
    v103Only: string[];
    v20Only: string[];
  };
}

export interface TopLevelSpecStemDelta {
  sharedStems: string[];
  v103OnlyStems: string[];
  v20OnlyStems: string[];
}

function collectFilesRecursively(root: string): string[] {
  const entries = readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFilesRecursively(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function readUtf8(filePath: string): string {
  return readFileSync(filePath, "utf8");
}

function normalizeVersionSpecificText(value: string): string {
  return value
    .replaceAll("2.0.0", "<SPEC_VERSION>")
    .replaceAll("1.0.3", "<SPEC_VERSION>")
    .replaceAll("v2_0", "<SPEC_DIR>")
    .replaceAll("v1_0_3", "<SPEC_DIR>")
    .replaceAll("4.1.6.4-Activity-Resource", "<ACTIVITY_RESOURCE_FILE>")
    .replaceAll("H.Communication2.5-ActivitiesResource", "<ACTIVITY_RESOURCE_FILE>");
}

function toNormalizedTopLevelStem(fileName: string): string {
  const withoutExtension = fileName.replace(/\.js$/, "");

  const withoutPrefix = withoutExtension
    .replace(/^E\./, "")
    .replace(/^H\.Communication\d+\.\d+-/, "")
    .replace(/^Data\d+(?:\.\d+)+-/, "")
    .replace(/^\d+\.\d+\.\d+\.\d+-/, "")
    .replace(/^\d+\.\d+\.\d+-/, "")
    .replace(/^\d+\.\d+-/, "")
    .replace(/^\d+-/, "");

  return withoutPrefix
    .replaceAll("ActivitiesResource", "ActivityResource")
    .replaceAll("Activity-Resource", "ActivityResource")
    .replaceAll("Statement-Voiding", "StatementLifecycle")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function topLevelSpecFiles(versionRoot: string): string[] {
  return readdirSync(versionRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => entry.name)
    .sort();
}

function configFiles(versionRoot: string): string[] {
  const configsRoot = join(versionRoot, "configs");
  return collectFilesRecursively(configsRoot)
    .filter((filePath) => filePath.endsWith(".js"))
    .map((filePath) => relative(configsRoot, filePath).replaceAll("\\", "/"))
    .sort();
}

function templateFiles(versionRoot: string): string[] {
  const templatesRoot = join(versionRoot, "templates");
  return collectFilesRecursively(templatesRoot)
    .map((filePath) => relative(templatesRoot, filePath).replaceAll("\\", "/"))
    .sort();
}

function requirementIds(versionRoot: string): string[] {
  const jsFiles = collectFilesRecursively(versionRoot).filter((filePath) => filePath.endsWith(".js"));
  const ids = new Set<string>();

  for (const filePath of jsFiles) {
    const matches = readUtf8(filePath).match(xapiRequirementIdPattern) ?? [];
    for (const id of matches) {
      ids.add(id);
    }
  }

  return [...ids].sort();
}

function buildVersionInventory(versionRoot: string): VersionSuiteInventory {
  return {
    root: versionRoot,
    topLevelSpecFiles: topLevelSpecFiles(versionRoot),
    configFiles: configFiles(versionRoot),
    templateFiles: templateFiles(versionRoot),
    requirementIds: requirementIds(versionRoot),
  };
}

function intersectSorted(left: string[], right: string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value)).sort();
}

function diffSorted(left: string[], right: string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value)).sort();
}

function summarizePairs(
  leftItems: string[],
  rightItems: string[],
  readLeft: (name: string) => string,
  readRight: (name: string) => string,
): PairSimilaritySummary {
  const sharedItems = intersectSorted(leftItems, rightItems);
  let exactIdenticalPairs = 0;
  let normalizedIdenticalPairs = 0;

  for (const item of sharedItems) {
    const leftContent = readLeft(item);
    const rightContent = readRight(item);
    if (leftContent === rightContent) {
      exactIdenticalPairs += 1;
    }
    if (normalizeVersionSpecificText(leftContent) === normalizeVersionSpecificText(rightContent)) {
      normalizedIdenticalPairs += 1;
    }
  }

  return {
    candidatePairs: sharedItems.length,
    exactIdenticalPairs,
    normalizedIdenticalPairs,
  };
}

export function buildOriginalSuiteDeltaMatrix(): OriginalSuiteDeltaMatrix {
  const v103 = buildVersionInventory(v103Root);
  const v20 = buildVersionInventory(v20Root);

  const v103ConfigBasenames = v103.configFiles.map((filePath) => filePath.replace(/\.js$/, ""));
  const v20ConfigBasenames = v20.configFiles.map((filePath) => filePath.replace(/\.js$/, ""));

  const sharedConfigBasenames = intersectSorted(v103ConfigBasenames, v20ConfigBasenames);
  const sharedTemplateRelativePaths = intersectSorted(v103.templateFiles, v20.templateFiles);

  const configPairSummary = summarizePairs(
    sharedConfigBasenames,
    sharedConfigBasenames,
    (name) => readUtf8(join(v103Root, "configs", `${name}.js`)),
    (name) => readUtf8(join(v20Root, "configs", `${name}.js`)),
  );

  const templatePairSummary = summarizePairs(
    sharedTemplateRelativePaths,
    sharedTemplateRelativePaths,
    (name) => readFileSync(join(v103Root, "templates", name), "utf8"),
    (name) => readFileSync(join(v20Root, "templates", name), "utf8"),
  );

  const requirementIdIntersection = intersectSorted(v103.requirementIds, v20.requirementIds);

  return {
    v103,
    v20,
    overlap: {
      sharedConfigBasenames,
      sharedTemplateRelativePaths,
      v103OnlyConfigBasenames: diffSorted(v103ConfigBasenames, v20ConfigBasenames),
      v20OnlyConfigBasenames: diffSorted(v20ConfigBasenames, v103ConfigBasenames),
      v103OnlyTemplateRelativePaths: diffSorted(v103.templateFiles, v20.templateFiles),
      v20OnlyTemplateRelativePaths: diffSorted(v20.templateFiles, v103.templateFiles),
    },
    similarity: {
      configPairs: configPairSummary,
      templatePairs: templatePairSummary,
      totalPairs: {
        candidatePairs: configPairSummary.candidatePairs + templatePairSummary.candidatePairs,
        exactIdenticalPairs: configPairSummary.exactIdenticalPairs + templatePairSummary.exactIdenticalPairs,
        normalizedIdenticalPairs:
          configPairSummary.normalizedIdenticalPairs + templatePairSummary.normalizedIdenticalPairs,
      },
    },
    requirementIds: {
      v103UniqueCount: v103.requirementIds.length,
      v20UniqueCount: v20.requirementIds.length,
      intersectionCount: requirementIdIntersection.length,
      v103Only: diffSorted(v103.requirementIds, v20.requirementIds),
      v20Only: diffSorted(v20.requirementIds, v103.requirementIds),
    },
  };
}

export function buildTopLevelSpecStemDelta(): TopLevelSpecStemDelta {
  const matrix = buildOriginalSuiteDeltaMatrix();
  const v103Stems = matrix.v103.topLevelSpecFiles.map(toNormalizedTopLevelStem).sort();
  const v20Stems = matrix.v20.topLevelSpecFiles.map(toNormalizedTopLevelStem).sort();

  return {
    sharedStems: intersectSorted(v103Stems, v20Stems),
    v103OnlyStems: diffSorted(v103Stems, v20Stems),
    v20OnlyStems: diffSorted(v20Stems, v103Stems),
  };
}
