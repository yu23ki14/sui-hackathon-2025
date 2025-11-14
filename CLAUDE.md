# CHAMPION TOGETHER - Development Guide

## Project Summary

A decentralized fan club platform for fighters. Fans contribute USDC → DAO treasury → Smart contracts auto-distribute to fighter/gym/organizers. Members NFT minted per support, ranks unlock exclusive content via Lit Protocol. Victory bonuses incentivize engagement.

## Repository Structure (Monorepo)

```
/
├── frontend/          # React web application
├── contracts/         # Sui Move smart contracts
└── lit-protocol/      # Lit Protocol integration
```

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: Vite + React
- **Routing**: React Router v7
- **Styling**: radix-ui
- **Wallet**: Sui Wallet SDK
- **State**: React Context / hooks
- **Package Manager**: pnpm

#### Frontend Routes
- `/` - トップページ (Top.tsx)
- `/support` - Supportページ (Support.tsx)
- `/mypage` - サポーター向けマイページ (MyPage.tsx)
- `/exclusive` - 限定コンテンツページ (ExclusiveContent.tsx)
- `/admin` - 管理ページ (Admin.tsx)

### Smart Contracts (`/contracts`)
- **Language**: Move
- **Blockchain**: Sui
- **Package Manager**: Sui CLI

### Lit Protocol (`/lit-protocol`)
- **Purpose**: Decentralized access control for tiered content
- **Integration**: Lit SDK + Sui NFT verification

## Environment Variables

```bash
# frontend/.env
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=0x...
VITE_LIT_NETWORK=cayenne

# contracts/.env
SUI_NETWORK=testnet
DEPLOYER_ADDRESS=0x...
```

## Testing Strategy

### Smart Contracts
- Unit tests for each module
- Integration tests for cross-module interactions
- Test victory bonus distribution logic
- Test rank calculation edge cases

## Security Considerations

1. **Input Validation**: All Move functions validate inputs (amounts > 0, valid addresses)
2. **Access Control**: Only authorized addresses can trigger distributions
3. **Reentrancy**: Use Sui's resource model (no reentrancy by design)
4. **Integer Overflow**: Move has built-in overflow checks

## Design System

### Color Palette

| Usage | Color | Code |
|-------|-------|------|
| Primary Color | Electric Blue | `#0A84FF` |
| Secondary Color | Dark Slate | `#0B0E11` |
| Accent / Win / Urgent | Fighting Red | `#E53935` |
| Primary Text | White | `#FFFFFF` |
| Secondary Text | Cool Gray | `#C9D1D9` |
| Border | Subtle Dark Gray | `#2A2F34` |

### Styling Guidelines

- Use fighter-themed colors (bold, energetic)
- Mobile-first responsive design
- Custom theme defined in `frontend/src/theme.css`
