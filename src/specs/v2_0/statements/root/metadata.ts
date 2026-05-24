import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsMetadataSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.metadata",
  "title": "Statement Metadata",
  "specVersion": "2.0.0",
  "tags": [
    "metadata"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.timestamp.invalid-format.statement-string",
      "title": "A Statement rejects a statement timestamp when it is a non-timestamp string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
              "timestamp": "should fail"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.invalid-format.statement-date",
      "title": "A Statement rejects a statement timestamp when it is not a valid date",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
              "timestamp": "01/011/2015"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.invalid-format.substatement-string",
      "title": "A Statement rejects a substatement timestamp when it is a non-timestamp string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
                "timestamp": "should fail"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.invalid-format.substatement-date",
      "title": "A Statement rejects a substatement timestamp when it is not a valid date",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
                "timestamp": "01/011/2015"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.acceptance.statement-future",
      "title": "A Statement accepts a statement timestamp when it is a future timestamp",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
              "timestamp": "2031-05-23T12:00:00.000Z"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.acceptance.substatement-future",
      "title": "A Statement accepts a substatement timestamp when it is a future timestamp",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00022",
          "section": "Data 2.4.s1.table1.row7",
          "title": "Statement timestamps are timestamps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js"
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
                "timestamp": "2031-05-23T12:00:00.000Z"
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
          "Statement Metadata",
          "legacy note: XAPI-00022 upstream comment - in timestamp_property.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.statement-negative-zero",
      "title": "A Statement rejects a statement timestamp when it uses a -00 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
              "timestamp": "2008-09-15T15:53:00.601-00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.statement-negative-zero-compact",
      "title": "A Statement rejects a statement timestamp when it uses a -0000 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
              "timestamp": "2008-09-15T15:53:00.601-0000"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.statement-negative-zero-extended",
      "title": "A Statement rejects a statement timestamp when it uses a -00:00 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
              "timestamp": "2008-09-15T15:53:00.601-00:00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.substatement-negative-zero",
      "title": "A Statement rejects a substatement timestamp when it uses a -00 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
                "timestamp": "2008-09-15T15:53:00.601-00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.substatement-negative-zero-compact",
      "title": "A Statement rejects a substatement timestamp when it uses a -0000 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
                "timestamp": "2008-09-15T15:53:00.601-0000"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601.substatement-negative-zero-extended",
      "title": "A Statement rejects a substatement timestamp when it uses a -00:00 offset",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
                "timestamp": "2008-09-15T15:53:00.601-00:00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601-acceptance.statement-rfc3339",
      "title": "A Statement accepts a statement timestamp when it is a valid RFC 3339 timestamp",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
              "timestamp": "2008-09-15T15:53:00.601+00:00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.timestamp.iso8601-acceptance.substatement-rfc3339",
      "title": "A Statement accepts a substatement timestamp when it is a valid RFC 3339 timestamp",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00123",
          "section": "Data 4.5.s1.b1",
          "title": "Timestamps conform to ISO 8601"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "timestamp",
        "iso8601",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js"
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
                "timestamp": "2008-09-15T15:53:00.601+00:00"
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
          "Statement Metadata",
          "legacy note: XAPI-00123 upstream comment - in timestamps.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.acceptance.1-0",
      "title": "A Statement accepts version 1.0",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00101",
          "section": "Data 2.4.10.s2.b1",
          "title": "Statement version values are restricted to accepted versions"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js"
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
              "version": "1.0"
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
          "Statement Metadata",
          "legacy note: XAPI-00101 upstream comment - An LRS rejects with error code 400 Bad Request, a Request which uses \"version\" and has the value set to anything but \"1.0\" or \"1.0.x\", where x is the semantic versioning number",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.acceptance.1-0-9",
      "title": "A Statement accepts version 1.0.9",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00101",
          "section": "Data 2.4.10.s2.b1",
          "title": "Statement version values are restricted to accepted versions"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js"
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
              "version": "1.0.9"
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
          "Statement Metadata",
          "legacy note: XAPI-00101 upstream comment - An LRS rejects with error code 400 Bad Request, a Request which uses \"version\" and has the value set to anything but \"1.0\" or \"1.0.x\", where x is the semantic versioning number",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.invalid.string",
      "title": "A Statement rejects version strings outside the accepted version range",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00101",
          "section": "Data 2.4.10.s2.b1",
          "title": "Statement version values are restricted to accepted versions"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js"
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
              "version": "should fail"
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
          "Statement Metadata",
          "legacy note: XAPI-00101 upstream comment - An LRS rejects with error code 400 Bad Request, a Request which uses \"version\" and has the value set to anything but \"1.0\" or \"1.0.x\", where x is the semantic versioning number",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.invalid.0-9-9",
      "title": "A Statement rejects version 0.9.9",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00101",
          "section": "Data 2.4.10.s2.b1",
          "title": "Statement version values are restricted to accepted versions"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js"
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
              "version": "0.9.9"
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
          "Statement Metadata",
          "legacy note: XAPI-00101 upstream comment - An LRS rejects with error code 400 Bad Request, a Request which uses \"version\" and has the value set to anything but \"1.0\" or \"1.0.x\", where x is the semantic versioning number",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.invalid.1-1-0",
      "title": "A Statement rejects version 1.1.0",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00101",
          "section": "Data 2.4.10.s2.b1",
          "title": "Statement version values are restricted to accepted versions"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js",
        "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js"
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
              "version": "1.1.0"
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
          "Statement Metadata",
          "legacy note: XAPI-00101 upstream comment - An LRS rejects with error code 400 Bad Request, a Request which uses \"version\" and has the value set to anything but \"1.0\" or \"1.0.x\", where x is the semantic versioning number",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.version.retained-roundtrip",
      "title": "The Statements resource retains version when a statement is accepted and later retrieved",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00332",
          "section": "Data 2.4.10",
          "title": "Retrieved statements retain the submitted version property"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "version",
        "query",
        "retrieval"
      ],
      "capabilityFlags": [
        "version",
        "query",
        "retrieval"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js"
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
              "id": "33333333-3333-4333-8333-000000000212",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:learner@example.test",
                "name": "Learner Example"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/version-retained-roundtrip",
                "display": {
                  "en-US": "completed"
                }
              },
              "object": {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/first-proof-slice"
              },
              "timestamp": "2026-05-23T12:00:00Z",
              "version": "2.0.0"
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
            "statementId": "33333333-3333-4333-8333-000000000212"
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
              "version"
            ],
            "equals": "2.0.0"
          }
        ],
        "queryJsonPathEqualsCaptured": [],
        "queryTextContains": [],
        "notes": [
          "proof-slice statement version roundtrip",
          "legacy note: XAPI-00332 upstream comment - in Data 2.4.10 Statements Version Property",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.stored.post-overwrites-client-value",
      "title": "The Statements resource overwrites a submitted stored value on POST",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00097",
          "section": "Data 2.4.8.s3.b2",
          "title": "LRS assigns the stored property when statements are received"
        },
        {
          "id": "XAPI-00023",
          "section": "Data 2.4.8.s2",
          "title": "A \"stored\" property is a valid TimeStamp assigned by the LRS"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "stored",
        "post",
        "retrieval"
      ],
      "capabilityFlags": [
        "stored",
        "query",
        "retrieval"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Stored-Requirements.js"
      },
      "execution": {
        "kind": "request-sequence",
        "steps": [
          {
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
                "id": "33333333-3333-4333-8333-000000000210",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:learner@example.test",
                  "name": "Learner Example"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/stored-post-overwrite",
                  "display": {
                    "en-US": "completed"
                  }
                },
                "object": {
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/first-proof-slice"
                },
                "timestamp": "2026-05-23T12:03:30.000Z",
                "stored": "2011-07-15T00:00:00.000Z"
              },
              "sourceFixture": {
                "version": "2.0.0",
                "domain": "statements",
                "name": "default"
              }
            }
          },
          {
            "method": "GET",
            "endpoint": "statements",
            "authMode": "basic",
            "headers": {
              "X-Experience-API-Version": "2.0.0"
            },
            "query": {
              "statementId": "33333333-3333-4333-8333-000000000210"
            }
          }
        ]
      },
      "assertion": {
        "kind": "request-sequence",
        "steps": [
          {
            "status": 200,
            "expectedHeaders": [],
            "expectedHeaderPatterns": [],
            "jsonPathEquals": [
              {
                "path": [],
                "equals": [
                  "33333333-3333-4333-8333-000000000210"
                ]
              }
            ],
            "jsonPathNotEquals": [],
            "textContains": [],
            "expectedHeaderDateAfterStep": []
          },
          {
            "status": 200,
            "expectedHeaders": [],
            "expectedHeaderPatterns": [],
            "jsonPathEquals": [],
            "jsonPathNotEquals": [
              {
                "path": [
                  "stored"
                ],
                "equals": "2011-07-15T00:00:00.000Z"
              }
            ],
            "textContains": [],
            "expectedHeaderDateAfterStep": []
          }
        ],
        "notes": [
          "proof-slice stored property overwrite on POST",
          "legacy note: XAPI-00097 upstream comment - An LRS MUST assign the \"stored\" property timestamp upon receiving a statement.",
          "legacy note: XAPI-00097 upstream describe - An LRS MUST accept statements with the stored property",
          "legacy note: XAPI-00023 upstream comment - in Data 2.4.8 Stored Property",
          "legacy note: XAPI-00023 upstream describe - A stored property must be a TimeStamp",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.stored.put-overwrites-client-value",
      "title": "The Statements resource overwrites a submitted stored value on PUT",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00097",
          "section": "Data 2.4.8.s3.b2",
          "title": "LRS assigns the stored property when statements are received"
        },
        {
          "id": "XAPI-00023",
          "section": "Data 2.4.8.s2",
          "title": "A \"stored\" property is a valid TimeStamp assigned by the LRS"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "stored",
        "put",
        "retrieval"
      ],
      "capabilityFlags": [
        "stored",
        "query",
        "retrieval"
      ],
      "legacyTrace": {
        "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Stored-Requirements.js"
      },
      "execution": {
        "kind": "request-sequence",
        "steps": [
          {
            "method": "PUT",
            "endpoint": "statements",
            "authMode": "basic",
            "headers": {
              "X-Experience-API-Version": "2.0.0"
            },
            "query": {
              "statementId": "33333333-3333-4333-8333-000000000211"
            },
            "body": {
              "kind": "json",
              "value": {
                "id": "33333333-3333-4333-8333-000000000211",
                "actor": {
                  "objectType": "Agent",
                  "mbox": "mailto:learner@example.test",
                  "name": "Learner Example"
                },
                "verb": {
                  "id": "https://example.test/xapi/verbs/stored-put-overwrite",
                  "display": {
                    "en-US": "completed"
                  }
                },
                "object": {
                  "objectType": "Activity",
                  "id": "https://example.test/xapi/activities/first-proof-slice"
                },
                "timestamp": "2026-05-23T12:03:31.000Z",
                "stored": "2011-07-15T00:00:00.000Z"
              },
              "sourceFixture": {
                "version": "2.0.0",
                "domain": "statements",
                "name": "default"
              }
            }
          },
          {
            "method": "GET",
            "endpoint": "statements",
            "authMode": "basic",
            "headers": {
              "X-Experience-API-Version": "2.0.0"
            },
            "query": {
              "statementId": "33333333-3333-4333-8333-000000000211"
            }
          }
        ]
      },
      "assertion": {
        "kind": "request-sequence",
        "steps": [
          {
            "status": 204,
            "expectedHeaders": [],
            "expectedHeaderPatterns": [],
            "jsonPathEquals": [],
            "jsonPathNotEquals": [],
            "textContains": [],
            "expectedHeaderDateAfterStep": []
          },
          {
            "status": 200,
            "expectedHeaders": [],
            "expectedHeaderPatterns": [],
            "jsonPathEquals": [],
            "jsonPathNotEquals": [
              {
                "path": [
                  "stored"
                ],
                "equals": "2011-07-15T00:00:00.000Z"
              }
            ],
            "textContains": [],
            "expectedHeaderDateAfterStep": []
          }
        ],
        "notes": [
          "proof-slice stored property overwrite on PUT",
          "legacy note: XAPI-00097 upstream comment - An LRS MUST assign the \"stored\" property timestamp upon receiving a statement.",
          "legacy note: XAPI-00097 upstream describe - An LRS MUST accept statements with the stored property",
          "legacy note: XAPI-00023 upstream comment - in Data 2.4.8 Stored Property",
          "legacy note: XAPI-00023 upstream describe - A stored property must be a TimeStamp",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
