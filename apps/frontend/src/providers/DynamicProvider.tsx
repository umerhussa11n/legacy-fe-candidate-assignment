import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

interface DynamicProviderProps {
  children: React.ReactNode;
}

export const DynamicProvider: React.FC<DynamicProviderProps> = ({
  children,
}) => {
  return (
    <DynamicContextProvider
      settings={{
        // Environment ID from Dynamic.xyz dashboard
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "",

        // Wallet connectors
        walletConnectors: [EthereumWalletConnectors],

        // Enable headless mode for custom UI
        headless: true,

        // Initial authentication method
        initialAuthenticationMode: "connect-and-sign",

        // Supported networks
        supportedNetworks: [
          {
            blockExplorerUrls: ["https://etherscan.io/"],
            chainId: 1,
            chainName: "Ethereum Mainnet",
            iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
            name: "Ethereum",
            nativeCurrency: {
              decimals: 18,
              name: "Ether",
              symbol: "ETH",
            },
            networkId: 1,
            rpcUrls: ["https://mainnet.infura.io/v3/"],
            vanityName: "Ethereum",
          },
          {
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            chainId: 11155111,
            chainName: "Sepolia Testnet",
            iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
            name: "Sepolia",
            nativeCurrency: {
              decimals: 18,
              name: "Ether",
              symbol: "ETH",
            },
            networkId: 11155111,
            rpcUrls: ["https://sepolia.infura.io/v3/"],
            vanityName: "Sepolia",
          },
        ],

        // Custom CSS for Dynamic components
        cssOverrides: `
          .dynamic-widget-inline-controls {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
          }
        `,

        // Events
        events: {
          onConnect: (args) => {
            console.log("Wallet connected:", args);
          },
          onDisconnect: () => {
            console.log("Wallet disconnected");
          },
          onAuthSuccess: (args) => {
            console.log("Authentication successful:", args);
          },
          onAuthFailure: (error) => {
            console.error("Authentication failed:", error);
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
