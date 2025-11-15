# コントラクトアドレスの調べ方

このドキュメントでは、`VITE_DAO_CONTRACT_ADDRESS`と`VITE_MEMBERS_NFT_CONTRACT_ADDRESS`の調べ方を説明します。

## 📋 必要な情報

- **Package ID**: コントラクトをデプロイした際のパッケージID
- **Deployer Address**: コントラクトをデプロイしたウォレットアドレス

## 方法1: DEPLOYMENT.mdから確認（最も簡単）✅

プロジェクトの`contract/DEPLOYMENT.md`ファイルに全ての情報が記載されています。

```bash
# ファイルを開く
cat contract/DEPLOYMENT.md
```

### 必要な情報

```
DaoPoolState (Shared Object)
0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f

MembersNFTState (Shared Object)
0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51
```

## 方法2: Sui Explorerで確認（視覚的）🔍

### ステップ1: Sui Explorerを開く

パッケージIDを使ってSui Explorerを開きます：

```
https://testnet.suivision.xyz/package/<PACKAGE_ID>
```

例：
```
https://testnet.suivision.xyz/package/0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed
```

### ステップ2: "Objects Created"タブをクリック

デプロイ時に作成されたオブジェクト一覧が表示されます。

### ステップ3: 共有オブジェクトを探す

以下の2つのオブジェクトを探します：

1. **DaoPoolState<0x2::sui::SUI>**
   - Type: `<PACKAGE_ID>::dao_pool::DaoPoolState<0x2::sui::SUI>`
   - このオブジェクトIDが`VITE_DAO_CONTRACT_ADDRESS`

2. **MembersNFTState**
   - Type: `<PACKAGE_ID>::member_nft::MembersNFTState`
   - このオブジェクトIDが`VITE_MEMBERS_NFT_CONTRACT_ADDRESS`

### ステップ4: オブジェクトIDをコピー

各オブジェクトのIDをコピーして、`.env.local`ファイルに貼り付けます。

## 方法3: Sui CLIで確認（コマンドライン）💻

### 自動スクリプトを使用

プロジェクトに用意されているスクリプトを実行します：

```bash
cd contract/scripts
./get_shared_objects.sh
```

このスクリプトは自動的に：
1. デプロイヤーアドレスが所有するオブジェクトを取得
2. DaoPoolStateとMembersNFTStateを検索
3. 見つかったオブジェクトIDを表示

### 手動でCLIコマンドを実行

```bash
# デプロイヤーアドレスが所有するオブジェクトを取得
sui client objects <DEPLOYER_ADDRESS>

# 特定のオブジェクトの詳細を確認
sui client object <OBJECT_ID>
```

### オブジェクトの種類を確認

```bash
# DaoPoolStateの確認
sui client object 0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f

# MembersNFTStateの確認
sui client object 0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51
```

出力例：
```json
{
  "objectId": "0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f",
  "version": "123",
  "digest": "...",
  "type": "0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed::dao_pool::DaoPoolState<0x2::sui::SUI>",
  "owner": {
    "Shared": {
      "initial_shared_version": 1
    }
  }
}
```

## 方法4: デプロイログから確認

コントラクトをデプロイした際のターミナル出力を確認します。

デプロイ時に以下のような出力があったはずです：

```
----- Object changes ----
Created Objects:
  ┌──
  │ ObjectID: 0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
  │ Sender: 0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353
  │ Owner: Shared
  │ ObjectType: 0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed::dao_pool::DaoPoolState<0x2::sui::SUI>
  └──
  ┌──
  │ ObjectID: 0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51
  │ Sender: 0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353
  │ Owner: Shared
  │ ObjectType: 0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed::member_nft::MembersNFTState
  └──
```

## 🎯 .env.localファイルへの設定

見つけたアドレスを`frontend/.env.local`ファイルに設定します：

```bash
# Smart Contract Package ID (v3 - Latest)
VITE_PACKAGE_ID=0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed

# Smart Contract Addresses (Shared Objects)
VITE_DAO_CONTRACT_ADDRESS=0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
VITE_MEMBERS_NFT_CONTRACT_ADDRESS=0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

# Coin Type (Using SUI)
VITE_COIN_TYPE=0x2::sui::SUI

# Distribution Addresses
VITE_FIGHTER_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_GYM_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_ORGANIZER_ADDRESS=0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353
```

## ✅ 確認方法

設定が正しいか確認するには：

```bash
# フロントエンドを起動
cd frontend
pnpm dev
```

ブラウザで開いて、コンソールにエラーが出ないか確認します。

## 🔍 トラブルシューティング

### エラー: "Failed to fetch DAO pool state"

**原因**: オブジェクトIDが間違っているか、ネットワークが異なる

**解決策**:
1. DEPLOYMENT.mdのアドレスを再確認
2. `VITE_SUI_NETWORK=testnet`が設定されているか確認
3. Sui Explorerでオブジェクトが存在するか確認

### エラー: "Contract addresses not configured"

**原因**: 環境変数が読み込まれていない

**解決策**:
1. `.env.local`ファイルが`frontend/`ディレクトリにあるか確認
2. 開発サーバーを再起動（`pnpm dev`）
3. ブラウザのキャッシュをクリア

### オブジェクトが見つからない

**原因**: コントラクトが正しくデプロイされていない

**解決策**:
1. `contract/DEPLOYMENT.md`を確認
2. 必要に応じて再デプロイ
3. デプロイ時のログを保存

## 📚 参考リンク

- [Sui Explorer (Testnet)](https://testnet.suivision.xyz/)
- [Sui CLI Documentation](https://docs.sui.io/references/cli)
- [Shared Objects in Sui](https://docs.sui.io/concepts/object-ownership/shared)

## 💡 ヒント

- **共有オブジェクト（Shared Object）**は誰でもアクセス可能なオブジェクトです
- DaoPoolStateとMembersNFTStateは両方とも共有オブジェクトとして作成されます
- オブジェクトIDは変更されないので、一度設定すれば再デプロイしない限り変更不要です
- 新しいバージョンをデプロイした場合は、新しいオブジェクトIDを取得する必要があります

## 🚀 次のステップ

アドレスを設定したら：

1. フロントエンドを起動して動作確認
2. ウォレットを接続
3. 管理者ページで分配機能をテスト
4. Sui Explorerでトランザクションを確認

---

**最終更新**: 2025-11-15
**対応バージョン**: v3 (Package ID: 0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578948d27d19a8f4f1d4637051a760ed)
