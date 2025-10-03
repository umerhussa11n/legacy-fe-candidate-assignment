import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@shared/types/api";
import {
  VerificationRequest,
  VerificationResponse,
} from "@shared/types/signature";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  }

  /**
   * Verify a signed message with the backend
   */
  async verifySignature(
    request: VerificationRequest
  ): Promise<VerificationResponse> {
    try {
      const response: AxiosResponse<ApiResponse<VerificationResponse>> =
        await axios.post(`${this.baseURL}/verify-signature`, request, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        });

      if (!response.data.success) {
        throw new Error(response.data.error || "Verification failed");
      }

      return response.data.data!;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error || error.message || "Network error";
        throw new Error(`API Error: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000,
      });
      return response.data.success === true;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
