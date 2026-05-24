import type { SuiteDefinition } from "../../../../../domain/contracts";
export const v2ProofSliceStatementsResultAndObjectsStatementRefSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.result-and-objects.statement-ref",
  "title": "Statement References",
  "specVersion": "2.0.0",
  "tags": [
    "statement-ref"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.statement-ref.acceptance.statement",
      "title": "A Statement accepts a statement object when it is a valid StatementRef",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "StatementRef",
                "id": "33333333-3333-4333-8333-000000000970"
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.acceptance.substatement",
      "title": "A Statement accepts a substatement object when it is a valid StatementRef",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "SubStatement",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-nested-agent@example.test",
                  "name": "Proof Agent"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/experienced",
                  "display": {
                    "en-US": "experienced"
                  }
                },
                "object": {
                  "objectType": "StatementRef",
                  "id": "33333333-3333-4333-8333-000000000971"
                }
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
          }
        }
      },
      "assertion": {
        "kind": "single-request",
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.object-type.statement",
      "title": "A Statement rejects a statement object when objectType does not exactly match StatementRef",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "statementref",
                "id": "33333333-3333-4333-8333-000000000972"
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.object-type.substatement",
      "title": "A Statement rejects a substatement object when objectType does not exactly match StatementRef",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "SubStatement",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-nested-agent@example.test",
                  "name": "Proof Agent"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/experienced",
                  "display": {
                    "en-US": "experienced"
                  }
                },
                "object": {
                  "objectType": "statementref",
                  "id": "33333333-3333-4333-8333-000000000972"
                }
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.missing-id.statement",
      "title": "A Statement rejects a statement object when id is missing",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "StatementRef"
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.missing-id.substatement",
      "title": "A Statement rejects a substatement object when id is missing",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "SubStatement",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-nested-agent@example.test",
                  "name": "Proof Agent"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/experienced",
                  "display": {
                    "en-US": "experienced"
                  }
                },
                "object": {
                  "objectType": "StatementRef"
                }
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.invalid-id.statement",
      "title": "A Statement rejects a statement object when id is not a UUID",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "StatementRef",
                "id": "should fail"
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.statement-ref.invalid-id.substatement",
      "title": "A Statement rejects a substatement object when id is not a UUID",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00072",
          "section": "Data 2.4.4.3.s4.table1.row2",
          "title": "StatementRef id values are UUIDs"
        },
        {
          "id": "XAPI-00073",
          "section": "Data 2.4.4.3.s4.b1",
          "title": "StatementRef objectType values are StatementRef"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {},
          "body": {
            "kind": "json",
            "value": {
              "id": "11111111-1111-4111-8111-111111111111",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/completed",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "SubStatement",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-nested-agent@example.test",
                  "name": "Proof Agent"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/experienced",
                  "display": {
                    "en-US": "experienced"
                  }
                },
                "object": {
                  "objectType": "StatementRef",
                  "id": "should fail"
                }
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
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
          "Statement References",
          "legacy note: XAPI-00072 upstream comment - in statementrefs.js",
          "legacy note: XAPI-00073 upstream comment - in statementrefs.js",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
