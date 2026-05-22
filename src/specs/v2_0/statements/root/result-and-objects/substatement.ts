import type { SuiteDefinition } from "../../../../../domain/contracts";
export const v2ProofSliceStatementsResultAndObjectsSubstatementSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.result-and-objects.substatement",
  "title": "SubStatements",
  "specVersion": "2.0.0",
  "tags": [
    "substatement"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.default",
      "title": "A Statement accepts a valid SubStatement object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.context",
      "title": "A Statement accepts a SubStatement that contains context",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                  "language": "en-US"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.result",
      "title": "A Statement accepts a SubStatement that contains result",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "result": {
                  "score": {
                    "scaled": 0.6767676,
                    "raw": 0.6767676,
                    "min": -1,
                    "max": 1
                  },
                  "success": true,
                  "completion": true,
                  "response": "proof result response",
                  "duration": "PT1H0M0.1S",
                  "extensions": {
                    "https://example.test/xapi/results/extensions/proof": true
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.statement-ref",
      "title": "A Statement accepts a SubStatement whose object is a StatementRef",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                  "id": "33333333-3333-4333-8333-000000000973"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.agent",
      "title": "A Statement accepts a SubStatement whose object is an Agent",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                  "objectType": "Agent",
                  "mbox": "mailto:proof-substatement-agent@example.test",
                  "name": "Proof Agent"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.acceptance.group",
      "title": "A Statement accepts a SubStatement whose object is a Group",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                  "objectType": "Group",
                  "mbox": "mailto:proof-substatement-group@example.test",
                  "name": "Proof Group",
                  "member": [
                    {
                      "objectType": "Agent",
                      "mbox": "mailto:proof-group-member@example.test",
                      "name": "Proof Agent"
                    }
                  ]
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.object-type.statement",
      "title": "A Statement rejects an objectType value that does not exactly match SubStatement",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-01002",
          "section": "Data 2.4.4.3.s8.b1",
          "title": "SubStatement objectType values are SubStatement"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "objectType": "substatement",
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
          "SubStatements",
          "legacy note: XAPI-01002 upstream comment - Rewrite parity requirement: statement metadata/header consistency remains covered in rewrite statement header/substatement cases.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.missing-fields.actor",
      "title": "A Statement rejects a SubStatement that omits actor",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "verb": {
                  "id": "https://example.test/xapi/verbs/experienced",
                  "display": {
                    "en-US": "experienced"
                  }
                },
                "object": {
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.missing-fields.verb",
      "title": "A Statement rejects a SubStatement that omits verb",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "object": {
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/substatement"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.missing-fields.object",
      "title": "A Statement rejects a SubStatement that omits object",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00066",
          "section": "Data 2.4.4.3.s8.b2",
          "title": "SubStatements follow Statement requirements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
          "SubStatements",
          "legacy note: XAPI-00066 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.forbidden-properties.authority",
      "title": "A Statement rejects a SubStatement that contains authority",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00067",
          "section": "Data 2.4.4.3.s8.b3",
          "title": "SubStatements cannot use authority"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "authority": {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-substatement-authority@example.test",
                  "name": "Proof Agent"
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
          "SubStatements",
          "legacy note: XAPI-00067 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.forbidden-properties.version",
      "title": "A Statement rejects a SubStatement that contains version",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00068",
          "section": "Data 2.4.4.3.s8.b3",
          "title": "SubStatements cannot use version"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "version": "1.0.0"
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
          "SubStatements",
          "legacy note: XAPI-00068 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.forbidden-properties.stored",
      "title": "A Statement rejects a SubStatement that contains stored",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00069",
          "section": "Data 2.4.4.3.s8.b3",
          "title": "SubStatements cannot use stored"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "stored": "2013-05-18T05:32:34.804Z"
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
          "SubStatements",
          "legacy note: XAPI-00069 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.forbidden-properties.id",
      "title": "A Statement rejects a SubStatement that contains id",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00070",
          "section": "Data 2.4.4.3.s8.b3",
          "title": "SubStatements cannot use id"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
                "id": "33333333-3333-4333-8333-000000000974"
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
          "SubStatements",
          "legacy note: XAPI-00070 upstream comment - in substatements.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.substatement.nested.substatement",
      "title": "A Statement rejects a SubStatement whose object is another SubStatement",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00071",
          "section": "Data 2.4.4.3.s8.b4",
          "title": "SubStatements cannot contain SubStatements"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "object",
        "substatement",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
        "configFile": "test/v2_0/configs/substatements.js"
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
          "SubStatements",
          "legacy note: XAPI-00071 upstream comment - in substatements.js",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
