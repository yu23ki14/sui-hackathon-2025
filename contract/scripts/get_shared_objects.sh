#!/bin/bash

# Get shared objects created by the deployer address

echo "=== Getting Shared Objects ==="
echo ""

# Load environment variables
source "$(dirname "$0")/load_env.sh"

if [ -z "$DEPLOYER_ADDRESS" ]; then
    echo "Error: DEPLOYER_ADDRESS not set in .env"
    exit 1
fi

if [ -z "$PACKAGE_ID" ]; then
    echo "Error: PACKAGE_ID not set in .env"
    exit 1
fi

echo "Package ID: $PACKAGE_ID"
echo "Deployer Address: $DEPLOYER_ADDRESS"
echo ""

# Get all objects owned by deployer
echo "Fetching objects owned by deployer..."
sui client objects $DEPLOYER_ADDRESS --json > /tmp/objects.json

# Parse and display shared objects
echo ""
echo "=== Shared Objects ==="
echo ""

# DaoPoolState
echo "Looking for DaoPoolState..."
DAO_POOL_STATE=$(cat /tmp/objects.json | jq -r '.[] | select(.data.type | contains("dao_pool::DaoPoolState")) | .data.objectId' | head -1)

if [ -n "$DAO_POOL_STATE" ]; then
    echo "✅ DaoPoolState found:"
    echo "   Object ID: $DAO_POOL_STATE"
    echo "   VITE_DAO_CONTRACT_ADDRESS=$DAO_POOL_STATE"
else
    echo "❌ DaoPoolState not found"
fi

echo ""

# MembersNFTState
echo "Looking for MembersNFTState..."
NFT_STATE=$(cat /tmp/objects.json | jq -r '.[] | select(.data.type | contains("member_nft::MembersNFTState")) | .data.objectId' | head -1)

if [ -n "$NFT_STATE" ]; then
    echo "✅ MembersNFTState found:"
    echo "   Object ID: $NFT_STATE"
    echo "   VITE_MEMBERS_NFT_CONTRACT_ADDRESS=$NFT_STATE"
else
    echo "❌ MembersNFTState not found"
fi

echo ""
echo "=== Summary ==="
echo ""
echo "Add these to your frontend/.env.local file:"
echo ""
echo "VITE_PACKAGE_ID=$PACKAGE_ID"
echo "VITE_DAO_CONTRACT_ADDRESS=$DAO_POOL_STATE"
echo "VITE_MEMBERS_NFT_CONTRACT_ADDRESS=$NFT_STATE"
echo "VITE_COIN_TYPE=0x2::sui::SUI"

# Cleanup
rm /tmp/objects.json
