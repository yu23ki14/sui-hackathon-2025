#!/bin/bash

# Champion Together - Initialize USDC Pool (Automated)
# USDC型のDaoPoolStateを自動作成するスクリプト

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

echo -e "${YELLOW}設定情報${NC}"
echo "Package ID: $PACKAGE_ID"
echo "NFT State: $NFT_STATE"
echo "Coin Type: $USDC_TYPE"
echo ""

# 現在のアドレスを取得
CURRENT_ADDRESS=$(sui client active-address)
echo "Current Address: $CURRENT_ADDRESS"
echo "すべての受取人アドレスに現在のアドレスを使用します"
echo ""

FIGHTER_ADDR=$CURRENT_ADDRESS
GYM_ADDR=$CURRENT_ADDRESS
ORGANIZER_ADDR=$CURRENT_ADDRESS

echo "Fighter: $FIGHTER_ADDR"
echo "Gym: $GYM_ADDR"
echo "Organizer: $ORGANIZER_ADDR"
echo ""

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
    
    # .envファイルに追加
    echo "" >> "$SCRIPT_DIR/../.env"
    echo "# USDC型DaoPoolState (Created $(date))" >> "$SCRIPT_DIR/../.env"
    echo "USDC_DAO_POOL_STATE=$USDC_DAO_POOL_STATE" >> "$SCRIPT_DIR/../.env"
    
    echo -e "${GREEN}✓ .envファイルに追加しました${NC}"
    echo ""
    echo -e "${YELLOW}次のステップ:${NC}"
    echo "test_support.shを実行してUSDCで支援をテストできます:"
    echo "  DAO_POOL_STATE=\$USDC_DAO_POOL_STATE ./contract/scripts/test_support.sh"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  初期化完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
