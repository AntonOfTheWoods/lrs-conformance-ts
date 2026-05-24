import { readFileSync, writeFileSync } from "node:fs";

import { LEGACY_XAPI_COMMENT_MAP } from "../src/registry/legacyCommentMap";
import { LEGACY_XAPI_DESCRIBE_MAP } from "../src/registry/legacyDescribeMap";

function findMatchingDelimiter(text: string, startIndex: number, open: string, close: string): number {
  let depth = 0;
  let quoteChar: string | null = null;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const ch = text[index];

    if (quoteChar !== null) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quoteChar) {
        quoteChar = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quoteChar = ch;
      continue;
    }

    if (ch === open) {
      depth += 1;
      continue;
    }

    if (ch === close) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findArrayEnd(text: string, arrayStartBracketIndex: number): number {
  let depth = 0;
  let quoteChar: string | null = null;
  let escaped = false;

  for (let index = arrayStartBracketIndex; index < text.length; index += 1) {
    const ch = text[index];

    if (quoteChar !== null) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quoteChar) {
        quoteChar = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quoteChar = ch;
      continue;
    }

    if (ch === "[") {
      depth += 1;
      continue;
    }

    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function parseQuotedStrings(arrayContent: string): string[] {
  const result: string[] = [];
  const regex = /"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(arrayContent)) !== null) {
    result.push(JSON.parse(`"${match[1]}"`));
  }

  return result;
}

function fileMatchesScope(filePath: string, scope: string): boolean {
  if (scope === "all") {
    return true;
  }

  if (scope === "statements") {
    return filePath.includes("/specs/v2_0/statements/") || filePath.includes("/specs/v1_0_3/statements/");
  }

  return filePath.includes(scope);
}

function expectedNotesForRequirementIds(requirementIds: string[]): string[] {
  const notes: string[] = [];

  for (const requirementId of requirementIds) {
    const comment = LEGACY_XAPI_COMMENT_MAP[requirementId];
    if (comment) {
      notes.push(`legacy note: ${requirementId} upstream comment - ${comment}`);
    }

    const describeTexts = LEGACY_XAPI_DESCRIBE_MAP[requirementId] ?? [];
    for (const describeText of describeTexts) {
      notes.push(`legacy note: ${requirementId} upstream describe - ${describeText}`);
    }
  }

  return [...new Set(notes)];
}

type CaseEdit = { start: number; end: number; replacement: string; caseId: string };

function renderNotesArray(baseIndent: string, notes: string[]): string {
  const itemIndent = `${baseIndent}  `;
  return `\n${notes.map((note) => `${itemIndent}${JSON.stringify(note)},`).join("\n")}\n${baseIndent}`;
}

function findFirstIndex(text: string, from: number, needles: string[]): number {
  let best = -1;
  for (const needle of needles) {
    const index = text.indexOf(needle, from);
    if (index < 0) {
      continue;
    }

    if (best < 0 || index < best) {
      best = index;
    }
  }

  return best;
}

