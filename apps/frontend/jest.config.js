/** @type {import('jest').Config} */
const baseConfig = require("../../jest.config.base.js");

module.exports = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
};
