# Generic Coin Support Deployment Record

## Deployment Information

**Date**: 2025-11-15
**Network**: Testnet
**Transaction Digest**: 6ApucjJL6zAsQ9BvBvn1Tp2AdkseYvH3HkKwqaqRSLxU

## Package Information

**Package ID**: `0x95284f938b09467b5e1d83132cb1b864c4f1da3578948cadb9fbd9db79bf3f58`

**Modules**:
- dao_pool
- member_nft
- utils_constants
- utils_errors

## Created Objects

### DaoPoolState (Shared Object)
**Object ID**: `0x1e9f46227e14acb8d79751b1ab40cfea1064e6cd9ff47d27d3c35b803dee24a0`
**Type**: `DaoPoolState<0x2::sui::SUI>`
**Owner**: Shared
**Version**: 653016605

### MembersNFTState (Shared Object)
**Object ID**: `0x387f81bf1b95142dfbc88f5bfa2de7dc20056324198bc51f787e01326d5ac853`
**Type**: `MembersNFTState`
**Owner**: Shared
**Version**: 653016605

### UpgradeCap
**Object ID**: `0x11a4d90282be0b1c2fe6360fffa535683ebc24da7bfc0a885e63bccac5192e82`
**Owner**: Account Address (0x6c1aa061d0495b71eefd97e7d0a1cef0092f5c64d1b751decdc7b5ad0d039c02)

## Gas Cost

- **Storage Cost**: 60,891,200 MIST (60.89 SUI)
- **Computation Cost**: 1,000,000 MIST (1.00 SUI)
- **Storage Rebate**: 978,120 MIST (0.98 SUI)
- **Total Cost**: 60,913,080 MIST (60.91 SUI)

## Key Features

This deployment includes generic type parameter support (`<T>`), allowing the contract to work with any coin type:
- Default initialization uses `SUI` type
- Support function accepts `Coin<T>`
- Distribute functions work with any coin type
- All view functions support generic type parameters

## Usage Examples

### Support with SUI
```bash
sui client call \
    --package 0x95284f938b09467b5e1d83132cb1b864c4f1da3578948cadb9fbd9db79bf3f58 \
    --module dao_pool \
    --function support \
    --type-args "0x2::sui::SUI" \
    --args 0x1e9f46227e14acb8d79751b1ab40cfea1064e6cd9ff47d27d3c35b803dee24a0 \
           0x387f81bf1b95142dfbc88f5bfa2de7dc20056324198bc51f787e01326d5ac853 \
           <SUI_COIN_ID> \
           0x6 \
    --gas-budget 10000000
```

### Support with USDC
```bash
sui client call \
    --package 0x95284f938b09467b5e1d83132cb1b864c4f1da3578948cadb9fbd9db79bf3f58 \
    --module dao_pool \
    --function support \
    --type-args "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC" \
    --args 0x1e9f46227e14acb8d79751b1ab40cfea1064e6cd9ff47d27d3c35b803dee24a0 \
           0x387f81bf1b95142dfbc88f5bfa2de7dc20056324198bc51f787e01326d5ac853 \
           <USDC_COIN_ID> \
           0x6 \
    --gas-budget 10000000
```

## Notes

- The DaoPoolState is initialized with SUI type by default in the `init` function
- To use other coin types, create a new pool using `init_pool<T>` function
- All functions require `--type-args` parameter to specify the coin type
- The type must match the DaoPoolState's type parameter
