import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { decryptToString } from "@lit-protocol/encryption";
import { getSessionSigs } from "./sessionHelper.js";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

// 環境変数を読み込み
config();

interface EncryptedData {
  ciphertext: string;
  dataToEncryptHash: string;
  unifiedAccessControlConditions: any[];
  ipfsCid: string | null;
  requiredBalance: string;
  network: string;
  createdAt: string;
}

/**
 * 暗号化されたコンテンツを復号化
 * Sui残高が0.1以上あれば復号化可能
 */
async function decryptContent(suiAddress: string, encryptedFilePath?: string) {
  let litNodeClient: LitNodeClient | undefined;

  try {
    console.log("🔓 Lit Protocol による復号化を開始します...\n");

    // 引数チェック
    if (!suiAddress) {
      throw new Error("Sui アドレスを指定してください");
    }

    console.log("📍 検証するアドレス:");
    console.log(`   ${suiAddress}\n`);

    // 暗号化されたデータを読み込み
    const filePath =
      encryptedFilePath || path.join(process.cwd(), "encrypted-content.json");

    if (!fs.existsSync(filePath)) {
      throw new Error(`暗号化ファイルが見つかりません: ${filePath}`);
    }

    const encryptedData: EncryptedData = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    console.log("📄 暗号化ファイルを読み込みました:");
    console.log(`   ${filePath}`);
    console.log(`   必要残高: ${encryptedData.requiredBalance}`);
    console.log(`   ネットワーク: ${encryptedData.network}\n`);

    // Lit Node Client の初期化
    console.log("📡 Lit ネットワークに接続中...");
    litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilTest,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Lit ネットワークに接続しました\n");

    // Session Signatures を取得
    const sessionSigs = await getSessionSigs(litNodeClient);

    // Sui残高をチェックして復号化
    if (encryptedData.ipfsCid) {
      console.log("🔍 Sui 残高を確認中...");
      console.log(`   チェックするアドレス: ${suiAddress}`);
      console.log(`   必要残高: ${encryptedData.requiredBalance}\n`);
    } else {
      console.log("🔍 アクセス権限を確認中...\n");
    }

    try {
      const decryptionParams: any = {
        ciphertext: encryptedData.ciphertext,
        dataToEncryptHash: encryptedData.dataToEncryptHash,
        unifiedAccessControlConditions:
          encryptedData.unifiedAccessControlConditions,
        sessionSigs,
        chain: "ethereum",
      };

      // Sui アドレスを Lit Action のパラメータとして渡す
      if (encryptedData.ipfsCid) {
        decryptionParams.jsParams = {
          suiAddress: suiAddress,
        };
      }

      const decryptedString = await decryptToString(
        decryptionParams,
        litNodeClient
      );

      console.log("✅ 残高条件を満たしています\n");
      console.log("🎉 復号化に成功しました！\n");
      console.log("📝 復号化されたコンテンツ:");
      console.log("─".repeat(50));
      console.log(decryptedString);
      console.log("─".repeat(50));

      return decryptedString;
    } catch (error: any) {
      if (
        error.message?.includes("granted") ||
        error.message?.includes("balance")
      ) {
        console.log("❌ 残高条件を満たしていません");
        console.log(`   必要残高: ${encryptedData.requiredBalance}`);
        console.log(`   アドレス: ${suiAddress}\n`);
        throw new Error("残高が不足しているため、コンテンツにアクセスできません");
      }
      throw error;
    }
  } catch (error: any) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  } finally {
    // クリーンアップ
    if (litNodeClient) {
      await litNodeClient.disconnect();
      console.log("\n🔌 Lit ネットワークから切断しました");
    }
  }
}

// スクリプトとして実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  const suiAddress = process.argv[2];
  const encryptedFilePath = process.argv[3];

  if (!suiAddress) {
    console.error("使用法: tsx src/decrypt.ts <SUI_ADDRESS> [暗号化ファイルパス]");
    console.error("\n例:");
    console.error("  tsx src/decrypt.ts 0x1234...abcd");
    console.error("  tsx src/decrypt.ts 0x1234...abcd ./encrypted-content.json");
    process.exit(1);
  }

  decryptContent(suiAddress, encryptedFilePath);
}

export { decryptContent };
