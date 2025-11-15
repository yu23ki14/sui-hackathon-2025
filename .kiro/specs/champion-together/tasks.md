# Implementation Plan

## Overview

このタスクリストは、CHAMPION TOGETHERプラットフォームの実装を段階的に進めるためのものです。各タスクは前のタスクの成果物を基に構築され、最終的に完全に機能するシステムを実現します。

## Task List

- [x] 1. プロジェクト構造とMoveコントラクトの基盤セットアップ
  - contract/ディレクトリにMove.tomlを設定し、Sui Framework依存関係を追加
  - USDC Testnetトークンアドレスを定数として定義
  - 基本的なエラーコード定数を定義
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. MembersNFT Contractの実装
  - [x] 2.1 MembersNFTStateとMemberNFT構造体を定義
    - MembersNFTState: id, token_counter, dao_pool_idフィールド
    - MemberNFT: id, token_id, support_amount, rank, minted_at, image_urlフィールド
    - _Requirements: 2.2, 2.7_

  - [x] 2.2 mint関数を実装
    - 呼び出し元がdao_pool_idと一致することを検証
    - 支援額に基づいてランクを決定（Bronze: 10-49, Silver: 50-99, Gold: 100-199, Platinum: 200+）
    - token_counterをインクリメント
    - MemberNFTオブジェクトを作成してrecipientに転送
    - MintEventを発行
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.4_

  - [x] 2.3 owner_of、balance_of、get_rank関数、そのほかNFTに必要なRead、Writeの関数を実装
    - owner_of: NFTの所有者アドレスを返す
    - balance_of: 指定アドレスが保有するNFT数を返す
    - get_rank: NFTの会員ランクを返す
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.4 MembersNFT Contractのユニットテストを作成
    - mint関数の各ランクテスト（Bronze, Silver, Gold, Platinum）
    - 権限なしでのmint呼び出しテスト（エラー期待）
    - owner_of、balance_of、get_rank関数のテスト
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.4_

- [x] 3. DaoPool Contractの実装
  - [x] 3.1 DaoPoolState構造体を定義
    - id, total_raised, support_cap, last_distribution, distribution_intervalフィールド
    - fighter_address, gym_address, organizer_addressフィールド
    - fighter_ratio, gym_ratio, organizer_ratioフィールド
    - treasury (Coin<USDC>), nft_contract_idフィールド
    - _Requirements: 1.5, 4.5, 5.6_

  - [x] 3.2 support関数を実装
    - 支援額がゼロより大きいことを検証
    - 累計支援額が上限を超えないことを検証（total_raised + payment <= support_cap）
    - トレジャリーにUSDCを追加
    - total_raisedを更新
    - MembersNFT ContractのmintをDynamic Callで呼び出し
    - SupportEventを発行
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2_

  - [x] 3.3 distribute関数を実装
    - 現在時刻と最終分配時刻の差がdistribution_interval以上であることを検証
    - トレジャリー残高がゼロより大きいことを検証
    - 配分比率に基づいて各受取人への配分額を計算
    - 各受取人（Fighter, Gym, Organizer）にUSDCを送金
    - total_raisedをゼロにリセット
    - last_distributionを更新
    - DistributionEventを発行
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 3.4 change_distribution_detail関数を実装
    - 呼び出し元がorganizer_addressであることを検証
    - 新しいアドレスが指定されていれば更新（fighter, gym, organizer）
    - 新しい配分比率が指定されていれば更新
    - 配分比率の合計が100であることを検証
    - ConfigChangeEventを発行
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.5_

  - [x] 3.5 DaoPool Contractのユニットテストを作成
    - support関数: 正常系、上限超過、ゼロ額
    - distribute関数: 正常系、早すぎる実行、空のトレジャリー
    - change_distribution_detail関数: 正常系、権限なし、無効な比率
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.6, 5.1, 5.2, 5.5_

  - [x] 3.6 統合テストを作成
    - support → mint の連携テスト
    - 複数回の支援とNFT発行テスト
    - distribute の資金分配フローテスト
    - _Requirements: 1.4, 4.3, 4.4, 4.5_

