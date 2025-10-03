import { renderHook, act } from "@testing-library/react";
import { useWallet } from "../useWallet";

// Get the global mock functions from setupTests
declare global {
  var mockConnectWithOtp: jest.MockedFunction<any>;
  var mockConnectWithEmail: jest.MockedFunction<any>;
  var mockVerifyOneTimePassword: jest.MockedFunction<any>;
  var mockSendOtpToEmail: jest.MockedFunction<any>;
  var mockHandleLogOut: jest.MockedFunction<any>;
  var mockSignMessage: jest.MockedFunction<any>;
  var mockUseDynamicContext: jest.MockedFunction<any>;
}

describe("useWallet Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mocks to default state
    global.mockUseDynamicContext.mockReturnValue({
      user: null,
      setShowAuthFlow: jest.fn(),
      primaryWallet: null,
      handleLogOut: global.mockHandleLogOut,
    });

    global.mockConnectWithEmail.mockResolvedValue({ success: true });
    global.mockVerifyOneTimePassword.mockResolvedValue({ success: true });
    global.mockConnectWithOtp.mockResolvedValue({
      user: {
        userId: "test-user-123",
        email: "test@example.com",
        walletPublicKey: "0x1234567890123456789012345678901234567890",
      },
      wallet: {
        address: "0x1234567890123456789012345678901234567890",
        signMessage: global.mockSignMessage,
      },
    });
    global.mockSignMessage.mockResolvedValue("0xsignature123");
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.wallet).toBe(null);
      expect(result.current.address).toBe(null);
      expect(result.current.network).toBe(null);
      expect(result.current.emailSent).toBe(false);
      expect(result.current.email).toBe("");
      expect(result.current.otp).toBe("");
      expect(result.current.isSigning).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.user).toBe(null);
    });
  });

  describe("Email Authentication", () => {
    it("should send OTP when email is provided", async () => {
      global.mockConnectWithEmail.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.connectWithEmailAuth("test@example.com");
      });

      expect(result.current.emailSent).toBe(true);
      expect(result.current.email).toBe("test@example.com");
    });

    it("should verify OTP and connect wallet", async () => {
      global.mockVerifyOneTimePassword.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useWallet());

      // First set email
      await act(async () => {
        await result.current.connectWithEmailAuth("test@example.com");
      });

      // Then verify OTP
      await act(async () => {
        await result.current.verifyEmailOtp("123456");
      });

      expect(global.mockVerifyOneTimePassword).toHaveBeenCalledWith("123456");
    });
  });

  describe("Message Signing", () => {
    it("should return null when no wallet is connected", async () => {
      const { result } = renderHook(() => useWallet());

      await act(async () => {
        const signature = await result.current.signMessage("Hello World");
        expect(signature).toBeNull();
      });
    });
  });

  describe("Disconnect", () => {
    it("should disconnect wallet and reset state", async () => {
      const { result } = renderHook(() => useWallet());

      await act(async () => {
        result.current.disconnectWallet();
      });

      expect(global.mockHandleLogOut).toHaveBeenCalled();
    });
  });
});
