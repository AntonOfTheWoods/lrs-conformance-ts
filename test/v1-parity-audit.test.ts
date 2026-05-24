import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { RegistryNode } from "../src/domain/contracts";
import { buildOriginalSuiteDeltaMatrix } from "../src/specs/migration/v1-v2-delta";
import { createV103ProofSliceRegistry } from "../src/specs/v1_0_3/proof-slice";

const upstreamV103Root = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v1_0_3";

function collectFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(root, entry.name);
    return entry.isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function extractRequirementIds(text: string): string[] {
  return text.match(/XAPI-\d{5}/g) ?? [];
}

function collectUpstreamRequirementIds(): string[] {
  const ids = new Set<string>();

  for (const filePath of collectFiles(upstreamV103Root)) {
    if (!filePath.endsWith(".js")) {
      continue;
    }

    for (const id of extractRequirementIds(readFileSync(filePath, "utf8"))) {
      ids.add(id);
    }
  }

  return [...ids].sort();
}

function collectProofRequirementIds(): string[] {
  const ids = new Set<string>();
  const registry = createV103ProofSliceRegistry();

  const walk = (node: RegistryNode) => {
    if (node.type === "case") {
      for (const requirement of node.requirementRefs) {
        if (/^XAPI-\d{5}$/.test(requirement.id)) {
          ids.add(requirement.id);
        }
      }
      return;
    }

    for (const child of node.children) {
      walk(child);
    }
  };

  for (const suite of registry.versions["1.0.3"]) {
    walk(suite);
  }

  return [...ids].sort();
}

