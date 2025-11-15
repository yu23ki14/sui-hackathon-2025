# Lit Protocol v7 実装状況

## ✅ 完了した機能

1. **基本的な暗号化/復号化**
   - Lit Protocol v7 SDK の統合
   - `@lit-protocol/encryption` を使った暗号化・復号化
   - Session Signatures による認証

2. **プロジェクト構造**
   - TypeScript プロジェクトのセットアップ
   - 依存関係の管理（package.json）
   - 型定義とモジュール構造

3. **ヘルパー関数**
   - Session Signatures 取得機能
   - IPFS アップロードヘルパー（準備済み）

## 🚧 開発中・未実装の機能

### Sui 残高チェック機能

**課題:**
Lit Protocol v7 では、Lit Action を使う場合に以下のいずれかの方法が必要です：

1. **IPFS にアップロード**: Lit Action コードを IPFS にアップロードし、IPFS CID を使う
2. **カスタム実装**: Lit Protocol のカスタムチェーン統合を使う（高度）

**現在の実装:**
- `src/litAction.ts`: Sui RPC を呼び出す Lit Action コード（準備済み）
- `src/ipfsHelper.ts`: IPFS アップロード機能（準備済み）
- 現在は一時的に EVM（Ethereum）の条件を使用

**次のステップ:**
1. Pinata API キーを取得（無料プランあり）
2. Lit Action を IPFS にアップロード
3. IPFS CID を使ってアクセスコントロール条件を設定
4. Sui アドレスと残高チェックを統合

## 📝 使用方法（現在の実装）

### 暗号化

```bash
cd lit-protocol
pnpm install
pnpm encrypt "テストコンテンツ"
```

### 復号化

```bash
pnpm decrypt 0x1234567890abcdef...
```

**注意**: 現在は EVM ベースの条件を使用しているため、任意のアドレスで復号化できます。

## 🔧 Sui 統合を完成させるために必要な作業

### 1. Pinata API キーの取得

https://www.pinata.cloud/ でアカウントを作成し、API キーを取得します。

### 2. 環境変数の設定

```bash
# .env ファイルを作成
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
```

### 3. Lit Action を IPFS にアップロード

```typescript
import { uploadLitActionToIPFS } from "./ipfsHelper";
import { suiBalanceCheckAction } from "./litAction";

const ipfsCid = await uploadLitActionToIPFS(suiBalanceCheckAction);
console.log(`IPFS CID: ${ipfsCid}`);
```

### 4. アクセスコントロール条件を更新

```typescript
const unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: ipfsCid, // ipfs://Qm...
    standardContractType: "LitAction",
    chain: "ethereum",
    method: "go",
    parameters: [],
    returnValueTest: {
      comparator: "=",
      value: "true",
    },
  },
];
```

## 📚 参考リソース

- [Lit Protocol v7 Documentation](https://developer.litprotocol.com/)
- [Lit Actions Guide](https://spark.litprotocol.com/using-lit-actions-for-access-control/)
- [Pinata IPFS Service](https://www.pinata.cloud/)

## 🤝 サポートが必要な場合

Lit Protocol の公式 Discord で質問できます：https://litgateway.com/discord
