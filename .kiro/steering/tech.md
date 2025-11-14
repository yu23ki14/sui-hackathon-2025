---
inclusion: always
---

# 技術スタックと開発ガイドライン

## プロジェクト概要

CHAMPION TOGETHERは、格闘家向けの分散型ファンクラブプラットフォームです。モノレポ構成で、フロントエンド（React）とスマートコントラクト（Sui Move）を統合開発します。

## 技術スタック

### Frontend (`/frontend`)

#### コアフレームワーク
- **React 18.3.1** - UIライブラリ
- **Vite 7.0.5** - 高速ビルドツール
- **TypeScript 5.8.3** - 型安全な開発

#### Sui統合
- **@mysten/dapp-kit 0.17.6** - Sui dApp開発キット
- **@mysten/sui 1.37.5** - Sui JavaScript SDK
- Sui Wallet SDKによるウォレット接続

#### 状態管理・データフェッチ
- **@tanstack/react-query 5.83.0** - サーバー状態管理
- React Context / hooks - ローカル状態管理

#### UI/スタイリング
- **Tailwind CSS** - ユーティリティファーストCSS（設定予定）
- **Radix UI** - アクセシブルなUIコンポーネント
  - @radix-ui/themes 3.2.1
  - @radix-ui/colors 3.0.0
  - @radix-ui/react-icons 1.3.0
- **react-spinners 0.14.1** - ローディングインジケーター

#### 開発ツール
- **ESLint 9.17.0** - コード品質チェック
- **Prettier 3.6.2** - コードフォーマッター
- **@vitejs/plugin-react-swc 3.11.0** - 高速なReactリフレッシュ

#### パッケージマネージャー
- **pnpm** - 高速で効率的な依存関係管理

### Smart Contracts (`/contract`)

#### ブロックチェーン
- **Sui Blockchain** - 高速・低コストなL1ブロックチェーン
- **Testnet** - 開発・テスト環境

#### 言語・フレームワーク
- **Move Language** - Sui用スマートコントラクト言語
- **Edition 2024.beta** - 最新のMove仕様
- **Sui Framework** - testnetブランチ使用

#### 開発ツール
- **Sui CLI** - コントラクトのビルド・テスト・デプロイ

### 今後の統合予定

#### Lit Protocol (`/lit-protocol`)
- **目的**: 階層化されたコンテンツの分散型アクセス制御
- **統合**: Lit SDK + Sui NFT検証
- メンバーランクに応じた限定コンテンツへのアクセス管理

## 開発環境

### 必須ツール
- **Node.js** - v23.3.0（nvm経由）
- **pnpm** - フロントエンド依存関係管理
- **Sui CLI** - スマートコントラクト開発（Homebrew経由インストール）
- **Git** - バージョン管理

### OS
- **macOS (Darwin)** - 開発環境

## TypeScript設定

### コンパイラオプション
```json
{
  "target": "ES2020",
  "lib": ["ES2020", "DOM", "DOM.Iterable"],
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

### 特徴
- Strict Mode有効 - 型安全性の最大化
- 未使用変数/パラメータをエラーとして検出
- Bundlerモード - Viteとの最適な統合

## コーディング規約

### 命名規則
- **コンポーネント**: PascalCase（例: `CreateGreeting.tsx`）
- **関数/変数**: camelCase
- **定数**: UPPER_SNAKE_CASE
- **型/インターフェース**: PascalCase
- **Moveファイル**: snake_case（例: `greeting.move`）

### ファイル構造
- コンポーネントは個別ファイルに分離
- 共通定数は`constants.ts`に集約
- ネットワーク設定は`networkConfig.ts`に集約

### Prettier設定
```javascript
{
  "proseWrap": "always"
}
```

### ESLint
- TypeScript ESLintプラグイン使用
- React Hooksルール適用
- 最大警告数: 0（警告もエラー扱い）

## 開発ワークフロー

### フロントエンド開発

#### 開発サーバー起動
```bash
cd frontend
pnpm dev
```

#### ビルド
```bash
cd frontend
pnpm build
```

#### Lint実行
```bash
cd frontend
pnpm lint
```

### スマートコントラクト開発

#### ビルド
```bash
cd contract
sui move build
```

#### テスト
```bash
cd contract
sui move test
```

#### デプロイ（Testnet）
```bash
cd contract
sui client publish --gas-budget 100000000
```

## 環境変数

### Frontend (`.env`)
```bash
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=0x...
VITE_LIT_NETWORK=cayenne
```

### Contract (`.env`)
```bash
SUI_NETWORK=testnet
DEPLOYER_ADDRESS=0x...
```

## セキュリティ考慮事項

### Move契約
1. **入力検証**: すべての関数で入力を検証（amounts > 0, 有効なアドレス）
2. **アクセス制御**: 認可されたアドレスのみが分配をトリガー可能
3. **リエントランシー**: Suiのリソースモデル（設計上リエントランシー不可）
4. **整数オーバーフロー**: Moveの組み込みオーバーフローチェック

### フロントエンド
1. **環境変数**: APIキー等は環境変数で管理（ハードコード禁止）
2. **入力検証**: すべての外部入力を検証
3. **最小権限**: 必要最小限の権限で動作

## テスト戦略

### スマートコントラクト
- 各モジュールのユニットテスト
- モジュール間の統合テスト
- 勝利ボーナス分配ロジックのテスト
- ランク計算のエッジケーステスト

### フロントエンド
- 現在テストフレームワークは未設定
- 今後Vitest等の導入を検討

## スタイリングガイドライン

### デザインテーマ
- ファイター向けテーマ（大胆でエネルギッシュな色使い）
- モバイルファースト設計
- Radix UIによるアクセシブルなコンポーネント

### Tailwind CSS
- ユーティリティファーストアプローチ
- レスポンシブデザイン
- カスタムテーマ設定

## Git運用

### コミットメッセージ形式（コンベンショナルコミット）
```
<type>: <description>

[optional body]
```

### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `test`: テスト追加・修正
- `refactor`: リファクタリング
- `chore`: その他の変更

### 原則
- 原子的なコミット（1つの変更に焦点）
- 英語で記述
- main/masterブランチへの直接コミットは避ける

## パフォーマンス最適化

### フロントエンド
- TanStack Queryによる効率的なデータフェッチ
- React.memoによる不要な再レンダリング防止
- 遅延読み込み（Lazy Loading）の活用
- Vite + SWCによる高速ビルド

### スマートコントラクト
- Suiの高速トランザクション活用
- オブジェクト指向NFTによる効率的な状態管理
- Move言語の最適化されたリソース管理

## 今後の技術的課題

1. **Lit Protocol統合** - 階層化コンテンツアクセス制御
2. **zkLogin実装** - Web3初心者向けの簡単なログイン
3. **テストフレームワーク導入** - フロントエンドの自動テスト
4. **CI/CD構築** - 自動ビルド・デプロイパイプライン
5. **モニタリング** - エラートラッキングとパフォーマンス監視