describe("xAPI 1.0.3 parity audit baseline", () => {
  test("pins upstream-original 1.0.3 requirement inventory and known v1-v2 delta ids", () => {
    const upstreamIds = collectUpstreamRequirementIds();
    const matrix = buildOriginalSuiteDeltaMatrix();

    expect(upstreamIds.length).toBe(336);
    expect(matrix.requirementIds.v103UniqueCount).toBe(336);
    expect(matrix.requirementIds.v20UniqueCount).toBe(335);
    expect(matrix.requirementIds.intersectionCount).toBe(335);
    expect(matrix.requirementIds.v103Only).toEqual(["XAPI-00336"]);
    expect(matrix.requirementIds.v20Only).toEqual([]);
  });

  test("pins the initial migrated 1.0.3 proof set and requires subset-safe growth", () => {
    const upstreamIds = new Set(collectUpstreamRequirementIds());
    const proofIds = collectProofRequirementIds();

    expect(proofIds).toEqual([
      "XAPI-00001",
      "XAPI-00002",
      "XAPI-00003",
      "XAPI-00004",
      "XAPI-00005",
      "XAPI-00006",
      "XAPI-00007",
      "XAPI-00008",
      "XAPI-00009",
      "XAPI-00010",
      "XAPI-00011",
      "XAPI-00012",
      "XAPI-00013",
      "XAPI-00014",
      "XAPI-00015",
      "XAPI-00016",
      "XAPI-00017",
      "XAPI-00018",
      "XAPI-00019",
      "XAPI-00020",
      "XAPI-00022",
      "XAPI-00023",
      "XAPI-00024",
      "XAPI-00025",
      "XAPI-00026",
      "XAPI-00027",
      "XAPI-00028",
      "XAPI-00029",
      "XAPI-00030",
      "XAPI-00031",
      "XAPI-00032",
      "XAPI-00033",
      "XAPI-00034",
      "XAPI-00035",
      "XAPI-00036",
      "XAPI-00037",
      "XAPI-00038",
      "XAPI-00039",
      "XAPI-00040",
      "XAPI-00041",
      "XAPI-00042",
      "XAPI-00043",
      "XAPI-00044",
      "XAPI-00045",
      "XAPI-00046",
      "XAPI-00047",
      "XAPI-00048",
      "XAPI-00049",
      "XAPI-00050",
      "XAPI-00051",
      "XAPI-00052",
      "XAPI-00053",
      "XAPI-00054",
      "XAPI-00055",
      "XAPI-00056",
      "XAPI-00057",
      "XAPI-00058",
      "XAPI-00059",
      "XAPI-00060",
      "XAPI-00061",
      "XAPI-00062",
      "XAPI-00064",
      "XAPI-00065",
      "XAPI-00066",
      "XAPI-00067",
      "XAPI-00068",
      "XAPI-00069",
      "XAPI-00070",
      "XAPI-00071",
      "XAPI-00072",
      "XAPI-00073",
      "XAPI-00074",
      "XAPI-00075",
      "XAPI-00076",
      "XAPI-00077",
      "XAPI-00078",
      "XAPI-00079",
      "XAPI-00080",
      "XAPI-00081",
      "XAPI-00082",
      "XAPI-00083",
      "XAPI-00084",
      "XAPI-00085",
      "XAPI-00086",
      "XAPI-00087",
      "XAPI-00088",
      "XAPI-00089",
      "XAPI-00090",
      "XAPI-00091",
      "XAPI-00092",
      "XAPI-00093",
      "XAPI-00094",
      "XAPI-00096",
      "XAPI-00097",
      "XAPI-00098",
      "XAPI-00099",
      "XAPI-00100",
      "XAPI-00101",
      "XAPI-00102",
      "XAPI-00103",
      "XAPI-00104",
      "XAPI-00105",
      "XAPI-00106",
      "XAPI-00107",
      "XAPI-00108",
      "XAPI-00109",
      "XAPI-00110",
      "XAPI-00111",
      "XAPI-00113",
      "XAPI-00114",
      "XAPI-00115",
      "XAPI-00116",
      "XAPI-00117",
      "XAPI-00118",
      "XAPI-00119",
      "XAPI-00120",
      "XAPI-00121",
      "XAPI-00122",
      "XAPI-00123",
      "XAPI-00124",
      "XAPI-00125",
      "XAPI-00126",
      "XAPI-00127",
      "XAPI-00128",
      "XAPI-00129",
      "XAPI-00130",
      "XAPI-00131",
      "XAPI-00132",
      "XAPI-00133",
      "XAPI-00134",
      "XAPI-00135",
      "XAPI-00139",
      "XAPI-00142",
      "XAPI-00143",
      "XAPI-00144",
      "XAPI-00145",
      "XAPI-00146",
      "XAPI-00147",
      "XAPI-00149",
      "XAPI-00150",
      "XAPI-00151",
      "XAPI-00153",
      "XAPI-00154",
      "XAPI-00155",
      "XAPI-00156",
      "XAPI-00157",
      "XAPI-00158",
      "XAPI-00159",
      "XAPI-00160",
      "XAPI-00161",
      "XAPI-00162",
      "XAPI-00163",
      "XAPI-00164",
      "XAPI-00165",
      "XAPI-00166",
      "XAPI-00167",
      "XAPI-00168",
      "XAPI-00169",
      "XAPI-00170",
      "XAPI-00171",
      "XAPI-00172",
      "XAPI-00173",
      "XAPI-00174",
      "XAPI-00175",
      "XAPI-00176",
      "XAPI-00177",
      "XAPI-00178",
      "XAPI-00179",
      "XAPI-00180",
      "XAPI-00181",
      "XAPI-00182",
      "XAPI-00183",
      "XAPI-00184",
      "XAPI-00187",
      "XAPI-00188",
      "XAPI-00189",
      "XAPI-00190",
      "XAPI-00191",
      "XAPI-00192",
      "XAPI-00193",
      "XAPI-00194",
      "XAPI-00195",
      "XAPI-00196",
      "XAPI-00197",
      "XAPI-00198",
      "XAPI-00199",
      "XAPI-00200",
      "XAPI-00201",
      "XAPI-00202",
      "XAPI-00203",
      "XAPI-00204",
      "XAPI-00206",
      "XAPI-00207",
      "XAPI-00208",
      "XAPI-00209",
      "XAPI-00210",
      "XAPI-00211",
      "XAPI-00212",
      "XAPI-00213",
      "XAPI-00214",
      "XAPI-00215",
      "XAPI-00216",
      "XAPI-00217",
      "XAPI-00218",
      "XAPI-00219",
      "XAPI-00220",
      "XAPI-00221",
      "XAPI-00224",
      "XAPI-00225",
      "XAPI-00226",
      "XAPI-00227",
      "XAPI-00228",
      "XAPI-00229",
      "XAPI-00230",
      "XAPI-00231",
      "XAPI-00232",
      "XAPI-00233",
      "XAPI-00234",
      "XAPI-00235",
      "XAPI-00236",
      "XAPI-00237",
      "XAPI-00238",
      "XAPI-00239",
      "XAPI-00240",
      "XAPI-00241",
      "XAPI-00242",
      "XAPI-00243",
      "XAPI-00244",
      "XAPI-00245",
      "XAPI-00246",
      "XAPI-00247",
      "XAPI-00248",
      "XAPI-00249",
      "XAPI-00250",
      "XAPI-00251",
      "XAPI-00252",
      "XAPI-00253",
      "XAPI-00254",
      "XAPI-00255",
      "XAPI-00258",
      "XAPI-00259",
      "XAPI-00260",
      "XAPI-00261",
      "XAPI-00262",
      "XAPI-00265",
      "XAPI-00268",
      "XAPI-00269",
      "XAPI-00270",
      "XAPI-00271",
      "XAPI-00272",
      "XAPI-00273",
      "XAPI-00274",
      "XAPI-00275",
      "XAPI-00278",
      "XAPI-00279",
      "XAPI-00282",
      "XAPI-00283",
      "XAPI-00284",
      "XAPI-00285",
      "XAPI-00286",
      "XAPI-00287",
      "XAPI-00288",
      "XAPI-00289",
      "XAPI-00290",
      "XAPI-00291",
      "XAPI-00292",
      "XAPI-00293",
      "XAPI-00294",
      "XAPI-00295",
      "XAPI-00296",
      "XAPI-00297",
      "XAPI-00298",
      "XAPI-00299",
      "XAPI-00300",
      "XAPI-00301",
      "XAPI-00302",
      "XAPI-00303",
      "XAPI-00308",
      "XAPI-00310",
      "XAPI-00311",
      "XAPI-00312",
      "XAPI-00313",
      "XAPI-00314",
      "XAPI-00315",
      "XAPI-00316",
      "XAPI-00317",
      "XAPI-00318",
      "XAPI-00319",
      "XAPI-00321",
      "XAPI-00322",
      "XAPI-00324",
      "XAPI-00325",
      "XAPI-00326",
      "XAPI-00330",
      "XAPI-00331",
      "XAPI-00332",
      "XAPI-00333",
      "XAPI-00334",
      "XAPI-00335",
    ]);
    expect(proofIds.every((id) => upstreamIds.has(id))).toBeTrue();
  });
});
