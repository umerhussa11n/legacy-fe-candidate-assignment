import "@testing-library/jest-dom";

// Mock Dynamic.xyz SDK
const mockConnectWithOtp = jest.fn();
const mockConnectWithEmail = jest.fn();
const mockVerifyOneTimePassword = jest.fn();
const mockSendOtpToEmail = jest.fn();
const mockHandleLogOut = jest.fn();
const mockSignMessage = jest.fn();
const mockUseDynamicContext = jest.fn();

jest.mock("@dynamic-labs/sdk-react-core", () => ({
  DynamicContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useDynamicContext: mockUseDynamicContext,
  useConnectWithOtp: () => ({
    connectWithOtp: mockConnectWithOtp,
    connectWithEmail: mockConnectWithEmail,
    verifyOneTimePassword: mockVerifyOneTimePassword,
  }),
  useSendOtpToEmail: () => ({
    sendOtpToEmail: mockSendOtpToEmail,
  }),
}));

// Default mock implementations
mockUseDynamicContext.mockReturnValue({
  user: null,
  setShowAuthFlow: jest.fn(),
  primaryWallet: null,
  handleLogOut: mockHandleLogOut,
});

// Export mock functions for use in tests
(global as any).mockConnectWithOtp = mockConnectWithOtp;
(global as any).mockConnectWithEmail = mockConnectWithEmail;
(global as any).mockVerifyOneTimePassword = mockVerifyOneTimePassword;
(global as any).mockSendOtpToEmail = mockSendOtpToEmail;
(global as any).mockHandleLogOut = mockHandleLogOut;
(global as any).mockSignMessage = mockSignMessage;
(global as any).mockUseDynamicContext = mockUseDynamicContext;

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock API service
jest.mock("@/services/api", () => ({
  apiService: {
    verifySignature: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};

Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
  configurable: true,
});

// Reset clipboard mock before each test
beforeEach(() => {
  mockClipboard.writeText.mockClear();
});
