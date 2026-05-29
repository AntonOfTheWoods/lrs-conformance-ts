/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import __esmDep1 from "fs";
import __esmDep2 from "extend";
import __esmDep3 from "moment";
import __esmDep4 from "super-request";
import __esmDep5 from "supertest-as-promised";
import __esmDep6 from "chai";
import __esmDep7 from "url";
import __esmDep8 from "joi";
import __esmDep9 from "./../helper.ts";
import __esmDep10 from "./../multipartParser.ts";
import __esmDep11 from "./../redirect.ts";
import __esmDep12 from "./../templatingSelection.ts";

(function (
  module: any,
  fs: any,
  extend: any,
  moment: any,
  request: any,
  requestPromise: any,
  chai: any,
  liburl: any,
  Joi: any,
  helper: any,
  multipartParser: any,
  redirect: any,
  templatingSelection: any,
) {
  // "use strict";

  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Object Property Requirements (Data 2.4.4)", () => {
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
    describe('An Activity Definition uses the "interactionType" property if any of the correctResponsesPattern, choices, scale, source, target, or steps properties are used (Multiplicity, Data 2.4.4.1.s8, XAPI-00064) **Implicit**', function () {
      it('Activity Definition uses correctResponsesPattern without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var correctResponsesPatterntemplates = [
          { statement: "{{statements.default}}" },
          { object: "{{activities.other}}" },
        ];
        correctResponsesPattern = helper.createFromTemplate(correctResponsesPatterntemplates);
        correctResponsesPattern = correctResponsesPattern.statement;
        delete correctResponsesPattern.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(correctResponsesPattern)
          .expect(400, done);
      });

      it('Activity Definition uses choices without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var choicetemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.choice}}" }];
        choice = helper.createFromTemplate(choicetemplates);
        choice = choice.statement;
        delete choice.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(choice)
          .expect(400, done);
      });

      it('Activity Definition uses fill-in without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var fillintemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.fill_in}}" }];
        fillin = helper.createFromTemplate(fillintemplates);
        fillin = fillin.statement;
        delete fillin.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(fillin)
          .expect(400, done);
      });

      it('Activity Definition uses scale without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var scaletemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.likert}}" }];
        scale = helper.createFromTemplate(scaletemplates);
        scale = scale.statement;
        delete scale.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(scale)
          .expect(400, done);
      });

      it('Activity Definition uses long-fill-in without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var fillintemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.long_fill_in}}" }];
        fillin = helper.createFromTemplate(fillintemplates);
        fillin = fillin.statement;
        delete fillin.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(fillin)
          .expect(400, done);
      });

      it('Activity Definition uses source without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var sourcetemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.matching}}" }];
        source = helper.createFromTemplate(sourcetemplates);
        source = source.statement;
        delete source.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(source)
          .expect(400, done);
      });

      it('Activity Definition uses target without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var targettemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.matching_target}}" }];
        target = helper.createFromTemplate(targettemplates);
        target = target.statement;
        delete target.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(target)
          .expect(400, done);
      });

      it('Activity Definition uses numeric without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var numerictemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.numeric}}" }];
        numeric = helper.createFromTemplate(numerictemplates);
        numeric = numeric.statement;
        delete numeric.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(numeric)
          .expect(400, done);
      });

      it('Activity Definition uses other without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var othertemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.other}}" }];
        other = helper.createFromTemplate(othertemplates);
        other = other.statement;
        delete other.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(other)
          .expect(400, done);
      });

      it('Activity Definition uses performance without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var stepstemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.performance}}" }];
        steps = helper.createFromTemplate(stepstemplates);
        steps = steps.statement;
        delete steps.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(steps)
          .expect(400, done);
      });

      it('Activity Definition uses sequencing without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var seqtemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.sequencing}}" }];
        seq = helper.createFromTemplate(seqtemplates);
        seq = seq.statement;
        delete seq.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(seq)
          .expect(400, done);
      });

      it('Activity Definition uses true-false without "interactionType" property', function (done) {
        id = helper.generateUUID();
        var tftemplates = [{ statement: "{{statements.default}}" }, { object: "{{activities.true_false}}" }];
        tf = helper.createFromTemplate(tftemplates);
        tf = tf.statement;
        delete tf.object.definition.interactionType;
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(tf)
          .expect(400, done);
      });
    });

    //Data 2.4.4.2 - when the object is an agent or a group
    /**  Matchup with Conformance Requirements Document
     * XAPI-00065 - below
     */

    /** XAPI-00065, Data 2.4.4.2 when the object is an agent or a group
     * Statements that use an Agent or Group as an Object MUST specify an "objectType" property. The LRS rejects with 400 Bad Request if the “objectType” property is absent and the Object is an Agent Object or Group Object.
     */
    describe('Statements that use an Agent or Group as an Object MUST specify an "objectType" property. (Data 2.4.4.2.s1.b1, XAPI-00065)', function () {
      it("should fail when using agent as object and no objectType", function (done) {
        var templates = [{ statement: "{{statements.object_agent_default}}" }];
        var data = helper.createFromTemplate(templates).statement;
        delete data.object.objectType;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(400, done);
      });

      it("should fail when using group as object and no objectType", function (done) {
        var templates = [{ statement: "{{statements.object_group_default}}" }];
        var data = helper.createFromTemplate(templates).statement;
        delete data.object.objectType;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(400, done);
      });

      it("substatement should fail when using agent as object and no objectType", function (done) {
        var templates = [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{statements.object_agent_default}}" },
        ];
        var data = helper.createFromTemplate(templates).statement;
        delete data.object.objectType;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(400, done);
      });

      it("substatement should fail when using group as object and no objectType", function (done) {
        var templates = [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{statements.object_group_default}}" },
        ];
        var data = helper.createFromTemplate(templates).statement;
        delete data.object.objectType;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(400, done);
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
})(undefined,__esmDep1,
  __esmDep2,
  __esmDep3,
  __esmDep4,
  __esmDep5,
  __esmDep6,
  __esmDep7,
  __esmDep8,
  __esmDep9,
  __esmDep10,
  __esmDep11,
  __esmDep12,
);
