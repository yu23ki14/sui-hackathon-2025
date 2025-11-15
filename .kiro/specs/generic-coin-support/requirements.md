# Requirements Document

## Introduction

Champion Togetherプラットフォームのスマートコントラクトを、任意のコイン型（USDC、SUI、その他のトークン）で動作するようにリファクタリングします。現在、コントラクトは独自の`USDC`型を使用しているため、実際のTestnet USDCや他のトークンと互換性がありません。ジェネリック型パラメータを導入することで、柔軟性と実用性を向上させます。

## Glossary

- **DaoPool**: 支援金を管理し、格闘家、ジム、主催者への自動分配を行うスマートコントラクト
- **MembersNFT**: 支援者に発行される記念NFTを管理するスマートコントラクト
- **Generic Type Parameter**: Moveのジェネリック型パラメータ（`<T>`）。任意のコイン型を受け入れる
- **Coin Type**: Sui上のコイン型（例: `0x2::sui::SUI`, `0xa1ec...::usdc::USDC`）
- **Treasury**: DaoPoolStateが保持するコイン残高
- **Type Mismatch**: 期待される型と実際の型が一致しないエラー

## Requirements

### Requirement 1: ジェネリック型パラメータの導入

**User Story:** As a platform developer, I want the smart contracts to accept any coin type, so that supporters can use USDC, SUI, or other tokens for contributions

#### Acceptance Criteria

1. WHEN THE DaoPool contract is deployed, THE System SHALL support any coin type through generic type parameters
2. WHEN a supporter calls the support function, THE System SHALL accept Coin<T> where T is any valid coin type
3. WHEN the treasury stores funds, THE System SHALL maintain Balance<T> for the specified coin type
4. WHEN distribution occurs, THE System SHALL transfer Coin<T> to recipients using the same type as received
5. THE System SHALL ensure type safety throughout all operations involving the coin type

### Requirement 2: DaoPoolState構造体の更新

**User Story:** As a smart contract, I want to store the coin type information in the state, so that all operations use the correct type consistently

#### Acceptance Criteria

1. WHEN DaoPoolState is created, THE System SHALL include a generic type parameter <T>
2. WHEN the treasury field is defined, THE System SHALL use Balance<T> instead of Balance<USDC>
3. WHEN state is shared, THE System SHALL preserve the type parameter information
4. THE System SHALL ensure all functions accessing DaoPoolState use the matching type parameter

### Requirement 3: support関数の更新

**User Story:** As a supporter, I want to contribute using any supported coin type, so that I have flexibility in payment methods

#### Acceptance Criteria

1. WHEN the support function is called, THE System SHALL accept payment as Coin<T>
2. WHEN payment is validated, THE System SHALL check the coin value regardless of type
3. WHEN payment is added to treasury, THE System SHALL convert Coin<T> to Balance<T> and join with existing balance
4. WHEN NFT is minted, THE System SHALL pass the amount value to the NFT contract
5. THE System SHALL emit SupportEvent with the correct amount and supporter address

### Requirement 4: distribute関数の更新

**User Story:** As the system, I want to distribute funds using the same coin type that was received, so that recipients get the correct tokens

#### Acceptance Criteria

1. WHEN distribute is called, THE System SHALL split Balance<T> according to ratios
2. WHEN creating coins for transfer, THE System SHALL convert Balance<T> to Coin<T>
3. WHEN transferring to recipients, THE System SHALL use public_transfer with Coin<T>
4. THE System SHALL handle any remaining dust in the treasury
5. THE System SHALL emit DistributionEvent with correct amounts

### Requirement 5: distribute_bonus関数の更新

**User Story:** As an organizer, I want to distribute victory bonuses using the same coin type, so that fighters receive rewards in the correct token

#### Acceptance Criteria

1. WHEN distribute_bonus is called, THE System SHALL verify the caller is the organizer
2. WHEN bonus amount is specified, THE System SHALL split Balance<T> according to ratios
3. WHEN creating bonus coins, THE System SHALL convert Balance<T> to Coin<T>
4. WHEN transferring bonuses, THE System SHALL use public_transfer with Coin<T>
5. THE System SHALL emit BonusDistributionEvent with correct amounts

### Requirement 6: init_pool関数の更新

**User Story:** As a deployer, I want to initialize the pool with a specific coin type, so that the pool operates with the intended token

#### Acceptance Criteria

1. WHEN init_pool is called, THE System SHALL accept a generic type parameter <T>
2. WHEN creating DaoPoolState, THE System SHALL initialize treasury as Balance<T>
3. WHEN initializing treasury, THE System SHALL use balance::zero<T>()
4. THE System SHALL return DaoPoolState<T> with the specified type

### Requirement 7: init関数の更新

**User Story:** As the deployment system, I want the module initialization to create a generic pool, so that the type can be specified at deployment

#### Acceptance Criteria

1. WHEN the module is published, THE System SHALL call init function
2. WHEN init creates DaoPoolState, THE System SHALL use a generic type parameter
3. WHEN sharing the object, THE System SHALL preserve type information
4. THE System SHALL initialize treasury with balance::zero for the generic type

### Requirement 8: 後方互換性の維持

**User Story:** As a developer, I want existing view functions to work with the generic type, so that queries remain functional

#### Acceptance Criteria

1. WHEN view functions are called, THE System SHALL accept DaoPoolState<T> with generic parameter
2. WHEN returning values, THE System SHALL provide correct data regardless of coin type
3. WHEN checking balances, THE System SHALL use balance::value on Balance<T>
4. THE System SHALL maintain all existing view function signatures with added type parameters

### Requirement 9: テストスクリプトの更新

**User Story:** As a tester, I want scripts to work with any coin type, so that I can test with USDC, SUI, or other tokens

#### Acceptance Criteria

1. WHEN calling support function, THE test script SHALL specify the coin type using --type-args
2. WHEN calling distribute function, THE test script SHALL specify the coin type using --type-args
3. WHEN calling distribute_bonus function, THE test script SHALL specify the coin type using --type-args
4. THE test script SHALL detect the coin type from the provided coin object
5. THE test script SHALL provide clear error messages if coin type cannot be determined

### Requirement 10: ドキュメントの更新

**User Story:** As a developer, I want clear documentation on using generic types, so that I understand how to interact with the contracts

#### Acceptance Criteria

1. THE documentation SHALL explain how to specify coin types in function calls
2. THE documentation SHALL provide examples for USDC and SUI
3. THE documentation SHALL describe the --type-args CLI parameter usage
4. THE documentation SHALL list supported coin types on Testnet
5. THE documentation SHALL include troubleshooting for TypeMismatch errors
