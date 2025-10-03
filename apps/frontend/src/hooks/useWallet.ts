import { useEffect, useState } from "react";
import {
  useDynamicContext,
  useConnectWithOtp,
} from "@dynamic-labs/sdk-react-core";
import { Wallet } from "@dynamic-labs/sdk-react-core";
import { toast } from "react-hot-toast";

export interface WalletState {
  isAuthenticated: boolean;
  isConnecting: boolean;
  wallet: Wallet | null;
  address: string | null;
  network: string | null;
}

export interface EmailAuthState {
  emailSent: boolean;
  email: string;
  otp: string;
}

export interface SigningState {
  isSigning: boolean;
  error: string | null;
}

export const useWallet = () => {
  const dynamicContext = useDynamicContext();
  const { user, primaryWallet, handleLogOut } = dynamicContext;
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  // Log available methods for debugging
  console.log("🔧 Dynamic Context Methods:", Object.keys(dynamicContext));

  const [walletState, setWalletState] = useState<WalletState>({
    isAuthenticated: false,
    isConnecting: false,
    wallet: null,
    address: null,
    network: null,
  });

  const [emailAuthState, setEmailAuthState] = useState<EmailAuthState>({
    emailSent: false,
    email: "",
    otp: "",
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

  const connectWithEmailAuth = async (email: string) => {
    try {
      console.log("� Starting email authentication...", email);

      setWalletState((prev) => ({ ...prev, isConnecting: true }));
      setEmailAuthState((prev) => ({ ...prev, email }));

      toast.loading("� Sending verification code...", {
        id: "email-auth",
        duration: 8000,
      });

      // Send OTP to email using Dynamic.xyz
      await connectWithEmail(email);

      setEmailAuthState((prev) => ({ ...prev, emailSent: true }));

      toast.success("✅ Verification code sent! Check your email.", {
        duration: 6000,
      });
    } catch (error) {
      console.error("❌ Email authentication error:", error);
      toast.error(
        `❌ Failed to send verification code: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        {
          duration: 6000,
        }
      );
    } finally {
      setWalletState((prev) => ({ ...prev, isConnecting: false }));
      toast.dismiss("email-auth");
    }
  };

  const verifyEmailOtp = async (otp: string) => {
    try {
      console.log("🔐 Verifying OTP...", otp);

      setWalletState((prev) => ({ ...prev, isConnecting: true }));
      setEmailAuthState((prev) => ({ ...prev, otp }));

      toast.loading("🔐 Verifying code...", {
        id: "otp-verify",
        duration: 8000,
      });

      // Verify OTP using Dynamic.xyz
      await verifyOneTimePassword(otp);

      toast.success("✅ Email verified! Creating embedded wallet...", {
        duration: 4000,
      });
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      toast.error(
        `❌ Invalid verification code: ${
          error instanceof Error ? error.message : "Please try again"
        }`,
        {
          duration: 6000,
        }
      );
    } finally {
      setWalletState((prev) => ({ ...prev, isConnecting: false }));
      toast.dismiss("otp-verify");
    }
  };

  // Legacy method for backward compatibility
  const connectWallet = async () => {
    toast.error(
      "⚠️ Please use email authentication instead of external wallets",
      {
        duration: 4000,
      }
    );
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

    // Email authentication state
    ...emailAuthState,

    // Signing state
    ...signingState,

    // Email Authentication Actions
    connectWithEmailAuth,
    verifyEmailOtp,

    // Legacy Actions
    connectWallet,
    disconnectWallet,
    signMessage,
    switchNetwork,
  };
};
