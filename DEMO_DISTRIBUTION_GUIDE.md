# デモビデオ用 分配期限変更ガイド

## 変更内容

`change_distribution_detail` 関数に新しいパラメータ `new_distribution_interval` を追加しました。これにより、主催者（organizer）が分配間隔を動的に変更できるようになります。

## コントラクトの変更点

### dao_pool.move
- `change_distribution_detail` 関数に `new_distribution_interval: Option<u64>` パラメータを追加
- 分配間隔をミリ秒単位で設定可能（例: 60000 = 1分）

### フロントエンド (useDistributionSettings.ts)
- `updateSettings` 関数で `periodDays` を自動的にミリ秒に変換
- 新しいパラメータをトランザクションに追加

## デプロイ手順

### 1. コントラクトをビルド
```bash
cd contract
sui move build
```

### 2. コントラクトをデプロイ（Testnet）
```bash
sui client publish --gas-budget 100000000
```

### 3. 新しいPackage IDとオブジェクトIDを取得
デプロイ後、以下の情報をメモしてください：
- Package ID
- DaoPoolState オブジェクトID
- MembersNFTState オブジェクトID

### 4. フロントエンドの環境変数を更新
`frontend/.env.local` を更新：
```bash
VITE_PACKAGE_ID=<新しいPackage ID>
VITE_DAO_CONTRACT_ADDRESS=<新しいDaoPoolState ID>
VITE_MEMBERS_NFT_CONTRACT_ADDRESS=<新しいMembersNFTState ID>
```

## デモビデオ撮影時の使用方法

### 方法1: フロントエンドから変更（推奨）

1. 主催者アカウントでログイン
2. Distribution Settings画面を開く
3. "Period (days)" を短い値に変更（例: 0.0007 = 約1分）
4. "Update Settings" ボタンをクリック

### 方法2: Sui CLIから直接変更

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dao_pool \
  --function change_distribution_detail \
  --args \
    <DAO_POOL_STATE_ID> \
    "[]" \
    "[]" \
    "[]" \
    "[]" \
    "[]" \
    "[]" \
    "[60000]" \
    "0x6" \
  --type-args "0x2::sui::SUI" \
  --gas-budget 10000000
```

パラメータ説明：
- `[]` = None（変更しない）
- `[60000]` = Some(60000) = 60秒 = 1分

## 分配間隔の例

| 期間 | ミリ秒 | periodDays |
|------|--------|------------|
| 1分 | 60,000 | 0.0007 |
| 5分 | 300,000 | 0.0035 |
| 10分 | 600,000 | 0.007 |
| 1時間 | 3,600,000 | 0.042 |
| 1日 | 86,400,000 | 1 |
| 30日 | 2,592,000,000 | 30 |

## デモ撮影の流れ

1. **初期設定**: 分配間隔を1分に設定
2. **支援**: 支援者が資金をデポジット
3. **待機**: 1分待つ
4. **分配実行**: "Distribute Now" ボタンをクリック
5. **確認**: 各受取人の残高が更新されたことを確認

## トラブルシューティング

### エラー: E_DISTRIBUTION_TOO_EARLY (3)
- 分配間隔がまだ経過していません
- 設定した時間が経過するまで待つか、分配間隔をさらに短く設定してください

### エラー: E_UNAUTHORIZED (5)
- 主催者アカウントでログインしていることを確認してください
- `.env.local` の `VITE_ORGANIZER_ADDRESS` が正しいことを確認してください

### エラー: E_EMPTY_TREASURY (4)
- トレジャリーに資金がありません
- 先に支援（support）を実行してください

## 注意事項

- この機能は本番環境でも使用できますが、デモ用に極端に短い間隔を設定する場合は注意してください
- 分配間隔を変更しても、`last_distribution` タイムスタンプは変更されません
- 次回の分配可能時刻は `last_distribution + distribution_interval` で計算されます
