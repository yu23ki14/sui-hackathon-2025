# コードベース構造

## ディレクトリ構造

```
sui-hackathon-2025/
├── .devcontainer/         # Dev Container設定
├── .git/                  # Gitリポジトリ
├── .kiro/                 # Kiro IDE設定
│   └── steering/          # AIアシスタントステアリングルール
├── .serena/               # Serenaツール設定
├── contract/              # Sui Moveスマートコントラクト
│   ├── sources/           # Moveソースコード
│   │   └── greeting.move  # サンプルGreetingコントラクト
│   ├── Move.toml          # Moveパッケージ設定
│   └── Move.lock          # 依存関係ロックファイル
├── frontend/              # React Webアプリケーション
│   ├── src/               # ソースコード
│   │   ├── App.tsx        # メインアプリケーションコンポーネント
│   │   ├── main.tsx       # エントリーポイント
│   │   ├── CreateGreeting.tsx    # Greeting作成コンポーネント
│   │   ├── Greeting.tsx          # Greeting表示コンポーネント
│   │   ├── constants.ts          # 定数定義
│   │   ├── networkConfig.ts      # ネットワーク設定
│   │   └── vite-env.d.ts         # Vite型定義
│   ├── index.html         # HTMLエントリーポイント
│   ├── package.json       # npm依存関係
│   ├── pnpm-lock.yaml     # pnpmロックファイル
│   ├── prettier.config.cjs # Prettier設定
│   ├── tsconfig.json      # TypeScript設定
│   ├── tsconfig.node.json # Node用TypeScript設定
│   └── vite.config.mts    # Vite設定
├── .coderabbit.yaml       # CodeRabbit設定
├── .gitignore             # Git除外設定
├── AGENTS.md              # 開発ガイド
└── README.md              # プロジェクト概要
```

## 主要ディレクトリの説明

### `/contract`
Sui Moveスマートコントラクトのディレクトリ。

- `sources/`: Moveソースコードファイル
- `Move.toml`: パッケージメタデータと依存関係
- `Move.lock`: 依存関係のバージョンロック

### `/frontend`
React + Viteベースのフロントエンドアプリケーション。

- `src/`: TypeScript/TSXソースコード
  - コンポーネントは個別ファイルに分離
  - 定数とネットワーク設定は専用ファイルで管理
- 設定ファイル群（tsconfig, vite.config, prettier.config等）

### `/.kiro`
Kiro IDE固有の設定とステアリングルール。

### `/.serena`
Serenaコーディングツールの設定とメモリファイル。

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

## 今後追加予定のディレクトリ

### `/lit-protocol`
Lit Protocolとの統合コード（階層化されたコンテンツアクセス制御用）
