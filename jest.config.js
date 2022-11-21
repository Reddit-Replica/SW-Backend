export default {
  testEnvironment: "jest-environment-node",
  transform: {},
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
  collectCoverageFrom: ["./services/**", "./utils/**"],
};
