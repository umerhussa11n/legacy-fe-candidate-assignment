import React, { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useSignatureHistory } from "@/hooks/useSignatureHistory";
import { toast } from "react-hot-toast";

export const MessageSigner: React.FC = () => {
  const [message, setMessage] = useState("");
  const { isAuthenticated, address, isSigning, signMessage } = useWallet();
  const { addSignature } = useSignatureHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message to sign");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const signature = await signMessage(message);

      if (signature && address) {
        addSignature(message, signature, address);
        setMessage(""); // Clear the form
        toast.success("🎉 Message signed and added to history!", {
          duration: 4000, // 4 seconds to celebrate success
        });
      }
    } catch (error) {
      console.error("Signing failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Sign Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message to Sign
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your custom message here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            disabled={isSigning || !isAuthenticated}
          />
        </div>

        {isAuthenticated && address && (
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Signing with:</span>{" "}
              <span className="font-mono text-blue-600">{address}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isAuthenticated || !message.trim() || isSigning}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            !isAuthenticated || !message.trim() || isSigning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isSigning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing Message...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {isAuthenticated ? "Sign Message" : "Connect Wallet to Sign"}
            </>
          )}
        </button>
      </form>

      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            💡 Connect your wallet using Dynamic.xyz authentication to start
            signing messages.
          </p>
        </div>
      )}
    </div>
  );
};
