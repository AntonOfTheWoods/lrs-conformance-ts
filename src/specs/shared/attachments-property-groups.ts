import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export const attachmentsPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    name: 'A Statement\'s "attachments" property is an array of Attachments (Data 2.4.s1.table1.row11, XAPI-00025)',
    config: [
      {
        name: 'statement "attachments" is an array',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                description: { "en-US": "A test attachment (description)" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [200],
      },
      {
        name: 'statement "attachments" not an array',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: {
              usageType: "http://example.com/attachment-usage/test",
              display: { "en-US": "A test attachment" },
              description: { "en-US": "A test attachment (description)" },
              contentType: "text/plain; charset=ascii",
              length: 27,
              sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              fileUrl: "http://over.there.com/file.txt",
            },
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: "An Attachment is an Object (Definition, Data 2.4.11)",
    config: [
      {
        name: 'statement "attachment" invalid numeric',
        templates: [{ statement: "{{statements.attachment}}" }, { attachments: [12345] }],
        expect: [400],
      },
      {
        name: 'statement "attachment" invalid string',
        templates: [{ statement: "{{statements.authority}}" }, { attachments: ["should fail"] }],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "usageType" property is an IRI (Multiplicity, Data 2.4.11.s2.table1.row1, XAPI-00107)',
    config: [
      {
        name: 'statement "usageType" invalid string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "should fail",
                display: { "en-US": "A test attachment" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "contentType" property is an Internet Media/MIME type (Format, Data 2.4.11.s2.table1.row4, XAPI-00105)',
    config: [
      {
        name: 'statement "contentType" invalid number',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                contentType: 999,
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "length" property is an Integer (Format, Data 2.4.11.s2.table1.row5, XAPI-00102)',
    config: [
      {
        name: 'statement "length" invalid string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                contentType: "text/plain; charset=ascii",
                length: "should fail",
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "sha2" property is a String (Format, Data 2.4.11.s2.table1.row6, XAPI-00103)',
    config: [
      {
        name: 'statement "sha2" invalid string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: 12345,
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "fileUrl" property is an IRL (Format, Data 2.4.11.s2.table1.row7, XAPI-00104)',
    config: [
      {
        name: 'statement "fileUrl" invalid string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "should fail",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
  {
    name: 'A "display" property is a Language Map (Type, Data 2.4.11.s2.table1.row2, XAPI-00106)',
    config: [
      {
        name: 'statement attachment "display" language map numeric',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: 12345,
                description: { "en-US": "A test attachment (description)" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
      {
        name: 'statement attachment "display" language map string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: "should fail",
                description: { "en-US": "A test attachment (description)" },
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
      {
        name: 'statement attachment "description" language map numeric',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                description: 12345,
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
      {
        name: 'statement attachment "description" language map string',
        templates: [
          { statement: "{{statements.attachment}}" },
          {
            attachments: [
              {
                usageType: "http://example.com/attachment-usage/test",
                display: { "en-US": "A test attachment" },
                description: "should error",
                contentType: "text/plain; charset=ascii",
                length: 27,
                sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
                fileUrl: "http://over.there.com/file.txt",
              },
            ],
          },
        ],
        expect: [400],
      },
    ],
  },
];
