import { useState, useEffect } from "react";
import { SignedMessage, VerificationResponse } from "@shared/types/signature";
import { apiService } from "@/services/api";
import { toast } from "react-hot-toast";

export interface SignatureHistoryItem extends SignedMessage {
  id: string;
  verification?: VerificationResponse;
  isVerifying?: boolean;
  verificationError?: string;
}

export const useSignatureHistory = () => {
  const [history, setHistory] = useState<SignatureHistoryItem[]>([]);
  const [isLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    console.log(
      "🔄 useSignatureHistory: Loading from localStorage on mount..."
    );
    const savedHistory = localStorage.getItem("signature-history");
    console.log("🔄 useSignatureHistory: Found saved history:", savedHistory);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        console.log("🔄 useSignatureHistory: Parsed history:", parsedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Failed to load signature history:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save history to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) {
      console.log(
        "💾 useSignatureHistory: Skipping save during initialization"
      );
      return;
    }

    console.log("💾 useSignatureHistory: Saving to localStorage:", history);
    localStorage.setItem("signature-history", JSON.stringify(history));
    console.log(
      "💾 useSignatureHistory: Saved. Current localStorage:",
      localStorage.getItem("signature-history")
    );
  }, [history, isInitialized]);

  const addSignature = (message: string, signature: string, signer: string) => {
    const newItem: SignatureHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      signature,
      signer,
      timestamp: Date.now(),
    };

    console.log("📝 useSignatureHistory: Adding new item:", newItem);
    setHistory((prev) => {
      const newHistory = [newItem, ...prev];
      console.log("📝 useSignatureHistory: New history array:", newHistory);

      // Immediately save to localStorage
      console.log(
        "💾 useSignatureHistory: Immediately saving new history to localStorage"
      );
      localStorage.setItem("signature-history", JSON.stringify(newHistory));

      return newHistory;
    });
    return newItem.id;
  };

  const verifySignature = async (itemId: string) => {
    const item = history.find((h) => h.id === itemId);
    if (!item) return;

    // Update item to show verification in progress
    setHistory((prev) =>
      prev.map((h) =>
        h.id === itemId
          ? { ...h, isVerifying: true, verificationError: undefined }
          : h
      )
    );

    try {
      const verification = await apiService.verifySignature({
        message: item.message,
        signature: item.signature,
      });

      // Update item with verification result
      setHistory((prev) =>
        prev.map((h) =>
          h.id === itemId
            ? {
                ...h,
                verification,
                isVerifying: false,
                verificationError: undefined,
              }
            : h
        )
      );

      if (verification.isValid) {
        toast.success("✅ Signature verified successfully!", {
          duration: 4000, // 4 seconds for success
        });
      } else {
        toast.error("❌ Signature verification failed", {
          duration: 5000, // 5 seconds for error
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";

      // Update item with error
      setHistory((prev) =>
        prev.map((h) =>
          h.id === itemId
            ? {
                ...h,
                isVerifying: false,
                verificationError: errorMessage,
              }
            : h
        )
      );

      toast.error(`❌ Verification error: ${errorMessage}`, {
        duration: 6000, // 6 seconds for detailed error
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("🗑️ History cleared successfully", {
      duration: 3000, // 3 seconds for simple actions
    });
  };

  const removeItem = (itemId: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== itemId));
    toast.success("🗑️ Item removed", {
      duration: 3000, // 3 seconds for simple actions
    });
  };

  return {
    history,
    isLoading,
    addSignature,
    verifySignature,
    clearHistory,
    removeItem,
  };
};
