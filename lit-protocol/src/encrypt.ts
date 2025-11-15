import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { encryptString } from "@lit-protocol/encryption";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

// 環境変数を読み込み
config();

/**
 * コンテンツを暗号化し、Sui残高条件付きアクセスコントロールを設定
 */
async function encryptContent() {
  let litNodeClient: LitNodeClient | undefined;

  try {
    console.log("🔐 Lit Protocol による暗号化を開始します...\n");

    // Lit Node Client の初期化
    console.log("📡 Lit ネットワークに接続中...");
    litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilTest, // テストネットを使用
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Lit ネットワークに接続しました\n");

    // 暗号化するコンテンツ
    const content = process.argv[2] || "これは限定コンテンツです。0.1 SUI以上保有しているアドレスのみ閲覧できます。";

    console.log("📝 暗号化するコンテンツ:");
    console.log(`   "${content}"\n`);

    // IPFS CID を読み込み（lit-action-ipfs.json から）
    const ipfsDataPath = path.join(process.cwd(), "lit-action-ipfs.json");
    let ipfsCid: string | undefined;

    if (fs.existsSync(ipfsDataPath)) {
      const ipfsData = JSON.parse(fs.readFileSync(ipfsDataPath, "utf-8"));
      ipfsCid = ipfsData.ipfsCid;
      console.log("✅ IPFS CID を読み込みました:");
      console.log(`   ${ipfsCid}\n`);
    } else {
      console.log("⚠️  警告: lit-action-ipfs.json が見つかりません");
      console.log("   まず 'pnpm upload' を実行して Lit Action を IPFS にアップロードしてください\n");
      console.log("   一時的にシンプルな条件を使用します（誰でもアクセス可能）\n");
    }

    // Unified Access Control Conditions
    const unifiedAccessControlConditions = ipfsCid
      ? [
          // Sui 残高チェック用の Lit Action
          {
            conditionType: "evmBasic",
            contractAddress: ipfsCid,
            standardContractType: "LitAction",
            chain: "ethereum",
            method: "",
            parameters: [":userAddress"], // ユーザーのアドレスを渡す
            returnValueTest: {
              comparator: "=",
              value: "true",
            },
          },
        ]
      : [
          // デフォルト: シンプルな ETH 残高チェック
          {
            conditionType: "evmBasic",
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum",
            method: "eth_getBalance",
            parameters: [":userAddress", "latest"],
            returnValueTest: {
              comparator: ">=",
              value: "0",
            },
          },
        ];

    // コンテンツを暗号化
    console.log("🔒 暗号化処理中...");
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        dataToEncrypt: content,
        unifiedAccessControlConditions,
      },
      litNodeClient
    );

    console.log("✅ 暗号化が完了しました\n");

    // 暗号化されたデータを保存
    const encryptedData = {
      ciphertext,
      dataToEncryptHash,
      unifiedAccessControlConditions,
      ipfsCid: ipfsCid || null,
      requiredBalance: ipfsCid ? "0.1 SUI" : "0 ETH (デモ用)",
      network: ipfsCid ? "sui-testnet" : "ethereum",
      createdAt: new Date().toISOString(),
    };

    const outputPath = path.join(process.cwd(), "encrypted-content.json");
    fs.writeFileSync(outputPath, JSON.stringify(encryptedData, null, 2));

    console.log("💾 暗号化されたデータを保存しました:");
    console.log(`   ${outputPath}\n`);

    console.log("📊 暗号化情報:");
    console.log(`   データハッシュ: ${dataToEncryptHash}`);
    console.log(`   必要残高: ${encryptedData.requiredBalance}`);
    console.log(`   ネットワーク: ${encryptedData.network}`);
    if (ipfsCid) {
      console.log(`   Lit Action CID: ${ipfsCid}`);
    }
    console.log();

    console.log("🎉 暗号化処理が完了しました！");
    if (ipfsCid) {
      console.log("\n📝 次のステップ:");
      console.log("   pnpm decrypt <sui-address>");
      console.log("   例: pnpm decrypt 0x1234567890abcdef...\n");
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
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
  encryptContent();
}

export { encryptContent };
