const baseConfig = require("../../jest.config.base.js");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  testMatch: [
    "**/__tests__/**/*.test.{ts,tsx}",
    "**/?(*.)+(spec|test).{ts,tsx}",
  ],
};
