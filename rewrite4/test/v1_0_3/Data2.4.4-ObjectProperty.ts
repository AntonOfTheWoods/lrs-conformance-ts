/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { expectAsync } from "../super-request.ts";
import templatingSelectionImport from "../templatingSelection.ts";

import { describe, it } from "bun:test";
const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Object Property Requirements (Data 2.4.4)", () => {
  let id: any,
    correctResponsesPattern: any,
    choice: any,
    fillin: any,
    scale: any,
    source: any,
    target: any,
    numeric: any,
    other: any,
    steps: any,
    seq: any,
    tf: any;
  void id;

  //Data 2.4.4 object
  /**  Matchup with Conformance Requirements Document
   * XAPI-00046 - in objects.js
   */
  templatingSelection.createTemplate("objects.ts");

  //Data 2.4.4.1 when objectType is activity
  /**  Matchup with Conformance Requirements Document
   * XAPI-00047 - in activities.js
   * XAPI-00048 - in activities.js
   * XAPI-00049 - in activities.js
   * XAPI-00050 - in activities.js
   * XAPI-00051 - in activities.js
   * XAPI-00052 - in activities.js
   * XAPI-00053 - in activities.js
   * XAPI-00054 - in activities.js
   * XAPI-00055 - in activities.js
   * XAPI-00056 - in activities.js
   * XAPI-00057 - in activities.js
   * XAPI-00058 - in activities.js
   * XAPI-00059 - in activities.js
   * XAPI-00060 - in activities.js
   * XAPI-00061 - in activities.js
   * XAPI-00062 - in activities.js
   * XAPI-00063 - in activities.js
   * XAPI-00064 - below
   */
  templatingSelection.createTemplate("activities.ts");

  /**  XAPI-00064, Data 2.4.4.1 when objectType is activity
   * An Activity Definition uses the "interactionType" property if correctResponsesPattern is present. An LRS rejects a statement with 400 Bad Request if a correctResponsePattern is present and interactionType is not.
   */
  describe('An Activity Definition uses the "interactionType" property if any of the correctResponsesPattern, choices, scale, source, target, or steps properties are used (Multiplicity, Data 2.4.4.1.s8, XAPI-00064) **Implicit**', () => {
    it('Activity Definition uses correctResponsesPattern without "interactionType" property', async () => {
      id = helper.generateUUID();
      let correctResponsesPatterntemplates = [
        { statement: "{{statements.default}}" },
        { object: "{{activities.other}}" },
      ];
      correctResponsesPattern = helper.createFromTemplate(correctResponsesPatterntemplates);
      correctResponsesPattern = correctResponsesPattern.statement;
      delete correctResponsesPattern.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(correctResponsesPattern),
        400,
      );
    });

    it('Activity Definition uses choices without "interactionType" property', async () => {
      id = helper.generateUUID();
      let choicetemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.choice}}" }];
      choice = helper.createFromTemplate(choicetemplates);
      choice = choice.statement;
      delete choice.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(choice),
        400,
      );
    });

    it('Activity Definition uses fill-in without "interactionType" property', async () => {
      id = helper.generateUUID();
      let fillintemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.fill_in}}" }];
      fillin = helper.createFromTemplate(fillintemplates);
      fillin = fillin.statement;
      delete fillin.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(fillin),
        400,
      );
    });

    it('Activity Definition uses scale without "interactionType" property', async () => {
      id = helper.generateUUID();
      let scaletemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.likert}}" }];
      scale = helper.createFromTemplate(scaletemplates);
      scale = scale.statement;
      delete scale.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(scale),
        400,
      );
    });

    it('Activity Definition uses long-fill-in without "interactionType" property', async () => {
      id = helper.generateUUID();
      let fillintemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.long_fill_in}}" }];
      fillin = helper.createFromTemplate(fillintemplates);
      fillin = fillin.statement;
      delete fillin.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(fillin),
        400,
      );
    });

    it('Activity Definition uses source without "interactionType" property', async () => {
      id = helper.generateUUID();
      let sourcetemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.matching}}" }];
      source = helper.createFromTemplate(sourcetemplates);
      source = source.statement;
      delete source.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(source),
        400,
      );
    });

    it('Activity Definition uses target without "interactionType" property', async () => {
      id = helper.generateUUID();
      let targettemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.matching_target}}" }];
      target = helper.createFromTemplate(targettemplates);
      target = target.statement;
      delete target.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(target),
        400,
      );
    });

    it('Activity Definition uses numeric without "interactionType" property', async () => {
      id = helper.generateUUID();
      let numerictemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.numeric}}" }];
      numeric = helper.createFromTemplate(numerictemplates);
      numeric = numeric.statement;
      delete numeric.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(numeric),
        400,
      );
    });

    it('Activity Definition uses other without "interactionType" property', async () => {
      id = helper.generateUUID();
      let othertemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.other}}" }];
      other = helper.createFromTemplate(othertemplates);
      other = other.statement;
      delete other.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(other),
        400,
      );
    });

    it('Activity Definition uses performance without "interactionType" property', async () => {
      id = helper.generateUUID();
      let stepstemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.performance}}" }];
      steps = helper.createFromTemplate(stepstemplates);
      steps = steps.statement;
      delete steps.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(steps),
        400,
      );
    });

    it('Activity Definition uses sequencing without "interactionType" property', async () => {
      id = helper.generateUUID();
      let seqtemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.sequencing}}" }];
      seq = helper.createFromTemplate(seqtemplates);
      seq = seq.statement;
      delete seq.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(seq),
        400,
      );
    });

    it('Activity Definition uses true-false without "interactionType" property', async () => {
      id = helper.generateUUID();
      let tftemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.true_false}}" }];
      tf = helper.createFromTemplate(tftemplates);
      tf = tf.statement;
      delete tf.object.definition.interactionType;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(tf),
        400,
      );
    });
  });

  //Data 2.4.4.2 - when the object is an agent or a group
  /**  Matchup with Conformance Requirements Document
   * XAPI-00065 - below
   */

  /** XAPI-00065, Data 2.4.4.2 when the object is an agent or a group
   * Statements that use an Agent or Group as an Object MUST specify an "objectType" property. The LRS rejects with 400 Bad Request if the “objectType” property is absent and the Object is an Agent Object or Group Object.
   */
  describe('Statements that use an Agent or Group as an Object MUST specify an "objectType" property. (Data 2.4.4.2.s1.b1, XAPI-00065)', () => {
    it("should fail when using agent as object and no objectType", async () => {
      let templates = [{ statement: "{{statements.object_agent_default}}" }];
      let data = helper.createFromTemplate(templates).statement;
      delete data.object.objectType;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        400,
      );
    });

    it("should fail when using group as object and no objectType", async () => {
      let templates = [{ statement: "{{statements.object_group_default}}" }];
      let data = helper.createFromTemplate(templates).statement;
      delete data.object.objectType;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        400,
      );
    });

    it("substatement should fail when using agent as object and no objectType", async () => {
      let templates = [
        { statement: "{{statements.object_substatement}}" },
        { object: "{{statements.object_agent_default}}" },
      ];
      let data = helper.createFromTemplate(templates).statement;
      delete data.object.objectType;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        400,
      );
    });

    it("substatement should fail when using group as object and no objectType", async () => {
      let templates = [
        { statement: "{{statements.object_substatement}}" },
        { object: "{{statements.object_group_default}}" },
      ];
      let data = helper.createFromTemplate(templates).statement;
      delete data.object.objectType;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        400,
      );
    });
  });

  //Data 2.4.4.3 - when the object is a statement
  /** Matchup with Conformance Requirements Document
   * XAPI-00066 - in substatements.js
   * XAPI-00067 - in substatements.js
   * XAPI-00068 - in substatements.js
   * XAPI-00069 - in substatements.js
   * XAPI-00070 - in substatements.js
   * XAPI-00071 - in substatements.js
   * XAPI-00072 - in statementrefs.js
   * XAPI-00073 - in statementrefs.js
   */
  templatingSelection.createTemplate("substatements.ts");
  templatingSelection.createTemplate("statementrefs.ts");
});
