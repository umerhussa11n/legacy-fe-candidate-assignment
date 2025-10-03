import React, { useState } from "react";
import {
  Mail,
  LogOut,
  Loader2,
  Shield,
  User,
  Network,
  Key,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { truncateAddress } from "@shared/utils/formatters";

export const WalletConnection: React.FC = () => {
  const {
    isAuthenticated,
    isConnecting,
    address,
    network,
    user,
    emailSent,
    email,
    connectWithEmailAuth,
    verifyEmailOtp,
    disconnectWallet,
  } = useWallet();

  const [inputEmail, setInputEmail] = useState("");
  const [inputOtp, setInputOtp] = useState("");

  // Form submission handlers
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail.trim()) {
      connectWithEmailAuth(inputEmail.trim());
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim()) {
      verifyEmailOtp(inputOtp.trim());
    }
  };

  // Show authenticated state
  if (isAuthenticated && address) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Embedded Wallet Connected
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
            <Key className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Wallet Address:</span>
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

  // Show OTP verification form if email was sent
  if (emailSent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Enter Verification Code
          </h2>
        </div>

        <p className="text-gray-600 mb-4">
          We've sent a verification code to{" "}
          <span className="font-medium text-blue-600">{email}</span>. Please
          enter the code below to create your embedded wallet.
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </div>

          <button
            type="submit"
            disabled={isConnecting || !inputOtp.trim()}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isConnecting || !inputOtp.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                Verify & Create Wallet
              </>
            )}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">
            � Don't see the email? Check your spam folder or try again.
          </p>
        </div>
      </div>
    );
  }

  // Show email input form
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Email Authentication
        </h2>
      </div>

      <p className="text-gray-600 mb-4">
        Enter your email address to create a secure embedded wallet powered by
        Dynamic.xyz. No external wallet required!
      </p>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isConnecting || !inputEmail.trim()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isConnecting || !inputEmail.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Code...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Send Verification Code
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          🔒 Dynamic.xyz embedded wallets are secure, custodial wallets created
          just for you. No browser extensions or downloads required.
        </p>
      </div>
    </div>
  );
};
