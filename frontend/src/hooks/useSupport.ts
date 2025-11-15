import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface SupportResult {
  success: boolean;
  txHash: string | null;
  error?: string;
}

/**
 * Hook to execute support transaction with SUI
 * Note: Changed from USDC to SUI
 * - USDC: 6 decimals (1 USDC = 1_000_000)
 * - SUI: 9 decimals (1 SUI = 1_000_000_000)
 */
export function useSupport() {
  const { walletAddress } = useWalletConnection();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const executeSupport = async (amount: number): Promise<SupportResult> => {
    if (!walletAddress) {
      const error = new Error("Wallet not connected");
      setError(error);
      return { success: false, txHash: null, error: error.message };
    }

    if (amount <= 0) {
      const error = new Error("Invalid amount");
      setError(error);
      return { success: false, txHash: null, error: error.message };
    }

    setIsSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const nftState = CONTRACT_ADDRESSES.MEMBERS_NFT_CONTRACT;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState || !nftState) {
        throw new Error("Contract addresses not configured");
      }

      // Convert amount to smallest unit (9 decimals for SUI)
      const amountInSmallestUnit = Math.floor(amount * 1_000_000_000);

      console.log("Preparing support transaction:", {
        amount,
        amountInSmallestUnit,
        packageId,
        daoPoolState,
        nftState,
        coinType,
        walletAddress,
      });

      // Build transaction
      const tx = new Transaction();

      // Split SUI coin for the support amount
      const [coin] = tx.splitCoins(tx.gas, [amountInSmallestUnit]);

      // Call support function
      // Arguments match dao_pool.move support function:
      // 1. state: &mut DaoPoolState<T>
      // 2. nft_state: &mut MembersNFTState
      // 3. payment: Coin<T>
      // 4. clock: &Clock
      tx.moveCall({
        target: `${packageId}::dao_pool::support`,
        arguments: [
          tx.object(daoPoolState),
          tx.object(nftState),
          coin,
          tx.object("0x6"), // Sui Clock object
        ],
        typeArguments: [coinType],
      });

      // Execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Transaction executed:", result);

      const digest = result.digest;
      setTxHash(digest);

      // Wait for transaction confirmation
      await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });

      console.log("Support transaction confirmed:", digest);

      return { success: true, txHash: digest };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Support transaction failed");
      setError(error);
      console.error("Error executing support:", err);
      return { success: false, txHash: null, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setError(null);
    setTxHash(null);
  };

  return {
    executeSupport,
    isSubmitting,
    error,
    txHash,
    reset,
  };
}
