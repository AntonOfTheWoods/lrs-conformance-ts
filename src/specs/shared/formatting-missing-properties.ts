import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const formattingMissingPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00003, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain an "actor" property
     */
    name: 'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
    config: [
      {
        name: 'statement "actor" missing',
        templates: [{ statement: "{{statements.no_actor}}" }],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00004, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain a "verb" property
     */
    name: 'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
    config: [
      {
        name: 'statement "verb" missing',
        templates: [{ statement: "{{statements.no_verb}}" }],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00005, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain an "object" property
     */
    name: 'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
    config: [
      {
        name: 'statement "object" missing',
        templates: [{ statement: "{{statements.no_object}}" }],
        expect: [400],
      },
    ],
  },
];
