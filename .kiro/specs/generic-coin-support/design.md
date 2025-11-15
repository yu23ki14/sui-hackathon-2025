# Design Document: Generic Coin Support for DaoPool

## Overview

このドキュメントは、Champion TogetherのDaoPoolコントラクトをジェネリック型パラメータに対応させるリファクタリングの設計を定義します。現在のコントラクトは独自の`USDC`型を使用していますが、これを`<T>`型パラメータに置き換えることで、任意のSuiコイン型（USDC、SUI、その他のトークン）で動作するようにします。

## Architecture

### 現在のアーキテクチャ

```
DaoPoolState {
    treasury: Balance<USDC>  // 固定型
}

support(payment: Coin<USDC>) // 固定型
distribute() // USDC型を前提
```

### 新しいアーキテクチャ

```
DaoPoolState<T> {
    treasury: Balance<T>  // ジェネリック型
}

support<T>(payment: Coin<T>) // 任意のコイン型
distribute<T>() // 型パラメータを保持
```

### 型パラメータの伝播

```
Module Level
    ↓
DaoPoolState<T>
    ↓
Functions: support<T>, distribute<T>, etc.
    ↓
Balance<T> / Coin<T> operations
```

## Components and Interfaces

### 1. DaoPoolState構造体

**変更前:**
```move
public struct DaoPoolState has key {
    id: UID,
    // ... other fields
    treasury: Balance<USDC>,
}
```

**変更後:**
```move
public struct DaoPoolState<phantom T> has key {
    id: UID,
    // ... other fields
    treasury: Balance<T>,
}
```

**設計上の決定:**
- `phantom T`を使用: `T`は`treasury`フィールドでのみ使用され、他のフィールドには影響しない
- `phantom`により、型パラメータが実際に値として使用されない場合でも型安全性を保証

### 2. init_pool関数

**変更前:**
```move
public fun init_pool(
    // ... parameters
    ctx: &mut TxContext
): DaoPoolState
```

**変更後:**
```move
public fun init_pool<T>(
    // ... parameters
    ctx: &mut TxContext
): DaoPoolState<T>
```

**実装詳細:**
```move
DaoPoolState<T> {
    id: object::new(ctx),
    // ... other fields
    treasury: balance::zero<T>(),
}
```

### 3. init関数（モジュール初期化）

**変更前:**
```move
fun init(ctx: &mut TxContext) {
    let state = DaoPoolState {
        // ...
        treasury: balance::zero<USDC>(),
    };
    transfer::share_object(state);
}
```

**変更後:**
```move
fun init(ctx: &mut TxContext) {
    // デフォルトでSUI型を使用
    let state = DaoPoolState<SUI> {
        // ...
        treasury: balance::zero<SUI>(),
    };
    transfer::share_object(state);
}
```

**設計上の決定:**
- `init`関数はジェネリック型パラメータを受け取れないため、デフォルト型を指定
- SUI型をデフォルトとして使用（最も一般的で、テストが容易）
- 実際の運用では、`init_pool`を使って特定の型でプールを作成

### 4. support関数

