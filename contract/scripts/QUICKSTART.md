# 🚀 クイックスタートガイド

Champion Togetherコントラクトを5分でテストする方法

## ⚡ 最速テスト（3ステップ）

### 1. メインスクリプトを実行
```bash
cd contract/scripts
./test_contract.sh
```

### 2. コントラクト状態を確認
メニューから「1」を選択
```
選択してください (0-8): 1
```

### 3. NFT情報を確認
メニューから「6」を選択
```
選択してください (0-8): 6
```

完了！ 🎉

---

## 📝 詳細テスト（推奨）

### ステップ1: 環境確認と設定
```bash
# Sui CLIのバージョン確認
sui --version

# アクティブアドレスの確認
sui client active-address

# Testnetに接続されているか確認
sui client envs

# 環境変数の設定
cp .env.example .env
# 必要に応じて.envファイルを編集
```

### ステップ2: 初期設定（初回のみ）
```bash
./test_contract.sh
# メニューから「2」を選択
# 分配アドレスを設定（デフォルトでOK）
```

### ステップ3: 支援機能のテスト

#### オプションA: メインスクリプトから
```bash
./test_contract.sh
# メニューから「3」を選択
```

#### オプションB: 専用スクリプトで
```bash
./test_support.sh
# ランクを選択（1-5）
# USDCコインIDを入力（テスト用にSUIコインを分割可能）
```

### ステップ4: NFT確認
```bash
./check_nft.sh
```

### ステップ5: 管理者機能のテスト（オプション）
```bash
./test_admin.sh
# メニューから機能を選択
```

---

## 🎯 テストシナリオ別ガイド

### シナリオ1: 「とりあえず動作確認」
```bash
./test_contract.sh
# 1 → コントラクト状態確認
# 6 → NFT情報確認
# 0 → 終了
```
**所要時間**: 1分

### シナリオ2: 「支援からNFT発行まで」
```bash
./test_support.sh
# ランク選択 → 支援実行

./check_nft.sh
# NFT確認
```
**所要時間**: 3分
**必要なもの**: Testnet USDC（またはテスト用SUI）

### シナリオ3: 「管理者として設定変更」
```bash
./test_admin.sh
# 1 → 分配アドレス変更
# 2 → 分配比率変更
# 5 → 管理者権限確認
```
**所要時間**: 5分
**必要なもの**: 管理者権限（Organizerアドレス）

### シナリオ4: 「完全フローテスト」
```bash
./test_contract.sh
# 7 → 完全フローテスト
```
**所要時間**: 5分
**必要なもの**: Testnet USDC

---

## 💡 よくある質問

### Q1: USDCコインがない場合は？
**A:** テスト用にSUIコインを使用できます。
```bash
./test_support.sh
# USDCコインIDを空白にすると、SUIコインを分割して使用
```

### Q2: 分配機能をテストしたいが30日待てない
**A:** ボーナス分配機能を使用してください。
```bash
./test_admin.sh
# メニューから「4」を選択
```

### Q3: エラーが出た場合は？
**A:** エラーコードを確認してください。
- `E_SUPPORT_CAP_REACHED`: 上限到達 → 分配を実行
- `E_DISTRIBUTION_TOO_EARLY`: 時間不足 → ボーナス分配を使用
- `E_UNAUTHORIZED`: 権限なし → 管理者アドレスに切り替え
- `E_EMPTY_TREASURY`: 残高不足 → 支援を実行

### Q4: 複数のアドレスでテストしたい
**A:** Sui CLIでアドレスを切り替えてください。
```bash
# アドレス一覧を表示
sui client addresses

# アドレスを切り替え
sui client switch --address <ADDRESS>
```

### Q5: トランザクションの詳細を確認したい
**A:** Sui Explorerで確認できます。
```
https://testnet.suivision.xyz/txblock/<TX_DIGEST>
```

---

## 🔧 トラブルシューティング

### エラー: "command not found: sui"
```bash
# Sui CLIをインストール
brew install sui

# または
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### エラー: "Permission denied"
```bash
# 実行権限を付与
chmod +x *.sh
```

### エラー: "jq: command not found"
```bash
# jqをインストール
brew install jq
```

### エラー: "bc: command not found"
```bash
# bcをインストール
brew install bc
```

---

## 📊 期待される結果

### 支援実行後
- ✅ DaoPoolStateの`total_raised`が増加
- ✅ DaoPoolStateの`treasury`残高が増加
- ✅ MemberNFTが発行される
- ✅ NFTのランクが支援額に応じて決定される

### 分配実行後
- ✅ DaoPoolStateの`total_raised`が0にリセット
- ✅ トレジャリー残高が減少（端数のダストのみ残る）
- ✅ Fighter、Gym、Organizerに資金が送金される
- ✅ DistributionEventが発行される

### NFT確認時
- ✅ 保有NFTの一覧が表示される
- ✅ 各NFTの詳細情報（ランク、支援額、発行日時）が表示される
- ✅ ランク別統計が表示される
- ✅ 総支援額が計算される

---

## 🎓 次のステップ

1. **フロントエンドとの統合**
   - これらのスクリプトで動作確認ができたら、フロントエンドから同じ機能を呼び出します

2. **実際のUSDCでテスト**
   - Testnet USDCを取得して、実際の支援フローをテストします

3. **複数ユーザーでテスト**
   - 複数のアドレスを使って、実際のユースケースをシミュレートします

4. **エラーケースのテスト**
   - 意図的にエラーを発生させて、エラーハンドリングを確認します

---

## 📚 参考資料

- [詳細なREADME](./README.md)
- [デプロイ情報](../DEPLOYMENT.md)
- [コントラクト仕様](../CONTRACT_SPEC.md)
- [設計書](../../.kiro/specs/champion-together/design.md)
- [要件定義](../../.kiro/specs/champion-together/requirements.md)

---

**ヒント**: 各スクリプトは単独でも実行できますが、`test_contract.sh`から始めるのが最も簡単です！

**最終更新**: 2025-11-15
