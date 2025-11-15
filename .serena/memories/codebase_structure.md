# コードベース構造

## ディレクトリ構造

```
sui-hackathon-2025/
├── .devcontainer/             # Dev Container設定
│   ├── devcontainer.json      # コンテナ設定
│   └── update-on-start.sh     # 起動時スクリプト
├── .git/                      # Gitリポジトリ
├── .kiro/                     # Kiro IDE設定
│   ├── hooks/                 # Kiroフック設定
│   │   ├── run-move-tests.json
│   │   └── update-readme-on-task-complete.json
│   ├── settings/              # Kiro設定
│   │   └── mcp.json           # MCP設定
│   ├── specs/                 # 機能仕様書（Spec Driven Development）
│   │   ├── champion-together/ # メイン機能仕様
│   │   │   ├── requirements.md
│   │   │   ├── design.md
│   │   │   └── tasks.md
│   │   └── generic-coin-support/ # ジェネリック型対応仕様
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── steering/              # AIアシスタントステアリングルール
│       ├── product.md
│       ├── product_idea.md
│       ├── structure.md
│       └── tech.md
├── .serena/                   # Serenaツール設定
│   ├── memories/              # プロジェクトメモリファイル
│   │   ├── project_overview.md
│   │   ├── project_current_status.md
│   │   ├── codebase_structure.md
│   │   ├── suggested_commands.md
│   │   ├── code_style_and_conventions.md
│   │   ├── task_completion_checklist.md
│   │   ├── development_philosophy.md
│   │   ├── integration_tests_summary.md
│   │   └── cli_test_scripts_guide.md
│   ├── project.yml
│   └── .gitignore
├── contract/                  # Sui Moveスマートコントラクト
│   ├── sources/               # Moveソースコード
│   │   ├── dao_pool.move      # DaoPoolコントラクト（メイン）
│   │   ├── member_nft.move    # MembersNFTコントラクト
│   │   ├── constants.move     # システム定数
│   │   ├── errors.move        # エラーコード定義
│   │   ├── dao_pool_tests.move      # DaoPoolユニットテスト
│   │   ├── member_nft_tests.move    # NFTユニットテスト
│   │   └── integration_tests.move   # 統合テスト
│   ├── scripts/               # テスト・デプロイスクリプト
│   │   ├── initialize.sh      # 初期化スクリプト
│   │   ├── initialize.ts      # TypeScript初期化
│   │   ├── init_usdc_pool.sh  # USDCプール初期化
│   │   ├── init_usdc_pool.ts  # TypeScript版
│   │   ├── init_usdc_pool_auto.sh
│   │   ├── init_ptb.sh        # PTB初期化
│   │   ├── test_contract.sh   # コントラクトテスト
│   │   ├── test_support.sh    # 支援機能テスト
│   │   ├── test_usdc_support.sh # USDC支援テスト
│   │   ├── test_distribution.sh # 分配機能テスト
│   │   ├── test_admin.sh      # 管理者機能テスト
│   │   ├── check_nft.sh       # NFT確認
│   │   ├── load_env.sh        # 環境変数読み込み
│   │   ├── README.md          # スクリプト説明
│   │   ├── QUICKSTART.md      # クイックスタート
│   │   ├── ENV_SETUP.md       # 環境設定
│   │   ├── SUI_TEST_REPORT.md # SUIテストレポート
│   │   ├── USDC_TEST_REPORT.md # USDCテストレポート
│   │   └── .gitignore
│   ├── Move.toml              # Moveパッケージ設定
│   ├── Move.lock              # 依存関係ロックファイル
│   ├── CONTRACT_SPEC.md       # コントラクト仕様書
│   ├── DEPLOYMENT.md          # デプロイ情報
│   ├── DEPLOYMENT_GENERIC.md  # ジェネリック型デプロイ情報
│   ├── package.json           # Node.js依存関係
│   ├── pnpm-lock.yaml
│   ├── .env.example
│   └── .env
├── frontend/                  # React Webアプリケーション
│   ├── src/                   # ソースコード
│   │   ├── pages/             # ページコンポーネント
│   │   │   ├── Top.tsx        # トップページ
│   │   │   ├── Support.tsx    # 支援ページ
│   │   │   ├── MyPage.tsx     # マイページ
│   │   │   ├── ExclusiveContent.tsx # 限定コンテンツ
│   │   │   └── Admin.tsx      # 管理者ページ
│   │   ├── components/        # UIコンポーネント（20個）
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── SupportForm.tsx
│   │   │   ├── DAOInfoCard.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── RankBadge.tsx
│   │   │   ├── MySummaryCards.tsx
│   │   │   ├── StatusCards.tsx
│   │   │   ├── SupportHistoryTable.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   ├── ContentDetailModal.tsx
│   │   │   ├── LockedContentModal.tsx
│   │   │   ├── DistributionSettings.tsx
│   │   │   ├── DistributionExecution.tsx
│   │   │   ├── DistributionSection.tsx
│   │   │   ├── EventHistoryTabs.tsx
│   │   │   ├── AdminInfoBar.tsx
│   │   │   ├── AuthStatusBar.tsx
│   │   │   ├── WalletInfo.tsx
│   │   │   └── FeedbackAlert.tsx
│   │   ├── hooks/             # カスタムReact Hooks（12個）
│   │   │   ├── index.ts
│   │   │   ├── useWalletConnection.ts
│   │   │   ├── useSupport.ts
│   │   │   ├── useDaoInfo.ts
│   │   │   ├── useUserNftData.ts
│   │   │   ├── useUsdcBalance.ts
│   │   │   ├── useAdminStatus.ts
│   │   │   ├── useDistributionSettings.ts
│   │   │   ├── useDistributionExecution.ts
│   │   │   ├── useEventHistory.ts
│   │   │   ├── useSupportHistory.ts
│   │   │   └── useContentAccess.ts
│   │   ├── lib/               # ユーティリティライブラリ
│   │   │   ├── suiClient.ts
│   │   │   ├── contractAddresses.ts
│   │   │   ├── nftUtils.ts
│   │   │   └── litProtocol.ts
│   │   ├── config/            # 設定ファイル
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── App.tsx            # メインアプリケーション
│   │   ├── main.tsx           # エントリーポイント
│   │   ├── theme.css          # カスタムテーマ
│   │   ├── constants.ts       # 定数定義
│   │   ├── networkConfig.ts   # ネットワーク設定
│   │   ├── vite-env.d.ts      # Vite型定義
│   │   ├── CreateGreeting.tsx # レガシー（削除予定）
│   │   └── Greeting.tsx       # レガシー（削除予定）
│   ├── public/                # 静的ファイル
│   │   └── images/
│   │       └── pfp.png
│   ├── index.html             # HTMLエントリーポイント
│   ├── package.json           # npm依存関係
│   ├── pnpm-lock.yaml         # pnpmロックファイル
│   ├── prettier.config.cjs    # Prettier設定
│   ├── tsconfig.json          # TypeScript設定
│   ├── tsconfig.node.json     # Node用TypeScript設定
│   ├── vite.config.mts        # Vite設定
│   ├── .env.example
│   └── .env.local
├── lit-protocol/              # Lit Protocol統合（開発中）
│   ├── src/
│   │   ├── index.ts
│   │   ├── encrypt.ts
│   │   ├── decrypt.ts
│   │   ├── litAction.ts
│   │   ├── uploadAction.ts
│   │   ├── sessionHelper.ts
│   │   └── ipfsHelper.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   ├── README.md
│   ├── README-STATUS.md
│   ├── QUICKSTART.md
│   ├── .env.example
│   └── .gitignore
├── .coderabbit.yaml           # CodeRabbit設定
├── .gitignore                 # Git除外設定
├── AGENTS.md                  # 開発ガイド
├── CLAUDE.md                  # Claude AI用ドキュメント
└── README.md                  # プロジェクト概要
```

