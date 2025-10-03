# Take-Home Task: **Web3 Message Signer & Verifier**

React + Dynamic.xyz Headless Implementation (Frontend) | Node.js + Express (Backend)

## 🎯 Objective

Build a full-stack Web3 app that allows a user to:

1. Authenticate using a **Dynamic.xyz embedded wallet headless implementation https://docs.dynamic.xyz/headless/headless-email** ⚠️ Do not simply implement the Widget ⚠️
2. Enter and **sign a custom message** of the user's choosing
3. Send the signed message to a **Node.js + Express** backend
4. Backend verifies the signature and responds with validity + address

## 🔧 Requirements

### 🧩 Frontend (React 18+)

- Integrate Dynamic.xyz Embedded Wallet
- After authentication:
  - Show connected wallet address
  - Provide a form to input a custom message
  - Let user sign the message
  - Submit `{ message, signature }` to backend
- Show result from backend:
  - Whether the signature is valid
  - Which wallet signed it
- Allow signing multiple messages (show a local history)

**Note:** How you structure the React app is up to you — but the app complexity is high enough that good React patterns will shine through.

### 🌐 Backend (Node.js + Express – required)

- Create a REST API endpoint: `POST /verify-signature`
- Accept:

```json
{ "message": "string", "signature": "string" }
```

- Use `ethers.js` (or `viem`) to:
  - Recover the signer from the signature
  - Validate the signature
- Return:

```json
{ "isValid": true, "signer": "0xabc123...", "originalMessage": "..." }
```

## Behavior & Constraints

- Session state can be in-memory (no DB required)
- Message signing history should persist across React component state or localStorage
- No third-party signature validation services — use raw `ethers.js`, `viem` or similar in backend

## 🚀 Submission Guidelines

- Submit a **PR to the GitHub repo**
- Include:
  - Setup instructions for both frontend and backend in a README.md file
  - Notes on any trade-offs made or areas you'd improve
  - A test suite with all tests passing
- Bonus: Implement headless **multi-factor auth** to seucre the user https://docs.dynamic.xyz/headless/headless-mfa
- Bonus: Link to deployed version (e.g., Vercel frontend, Render backend)

## ✅ Evaluation Focus

| Area                   | Evaluated On                                                                     |
| ---------------------- | -------------------------------------------------------------------------------- |
| **React architecture** | Component design, state flow, hooks, separation of concerns                      |
| **Dynamic.xyz usage**  | Clean login, wallet context management, signing flow                             |
| **Node.js + Express**  | REST API correctness, signature validation logic, modularity                     |
| **Code quality**       | Readability, organization, error handling, TypeScript use                        |
| **User experience**    | Clear flows, responsive feedback, intuitive UI                                   |
| **Extensibility**      | Evidence of scalable thought (e.g., room for auth, roles, message types)         |
| **Design**             | Beautiful UX design skills are important to us. Make the app look and feel great |

## 🏗️ Architecture

```
├── packages/
│   └── shared/           # Shared TypeScript types & utilities
├── apps/
│   ├── frontend/         # React + Vite + Tailwind CSS + Dynamic.xyz
│   └── backend/          # Node.js + Express + ethers.js
└── configs/              # Shared ESLint, Jest, TypeScript configs
```

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development servers (frontend:3000 + backend:3001)
yarn dev

# Build all packages
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Yarn 4+ (included via packageManager)

### Environment Variables

Create `.env` files in backend:

```env
# apps/backend/.env
PORT=3001
DYNAMIC_ENVIRONMENT_ID=your_dynamic_env_id
```

### Package Scripts

- `yarn dev` - Start both frontend & backend in development
- `yarn build` - Build all workspaces
- `yarn test` - Run Jest tests across all packages
- `yarn lint` - ESLint across all packages
- `yarn type-check` - TypeScript compilation check

## 🎯 Core Features

### Frontend (React + TypeScript)

