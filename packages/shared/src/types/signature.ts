export interface SignatureRequest {
  message: string;
}

export interface SignatureResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}

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
