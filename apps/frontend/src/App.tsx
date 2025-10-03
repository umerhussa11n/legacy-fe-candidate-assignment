import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  Wallet,
  MessageSquare,
  History,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Zap,
} from "lucide-react";
import { DynamicProvider } from "./providers/DynamicProvider";
import { WalletConnection } from "./components/WalletConnection";
import { MessageSigner } from "./components/MessageSigner";
import { SignatureHistory } from "./components/SignatureHistory";
import { LoadingScreen } from "./components/LoadingScreen";
import { useWallet } from "./hooks/useWallet";

type TabType = "connect" | "sign" | "history";

const NavigationHeader = ({
  currentTab,
  setCurrentTab,
  isAuthenticated,
}: {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  isAuthenticated: boolean;
}) => {
  const tabs = [
    {
      id: "connect" as TabType,
      name: "Connect Wallet",
      icon: Wallet,
      step: 1,
      completed: isAuthenticated,
    },
    {
      id: "sign" as TabType,
      name: "Sign Message",
      icon: MessageSquare,
      step: 2,
      disabled: !isAuthenticated,
    },
    {
      id: "history" as TabType,
      name: "History & Verify",
      icon: History,
      step: 3,
      disabled: !isAuthenticated,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web3 Signer
              </h1>
              <p className="text-xs text-gray-500">Dynamic.xyz Integration</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              const isDisabled = tab.disabled;
              const isCompleted = tab.completed;

              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setCurrentTab(tab.id)}
                  disabled={isDisabled}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm"
                        : isDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  {/* Step Number */}
                  <div
                    className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-blue-500 text-white"
                        : isDisabled
                        ? "bg-gray-300 text-gray-500"
                        : "bg-gray-400 text-white"
                    }
                  `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      tab.step
                    )}
                  </div>

                  {/* Icon */}
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-blue-600" : ""}`}
                  />

                  {/* Label */}
                  <span className="hidden sm:block">{tab.name}</span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-x-0 -bottom-3 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Connected
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                <Lock className="h-3 w-3" />
                Disconnected
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-grid-gray-100 opacity-25" />

    <div className="relative max-w-7xl mx-auto px-4 py-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Powered by Dynamic.xyz & ethers.js
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Secure Message
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Signing{" "}
          </span>
          Made Simple
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect your wallet, sign custom messages, and verify signatures with
          our beautiful Web3 interface powered by headless Dynamic.xyz
          authentication.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>

          <button className="flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
            <Shield className="h-5 w-5" />
            View Demo
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Wallet,
              title: "Easy Connection",
              description:
                "Connect with any wallet using Dynamic.xyz headless authentication",
            },
            {
              icon: MessageSquare,
              title: "Secure Signing",
              description:
                "Sign custom messages with cryptographic security and verification",
            },
            {
              icon: History,
              title: "Complete History",
              description:
                "Track and verify all your signed messages with detailed history",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>("connect");
  const [showHero, setShowHero] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useWallet();

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleGetStarted = () => {
    setShowHero(false);
    setCurrentTab("connect");
  };

  if (showHero) {
    return <HeroSection onGetStarted={handleGetStarted} />;
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "connect":
        return (
          <div className="max-w-md mx-auto">
            <WalletConnection />
            {isAuthenticated && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentTab("sign")}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Signing
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        );
      case "sign":
        return (
          <div className="max-w-md mx-auto">
            <MessageSigner />
          </div>
        );
      case "history":
        return (
          <div className="max-w-4xl mx-auto">
            <SignatureHistory />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavigationHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">{renderTabContent()}</div>
      </div>

      {/* Back to Home */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={() => setShowHero(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
        >
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <DynamicProvider>
      <AppContent />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000, // Default 5 seconds - much longer for readability
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
            padding: "18px",
            fontSize: "14px",
            fontWeight: "500",
            maxWidth: "400px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          },
          success: {
            duration: 4000, // 4 seconds for success messages
            style: {
              background: "#059669",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#059669",
            },
          },
          error: {
            duration: 6000, // 6 seconds for error messages (more time to read)
            style: {
              background: "#DC2626",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#DC2626",
            },
          },
          loading: {
            duration: 8000, // 8 seconds for loading messages
            style: {
              background: "#3B82F6",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#3B82F6",
            },
          },
        }}
      />
    </DynamicProvider>
  );
}

export default App;
