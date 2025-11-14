import { SuiClient } from "@mysten/sui/client";

// Sui client configuration
export const suiClient = new SuiClient({
  url: import.meta.env.VITE_SUI_NETWORK === "mainnet"
    ? "https://fullnode.mainnet.sui.io:443"
    : "https://fullnode.testnet.sui.io:443",
});

// Network configuration
export const NETWORK = import.meta.env.VITE_SUI_NETWORK || "testnet";

export default suiClient;
