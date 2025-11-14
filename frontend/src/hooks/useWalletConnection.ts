import { useCurrentAccount } from "@mysten/dapp-kit";

/**
 * Wallet connection hook
 * Wraps the existing Sui Wallet SDK for easier access
 */
export function useWalletConnection() {
  const currentAccount = useCurrentAccount();

  return {
    walletAddress: currentAccount?.address || null,
    isConnected: !!currentAccount,
    account: currentAccount,
  };
}
