import { SpecReporter } from "jasmine-spec-reporter";
import jasmineReporter from "jasmine-reporters";

jasmine.getEnv().clearReporters(); // remove default reporter logs
jasmine.getEnv().addReporter(
  new jasmineReporter.JUnitXmlReporter({
    // setup the output path for the junit reports
    savePath: "test_output/",

    // conslidate all true:
    //   output/junitresults.xml
    //
    // conslidate all set to false:
    //   output/junitresults-example1.xml
    //   output/junitresults-example2.xml
    consolidateAll: false,
  })
);

jasmine.getEnv().addReporter(
  new jasmineReporter.NUnitXmlReporter({
    savePath: "test_output2/",
  })
);

jasmine.getEnv().addReporter(
  new SpecReporter({
    // add jasmine-spec-reporter
    spec: {
      displayPending: true,
    },
    summary: {
      displayDuration: false,
    },
  })
);
