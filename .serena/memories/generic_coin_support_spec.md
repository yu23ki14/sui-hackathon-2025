# Generic Coin Support Spec - ジェネリック型対応仕様

## 概要

Champion Togetherプラットフォームのスマートコントラクトを、任意のコイン型（USDC、SUI、その他のトークン）で動作するようにリファクタリングする仕様です。

## 背景と課題

### 現在の問題
- コントラクトは独自の`USDC`型を使用している
- 実際のTestnet USDCや他のトークンと互換性がない
- 支援機能を実際のトークンでテストできない

### 解決策
Moveのジェネリック型パラメータ（`<T>`）を導入して、任意のコイン型を受け入れるようにする。

## 仕様書の場所

```
.kiro/specs/generic-coin-support/
├── requirements.md  # 要件定義（10個の要件）
├── design.md        # 設計書
└── tasks.md         # 実装タスクリスト
```

## 主要な変更点

### 1. DaoPoolState構造体
```move
// 変更前
public struct DaoPoolState has key {
    id: UID,
    treasury: Balance<USDC>,
    // ...
}

// 変更後
public struct DaoPoolState<phantom T> has key {
    id: UID,
    treasury: Balance<T>,
    // ...
}
```

### 2. support関数
```move
// 変更前
public entry fun support(
    state: &mut DaoPoolState,
    payment: Coin<USDC>,
    // ...
)

// 変更後
public entry fun support<T>(
    state: &mut DaoPoolState<T>,
    payment: Coin<T>,
    // ...
)
```

### 3. distribute関数
```move
// 変更前
public entry fun distribute(
    state: &mut DaoPoolState,
    // ...
)

// 変更後
public entry fun distribute<T>(
    state: &mut DaoPoolState<T>,
    // ...
)
```

### 4. CLI呼び出し例
```bash
# 変更前
sui client call --function support --module dao_pool --package $PACKAGE_ID

# 変更後（USDC使用時）
sui client call --function support --module dao_pool --package $PACKAGE_ID \
  --type-args "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"

# 変更後（SUI使用時）
sui client call --function support --module dao_pool --package $PACKAGE_ID \
  --type-args "0x2::sui::SUI"
```

## 影響範囲

### スマートコントラクト
- ✅ `dao_pool.move`: 全関数にジェネリック型パラメータ追加
- ✅ `member_nft.move`: 影響なし（金額のみ受け取る）
- ✅ `constants.move`: 影響なし
- ✅ `errors.move`: 影響なし
- ⏳ テストコード: ジェネリック型に対応した更新が必要

### テストスクリプト
- ⏳ `test_support.sh`: --type-args追加
- ⏳ `test_usdc_support.sh`: --type-args追加
- ⏳ `test_distribution.sh`: --type-args追加
- ⏳ `test_admin.sh`: --type-args追加
- ⏳ `initialize.sh`: ジェネリック型対応

### ドキュメント
- ⏳ `CONTRACT_SPEC.md`: ジェネリック型の説明追加
- ⏳ `DEPLOYMENT_GENERIC.md`: デプロイ手順の更新
- ⏳ `README.md`: 使用例の更新

### フロントエンド
- ⏳ トランザクション構築時に型引数を指定する必要あり
- ⏳ `useSupport.ts`: 型引数の追加
- ⏳ `useDistributionExecution.ts`: 型引数の追加

## 実装タスク（tasks.mdより）

### Phase 1: コア構造の更新
1. DaoPoolState構造体にジェネリック型パラメータ追加
2. init関数とinit_pool関数の更新
3. support関数の更新
4. distribute関数の更新
5. distribute_bonus関数の更新

### Phase 2: ビュー関数の更新
6. 全てのビュー関数にジェネリック型パラメータ追加

### Phase 3: テストとスクリプトの更新
7. ユニットテストの更新
8. 統合テストの更新
9. テストスクリプトの更新（--type-args対応）

### Phase 4: ドキュメントとデプロイ
10. ドキュメントの更新
11. Testnetへの再デプロイ
12. 実際のUSDCでの動作確認

## 期待される効果

### 柔軟性の向上
- 任意のコイン型で動作可能
- USDC、SUI、その他のトークンに対応
- 将来的な拡張が容易

### 実用性の向上
- 実際のTestnet USDCで支援機能をテスト可能
- 本番環境での利用が可能に
- ユーザーが好きなトークンで支援できる

### 互換性の確保
- Sui標準のコイン型と互換性あり
- 他のDeFiプロトコルとの統合が容易

## 注意点

### 型安全性
- ジェネリック型パラメータは一度決定したら変更不可
- DaoPoolStateごとに1つのコイン型のみサポート
- 型の不一致エラーに注意

### デプロイ時の考慮事項
- デプロイ時に型引数を指定する必要がある場合あり
- 既存のデプロイ済みコントラクトとは互換性なし
- 新規デプロイが必要

### テストの重要性
- 複数のコイン型でテストを実施
- 型の不一致エラーのハンドリングを確認
- エッジケースのテスト

## 参考リンク

### Sui Testnet USDC
- Address: `0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC`
- Explorer: https://testnet.suivision.xyz/coin/0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC

### Sui SUI Token
- Address: `0x2::sui::SUI`

### Move言語ドキュメント
- Generics: https://move-language.github.io/move/generics.html
- Coin Standard: https://docs.sui.io/standards/coin

## ステータス

- **仕様書**: ✅ 完成
- **実装**: ⏳ 未着手
- **優先度**: 🔴 高（実用性向上のため最優先）
- **推定工数**: 2-3日

## 次のステップ

1. tasks.mdを確認して実装タスクを理解
2. Phase 1から順次実装
3. 各フェーズ完了後にテスト実行
4. 全フェーズ完了後にTestnetへ再デプロイ
5. 実際のUSDCで動作確認
