import type { SuiteDefinition } from "../../../../../domain/contracts";
export const v2ProofSliceStatementsContextActivitiesSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.context.activities",
  "title": "Context Activities",
  "specVersion": "2.0.0",
  "tags": [
    "context-activities"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.statement-parent",
      "title": "A Statement accepts a statement context verify template when contextActivities.parent is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                "contextActivities": {
                  "parent": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/verify-statement-parent"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.statement-grouping",
      "title": "A Statement accepts a statement context verify template when contextActivities.grouping is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                "contextActivities": {
                  "grouping": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/verify-statement-grouping"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.statement-category",
      "title": "A Statement accepts a statement context verify template when contextActivities.category is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                "contextActivities": {
                  "category": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/verify-statement-category"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.statement-other",
      "title": "A Statement accepts a statement context verify template when contextActivities.other is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                "contextActivities": {
                  "other": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/verify-statement-other"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.substatement-parent",
      "title": "A Statement accepts a substatement context verify template when contextActivities.parent is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                  "contextActivities": {
                    "parent": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/verify-substatement-parent"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.substatement-grouping",
      "title": "A Statement accepts a substatement context verify template when contextActivities.grouping is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                  "contextActivities": {
                    "grouping": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/verify-substatement-grouping"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.substatement-category",
      "title": "A Statement accepts a substatement context verify template when contextActivities.category is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                  "contextActivities": {
                    "category": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/verify-substatement-category"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.verify.context-activity-single.substatement-other",
      "title": "A Statement accepts a substatement context verify template when contextActivities.other is a single Activity",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00014",
          "section": "Data 2.2",
          "title": "All Objects are well-created JSON Objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "verify-template",
        "context",
        "context-activities",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
                  "contextActivities": {
                    "other": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/verify-substatement-other"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.statement-parent",
      "title": "A Statement accepts a statement context contextActivities parent values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "parent": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-parent"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.statement-grouping",
      "title": "A Statement accepts a statement context contextActivities grouping values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "grouping": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-grouping"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.statement-category",
      "title": "A Statement accepts a statement context contextActivities category values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "category": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-category"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.statement-other",
      "title": "A Statement accepts a statement context contextActivities other values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "other": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-other"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.substatement-parent",
      "title": "A Statement accepts a substatement context contextActivities parent values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "parent": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-parent"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.substatement-grouping",
      "title": "A Statement accepts a substatement context contextActivities grouping values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "grouping": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-grouping"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.substatement-category",
      "title": "A Statement accepts a substatement context contextActivities category values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "category": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-category"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.substatement-other",
      "title": "A Statement accepts a substatement context contextActivities other values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "other": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-other"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.statement-all",
      "title": "A Statement accepts a statement context contextActivities with parent, grouping, category, and other",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "parent": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-parent-all"
                  },
                  "grouping": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-grouping-all"
                  },
                  "category": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-category-all"
                  },
                  "other": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-other-all"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-keys.substatement-all",
      "title": "A Statement accepts a substatement context contextActivities with parent, grouping, category, and other",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "parent": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-parent-all"
                    },
                    "grouping": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-grouping-all"
                    },
                    "category": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-category-all"
                    },
                    "other": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-other-all"
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-invalid-key.statement",
      "title": "A Statement rejects a statement context contextActivities keys outside parent, grouping, category, and other",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "invalid": {
                    "objectType": "Activity",
                    "id": "https://example.test/xapi/activities/statement-context-invalid-key"
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-invalid-key.substatement",
      "title": "A Statement rejects a substatement context contextActivities keys outside parent, grouping, category, and other",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00093",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities only use parent, grouping, category, and other keys"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "keys",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "invalid": {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/substatement-context-invalid-key"
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.statement-parent-array",
      "title": "A Statement accepts a statement context contextActivities parent arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "parent": [
                    {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/statement-context-parent-array"
                    }
                  ]
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.statement-grouping-array",
      "title": "A Statement accepts a statement context contextActivities grouping arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "grouping": [
                    {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/statement-context-grouping-array"
                    }
                  ]
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.statement-category-array",
      "title": "A Statement accepts a statement context contextActivities category arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "category": [
                    {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/statement-context-category-array"
                    }
                  ]
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.statement-other-array",
      "title": "A Statement accepts a statement context contextActivities other arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "other": [
                    {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/statement-context-other-array"
                    }
                  ]
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
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "notes": [
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.substatement-parent-array",
      "title": "A Statement accepts a substatement context contextActivities parent arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "parent": [
                      {
                        "objectType": "Activity",
                        "id": "https://example.test/xapi/activities/substatement-context-parent-array"
                      }
                    ]
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.substatement-grouping-array",
      "title": "A Statement accepts a substatement context contextActivities grouping arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "grouping": [
                      {
                        "objectType": "Activity",
                        "id": "https://example.test/xapi/activities/substatement-context-grouping-array"
                      }
                    ]
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.substatement-category-array",
      "title": "A Statement accepts a substatement context contextActivities category arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "category": [
                      {
                        "objectType": "Activity",
                        "id": "https://example.test/xapi/activities/substatement-context-category-array"
                      }
                    ]
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-values.substatement-other-array",
      "title": "A Statement accepts a substatement context contextActivities other arrays of Activities",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "other": [
                      {
                        "objectType": "Activity",
                        "id": "https://example.test/xapi/activities/substatement-context-other-array"
                      }
                    ]
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-invalid-value.statement",
      "title": "A Statement rejects a statement context contextActivities arrays when they contain non-Activity values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                "contextActivities": {
                  "category": [
                    {
                      "objectType": "Activity",
                      "id": "https://example.test/xapi/activities/statement-context-category-invalid-array"
                    },
                    "not-an-activity"
                  ]
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
          "Statement Context Activities"
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.context.context-activities-invalid-value.substatement",
      "title": "A Statement rejects a substatement context contextActivities arrays when they contain non-Activity values",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00094",
          "section": "Data 2.4.6.2",
          "title": "ContextActivities values are Activities or arrays of Activities"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "context",
        "context-activities",
        "values",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js"
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
                  "contextActivities": {
                    "category": [
                      {
                        "objectType": "Activity",
                        "id": "https://example.test/xapi/activities/substatement-context-category-invalid-array"
                      },
                      "not-an-activity"
                    ]
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
          "Statement Context Activities"
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
