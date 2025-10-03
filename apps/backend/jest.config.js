/** @type {import('jest').Config} */
const baseConfig = require("../../jest.config.base.js");

module.exports = {
  ...baseConfig,
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [...baseConfig.collectCoverageFrom, "!src/server.ts"],
};
