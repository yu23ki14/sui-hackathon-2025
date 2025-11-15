# Champion Together - Smart Contract Specification

This document provides a comprehensive specification of all public functions in the Champion Together smart contracts.

---

## Table of Contents

1. [DaoPool Module](#daopool-module)
   - [State Management Functions](#state-management-functions)
   - [Core Operations](#core-operations)
   - [View Functions](#view-functions)
2. [MemberNFT Module](#membernft-module)
   - [Initialization Functions](#initialization-functions)
   - [Minting Functions](#minting-functions)
   - [NFT Query Functions](#nft-query-functions)
   - [Helper Functions](#helper-functions)

---

## DaoPool Module

**Module Path**: `champion_together::dao_pool`

The DaoPool module manages funding collection, automatic distribution to stakeholders (fighter, gym, organizer), and configuration updates.

### State Management Functions

#### `init_pool`

Creates a new DaoPoolState with specified parameters.

```move
public fun init_pool(
    fighter_address: address,
    gym_address: address,
    organizer_address: address,
    fighter_ratio: u64,
    gym_ratio: u64,
    organizer_ratio: u64,
    clock: &Clock,
    ctx: &mut TxContext
): DaoPoolState
```

**Parameters**:
- `fighter_address`: Wallet address of the fighter
- `gym_address`: Wallet address of the gym
- `organizer_address`: Wallet address of the organizer
- `fighter_ratio`: Fighter's distribution percentage (e.g., 60 for 60%)
- `gym_ratio`: Gym's distribution percentage (e.g., 30 for 30%)
- `organizer_ratio`: Organizer's distribution percentage (e.g., 10 for 10%)
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Returns**: `DaoPoolState` object

**Requirements**:
- `fighter_ratio + gym_ratio + organizer_ratio` must equal 100

**Note**: This function is typically not called directly. The `init()` function automatically creates a shared DaoPoolState when the package is deployed.

---

### Core Operations

#### `support`

Accepts USDC contributions from supporters, adds to treasury, and mints a membership NFT.

```move
public entry fun support(
    state: &mut DaoPoolState,
    nft_state: &mut MembersNFTState,
    payment: Coin<USDC>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters**:
- `state`: Mutable reference to the shared DaoPoolState object
- `nft_state`: Mutable reference to the shared MembersNFTState object
- `payment`: USDC coin for payment (in micro-USDC, 6 decimals)
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Effects**:
- Adds USDC to treasury
- Updates `total_raised`
- Emits `SupportEvent`
- Automatically mints a MemberNFT to the supporter based on contribution amount

**Requirements**:
- Payment amount must be > 0
- `total_raised + amount` must not exceed `support_cap` (default: 3,000 USDC)
- Payment amount must be >= 10 USDC (minimum for Bronze tier)

**Example Usage**:
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::support`,
  arguments: [
    tx.object(DAO_POOL_STATE),
    tx.object(NFT_STATE),
    tx.object(usdcCoinId),
    tx.object('0x6'),
  ],
});
```

---

#### `distribute`

Distributes treasury funds to recipients based on configured ratios.

```move
public entry fun distribute(
    state: &mut DaoPoolState,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters**:
- `state`: Mutable reference to the shared DaoPoolState object
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Effects**:
- Splits treasury funds according to ratios
- Transfers USDC to fighter, gym, and organizer addresses
- Resets `total_raised` to 0
- Updates `last_distribution` timestamp
- Emits `DistributionEvent`

**Requirements**:
- Current time must be >= `last_distribution + distribution_interval` (default: 30 days)
- Treasury balance must be > 0

**Example Usage**:
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::distribute`,
  arguments: [
    tx.object(DAO_POOL_STATE),
    tx.object('0x6'),
  ],
});
```

---

#### `distribute_bonus`

Distributes a victory bonus from the treasury to recipients. Only callable by the organizer.

```move
public entry fun distribute_bonus(
    state: &mut DaoPoolState,
    bonus_amount: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters**:
- `state`: Mutable reference to the shared DaoPoolState object
- `bonus_amount`: Amount to distribute in micro-USDC
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Effects**:
- Splits bonus amount according to ratios
- Transfers USDC to fighter, gym, and organizer addresses
- Emits `BonusDistributionEvent`

**Requirements**:
- Caller must be the current organizer
- Treasury balance must be >= bonus_amount
- Can be called at any time (no interval restriction)

**Example Usage**:
```typescript
// Distribute 100 USDC victory bonus
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::distribute_bonus`,
  arguments: [
    tx.object(DAO_POOL_STATE),
    tx.pure.u64(100_000_000), // 100 USDC
    tx.object('0x6'),
  ],
});
```

---

#### `change_distribution_detail`

Updates recipient addresses and/or distribution ratios. Only callable by the organizer.

```move
public entry fun change_distribution_detail(
    state: &mut DaoPoolState,
    new_fighter_address: Option<address>,
    new_gym_address: Option<address>,
    new_organizer_address: Option<address>,
    new_fighter_ratio: Option<u64>,
    new_gym_ratio: Option<u64>,
    new_organizer_ratio: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters**:
- `state`: Mutable reference to the shared DaoPoolState object
- `new_fighter_address`: Optional new fighter address
- `new_gym_address`: Optional new gym address
- `new_organizer_address`: Optional new organizer address
- `new_fighter_ratio`: Optional new fighter percentage
- `new_gym_ratio`: Optional new gym percentage
- `new_organizer_ratio`: Optional new organizer percentage
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Effects**:
- Updates specified addresses and/or ratios
- Emits `ConfigChangeEvent`

**Requirements**:
- Caller must be the current organizer
- If ratios are updated, their sum must equal 100

**Example Usage**:
```typescript
// Update fighter address only
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::change_distribution_detail`,
  arguments: [
    tx.object(DAO_POOL_STATE),
    tx.pure.option('address', newFighterAddress),
    tx.pure.option('address', null),
    tx.pure.option('address', null),
    tx.pure.option('u64', null),
    tx.pure.option('u64', null),
    tx.pure.option('u64', null),
    tx.object('0x6'),
  ],
});
```

---

### View Functions

All view functions are read-only and do not modify state.

#### `total_raised`

Returns the total amount raised in the current distribution cycle.

```move
public fun total_raised(state: &DaoPoolState): u64
```

**Returns**: Total raised amount in micro-USDC

---

#### `support_cap`

Returns the support cap limit.

```move
public fun support_cap(state: &DaoPoolState): u64
```

**Returns**: Support cap in micro-USDC (default: 3,000,000,000)

---

#### `treasury_balance`

Returns the current treasury balance.

```move
public fun treasury_balance(state: &DaoPoolState): u64
```

**Returns**: Treasury balance in micro-USDC

---

#### `last_distribution`

Returns the timestamp of the last distribution.

```move
public fun last_distribution(state: &DaoPoolState): u64
```

**Returns**: Unix timestamp in milliseconds

---

#### `distribution_interval`

Returns the distribution interval in milliseconds.

```move
public fun distribution_interval(state: &DaoPoolState): u64
```

**Returns**: Interval in milliseconds (default: 2,592,000,000 = 30 days)

---

#### `fighter_address`

Returns the fighter's wallet address.

```move
public fun fighter_address(state: &DaoPoolState): address
```

**Returns**: Fighter's address

---

#### `gym_address`

Returns the gym's wallet address.

```move
public fun gym_address(state: &DaoPoolState): address
```

**Returns**: Gym's address

---

#### `organizer_address`

Returns the organizer's wallet address.

```move
public fun organizer_address(state: &DaoPoolState): address
```

**Returns**: Organizer's address

---

#### `distribution_ratios`

Returns all distribution ratios as a tuple.

```move
public fun distribution_ratios(state: &DaoPoolState): (u64, u64, u64)
```

**Returns**: `(fighter_ratio, gym_ratio, organizer_ratio)`

---

#### `is_admin`

Checks if the specified address is the organizer (admin).

```move
public fun is_admin(state: &DaoPoolState, user: address): bool
```

**Parameters**:
- `state`: Reference to the DaoPoolState
- `user`: Address to check

**Returns**: `true` if user is the organizer, `false` otherwise

**Example Usage**:
```typescript
const isAdmin = await client.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: userAddress,
});
// Use result to show/hide admin UI
```

---

#### `get_distribution_config`

Returns all distribution settings in a single call for improved efficiency.

```move
public fun get_distribution_config(state: &DaoPoolState): DistributionConfig
```

**Returns**: `DistributionConfig` struct containing:
- `support_cap`: Support cap in micro-USDC
- `last_distribution`: Last distribution timestamp
- `distribution_interval`: Distribution interval in milliseconds
- `fighter_address`: Fighter's wallet address
- `gym_address`: Gym's wallet address
- `organizer_address`: Organizer's wallet address
- `fighter_ratio`: Fighter's percentage
- `gym_ratio`: Gym's percentage
- `organizer_ratio`: Organizer's percentage

**Benefits**: Reduces frontend RPC calls from 9 to 1

**Example Usage**:
```typescript
const config = await client.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: address,
});
// Access all settings at once
console.log(config.support_cap, config.fighter_ratio, etc.);
```

---

## MemberNFT Module

**Module Path**: `champion_together::member_nft`

The MemberNFT module manages membership NFTs that are minted for supporters based on their contribution amounts.

### Initialization Functions

#### `init_nft_state`

Creates a new MembersNFTState.

```move
public fun init_nft_state(
    ctx: &mut TxContext
): MembersNFTState
```

**Parameters**:
- `ctx`: Transaction context

**Returns**: `MembersNFTState` object

**Note**: This function is typically not called directly. The `init()` function automatically creates a shared MembersNFTState when the package is deployed.

---

### Minting Functions

#### `mint`

Mints a new MemberNFT for a supporter. Called internally by `dao_pool::support()`.

```move
public fun mint(
    state: &mut MembersNFTState,
    support_amount: u64,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters**:
- `state`: Mutable reference to MembersNFTState
- `support_amount`: Support amount in micro-USDC
- `recipient`: Address to receive the NFT
- `clock`: Reference to the Sui Clock object (0x6)
- `ctx`: Transaction context

**Effects**:
- Increments token counter
- Creates a new MemberNFT with rank based on support amount:
  - **Bronze**: 10-49 USDC
  - **Silver**: 50-99 USDC
  - **Gold**: 100-199 USDC
  - **Platinum**: 200+ USDC
- Transfers NFT to recipient
- Emits `MintEvent`

**Requirements**:
- `support_amount` must be >= 10 USDC (10,000,000 micro-USDC)

---

#### `mint_entry`

Entry function version of `mint()`. Can be called directly from transactions.

```move
public entry fun mint_entry(
    state: &mut MembersNFTState,
    support_amount: u64,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext
)
```

Same parameters and behavior as `mint()`.

---

### NFT Query Functions

#### `owner_of`

Returns the owner address of an NFT.

```move
public fun owner_of(_nft: &MemberNFT, ctx: &TxContext): address
```

**Parameters**:
- `_nft`: Reference to the MemberNFT
- `ctx`: Transaction context

**Returns**: Owner's address

---

#### `token_id`

Returns the unique token ID.

```move
public fun token_id(nft: &MemberNFT): u64
```

**Returns**: Token ID

---

#### `support_amount`

Returns the support amount associated with the NFT.

```move
public fun support_amount(nft: &MemberNFT): u64
```

**Returns**: Support amount in micro-USDC

---

#### `get_rank`

Returns the membership rank.

```move
public fun get_rank(nft: &MemberNFT): String
```

**Returns**: Rank as string ("Bronze", "Silver", "Gold", or "Platinum")

---

#### `minted_at`

Returns the minting timestamp.

```move
public fun minted_at(nft: &MemberNFT): u64
```

**Returns**: Unix timestamp in milliseconds

---

#### `image_url`

Returns the NFT image URL.

```move
public fun image_url(nft: &MemberNFT): String
```

**Returns**: Image URL as string

---

#### `total_supply`

Returns the total number of NFTs minted.

```move
public fun total_supply(state: &MembersNFTState): u64
```

**Returns**: Total supply count

---

### Helper Functions

#### `get_metadata`

Returns all NFT metadata in a single call.

```move
public fun get_metadata(nft: &MemberNFT): NFTMetadata
```

**Returns**: `NFTMetadata` struct containing:
- `token_id`: Token ID
- `support_amount`: Support amount
- `rank`: Membership rank
- `minted_at`: Minting timestamp
- `image_url`: Image URL

**Example Usage**:
```typescript
const metadata = await client.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: address,
});
// metadata contains all NFT information
```

---

#### `get_basic_info`

Returns basic NFT information as a tuple.

```move
public fun get_basic_info(nft: &MemberNFT): (u64, String, u64)
```

**Returns**: `(token_id, rank, support_amount)`

---

#### `has_rank_or_higher`

Checks if the NFT has a specified rank or higher. Useful for access control with Lit Protocol.

```move
public fun has_rank_or_higher(nft: &MemberNFT, required_rank: String): bool
```

**Parameters**:
- `nft`: Reference to the MemberNFT
- `required_rank`: Required rank as string ("Bronze", "Silver", "Gold", or "Platinum")

**Returns**: `true` if NFT rank is equal to or higher than required rank

**Rank Hierarchy**: Platinum > Gold > Silver > Bronze

**Example Usage**:
```move
// Check if user has Gold or higher
let has_access = member_nft::has_rank_or_higher(&nft, string::utf8(b"Gold"));
```

---

#### `rank_display_name`

Returns the rank as a display string.

```move
public fun rank_display_name(nft: &MemberNFT): String
```

**Returns**: Rank string

---

### NFTMetadata Accessor Functions

These functions extract individual fields from an `NFTMetadata` struct.

#### `metadata_token_id`
```move
public fun metadata_token_id(metadata: &NFTMetadata): u64
```

#### `metadata_support_amount`
```move
public fun metadata_support_amount(metadata: &NFTMetadata): u64
```

#### `metadata_rank`
```move
public fun metadata_rank(metadata: &NFTMetadata): String
```

#### `metadata_minted_at`
```move
public fun metadata_minted_at(metadata: &NFTMetadata): u64
```

#### `metadata_image_url`
```move
public fun metadata_image_url(metadata: &NFTMetadata): String
```

---

## Events

### DaoPool Events

#### `SupportEvent`
Emitted when a supporter makes a contribution.

```move
public struct SupportEvent has copy, drop {
    supporter: address,
    amount: u64,
    timestamp: u64,
}
```

#### `DistributionEvent`
Emitted when funds are distributed.

```move
public struct DistributionEvent has copy, drop {
    total_amount: u64,
    fighter_amount: u64,
    gym_amount: u64,
    organizer_amount: u64,
    timestamp: u64,
}
```

#### `ConfigChangeEvent`
Emitted when configuration is updated.

```move
public struct ConfigChangeEvent has copy, drop {
    changed_by: address,
    timestamp: u64,
}
```

#### `BonusDistributionEvent`
Emitted when a victory bonus is distributed.

```move
public struct BonusDistributionEvent has copy, drop {
    bonus_amount: u64,
    fighter_amount: u64,
    gym_amount: u64,
    organizer_amount: u64,
    timestamp: u64,
}
```

### MemberNFT Events

#### `MintEvent`
Emitted when an NFT is minted.

```move
public struct MintEvent has copy, drop {
    token_id: u64,
    recipient: address,
    support_amount: u64,
    rank: String,
    timestamp: u64,
}
```

---

## Constants

Refer to `utils_constants` module for system constants:
- `DEFAULT_SUPPORT_CAP`: 3,000,000,000 (3,000 USDC)
- `DEFAULT_DISTRIBUTION_INTERVAL`: 2,592,000 (30 days in seconds)
- `BRONZE_MIN`: 10,000,000 (10 USDC)
- `SILVER_MIN`: 50,000,000 (50 USDC)
- `GOLD_MIN`: 100,000,000 (100 USDC)
- `PLATINUM_MIN`: 200,000,000 (200 USDC)

---

## Error Codes

Refer to `utils_errors` module for error codes:
- `E_UNAUTHORIZED_MINTER`: Unauthorized minter
- `E_INVALID_SUPPORT_AMOUNT`: Invalid support amount
- `E_INVALID_RANK`: Invalid rank

DaoPool module error codes:
- `E_SUPPORT_CAP_REACHED`: Support cap reached
- `E_INSUFFICIENT_AMOUNT`: Insufficient amount
- `E_DISTRIBUTION_TOO_EARLY`: Distribution too early
- `E_EMPTY_TREASURY`: Treasury is empty
- `E_UNAUTHORIZED`: Unauthorized caller
- `E_INVALID_RATIO`: Invalid distribution ratio

---

## Integration Examples

### Support Flow (TypeScript)

```typescript
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

const PACKAGE_ID = '0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed';
const DAO_POOL_STATE = '0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f';
const NFT_STATE = '0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51';

async function supportFighter(usdcCoinId: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao_pool::support`,
    arguments: [
      tx.object(DAO_POOL_STATE),
      tx.object(NFT_STATE),
      tx.object(usdcCoinId),
      tx.object('0x6'),
    ],
  });

  return tx;
}

// Bonus distribution example
async function distributeBonusExample() {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao_pool::distribute_bonus`,
    arguments: [
      tx.object(DAO_POOL_STATE),
      tx.pure.u64(100_000_000), // 100 USDC
      tx.object('0x6'),
    ],
  });

  return tx;
}

// Check admin status
async function checkAdminStatus(client: SuiClient, userAddress: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao_pool::is_admin`,
    arguments: [
      tx.object(DAO_POOL_STATE),
      tx.pure.address(userAddress),
    ],
  });

  const result = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: userAddress,
  });

  return result;
}
```

### Query NFT Metadata (TypeScript)

```typescript
async function getNFTMetadata(client: SuiClient, nftId: string) {
  const object = await client.getObject({
    id: nftId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  return object.data?.content;
}
```

### Check Access Level (Move)

```move
public fun check_gold_access(nft: &MemberNFT): bool {
    member_nft::has_rank_or_higher(nft, string::utf8(b"Gold"))
}
```

---

## Notes

- All USDC amounts are in **micro-USDC** (6 decimals). 1 USDC = 1,000,000 micro-USDC
- Timestamps are in **milliseconds** (Unix time)
- Distribution ratios are **percentages** (60 = 60%)
- Both `DaoPoolState` and `MembersNFTState` are **shared objects** accessible by anyone
- The Clock object address on Sui is always `0x6`

---

## See Also

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment information and addresses
- [design.md](./.kiro/specs/champion-together/design.md) - System design
- [requirements.md](./.kiro/specs/champion-together/requirements.md) - Requirements specification
