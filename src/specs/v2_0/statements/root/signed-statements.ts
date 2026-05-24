import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsSignedStatementsSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.signed-statements",
  "title": "Signed Statements",
  "specVersion": "2.0.0",
  "tags": [
    "signed-statements"
  ],
  "children": [
    {
      "type": "case",
      "id": "v2.statements.signed-statements.missing-signature-part",
      "title": "The Statements resource rejects signed statement metadata when the signature part is missing",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00115",
          "section": "Data 2.6.s4.b1",
          "title": "Signed statements use a JWS attachment with application/octet-stream and raw signature data"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005300\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-missing-part\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:20.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":549,\"sha2\":\"73e82afe004b84d9dae584fb9e0548ece1dab0f59b6b86b6ebe7ac51529a849c\"}]}\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement missing signature part",
          "legacy note: XAPI-00115 upstream comment - A Signed Statement MUST include a JSON web signature (JWS) as defined here: http://tools.ietf.org/html/rfc7515, as an Attachment with a usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream. The LRS must reject with 400 a statement which has usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream but does not have a signature attached.",
          "legacy note: XAPI-00115 upstream describe - A Signed Statement MUST include a JSON web signature, JWS",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.bad-content-type",
      "title": "The Statements resource rejects signed statements whose signature attachment contentType is not application/octet-stream",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00115",
          "section": "Data 2.6.s4.b1",
          "title": "Signed statements use a JWS attachment with application/octet-stream and raw signature data"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005301\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-bad-content-type\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:21.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"text/plain; charset=ascii\",\"length\":554,\"sha2\":\"2c02ae3fd446caa2c8e725bc0497be951eb6c204c3f8ce2f364202f0484a40f2\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: text/plain; charset=ascii\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: 2c02ae3fd446caa2c8e725bc0497be951eb6c204c3f8ce2f364202f0484a40f2\r\n\r\neyJhbGciOiJSUzI1NiJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTMwMSIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL3NpZ25lZC1iYWQtY29udGVudC10eXBlIiwiZGlzcGxheSI6eyJlbi1VUyI6ImNvbXBsZXRlZCJ9fSwib2JqZWN0Ijp7Im9iamVjdFR5cGUiOiJBY3Rpdml0eSIsImlkIjoiaHR0cHM6Ly9leGFtcGxlLnRlc3QveGFwaS9hY3Rpdml0aWVzL2ZpcnN0LXByb29mLXNsaWNlIn0sInRpbWVzdGFtcCI6IjIwMjYtMDUtMjNUMTM6Mjg6MjEuMDAwWiJ9.cHJvb2Ytc2lnbmF0dXJlOlJTMjU2\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement bad content type",
          "legacy note: XAPI-00115 upstream comment - A Signed Statement MUST include a JSON web signature (JWS) as defined here: http://tools.ietf.org/html/rfc7515, as an Attachment with a usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream. The LRS must reject with 400 a statement which has usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream but does not have a signature attached.",
          "legacy note: XAPI-00115 upstream describe - A Signed Statement MUST include a JSON web signature, JWS",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.invalid-payload-json",
      "title": "The Statements resource rejects signed statements whose JWS payload is not valid JSON",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00116",
          "section": "Data 2.6.s4.b3",
          "title": "The signed statement JWS payload is a valid JSON serialization of the statement before the signature is added"
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005302\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-invalid-payload\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:22.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":62,\"sha2\":\"096f99995230570b357de990176ed23416b427f997b4acfd64660e64a76d229e\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: 096f99995230570b357de990176ed23416b427f997b4acfd64660e64a76d229e\r\n\r\neyJhbGciOiJSUzI1NiJ9.eyJicm9rZW4i.cHJvb2Ytc2lnbmF0dXJlOlJTMjU2\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement invalid payload json",
          "legacy note: XAPI-00116 upstream comment - The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added.The LRS must reject with 400 a statement which does not have a valid JSON serialization.",
          "legacy note: XAPI-00116 upstream describe - The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added.",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.accepts-rs256",
      "title": "The Statements resource accepts signed statements that use the \"RS256\" algorithm",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00117",
          "section": "Data 2.6.s4.b4",
          "title": "The signed statement JWS algorithm is one of \"RS256\", \"RS384\", or \"RS512\""
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005303\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-rs256\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:23.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":540,\"sha2\":\"388b714d523ac269c19722ca32756bd487b6d6df0451e0a267e1881fc85c261d\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: 388b714d523ac269c19722ca32756bd487b6d6df0451e0a267e1881fc85c261d\r\n\r\neyJhbGciOiJSUzI1NiJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTMwMyIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL3NpZ25lZC1yczI1NiIsImRpc3BsYXkiOnsiZW4tVVMiOiJjb21wbGV0ZWQifX0sIm9iamVjdCI6eyJvYmplY3RUeXBlIjoiQWN0aXZpdHkiLCJpZCI6Imh0dHBzOi8vZXhhbXBsZS50ZXN0L3hhcGkvYWN0aXZpdGllcy9maXJzdC1wcm9vZi1zbGljZSJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA1LTIzVDEzOjI4OjIzLjAwMFoifQ.cHJvb2Ytc2lnbmF0dXJlOlJTMjU2\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement rs256",
          "legacy note: XAPI-00117 upstream comment - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.",
          "legacy note: XAPI-00117 upstream describe - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\".",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.accepts-rs384",
      "title": "The Statements resource accepts signed statements that use the \"RS384\" algorithm",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00117",
          "section": "Data 2.6.s4.b4",
          "title": "The signed statement JWS algorithm is one of \"RS256\", \"RS384\", or \"RS512\""
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005304\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-rs384\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:24.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":540,\"sha2\":\"5b92f013fb7345d5bd60c05dcc9a1572a7cee7e2a9b433e772ed74cddf32a497\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: 5b92f013fb7345d5bd60c05dcc9a1572a7cee7e2a9b433e772ed74cddf32a497\r\n\r\neyJhbGciOiJSUzM4NCJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTMwNCIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL3NpZ25lZC1yczM4NCIsImRpc3BsYXkiOnsiZW4tVVMiOiJjb21wbGV0ZWQifX0sIm9iamVjdCI6eyJvYmplY3RUeXBlIjoiQWN0aXZpdHkiLCJpZCI6Imh0dHBzOi8vZXhhbXBsZS50ZXN0L3hhcGkvYWN0aXZpdGllcy9maXJzdC1wcm9vZi1zbGljZSJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA1LTIzVDEzOjI4OjI0LjAwMFoifQ.cHJvb2Ytc2lnbmF0dXJlOlJTMzg0\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement rs384",
          "legacy note: XAPI-00117 upstream comment - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.",
          "legacy note: XAPI-00117 upstream describe - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\".",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.accepts-rs512",
      "title": "The Statements resource accepts signed statements that use the \"RS512\" algorithm",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00117",
          "section": "Data 2.6.s4.b4",
          "title": "The signed statement JWS algorithm is one of \"RS256\", \"RS384\", or \"RS512\""
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005305\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-rs512\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:25.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":540,\"sha2\":\"6ce7c1b1c0c919e507b3820645aea2711c84e84115eba0ca80bdab919a352f65\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: 6ce7c1b1c0c919e507b3820645aea2711c84e84115eba0ca80bdab919a352f65\r\n\r\neyJhbGciOiJSUzUxMiJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTMwNSIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL3NpZ25lZC1yczUxMiIsImRpc3BsYXkiOnsiZW4tVVMiOiJjb21wbGV0ZWQifX0sIm9iamVjdCI6eyJvYmplY3RUeXBlIjoiQWN0aXZpdHkiLCJpZCI6Imh0dHBzOi8vZXhhbXBsZS50ZXN0L3hhcGkvYWN0aXZpdGllcy9maXJzdC1wcm9vZi1zbGljZSJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA1LTIzVDEzOjI4OjI1LjAwMFoifQ.cHJvb2Ytc2lnbmF0dXJlOlJTNTEy\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement rs512",
          "legacy note: XAPI-00117 upstream comment - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.",
          "legacy note: XAPI-00117 upstream describe - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\".",
        ]
      }
    },
    {
      "type": "case",
      "id": "v2.statements.signed-statements.rejects-hs256",
      "title": "The Statements resource rejects signed statements that use an algorithm other than \"RS256\", \"RS384\", or \"RS512\"",
      "specVersion": "2.0.0",
      "requirementRefs": [
        {
          "id": "XAPI-00117",
          "section": "Data 2.6.s4.b4",
          "title": "The signed statement JWS algorithm is one of \"RS256\", \"RS384\", or \"RS512\""
        }
      ],
      "tags": [
        "v2.0.0",
        "statements",
        "signed-statements",
        "multipart"
      ],
      "capabilityFlags": [
        "signed",
        "multipart",
        "validation"
      ],
      "legacyTrace": {
        "suiteFile": "test/v2_0/E.Data2.6-SignedStatements.js"
      },
      "execution": {
        "kind": "single-request",
        "request": {
          "method": "POST",
          "endpoint": "statements",
          "authMode": "basic",
          "headers": {
            "X-Experience-API-Version": "2.0.0",
            "content-type": "multipart/mixed; boundary=mock-proof-statement-request"
          },
          "query": {},
          "body": {
            "kind": "text",
            "value": "--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{\"id\":\"33333333-3333-4333-8333-000000005306\",\"actor\":{\"objectType\":\"Agent\",\"mbox\":\"mailto:learner@example.test\",\"name\":\"Learner Example\"},\"verb\":{\"id\":\"https://example.test/xapi/verbs/signed-hs256\",\"display\":{\"en-US\":\"completed\"}},\"object\":{\"objectType\":\"Activity\",\"id\":\"https://example.test/xapi/activities/first-proof-slice\"},\"timestamp\":\"2026-05-23T13:28:26.000Z\",\"attachments\":[{\"usageType\":\"http://adlnet.gov/expapi/attachments/signature\",\"display\":{\"en-US\":\"Signed by the Proof Slice\"},\"description\":{\"en-US\":\"Signed by the Proof Slice\"},\"contentType\":\"application/octet-stream\",\"length\":540,\"sha2\":\"e975a3577115bfd9a64710bc00c62fce2ac8378821f71a9f89672beb886868f3\"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: e975a3577115bfd9a64710bc00c62fce2ac8378821f71a9f89672beb886868f3\r\n\r\neyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTMwNiIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL3NpZ25lZC1oczI1NiIsImRpc3BsYXkiOnsiZW4tVVMiOiJjb21wbGV0ZWQifX0sIm9iamVjdCI6eyJvYmplY3RUeXBlIjoiQWN0aXZpdHkiLCJpZCI6Imh0dHBzOi8vZXhhbXBsZS50ZXN0L3hhcGkvYWN0aXZpdGllcy9maXJzdC1wcm9vZi1zbGljZSJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA1LTIzVDEzOjI4OjI2LjAwMFoifQ.cHJvb2Ytc2lnbmF0dXJlOkhTMjU2\r\n--mock-proof-statement-request--\r\n"
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
          "proof-slice signed statement hs256 rejection",
          "legacy note: XAPI-00117 upstream comment - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.",
          "legacy note: XAPI-00117 upstream describe - The JWS signature MUST use an algorithm of \"RS256\", \"RS384\", or \"RS512\".",
        ]
      }
    }
  ]
} as unknown as SuiteDefinition;
