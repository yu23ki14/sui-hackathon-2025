# Lit Protocol × Sui Integration

Sui ブロックチェーン上のアドレス残高に基づいた、分散型アクセスコントロールシステムです。

## 概要

このプロジェクトは、Lit Protocol v7 を使用して、Sui の残高条件に基づいてコンテンツを暗号化・復号化する仕組みを提供します。

**仕組み:**
- コンテンツを Lit Protocol で暗号化
- 復号化には **0.1 SUI 以上**の残高が必要
- Lit Action が Sui RPC を呼び出して残高を自動検証
- 条件を満たした場合のみ復号化キーを返す

## 技術スタック

- **Lit Protocol v7**: 分散型暗号化・アクセスコントロール
- **Sui Blockchain**: 残高確認用
- **TypeScript**: 実装言語

## セットアップ

### 1. 依存関係のインストール

```bash
cd lit-protocol
pnpm install
```

### 2. 環境変数の設定（オプション）

必要に応じて `.env` ファイルを作成:

```bash
# Sui RPC エンドポイント（デフォルト: testnet）
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Lit Network（デフォルト: datil-test）
LIT_NETWORK=datil-test
```

## 使い方

### コンテンツの暗号化

任意の文字列を暗号化します:

```bash
pnpm encrypt "これは限定コンテンツです"
```

実行結果:
- `encrypted-content.json` ファイルが生成されます
- このファイルには暗号化されたデータと条件が含まれます

### コンテンツの復号化

Sui アドレスを指定して復号化を試みます:

```bash
# 0.1 SUI 以上保有しているアドレス
pnpm decrypt 0x1234567890abcdef...

# 残高不足のアドレスの場合はエラー
pnpm decrypt 0xdeadbeef...
```

成功時の出力例:
```
🔓 Lit Protocol による復号化を開始します...

📍 検証するアドレス:
   0x1234567890abcdef...

📄 暗号化ファイルを読み込みました:
   /path/to/encrypted-content.json
   必要残高: 0.1 SUI
   ネットワーク: testnet

📡 Lit ネットワークに接続中...
✅ Lit ネットワークに接続しました

🔍 Sui 残高を確認中...
✅ 残高条件を満たしています

🎉 復号化に成功しました！

📝 復号化されたコンテンツ:
──────────────────────────────────────────────────
これは限定コンテンツです
──────────────────────────────────────────────────
```

## プログラムから使用する

TypeScript/JavaScript プロジェクトから直接使用できます:

```typescript
import { encryptContent, decryptContent } from './lit-protocol/src/index.js';

// 暗号化
const encrypted = await encryptContent();

// 復号化
const decrypted = await decryptContent(
  '0x1234567890abcdef...', // Sui address
  './encrypted-content.json' // 暗号化ファイルのパス
);
```

## アーキテクチャ

### Lit Action の仕組み

`src/litAction.ts` に定義された Lit Action は以下の処理を行います:

1. ユーザーの Sui アドレスを受け取る
2. Sui RPC (`suix_getBalance`) を呼び出して残高を取得
3. 残高が 0.1 SUI (100,000,000 MIST) 以上かチェック
4. 条件を満たせば `granted: true` を返す
5. Lit Protocol がこの結果に基づいて復号化キーを提供

### ファイル構成

```
lit-protocol/
├── src/
│   ├── encrypt.ts        # 暗号化スクリプト
│   ├── decrypt.ts        # 復号化スクリプト
│   ├── litAction.ts      # Sui残高チェックロジック
│   └── index.ts          # エクスポートモジュール
├── package.json
├── tsconfig.json
└── README.md
```

## フロントエンド統合

React アプリケーション（`/frontend`）から使用する例:

```typescript
// frontend/src/lib/litProtocol.ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { decryptToString } from "@lit-protocol/encryption";
import { suiBalanceCheckAction } from "../../../lit-protocol/src/litAction";

export async function decryptContentForUser(
  walletAddress: string,
  encryptedData: EncryptedContent
) {
  const litClient = new LitNodeClient({
    litNetwork: "datil-test"
  });

  await litClient.connect();

  try {
    const decrypted = await decryptToString({
      ciphertext: encryptedData.ciphertext,
      dataToEncryptHash: encryptedData.dataToEncryptHash,
      accessControlConditions: [{
        conditionType: "litAction",
        value: suiBalanceCheckAction,
        returnValueTest: {
          key: "granted",
          comparator: "=",
          value: "true"
        }
      }],
      jsParams: {
        suiAddress: walletAddress
      }
    }, litClient);

    return decrypted;
  } finally {
    await litClient.disconnect();
  }
}
```

## トラブルシューティング

### エラー: "Sui address is required"
- 復号化時に有効な Sui アドレスを指定してください

### エラー: "Failed to fetch balance"
- Sui RPC エンドポイントに接続できません
- ネットワーク接続を確認してください

### エラー: "残高が不足しているため、コンテンツにアクセスできません"
- 指定したアドレスの SUI 残高が 0.1 未満です
- テストネットで SUI を取得: https://faucet.sui.io/

## セキュリティ考慮事項

- **分散型**: 暗号化キーは Lit Protocol のネットワークで分散管理
- **検証可能**: Lit Action のコードは透明で検証可能
- **残高チェック**: オンチェーンデータ（残高）を直接確認
- **改ざん防止**: Lit Protocol の閾値署名で保護

## 参考リンク

- [Lit Protocol Documentation](https://developer.litprotocol.com/)
- [Lit SDK v7 Release](https://spark.litprotocol.com/lit-sdk-v7/)
- [Sui Documentation](https://docs.sui.io/)
- [Sui Testnet Faucet](https://faucet.sui.io/)

## ライセンス

MIT
