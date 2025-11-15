# Lit Protocol Integration

このディレクトリは、CHAMPION TOGETHER プロジェクトの Lit Protocol 統合を管理します。

## 概要

Lit Protocol を使用して、Members NFT 保有者向けの限定コンテンツを暗号化・復号化します。

- **暗号化**: Node.js スクリプト（このディレクトリ）
- **復号化**: フロントエンド hooks（`frontend/src/hooks/useLitProtocol.ts`）

## セットアップ

```bash
pnpm install
```

## 使い方

### 1. コンテンツを暗号化

```bash
pnpm encrypt
```

このコマンドは、サンプルコンテンツを暗号化し、以下を出力します：
- 暗号化されたデータ（ciphertext）
- データハッシュ
- アクセス制御条件

### 2. テスト実行

```bash
pnpm test
```

暗号化機能のテストを実行します。

### 3. フロントエンド設定に追加

暗号化スクリプトの出力を `frontend/src/config/index.ts` にコピーして使用します。

## アクセス制御条件

現在の設定では、以下の条件を満たすユーザーのみがコンテンツを復号化できます：

- **Sui Testnet で 0.1 SUI 以上を保有**

この条件は `src/encrypt.ts` の `accessControlConditions` で定義されています。

## ファイル構成

```
lit-protocol/
├── src/
│   ├── encrypt.ts    # 暗号化スクリプト
│   └── test.ts       # テストスクリプト
├── package.json
├── tsconfig.json
└── README.md
```

## 参考リンク

- [Lit Protocol Documentation](https://developer.litprotocol.com/)
- [Access Control Conditions](https://developer.litprotocol.com/sdk/access-control/evm/basic-examples)
