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

### コントラクトのデプロイ（Testnet）
```bash
cd contract
sui client publish --gas-budget 100000000
```

### Sui CLIの設定確認
```bash
sui client active-env
sui client active-address
```

### Sui CLIの環境切り替え
```bash
sui client switch --env testnet
sui client switch --env mainnet
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

## macOS/Darwin固有のユーティリティコマンド

### ファイル検索
```bash
find . -name "*.ts" -type f
```

### テキスト検索
```bash
grep -r "検索文字列" .
```

### ディレクトリ一覧
```bash
ls -la
```

### ファイル内容表示
```bash
cat filename.txt
```
