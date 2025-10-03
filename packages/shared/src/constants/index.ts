export const API_ENDPOINTS = {
  VERIFY_SIGNATURE: "/api/verify-signature",
} as const;

export const ERROR_MESSAGES = {
  VERIFICATION_FAILED: "Signature verification failed",
  WALLET_NOT_CONNECTED: "Wallet not connected",
  EMPTY_MESSAGE: "Message cannot be empty",
} as const;
