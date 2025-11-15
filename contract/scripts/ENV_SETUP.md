# 環境変数セットアップガイド

このガイドでは、テストスクリプトで使用する環境変数の設定方法を説明します。

## 🚀 クイックセットアップ

### 1. .envファイルを作成
```bash
cd contract/scripts
cp .env.example .env
```

### 2. .envファイルを編集（オプション）
デフォルト値で問題ない場合は、このステップをスキップできます。

```bash
# お好みのエディタで編集
vim .env
# または
nano .env
# または
code .env
```

### 3. 動作確認
```bash
# 環境変数が正しく読み込まれるか確認
VERBOSE=true source ./load_env.sh
```

## 📝 環境変数の説明

### 必須の環境変数

#### PACKAGE_ID
デプロイされたコントラクトのパッケージID

**デフォルト値**:
```
0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed
```

**取得方法**:
```bash
# デプロイ時のトランザクション結果から取得
sui client publish --gas-budget 100000000
```

---

#### DAO_POOL_STATE
DaoPoolStateの共有オブジェクトID

**デフォルト値**:
```
0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
```

**取得方法**:
```bash
# デプロイ時のトランザクション結果から取得
# または、Sui Explorerで確認
```

---

#### NFT_STATE
MembersNFTStateの共有オブジェクトID

**デフォルト値**:
```
0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51
```

**取得方法**:
```bash
# デプロイ時のトランザクション結果から取得
# または、Sui Explorerで確認
```

---

#### CLOCK_OBJECT
Suiシステムのクロックオブジェクト（固定値）

**デフォルト値**:
```
0x6
```

**注意**: この値は変更しないでください。

---

### オプションの環境変数

#### SUI_NETWORK
接続するSuiネットワーク

**デフォルト値**: `testnet`

**利用可能な値**:
- `testnet` - テストネット
- `mainnet` - メインネット
- `devnet` - 開発ネット
- `localnet` - ローカルネット

---

#### GAS_BUDGET
トランザクションのガスバジェット

**デフォルト値**: `10000000`

**推奨値**:
- 通常のトランザクション: `10000000`
- 複雑なトランザクション: `50000000`
- デプロイ: `100000000`

---

## 🔄 環境変数の更新

### 新しいデプロイ後の更新

1. **DEPLOYMENT.mdから情報を取得**
   ```bash
   cat ../DEPLOYMENT.md
   ```

2. **.envファイルを更新**
   ```bash
   vim .env
   ```

3. **以下の値を更新**
   - `PACKAGE_ID`
   - `DAO_POOL_STATE`
   - `NFT_STATE`

### 複数の環境を管理

異なる環境（testnet、mainnet等）を管理する場合：

```bash
# testnet用
cp .env .env.testnet

# mainnet用
cp .env .env.mainnet

# 使用する環境を選択
cp .env.testnet .env
```

---

## 🔍 トラブルシューティング

### エラー: ".env file not found"

**原因**: .envファイルが存在しない

**解決策**:
```bash
cp .env.example .env
```

---

### エラー: "Missing required environment variables"

**原因**: 必須の環境変数が設定されていない

**解決策**:
1. .envファイルを開く
2. エラーメッセージに表示された変数を設定
3. 値が空白でないことを確認

---

### エラー: "command not found: sui"

**原因**: Sui CLIがインストールされていない

**解決策**:
```bash
brew install sui
```

---

### 環境変数が反映されない

**原因**: .envファイルの形式が正しくない

**チェックポイント**:
1. `KEY=VALUE`の形式になっているか
2. `=`の前後に空白がないか
3. コメント行は`#`で始まっているか
4. 空行が含まれていないか（問題ない）

**正しい例**:
```bash
PACKAGE_ID=0xabc123...
DAO_POOL_STATE=0xdef456...
```

**間違った例**:
```bash
PACKAGE_ID = 0xabc123...  # =の前後に空白
DAO_POOL_STATE: 0xdef456...  # :を使用
```

---

## 📚 参考情報

### .envファイルのテンプレート

```bash
# Champion Together - Contract Test Scripts Environment Variables

# Sui Network
SUI_NETWORK=testnet

# Package ID
PACKAGE_ID=0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed

# Shared State Objects
DAO_POOL_STATE=0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
NFT_STATE=0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

# System Objects
CLOCK_OBJECT=0x6

# Optional: Gas Budget (default: 10000000)
GAS_BUDGET=10000000
```

### 環境変数の確認コマンド

```bash
# すべての環境変数を表示
cat .env

# 特定の環境変数を確認
grep PACKAGE_ID .env

# 環境変数が正しく読み込まれるかテスト
VERBOSE=true source ./load_env.sh
```

### Sui Explorerでの確認

1. **Package IDの確認**
   ```
   https://testnet.suivision.xyz/package/<PACKAGE_ID>
   ```

2. **DaoPoolStateの確認**
   ```
   https://testnet.suivision.xyz/object/<DAO_POOL_STATE>
   ```

3. **MembersNFTStateの確認**
   ```
   https://testnet.suivision.xyz/object/<NFT_STATE>
   ```

---

## 💡 ベストプラクティス

### 1. .envファイルをバージョン管理に含めない
```bash
# .gitignoreに追加済み
echo ".env" >> .gitignore
```

### 2. .env.exampleを最新に保つ
新しい環境変数を追加したら、.env.exampleも更新してください。

### 3. チーム内で共有する場合
- .env.exampleを共有
- 実際の値は各自で設定
- セキュリティ上、本番環境の値は共有しない

### 4. 定期的に確認
デプロイ後は、環境変数が最新の値になっているか確認してください。

---

## 🔐 セキュリティ

### 注意事項
- .envファイルには機密情報を含めない
- GitHubなどに.envファイルをコミットしない
- 本番環境の値は慎重に管理する

### 推奨事項
- testnet用とmainnet用で別々の.envファイルを使用
- 本番環境の値は環境変数として直接設定
- CI/CDでは秘密情報管理サービスを使用

---

**最終更新**: 2025-11-15
**関連ドキュメント**: README.md, QUICKSTART.md
