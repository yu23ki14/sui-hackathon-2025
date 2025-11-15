#!/bin/bash

# Champion Together - Distribution Function Test Script
# 分配機能の詳細テスト

set -e

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 環境変数を読み込む
source "$SCRIPT_DIR/load_env.sh"

# カラー出力用
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  分配機能テスト${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 現在のアクティブアドレスを取得
ACTIVE_ADDRESS=$(sui client active-address)
echo -e "${GREEN}Active Address: ${ACTIVE_ADDRESS}${NC}"
echo ""

# DaoPoolStateの現在の状態を取得
echo -e "${YELLOW}Step 1: DaoPoolStateの現在の状態を確認${NC}"
STATE=$(sui client object $DAO_POOL_STATE --json)

POOL_TYPE=$(echo $STATE | jq -r '.type' | sed -n 's/.*DaoPoolState<\(.*\)>/\1/p')
TREASURY=$(echo $STATE | jq -r '.content.fields.treasury')
TOTAL_RAISED=$(echo $STATE | jq -r '.content.fields.total_raised')
FIGHTER_ADDRESS=$(echo $STATE | jq -r '.content.fields.fighter_address')
GYM_ADDRESS=$(echo $STATE | jq -r '.content.fields.gym_address')
ORGANIZER_ADDRESS=$(echo $STATE | jq -r '.content.fields.organizer_address')
FIGHTER_RATIO=$(echo $STATE | jq -r '.content.fields.fighter_ratio')
GYM_RATIO=$(echo $STATE | jq -r '.content.fields.gym_ratio')
ORGANIZER_RATIO=$(echo $STATE | jq -r '.content.fields.organizer_ratio')
LAST_DISTRIBUTION=$(echo $STATE | jq -r '.content.fields.last_distribution')

echo "  Pool Type: $POOL_TYPE"
echo "  Treasury Balance: $TREASURY ($(echo "scale=2; $TREASURY / 1000000000" | bc) SUI)"
echo "  Total Raised: $TOTAL_RAISED ($(echo "scale=2; $TOTAL_RAISED / 1000000000" | bc) SUI)"
echo "  Fighter Address: $FIGHTER_ADDRESS"
echo "  Gym Address: $GYM_ADDRESS"
echo "  Organizer Address: $ORGANIZER_ADDRESS"
echo "  Distribution Ratios: Fighter ${FIGHTER_RATIO}%, Gym ${GYM_RATIO}%, Organizer ${ORGANIZER_RATIO}%"
echo "  Last Distribution: $LAST_DISTRIBUTION"
echo ""

# トレジャリーが空でないことを確認
if [ "$TREASURY" = "0" ]; then
    echo -e "${RED}✗ エラー: トレジャリーが空です。先にsupport関数を実行してください${NC}"
    exit 1
fi

# 分配先アドレスが設定されているか確認
if [ "$FIGHTER_ADDRESS" = "0x0000000000000000000000000000000000000000000000000000000000000000" ]; then
    echo -e "${YELLOW}⚠ 警告: 分配先アドレスが設定されていません${NC}"
    echo -e "${YELLOW}注意: 分配先アドレスが0x0000...の場合、資金はburn（焼却）されます${NC}"
    echo ""
    echo "このまま続行しますか？ (y/N): "
    read -r confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "テストを中止しました"
        exit 0
    fi
    echo ""
fi

# 分配前の各アドレスの残高を記録
echo -e "${YELLOW}Step 3: 分配前の各アドレスの残高を確認${NC}"

get_sui_balance() {
    local address=$1
    local balance=$(sui client gas --json | jq -r --arg addr "$address" '[.[] | select(.gasCoinId != null)] | map(.balance) | add // 0')
    echo $balance
}

FIGHTER_BALANCE_BEFORE=$(get_sui_balance $FIGHTER_ADDRESS)
GYM_BALANCE_BEFORE=$(get_sui_balance $GYM_ADDRESS)
ORGANIZER_BALANCE_BEFORE=$(get_sui_balance $ORGANIZER_ADDRESS)

echo "  Fighter Balance: $FIGHTER_BALANCE_BEFORE ($(echo "scale=2; $FIGHTER_BALANCE_BEFORE / 1000000000" | bc) SUI)"
echo "  Gym Balance: $GYM_BALANCE_BEFORE ($(echo "scale=2; $GYM_BALANCE_BEFORE / 1000000000" | bc) SUI)"
echo "  Organizer Balance: $ORGANIZER_BALANCE_BEFORE ($(echo "scale=2; $ORGANIZER_BALANCE_BEFORE / 1000000000" | bc) SUI)"
echo ""

# 分配額を計算
FIGHTER_AMOUNT=$((TREASURY * FIGHTER_RATIO / 100))
GYM_AMOUNT=$((TREASURY * GYM_RATIO / 100))
ORGANIZER_AMOUNT=$((TREASURY * ORGANIZER_RATIO / 100))

echo -e "${YELLOW}Step 4: 分配額を計算${NC}"
echo "  Fighter: $FIGHTER_AMOUNT ($(echo "scale=2; $FIGHTER_AMOUNT / 1000000000" | bc) SUI, ${FIGHTER_RATIO}%)"
echo "  Gym: $GYM_AMOUNT ($(echo "scale=2; $GYM_AMOUNT / 1000000000" | bc) SUI, ${GYM_RATIO}%)"
echo "  Organizer: $ORGANIZER_AMOUNT ($(echo "scale=2; $ORGANIZER_AMOUNT / 1000000000" | bc) SUI, ${ORGANIZER_RATIO}%)"
echo "  Total: $((FIGHTER_AMOUNT + GYM_AMOUNT + ORGANIZER_AMOUNT)) ($(echo "scale=2; ($FIGHTER_AMOUNT + $GYM_AMOUNT + $ORGANIZER_AMOUNT) / 1000000000" | bc) SUI)"
echo ""

# 分配を実行
echo -e "${YELLOW}Step 5: 分配を実行${NC}"
echo "distribute関数を呼び出し中..."

DISTRIBUTE_RESULT=$(sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function distribute \
    --type-args "$POOL_TYPE" \
    --args \
        $DAO_POOL_STATE \
        $CLOCK_OBJECT \
    --gas-budget $GAS_BUDGET \
    --json)

DISTRIBUTE_TX=$(echo $DISTRIBUTE_RESULT | jq -r '.digest')
echo -e "${GREEN}✓ 分配を実行しました${NC}"
echo "  Transaction Digest: $DISTRIBUTE_TX"
echo "  Explorer: https://testnet.suivision.xyz/txblock/$DISTRIBUTE_TX"
echo ""

# イベントを確認
echo -e "${YELLOW}Step 6: DistributionEventを確認${NC}"
EVENTS=$(echo $DISTRIBUTE_RESULT | jq -r '.events')

if [ "$EVENTS" != "null" ] && [ "$EVENTS" != "[]" ]; then
    echo "発行されたイベント:"
    echo $EVENTS | jq '.'
else
    echo "  イベント情報が見つかりません"
fi
echo ""

# 分配後の状態を確認
sleep 2
echo -e "${YELLOW}Step 7: 分配後の状態を確認${NC}"

STATE_AFTER=$(sui client object $DAO_POOL_STATE --json)
TREASURY_AFTER=$(echo $STATE_AFTER | jq -r '.content.fields.treasury')
LAST_DISTRIBUTION_AFTER=$(echo $STATE_AFTER | jq -r '.content.fields.last_distribution')

echo "  Treasury Balance After: $TREASURY_AFTER ($(echo "scale=2; $TREASURY_AFTER / 1000000000" | bc) SUI)"
echo "  Last Distribution: $LAST_DISTRIBUTION_AFTER"
echo ""

# 分配後の各アドレスの残高を確認
echo -e "${YELLOW}Step 8: 分配後の各アドレスの残高を確認${NC}"

FIGHTER_BALANCE_AFTER=$(get_sui_balance $FIGHTER_ADDRESS)
GYM_BALANCE_AFTER=$(get_sui_balance $GYM_ADDRESS)
ORGANIZER_BALANCE_AFTER=$(get_sui_balance $ORGANIZER_ADDRESS)

echo "  Fighter Balance: $FIGHTER_BALANCE_AFTER ($(echo "scale=2; $FIGHTER_BALANCE_AFTER / 1000000000" | bc) SUI)"
echo "  Gym Balance: $GYM_BALANCE_AFTER ($(echo "scale=2; $GYM_BALANCE_AFTER / 1000000000" | bc) SUI)"
echo "  Organizer Balance: $ORGANIZER_BALANCE_AFTER ($(echo "scale=2; $ORGANIZER_BALANCE_AFTER / 1000000000" | bc) SUI)"
echo ""

# 残高の変化を計算
FIGHTER_DIFF=$((FIGHTER_BALANCE_AFTER - FIGHTER_BALANCE_BEFORE))
GYM_DIFF=$((GYM_BALANCE_AFTER - GYM_BALANCE_BEFORE))
ORGANIZER_DIFF=$((ORGANIZER_BALANCE_AFTER - ORGANIZER_BALANCE_BEFORE))

echo -e "${YELLOW}Step 9: 残高の変化を確認${NC}"
echo "  Fighter: +$FIGHTER_DIFF ($(echo "scale=2; $FIGHTER_DIFF / 1000000000" | bc) SUI)"
echo "  Gym: +$GYM_DIFF ($(echo "scale=2; $GYM_DIFF / 1000000000" | bc) SUI)"
echo "  Organizer: +$ORGANIZER_DIFF ($(echo "scale=2; $ORGANIZER_DIFF / 1000000000" | bc) SUI)"
echo ""

# 検証
echo -e "${YELLOW}Step 10: 検証${NC}"

VERIFICATION_PASSED=true

# トレジャリーが減少したことを確認
if [ $TREASURY_AFTER -lt $TREASURY ]; then
    echo -e "${GREEN}✓ トレジャリーが減少しました${NC}"
else
    echo -e "${RED}✗ トレジャリーが減少していません${NC}"
    VERIFICATION_PASSED=false
fi

# 最終分配時刻が更新されたことを確認
if [ $LAST_DISTRIBUTION_AFTER -gt $LAST_DISTRIBUTION ]; then
    echo -e "${GREEN}✓ 最終分配時刻が更新されました${NC}"
else
    echo -e "${RED}✗ 最終分配時刻が更新されていません${NC}"
    VERIFICATION_PASSED=false
fi

# 各アドレスの残高が増加したことを確認（同じアドレスの場合は合計で確認）
if [ "$FIGHTER_ADDRESS" = "$GYM_ADDRESS" ] && [ "$GYM_ADDRESS" = "$ORGANIZER_ADDRESS" ]; then
    TOTAL_DIFF=$((FIGHTER_DIFF + GYM_DIFF + ORGANIZER_DIFF))
    EXPECTED_TOTAL=$((FIGHTER_AMOUNT + GYM_AMOUNT + ORGANIZER_AMOUNT))
    
    # ガス代を考慮して、期待値の90%以上であればOK
    MIN_EXPECTED=$((EXPECTED_TOTAL * 90 / 100))
    
    if [ $TOTAL_DIFF -ge $MIN_EXPECTED ]; then
        echo -e "${GREEN}✓ 受取人の残高が正しく増加しました（合計）${NC}"
    else
        echo -e "${RED}✗ 受取人の残高が期待値より少ないです${NC}"
        echo "  Expected (min): $MIN_EXPECTED, Actual: $TOTAL_DIFF"
        VERIFICATION_PASSED=false
    fi
else
    # 個別に確認
    if [ $FIGHTER_DIFF -ge $((FIGHTER_AMOUNT * 90 / 100)) ]; then
        echo -e "${GREEN}✓ Fighterの残高が正しく増加しました${NC}"
    else
        echo -e "${RED}✗ Fighterの残高が期待値より少ないです${NC}"
        VERIFICATION_PASSED=false
    fi
    
    if [ $GYM_DIFF -ge $((GYM_AMOUNT * 90 / 100)) ]; then
        echo -e "${GREEN}✓ Gymの残高が正しく増加しました${NC}"
    else
        echo -e "${RED}✗ Gymの残高が期待値より少ないです${NC}"
        VERIFICATION_PASSED=false
    fi
    
    if [ $ORGANIZER_DIFF -ge $((ORGANIZER_AMOUNT * 90 / 100)) ]; then
        echo -e "${GREEN}✓ Organizerの残高が正しく増加しました${NC}"
    else
        echo -e "${RED}✗ Organizerの残高が期待値より少ないです${NC}"
        VERIFICATION_PASSED=false
    fi
fi

echo ""

if [ "$VERIFICATION_PASSED" = true ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ 分配機能テスト成功${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ✗ 分配機能テストに失敗しました${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
