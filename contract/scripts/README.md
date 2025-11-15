# Champion Together - Test Scripts

このディレクトリには、Testnetにデプロイされたコントラクトをテストするためのスクリプトが含まれています。

## 📋 スクリプト一覧

### 1. test_contract.sh（メインスクリプト）
包括的なテストメニューを提供するメインスクリプトです。

```bash
./test_contract.sh
```

**機能:**
- コントラクト状態の確認
- 初期設定（分配アドレスの設定）
- 支援機能のテスト
- 分配機能のテスト
- ボーナス分配のテスト
- NFT情報の確認
- 完全フローテスト
- すべてのテストを実行

### 2. test_support.sh
支援機能の詳細テストスクリプトです。

```bash
./test_support.sh
```

**機能:**
- 支援前の状態確認
- 支援額の選択（Bronze/Silver/Gold/Platinum）
- USDCコインの準備
- 支援の実行
- NFT発行の確認

### 3. test_distribution.sh
分配機能の詳細テストスクリプトです。

```bash
./test_distribution.sh
```

**機能:**
- 分配前の状態確認
- 分配可能時刻のチェック
- 分配額の計算
- 分配の実行
- 分配後の状態確認

### 4. test_admin.sh
管理者機能の詳細テストスクリプトです。

```bash
./test_admin.sh
```

**機能:**
- 分配アドレスの変更
- 分配比率の変更
- 分配アドレスと比率の両方を変更
- ボーナス分配の実行
- 管理者権限の確認

### 5. check_nft.sh
NFT情報を確認するスクリプトです。

```bash
./check_nft.sh
```

**機能:**
- MembersNFTStateの情報取得
- 保有NFTの検索
- NFT詳細情報の表示
- ランク別統計
- 総支援額の計算

## 🚀 使い方

### 前提条件

1. **Sui CLIのインストール**
   ```bash
   brew install sui
   ```

2. **Testnetへの接続**
   ```bash
   sui client switch --env testnet
   ```

3. **アクティブアドレスの確認**
   ```bash
   sui client active-address
   ```

4. **環境変数の設定**
   ```bash
   # .env.exampleをコピー
   cp .env.example .env
   
   # .envファイルを編集（必要に応じて）
   # PACKAGE_ID、DAO_POOL_STATE、NFT_STATEなどを設定
   ```

5. **スクリプトに実行権限を付与**
   ```bash
   chmod +x *.sh
   ```

### 基本的な使い方

#### 1. メインスクリプトを実行
```bash
./test_contract.sh
```

メニューから実行したい機能を選択します。

#### 2. 初期設定（初回のみ）
メニューから「2) 初期設定」を選択し、分配アドレスを設定します。

#### 3. 支援機能のテスト
メニューから「3) 支援機能のテスト」を選択します。

**注意:** 実際のTestnet USDCコインが必要です。

#### 4. NFT情報の確認
メニューから「6) NFT情報の確認」を選択します。

#### 5. 分配機能のテスト
メニューから「4) 分配機能のテスト」を選択します。

**注意:** 30日間隔が経過している必要があります。

## 📝 テストシナリオ

### シナリオ1: 基本的な支援フロー

1. コントラクト状態を確認
   ```bash
   ./test_contract.sh
   # メニューから「1」を選択
   ```

2. 支援を実行
   ```bash
   ./test_support.sh
   ```

3. NFTを確認
   ```bash
   ./check_nft.sh
   ```

### シナリオ2: 管理者機能のテスト

1. 管理者権限を確認
   ```bash
   ./test_admin.sh
   # メニューから「5」を選択
   ```

2. 分配アドレスを設定
   ```bash
   ./test_admin.sh
   # メニューから「1」を選択
   ```

3. ボーナス分配を実行
   ```bash
   ./test_admin.sh
   # メニューから「4」を選択
   ```

### シナリオ3: 完全フローテスト

```bash
./test_contract.sh
# メニューから「7」を選択
```

このシナリオは以下を自動的に実行します：
1. コントラクト状態の確認
2. 支援の実行
3. NFT発行の確認

## 🔧 トラブルシューティング

### エラー: "command not found: sui"
Sui CLIがインストールされていません。
```bash
brew install sui
```

### エラー: "Permission denied"
スクリプトに実行権限がありません。
```bash
chmod +x *.sh
```

### エラー: "E_SUPPORT_CAP_REACHED"
支援上限（3,000 USDC）に達しています。
分配を実行してリセットしてください。

### エラー: "E_DISTRIBUTION_TOO_EARLY"
分配間隔（30日）が経過していません。
時間が経過するまで待つか、ボーナス分配を使用してください。

### エラー: "E_UNAUTHORIZED"
管理者権限がありません。
主催者（Organizer）アドレスでログインしてください。

### エラー: "E_EMPTY_TREASURY"
トレジャリーが空です。
支援を実行してから分配してください。

## 📊 デプロイ情報

デプロイ情報は`.env`ファイルで管理されています。

### 環境変数の設定

`.env`ファイルを作成して以下の情報を設定してください：

```bash
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

### Sui Explorer
- Package: https://testnet.suivision.xyz/package/0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed
- DaoPoolState: https://testnet.suivision.xyz/object/0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
- MembersNFTState: https://testnet.suivision.xyz/object/0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

## 🎯 ランクシステム

| ランク | 最小支援額 | 色 |
|--------|-----------|-----|
| Bronze | 10 USDC | 🟤 |
| Silver | 50 USDC | ⚪ |
| Gold | 100 USDC | 🟡 |
| Platinum | 200 USDC | 💎 |

## 📚 参考資料

- [Sui Documentation](https://docs.sui.io/)
- [Sui CLI Reference](https://docs.sui.io/references/cli)
- [Move Language](https://move-language.github.io/move/)
- [Champion Together Design](../design.md)
- [Champion Together Requirements](../requirements.md)

## 💡 ヒント

### USDCコインの取得
Testnet USDCは以下の方法で取得できます：
1. Sui Testnet Faucet（SUIのみ）
2. テスト用にSUIコインを分割して使用（デモ用）

### 時間の進め方
Testnetでは実際の時間経過が必要です。
分配間隔（30日）をテストする場合は、以下のいずれかを使用してください：
- ボーナス分配機能（時間制限なし）
- テスト用に短い間隔でデプロイ

### ガス代の節約
- `--gas-budget`を適切に設定（デフォルト: 10000000）
- 複数のトランザクションをバッチ処理
- 不要なオブジェクトを削除

## 🤝 サポート

問題が発生した場合：
1. Sui Explorerでトランザクションを確認
2. エラーコードを確認（E_SUPPORT_CAP_REACHED等）
3. コントラクトの状態を確認
4. テストファイルで期待される動作を確認

---

**最終更新**: 2025-11-15
**バージョン**: v3
**ステータス**: テスト準備完了
