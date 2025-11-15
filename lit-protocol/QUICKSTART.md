# クイックスタートガイド - Sui 残高ベースの暗号化

このガイドでは、Lit Protocol v7 を使って Sui 残高に基づいたコンテンツ暗号化を実装する手順を説明します。

## 📋 必要なもの

1. **Pinata アカウント**（無料）
   - https://www.pinata.cloud/ でアカウント作成
   - API キーを取得

2. **Sui Testnet のアドレス**
   - テスト用に 0.1 SUI 以上を保有

## 🚀 セットアップ手順

### ステップ 1: 依存関係のインストール

```bash
cd lit-protocol
pnpm install
```

### ステップ 2: 環境変数の設定

`.env` ファイルを作成して、Pinata の API キーを設定：

```bash
# .env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
```

`.env.example` をコピーして使うこともできます：

```bash
cp .env.example .env
# エディタで .env を開いて API キーを設定
```

### ステップ 3: Lit Action を IPFS にアップロード

Sui 残高をチェックする Lit Action コードを IPFS にアップロード：

```bash
pnpm upload
```

**出力例:**
```
📤 Lit Action を IPFS にアップロードします...

✅ Pinata API キーを確認しました

📝 アップロードする Lit Action:
────────────────────────────────────────────────────────────
(async () => {
  const REQUIRED_BALANCE = "100000000"; // 0.1 SUI in MIST
  ...
────────────────────────────────────────────────────────────

✅ IPFS にアップロードしました: ipfs://QmXXXXXX...

💾 IPFS CID を保存しました:
   /path/to/lit-action-ipfs.json

📋 IPFS CID:
   ipfs://QmXXXXXX...
```

このコマンドで `lit-action-ipfs.json` ファイルが生成されます。

### ステップ 4: コンテンツを暗号化

```bash
pnpm encrypt "これは限定コンテンツです！"
```

**出力例:**
```
🔐 Lit Protocol による暗号化を開始します...

📡 Lit ネットワークに接続中...
✅ Lit ネットワークに接続しました

📝 暗号化するコンテンツ:
   "これは限定コンテンツです！"

✅ IPFS CID を読み込みました:
   ipfs://QmXXXXXX...

🔒 暗号化処理中...
✅ 暗号化が完了しました

💾 暗号化されたデータを保存しました:
   /path/to/encrypted-content.json

📊 暗号化情報:
   データハッシュ: 0xABCDEF...
   必要残高: 0.1 SUI
   ネットワーク: sui-testnet
   Lit Action CID: ipfs://QmXXXXXX...
```

このコマンドで `encrypted-content.json` ファイルが生成されます。

### ステップ 5: コンテンツを復号化

Sui アドレスを指定して復号化を試みます：

```bash
# 0.1 SUI 以上保有しているアドレス
pnpm decrypt 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# 残高不足のアドレス
pnpm decrypt 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef
```

**成功時の出力:**
```
🔓 Lit Protocol による復号化を開始します...

📍 検証するアドレス:
   0x1234567890abcdef...

📄 暗号化ファイルを読み込みました:
   /path/to/encrypted-content.json
   必要残高: 0.1 SUI
   ネットワーク: sui-testnet

📡 Lit ネットワークに接続中...
✅ Lit ネットワークに接続しました

🔐 Session Signatures を取得中...
✅ Session Signatures を取得しました

🔍 Sui 残高を確認中...
   チェックするアドレス: 0x1234567890abcdef...
   必要残高: 0.1 SUI

✅ 残高条件を満たしています

🎉 復号化に成功しました！

📝 復号化されたコンテンツ:
──────────────────────────────────────────────────
これは限定コンテンツです！
──────────────────────────────────────────────────
```

**失敗時（残高不足）:**
```
❌ 残高条件を満たしていません
   必要残高: 0.1 SUI
   アドレス: 0xdeadbeef...

❌ エラーが発生しました: 残高が不足しているため、コンテンツにアクセスできません
```

## 🔧 トラブルシューティング

### "Pinata API キーが設定されていません"

`.env` ファイルが正しく設定されているか確認してください：

```bash
cat .env
```

### "lit-action-ipfs.json が見つかりません"

まず `pnpm upload` を実行してください。

### Sui Testnet の SUI を取得

https://faucet.sui.io/ でテストネット用の SUI を取得できます。

## 📁 生成されるファイル

| ファイル名 | 説明 |
|-----------|------|
| `lit-action-ipfs.json` | IPFS にアップロードされた Lit Action の CID |
| `encrypted-content.json` | 暗号化されたコンテンツと条件 |

**注意**: これらのファイルは `.gitignore` に含まれています。

## 🎯 次のステップ

### フロントエンドへの統合

`frontend/src/lib/litProtocol.ts` でこのモジュールを使用：

```typescript
import { decryptToString } from "@lit-protocol/encryption";

// 暗号化されたデータを読み込み
const encryptedData = await fetch('/api/content').then(r => r.json());

// Lit Node Client を初期化
const litClient = new LitNodeClient({
  litNetwork: "datil-test"
});
await litClient.connect();

// Session Signatures を取得
const sessionSigs = await getSessionSigs(litClient);

// 復号化
const decrypted = await decryptToString({
  ciphertext: encryptedData.ciphertext,
  dataToEncryptHash: encryptedData.dataToEncryptHash,
  unifiedAccessControlConditions: encryptedData.unifiedAccessControlConditions,
  sessionSigs,
  chain: "ethereum",
  jsParams: {
    suiAddress: walletAddress // ユーザーの Sui アドレス
  }
}, litClient);
```

### 残高条件のカスタマイズ

`src/litAction.ts` の `REQUIRED_BALANCE` を変更：

```typescript
const REQUIRED_BALANCE = "500000000"; // 0.5 SUI
```

変更後、再度 `pnpm upload` を実行してください。

## 🔗 参考リンク

- [Lit Protocol Documentation](https://developer.litprotocol.com/)
- [Pinata IPFS Service](https://www.pinata.cloud/)
- [Sui Documentation](https://docs.sui.io/)
- [Sui Testnet Faucet](https://faucet.sui.io/)
