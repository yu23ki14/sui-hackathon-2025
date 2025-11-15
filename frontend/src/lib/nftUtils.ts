import { suiClient } from "./suiClient";

/**
 * MemberNFT type structure
 */
export interface MemberNFT {
  id: string;
  owner: string;
  supportAmount: number;
  rank: string;
  mintedAt: number;
  imageUrl: string;
}

/**
 * Get all MemberNFTs owned by a specific address
 * @param walletAddress - User's wallet address
 * @param packageId - Smart contract package ID
 * @returns Array of MemberNFT objects
 */
export async function getUserNfts(
  walletAddress: string,
  packageId: string
): Promise<MemberNFT[]> {
  try {
    // Get all objects owned by the user
    const response = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: `${packageId}::member_nft::MemberNFT`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    });

    // Parse and format NFT data
    const nfts: MemberNFT[] = [];
    for (const obj of response.data) {
      if (obj.data?.content && "fields" in obj.data.content) {
        const fields = obj.data.content.fields as any;
        nfts.push({
          id: obj.data.objectId,
          owner: walletAddress,
          supportAmount: Number(fields.support_amount || 0),
          rank: fields.rank || "Unknown",
          mintedAt: Number(fields.minted_at || 0),
          imageUrl: fields.image_url || "",
        });
      }
    }

    return nfts;
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return [];
  }
}

/**
 * Get user's NFT count
 * @param walletAddress - User's wallet address
 * @param packageId - Smart contract package ID
 * @returns Number of NFTs owned by the user
 */
export async function getUserNftCount(
  walletAddress: string,
  packageId: string
): Promise<number> {
  const nfts = await getUserNfts(walletAddress, packageId);
  return nfts.length;
}

/**
 * Calculate total support amount from all user's NFTs
 * @param walletAddress - User's wallet address
 * @param packageId - Smart contract package ID
 * @returns Total support amount in USDC (with decimals)
 */
export async function getUserTotalSupport(
  walletAddress: string,
  packageId: string
): Promise<number> {
  const nfts = await getUserNfts(walletAddress, packageId);

  // Sum up all support amounts
  const total = nfts.reduce((sum, nft) => sum + nft.supportAmount, 0);

  // Convert from smallest unit to USDC (assuming 6 decimals)
  return total / 1_000_000;
}

/**
 * Get rank based on total support amount
 * This follows the contract's rank calculation logic
 * @param totalSupportAmount - Total support amount in USDC
 * @returns Rank string
 */
export function getRankFromAmount(totalSupportAmount: number): string {
  if (totalSupportAmount >= 200) return "Platinum";
  if (totalSupportAmount >= 100) return "Gold";
  if (totalSupportAmount >= 50) return "Silver";
  if (totalSupportAmount >= 10) return "Bronze";
  return "None";
}
