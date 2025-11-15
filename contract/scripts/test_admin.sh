#!/bin/bash

# Champion Together - Admin Function Test Script
# 管理者機能の詳細テスト

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

# DaoPoolStateから型パラメータを検出する関数
detect_pool_coin_type() {
    local pool_id=$1
    
    echo "DaoPoolStateの型パラメータを検出中..." >&2
    
    # DaoPoolStateオブジェクトの情報を取得
    local pool_info=$(sui client object $pool_id --json 2>/dev/null)
    
    if [ $? -ne 0 ] || [ -z "$pool_info" ]; then
        echo -e "${RED}✗ エラー: DaoPoolStateオブジェクト $pool_id が見つかりません${NC}" >&2
        return 1
    fi
    
    # 型情報を抽出（DaoPoolState<TYPE> から TYPE を取得）
    local pool_type=$(echo "$pool_info" | jq -r '.data.type' | sed -n 's/.*DaoPoolState<\(.*\)>/\1/p')
    
    if [ -z "$pool_type" ]; then
        echo -e "${RED}✗ エラー: DaoPoolStateから型パラメータを検出できませんでした${NC}" >&2
        echo "オブジェクトタイプ: $(echo "$pool_info" | jq -r '.data.type')" >&2
        return 1
    fi
    
    echo "$pool_type"
    return 0
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  管理者機能テスト${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# DaoPoolStateの型パラメータを検出
echo -e "${YELLOW}DaoPoolStateの型パラメータを検出${NC}"
POOL_COIN_TYPE=$(detect_pool_coin_type $DAO_POOL_STATE)
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ DaoPoolStateの型パラメータを検出できませんでした${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 検出された型: $POOL_COIN_TYPE${NC}"
echo ""

# 現在のアクティブアドレスを取得
ACTIVE_ADDRESS=$(sui client active-address)
echo -e "${GREEN}Active Address: ${ACTIVE_ADDRESS}${NC}"
echo ""

# メニュー表示
echo -e "${YELLOW}管理者機能メニュー:${NC}"
echo "  1) 分配アドレスの変更"
echo "  2) 分配比率の変更"
echo "  3) 分配アドレスと比率の両方を変更"
echo "  4) ボーナス分配の実行"
echo "  5) 管理者権限の確認"
echo "  0) 戻る"
echo ""

read -p "選択してください (0-5): " choice

case $choice in
    1)
        # 分配アドレスの変更
        echo -e "\n${YELLOW}[分配アドレスの変更]${NC}"
        echo ""
        
        # 現在の設定を表示
        STATE=$(sui client object $DAO_POOL_STATE --json)
        CURRENT_FIGHTER=$(echo $STATE | jq -r '.data.content.fields.fighter_address')
        CURRENT_GYM=$(echo $STATE | jq -r '.data.content.fields.gym_address')
        CURRENT_ORGANIZER=$(echo $STATE | jq -r '.data.content.fields.organizer_address')
        
        echo "現在の設定:"
        echo "  Fighter: $CURRENT_FIGHTER"
        echo "  Gym: $CURRENT_GYM"
        echo "  Organizer: $CURRENT_ORGANIZER"
        echo ""
        
        read -p "新しいFighter Address [$CURRENT_FIGHTER]: " NEW_FIGHTER
        NEW_FIGHTER=${NEW_FIGHTER:-$CURRENT_FIGHTER}
        
        read -p "新しいGym Address [$CURRENT_GYM]: " NEW_GYM
        NEW_GYM=${NEW_GYM:-$CURRENT_GYM}
        
        read -p "新しいOrganizer Address [$CURRENT_ORGANIZER]: " NEW_ORGANIZER
        NEW_ORGANIZER=${NEW_ORGANIZER:-$CURRENT_ORGANIZER}
        
        echo ""
        echo "変更内容:"
        echo "  Fighter: $NEW_FIGHTER"
        echo "  Gym: $NEW_GYM"
        echo "  Organizer: $NEW_ORGANIZER"
        echo ""
        
        read -p "変更を実行しますか？ (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            sui client call \
                --package $PACKAGE_ID \
                --module dao_pool \
                --function change_distribution_detail \
                --type-args "$POOL_COIN_TYPE" \
                --args \
                    $DAO_POOL_STATE \
                    "[$NEW_FIGHTER]" \
                    "[$NEW_GYM]" \
                    "[$NEW_ORGANIZER]" \
                    "[]" \
                    "[]" \
                    "[]" \
                    $CLOCK_OBJECT \
                --gas-budget $GAS_BUDGET
            
            echo -e "\n${GREEN}✓ 分配アドレスを変更しました${NC}"
        fi
        ;;
        
    2)
        # 分配比率の変更
        echo -e "\n${YELLOW}[分配比率の変更]${NC}"
        echo ""
        
        # 現在の設定を表示
        STATE=$(sui client object $DAO_POOL_STATE --json)
        CURRENT_FIGHTER_RATIO=$(echo $STATE | jq -r '.data.content.fields.fighter_ratio')
        CURRENT_GYM_RATIO=$(echo $STATE | jq -r '.data.content.fields.gym_ratio')
        CURRENT_ORGANIZER_RATIO=$(echo $STATE | jq -r '.data.content.fields.organizer_ratio')
        
        echo "現在の設定:"
        echo "  Fighter: ${CURRENT_FIGHTER_RATIO}%"
        echo "  Gym: ${CURRENT_GYM_RATIO}%"
        echo "  Organizer: ${CURRENT_ORGANIZER_RATIO}%"
        echo ""
        
        read -p "新しいFighter比率 [${CURRENT_FIGHTER_RATIO}]: " NEW_FIGHTER_RATIO
        NEW_FIGHTER_RATIO=${NEW_FIGHTER_RATIO:-$CURRENT_FIGHTER_RATIO}
        
        read -p "新しいGym比率 [${CURRENT_GYM_RATIO}]: " NEW_GYM_RATIO
        NEW_GYM_RATIO=${NEW_GYM_RATIO:-$CURRENT_GYM_RATIO}
        
        read -p "新しいOrganizer比率 [${CURRENT_ORGANIZER_RATIO}]: " NEW_ORGANIZER_RATIO
        NEW_ORGANIZER_RATIO=${NEW_ORGANIZER_RATIO:-$CURRENT_ORGANIZER_RATIO}
        
        # 合計が100であることを確認
        TOTAL=$((NEW_FIGHTER_RATIO + NEW_GYM_RATIO + NEW_ORGANIZER_RATIO))
        
        if [ $TOTAL -ne 100 ]; then
            echo -e "\n${RED}✗ エラー: 比率の合計が100ではありません (合計: $TOTAL)${NC}"
            exit 1
        fi
        
        echo ""
        echo "変更内容:"
        echo "  Fighter: ${NEW_FIGHTER_RATIO}%"
        echo "  Gym: ${NEW_GYM_RATIO}%"
        echo "  Organizer: ${NEW_ORGANIZER_RATIO}%"
        echo "  合計: ${TOTAL}%"
        echo ""
        
        read -p "変更を実行しますか？ (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            sui client call \
                --package $PACKAGE_ID \
                --module dao_pool \
                --function change_distribution_detail \
                --type-args "$POOL_COIN_TYPE" \
                --args \
                    $DAO_POOL_STATE \
                    "[]" \
                    "[]" \
                    "[]" \
                    "[$NEW_FIGHTER_RATIO]" \
                    "[$NEW_GYM_RATIO]" \
                    "[$NEW_ORGANIZER_RATIO]" \
                    $CLOCK_OBJECT \
                --gas-budget $GAS_BUDGET
            
            echo -e "\n${GREEN}✓ 分配比率を変更しました${NC}"
        fi
        ;;
        
    3)
        # 分配アドレスと比率の両方を変更
        echo -e "\n${YELLOW}[分配アドレスと比率の変更]${NC}"
        echo ""
        
        # 現在の設定を表示
        STATE=$(sui client object $DAO_POOL_STATE --json)
        
        echo "現在の設定:"
        echo "アドレス:"
        echo "  Fighter: $(echo $STATE | jq -r '.data.content.fields.fighter_address')"
        echo "  Gym: $(echo $STATE | jq -r '.data.content.fields.gym_address')"
        echo "  Organizer: $(echo $STATE | jq -r '.data.content.fields.organizer_address')"
        echo "比率:"
        echo "  Fighter: $(echo $STATE | jq -r '.data.content.fields.fighter_ratio')%"
        echo "  Gym: $(echo $STATE | jq -r '.data.content.fields.gym_ratio')%"
        echo "  Organizer: $(echo $STATE | jq -r '.data.content.fields.organizer_ratio')%"
        echo ""
        
        # 新しい値を入力
        read -p "新しいFighter Address: " NEW_FIGHTER
        read -p "新しいGym Address: " NEW_GYM
        read -p "新しいOrganizer Address: " NEW_ORGANIZER
        read -p "新しいFighter比率: " NEW_FIGHTER_RATIO
        read -p "新しいGym比率: " NEW_GYM_RATIO
        read -p "新しいOrganizer比率: " NEW_ORGANIZER_RATIO
        
        # 合計が100であることを確認
        TOTAL=$((NEW_FIGHTER_RATIO + NEW_GYM_RATIO + NEW_ORGANIZER_RATIO))
        
        if [ $TOTAL -ne 100 ]; then
            echo -e "\n${RED}✗ エラー: 比率の合計が100ではありません (合計: $TOTAL)${NC}"
            exit 1
        fi
        
        echo ""
        echo "変更内容:"
        echo "アドレス:"
        echo "  Fighter: $NEW_FIGHTER"
        echo "  Gym: $NEW_GYM"
        echo "  Organizer: $NEW_ORGANIZER"
        echo "比率:"
        echo "  Fighter: ${NEW_FIGHTER_RATIO}%"
        echo "  Gym: ${NEW_GYM_RATIO}%"
        echo "  Organizer: ${NEW_ORGANIZER_RATIO}%"
        echo ""
        
        read -p "変更を実行しますか？ (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            sui client call \
                --package $PACKAGE_ID \
                --module dao_pool \
                --function change_distribution_detail \
                --type-args "$POOL_COIN_TYPE" \
                --args \
                    $DAO_POOL_STATE \
                    "[$NEW_FIGHTER]" \
                    "[$NEW_GYM]" \
                    "[$NEW_ORGANIZER]" \
                    "[$NEW_FIGHTER_RATIO]" \
                    "[$NEW_GYM_RATIO]" \
                    "[$NEW_ORGANIZER_RATIO]" \
                    $CLOCK_OBJECT \
                --gas-budget $GAS_BUDGET
            
            echo -e "\n${GREEN}✓ 分配設定を変更しました${NC}"
        fi
        ;;
        
    4)
        # ボーナス分配の実行
        echo -e "\n${YELLOW}[ボーナス分配の実行]${NC}"
        echo ""
        
        # トレジャリー残高を確認
        STATE=$(sui client object $DAO_POOL_STATE --json)
        TREASURY=$(echo $STATE | jq -r '.data.content.fields.treasury.fields.balance')
        
        echo "現在のトレジャリー残高: $TREASURY マイクロUSDC"
        echo ""
        
        read -p "ボーナス金額（マイクロUSDC）[100000000 = 100 USDC]: " BONUS_AMOUNT
        BONUS_AMOUNT=${BONUS_AMOUNT:-100000000}
        
        if [ $BONUS_AMOUNT -gt $TREASURY ]; then
            echo -e "\n${RED}✗ エラー: トレジャリー残高が不足しています${NC}"
            exit 1
        fi
        
        # 分配額を計算
        FIGHTER_RATIO=$(echo $STATE | jq -r '.data.content.fields.fighter_ratio')
        GYM_RATIO=$(echo $STATE | jq -r '.data.content.fields.gym_ratio')
        ORGANIZER_RATIO=$(echo $STATE | jq -r '.data.content.fields.organizer_ratio')
        
        FIGHTER_AMOUNT=$((BONUS_AMOUNT * FIGHTER_RATIO / 100))
        GYM_AMOUNT=$((BONUS_AMOUNT * GYM_RATIO / 100))
        ORGANIZER_AMOUNT=$((BONUS_AMOUNT * ORGANIZER_RATIO / 100))
        
        echo "分配額:"
        echo "  Fighter: $FIGHTER_AMOUNT マイクロUSDC (${FIGHTER_RATIO}%)"
        echo "  Gym: $GYM_AMOUNT マイクロUSDC (${GYM_RATIO}%)"
        echo "  Organizer: $ORGANIZER_AMOUNT マイクロUSDC (${ORGANIZER_RATIO}%)"
        echo ""
        
        read -p "ボーナス分配を実行しますか？ (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            RESULT=$(sui client call \
                --package $PACKAGE_ID \
                --module dao_pool \
                --function distribute_bonus \
                --type-args "$POOL_COIN_TYPE" \
                --args \
                    $DAO_POOL_STATE \
                    $BONUS_AMOUNT \
                    $CLOCK_OBJECT \
                --gas-budget $GAS_BUDGET \
                --json)
            
            echo -e "\n${GREEN}✓ ボーナス分配を実行しました${NC}"
            
            TX_DIGEST=$(echo $RESULT | jq -r '.digest')
            echo "Transaction Digest: $TX_DIGEST"
            echo "Explorer: https://testnet.suivision.xyz/txblock/$TX_DIGEST"
        fi
        ;;
        
    5)
        # 管理者権限の確認
        echo -e "\n${YELLOW}[管理者権限の確認]${NC}"
        echo ""
        
        STATE=$(sui client object $DAO_POOL_STATE --json)
        ORGANIZER=$(echo $STATE | jq -r '.data.content.fields.organizer_address')
        
        echo "Organizer Address: $ORGANIZER"
        echo "Active Address: $ACTIVE_ADDRESS"
        echo ""
        
        if [ "$ACTIVE_ADDRESS" = "$ORGANIZER" ]; then
            echo -e "${GREEN}✓ あなたは管理者です${NC}"
        else
            echo -e "${RED}✗ あなたは管理者ではありません${NC}"
        fi
        ;;
        
    0)
        echo "戻ります"
        exit 0
        ;;
        
    *)
        echo -e "${RED}✗ 無効な選択です${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  管理者機能テスト完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
