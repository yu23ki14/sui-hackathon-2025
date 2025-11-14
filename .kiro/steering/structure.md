---
inclusion: always
---

# プロジェクト構造と組織

## ディレクトリ構造

```
sui-hackathon-2025/
├── .devcontainer/             # Dev Container設定
├── .git/                      # Gitバージョン管理
├── .kiro/                     # Kiro IDE設定
│   ├── specs/                 # 機能仕様書（Spec Driven Development）
│   └── steering/              # AIアシスタントステアリングルール
│       ├── AGENTS.md          # エージェント開発ガイド
│       ├── product.md         # プロダクト概要と開発理念
│       ├── product_idea.md    # プロダクトアイデアと背景
│       ├── structure.md       # プロジェクト構造（このファイル）
│       └── tech.md            # 技術スタックとガイドライン
├── .serena/                   # Serenaツール設定
│   └── memories/              # プロジェクトメモリファイル
│       ├── project_overview.md
│       ├── suggested_commands.md
│       ├── code_style_and_conventions.md
│       ├── task_completion_checklist.md
│       ├── development_philosophy.md
│       └── codebase_structure.md
├── contract/                  # Sui Moveスマートコントラクト
│   ├── sources/               # Moveソースコード
│   │   └── greeting.move      # サンプルGreetingコントラクト
│   ├── Move.toml              # Moveパッケージ設定
│   └── Move.lock              # 依存関係ロックファイル
├── frontend/                  # React Webアプリケーション
│   ├── src/                   # ソースコード
│   │   ├── App.tsx            # メインアプリケーションコンポーネント
│   │   ├── main.tsx           # エントリーポイント
│   │   ├── CreateGreeting.tsx # Greeting作成コンポーネント
│   │   ├── Greeting.tsx       # Greeting表示コンポーネント
│   │   ├── constants.ts       # 定数定義
│   │   ├── networkConfig.ts   # ネットワーク設定
│   │   └── vite-env.d.ts      # Vite型定義
│   ├── index.html             # HTMLエントリーポイント
│   ├── package.json           # npm依存関係とスクリプト
│   ├── pnpm-lock.yaml         # pnpmロックファイル
│   ├── prettier.config.cjs    # Prettier設定
│   ├── tsconfig.json          # TypeScript設定
│   ├── tsconfig.node.json     # Node用TypeScript設定
│   └── vite.config.mts        # Vite設定
├── .coderabbit.yaml           # CodeRabbit設定
├── .gitignore                 # Git除外設定
├── AGENTS.md                  # 開発ガイド（ルートレベル）
└── README.md                  # プロジェクト概要
```

## ファイル組織の原則

### Frontend (`/frontend`)

#### ソースコード構造
- **コンポーネント**: 個別ファイルに分離（PascalCase）
- **設定ファイル**: ルートレベルに配置
- **定数・設定**: 専用ファイルで管理（`constants.ts`, `networkConfig.ts`）

#### 今後の拡張予定
```
frontend/src/
├── components/        # 再利用可能なUIコンポーネント
├── pages/            # ページコンポーネント
├── hooks/            # カスタムReact Hooks
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
├── contexts/         # React Context
└── api/              # API通信ロジック
```

### Smart Contracts (`/contract`)

