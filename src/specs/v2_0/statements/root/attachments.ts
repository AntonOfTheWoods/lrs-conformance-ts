import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsAttachmentsSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.attachments",
  "title": "Statement Attachments",
  "specVersion": "2.0.0",
  "tags": [
    "attachments"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.attachments.acceptance.array",
      "title": "A Statement accepts the \"attachments\" property when it is an array of Attachment objects",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00025",
          "section": "Data 2.4.s1.table1.row11",
          "title": "Statement attachments are arrays of Attachment objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "acceptance"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00025 upstream comment - in attachments.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.not-array.statement",
      "title": "A Statement rejects the \"attachments\" property when it is not an array",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00025",
          "section": "Data 2.4.s1.table1.row11",
          "title": "Statement attachments are arrays of Attachment objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": {
                "usageType": "http://example.com/attachment-usage/test",
                "display": {
                  "en-US": "A test attachment"
                },
                "description": {
                  "en-US": "A test attachment (description)"
                },
                "contentType": "text/plain; charset=ascii",
                "length": 27,
                "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                "fileUrl": "http://over.there.com/file.txt"
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
          "Statement Attachments",
          "legacy note: XAPI-00025 upstream comment - in attachments.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.entry-not-object.numeric",
      "title": "A Statement rejects attachments when an entry is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00025",
          "section": "Data 2.4.s1.table1.row11",
          "title": "Statement attachments are arrays of Attachment objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                12345
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00025 upstream comment - in attachments.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.entry-not-object.string",
      "title": "A Statement rejects attachments when an entry is a string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00025",
          "section": "Data 2.4.s1.table1.row11",
          "title": "Statement attachments are arrays of Attachment objects"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                "should fail"
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00025 upstream comment - in attachments.js",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.usage-type.string",
      "title": "A Statement rejects an attachment when usageType is not an IRI",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00107",
          "section": "Data 2.4.11.s2.table1.row1",
          "title": "Attachment usageType values are IRIs"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "should fail",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00107 upstream comment - A \"usageType\" property is an IRI. The LRS rejects with 400 Bad Request a statement which does not have a \"usageType\" property or the \"usageType\" property value is not a valid IRI in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.content-type.numeric",
      "title": "A Statement rejects an attachment when contentType is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00105",
          "section": "Data 2.4.11.s2.table1.row4",
          "title": "Attachment contentType values are Internet Media Types"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": 999,
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00105 upstream comment - A \"contentType\" property is an Internet Media/MIME type. The LRS rejects with 400 Bad Request a statement which does not have a “contentType” property or the “contentType” property value is not Internet Media/MIME in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.length.string",
      "title": "A Statement rejects an attachment when length is not an integer",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00102",
          "section": "Data 2.4.11.s2.table1.row5",
          "title": "Attachment length values are integers"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": "should fail",
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00102 upstream comment - A \"length\" property is an Integer. The LRS rejects with 400 Bad Request a statement whichdoes not have a “length” property or the “length” property is not a valid integer in octets in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.sha2.numeric",
      "title": "A Statement rejects an attachment when sha2 is not a hash string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00103",
          "section": "Data 2.4.11.s2.table1.row6",
          "title": "Attachment sha2 values are hash strings"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": 12345,
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00103 upstream comment - A \"sha2\" property is a String. The LRS rejects with 400 Bad Request a statement which does not have a “sha2” property or the ”sha2” property is not a valid hash in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.file-url.string",
      "title": "A Statement rejects an attachment when fileUrl is not an IRI",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00104",
          "section": "Data 2.4.11.s2.table1.row7",
          "title": "Attachment fileUrl values are IRIs when present"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "should fail"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00104 upstream comment - A \"fileUrl\" property is an IRL. The LRS rejects with 400 Bad Request a statement the “fileURL” property if it is present and it is not a valid IRL in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.display-type.numeric",
      "title": "A Statement rejects an attachment when display is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00106",
          "section": "Data 2.4.11.s2.table1.row2",
          "title": "Attachment display and description values are language maps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": 12345,
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00106 upstream comment - A \"display\" property is a Language Map. The LRS rejects with 400 Bad Request a statement which does not have a “display” property or the “display” property value is not a valid Language Map in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.display-type.string",
      "title": "A Statement rejects an attachment when display is a string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00106",
          "section": "Data 2.4.11.s2.table1.row2",
          "title": "Attachment display and description values are language maps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": "should fail",
                  "description": {
                    "en-US": "A test attachment (description)"
                  },
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00106 upstream comment - A \"display\" property is a Language Map. The LRS rejects with 400 Bad Request a statement which does not have a “display” property or the “display” property value is not a valid Language Map in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.description-type.numeric",
      "title": "A Statement rejects an attachment when description is numeric",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00106",
          "section": "Data 2.4.11.s2.table1.row2",
          "title": "Attachment display and description values are language maps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": 12345,
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00106 upstream comment - A \"display\" property is a Language Map. The LRS rejects with 400 Bad Request a statement which does not have a “display” property or the “display” property value is not a valid Language Map in the Attachment Object.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.attachments.description-type.string",
      "title": "A Statement rejects an attachment when description is a string",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00106",
          "section": "Data 2.4.11.s2.table1.row2",
          "title": "Attachment display and description values are language maps"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "attachments",
        "validation"
      ],
      "capabilityFlags": [],
      "legacyTrace": {
        "suiteFile": "test/v2_0/4.2.2.6-Attachment-Requirements.js",
        "configFile": "test/v2_0/configs/attachments.js"
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
              "attachments": [
                {
                  "usageType": "http://example.com/attachment-usage/test",
                  "display": {
                    "en-US": "A test attachment"
                  },
                  "description": "should error",
                  "contentType": "text/plain; charset=ascii",
                  "length": 27,
                  "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                  "fileUrl": "http://over.there.com/file.txt"
                }
              ]
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
          "Statement Attachments",
          "legacy note: XAPI-00106 upstream comment - A \"display\" property is a Language Map. The LRS rejects with 400 Bad Request a statement which does not have a “display” property or the “display” property value is not a valid Language Map in the Attachment Object.",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
