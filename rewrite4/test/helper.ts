const path = require("path") as typeof import("path");
const fs = require("fs") as typeof import("fs");
const extend = require("extend") as typeof import("extend");
const uuid = require("uuid") as typeof import("uuid");
const lodashIsEqual = require("lodash.isequal") as (left: unknown, right: unknown) => boolean;
const FormUrlencode = require("form-urlencoded") as typeof import("form-urlencoded");
const jws = require("jws") as typeof import("jws");
const crypto = require("crypto") as typeof import("crypto");

type HelperExports = Record<string, unknown>;

type HelperState = {
  CAPTURE_OWNER_HEADER: string;
  CONFIG_FOLDER: string;
  CONFIG_FOLDER_RELATIVE: string;
  DIRECTORY: string;
  LRS_ENDPOINT: string;
  TEMPLATE_FOLDER: string;
  TEMPLATE_FOLDER_RELATIVE: string;
  TIME_MARGIN: number | undefined;
  URL_ABOUT: string;
  URL_ACTIVITIES: string;
  URL_ACTIVITIES_PROFILE: string;
  URL_ACTIVITIES_STATE: string;
  URL_AGENTS: string;
  URL_AGENTS_PROFILE: string;
  URL_STATEMENTS: string;
};

function loadLocalEnvIfNeeded(): void {
  if (process.env.EB_NODE_COMMAND) {
    return;
  }

  const envPath = path.join(__dirname, "./.env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.charAt(0) === "#") {
        return;
      }

      const delimiterIndex = trimmed.indexOf("=");
      if (delimiterIndex === -1) {
        return;
      }

      const key = trimmed.slice(0, delimiterIndex).trim();
      if (!key || typeof process.env[key] !== "undefined") {
        return;
      }

      let rawValue = trimmed.slice(delimiterIndex + 1).trim();
      if (
        rawValue.length >= 2 &&
        ((rawValue.charAt(0) === '"' && rawValue.charAt(rawValue.length - 1) === '"') ||
          (rawValue.charAt(0) === "'" && rawValue.charAt(rawValue.length - 1) === "'"))
      ) {
        rawValue = rawValue.slice(1, -1);
      }

      process.env[key] = rawValue;
    });
}

loadLocalEnvIfNeeded();

let timeMargin: number | undefined;
const CAPTURE_OWNER_HEADER = "x-lrs-conformance-owner";

let helperExports: HelperExports;

function getState(): HelperState {
  const directory = process.env.DIRECTORY ?? "";

  return {
    CAPTURE_OWNER_HEADER,
    CONFIG_FOLDER: `./test/${directory}/configs`,
    CONFIG_FOLDER_RELATIVE: `./${directory}/configs`,
    DIRECTORY: directory,
    LRS_ENDPOINT: process.env.LRS_ENDPOINT ?? "",
    TEMPLATE_FOLDER: `./test/${directory}/templates`,
    TEMPLATE_FOLDER_RELATIVE: `./${directory}/templates`,
    TIME_MARGIN: timeMargin,
    URL_ABOUT: "/about",
    URL_ACTIVITIES: "/activities",
    URL_ACTIVITIES_PROFILE: "/activities/profile",
    URL_ACTIVITIES_STATE: "/activities/state",
    URL_AGENTS: "/agents",
    URL_AGENTS_PROFILE: "/agents/profile",
    URL_STATEMENTS: "/statements",
  };
}

const helperContext = {
  FormUrlencode,
  crypto,
  extend,
  fs,
  getHelperExports(): HelperExports {
    return helperExports;
  },
  getState,
  helperRequire: require,
  jws,
  lodashIsEqual,
  setTimeMargin(value: number | undefined): void {
    timeMargin = value;
  },
  uuid,
};

const transportSupport = require("../bun-runtime/helper-transport.ts").createHelperTransportSupport(
  helperContext,
) as HelperExports;
const fixtureSupport = require("../bun-runtime/helper-fixture-crypto.ts").createHelperFixtureCryptoSupport(
  helperContext,
) as HelperExports;

helperExports = {
  ...transportSupport,
  ...fixtureSupport,
};

export default helperExports;
module.exports = helperExports;
