import { render, screen } from "@testing-library/react";
import { WalletConnection } from "../WalletConnection";
import { useWallet } from "@/hooks/useWallet";

// Mock the useWallet hook
jest.mock("@/hooks/useWallet");
const mockUseWallet = jest.mocked(useWallet);

describe("WalletConnection Component", () => {
  const defaultMockReturn = {
    isAuthenticated: false,
    isConnecting: false,
    address: null,
    network: null,
    user: undefined,
    emailSent: false,
    email: "",
    otp: "",
    connectWithEmailAuth: jest.fn(),
    verifyEmailOtp: jest.fn(),
    disconnectWallet: jest.fn(),
    isSigning: false,
    error: null,
    signMessage: jest.fn(),
    switchNetwork: jest.fn(),
    connectWallet: jest.fn(),
    wallet: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWallet.mockReturnValue(defaultMockReturn);
  });

  describe("Email Input Form", () => {
    it("should render email input form when not authenticated", () => {
      render(<WalletConnection />);

      expect(screen.getByText("Email Authentication")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send verification code/i })).toBeInTheDocument();
    });

    it("should disable submit button when email is empty", () => {
      render(<WalletConnection />);

      const submitButton = screen.getByRole("button", { name: /send verification code/i });
      expect(submitButton).toBeDisabled();
    });

    it("should show loading state when connecting", () => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        isConnecting: true,
      });

      render(<WalletConnection />);

      expect(screen.getByText("Sending Code...")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("OTP Verification Form", () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        emailSent: true,
        email: "test@example.com",
      });
    });

    it("should render OTP form when email is sent", () => {
      render(<WalletConnection />);

      expect(screen.getByText("Enter Verification Code")).toBeInTheDocument();
      expect(screen.getByLabelText("Verification Code")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /verify & create wallet/i })).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should disable submit button when OTP is empty", () => {
      render(<WalletConnection />);

      const submitButton = screen.getByRole("button", { name: /verify & create wallet/i });
      expect(submitButton).toBeDisabled();
    });

    it("should show loading state during verification", () => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        emailSent: true,
        email: "test@example.com",
        isConnecting: true,
      });

      render(<WalletConnection />);

      expect(screen.getByText("Verifying...")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Authenticated State", () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        isAuthenticated: true,
        address: "0x1234567890123456789012345678901234567890",
        network: "ethereum",
        user: { 
          email: "test@example.com",
          lastVerifiedCredentialId: "test-id",
          sessionId: "test-session",
          verifiedCredentials: [],
          missingFields: [],
        },
      });
    });

    it("should render authenticated state", () => {
      render(<WalletConnection />);

      expect(screen.getByText("Embedded Wallet Connected")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText(/0x1234...7890/)).toBeInTheDocument();
      expect(screen.getByText("ethereum")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /disconnect wallet/i })).toBeInTheDocument();
    });

    it("should render without network if not available", () => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        isAuthenticated: true,
        address: "0x1234567890123456789012345678901234567890",
        network: null,
        user: { 
          email: "test@example.com",
          lastVerifiedCredentialId: "test-id",
          sessionId: "test-session",
          verifiedCredentials: [],
          missingFields: [],
        },
      });

      render(<WalletConnection />);

      expect(screen.queryByText(/Network:/)).not.toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should require valid email format", () => {
      render(<WalletConnection />);

      const emailInput = screen.getByLabelText("Email Address");
      
      // The input has type="email" so browser validation will handle this
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("required");
    });

    it("should limit OTP input to 6 characters", () => {
      mockUseWallet.mockReturnValue({
        ...defaultMockReturn,
        emailSent: true,
        email: "test@example.com",
      });

      render(<WalletConnection />);

      const otpInput = screen.getByLabelText("Verification Code");
      expect(otpInput).toHaveAttribute("maxLength", "6");
      expect(otpInput).toHaveAttribute("pattern", "[0-9]{6}");
    });
  });
});