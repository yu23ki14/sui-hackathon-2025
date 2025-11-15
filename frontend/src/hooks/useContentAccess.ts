import { useState, useEffect, useRef } from "react";
import { useWalletConnection } from "./useWalletConnection";
import { useUserNftData } from "./useUserNftData";
import {
  initializeLitClient,
  decryptContent as litDecryptContent,
} from "../lib/litProtocol";
import type * as LitJsSdk from '@lit-protocol/lit-node-client';
import type { UnifiedAccessControlConditions } from '@lit-protocol/types';

/**
 * Hook to manage Lit Protocol content access control
 */
export function useContentAccess() {
  const { walletAddress } = useWalletConnection();
  const { nftCount } = useUserNftData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const litClientRef = useRef<LitJsSdk.LitNodeClient | null>(null);

  // Initialize Lit Protocol client on mount
  useEffect(() => {
    const initClient = async () => {
      try {
        if (!litClientRef.current) {
          const client = await initializeLitClient();
          litClientRef.current = client;
        }
      } catch (err) {
        console.error('Failed to initialize Lit client:', err);
        setError(err instanceof Error ? err : new Error('Lit Protocol の初期化に失敗しました'));
      }
    };

    initClient();

    // Cleanup on unmount
    return () => {
      if (litClientRef.current) {
        litClientRef.current.disconnect();
        litClientRef.current = null;
      }
    };
  }, []);

  /**
   * Authenticate with Lit Protocol
   */
  const authenticate = async (): Promise<boolean> => {
    if (!walletAddress) {
      setError(new Error("Wallet not connected"));
      return false;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Check if Lit Protocol client is initialized
      if (!litClientRef.current) {
        throw new Error("Lit Protocol client not initialized");
      }

      console.log("Authenticating with Lit Protocol", { walletAddress, nftCount });

      // For now, we authenticate based on NFT ownership
      // In a production environment, you would:
      // 1. Get wallet signature for authentication
      // 2. Verify access conditions with Lit Protocol
      // 3. Store authentication state

      // Set authenticated if user has at least 1 NFT
      const verified = nftCount >= 1;
      setIsAuthenticated(verified);

      return verified;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Authentication failed"));
      console.error("Error authenticating with Lit Protocol:", err);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Verify if user has access to content based on NFT count
   */
  const verifyAccess = (requiredNftCount: number): boolean => {
    return nftCount >= requiredNftCount;
  };

  /**
   * Decrypt content with Lit Protocol
   */
  const decryptContent = async (
    ciphertext: string,
    dataToEncryptHash: string,
    unifiedAccessControlConditions: UnifiedAccessControlConditions,
    requiredNftCount: number
  ): Promise<string> => {
    if (!walletAddress) {
      throw new Error("Wallet not connected");
    }

    if (!verifyAccess(requiredNftCount)) {
      throw new Error("Insufficient NFT count for access");
    }

    if (!litClientRef.current) {
      throw new Error("Lit Protocol client not initialized");
    }

    try {
      console.log("Decrypting content with Lit Protocol", {
        requiredNftCount,
        walletAddress,
        nftCount
      });

      // Decrypt content using Lit Protocol
      const decrypted = await litDecryptContent(
        litClientRef.current,
        ciphertext,
        dataToEncryptHash,
        unifiedAccessControlConditions
      );

      return decrypted;
    } catch (err) {
      console.error("Error decrypting content:", err);
      throw err;
    }
  };

  return {
    authenticate,
    isAuthenticated,
    verifyAccess,
    decryptContent,
    isAuthenticating,
    error,
  };
}
