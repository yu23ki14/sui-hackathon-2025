#!/bin/bash

# Champion Together - NFT Information Check Script
# NFT情報の確認

set -e

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 環境変数を読み込む
source "$SCRIPT_DIR/load_env.sh"

# カラー出力用
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  NFT情報確認${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# アドレスを指定
ACTIVE_ADDRESS=$(sui client active-address)
echo -e "${GREEN}Active Address: ${ACTIVE_ADDRESS}${NC}"
echo ""

read -p "別のアドレスを確認しますか？ (空白で現在のアドレス): " TARGET_ADDRESS
TARGET_ADDRESS=${TARGET_ADDRESS:-$ACTIVE_ADDRESS}

echo -e "${CYAN}Target Address: ${TARGET_ADDRESS}${NC}"
echo ""

# MembersNFTStateの情報を取得
echo -e "${YELLOW}[1/3] MembersNFTState の情報${NC}"
STATE=$(sui client object $NFT_STATE --json)
TOTAL_SUPPLY=$(echo $STATE | jq -r '.data.content.fields.token_counter')

echo "総発行数: $TOTAL_SUPPLY NFTs"
echo ""

# 指定アドレスが所有するNFTを検索
echo -e "${YELLOW}[2/3] 保有NFTを検索中...${NC}"

# オプション1: アドレスを指定してオブジェクトを取得
if [ "$TARGET_ADDRESS" = "$ACTIVE_ADDRESS" ]; then
    # 現在のアドレスの場合
    NFT_IDS=$(sui client objects --json | jq -r '.[] | select(.data.type | contains("member_nft::MemberNFT")) | .data.objectId')
else
    # 別のアドレスの場合（RPC経由）
    echo "注意: 別のアドレスのNFTを確認するには、そのアドレスのウォレットに切り替える必要があります"
    echo "または、Sui Explorerで確認してください:"
    echo "https://testnet.suivision.xyz/account/$TARGET_ADDRESS"
    exit 0
fi

# NFTが見つからない場合
if [ -z "$NFT_IDS" ]; then
    echo -e "${YELLOW}⚠ NFTが見つかりませんでした${NC}"
    echo ""
    echo "このアドレスはまだNFTを保有していません"
    echo "支援を実行してNFTを取得してください"
    exit 0
fi

# NFT数をカウント
NFT_COUNT=$(echo "$NFT_IDS" | wc -l | tr -d ' ')
echo -e "${GREEN}✓ ${NFT_COUNT}個のNFTが見つかりました${NC}"
echo ""

# 各NFTの詳細を表示
echo -e "${YELLOW}[3/3] NFT詳細情報${NC}"
echo ""

INDEX=1
echo "$NFT_IDS" | while read nft_id; do
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}NFT #${INDEX}${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    NFT_DATA=$(sui client object $nft_id --json)
    
    TOKEN_ID=$(echo $NFT_DATA | jq -r '.data.content.fields.token_id')
    SUPPORT_AMOUNT=$(echo $NFT_DATA | jq -r '.data.content.fields.support_amount')
    RANK=$(echo $NFT_DATA | jq -r '.data.content.fields.rank')
    MINTED_AT=$(echo $NFT_DATA | jq -r '.data.content.fields.minted_at')
    IMAGE_URL=$(echo $NFT_DATA | jq -r '.data.content.fields.image_url')
    
    # USDCに変換（マイクロUSDC → USDC）
    USDC_AMOUNT=$(echo "scale=2; $SUPPORT_AMOUNT / 1000000" | bc)
    
    # タイムスタンプを日時に変換
    MINTED_DATE=$(date -r $((MINTED_AT / 1000)) '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "N/A")
    
    echo "Object ID: $nft_id"
    echo "Token ID: $TOKEN_ID"
    echo "Rank: $RANK"
    echo "Support Amount: $USDC_AMOUNT USDC ($SUPPORT_AMOUNT マイクロUSDC)"
    echo "Minted At: $MINTED_DATE"
    echo "Image URL: $IMAGE_URL"
    echo ""
    echo "Sui Explorer:"
    echo "https://testnet.suivision.xyz/object/$nft_id"
    echo ""
    
    INDEX=$((INDEX + 1))
done

# ランク別の統計
echo -e "${YELLOW}ランク別統計:${NC}"
echo "$NFT_IDS" | while read nft_id; do
    NFT_DATA=$(sui client object $nft_id --json)
    echo $NFT_DATA | jq -r '.data.content.fields.rank'
done | sort | uniq -c | while read count rank; do
    echo "  $rank: $count個"
done

echo ""

# 総支援額を計算
TOTAL_SUPPORT=0
echo "$NFT_IDS" | while read nft_id; do
    NFT_DATA=$(sui client object $nft_id --json)
    SUPPORT_AMOUNT=$(echo $NFT_DATA | jq -r '.data.content.fields.support_amount')
    TOTAL_SUPPORT=$((TOTAL_SUPPORT + SUPPORT_AMOUNT))
    echo $TOTAL_SUPPORT > /tmp/total_support.tmp
done

if [ -f /tmp/total_support.tmp ]; then
    TOTAL_SUPPORT=$(cat /tmp/total_support.tmp)
    TOTAL_USDC=$(echo "scale=2; $TOTAL_SUPPORT / 1000000" | bc)
    echo -e "${GREEN}総支援額: $TOTAL_USDC USDC${NC}"
    rm /tmp/total_support.tmp
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  NFT情報確認完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
