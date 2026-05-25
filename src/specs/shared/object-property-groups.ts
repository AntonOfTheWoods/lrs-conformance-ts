import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const objectPropertyGroups: ConfigDrivenGroupDefinition[] = 
[
  {
    "name": "An \"object\" property's \"objectType\" property is either \"Activity\", \"Agent\", \"Group\", \"SubStatement\", or \"StatementRef\" (Vocabulary, Data 2.4.4.s2, XAPI-00046)",
    "config": [
      {
        "name": "statement activity should fail on \"activity\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.default}}"
          },
          {
            "objectType": "activity"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity should fail on \"activity\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.default}}"
          },
          {
            "objectType": "activity"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement agent template should fail on \"agent\"",
        "templates": [
          {
            "statement": "{{statements.object_actor}}"
          },
          {
            "object": "{{agents.default}}"
          },
          {
            "objectType": "agent"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement agent should fail on \"agent\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.agent}}"
          },
          {
            "object": "{{agents.default}}"
          },
          {
            "objectType": "agent"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement group should fail on \"group\"",
        "templates": [
          {
            "statement": "{{statements.object_actor}}"
          },
          {
            "object": "{{groups.default}}"
          },
          {
            "objectType": "group"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement group should fail on \"group\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.group}}"
          },
          {
            "object": "{{groups.default}}"
          },
          {
            "objectType": "group"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement StatementRef should fail on \"statementref\"",
        "templates": [
          {
            "statement": "{{statements.object_statementref}}"
          },
          {
            "objectType": "statementref"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement StatementRef should fail on \"statementref\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          },
          {
            "objectType": "statementref"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement SubStatement should fail on \"substatement\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.default}}"
          },
          {
            "objectType": "substatement"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An \"object\" property uses the \"id\" property exactly one time (Multiplicity, Data 2.4.4.1.s1.table1.row2, XAPI-00047)",
    "config": [
      {
        "name": "statement activity \"id\" not provided",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.no_id}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"id\" not provided",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_id}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An \"object\" property's \"id\" property is an IRI (Type, Data 2.2.4.4.1.table1.row2, XAPI-00047)",
    "config": [
      {
        "name": "statement activity \"id\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.default}}"
          },
          {
            "id": "ab=c://should.fail.com"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement activity \"id\" is IRI",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.default}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"id\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.default}}"
          },
          {
            "id": "ab=c://should.fail.com"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"id\" is IRI",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.default}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "An Activity's \"definition\" property is an Object (Type, Data 2.4.4.1.s1.table1.row3, XAPI-00048)",
    "config": [
      {
        "name": "statement activity \"definition\" not object",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": "should error"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"definition\" not object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": "should error"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An Activity Definition's \"name\" property is a Language Map (Type, Data 2.4.4.1.s2.table1.row1, XAPI-00056)",
    "config": [
      {
        "name": "statement object \"name\" language map is numeric",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.numeric_name}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement object \"name\" language map is string",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.string_name}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"name\" language map is numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.numeric_name}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"name\" language map is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.string_name}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An Activity Definition's \"description\" property is a Language Map (Type, Data 2.4.4.1.s2.table1.row2, XAPI-00059)",
    "config": [
      {
        "name": "statement object \"description\" language map is numeric",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.numeric_description}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement object \"description\" language map is string",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.string_description}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"description\" language map is numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.numeric_description}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"description\" language map is string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.string_description}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An Activity Definition's \"type\" property is an IRI (Type, Data 2.4.4.1.s2.table1.row3, XAPI-00060)",
    "config": [
      {
        "name": "statement activity \"type\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "type": "should error"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"type\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "type": "should error"
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
    "name": "An Activity Definition's \"moreinfo\" property is an IRL (Type, Data 2.4.4.1.s2.table1.row4, XAPI-00061)",
    "config": [
      {
        "name": "statement activity \"moreInfo\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "moreInfo": "should error"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"moreInfo\" not IRI",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "moreInfo": "should error"
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
    "name": "An Activity Definition's \"interactionType\" property is a String with a value of either “true-false”, “choice”, “fill-in”, “long-fill-in”, “matching”, “performance”, “sequencing”, “likert”, “numeric” or “other” (Data 2.4.4.1.s8.table1.row1, XAPI-00049)",
    "config": [
      {
        "name": "statement activity \"interactionType\" can be used with \"true-false\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.true_false}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"choice\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.choice}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"fill-in\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.fill_in}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"long-fill-in\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.long_fill_in}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"matching\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.matching}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"performance\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.performance}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"sequencing\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.sequencing}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"likert\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.likert}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"numeric\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.numeric}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" can be used with \"other\"",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.other}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement activity \"interactionType\" fails with invalid iri",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_iri}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement activity \"interactionType\" fails with invalid numeric",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_numeric}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement activity \"interactionType\" fails with invalid object",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_object}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement activity \"interactionType\" fails with invalid string",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_string}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"true-false\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.true_false}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"choice\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.choice}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"fill-in\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.fill_in}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"long-fill-in\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.long_fill_in}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"matching\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.matching}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"performance\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.performance}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"sequencing\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.sequencing}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"likert\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.likert}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"numeric\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.numeric}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" can be used with \"other\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.other}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" fails with invalid iri",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_iri}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" fails with invalid numeric",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_numeric}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" fails with invalid object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_object}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"interactionType\" fails with invalid string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.interaction_type_invalid_string}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "An Activity Definition's \"extension\" property is an Object (Type, Data 2.4.4.1.s2.table1.row5, XAPI-00057)",
    "config": [
      {
        "name": "statement activity \"extension\" invalid string",
        "templates": [
          {
            "statement": "{{statements.object_activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "extensions": "should error"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement activity \"extension\" invalid iri",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "extensions": {
                "id": "valid",
                "description": {
                  "en-US": "valid"
                }
              }
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"extension\" invalid string",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "extensions": "should error"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "statement substatement activity \"extension\" invalid iri",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.activity}}"
          },
          {
            "object": "{{activities.no_definition}}"
          },
          {
            "definition": {
              "extensions": {
                "id": "valid",
                "description": {
                  "en-US": "valid"
                }
              }
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
    "name": "A Sub-Statement is defined by the \"objectType\" of an \"object\" with value \"SubStatement\" (Data 2.4.4.3.s8.b1)",
    "config": [
      {
        "name": "substatement invalid when not \"SubStatement\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.default}}"
          },
          {
            "objectType": "substatement"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement follows the requirements of all Statements (Data 2.4.4.3.s8.b2, XAPI-00066)",
    "config": [
      {
        "name": "substatement requires actor",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.no_actor}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "substatement requires object",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.no_object}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "substatement requires verb",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.no_verb}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "should pass substatement context",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.context}}"
          },
          {
            "context": "{{contexts.default}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "should pass substatement result",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.result}}"
          },
          {
            "result": "{{results.default}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "should pass substatement statementref",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "should pass substatement as agent",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.agent}}"
          },
          {
            "object": "{{agents.default}}"
          }
        ],
        "expect": [
          200
        ]
      },
      {
        "name": "should pass substatement as group",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.group}}"
          },
          {
            "object": "{{groups.default}}"
          }
        ],
        "expect": [
          200
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement cannot have a Sub-Statement (Data 2.4.4.3.s8.b4, XAPI-00071)",
    "config": [
      {
        "name": "substatement invalid nested \"SubStatement\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{statements.object_substatement}}"
          },
          {
            "object": "{{statements.object_substatement_default}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement cannot use the \"id\" property at the Statement level (Data 2.4.4.3.s8.b3, XAPI-00070)",
    "config": [
      {
        "name": "substatement invalid with property \"id\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.default}}"
          },
          {
            "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement cannot use the \"stored\" property (Data 2.4.4.3.s8.b3, XAPI-00069)",
    "config": [
      {
        "name": "substatement invalid with property \"stored\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.default}}"
          },
          {
            "stored": "2013-05-18T05:32:34.804Z"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement cannot use the \"version\" property (Data 2.4.4.3.s8.b3, XAPI-00068)",
    "config": [
      {
        "name": "substatement invalid with property \"version\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.default}}"
          },
          {
            "version": "1.0.0"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Sub-Statement cannot use the \"authority\" property (Data 2.4.4.3.s8.b3, XAPI-00067)",
    "config": [
      {
        "name": "substatement invalid with property \"authority\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{statements.authority}}"
          },
          {
            "authority": "{{agents.default}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Statement Reference is defined by the \"objectType\" of an \"object\" with value \"StatementRef\" (Data 2.4.4.3.s4.b1, XAPI-00073)",
    "config": [
      {
        "name": "statementref invalid when not \"StatementRef\"",
        "templates": [
          {
            "statement": "{{statements.object_statementref}}"
          },
          {
            "object": {
              "objectType": "statementref"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "substatement statementref invalid when not \"StatementRef\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          },
          {
            "object": {
              "objectType": "statementref"
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
    "name": "A Statement Reference contains an \"id\" property (Multiplicity, Data 2.4.4.3.s4.table1.row2, XAPI-00072)",
    "config": [
      {
        "name": "statementref invalid when missing \"id\"",
        "templates": [
          {
            "statement": "{{statements.object_statementref_no_id}}"
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "substatement statementref invalid when missing \"id\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref_no_id}}"
          }
        ],
        "expect": [
          400
        ]
      }
    ]
  },
  {
    "name": "A Statement Reference's \"id\" property is a UUID (Type, Data 2.4.4.3.s4.table1.row2, XAPI-00072)",
    "config": [
      {
        "name": "statementref \"id\" not \"uuid\"",
        "templates": [
          {
            "statement": "{{statements.object_statementref}}"
          },
          {
            "object": {
              "id": "should fail"
            }
          }
        ],
        "expect": [
          400
        ]
      },
      {
        "name": "substatement statementref \"id\" not \"uuid\"",
        "templates": [
          {
            "statement": "{{statements.object_substatement}}"
          },
          {
            "object": "{{substatements.statementref}}"
          },
          {
            "object": {
              "id": "should fail"
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
