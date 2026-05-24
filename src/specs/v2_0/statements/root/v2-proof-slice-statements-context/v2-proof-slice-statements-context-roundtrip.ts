import type { SuiteDefinition } from "../../../../../domain/contracts";
export const v2ProofSliceStatementsContextRoundtripSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.context.roundtrip",
  "title": "Context Roundtrip",
  "specVersion": "2.0.0",
  "tags": [
    "retrieval"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.statement-parent",
      "title": "The Statements resource returns a statement context contextActivities parent values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000934",
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
                "contextActivities": {
                  "parent": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-roundtrip-parent"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000934"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "context",
              "contextActivities",
              "parent"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/statement-context-roundtrip-parent"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.statement-grouping",
      "title": "The Statements resource returns a statement context contextActivities grouping values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000935",
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
                "contextActivities": {
                  "grouping": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-roundtrip-grouping"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000935"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "context",
              "contextActivities",
              "grouping"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/statement-context-roundtrip-grouping"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.statement-category",
      "title": "The Statements resource returns a statement context contextActivities category values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000936",
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
                "contextActivities": {
                  "category": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-roundtrip-category"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000936"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "context",
              "contextActivities",
              "category"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/statement-context-roundtrip-category"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.statement-other",
      "title": "The Statements resource returns a statement context contextActivities other values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000937",
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
                "contextActivities": {
                  "other": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-roundtrip-other"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000937"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "context",
              "contextActivities",
              "other"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/statement-context-roundtrip-other"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.substatement-parent",
      "title": "The Statements resource returns a substatement context contextActivities parent values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000938",
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
                  "contextActivities": {
                    "parent": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-roundtrip-parent"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000938"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "object",
              "context",
              "contextActivities",
              "parent"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/substatement-context-roundtrip-parent"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.substatement-grouping",
      "title": "The Statements resource returns a substatement context contextActivities grouping values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000939",
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
                  "contextActivities": {
                    "grouping": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-roundtrip-grouping"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000939"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "object",
              "context",
              "contextActivities",
              "grouping"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/substatement-context-roundtrip-grouping"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.substatement-category",
      "title": "The Statements resource returns a substatement context contextActivities category values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000940",
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
                  "contextActivities": {
                    "category": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-roundtrip-category"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000940"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "object",
              "context",
              "contextActivities",
              "category"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/substatement-context-roundtrip-category"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-roundtrip.substatement-other",
      "title": "The Statements resource returns a substatement context contextActivities other values as arrays",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00096",
          "section": "Data 2.4.6.2",
          "title": "Retrieved ContextActivities values are arrays"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "retrieval"
      ],
      "capabilityFlags": [
        "query",
        "retrieval",
        "context-activities"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
              "id": "33333333-3333-4333-8333-000000000941",
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
                  "contextActivities": {
                    "other": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-roundtrip-other"
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
        },
        "query": {
          "method": "GET",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0"
          },
          "query": {
            "statementId": "33333333-3333-4333-8333-000000000941"
          }
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
        "queryJsonPathEquals": [
          {
            "path": [
              "object",
              "context",
              "contextActivities",
              "other"
            ],
            "equals": [
              {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/substatement-context-roundtrip-other"
              }
            ]
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice contextActivities retrieval returns arrays"
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
