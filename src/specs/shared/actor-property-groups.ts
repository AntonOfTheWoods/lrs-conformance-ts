import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const actorPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    name: 'An "actor" property\'s "objectType" property is either "Agent" or "Group" (Vocabulary, Data 2.4.2.1, Data 2.4.2.2, XAPI-00031)',
    config: [
      {
        name: 'statement actor "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent with "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group with "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s actor "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s actor "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "objectType" should fail when not "Agent"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: "agent",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "objectType" should fail when not "Group"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: "group",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An "objectType" property is a String (Type, Data 2.4.2.1.s2.table1.row1, XAPI-00032)',
    config: [
      {
        name: 'statement actor "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent with "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent with "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "objectType" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "objectType" should fail object',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            objectType: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "name" property is a String (Type, Data 2.4.2.1.s2.table1.row2, XAPI-00033)',
    config: [
      {
        name: 'statement actor "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "name" should fail object',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "name" should fail object',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "name" should fail object',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent with "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent with "name" should fail object',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "name" should fail object',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "name" should fail numeric',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            name: 123,
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "name" should fail object',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
          {
            name: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An "actor" property with "objectType" as "Agent" uses one of the following properties: "mbox", "mbox_sha1sum", "openid", "account" (Multiplicity, Data 2.4.2.1.s2.b1, XAPI-00034)',
    config: [
      {
        name: 'statement actor without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "account" should pass',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor "mbox" should pass',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor "openid" should pass',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" should pass',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "mbox" should pass',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "openid" should pass',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" should pass',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "mbox" should pass',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "openid" should pass',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as agent without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "account" should pass',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as agent "mbox" should pass',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as agent "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as agent "openid" should pass',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s agent without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s agent "mbox" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s agent "openid" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor without "account", "mbox", "mbox_sha1sum", "openid" should fail',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "mbox" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "openid" should pass',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'An Agent is defined by "objectType" of an "actor" property or "object" property with value "Agent" (Data 2.4.2.1.s2.table1.row1, XAPI-00034)',
    config: [
      {
        name: "statement actor does not require objectType",
        templates: [
          {
            statement: "{{statements.no_actor}}",
          },
          {
            actor: {
              name: "xAPI mbox",
              mbox: "mailto:xapi@adlnet.gov",
            },
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as agent "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s agent "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "objectType" accepts "Agent"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.default}}",
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'An Agent does not use the "mbox" property if "mbox_sha1sum", "openid", or "account" are used (Multiplicity, Data 2.4.2.1.s2.b2, XAPI-00034)',
    config: [
      {
        name: 'statement actor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Agent does not use the "mbox_sha1sum" property if "mbox", "openid", or "account" are used (Multiplicity, Data 2.4.2.1.s2.b2, XAPI-00034)',
    config: [
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Agent does not use the "account" property if "mbox", "mbox_sha1sum", or "openid" are used (Multiplicity, Data 2.4.2.1.s2.b2, XAPI-00034)',
    config: [
      {
        name: 'statement actor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Agent does not use the "openid" property if "mbox", "mbox_sha1sum", or "account" are used (Multiplicity, Data 2.4.2.1.s2.b2, XAPI-00034)',
    config: [
      {
        name: 'statement actor "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as agent "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Anonymous Group uses the "member" property (Multiplicity, Data 2.4.2.2.s2.table1.row3, XAPI-00035)',
    config: [
      {
        name: "statement actor anonymous group missing member",
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: "statement authority anonymous group missing member",
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: "statement context instructor anonymous group missing member",
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: "statement context team anonymous group missing member",
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: "statement substatement as group anonymous group missing member",
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s group anonymous group missing member',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor anonymous group missing member',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team anonymous group missing member',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.default}}",
          },
          {
            member: "{{groups.anonymous_no_member}}",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'The "member" property is an array of Objects following Agent requirements (Data 2.4.2.2.s2.table2.row3, XAPI-00036)',
    config: [
      {
        name: 'statement actor requires member type "array"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority requires member type "array"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor requires member type "array"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team requires member type "array"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group requires member type "array"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s group requires member type "array"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor requires member type "array"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team requires member type "array"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.default}}",
          },
          {
            member: "{{agents.default}}",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Identified Group is defined by "objectType" of an "actor" or "object" with value "Group" and by one of "mbox", "mbox_sha1sum", "openid", or "account" being used (Data 2.4.2.2.s2.table2.row1, XAPI-00037)',
    config: [
      {
        name: 'statement actor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'An Identified Group uses one of the following properties: "mbox", "mbox_sha1sum", "openid", "account" (Multiplicity, Data 2.4.2.2.s2.table2.row4, XAPI-00037)',
    config: [
      {
        name: 'statement actor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s group identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid_no_member}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team identified group accepts "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account_no_member}}",
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'An Identified Group does not use the "mbox" property if "mbox_sha1sum", "openid", or "account" are used (Multiplicity, Data 2.4.2.2.s5.b1, XAPI-00037)',
    config: [
      {
        name: 'statement actor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox" cannot be used with "openid',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Identified Group does not use the "mbox_sha1sum" property if "mbox", "openid", or "account" are used (Multiplicity, Data 2.4.2.2.s5.b1, XAPI-00037)',
    config: [
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "mbox_sha1sum" cannot be used with "openid',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox_sha1sum" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox_sha1sum" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "mbox_sha1sum" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Identified Group does not use the "openid" property if "mbox", "mbox_sha1sum", or "account" are used (Multiplicity, Data 2.4.2.2.s5.b1, XAPI-00037)',
    config: [
      {
        name: 'statement actor "openid" cannot be used with "account',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "openid" cannot be used with "account"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            account: {
              homePage: "http://www.example.com",
              name: "xAPI account name",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "openid" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "openid" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_openid}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Identified Group does not use the "account" property if "mbox", "mbox_sha1sum", or "openid" are used (Multiplicity, Data 2.4.2.2.s5.b1, XAPI-00037)',
    config: [
      {
        name: 'statement actor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "account" cannot be used with "openid',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as group "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.default}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s agent "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "account" cannot be used with "mbox"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            mbox: "mailto:xapi@adlnet.gov",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "account" cannot be used with "mbox_sha1sum"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            mbox_sha1sum: "cd9b00a5611f94eaa7b1661edab976068e364975",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "account" cannot be used with "openid"',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.team}}",
          },
          {
            team: "{{groups.identified_account}}",
          },
          {
            openid: "http://openid.example.org/12345",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An "mbox" property has the form "mailto:email address" and is an IRI (Type, Data 2.4.2.3.s3.table1.row1, XAPI-00038)',
    config: [
      {
        name: 'statement actor "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group mbox" not IRI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "http://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group mbox" not mailto:email address',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox}}",
          },
          {
            mbox: "mailto:should.fail.com",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An "mbox_sha1sum" property is a String (Type, Data 2.4.2.3.s3.table1.row2, XAPI-00039)',
    config: [
      {
        name: 'statement actor "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group mbox_sha1sum" not string',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_mbox_sha1sum}}",
          },
          {
            mbox_sha1sum: {
              key: "value",
            },
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An "openid" property is a URI (Type, Data 2.4.2.3.s3.table1.row3, XAPI-00040)',
    config: [
      {
        name: 'statement actor "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group openid" not URI',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group openid" not URI',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group openid" not URI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group openid" not URI',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group openid" not URI',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group openid" not URI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent openid" not URI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group openid" not URI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group openid" not URI',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_openid}}",
          },
          {
            openid: "ab=c://should.fail.com",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Account Object is the "account" property of a Group or Agent (Definition, Data 2.4.2.4, XAPI-00041)',
    config: [
      {
        name: 'statement actor "agent account" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement actor "group account" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "agent account" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement authority "group account" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.authority_group}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "agent account" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context instructor "group account" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement context team "group account" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as "agent account" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as "group account" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s "agent account" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s "group account" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "agent account" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "group account" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team "group account" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account}}",
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'An Account Object uses the "homePage" property (Multiplicity, Data 2.4.2.4.s2.table1.row1, XAPI-00042)',
    config: [
      {
        name: 'statement actor "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group" account "homePage" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Account Object\'s "homePage" property is an IRL (Type, Data 2.4.2.4.s2.table1.row1, XAPI-00042)',
    config: [
      {
        name: 'statement actor "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group" account "homePage property is IRL',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_homepage}}",
          },
          {
            account: {
              homePage: "ab=c://should.fail.com",
            },
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'An Account Object uses the "name" property (Multiplicity, Data 2.4.2.4.s2.table1.row2, XAPI-00043)',
    config: [
      {
        name: 'statement actor "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.authority}}",
          },
          {
            authority: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_actor}}",
          },
          {
            object: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.actor}}",
          },
          {
            actor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{agents.account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group" account "name" property exists',
        templates: [
          {
            statement: "{{statements.object_substatement}}",
          },
          {
            object: "{{substatements.context}}",
          },
          {
            context: "{{contexts.instructor}}",
          },
          {
            instructor: "{{groups.identified_account_no_name}}",
          },
        ],
        expect: [400],
      },
    ],
  },
];
