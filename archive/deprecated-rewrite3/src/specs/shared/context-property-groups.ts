import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const contextPropertyGroups: ConfigDrivenGroupDefinition[] = 
[
  {
    "name": "A \"registration\" property is a UUID (Type, Data 2.4.6.s3.table1.row1, XAPI-00087-1)",
    "config": [
      {
        "name": "statement context \"registration\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "registration": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"registration\" is string",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "registration": "should fail"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"registration\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "registration": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"registration\" is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "registration": "should fail"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An \"instructor\" property is an Agent (Type, Data 2.4.6.s3.table1.row2, XAPI-00087-2)",
    "config": [
      {
        "name": "statement context \"instructor\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.instructor}}"
          },
          {
            "instructor": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"instructor\" is string",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.instructor}}"
          },
          {
            "instructor": "should fail"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"instructor\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.instructor}}"
          },
          {
            "instructor": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"instructor\" is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.instructor}}"
          },
          {
            "instructor": "should fail"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An \"team\" property is a Group (Type, Data 2.4.6.s3.table1.row3, XAPI-00088)",
    "config": [
      {
        "name": "statement context \"team\" is agent",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": "{{agents.default}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"team\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"team\" is string",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": "should fail"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"team\" is agent",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": "{{agents.default}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"team\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"team\" is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.team}}"
          },
          {
            "team": "should fail"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A \"contextActivities\" property is an Object (Type, Data 2.4.6.s3.table1.row4, XAPI-00086)",
    "config": [
      {
        "name": "statement context \"contextActivities\" is string",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "contextActivities": "should fail"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "contextActivities": "should fail"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A \"revision\" property is a String (Type, Data 2.4.6.s3.table1.row5, XAPI-00089)",
    "config": [
      {
        "name": "statement context \"revision\" is numeric",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "revision": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"revision\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "revision": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"revision\" is numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "revision": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"revision\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "revision": {
              "key": "should fail"
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
    "name": "A Statement cannot contain both a \"revision\" property in its \"context\" property and have the value of the \"object\" property's \"objectType\" be anything but \"Activity\" (Data 2.4.6.s4.b1, XAPI-00084)",
    "config": [
      {
        "name": "statement context \"revision\" is invalid with object agent",
        "templates": [
          {
            "statement": "{{statements.object_agent_default}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"revision\" is invalid with object group",
        "templates": [
          {
            "statement": "{{statements.object_group_default}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"revision\" is invalid with statementref",
        "templates": [
          {
            "statement": "{{statements.object_statementref}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"revision\" is invalid with substatement",
        "templates": [
          {
            "statement": "{{statements.object_substatement_default}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"revision\" is valid with no ObjectType",
        "templates": [
          {
            "statement": "{{statements.context_sans_objectType}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"revision\" is invalid with object agent",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.agent_default}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"revision\" is invalid with object group",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.group_default}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"revision\" is invalid with statementref",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"revision\" is valid with no objectType",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{statements.context_sans_objectType}}"
          },
          {
            "context": "{{contexts.no_platform}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "A \"platform\" property is a String (Type, Data 2.4.6.s3.table1.row6, XAPI-00090)",
    "config": [
      {
        "name": "statement context \"platform\" is numeric",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "platform": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"platform\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "platform": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"platform\" is numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "platform": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"platform\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "platform": {
              "key": "should fail"
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
    "name": "A Statement cannot contain both a \"platform\" property in its \"context\" property and have the value of the \"object\" property's \"objectType\" be anything but \"Activity\" (Data 2.4.6.s4.b2, XAPI-00085)",
    "config": [
      {
        "name": "statement context \"platform\" is invalid with object agent",
        "templates": [
          {
            "statement": "{{statements.object_agent_default}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"platform\" is invalid with object group",
        "templates": [
          {
            "statement": "{{statements.object_group_default}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"platform\" is invalid with statementref",
        "templates": [
          {
            "statement": "{{statements.object_statementref}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"platform\" is invalid with substatement",
        "templates": [
          {
            "statement": "{{statements.object_substatement_default}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"platform\" is valid with empty objectType",
        "templates": [
          {
            "statement": "{{statements.context_sans_objectType}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"platform\" is invalid with object agent",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.agent_default}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"platform\" is invalid with object group",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.group_default}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"platform\" is invalid with statementref",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"platform\" is valid with empty ObjectType",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{statements.context_sans_objectType}}"
          },
          {
            "context": "{{contexts.no_revision}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "A \"language\" property is a String (Type, Data 2.4.6.s3.table1.row7, XAPI-00091)",
    "config": [
      {
        "name": "statement context \"language\" is numeric",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"language\" is object",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"language\" is numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": 12345
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"language\" is object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": {
              "key": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"language\" is is invalid language",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": {
              "a12345": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"language\" is is invalid language",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "language": {
              "a12345": "should fail"
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
    "name": "A \"statement\" property is a Statement Reference (Type, Data 2.4.6.s3.table1.row8, XAPI-00092)",
    "config": [
      {
        "name": "statement context \"statement\" invalid with \"statementref\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "statement": {
              "objectType": "statementref"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement context \"statement\" invalid with \"id\" not UUID",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "statement": {
              "id": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"statement\" invalid with \"statementref\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "statement": {
              "objectType": "statementref"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"statement\" invalid with \"id\" not UUID",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          },
          {
            "statement": {
              "id": "should fail"
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
    "name": "A \"contextActivities\" property's \"key\" has a value of \"parent\", \"grouping\", \"category\", or \"other\" (Format, Data 2.4.6.2.s4.b1, XAPI-00093)",
    "config": [
      {
        "name": "statement context \"contextActivities\" is \"parent\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.parent}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities\" is \"grouping\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.grouping}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities\" is \"category\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.category}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities\" is \"other\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities\" accepts all property keys \"parent\", \"grouping\", \"category\", and \"other\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.all_activities}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities\" rejects any property key other than \"parent\", \"grouping\", \"category\", or \"other\"",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.invalid_activity}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" is \"parent\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.parent}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" is \"grouping\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.grouping}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" is \"category\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.category}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" is \"other\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" accepts all property keys \"parent\", \"grouping\", \"category\", and \"other\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.all_activities}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities\" rejects any property key other than \"parent\", \"grouping\", \"category\", or \"other\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.invalid_activity}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A \"contextActivities\" property's \"value\" is an Activity (Format, Data 2.4.6.2.s4.b2, XAPI-00094)",
    "config": [
      {
        "name": "statement context \"contextActivities parent\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.parent}}"
          },
          {
            "contextActivities": {
              "parent": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities grouping\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.grouping}}"
          },
          {
            "contextActivities": {
              "grouping": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities category\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.category}}"
          },
          {
            "contextActivities": {
              "category": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context \"contextActivities other\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          },
          {
            "contextActivities": {
              "other": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement context contextActivities property's value is activity array with activities",
        "templates": [
          {
            "statement": "{{statements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          },
          {
            "contextActivities": {
              "other": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                },
                {
                  "key": "should fail"
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
        "name": "statement substatement context \"contextActivities parent\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.parent}}"
          },
          {
            "contextActivities": {
              "parent": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities grouping\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.grouping}}"
          },
          {
            "contextActivities": {
              "grouping": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities category\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.category}}"
          },
          {
            "contextActivities": {
              "category": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities other\" value is activity array",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          },
          {
            "contextActivities": {
              "other": [
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
                }
              ]
            }
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement context \"contextActivities property's value is activity array",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.other}}"
          },
          {
            "contextActivities": {
              "other": [
                {
                  "key": "should fail"
                },
                {
                  "objectType": "Activity",
                  "id": "http://www.example.com/meetings/occurances/34534"
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