## 主要ディレクトリの説明

### `/contract`
Sui Moveスマートコントラクトのディレクトリ。

**主要ファイル:**
- `sources/dao_pool.move`: 支援金管理と自動分配のメインコントラクト
- `sources/member_nft.move`: メンバーNFT発行と管理
- `sources/constants.move`: システム定数（ランク閾値、分配比率等）
- `sources/errors.move`: エラーコード定義
- `sources/*_tests.move`: ユニットテストと統合テスト（39テスト）

**スクリプト:**
- `scripts/`: 初期化、テスト、デプロイ用のシェルスクリプト
- `CONTRACT_SPEC.md`: コントラクト仕様書
- `DEPLOYMENT.md`: デプロイ情報とアドレス

### `/frontend`
React + Viteベースのフロントエンドアプリケーション。

**ページ構成:**
- `pages/Top.tsx`: ランディングページ
- `pages/Support.tsx`: 支援ページ（メイン機能）
- `pages/MyPage.tsx`: ユーザーマイページ
- `pages/ExclusiveContent.tsx`: 限定コンテンツ（Lit Protocol統合予定）
- `pages/Admin.tsx`: 管理者ページ

**コンポーネント:**
- `components/`: 20個の再利用可能なUIコンポーネント
- `hooks/`: 12個のカスタムReact Hooks（ビジネスロジック）
- `lib/`: ユーティリティライブラリ（Sui Client、NFT操作等）
- `config/`: 設定ファイルと型定義