**変更前:**
```move
public entry fun support(
    state: &mut DaoPoolState,
    nft_state: &mut MembersNFTState,
    payment: Coin<USDC>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**変更後:**
```move
public entry fun support<T>(
    state: &mut DaoPoolState<T>,
    nft_state: &mut MembersNFTState,
    payment: Coin<T>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**実装詳細:**
```move
let amount = coin::value(&payment);
let payment_balance = coin::into_balance(payment);
balance::join(&mut state.treasury, payment_balance);
```

**型の流れ:**
1. `payment: Coin<T>` → 入力
2. `coin::into_balance(payment)` → `Balance<T>`に変換
3. `balance::join(&mut state.treasury, payment_balance)` → `Balance<T>`同士を結合

### 5. distribute関数

**変更前:**
```move
public entry fun distribute(
    state: &mut DaoPoolState,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**変更後:**
```move
public entry fun distribute<T>(
    state: &mut DaoPoolState<T>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**実装詳細:**
```move
// Balance<T>から分割
let fighter_balance = balance::split(&mut state.treasury, fighter_amount);
// Balance<T>をCoin<T>に変換
let fighter_coin = coin::from_balance(fighter_balance, ctx);
// Coin<T>を転送
transfer::public_transfer(fighter_coin, state.fighter_address);
```

**型の流れ:**
1. `state.treasury: Balance<T>` → 元の残高
2. `balance::split<T>()` → `Balance<T>`を分割
3. `coin::from_balance<T>()` → `Coin<T>`に変換
4. `transfer::public_transfer<T>()` → 転送

### 6. distribute_bonus関数

**変更後:**
```move
public entry fun distribute_bonus<T>(
    state: &mut DaoPoolState<T>,
    bonus_amount: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**実装:** `distribute`関数と同様の型変換パターンを使用

### 7. change_distribution_detail関数

**変更後:**
```move
public entry fun change_distribution_detail<T>(
    state: &mut DaoPoolState<T>,
    // ... other parameters
)
```

**設計上の決定:**
- 型パラメータは必要だが、実際には`treasury`フィールドにアクセスしない
- 型の一貫性を保つために`<T>`を追加

### 8. ビュー関数

**変更前:**
```move
public fun total_raised(state: &DaoPoolState): u64
public fun treasury_balance(state: &DaoPoolState): u64
```

**変更後:**
```move
public fun total_raised<T>(state: &DaoPoolState<T>): u64
public fun treasury_balance<T>(state: &DaoPoolState<T>): u64
```

**実装詳細:**
```move
public fun treasury_balance<T>(state: &DaoPoolState<T>): u64 {
    balance::value(&state.treasury)
}
```

## Data Models

### DaoPoolState<T>

```move
public struct DaoPoolState<phantom T> has key {
    id: UID,
    total_raised: u64,
    support_cap: u64,
    last_distribution: u64,
    distribution_interval: u64,
    fighter_address: address,
    gym_address: address,
    organizer_address: address,
    fighter_ratio: u64,
    gym_ratio: u64,
    organizer_ratio: u64,
    treasury: Balance<T>,  // ジェネリック型
}
```

### 型制約

- `T`: 任意のコイン型（`Coin<T>`として使用可能な型）
- `phantom`: `T`は`treasury`フィールドでのみ使用される
- 型安全性: コンパイル時に型の一致を保証

## CLI Usage

### コイン型の指定方法

Sui CLIでジェネリック関数を呼び出す際は、`--type-args`パラメータを使用：

```bash
# USDC型で支援
sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function support \
    --type-args "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC" \
    --args $DAO_POOL_STATE $NFT_STATE $USDC_COIN $CLOCK \
    --gas-budget $GAS_BUDGET

# SUI型で支援
sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function support \
    --type-args "0x2::sui::SUI" \
    --args $DAO_POOL_STATE $NFT_STATE $SUI_COIN $CLOCK \
    --gas-budget $GAS_BUDGET
```

### 型の自動検出

テストスクリプトでは、コインオブジェクトから型を自動検出：

```bash
# コインオブジェクトの型を取得
COIN_TYPE=$(sui client object $COIN_ID --json | jq -r '.data.type' | sed 's/0x2::coin::Coin<\(.*\)>/\1/')

# 型を指定して関数呼び出し
sui client call \
    --type-args "$COIN_TYPE" \
    --args ...
```

## Error Handling

### TypeMismatch エラー

**原因:**
- DaoPoolStateの型パラメータと、提供されたコインの型が一致しない
- 例: `DaoPoolState<SUI>`に`Coin<USDC>`を渡す

**解決策:**
```bash
# DaoPoolStateの型を確認
sui client object $DAO_POOL_STATE --json | jq '.data.type'
# 出力例: "0x...::dao_pool::DaoPoolState<0x2::sui::SUI>"

# 同じ型のコインを使用
sui client call --type-args "0x2::sui::SUI" ...
```

### 型の不一致を防ぐ設計

1. **型の明示:** 常に`--type-args`で型を指定
2. **型の検証:** スクリプトでコイン型とプール型を比較
3. **エラーメッセージ:** 明確なエラーメッセージを提供

## Testing Strategy

### 1. 単体テスト

```move
#[test]
fun test_support_with_sui() {
    // SUI型でテスト
    let state = init_pool<SUI>(...);
    let payment = coin::mint_for_testing<SUI>(100, ctx);
    support<SUI>(&mut state, &mut nft_state, payment, &clock, ctx);
}

#[test]
fun test_support_with_custom_coin() {
    // カスタムコイン型でテスト
    let state = init_pool<TestCoin>(...);
    let payment = coin::mint_for_testing<TestCoin>(100, ctx);
    support<TestCoin>(&mut state, &mut nft_state, payment, &clock, ctx);
}
```

### 2. 統合テスト（Testnet）

```bash
# USDCでテスト
./test_support.sh --coin-type USDC

# SUIでテスト
./test_support.sh --coin-type SUI
```

### 3. 型安全性テスト

```move
#[test]
#[expected_failure]
fun test_type_mismatch() {
    let state = init_pool<SUI>(...);
    let payment = coin::mint_for_testing<USDC>(100, ctx);
    // これはコンパイルエラーになるべき
    support<SUI>(&mut state, &mut nft_state, payment, &clock, ctx);
}
```

## Migration Strategy

### フェーズ1: コントラクトの更新

1. `dao_pool.move`にジェネリック型パラメータを追加
2. すべての関数シグネチャを更新
3. `balance::zero<T>()`等の型パラメータを追加

### フェーズ2: ビルドとテスト

1. `sui move build`でコンパイル
2. 型エラーを修正
3. 単体テストを実行

### フェーズ3: デプロイ

1. Testnetに新しいパッケージをデプロイ
2. SUI型でDaoPoolStateを初期化
3. 動作確認

### フェーズ4: スクリプトの更新

1. `test_support.sh`に`--type-args`を追加
2. コイン型の自動検出機能を実装
3. エラーハンドリングを改善

### フェーズ5: ドキュメント更新

1. README.mdにジェネリック型の使用方法を追加
2. トラブルシューティングガイドを作成
3. サンプルコマンドを更新

## Performance Considerations

### ジェネリック型のオーバーヘッド

- **コンパイル時:** 型ごとに関数が生成される（モノモーフィゼーション）
- **実行時:** オーバーヘッドなし（型情報は実行時に存在しない）
- **ストレージ:** `DaoPoolState<SUI>`と`DaoPoolState<USDC>`は別のオブジェクト型

### 最適化

- `phantom`キーワードを使用して不要な型制約を回避
- 型パラメータは必要な場所でのみ使用

## Security Considerations

### 型安全性

- コンパイル時に型の一致を保証
- 異なる型のコインを誤って混在させることを防止
- `phantom`により、型パラメータの誤用を防止

### 型の検証

```move
// 型パラメータが一致しない場合、コンパイルエラー
support<SUI>(&mut state_usdc, ...); // エラー: 型の不一致
```

### ランタイムチェック

- Sui VMが型の一致を実行時にも検証
- 型の不一致は`TypeMismatch`エラーとして報告

## Backward Compatibility

### 既存のコードへの影響

- **破壊的変更:** すべての関数シグネチャが変更される
- **マイグレーション必要:** 既存のDaoPoolStateオブジェクトは新しい型と互換性なし
- **新規デプロイ:** 新しいパッケージとして再デプロイが必要

### 移行パス

1. 新しいパッケージをデプロイ
2. 新しいDaoPoolStateオブジェクトを作成
3. 古いプールからの資金移行（手動）
4. フロントエンドを新しいパッケージIDに更新

## Documentation Requirements

### コード内ドキュメント

```move
/// 支援関数 - 任意のコイン型での貢献を受け付ける
/// 
/// # Type Parameters
/// * `T` - コイン型（例: `0x2::sui::SUI`, `0x...::usdc::USDC`）
/// 
/// # Arguments
/// * `state` - DaoPoolState<T>への可変参照
/// * `payment` - 支援するCoin<T>
/// 
/// # Examples
/// ```
/// // SUIで支援
/// support<SUI>(&mut state, &mut nft_state, sui_coin, &clock, ctx);
/// 
/// // USDCで支援
/// support<USDC>(&mut state, &mut nft_state, usdc_coin, &clock, ctx);
/// ```
public entry fun support<T>(...)
```

### README更新

- ジェネリック型の概念説明
- CLI使用例
- トラブルシューティング
- サポートされるコイン型のリスト

## Future Enhancements

### マルチコイン対応

現在の設計では、1つのDaoPoolStateは1つのコイン型のみをサポート。将来的には：

```move
public struct MultiCoinDaoPoolState has key {
    treasuries: VecMap<TypeName, Balance<T>>,  // 複数のコイン型を保持
}
```

### 自動型変換

異なるコイン型間の自動変換（DEX統合）：

```move
public entry fun support_with_conversion<From, To>(
    state: &mut DaoPoolState<To>,
    payment: Coin<From>,
    dex: &mut DEX,
    ...
)
```

### 型レジストリ

サポートされるコイン型のホワイトリスト：

```move
public struct CoinRegistry has key {
    allowed_types: VecSet<TypeName>,
}
```
