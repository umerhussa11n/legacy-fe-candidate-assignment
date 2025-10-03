/** @type {import('jest').Config} */
const baseConfig = {
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../../packages/shared/src/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: [],
  testTimeout: 10000,
};

module.exports = baseConfig;
