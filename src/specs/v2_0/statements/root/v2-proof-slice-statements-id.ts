import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsIdSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.id",
  "title": "Statement Id Requirements",
  "specVersion": "2.0.0",
  "tags": [
    "id"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.id.generated-roundtrip",
      "title": "The Statements resource generates a UUID for a POST statement that omits id and returns the stored statement for that UUID",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00026",
          "section": "Data 2.4.1.s1",
          "title": "Statement POST requests may omit id and receive a generated UUID"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "generation",
        "query"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "id-generation"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js"
      },
      "execution": {
        "kind": "submit-and-query",
        "submit": {
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
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/generated-id-roundtrip",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z"
            },
            "sourceFixture": {
              "version": "2.0.0",
              "domain": "statements",
              "name": "default"
            }
          }
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {}
        },
        "capture": {
          "toQueryParam": "statementId",
          "fromSubmitJsonPath": [
            "0"
          ]
        },
        "polling": {
          "strategy": "consistent-through",
          "maxAttempts": 5,
          "intervalMs": 250
        }
      },
      "assertion": {
        "kind": "submit-and-query",
        "submitStatus": 200,
        "queryStatus": 200,
        "expectedHeaders": [
          {
            "key": "X-Experience-API-Version",
            "equals": "2.0.0"
          }
        ],
        "expectedHeaderPatterns": [],
        "queryJsonPathEquals": [],
        "queryJsonPathEqualsCaptured": [
          {
            "queryPath": [
              "id"
            ],
            "fromSubmitJsonPath": [
              "0"
            ]
          }
        ],
        "queryTextContains": [],
        "notes": [
          "proof-slice generated statement id roundtrip"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.string-form.statement-numeric",
      "title": "A Statement rejects a statement object when StatementRef id is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "id": 12345
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.string-form.statement-object",
      "title": "A Statement rejects a statement object when StatementRef id is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "id": {
                  "key": "should fail"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.string-form.substatement-numeric",
      "title": "A Statement rejects a substatement object when StatementRef id is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "id": 12345
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.string-form.substatement-object",
      "title": "A Statement rejects a substatement object when StatementRef id is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "id": {
                    "key": "should fail"
                  }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.rfc4122.statement-too-many-digits",
      "title": "A Statement rejects a statement object when StatementRef id has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "id": "AA97B177-9383-4934-8543-0F91A7A028368"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.rfc4122.statement-invalid-letter",
      "title": "A Statement rejects a statement object when StatementRef id contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "id": "MA97B177-9383-4934-8543-0F91A7A02836"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.rfc4122.substatement-too-many-digits",
      "title": "A Statement rejects a substatement object when StatementRef id has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "id": "AA97B177-9383-4934-8543-0F91A7A028368"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.statement-ref.rfc4122.substatement-invalid-letter",
      "title": "A Statement rejects a substatement object when StatementRef id contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "id": "MA97B177-9383-4934-8543-0F91A7A02836"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.string-form.statement-numeric",
      "title": "A Statement rejects a statement context when registration is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "registration": 12345
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.string-form.statement-object",
      "title": "A Statement rejects a statement context when registration is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "registration": {
                  "key": "should fail"
                }
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.string-form.substatement-numeric",
      "title": "A Statement rejects a substatement context when registration is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "registration": 12345
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.string-form.substatement-object",
      "title": "A Statement rejects a substatement context when registration is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "registration": {
                    "key": "should fail"
                  }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.rfc4122.statement-too-many-digits",
      "title": "A Statement rejects a statement context when registration has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "registration": "AA97B177-9383-4934-8543-0F91A7A028368"
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.rfc4122.statement-invalid-letter",
      "title": "A Statement rejects a statement context when registration contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "registration": "MA97B177-9383-4934-8543-0F91A7A02836"
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.rfc4122.substatement-too-many-digits",
      "title": "A Statement rejects a substatement context when registration has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "registration": "AA97B177-9383-4934-8543-0F91A7A028368"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-registration.rfc4122.substatement-invalid-letter",
      "title": "A Statement rejects a substatement context when registration contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "registration",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "registration": "MA97B177-9383-4934-8543-0F91A7A02836"
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.string-form.statement-numeric",
      "title": "A Statement rejects a statement context when context statement id is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "statement": {
                  "objectType": "StatementRef",
                  "id": 12345
                }
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.string-form.statement-object",
      "title": "A Statement rejects a statement context when context statement id is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "statement": {
                  "objectType": "StatementRef",
                  "id": {
                    "key": "should fail"
                  }
                }
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.string-form.substatement-numeric",
      "title": "A Statement rejects a substatement context when context statement id is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "statement": {
                    "objectType": "StatementRef",
                    "id": 12345
                  }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.string-form.substatement-object",
      "title": "A Statement rejects a substatement context when context statement id is an object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00029",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types are in standard string form"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "statement": {
                    "objectType": "StatementRef",
                    "id": {
                      "key": "should fail"
                    }
                  }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.rfc4122.statement-too-many-digits",
      "title": "A Statement rejects a statement context when context statement id has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "statement": {
                  "objectType": "StatementRef",
                  "id": "AA97B177-9383-4934-8543-0F91A7A028368"
                }
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.rfc4122.statement-invalid-letter",
      "title": "A Statement rejects a statement context when context statement id contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "context": {
                "statement": {
                  "objectType": "StatementRef",
                  "id": "MA97B177-9383-4934-8543-0F91A7A02836"
                }
              }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.rfc4122.substatement-too-many-digits",
      "title": "A Statement rejects a substatement context when context statement id has too many digits",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "statement": {
                    "objectType": "StatementRef",
                    "id": "AA97B177-9383-4934-8543-0F91A7A028368"
                  }
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
          "Statement Id Requirements"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.id.context-statement.rfc4122.substatement-invalid-letter",
      "title": "A Statement rejects a substatement context when context statement id contains invalid hexadecimal letters",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00030",
          "section": "Data 2.4.1.s1",
          "title": "All UUID types follow the requirements of RFC4122"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "id",
        "context",
        "statement-ref",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js"
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
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
                },
                "context": {
                  "statement": {
                    "objectType": "StatementRef",
                    "id": "MA97B177-9383-4934-8543-0F91A7A02836"
                  }
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
          "Statement Id Requirements"
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
