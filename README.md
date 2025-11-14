# CHAMPION TOGETHER

A decentralized fan club platform for fighters. Fans contribute USDC → DAO treasury → Smart contracts auto-distribute to fighter/gym/organizers. Members NFT minted per support, ranks unlock exclusive content via Lit Protocol.

## Project Structure

```
/
├── frontend/          # React web application (Vite + React)
├── contracts/         # Sui Move smart contracts
└── lit-protocol/      # Lit Protocol integration
```

## Frontend Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Sui Wallet extension

### Environment Variables

The frontend requires the following environment variables. Create a `.env` file in the `frontend/` directory:

#### Required Environment Variables

| Variable Name | Description | Example | Required |
|--------------|-------------|---------|----------|
| `VITE_SUI_NETWORK` | Sui blockchain network | `testnet` or `mainnet` | Yes |
| `VITE_DAO_CONTRACT_ADDRESS` | DAO smart contract address | `0x123...abc` | Yes |
| `VITE_MEMBERS_NFT_CONTRACT_ADDRESS` | Members NFT contract address | `0x456...def` | Yes |
| `VITE_USDC_TOKEN_CONTRACT_ADDRESS` | USDC token contract address on Sui | `0x789...ghi` | Yes |
| `VITE_FIGHTER_ADDRESS` | Fighter wallet address for distribution | `0xabc...123` | Yes |
| `VITE_GYM_ADDRESS` | Gym wallet address for distribution | `0xdef...456` | Yes |
| `VITE_ORGANIZER_ADDRESS` | Organizer wallet address for distribution | `0xghi...789` | Yes |
| `VITE_LIT_NETWORK` | Lit Protocol network | `cayenne` (testnet) or `datil` (mainnet) | No (default: `cayenne`) |

### .env File Example

Create `frontend/.env` with the following content:

```bash
# Sui Network Configuration
VITE_SUI_NETWORK=testnet

# Smart Contract Addresses (Update after deployment)
VITE_DAO_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_MEMBERS_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_USDC_TOKEN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000

# Distribution Addresses
VITE_FIGHTER_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_GYM_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000
VITE_ORGANIZER_ADDRESS=0x0000000000000000000000000000000000000000000000000000000000000000

# Lit Protocol Configuration
VITE_LIT_NETWORK=cayenne
```

### Installation

```bash
cd frontend
pnpm install
```

### Development

```bash
cd frontend
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
cd frontend
pnpm build
```

The built files will be in `frontend/dist/`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the **Root Directory** to `frontend`
4. Configure environment variables in Vercel dashboard (Settings → Environment Variables)
5. Deploy

### Netlify Deployment

1. Push your code to GitHub
2. Import the project in Netlify
3. Set **Base directory** to `frontend`
4. Set **Build command** to `pnpm build`
5. Set **Publish directory** to `frontend/dist`
6. Configure environment variables in Netlify dashboard (Site settings → Environment variables)
7. Deploy

### Environment Variables for Production

**Important**: When deploying to production:
- Set `VITE_SUI_NETWORK=mainnet` for mainnet deployment
- Update all contract addresses with actual deployed contract addresses
- Set `VITE_LIT_NETWORK=datil` for Lit Protocol mainnet
- Ensure all wallet addresses are correct and controlled by the appropriate parties

## Smart Contract Deployment

(To be documented after contract implementation)

## Tech Stack

### Frontend
- **Framework**: Vite + React 18.3
- **Routing**: React Router v7
- **UI Components**: Radix UI
- **Wallet Integration**: @mysten/dapp-kit
- **Blockchain**: Sui SDK (@mysten/sui)
- **Package Manager**: pnpm

### Smart Contracts
- **Language**: Move
- **Blockchain**: Sui
- **Package Manager**: Sui CLI

### Access Control
- **Platform**: Lit Protocol
- **Purpose**: NFT-based content encryption/decryption

## Features

- **Support System**: USDC contributions to fighter DAO
- **Automatic Distribution**: Smart contract-based fund allocation (Fighter 70%, Gym 20%, Organizer 10%)
- **Members NFT**: Minted for each support, determines rank (Bronze/Silver/Gold)
- **Exclusive Content**: Tiered content access based on NFT holdings
- **Admin Dashboard**: Distribution management and event history
- **Responsive Design**: Mobile-first, works on all devices

## Security Considerations

- Input validation on all smart contract functions
- Access control for admin operations
- No reentrancy issues (Sui's resource model)
- Built-in overflow checks in Move
- Secure wallet connection via Sui Wallet SDK

## License

(To be determined)