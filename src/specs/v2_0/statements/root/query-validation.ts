import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsQueryValidationSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.query-validation",
  "title": "Statement Query Validation",
  "specVersion": "2.0.0",
  "tags": [
    "query",
    "validation"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-statement-id",
      "title": "The Statements resource rejects an invalid statementId query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "wrong"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-voided-statement-id",
      "title": "The Statements resource rejects an invalid voidedStatementId query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "voidedStatementId": "wrong"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-agent",
      "title": "The Statements resource rejects an invalid agent query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "agent": "wrong"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-verb",
      "title": "The Statements resource rejects an invalid verb query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "verb": "not.a.valid.iri.com/verb"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-activity",
      "title": "The Statements resource rejects an invalid activity query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "activity": "not.a.valid.iri.com/activity"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.query-validation.invalid-registration",
      "title": "The Statements resource rejects an invalid registration query value",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00012",
          "section": "Data 2.2.s4.b4",
          "title": "Statement query parameters follow statement value validation rules"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "query",
        "validation"
      ],
      "capabilityFlags": [
        "query",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "registration": "wrong"
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 400,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Query Validation",
          "legacy note: XAPI-00012 upstream comment - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.",
          "legacy note: XAPI-00012 upstream describe - The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
