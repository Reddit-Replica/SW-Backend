export default {
  testTimeout: 30000,
  testEnvironment: "jest-environment-node",
  transform: {},
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
  collectCoverageFrom: ["./services/**", "./utils/**", "./middleware/**"],
  coverageReporters: ["text-summary", "html"],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Read-it Test Report",
      },
    ],
  ],
};