**技術スタック:**
- React 18.3.1 + TypeScript 5.8.3
- Vite 7.0.5（高速ビルド）
- @mysten/dapp-kit 0.17.6（Sui統合）
- @tanstack/react-query 5.83.0（状態管理）
- @radix-ui/themes 3.2.1（UIコンポーネント）

### `/lit-protocol`
Lit Protocol統合コード（開発中）。

**目的:**
- 階層化されたコンテンツの分散型アクセス制御
- NFTランクに基づく暗号化コンテンツへのアクセス管理

**実装状況:**
- 基本的なSDK統合コードは存在
- フロントエンドとの統合は未完了

### `/.kiro`
Kiro IDE固有の設定とステアリングルール。

**specs/:**
- `champion-together/`: メイン機能の仕様書（requirements, design, tasks）
- `generic-coin-support/`: ジェネリック型対応の仕様書（新規）

**steering/:**
- プロダクト概要、技術スタック、プロジェクト構造のガイドライン

**hooks/:**
- 自動化フック（Moveテスト実行、README更新等）

### `/.serena`
Serenaコーディングツールの設定とメモリファイル。

**memories/:**
- プロジェクト概要、現状、コードベース構造
- 開発哲学、コーディング規約
- テストサマリー、CLIスクリプトガイド

## ファイル命名規則

### TypeScript/React
- コンポーネント: PascalCase（例: `CreateGreeting.tsx`）
- ユーティリティ/設定: camelCase（例: `networkConfig.ts`）
- 定数ファイル: camelCase（例: `constants.ts`）

### Move
- snake_case（例: `greeting.move`）

## 設定ファイル

### TypeScript設定
- `tsconfig.json`: メインのTypeScript設定
- `tsconfig.node.json`: Node.js環境用の設定

### ビルドツール
- `vite.config.mts`: Viteバンドラー設定
- `package.json`: npm/pnpmスクリプトと依存関係

### コード品質
- `prettier.config.cjs`: コードフォーマッター設定
- ESLint設定はpackage.jsonのscriptsで定義

### Move
- `Move.toml`: パッケージ設定、依存関係、アドレス定義

## 最近の主要な変更

### 2025-11-15時点の状態
1. **スマートコントラクト**: MVP完成、Testnetにデプロイ済み（39テスト全て成功）
2. **フロントエンド**: 5ページ、20コンポーネント、12フック実装完了（90%完成）
3. **新規Spec**: generic-coin-support（ジェネリック型対応）の仕様書作成中
4. **Lit Protocol**: 基本コード存在、フロントエンド統合は未完了

### 削除予定のレガシーファイル
- `frontend/src/CreateGreeting.tsx`
- `frontend/src/Greeting.tsx`
- `contract/sources/greeting.move`（既に削除済み）
