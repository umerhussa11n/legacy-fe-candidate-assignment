import { ethers } from 'ethers';
import { VerificationRequest, VerificationResponse } from '@shared/types/signature';

export class SignatureVerificationService {
  /**
   * Verifies a signature using ethers.js
   * @param request - Contains message and signature
   * @returns Verification result with signer address
   */
  async verifySignature(request: VerificationRequest): Promise<VerificationResponse> {
    const { message, signature } = request;

    try {
      // Recover the signer address from the signature
      const signerAddress = ethers.verifyMessage(message, signature);

      return {
        isValid: true,
        signer: signerAddress,
        originalMessage: message
      };
    } catch (error) {
      console.error('Signature verification failed:', error);
      
      return {
        isValid: false,
        signer: '',
        originalMessage: message
      };
    }
  }
}