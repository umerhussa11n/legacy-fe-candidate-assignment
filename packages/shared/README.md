## 📦 shared-packages

This directory serves as the **Single Source of Truth** for reusable code, configurations, and core definitions utilized across the entire monorepo, including both the Frontend (React/TypeScript) and Backend (Node/Express) services.

The primary goal of this package is to prevent duplication, enforce consistency, and simplify maintenance for critical, cross-cutting logic.

---

### 📚 Contents and Purpose

This package typically houses logic that is decoupled from any specific host environment (browser or server):

| Folder/File          | Purpose                                         | Example Contents                                      |
| :------------------- | :---------------------------------------------- | :---------------------------------------------------- |
| **`jest.config.js`** | The base configuration for all project testing. | Shared preset for `ts-jest` and module resolution.    |
| **`tsconfig.json`**  | The base TypeScript compiler configuration.     | Enforces strict mode and consistent compiler options. |

---

## 🛠 Configuration Inheritance

To maintain consistency and avoid configuration drift, all packages in this monorepo **must** inherit their primary configurations from this shared package.

### TypeScript (`tsconfig.json`)

In any project package's `tsconfig.json`, ensure you use the `extends` property:

```json
// packages/frontend/tsconfig.json or packages/backend/tsconfig.json
{
  "extends": "../../shared-packages/tsconfig.json",
  "compilerOptions": {
    // Add any package-specific compiler options here
    "jsx": "react-jsx"
  }
  // ... other project-specific settings
}
```

### Jest (jest.config.js)

In any project package's jest.config.js, ensure you use the preset property:

```// packages/backend/jest.config.js or packages/frontend/jest.config.js
module.exports = {
  // Use the shared configuration as a base
  preset: '../../shared-packages/jest.config.js',

  // Add any package-specific settings here
  testEnvironment: 'node', // Use 'jsdom' for frontend packages
};
```

### ✅ Testing Shared Logic

Since the code in shared-packages is critical to the stability of the entire system, every exported utility, type helper, and piece of business logic must be accompanied by a dedicated unit test.

Tests for shared code should be located within the same package, typically in src/**tests** or alongside the source file (e.g., utils/foo.test.ts).

Note: Do not add environment-specific code (e.g., React components, database connection logic) to this folder. The code here must remain decoupled and reusable.