function computeEditsForFile(source: string): CaseEdit[] {
  const edits: CaseEdit[] = [];
  let cursor = 0;

  while (true) {
    const markerPos = findFirstIndex(source, cursor, ['type: "case"', '"type": "case"', 'caseId: "', '"caseId": "']);
    if (markerPos < 0) {
      break;
    }

    const markerSlice = source.slice(markerPos, markerPos + 20);
    const isTypedCase = markerSlice.includes("type") && markerSlice.includes("case");

    const objectStart = source.lastIndexOf("{", markerPos);
    if (objectStart < 0) {
      cursor = markerPos + 1;
      continue;
    }

    const objectEnd = findMatchingDelimiter(source, objectStart, "{", "}");
    if (objectEnd < 0) {
      cursor = markerPos + 1;
      continue;
    }

    const block = source.slice(objectStart, objectEnd + 1);
    const idMatch = isTypedCase ? /"?id"?\s*:\s*"([^"]+)"/.exec(block) : /"?caseId"?\s*:\s*"([^"]+)"/.exec(block);
    const caseId = idMatch?.[1] ?? "";
    if (!caseId) {
      cursor = objectEnd + 1;
      continue;
    }

    const requirementRefsPos = findFirstIndex(block, 0, ["requirementRefs:", '"requirementRefs":']);
    if (requirementRefsPos < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const requirementArrayStart = block.indexOf("[", requirementRefsPos);
    if (requirementArrayStart < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const requirementArrayEnd = findArrayEnd(block, requirementArrayStart);
    if (requirementArrayEnd < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const requirementSection = block.slice(requirementArrayStart, requirementArrayEnd + 1);
    const requirementIds = [...requirementSection.matchAll(/"?id"?\s*:\s*"(XAPI-\d{5})"/g)]
      .map((match) => match[1] ?? "")
      .filter(Boolean);
    if (requirementIds.length === 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const expectedNotes = expectedNotesForRequirementIds(requirementIds);
    if (expectedNotes.length === 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const assertionPos = findFirstIndex(block, 0, ["assertion:", '"assertion":']);
    const notesSearchStart = isTypedCase ? assertionPos : requirementRefsPos;
    if (isTypedCase && notesSearchStart < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const notesPos = findFirstIndex(block, notesSearchStart, ["notes:", '"notes":']);
    if (notesPos < 0) {
      if (isTypedCase) {
        const assertionObjectStart = block.indexOf("{", assertionPos);
        const assertionObjectEnd =
          assertionObjectStart >= 0 ? findMatchingDelimiter(block, assertionObjectStart, "{", "}") : -1;
        if (assertionObjectEnd < 0) {
          cursor = objectEnd + 1;
          continue;
        }

        const closeLineStart = block.lastIndexOf("\n", assertionObjectEnd) + 1;
        const closeIndent = /^(\s*)/.exec(block.slice(closeLineStart, assertionObjectEnd))?.[1] ?? "";
        const propertyIndent = `${closeIndent}  `;
        const insertion = `\n${propertyIndent}notes: [${renderNotesArray(propertyIndent, expectedNotes)}\n${propertyIndent}],`;

        edits.push({
          start: objectStart + assertionObjectEnd,
          end: objectStart + assertionObjectEnd,
          replacement: insertion,
          caseId,
        });
      } else {
        const closeLineStart = block.lastIndexOf("\n", block.length - 1) + 1;
        const closeIndent = /^(\s*)/.exec(block.slice(closeLineStart, block.length - 1))?.[1] ?? "";
        const propertyIndent = `${closeIndent}  `;
        const insertion = `\n${propertyIndent}notes: [${renderNotesArray(propertyIndent, expectedNotes)}\n${propertyIndent}],`;

        edits.push({
          start: objectStart + block.length - 1,
          end: objectStart + block.length - 1,
          replacement: insertion,
          caseId,
        });
      }

      cursor = objectEnd + 1;
      continue;
    }

    const notesArrayStart = block.indexOf("[", notesPos);
    if (notesArrayStart < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const notesArrayEnd = findArrayEnd(block, notesArrayStart);
    if (notesArrayEnd < 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const existingNotes = parseQuotedStrings(block.slice(notesArrayStart + 1, notesArrayEnd));
    const missing = expectedNotes.filter((note) => !existingNotes.includes(note));
    if (missing.length === 0) {
      cursor = objectEnd + 1;
      continue;
    }

    const merged = [...existingNotes, ...missing];
    const lineStart = block.lastIndexOf("\n", notesPos) + 1;
    const indentMatch = /^(\s*)/.exec(block.slice(lineStart, notesPos));
    const baseIndent = indentMatch?.[1] ?? "";
    const replacement = renderNotesArray(baseIndent, merged);

    edits.push({
      start: objectStart + notesArrayStart + 1,
      end: objectStart + notesArrayEnd,
      replacement,
      caseId,
    });

    cursor = objectEnd + 1;
  }

  return edits;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has("--apply");
  const scopeArg = [...args].find((arg) => arg.startsWith("--scope="));
  const scope = scopeArg?.split("=")[1] ?? "statements";

  const files: string[] = [];
  for (const pattern of ["src/specs/v2_0/**/*.ts", "src/specs/v1_0_3/**/*.ts"]) {
    for await (const path of new Bun.Glob(pattern).scan()) {
      files.push(path);
    }
  }

  let touchedFiles = 0;
  let touchedCases = 0;

  for (const filePath of files) {
    if (!fileMatchesScope(filePath, scope)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    const edits = computeEditsForFile(source);

    if (edits.length === 0) {
      continue;
    }

    edits.sort((a, b) => b.start - a.start);
    let updated = source;
    for (const edit of edits) {
      updated = `${updated.slice(0, edit.start)}${edit.replacement}${updated.slice(edit.end)}`;
      touchedCases += 1;
    }

    touchedFiles += 1;
    if (apply) {
      writeFileSync(filePath, updated, "utf8");
    }
  }

  const mode = apply ? "apply" : "dry-run";
  console.log(JSON.stringify({ mode, scope, touchedFiles, touchedCases }, null, 2));
}

await main();
