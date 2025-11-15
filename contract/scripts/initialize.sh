#!/bin/bash

# Champion Together - Contract Initialization Script
# This script initializes DaoPoolState and MembersNFTState on Sui testnet

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Champion Together Contract Initialization ===${NC}\n"

# Contract addresses
PACKAGE_ID="0x1832d899979ae0a231f867a58501e4a7f7a7b49d02cb6844857628c37c404805"
CLOCK_ID="0x6"

# Test addresses (dummy addresses for testing)
FIGHTER_ADDRESS="0xf19e7562888b60b5e923de1ab442fb0d0634c901df5732a818c735e6ae0ec0f1"
GYM_ADDRESS="0x93e12c085e9f2c8e31c47f1c09e0ae8e25d1a1aa87d1f8c3eac5bb8e349ba6e5"
ORGANIZER_ADDRESS="0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353"

# Distribution ratios (Fighter: 60%, Gym: 30%, Organizer: 10%)
FIGHTER_RATIO="60"
GYM_RATIO="30"
ORGANIZER_RATIO="10"

echo -e "${YELLOW}Configuration:${NC}"
echo "Package ID: $PACKAGE_ID"
echo "Fighter Address: $FIGHTER_ADDRESS"
echo "Gym Address: $GYM_ADDRESS"
echo "Organizer Address: $ORGANIZER_ADDRESS"
echo "Distribution Ratios: Fighter ${FIGHTER_RATIO}%, Gym ${GYM_RATIO}%, Organizer ${ORGANIZER_RATIO}%"
echo ""

# Step 1: Initialize MembersNFTState
echo -e "${GREEN}Step 1: Initializing MembersNFTState...${NC}"

# Note: We need to create a temporary DAO pool ID for initialization
# In actual implementation, we'll update this after creating DaoPool
TEMP_DAO_POOL_ID="0x0000000000000000000000000000000000000000000000000000000000000000"

echo "Creating MembersNFTState..."
echo "Note: This is a placeholder. Actual initialization requires proper Move transaction."
echo ""

# Step 2: Initialize DaoPoolState
echo -e "${GREEN}Step 2: Initializing DaoPoolState...${NC}"
echo "Note: This requires the MembersNFTState ID from Step 1."
echo ""

echo -e "${YELLOW}=== Manual Initialization Required ===${NC}"
echo ""
echo "Due to the complexity of Sui's object model, initialization requires manual steps:"
echo ""
echo "1. Create a Move script or use PTB (Programmable Transaction Block) to:"
echo "   a. Call member_nft::init_nft_state()"
echo "   b. Call dao_pool::init_pool() with the NFT state ID"
echo "   c. Share both objects using sui::transfer::share_object()"
echo ""
echo "2. Alternatively, add an init() function to the modules for automatic initialization"
echo ""
echo -e "${BLUE}Example PTB commands:${NC}"
echo ""
echo "# This would need to be done via TypeScript SDK or custom Move code"
echo "# See the SDK integration guide in DEPLOYMENT.md"
echo ""

exit 0
