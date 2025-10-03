/** @type {import('jest').Config} */
const baseConfig = require("../../jest.config.base.js");

module.exports = {
  ...baseConfig,
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [...baseConfig.collectCoverageFrom, "!src/index.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
