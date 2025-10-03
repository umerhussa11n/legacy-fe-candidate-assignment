import { renderHook, act } from "@testing-library/react";
import { useSignatureHistory } from "../useSignatureHistory";

// Mock localStorage properly
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Override the global localStorage mock for this test
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("useSignatureHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe("Initial State", () => {
    it("should initialize with empty history", () => {
      const { result } = renderHook(() => useSignatureHistory());

      expect(result.current.history).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.addSignature).toBe("function");
      expect(typeof result.current.verifySignature).toBe("function");
      expect(typeof result.current.clearHistory).toBe("function");
      expect(typeof result.current.removeItem).toBe("function");
    });

    it("should load history from localStorage", () => {
      const savedHistory = [
        {
          id: "test-1",
          message: "Hello World",
          signature: "0xabcdef...",
          signer: "0x1234...5678",
          timestamp: Date.now(),
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedHistory));

      const { result } = renderHook(() => useSignatureHistory());

      expect(result.current.history).toEqual(savedHistory);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("signature-history");
    });

    it("should handle invalid localStorage data gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");
      console.error = jest.fn(); // Mock console.error

      const { result } = renderHook(() => useSignatureHistory());

      expect(result.current.history).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load signature history:",
        expect.any(SyntaxError)
      );
    });
  });

  describe("Adding Signatures", () => {
    it("should add signature to history", () => {
      const { result } = renderHook(() => useSignatureHistory());

      let signatureId: string;
      act(() => {
        signatureId = result.current.addSignature(
          "Hello World",
          "0xabcdef...",
          "0x1234...5678"
        );
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0]).toMatchObject({
        message: "Hello World",
        signature: "0xabcdef...",
        signer: "0x1234...5678",
      });
      expect(result.current.history[0].id).toBe(signatureId!);
      expect(result.current.history[0].timestamp).toBeGreaterThan(0);
    });

    it("should add multiple signatures in correct order (newest first)", () => {
      const { result } = renderHook(() => useSignatureHistory());

      act(() => {
        result.current.addSignature("First", "0x111...", "0x1111...");
      });

      act(() => {
        result.current.addSignature("Second", "0x222...", "0x2222...");
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].message).toBe("Second");
      expect(result.current.history[1].message).toBe("First");
    });
  });

  describe("Removing Items", () => {
    it("should remove individual item", () => {
      const { result } = renderHook(() => useSignatureHistory());

      // Add two signatures
      act(() => {
        result.current.addSignature("First", "0x111...", "0x1111...");
        result.current.addSignature("Second", "0x222...", "0x2222...");
      });

      const itemToRemove = result.current.history[1].id; // "First" signature

      act(() => {
        result.current.removeItem(itemToRemove);
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].message).toBe("Second");
    });

    it("should clear all history", () => {
      const { result } = renderHook(() => useSignatureHistory());

      // Add signatures
      act(() => {
        result.current.addSignature("First", "0x111...", "0x1111...");
        result.current.addSignature("Second", "0x222...", "0x2222...");
      });

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toEqual([]);
    });
  });
});