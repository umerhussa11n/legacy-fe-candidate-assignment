# Backend API

Express.js + TypeScript server for Web3 signature verification.

## 🚀 Quick Start

```bash
yarn dev    # Development server (port 3001)
yarn build  # Production build
yarn test   # Run tests
```

## 📁 Structure

```
src/
├── controllers/    # Route handlers
├── services/      # Business logic (signature verification)
├── middleware/    # Error handling
├── routes/        # API definitions
└── server.ts      # Entry point
```

## 🎯 API

### POST `/api/verify-signature`

Verifies Ethereum signatures using ethers.js.

```typescript
// Request
{
  "message": "Hello Web3!",
  "signature": "0x..."
}

// Response
{
  "isValid": true,
  "signer": "0xabc123...",
  "originalMessage": "Hello Web3!"
}
```

### GET `/api/health`

Health check endpoint.

## 🔐 Signature Verification

Uses `ethers.verifyMessage()` to recover wallet address from signature:

```typescript
const signerAddress = ethers.verifyMessage(message, signature);
```

## �️ Tech Stack

- **Express.js** - Web framework
- **ethers.js v6** - Signature verification
- **TypeScript** - Type safety
- **Shared types** from `@shared` package

## ⚖️ Trade-offs

- **In-Memory State** - Using memory over database reduces complexity but limits scalability
- **CORS Allow All** - Configured for demo purposes, production needs domain allowlist
- **Signature Only** - Focused on core verification without user management for requirements efficiency
- **Monorepo Types** - Workspace types ensure safety with frontend but add build coordination
- **No Rate Limiting** - Simplified for demo, production would need API protection