#### 現在の構造
- **sources/**: Moveソースコードファイル（snake_case）
- **Move.toml**: パッケージメタデータと依存関係
- **Move.lock**: 依存関係のバージョンロック

#### 今後の拡張予定
```
contract/sources/
├── fan_club.move      # ファンクラブDAO機能
├── nft.move           # メンバーNFT機能
├── treasury.move      # トレジャリー管理
├── distribution.move  # 資金分配ロジック
└── rank.move          # ランクシステム
```

### Kiro設定 (`/.kiro`)

#### specs/
- Spec Driven Developmentによる機能仕様書
- 各機能ごとにディレクトリを作成
- requirements.md, design.md, tasks.mdを含む

#### steering/
- AIアシスタントの動作を制御するルール
- プロジェクト全体で常に参照される

### Serenaメモリ (`/.serena/memories`)

- プロジェクトの知識ベース
- オンボーディング情報
- コーディング規約とベストプラクティス
- 自動的に参照・更新される

## 命名規則

### TypeScript/React
- **コンポーネントファイル**: PascalCase（例: `CreateGreeting.tsx`）
- **ユーティリティファイル**: camelCase（例: `networkConfig.ts`）
- **定数ファイル**: camelCase（例: `constants.ts`）
- **型定義ファイル**: camelCase + `.d.ts`（例: `vite-env.d.ts`）

### Move
- **ファイル名**: snake_case（例: `greeting.move`, `fan_club.move`）
- **モジュール名**: snake_case
- **関数名**: snake_case

### ドキュメント
- **Markdown**: snake_case（例: `project_overview.md`）
- **設定ファイル**: kebab-case（例: `prettier.config.cjs`）

## コンテンツ基準

### コードファイル

#### 品質基準
- DRY原則に従う（重複を避ける）
- 意味のある変数名・関数名を使用
- コメントは「なぜ」を説明（「何を」はコードで表現）
- 一貫したコーディングスタイルを維持

#### ファイルサイズ
- コンポーネントは200行以内を目安
- 大きくなる場合は分割を検討
- 関数は50行以内を目安

### ドキュメントファイル

#### Markdown形式
- 明確なヘッダー構造（#, ##, ###）
- コードブロックには言語指定
- リストは適切にインデント
- 長いドキュメントには目次を含める

#### 内容
- 具体例を含める
- 最新の情報を維持
- 古い情報は削除ではなくアーカイブ
- 可能な場合はソースを参照

### 設定ファイル

#### 一貫性
- プロジェクト全体で統一された設定
- コメントで設定の意図を説明
- 環境変数は`.env.example`で文書化

#### バージョン管理
- ロックファイル（`pnpm-lock.yaml`, `Move.lock`）は必ずコミット
- `.gitignore`で不要なファイルを除外

## ファイル配置ガイドライン

### 新しいコンポーネントを追加する場合
1. `frontend/src/`に配置
2. PascalCaseで命名
3. 関連する型定義は同じファイルまたは`types/`に配置
4. 再利用可能な場合は`components/`ディレクトリを作成

### 新しいMoveモジュールを追加する場合
1. `contract/sources/`に配置
2. snake_caseで命名
3. `Move.toml`に必要に応じて依存関係を追加
4. テストコードも同じディレクトリに配置

### 新しいドキュメントを追加する場合
1. 目的に応じて適切なディレクトリに配置
   - 開発ガイド: `.kiro/steering/`
   - 機能仕様: `.kiro/specs/`
   - プロジェクト知識: `.serena/memories/`
2. snake_caseで命名
3. 明確なヘッダー構造を使用

## ディレクトリ管理

### 作成するタイミング
- 3つ以上の関連ファイルがある場合
- 論理的なグループ化が必要な場合
- 将来的な拡張が予想される場合

### 削除するタイミング
- 使用されていないコードは積極的に削除
- 空のディレクトリは削除
- 古いコードはGit履歴に残す

## 今後の拡張予定

### `/lit-protocol`
- Lit Protocolとの統合コード
- 階層化されたコンテンツアクセス制御
- NFTベースの認証ロジック

### `/docs`
- ユーザー向けドキュメント
- API仕様書
- デプロイメントガイド

### `/tests`
- E2Eテスト
- 統合テスト
- テストユーティリティ

## バージョン管理

### Gitワークフロー
- main/masterブランチは保護
- 機能開発はfeatureブランチで
- コンベンショナルコミット形式を使用

### ブランチ命名
- `feat/機能名` - 新機能
- `fix/バグ名` - バグ修正
- `docs/ドキュメント名` - ドキュメント更新
- `refactor/対象` - リファクタリング
