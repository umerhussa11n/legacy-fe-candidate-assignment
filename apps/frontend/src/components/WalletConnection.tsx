import React from "react";
import { Wallet, LogOut, Loader2, Shield, User, Network } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { truncateAddress } from "@shared/utils/formatters";

export const WalletConnection: React.FC = () => {
  const {
    isAuthenticated,
    isConnecting,
    address,
    network,
    user,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  if (isAuthenticated && address) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Wallet Connected
          </h2>
        </div>

        <div className="space-y-3">
          {user?.email && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Address:</span>
            <span className="font-mono text-blue-600">
              {truncateAddress(address)}
            </span>
          </div>

          {network && (
            <div className="flex items-center gap-2 text-sm">
              <Network className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Network:</span>
              <span className="font-medium capitalize">{network}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={disconnectWallet}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Connect Wallet</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Connect your wallet using Dynamic.xyz to start signing and verifying
        messages.
      </p>

      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
          isConnecting
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect with Dynamic.xyz
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          🔒 Dynamic.xyz provides secure, headless wallet authentication with
          support for multiple wallet types.
        </p>
      </div>
    </div>
  );
};
