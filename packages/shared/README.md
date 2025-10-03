# Shared Package

TypeScript types, utilities, and constants shared across the Web3 Signer & Verifier monorepo.

## 📦 Exports

### Types

```typescript
// Authentication
export interface WalletUser {
  address: string;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: WalletUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  signMessage: (message: string) => Promise<string>;
  isConnected: boolean;
}

// Signature Operations
export interface VerificationRequest {
  message: string;
  signature: string;
}

export interface VerificationResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}

export interface SignedMessage {
  message: string;
  signature: string;
  timestamp: number;
  signer: string;
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

### Utilities

```typescript
// Validation
export const validateMessage = (message: string): boolean

// Formatting
export const truncateAddress = (address: string): string
export const formatTimestamp = (timestamp: number): string
```

### Constants

```typescript
export const API_ENDPOINTS = {
  VERIFY_SIGNATURE: "/api/verify-signature",
};

export const ERROR_MESSAGES = {
  VERIFICATION_FAILED: "Signature verification failed",
  WALLET_NOT_CONNECTED: "Wallet not connected",
  EMPTY_MESSAGE: "Message cannot be empty",
};
```

## 🛠️ Development

```bash
# Build package
yarn build

# Run tests
yarn test

# Type check
yarn type-check

# Lint
yarn lint
```

## 📁 Structure

```
src/
├── types/
│   ├── auth.ts          # Authentication interfaces
│   ├── signature.ts     # Signature operation types
│   └── api.ts          # API response types
├── utils/
│   ├── validation.ts    # Input validation helpers
│   └── formatters.ts   # Display formatting utilities
├── constants/
│   └── index.ts        # API endpoints & error messages
└── index.ts            # Main export file
```

## 🎯 Design Principles

- **Minimal & Focused** - Only essential types and utilities
- **Type Safety** - Complete TypeScript coverage
- **Reusable** - Shared across frontend and backend
- **Simple** - No over-engineering or complex abstractions
