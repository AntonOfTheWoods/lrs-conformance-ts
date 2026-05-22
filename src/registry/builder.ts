import {
  BatteriesArtifactSchema,
  CaseDefinitionSchema,
  type BatteriesArtifact,
  type BatteriesNode,
  type RegistryDefinition,
  RegistryDefinitionSchema,
  RegistryManifestSchema,
  type RegistryManifest,
  type RegistryNode,
  type SpecVersion,
  SuiteDefinitionSchema,
  type SuiteDefinition,
} from "../domain/contracts";

function formatRequirementNote(id: string, section: string, title?: string): string {
  if (!title || title.trim().length === 0) {
    return `spec-ref ${id} (${section})`;
  }

  return `spec-ref ${id} (${section}): ${title}`;
}

function enrichCaseRequirementNotes(node: RegistryNode): void {
  if (node.type !== "case") {
    return;
  }

  const requirementNotes = node.requirementRefs.map((ref) => formatRequirementNote(ref.id, ref.section, ref.title));
  const existing = new Set(node.assertion.notes);

  for (const note of requirementNotes) {
    if (!existing.has(note)) {
      node.assertion.notes.push(note);
    }
  }
}

function assertNodeVersion(node: RegistryNode, version: SpecVersion): void {
  if (node.specVersion !== version) {
    throw new Error(`Registry node "${node.id}" declared version ${node.specVersion} but was added under ${version}.`);
  }

  if (node.type === "suite") {
    node.children.forEach((child) => assertNodeVersion(child, version));
  }
}

function walkNode(node: RegistryNode, visitor: (current: RegistryNode) => void): void {
  visitor(node);
  if (node.type === "suite") {
    node.children.forEach((child) => walkNode(child, visitor));
  }
}

function toBatteriesNode(node: RegistryNode): BatteriesNode {
  if (node.type === "case") {
    return {
      text: node.title,
      children: [],
    };
  }

  return {
    text: node.title,
    children: node.children.map(toBatteriesNode),
  };
}

function countCases(node: RegistryNode): number {
  if (node.type === "case") {
    return 1;
  }

  return node.children.reduce((total, child) => total + countCases(child), 0);
}

export class RegistryBuilder {
  #versions: RegistryDefinition["versions"] = {
    "2.0.0": [],
    "1.0.3": [],
  };

  #ids = new Map<string, string>();

  addSuite(version: SpecVersion, suite: SuiteDefinition): this {
    const parsedSuite = SuiteDefinitionSchema.parse(suite);
    assertNodeVersion(parsedSuite, version);

    walkNode(parsedSuite, (node) => {
      const existing = this.#ids.get(node.id);
      if (existing) {
        throw new Error(`Duplicate registry id "${node.id}" found at ${existing} and ${version}.`);
      }

      this.#ids.set(node.id, version);
      if (node.type === "case") {
        enrichCaseRequirementNotes(node);
        CaseDefinitionSchema.parse(node);
      }
    });

    this.#versions[version].push(parsedSuite);
    return this;
  }

  build(): RegistryDefinition {
    return RegistryDefinitionSchema.parse({
      versions: this.#versions,
    });
  }

  compileManifest(): RegistryManifest {
    const registry = this.build();

    const manifest = {
      versions: {
        "2.0.0": {
          suiteCount: registry.versions["2.0.0"].length,
          caseCount: registry.versions["2.0.0"].reduce((total, suite) => total + countCases(suite), 0),
          caseIds: registry.versions["2.0.0"].flatMap((suite) => collectCaseIds(suite)),
        },
        "1.0.3": {
          suiteCount: registry.versions["1.0.3"].length,
          caseCount: registry.versions["1.0.3"].reduce((total, suite) => total + countCases(suite), 0),
          caseIds: registry.versions["1.0.3"].flatMap((suite) => collectCaseIds(suite)),
        },
      },
    };

    return RegistryManifestSchema.parse(manifest);
  }

  compileBatteries(): BatteriesArtifact {
    const registry = this.build();

    const artifact: BatteriesArtifact = {};

    for (const version of ["2.0.0", "1.0.3"] as const) {
      if (registry.versions[version].length === 0) {
        continue;
      }

      artifact[version] = {
        conformanceTestCount: registry.versions[version].reduce((total, suite) => total + countCases(suite), 0),
        tests: {
          text: "",
          children: registry.versions[version].map(toBatteriesNode),
        },
      };
    }

    return BatteriesArtifactSchema.parse(artifact);
  }
}

function collectCaseIds(node: RegistryNode): string[] {
  if (node.type === "case") {
    return [node.id];
  }

  return node.children.flatMap((child) => collectCaseIds(child));
}
