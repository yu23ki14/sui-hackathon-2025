import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  generateAuthSig,
  LitActionResource,
} from "@lit-protocol/auth-helpers";
import * as ethers from "ethers";

/**
 * Session Signatures を取得
 * Lit Protocol v7 では暗号化/復号化に必須
 */
export async function getSessionSigs(
  litNodeClient: LitNodeClient
) {
  // Ethereum ウォレットを作成（ランダム）
  // 本番環境では、ユーザーの実際のウォレットを使用
  const wallet = ethers.Wallet.createRandom();
  const walletAddress = await wallet.getAddress();

  console.log("🔐 Session Signatures を取得中...");

  try {
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24時間
      resourceAbilityRequests: [
        {
          resource: new LitActionResource("*"),
          ability: LIT_ABILITY.LitActionExecution,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }: any) => {
        if (!uri) {
          throw new Error("uri is required");
        }
        if (!expiration) {
          throw new Error("expiration is required");
        }

        // SIWE メッセージを作成
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: walletAddress,
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        // ウォレットで署名
        return await generateAuthSig({
          signer: wallet,
          toSign,
        });
      },
    });

    console.log("✅ Session Signatures を取得しました");

    return sessionSigs;
  } catch (error: any) {
    console.error("Session Signatures 取得エラー:");
    console.error("  エラーメッセージ:", error?.message);
    if (error?.stack) {
      console.error("  スタックトレース:", error.stack);
    }
    throw error;
  }
}

/**
 * Sui Wallet を使った Session Signatures 取得（フロントエンド用）
 */
export async function getSessionSigsWithSuiWallet(
  litNodeClient: LitNodeClient,
  suiWallet: any
) {
  // Sui Wallet は直接 Lit Protocol でサポートされていないため、
  // EVM 互換の署名を生成するか、カスタムロジックが必要

  // 簡易実装: ランダムウォレットを使用（デモ用）
  return await getSessionSigs(litNodeClient);
}
