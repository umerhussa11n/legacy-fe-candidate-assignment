import { Request, Response } from "express";
import { SignatureVerificationService } from "../services/signatureService";
import { VerificationRequest } from "@shared/types/signature";
import { ApiResponse } from "@shared/types/api";

export class SignatureController {
  private signatureService: SignatureVerificationService;

  constructor() {
    this.signatureService = new SignatureVerificationService();
  }

  /**
   * POST /verify-signature
   * Verifies a signature and returns validation result
   */
  verifySignature = async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, signature }: VerificationRequest = req.body;

      // Basic validation
      if (!message || !signature) {
        const response: ApiResponse = {
          success: false,
          error: "Missing required fields: message and signature",
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Verify signature
      const verificationResult = await this.signatureService.verifySignature({
        message,
        signature,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          isValid: verificationResult.isValid,
          signer: verificationResult.signer,
          originalMessage: verificationResult.originalMessage,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in verifySignature:", error);

      const response: ApiResponse = {
        success: false,
        error: "Internal server error during signature verification",
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };
}
