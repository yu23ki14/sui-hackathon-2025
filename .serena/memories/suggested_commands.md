# 推奨コマンド

## Frontend開発

### 開発サーバー起動
```bash
cd frontend
pnpm dev
```

### ビルド
```bash
cd frontend
pnpm build
```

### Lint実行
```bash
cd frontend
pnpm lint
```

### プレビュー
```bash
cd frontend
pnpm preview
```

### 依存関係のインストール
```bash
cd frontend
pnpm install
```

## Smart Contract開発

### コントラクトのビルド
```bash
cd contract
sui move build
```

### コントラクトのテスト
```bash
cd contract
sui move test
```

### 特定のテストのみ実行
```bash
cd contract
sui move test test_support_and_mint
sui move test integration_tests
```

### コントラクトのデプロイ（Testnet）
```bash
cd contract
sui client publish --gas-budget 100000000
```

### ジェネリック型対応版のデプロイ（将来）
```bash
cd contract
# USDC型を指定してデプロイ
sui client publish --gas-budget 100000000 --type-args "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
```

### テストスクリプトの実行
```bash
cd contract/scripts
# 環境変数の読み込み
source load_env.sh

# 初期化
./initialize.sh

# 支援機能のテスト
./test_support.sh

# USDC支援のテスト
./test_usdc_support.sh

# 分配機能のテスト
./test_distribution.sh

# 管理者機能のテスト
./test_admin.sh

# NFT確認
./check_nft.sh
```

### Sui CLIの設定確認
```bash
sui client active-env
sui client active-address
sui client gas
```

### Sui CLIの環境切り替え
```bash
sui client switch --env testnet
sui client switch --env mainnet
```

### オブジェクトの確認
```bash
# 特定のオブジェクトの詳細
sui client object <OBJECT_ID>

# アドレスが所有するオブジェクト一覧
sui client objects
```

## Git操作

### ステータス確認
```bash
git status
```

### コミット（コンベンショナルコミット形式）
```bash
git add .
git commit -m "feat: 新機能の説明"
git commit -m "fix: バグ修正の説明"
git commit -m "docs: ドキュメント更新"
git commit -m "test: テスト追加"
git commit -m "refactor: リファクタリング"
git commit -m "chore: その他の変更"
```

## Lit Protocol開発（開発中）

### 開発サーバー起動
```bash
cd lit-protocol
pnpm dev
```

### ビルド
```bash
cd lit-protocol
pnpm build
```

### 暗号化テスト
```bash
cd lit-protocol
pnpm encrypt
```

### 復号化テスト
```bash
cd lit-protocol
pnpm decrypt
```

## プロジェクト全体

### 全モジュールの依存関係インストール
```bash
# フロントエンド
cd frontend && pnpm install && cd ..

# Lit Protocol
cd lit-protocol && pnpm install && cd ..

# コントラクトスクリプト
cd contract && pnpm install && cd ..
```

### 全テストの実行
```bash
# スマートコントラクトのテスト
cd contract && sui move test && cd ..

# フロントエンドのビルド確認
cd frontend && pnpm build && cd ..
```

## macOS/Darwin固有のユーティリティコマンド

### ファイル検索
```bash
find . -name "*.ts" -type f
find . -name "*.move" -type f
```

### テキスト検索
```bash
grep -r "検索文字列" .
grep -r "function support" contract/sources/
```

### ディレクトリ一覧
```bash
ls -la
tree -L 2  # treeコマンドがインストールされている場合
```

### ファイル内容表示
```bash
cat filename.txt
less filename.txt  # 長いファイルの場合
```

### プロセス確認
```bash
ps aux | grep node
ps aux | grep sui
```
