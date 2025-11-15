# Champion Together - Deployment Information

## Testnet Deployment

**Deployment Date**: 2025-11-15
**Network**: Sui Testnet
**Deployer Address**: `0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353`

---

## Contract Information

### Package ID
```
0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c
```

### Transaction Digest
```
ExTpZmhiLgBBZPsYH1yPeSdgebU1DkKsUydHNeWqd5L1
```

### UpgradeCap Object ID
```
0x0752146df8b8a3a05f020b7cbac44c7f9cdab2971902a551e2cfcd1df04ea11a
```

### DaoPoolState (Shared Object)
```
0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e
```

### MembersNFTState (Shared Object)
```
0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d
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
https://testnet.suivision.xyz/package/0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c

### Transaction
https://testnet.suivision.xyz/txblock/ExTpZmhiLgBBZPsYH1yPeSdgebU1DkKsUydHNeWqd5L1

### DaoPoolState Object
https://testnet.suivision.xyz/object/0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e

### MembersNFTState Object
https://testnet.suivision.xyz/object/0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d

---

## Frontend Configuration

### Environment Variables (.env)

```bash
# Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses
VITE_PACKAGE_ID=0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c

# Shared State Objects
VITE_DAO_POOL_STATE=0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e
VITE_MEMBERS_NFT_STATE=0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d

# Module Names
VITE_DAO_POOL_MODULE=dao_pool
VITE_MEMBER_NFT_MODULE=member_nft
```

---

## Usage Examples

### TypeScript/JavaScript

```typescript
// Package and State Objects
const PACKAGE_ID = "0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c";
const DAO_POOL_STATE = "0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e";
const NFT_STATE = "0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d";

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
```

### Move CLI

```bash
# View shared objects
sui client object 0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e
sui client object 0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d

# Call support function (example - requires USDC coin)
sui client call \
  --package 0x801ba2d753c5742152298181017e6fa010109c214a75ae1c17ecfef1702fd16c \
  --module dao_pool \
  --function support \
  --args \
    0xb28eb1a9c140123ef8be4d52c7933926308482fbced3a0a21edc9cdcf47ece7e \
    0xbd3f635d36a608e0ea9d63f10cf582ca9c579745ebb0eaf9b6474230eaca195d \
    <USDC_COIN_ID> \
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

## Previous Deployment (v1 - Deprecated)

Package ID (v1): `0x1832d899979ae0a231f867a58501e4a7f7a7b49d02cb6844857628c37c404805`
- This version required manual initialization
- Had circular dependency issues
- Not recommended for use
