import { config } from "dotenv";
import { suiBalanceCheckAction } from "./litAction.js";
import { uploadLitActionToIPFS } from "./ipfsHelper.js";
import * as fs from "fs";
import * as path from "path";

// 環境変数を読み込み
config();

/**
 * Lit Action を IPFS にアップロードして IPFS CID を取得
 */
async function uploadAction() {
  try {
    console.log("📤 Lit Action を IPFS にアップロードします...\n");

    // 環境変数の確認
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      console.error("❌ エラー: Pinata API キーが設定されていません");
      console.error("\n.env ファイルに以下を設定してください:");
      console.error("  PINATA_API_KEY=your_api_key");
      console.error("  PINATA_SECRET_KEY=your_secret_key\n");
      console.error("Pinata のアカウントは https://www.pinata.cloud/ で作成できます");
      process.exit(1);
    }

    console.log("✅ Pinata API キーを確認しました\n");

    // Lit Action コードの内容を表示
    console.log("📝 アップロードする Lit Action:");
    console.log("─".repeat(60));
    console.log(suiBalanceCheckAction.substring(0, 200) + "...");
    console.log("─".repeat(60));
    console.log(`\n   合計: ${suiBalanceCheckAction.length} 文字\n`);

    // IPFS にアップロード
    const ipfsCid = await uploadLitActionToIPFS(
      suiBalanceCheckAction,
      pinataApiKey,
      pinataSecretKey
    );

    console.log("\n✅ アップロードが完了しました！\n");

    // 結果を保存
    const result = {
      ipfsCid,
      uploadedAt: new Date().toISOString(),
      litActionCode: suiBalanceCheckAction,
      requiredBalance: "0.1 SUI (100,000,000 MIST)",
      network: "sui-testnet",
    };

    const outputPath = path.join(process.cwd(), "lit-action-ipfs.json");
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    console.log("💾 IPFS CID を保存しました:");
    console.log(`   ${outputPath}\n`);

    console.log("📋 IPFS CID:");
    console.log(`   ${ipfsCid}\n`);

    console.log("🎉 このCIDを暗号化スクリプトで使用できます！");
    console.log("\n次のステップ:");
    console.log("  1. encrypt.ts でこのCIDを使用");
    console.log("  2. pnpm encrypt でコンテンツを暗号化");
    console.log("  3. pnpm decrypt <sui-address> で復号化テスト\n");
  } catch (error: any) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// スクリプトとして実行
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadAction();
}

export { uploadAction };