- [x] 4. Sui Testnetへのコントラクトデプロイ
  - sui client publishコマンドでDaoPoolとMembersNFTをデプロイ
  - デプロイ後のPackage IDとObject IDを記録
  - DaoPoolStateを初期化（support_cap: 3,000 USDC、distribution_interval: 30日、初期配分比率）
  - MembersNFTStateを初期化（dao_pool_idを設定）
  - Sui Explorerでコントラクトを確認
  - _Requirements: 1.1, 2.1, 4.1, 5.1_

- [x] 5. フロントエンドプロジェクトのセットアップ
  - frontend/ディレクトリにVite + React + TypeScriptプロジェクトを作成（既存の場合はスキップ）
  - 必要な依存関係をインストール（@mysten/dapp-kit, @mysten/sui, @tanstack/react-query, @radix-ui/themes）
  - .envファイルを作成し、デプロイしたコントラクトのアドレスを設定
  - src/types/index.tsに型定義を作成（PoolState, MemberNFT, DistributionRecord）
  - src/utils/constants.tsに定数を定義（コントラクトアドレス、ネットワーク設定）
  - _Requirements: 6.1, 7.1_

- [x] 6. ウォレット接続機能の実装
  - [x] 6.1 useSuiWallet.tsフックを実装
    - Sui Wallet SDKを使用してウォレット接続機能を実装
    - 接続状態、アドレス、残高を管理
    - 接続、切断関数を提供
    - _Requirements: 6.1, 6.2_

  - [x] 6.2 WalletConnect.tsxコンポーネントを実装
    - ウォレット接続ボタン
    - 接続済みの場合はアドレスと残高を表示
    - 切断ボタン
    - _Requirements: 6.1, 6.2_

- [x] 7. DaoPool Contract操作フックの実装
  - [x] 7.1 useDaoPool.tsフックを実装
    - support関数を呼び出すmutationを実装
    - DaoPoolStateを取得するqueryを実装
    - 累計支援額、支援上限、次回分配日時を計算
    - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2_

  - [x] 7.2 contractHelpers.tsにヘルパー関数を実装
    - buildSupportTransaction: support関数のトランザクションを構築
    - buildDistributeTransaction: distribute関数のトランザクションを構築
    - parseDaoPoolState: コントラクトの状態をパース
    - _Requirements: 6.4, 7.1_

- [x] 8. 支援フォームの実装
  - [x] 8.1 SupportForm.tsxコンポーネントを実装
    - 支援額入力フィールド（数値のみ、正の値）
    - 入力額に応じた会員ランクプレビュー
    - 支援ボタン（ウォレット未接続時は無効化）
    - トランザクション状態表示（pending, success, error）
    - エラーメッセージ表示（残高不足、上限超過など）
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 10.2, 10.3, 10.4_

  - [x] 8.2 formatters.tsにフォーマット関数を実装
    - formatUSDC: マイクロUSDCを通常のUSDC表示に変換
    - formatDate: Unix timestampを日本語の日時表示に変換
    - formatAddress: アドレスを短縮表示
    - _Requirements: 7.1, 7.2, 7.5_

- [x] 9. 支援状況表示の実装
  - [x] 9.1 ProgressBar.tsxコンポーネントを実装
    - 累計支援額の進捗バー（0 - 3,000 USDC）
    - 達成率パーセンテージ表示
    - 次回分配までのカウントダウン表示
    - _Requirements: 7.1, 7.2_

  - [x] 9.2 DistributionHistory.tsxコンポーネントを実装
    - 過去の分配履歴を一覧表示
    - 各分配の日時、総額、各受取人への配分額を表示
    - イベントログから履歴を取得
    - _Requirements: 7.5_

