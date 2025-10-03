import React from "react";
import {
  History,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Trash2,
  Shield,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useSignatureHistory } from "@/hooks/useSignatureHistory";
import { truncateAddress, formatTimestamp } from "@shared/utils/formatters";
import { toast } from "react-hot-toast";

export const SignatureHistory: React.FC = () => {
  const { history, verifySignature, removeItem, clearHistory } =
    useSignatureHistory();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getVerificationStatus = (item: any) => {
    if (item.isVerifying) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
        text: "Verifying...",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    }

    if (item.verificationError) {
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        text: "Verification Failed",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }

    if (item.verification) {
      return item.verification.isValid
        ? {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            text: "Valid Signature",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          }
        : {
            icon: <XCircle className="h-4 w-4 text-red-500" />,
            text: "Invalid Signature",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
          };
    }

    return {
      icon: <Clock className="h-4 w-4 text-gray-400" />,
      text: "Not Verified",
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    };
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Signature History
          </h2>
        </div>

        <div className="text-center py-8">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No signed messages yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Sign your first message to see it here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Signature History
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {history.length}
            </span>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history.map((item) => {
          const status = getVerificationStatus(item);

          return (
            <div
              key={item.id}
              className="p-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Message */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Message:
                    </p>
                    <div className="bg-gray-50 rounded-md p-2 border">
                      <p className="text-sm text-gray-700 break-words">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Signature:
                    </p>
                    <div className="bg-gray-50 rounded-md p-2 border font-mono text-xs text-gray-600 break-all">
                      {item.signature}
                      <button
                        onClick={() =>
                          copyToClipboard(item.signature, "Signature")
                        }
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-3 w-3 inline" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span>Signer: {truncateAddress(item.signer)}</span>
                    <span>•</span>
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>

                  {/* Verification Status */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm ${status.bgColor} ${status.borderColor} border`}
                  >
                    {status.icon}
                    <span className={status.color}>{status.text}</span>
                  </div>

                  {/* Verification Error */}
                  {item.verificationError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-700">
                          Error: {item.verificationError}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verification Result */}
                  {item.verification && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded-md">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Verified Signer:</span>{" "}
                        <span className="font-mono">
                          {truncateAddress(item.verification.signer)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => verifySignature(item.id)}
                    disabled={item.isVerifying}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Shield className="h-3 w-3" />
                    Verify
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
