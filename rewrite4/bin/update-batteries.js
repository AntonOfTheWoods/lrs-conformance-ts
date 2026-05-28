const fs = require("fs");
const path = require("path");
const Mocha = require("mocha");
const specs = require("../specConfig");

function clearRewriteModuleCache(rootDirectory) {
  Object.keys(require.cache).forEach(function (cacheKey) {
    if (!cacheKey.startsWith(rootDirectory)) {
      return;
    }
    if (cacheKey.indexOf(path.sep + "node_modules" + path.sep) !== -1) {
      return;
    }

    delete require.cache[cacheKey];
  });
}

function cleanLog(log) {
  return {
    text: log.title || "",
    children: log.suites.map(cleanLog).concat(
      log.tests.map(function (test) {
        return {
          text: test.title,
          children: [],
        };
      }),
    ),
  };
}

function countTests(suite) {
  return (
    suite.tests.length +
    suite.suites.reduce(function (sum, childSuite) {
      return sum + countTests(childSuite);
    }, 0)
  );
}

function createBattery(version) {
  const rewriteRoot = path.join(__dirname, "..");
  const directory = version === "1.0.3" ? "v1_0_3" : "v2_0";

  process.env.DIRECTORY = directory;
  process.env.LRS_ENDPOINT = "http://localhost:3001/xapi";
  process.env.BASIC_AUTH_ENABLED = "true";
  process.env.BASIC_AUTH_USER = "No:";
  process.env.BASIC_AUTH_PASSWORD = "User";
  process.env.XAPI_VERSION = version;

  clearRewriteModuleCache(rewriteRoot);
  require("chai").use(require("chai-things"));

  const mocha = new Mocha({
    timeout: "15000",
    ui: "bdd",
  });
  const testDirectory = path.join(rewriteRoot, "test", directory);

  fs.readdirSync(testDirectory)
    .filter(function (file) {
      return file.endsWith(".js");
    })
    .forEach(function (file) {
      mocha.addFile(path.join(testDirectory, file));
    });

  mocha.loadFiles();

  const info = {
    conformanceTestCount: countTests(mocha.suite),
    tests: cleanLog(mocha.suite),
  };

  console.log(`[${version}] found ${info.conformanceTestCount} tests.`);

  return info;
}

function createBatteries() {
  const output = {};
  specs.availableVersions.forEach(function (version) {
    output[version] = createBattery(version);
  });

  return output;
}

function main() {
  const batteryOutput = createBatteries();
  const batteryPath = path.join(__dirname, "../batteries.js");
  const fileContents = `module.exports = ${JSON.stringify(batteryOutput, null, 2)}`;

  fs.writeFileSync(batteryPath, fileContents);
}

main();