- [x] 10. MembersNFT Contract操作フックの実装
  - [x] 10.1 useMembersNFT.tsフックを実装
    - 指定アドレスが保有するNFTを取得するqueryを実装
    - NFTメタデータ（ランク、支援額、発行日時）を取得
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.4_

  - [x] 10.2 NFTGallery.tsxコンポーネントを実装
    - 保有NFTをグリッド表示
    - 各NFTの詳細情報（ランク、支援額、発行日）を表示
    - NFT画像を表示（ランクに応じた画像）
    - NFTがない場合は「まだNFTを保有していません」と表示
    - _Requirements: 7.4_

- [ ] 11. Lit Protocol統合の実装
  - [ ] 11.1 useLitProtocol.tsフックを実装
    - Lit Protocol SDKを初期化
    - checkAccess関数を実装（contentId, requiredRankを受け取る）
    - MembersNFT Contractから会員ランクを取得
    - アクセス条件を評価してboolean を返す
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 11.2 ExclusiveContent.tsxコンポーネントを実装
    - 会員ランク別コンテンツリストを表示
    - 各コンテンツのアクセス可能/不可能を表示
    - アクセス可能なコンテンツはクリックして閲覧可能
    - アクセス不可能なコンテンツは鍵アイコンと必要ランクを表示
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. メインアプリケーションの統合
  - [x] 12.1 App.tsxを実装
    - Sui dApp Kitのプロバイダーを設定
    - TanStack Query のプロバイダーを設定
    - Radix UI Themesのプロバイダーを設定
    - 各コンポーネントをレイアウト
    - ヘッダー（タイトル、ウォレット接続）
    - メインコンテンツ（支援フォーム、進捗バー、NFTギャラリー、分配履歴、限定コンテンツ）
    - _Requirements: 6.1, 6.3, 7.1, 7.4, 7.5, 8.5_

  - [x] 12.2 エラーハンドリングの統合
    - handleContractError関数を実装（エラーコードをユーザーフレンドリーなメッセージに変換）
    - 各コンポーネントでエラーメッセージを表示
    - ネットワークエラー時のリトライ機能
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 13. スタイリングとUI/UX改善
  - Tailwind CSSを設定（既存の場合はスキップ）
  - ファイター向けテーマカラーを適用（大胆でエネルギッシュな色使い）
  - レスポンシブデザインを実装（モバイルファースト）
  - ローディング状態の表示（react-spinnersを使用）
  - トランザクション成功時のアニメーション
  - _Requirements: 6.5, 7.1, 7.4_

- [ ] 14. フロントエンドのビルドとデプロイ
  - pnpm buildでプロダクションビルドを作成
  - ビルドエラーがないことを確認
  - Vercel / Netlify / GitHub Pagesにデプロイ
  - 環境変数を設定（VITE_SUI_NETWORK, VITE_PACKAGE_ID）
  - デプロイ後の動作確認
  - _Requirements: 6.1, 6.3, 6.4, 7.1_

- [ ] 15. エンドツーエンドテストと最終確認
  - Sui Testnetでの実際の支援フローをテスト
  - ウォレット接続 → 支援実行 → NFT発行 → NFT表示の一連の流れを確認
  - 30日後の分配機能をテスト（テスト用に短い間隔で実行）
  - 限定コンテンツアクセス制御をテスト
  - エラーケースをテスト（残高不足、上限超過、権限なし）
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 4.1, 4.2, 4.3, 6.4, 8.1, 8.2, 8.3_

## Notes

- タスク2.4、3.5、3.6はオプションです（*マーク付き）。ハッカソンの時間制約を考慮し、コア機能の実装を優先してください。
- 各タスクは前のタスクの成果物を基に構築されるため、順番に実行することを推奨します。
- デプロイ後のPackage IDとObject IDは必ず記録し、フロントエンドの環境変数に設定してください。
- Lit Protocol統合（タスク11）は時間があれば実装してください。コア機能ではないため、後回しにしても問題ありません。
