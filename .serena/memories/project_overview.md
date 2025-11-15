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

### MVP完成（85%完了）
- ✅ スマートコントラクト: DaoPool + MembersNFT実装完了、Testnetデプロイ済み
- ✅ テスト: 39個のテスト全て成功（ユニット + 統合）
- ✅ フロントエンド: 5ページ、20コンポーネント、12フック実装完了（90%）
- ⏳ Lit Protocol: 基本コード存在、統合未完了
- ⏳ ジェネリック型対応: 仕様書完成、実装未着手（最優先課題）

### デプロイ情報（Testnet）
- **Package ID**: `0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed`
- **DaoPoolState**: `0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f`
- **MembersNFTState**: `0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51`

### 主要な課題
1. **コイン型互換性**: 現在の独自USDC型を実際のTestnet USDCに対応させる必要あり
2. **Lit Protocol統合**: 限定コンテンツの暗号化とアクセス制御
3. **フロントエンドデプロイ**: Vercel/Netlifyへのデプロイ準備
