#!/bin/bash

# Champion Together - Initialization using PTB
set -e

PACKAGE_ID="0x1832d899979ae0a231f867a58501e4a7f7a7b49d02cb6844857628c37c404805"
FIGHTER="0xf19e7562888b60b5e923de1ab442fb0d0634c901df5732a818c735e6ae0ec0f1"
GYM="0x93e12c085e9f2c8e31c47f1c09e0ae8e25d1a1aa87d1f8c3eac5bb8e349ba6e5"
ORGANIZER="0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353"
TEMP_DAO_POOL="0x0000000000000000000000000000000000000000000000000000000000000000"
CLOCK="0x6"

echo "=== Initializing Champion Together Contracts ==="
echo ""
echo "Step 1: Creating MembersNFTState and transferring to organizer..."

# Create NFT State and transfer to organizer
TX1=$(sui client call \
  --package $PACKAGE_ID \
  --module member_nft \
  --function init_nft_state \
  --args $TEMP_DAO_POOL \
  --gas-budget 100000000 \
  --json)

echo "$TX1" | jq -r '.objectChanges[] | select(.objectType | contains("MembersNFTState")) | .objectId' > /tmp/nft_state_id.txt
NFT_STATE_ID=$(cat /tmp/nft_state_id.txt)

if [ -z "$NFT_STATE_ID" ]; then
  echo "Error: Failed to extract NFT State ID"
  echo "$TX1"
  exit 1
fi

echo "✓ MembersNFTState created: $NFT_STATE_ID"
echo ""

echo "Step 2: Creating DaoPoolState..."
TX2=$(sui client call \
  --package $PACKAGE_ID \
  --module dao_pool \
  --function init_pool \
  --args $FIGHTER $GYM $ORGANIZER 60 30 10 $NFT_STATE_ID $CLOCK \
  --gas-budget 100000000 \
  --json)

echo "$TX2" | jq -r '.objectChanges[] | select(.objectType | contains("DaoPoolState")) | .objectId' > /tmp/dao_pool_id.txt
DAO_POOL_ID=$(cat /tmp/dao_pool_id.txt)

if [ -z "$DAO_POOL_ID" ]; then
  echo "Error: Failed to extract DAO Pool ID"
  echo "$TX2"
  exit 1
fi

echo "✓ DaoPoolState created: $DAO_POOL_ID"
echo ""

echo "=== Initialization Complete ==="
echo ""
echo "Created Objects:"
echo "  MembersNFTState: $NFT_STATE_ID"
echo "  DaoPoolState: $DAO_POOL_ID"
echo ""
echo "Note: Both objects are owned by the organizer address."
echo "To make them publicly accessible, they need to be shared objects."
