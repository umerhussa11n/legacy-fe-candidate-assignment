# Frontend App

React + TypeScript frontend for Web3 message signing with Dynamic.xyz wallet authentication.

## 🚀 Quick Start

```bash
yarn dev    # Development server (port 3000)
yarn build  # Production build
yarn test   # Run tests
```

## 📁 Structure

```
src/
├── components/     # React components
├── hooks/         # Custom hooks (useAuth, useSignature)
├── App.tsx        # Main component
└── main.tsx       # Entry point
```

## 🎯 Features

- **Dynamic.xyz Auth** - Headless wallet connection
- **Message Signing** - Sign custom messages with wallet
- **Signature Verification** - Send to backend API for validation
- **History** - Local storage of signed messages
- **Responsive UI** - Tailwind CSS styling

## 🛠️ Tech Stack

- **React 18** - Component framework
- **Vite** - Fast bundler with HMR
- **Tailwind CSS** - Utility-first styling
- **Dynamic.xyz SDK** - Wallet authentication
- **Shared types** from `@shared` package
