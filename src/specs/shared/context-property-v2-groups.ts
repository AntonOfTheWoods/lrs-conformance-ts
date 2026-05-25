import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const contextPropertyV2Groups: ConfigDrivenGroupDefinition[] = 
[
  {
    "name": "A \"contextAgents\" property is an array of \"contextAgent\" Objects.",
    "config": [
      {
        "name": "Statement with \"contextAgents\" property has an array of valid \"contextAgent\" Objects",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.context_agents}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "Statement substatement with \"contextAgents\" property has an array of valid \"contextAgent\" Objects",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.context_agents}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "A \"contextAgents\" Object must have an \"objectType\" property of string \"contextAgent\" and a valid Agent Object \"agent\"",
    "config": [
      {
        "name": "Statement with \"contextAgents\" Object rejects statement if \"objectType\" property is anything other than string \"contextAgent\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "Should fail",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextAgents\" Object rejects statement if \"agent\" property is invalid",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "key": "Should fail"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextAgents\" Object rejects statement if \"relevantTypes\" is empty",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": []
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextAgents\" Object rejects statement if \"relevantTypes\" contains non-IRI elements",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": [
                    "abc"
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextAgents\" Object rejects statement if \"objectType\" property is anything other than string \"contextAgent\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "Should fail",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextAgents\" Object rejects statement if \"agent\" property is invalid",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "key": "Should fail"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextAgents\" Object rejects statement if \"relevantTypes\" is empty",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": []
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextAgents\" Object rejects statement if \"relevantTypes\" contains non-IRI elements",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextAgents": [
                {
                  "objectType": "contextAgent",
                  "agent": {
                    "objectType": "Agent",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": [
                    "abc"
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A \"contextGroups\" property is an array of \"contextGroup\" Objects",
    "config": [
      {
        "name": "Statement with \"contextGroups\" property has an array of valid \"contextGroup\" Objects",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.context_groups}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "Statement substatement with \"contextGroups\" property has an array of valid \"contextGroup\" Objects",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.context_groups}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "A \"contextGroups\" Object must have an \"objectType\" property of string \"contextGroup\" and a valid Group Object \"group\"",
    "config": [
      {
        "name": "Statement with \"contextGroups\" Object rejects statement if \"objectType\" property is anything other than string \"contextGroup\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "Should fail",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:team-1@example.com"
                  },
                  "member": [
                    {
                      "objectType": "Agent",
                      "mbox": "mailto:player-1@example.com"
                    }
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextGroups\" Object rejects statement if \"group\" property is invalid",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "key": "Should fail"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextGroups\" Object rejects statement if \"relevantTypes\" is empty",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": []
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement with \"contextGroups\" Object rejects statement if \"relevantTypes\" contains non-IRI elements",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": [
                    "abc"
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextGroups\" Object rejects statement if \"objectType\" property is anything other than string \"contextGroup\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "Should fail",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:team-1@example.com"
                  },
                  "member": [
                    {
                      "objectType": "Agent",
                      "mbox": "mailto:player-1@example.com"
                    }
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextGroups\" Object rejects statement if \"group\" property is invalid",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "key": "Should fail"
                  }
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextGroups\" Object rejects statement if \"relevantTypes\" is empty",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": []
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "Statement substatement with \"contextGroups\" Object rejects statement if \"relevantTypes\" contains non-IRI elements",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": {
              "contextGroups": [
                {
                  "objectType": "contextGroup",
                  "group": {
                    "objectType": "Group",
                    "mbox": "mailto:player-1@example.com"
                  },
                  "relevantTypes": [
                    "abc"
                  ]
                }
              ]
            }
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  }
]
;
