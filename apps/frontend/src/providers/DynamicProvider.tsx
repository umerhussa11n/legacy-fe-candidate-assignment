import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

interface DynamicProviderProps {
  children: React.ReactNode;
}

export const DynamicProvider: React.FC<DynamicProviderProps> = ({
  children,
}) => {
  const environmentId =
    import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID ||
    "3492aa47-61f0-4bda-ab2f-5bd3ef9fb701";

  console.log("🔧 Dynamic.xyz Environment Configuration:", {
    environmentId,
    envFromFile: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
    dashboardUrl: `https://app.dynamic.xyz/dashboard/${environmentId}`,
    emailAuthUrl: `https://app.dynamic.xyz/dashboard/${environmentId}/authentication`,
  });

  return (
    <DynamicContextProvider
      settings={{
        // Environment ID from Dynamic.xyz dashboard
        environmentId,

        // Wallet connectors
        walletConnectors: [EthereumWalletConnectors],

        // Events (only supported callbacks)
        events: {
          onAuthSuccess: (args: any) => {
            console.log("✅ Authentication successful:", args);
          },
          onAuthFailure: (error: any) => {
            console.error("❌ Authentication failed:", error);
          },
          onLogout: () => {
            console.log("👋 User logged out");
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
