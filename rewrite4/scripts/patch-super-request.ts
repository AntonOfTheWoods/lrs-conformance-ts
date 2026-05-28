import { resolve } from "node:path";

const targetPath = resolve(import.meta.dir, "../node_modules/super-request/index.js");

const source = await Bun.file(targetPath).text();
const patchedNeedle = 'typeof stackFrames[0].getFileName === "function"';

if (source.includes(patchedNeedle)) {
  process.exit(0);
}

const publishedNeedle = [
  "            var stack = dummyObject.stack;",
  "            Error.prepareStackTrace = v8Handler;",
  '            var stack = "at (" + stack[0].getFileName() + ":" + stack[0].getLineNumber() + ":" + stack[0].getColumnNumber() + ")";',
].join("\n");

const publishedPatchedBlock = [
  "            var stackFrames = dummyObject.stack;",
  "            Error.prepareStackTrace = v8Handler;",
  '            var stack = "can\'t capture errors";',
  '            if (stackFrames[0] && typeof stackFrames[0].getFileName === "function" && typeof stackFrames[0].getLineNumber === "function" && typeof stackFrames[0].getColumnNumber === "function") {',
  '                stack = "at (" + stackFrames[0].getFileName() + ":" + stackFrames[0].getLineNumber() + ":" + stackFrames[0].getColumnNumber() + ")";',
  "            }",
].join("\n");

const vendoredNeedle = [
  '            var stack = "can\'t capture errors";',
  "            if(dummyObject.stack && dummyObjectStack[0].getFileName)",
  "            {",
  '                stack = \"at (\" + dummyObjectStack[0].getFileName() + \":\" + dummyObjectStack[0].getLineNumber() + \":\" + dummyObjectStack[0].getColumnNumber() + \")\";',
  "            }",
].join("\n");

const vendoredPatchedBlock = [
  '            var stack = "can\'t capture errors";',
  '            if (dummyObject.stack && dummyObjectStack[0] && typeof dummyObjectStack[0].getFileName === "function" && typeof dummyObjectStack[0].getLineNumber === "function" && typeof dummyObjectStack[0].getColumnNumber === "function")',
  "            {",
  '                stack = \"at (\" + dummyObjectStack[0].getFileName() + \":\" + dummyObjectStack[0].getLineNumber() + \":\" + dummyObjectStack[0].getColumnNumber() + \")\";',
  "            }",
].join("\n");

if (source.includes(publishedNeedle)) {
  await Bun.write(targetPath, source.replace(publishedNeedle, publishedPatchedBlock));
  process.exit(0);
}

if (source.includes(vendoredNeedle)) {
  await Bun.write(targetPath, source.replace(vendoredNeedle, vendoredPatchedBlock));
  process.exit(0);
}

if (source.includes("var stack = dummyObject.stack;") && source.includes("stack[0].getFileName()")) {
  const regex =
    /\s{12}var stack = dummyObject\.stack;\n\s{12}Error\.prepareStackTrace = v8Handler;\n\s{12}var stack = \"at \(" \+ stack\[0\]\.getFileName\(\) \+ \":\" \+ stack\[0\]\.getLineNumber\(\) \+ \":\" \+ stack\[0\]\.getColumnNumber\(\) \+ \"\)\";/;
  if (regex.test(source)) {
    await Bun.write(targetPath, source.replace(regex, publishedPatchedBlock));
    process.exit(0);
  }
}

if (source.includes("if(dummyObject.stack && dummyObjectStack[0].getFileName)")) {
  const regex =
    /\s{12}var stack = \"can't capture errors\";\n\s{12}if\(dummyObject\.stack && dummyObjectStack\[0\]\.getFileName\)\n\s{12}\{\n\s{16}stack = \"at \(" \+ dummyObjectStack\[0\]\.getFileName\(\) \+ \":\" \+ dummyObjectStack\[0\]\.getLineNumber\(\) \+ \":\" \+ dummyObjectStack\[0\]\.getColumnNumber\(\) \+ \"\)\";\n\s{12}\}/;
  if (regex.test(source)) {
    await Bun.write(targetPath, source.replace(regex, vendoredPatchedBlock));
    process.exit(0);
  }
}

if (!source.includes(patchedNeedle)) {
  throw new Error(`Unable to patch super-request stack capture in ${targetPath}.`);
}