- **Dynamic.xyz Headless Auth** - Embedded wallet authentication
- **Message Signing UI** - Custom message input & signing flow
- **Signature History** - Local storage of signed messages
- **Tailwind CSS** - Beautiful, responsive design
- **Type-safe API** - Shared types with backend

### Backend (Express + TypeScript)

- **Signature Verification** - ethers.js signature recovery
- **REST API** - `/api/verify-signature` endpoint
- **Error Handling** - Comprehensive error middleware
- **CORS & Security** - Helmet, CORS configuration

### Shared Package

- **TypeScript Types** - Auth, signature, API interfaces
- **Utilities** - Validation, formatting helpers
- **Constants** - API endpoints, error messages

## �️ Monorepo Architecture

### Configuration Inheritance

```javascript
// Root configs provide base settings
├── .eslintrc.js           // Base ESLint rules
├── jest.config.base.js    // Base Jest config
├── tsconfig.json          // Base TypeScript config

// Package configs extend base
├── apps/*/eslintrc.js     // extends: ['../../.eslintrc.js']
├── apps/*/jest.config.js  // const base = require('../../jest.config.base.js')
└── apps/*/tsconfig.json   // extends: '../../tsconfig.json'
```

### Benefits

- **Single source of truth** for shared configuration
- **Consistent tooling** across all packages
- **Easy maintenance** - update once, applies everywhere
- **Type safety** via JSDoc comments in configs

## 🔧 Technical Decisions

### TypeScript Configuration

- **Modern ESNext** for frontend (Vite bundler)
- **Node16 modules** for backend (Node.js compatibility)
- **Shared types** via workspace protocol (`@web3-signer/shared`)

### Testing Strategy

- **Jest + ts-jest** for all packages
- **jsdom** for frontend React testing
- **Coverage thresholds** enforced (70% shared, 80% for utils)

### Code Quality

- **ESLint** with TypeScript rules
- **Prettier** integration via ESLint
- **Unused parameter** detection (`argsIgnorePattern: "^_"`)

## 📁 Project Structure Details

```
root/
├── package.json              # Workspace orchestration
├── yarn.lock                 # Dependency lockfile
├── .yarnrc.yml              # Yarn 4 configuration
├── .eslintrc.js             # 🔥 Base ESLint config
├── jest.config.base.js      # 🔥 Base Jest config
├── tsconfig.json            # 🔥 Base TypeScript config
├── .gitignore               # Essential files only (simplified)
│
├── packages/shared/
│   ├── src/
│   │   ├── types/           # Auth, Signature, API interfaces
│   │   ├── utils/           # Validation, formatting
│   │   └── constants/       # API endpoints, errors
│   ├── jest.config.js       # Extends base + higher coverage
│   └── tsconfig.json        # Library package config
│
├── apps/frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # Frontend-specific types
│   ├── vite.config.ts       # Vite bundler config
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── jest.config.js       # Extends base + jsdom
│   ├── .eslintrc.js         # Extends base + React rules
│   └── tsconfig.json        # Extends base + React/bundler
│
└── apps/backend/
    ├── src/
    │   ├── controllers/     # Express route handlers
    │   ├── services/        # Business logic (signature verification)
    │   ├── middleware/      # Error handling, logging
    │   └── routes/          # API route definitions
    ├── nodemon.json         # Development auto-reload
    ├── jest.config.js       # Extends base + Node.js
    ├── .eslintrc.js         # Extends base + Node.js rules
    └── tsconfig.json        # Extends base + Node.js modules
```

## 🎨 Design Philosophy

### Simplicity Over Engineering

- **Minimal boilerplate** - Focus on core requirements
- **Essential configs only** - No over-engineering
- **Clear inheritance** - Easy to understand and maintain

### Developer Experience

- **Type safety** everywhere with shared interfaces
- **Hot reloading** in development
- **Consistent formatting** and linting
- **Comprehensive JSDoc** for configuration files
