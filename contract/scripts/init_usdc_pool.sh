#!/bin/bash

# Champion Together - Initialize USDC Pool
# USDC型のDaoPoolStateを作成するスクリプト

set -e

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 環境変数を読み込む
source "$SCRIPT_DIR/load_env.sh"

# カラー出力用
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# USDC型の定義（Testnet USDC）
USDC_TYPE="0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  USDC型DaoPoolState初期化${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}[1/3] 設定情報${NC}"
echo "Package ID: $PACKAGE_ID"
echo "NFT State: $NFT_STATE"
echo "Coin Type: $USDC_TYPE"
echo ""

# デフォルトアドレス（テスト用）
CURRENT_ADDRESS=$(sui client active-address)
echo "Current Address: $CURRENT_ADDRESS"
echo ""

echo -e "${YELLOW}[2/3] 受取人アドレスの設定${NC}"
echo "デフォルトでは現在のアドレスを使用します"
echo ""

read -p "Fighter Address (Enter でデフォルト): " FIGHTER_ADDR
FIGHTER_ADDR=${FIGHTER_ADDR:-$CURRENT_ADDRESS}

read -p "Gym Address (Enter でデフォルト): " GYM_ADDR
GYM_ADDR=${GYM_ADDR:-$CURRENT_ADDRESS}

read -p "Organizer Address (Enter でデフォルト): " ORGANIZER_ADDR
ORGANIZER_ADDR=${ORGANIZER_ADDR:-$CURRENT_ADDRESS}

echo ""
echo "Fighter: $FIGHTER_ADDR"
echo "Gym: $GYM_ADDR"
echo "Organizer: $ORGANIZER_ADDR"
echo ""

echo -e "${YELLOW}[3/3] DaoPoolStateを作成${NC}"
echo ""

read -p "実行しますか？ (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "キャンセルしました"
    exit 0
fi

echo "DaoPoolStateを作成中..."
echo ""

RESULT=$(sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function init_pool \
    --type-args "$USDC_TYPE" \
    --args \
        $FIGHTER_ADDR \
        $GYM_ADDR \
        $ORGANIZER_ADDR \
        60 \
        30 \
        10 \
        $CLOCK_OBJECT \
    --gas-budget $GAS_BUDGET \
    --json 2>&1)

# エラーチェック
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ エラー: DaoPoolStateの作成に失敗しました${NC}"
    echo ""
    echo "エラー詳細:"
    echo "$RESULT"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ DaoPoolStateが作成されました！${NC}"
echo ""

# トランザクション結果を表示
TX_DIGEST=$(echo $RESULT | jq -r '.digest')
echo "Transaction Digest: $TX_DIGEST"
echo "Explorer: https://testnet.suivision.xyz/txblock/$TX_DIGEST"
echo ""

# 作成されたDaoPoolStateオブジェクトIDを取得
USDC_DAO_POOL_STATE=$(echo $RESULT | jq -r '.objectChanges[] | select(.objectType | contains("DaoPoolState")) | .objectId')

if [ -n "$USDC_DAO_POOL_STATE" ]; then
    echo -e "${GREEN}新しいDaoPoolState (USDC型):${NC}"
    echo "$USDC_DAO_POOL_STATE"
    echo ""
    echo -e "${YELLOW}次のステップ:${NC}"
    echo "1. .envファイルに以下を追加してください:"
    echo "   USDC_DAO_POOL_STATE=$USDC_DAO_POOL_STATE"
    echo ""
    echo "2. test_support.shを実行してUSDCで支援をテストできます:"
    echo "   DAO_POOL_STATE=$USDC_DAO_POOL_STATE ./test_support.sh"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  初期化完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
