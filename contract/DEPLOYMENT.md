# Champion Together - Deployment Information

## Testnet Deployment (v3 - Latest)

**Deployment Date**: 2025-11-15 (Updated)
**Network**: Sui Testnet
**Deployer Address**: `0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353`

---

## Contract Information

### Package ID
```
0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed
```

### Transaction Digest
```
DBsxRRiaDzNommRApr9t5xiYg4wTnXjdJpPQ88TZARWd
```

### UpgradeCap Object ID
```
0xdc313452b04e01898cfaabf11641b9a920856d1c1d9688c9caecd25f229ae06c
```

### DaoPoolState (Shared Object)
```
0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
```

### MembersNFTState (Shared Object)
```
0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51
```

---

## Deployed Modules

1. **dao_pool** - 支援金管理と自動分配
2. **member_nft** - メンバーNFT発行と管理
3. **utils_constants** - システム定数
4. **utils_errors** - エラーコード定義

---

## Sui Explorer Links

### Package
https://testnet.suivision.xyz/package/0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed

### Transaction
https://testnet.suivision.xyz/txblock/DBsxRRiaDzNommRApr9t5xiYg4wTnXjdJpPQ88TZARWd

### DaoPoolState Object
https://testnet.suivision.xyz/object/0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f

### MembersNFTState Object
https://testnet.suivision.xyz/object/0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

---

## Frontend Configuration

### Environment Variables (.env)

```bash
# Sui Network
VITE_SUI_NETWORK=testnet

# Contract Package ID
VITE_PACKAGE_ID=0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed

# Shared State Objects
VITE_DAO_CONTRACT_ADDRESS=0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
VITE_MEMBERS_NFT_CONTRACT_ADDRESS=0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

# USDC Token Contract (update with actual testnet USDC address)
VITE_USDC_TOKEN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000

# Distribution Addresses (update with actual addresses)
VITE_FIGHTER_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_GYM_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_ORGANIZER_ADDRESS=0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353

# Lit Protocol
VITE_LIT_NETWORK=cayenne
```

---

## Usage Examples

### TypeScript/JavaScript

```typescript
// Package and State Objects
const PACKAGE_ID = "0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed";
const DAO_POOL_STATE = "0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f";
const NFT_STATE = "0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51";

// Module paths
const DAO_POOL_MODULE = `${PACKAGE_ID}::dao_pool`;
const MEMBER_NFT_MODULE = `${PACKAGE_ID}::member_nft`;

// Example: Call support function (with NFT minting)
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::support`,
  arguments: [
    tx.object(DAO_POOL_STATE),    // DaoPoolState (shared)
    tx.object(NFT_STATE),          // MembersNFTState (shared)
    tx.object(paymentCoin),        // Payment coin (USDC)
    tx.object('0x6'),              // Clock object
  ],
});

// Example: Distribute bonus (organizer only)
const bonusTx = new Transaction();
bonusTx.moveCall({
  target: `${PACKAGE_ID}::dao_pool::distribute_bonus`,
  arguments: [
    bonusTx.object(DAO_POOL_STATE),
    bonusTx.pure.u64(100_000_000),  // 100 USDC in micro-USDC
    bonusTx.object('0x6'),
  ],
});
```

### Move CLI

```bash
# View shared objects
sui client object 0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f
sui client object 0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51

# Call support function (example - requires USDC coin)
sui client call \
  --package 0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed \
  --module dao_pool \
  --function support \
  --args \
    0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f \
    0x76127268517ded02125f1c3a83de809848656ee5e5b29d238a5c4ac086d6fd51 \
    <USDC_COIN_ID> \
    0x6 \
  --gas-budget 10000000

# Distribute bonus (organizer only)
sui client call \
  --package 0xa7791e0b6d7c9ff2c00e4aff7e0a07c0578928d27d19a8f4f1d4637051a760ed \
  --module dao_pool \
  --function distribute_bonus \
  --args \
    0x3dd5b828c9211d79fb7da71f63f3d69ce2e640adb8d8e87a8ec163af05cbd14f \
    100000000 \
    0x6 \
  --gas-budget 10000000
```

---

## Testing

All 30 tests passed:
- ✅ `dao_pool` module: 11 tests
- ✅ `member_nft` module: 13 tests
- ✅ `utils_constants`: 3 tests
- ✅ `utils_errors`: 3 tests

```bash
# Run tests
sui move test
```

---

## Next Steps

1. ✅ Contracts deployed with auto-initialization
2. ✅ Shared objects created automatically
3. ⏳ Update DaoPoolState with proper addresses (use `change_distribution_detail`)
4. ⏳ Update frontend with new contract addresses
5. ⏳ Test full flow on testnet with real USDC

---

## Configuration Update Required

The DaoPoolState was initialized with default values:
- Fighter address: `0x0` (needs update)
- Gym address: `0x0` (needs update)
- Organizer address: `0x0` (needs update)
- Ratios: 60/30/10 (can be adjusted)

To update, call `change_distribution_detail()` function with proper addresses.

---

## Notes

- All contracts deployed successfully with **zero errors**
- Package is **immutable** (Version: 1)
- UpgradeCap is owned by deployer for future upgrades
- Both state objects are **shared** and accessible by anyone
- Auto-initialization makes deployment and setup much simpler

---

## Support

For issues or questions:
- Check Sui Explorer for transaction details
- Review test files for expected behavior
- See design.md and requirements.md for specifications

---

## New Features in v3

This deployment includes the following new features:

### 1. Bonus Distribution
- **Function**: `distribute_bonus()`
- **Purpose**: Allows the organizer to distribute victory bonuses at any time
- **Access**: Organizer only
- **Event**: `BonusDistributionEvent`

### 2. Admin Status Check
- **Function**: `is_admin()`
- **Purpose**: Check if an address is the organizer/admin
- **Returns**: `bool`
- **Use Case**: Frontend admin UI access control

### 3. Distribution Config Batch Query
- **Function**: `get_distribution_config()`
- **Purpose**: Get all distribution settings in a single call
- **Returns**: `DistributionConfig` struct
- **Benefits**: Reduced RPC calls, improved frontend performance

### 4. Updated Rank System
- Rank calculation now based on support amount (not NFT count)
- **Bronze**: 10+ USDC
- **Silver**: 50+ USDC
- **Gold**: 100+ USDC
- **Platinum**: 200+ USDC (new tier)

---

## Previous Deployments

### v2 (Deprecated)
Package ID: `0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c`
- Missing bonus distribution feature
- No admin check function
- No batch config query

### v1 (Deprecated)
Package ID: `0x1832d899979ae0a231f867a58501e4a7f7a7b49d02cb6844857628c37c404805`
- Required manual initialization
- Had circular dependency issues
- Not recommended for use
