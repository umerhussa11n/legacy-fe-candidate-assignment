export interface WalletUser {
  address: string;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: WalletUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  signMessage: (message: string) => Promise<string>;
  isConnected: boolean;
}
