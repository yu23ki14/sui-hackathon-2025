# CHAMPION TOGETHER - プロジェクト概要

## プロジェクトの目的

格闘家向けの分散型ファンクラブプラットフォーム。ファンがUSDCで支援し、DAOトレジャリーを通じてスマートコントラクトが自動的に格闘家/ジム/主催者に分配する。サポートごとにメンバーNFTがミントされ、ランクに応じてLit Protocolを通じて限定コンテンツにアクセス可能。勝利ボーナスでエンゲージメントを促進。

## リポジトリ構造（モノレポ）

```
/
├── frontend/          # React Webアプリケーション
├── contract/          # Sui Moveスマートコントラクト
└── lit-protocol/      # Lit Protocol統合（予定）
```

## 技術スタック

### Frontend (`/frontend`)
- **Framework**: Vite + React
- **Routing**: React Router（予定）
- **Styling**: Tailwind CSS + Radix UI
- **Wallet**: Sui Wallet SDK (@mysten/dapp-kit)
- **State**: React Context / hooks + TanStack Query
- **Package Manager**: pnpm

### Smart Contracts (`/contract`)
- **Language**: Move (Edition 2024.beta)
- **Blockchain**: Sui (Testnet)
- **Package Manager**: Sui CLI

### Lit Protocol (`/lit-protocol`)
- **Purpose**: 階層化されたコンテンツの分散型アクセス制御
- **Integration**: Lit SDK + Sui NFT検証

## 現在の開発状況

- 基本的なSui dAppのスケルトンが実装済み
- Greetingコントラクトのサンプルが存在
- フロントエンドの基本構造が整備済み
