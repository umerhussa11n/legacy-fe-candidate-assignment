import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Wallet } from "@dynamic-labs/sdk-react-core";
import { toast } from "react-hot-toast";

export interface WalletState {
  isAuthenticated: boolean;
  isConnecting: boolean;
  wallet: Wallet | null;
  address: string | null;
  network: string | null;
}

export interface SigningState {
  isSigning: boolean;
  error: string | null;
}

export const useWallet = () => {
  const { user, setShowAuthFlow, primaryWallet, handleLogOut } =
    useDynamicContext();

  const [walletState, setWalletState] = useState<WalletState>({
    isAuthenticated: false,
    isConnecting: false,
    wallet: null,
    address: null,
    network: null,
  });

  const [signingState, setSigningState] = useState<SigningState>({
    isSigning: false,
    error: null,
  });

  // Update wallet state when authentication changes
  useEffect(() => {
    const isAuthenticated = !!user && !!primaryWallet;
    setWalletState({
      isAuthenticated,
      isConnecting: false,
      wallet: primaryWallet,
      address: primaryWallet?.address || null,
      network: primaryWallet?.chain || null,
    });
  }, [user, primaryWallet]);

  const connectWallet = async () => {
    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true }));
      setShowAuthFlow(true);
      toast.loading("🔗 Connecting to your wallet...", {
        id: "wallet-connect",
        duration: 6000, // 6 seconds to give users time to see it
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("❌ Failed to connect wallet. Please try again.", {
        duration: 5000, // 5 seconds for error messages
      });
    } finally {
      setWalletState((prev) => ({ ...prev, isConnecting: false }));
      // Don't dismiss immediately, let it show success/error state
      setTimeout(() => {
        toast.dismiss("wallet-connect");
      }, 2000);
    }
  };

  const disconnectWallet = async () => {
    try {
      await handleLogOut();
      toast.success("👋 Wallet disconnected successfully", {
        duration: 4000, // 4 seconds for success messages
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("❌ Failed to disconnect wallet. Please try again.", {
        duration: 5000, // 5 seconds for error messages
      });
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!primaryWallet) {
      toast.error("Please connect your wallet first");
      return null;
    }

    setSigningState({ isSigning: true, error: null });

    try {
      toast.loading("✍️ Signing your message...", {
        id: "message-sign",
        duration: 8000, // 8 seconds for signing process
      });

      // Use Dynamic's signMessage method
      const signature = await primaryWallet.signMessage(message);

      if (!signature) {
        throw new Error("No signature returned");
      }

      toast.success("✅ Message signed successfully!", {
        duration: 4000, // 4 seconds for success
      });
      return signature;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign message";
      console.error("Signing failed:", error);

      setSigningState((prev) => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Signing failed: ${errorMessage}`, {
        duration: 6000, // 6 seconds for error messages with details
      });
      return null;
    } finally {
      setSigningState((prev) => ({ ...prev, isSigning: false }));
      toast.dismiss("message-sign");
    }
  };

  const switchNetwork = async (chainId: number) => {
    if (!primaryWallet) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      toast.loading("Switching network...", { id: "network-switch" });
      await primaryWallet.connector?.switchNetwork({ networkChainId: chainId });
      toast.success("Network switched successfully!");
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network");
    } finally {
      toast.dismiss("network-switch");
    }
  };

  return {
    // Wallet state
    ...walletState,
    user,

    // Signing state
    ...signingState,

    // Actions
    connectWallet,
    disconnectWallet,
    signMessage,
    switchNetwork,
  };
};
