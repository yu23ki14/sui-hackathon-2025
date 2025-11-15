#!/bin/bash

# Champion Together - Contract Testing Script
# このスクリプトはTestnetにデプロイされたコントラクトの動作を確認します

set -e  # エラーが発生したら即座に終了

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 環境変数を読み込む
source "$SCRIPT_DIR/load_env.sh"

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# コインオブジェクトから型を自動検出する関数
detect_coin_type() {
    local coin_id=$1
    
    echo "コインオブジェクトの型を検出中..." >&2
    
    # コインオブジェクトの情報を取得
    local coin_info=$(sui client object $coin_id --json 2>/dev/null)
    
    if [ $? -ne 0 ] || [ -z "$coin_info" ]; then
        echo -e "${RED}✗ エラー: コインオブジェクト $coin_id が見つかりません${NC}" >&2
        return 1
    fi
    
    # 型情報を抽出（0x2::coin::Coin<TYPE> から TYPE を取得）
    local coin_type=$(echo "$coin_info" | jq -r '.data.type' | sed -n 's/.*Coin<\(.*\)>/\1/p')
    
    if [ -z "$coin_type" ]; then
        echo -e "${RED}✗ エラー: コインオブジェクトから型を検出できませんでした${NC}" >&2
        echo "オブジェクトタイプ: $(echo "$coin_info" | jq -r '.data.type')" >&2
        return 1
    fi
    
    echo "$coin_type"
    return 0
}

# ロゴ表示
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║          CHAMPION TOGETHER - Contract Test Suite         ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 現在のアクティブアドレスを取得
ACTIVE_ADDRESS=$(sui client active-address)
echo -e "${GREEN}✓ Active Address: ${ACTIVE_ADDRESS}${NC}"
echo -e "${BLUE}ℹ Network: ${SUI_NETWORK}${NC}"
echo -e "${BLUE}ℹ Package ID: ${PACKAGE_ID}${NC}"
echo ""

# DaoPoolStateの型パラメータを検出
echo -e "${YELLOW}DaoPoolStateの型パラメータを検出中...${NC}"
POOL_COIN_TYPE=$(detect_pool_coin_type $DAO_POOL_STATE)
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ DaoPoolStateの型パラメータを検出できませんでした${NC}"
    echo -e "${YELLOW}⚠ 一部の機能が正常に動作しない可能性があります${NC}"
    POOL_COIN_TYPE=""
else
    echo -e "${GREEN}✓ 検出された型: $POOL_COIN_TYPE${NC}"
fi
echo ""

# 関数: セクションヘッダー表示
print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# 関数: 成功メッセージ
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 関数: エラーメッセージ
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 関数: 警告メッセージ
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 関数: 情報メッセージ
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# メニュー表示
show_menu() {
    echo -e "${YELLOW}テストメニュー:${NC}"
    echo "  1) 📊 コントラクト状態の確認"
    echo "  2) 🔧 初期設定（分配アドレスの設定）"
    echo "  3) 💰 支援機能のテスト"
    echo "  4) 📤 分配機能のテスト"
    echo "  5) 🎁 ボーナス分配のテスト"
    echo "  6) 👤 NFT情報の確認"
    echo "  7) 🔄 完全フローテスト（支援→NFT発行→分配）"
    echo "  8) 🧪 すべてのテストを実行"
    echo "  0) 終了"
    echo ""
}

# 1. コントラクト状態の確認
check_contract_state() {
    print_section "1. コントラクト状態の確認"
    
    print_info "DaoPoolState を確認中..."
    sui client object $DAO_POOL_STATE --json | jq '.data.content.fields' || print_error "DaoPoolState の取得に失敗"
    
    echo ""
    print_info "MembersNFTState を確認中..."
    sui client object $NFT_STATE --json | jq '.data.content.fields' || print_error "MembersNFTState の取得に失敗"
    
    print_success "コントラクト状態の確認完了"
}

# 2. 初期設定
setup_distribution_addresses() {
    print_section "2. 初期設定（分配アドレスの設定）"
    
    print_warning "この操作は主催者（Organizer）のみが実行できます"
    echo ""
    
    # 型パラメータの確認
    if [ -z "$POOL_COIN_TYPE" ]; then
        print_error "型パラメータが検出されていません"
        return 1
    fi
    
    # デフォルトアドレス（テスト用）
    FIGHTER_ADDRESS="0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353"
    GYM_ADDRESS="0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353"
    ORGANIZER_ADDRESS="0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353"
    
    read -p "Fighter Address [$FIGHTER_ADDRESS]: " input_fighter
    FIGHTER_ADDRESS=${input_fighter:-$FIGHTER_ADDRESS}
    
    read -p "Gym Address [$GYM_ADDRESS]: " input_gym
    GYM_ADDRESS=${input_gym:-$GYM_ADDRESS}
    
    read -p "Organizer Address [$ORGANIZER_ADDRESS]: " input_organizer
    ORGANIZER_ADDRESS=${input_organizer:-$ORGANIZER_ADDRESS}
    
    print_info "分配アドレスを設定中..."
    echo "  Fighter: $FIGHTER_ADDRESS"
    echo "  Gym: $GYM_ADDRESS"
    echo "  Organizer: $ORGANIZER_ADDRESS"
    echo "  Coin Type: $POOL_COIN_TYPE"
    echo ""
    
    sui client call \
        --package $PACKAGE_ID \
        --module dao_pool \
        --function change_distribution_detail \
        --type-args "$POOL_COIN_TYPE" \
        --args \
            $DAO_POOL_STATE \
            "[$FIGHTER_ADDRESS]" \
            "[$GYM_ADDRESS]" \
            "[$ORGANIZER_ADDRESS]" \
            "[]" \
            "[]" \
            "[]" \
            $CLOCK_OBJECT \
        --gas-budget $GAS_BUDGET
    
    print_success "分配アドレスの設定完了"
}

# 3. 支援機能のテスト
test_support() {
    print_section "3. 支援機能のテスト"
    
    # 型パラメータの確認
    if [ -z "$POOL_COIN_TYPE" ]; then
        print_error "型パラメータが検出されていません"
        return 1
    fi
    
    print_warning "この機能はコイン（型: $POOL_COIN_TYPE）が必要です"
    print_info "コインIDを入力してください"
    echo ""
    
    # ウォレット内の対象コインを検索
    print_info "ウォレット内の対象コイン（型: $POOL_COIN_TYPE）を検索中..."
    MATCHING_COINS=$(sui client objects --json | jq -r --arg type "$POOL_COIN_TYPE" '.[] | select(.data.type | contains($type)) | .data.objectId')
    
    if [ -n "$MATCHING_COINS" ]; then
        echo -e "${GREEN}✓ 対象コインが見つかりました${NC}"
        echo "$MATCHING_COINS" | nl
        echo ""
        
        # 最初のコインを使用
        DEFAULT_COIN_ID=$(echo "$MATCHING_COINS" | head -1)
        read -p "Coin ID [$DEFAULT_COIN_ID]: " COIN_ID
        COIN_ID=${COIN_ID:-$DEFAULT_COIN_ID}
    else
        print_warning "対象コイン（型: $POOL_COIN_TYPE）が見つかりませんでした"
        read -p "Coin ID: " COIN_ID
    fi
    
    if [ -z "$COIN_ID" ]; then
        print_error "Coin IDが入力されていません"
        return 1
    fi
    
    # コインの型を検証
    print_info "コインの型を検証中..."
    DETECTED_COIN_TYPE=$(detect_coin_type $COIN_ID)
    if [ $? -ne 0 ]; then
        print_error "コインの型を検出できませんでした"
        return 1
    fi
    
    if [ "$DETECTED_COIN_TYPE" != "$POOL_COIN_TYPE" ]; then
        print_error "型の不一致が検出されました"
        echo "DaoPoolStateの型: $POOL_COIN_TYPE"
        echo "コインの型: $DETECTED_COIN_TYPE"
        return 1
    fi
    
    print_success "コインの型が一致しました"
    echo ""
    
    print_info "支援を実行中..."
    echo "Coin Type: $POOL_COIN_TYPE"
    echo ""
    
    sui client call \
        --package $PACKAGE_ID \
        --module dao_pool \
        --function support \
        --type-args "$POOL_COIN_TYPE" \
        --args \
            $DAO_POOL_STATE \
            $NFT_STATE \
            $COIN_ID \
            $CLOCK_OBJECT \
        --gas-budget $GAS_BUDGET
    
    print_success "支援の実行完了"
    print_info "NFTが発行されました。NFT情報を確認してください（メニュー6）"
}

# 4. 分配機能のテスト
test_distribution() {
    print_section "4. 分配機能のテスト"
    
    # 型パラメータの確認
    if [ -z "$POOL_COIN_TYPE" ]; then
        print_error "型パラメータが検出されていません"
        return 1
    fi
    
    print_warning "この操作は30日間隔が経過している必要があります"
    print_warning "テスト環境では時間を進めることができないため、実際の時間経過が必要です"
    echo ""
    
    # トレジャリー残高を確認
    STATE=$(sui client object $DAO_POOL_STATE --json)
    TREASURY=$(echo $STATE | jq -r '.data.content.fields.treasury.fields.balance')
    print_info "現在のトレジャリー残高: $TREASURY (最小単位)"
    echo ""
    
    read -p "分配を実行しますか？ (y/N): " confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "分配をキャンセルしました"
        return 0
    fi
    
    print_info "分配を実行中..."
    echo "Coin Type: $POOL_COIN_TYPE"
    echo ""
    
    sui client call \
        --package $PACKAGE_ID \
        --module dao_pool \
        --function distribute \
        --type-args "$POOL_COIN_TYPE" \
        --args \
            $DAO_POOL_STATE \
            $CLOCK_OBJECT \
        --gas-budget $GAS_BUDGET
    
    print_success "分配の実行完了"
}

# 5. ボーナス分配のテスト
test_bonus_distribution() {
    print_section "5. ボーナス分配のテスト"
    
    # 型パラメータの確認
    if [ -z "$POOL_COIN_TYPE" ]; then
        print_error "型パラメータが検出されていません"
        return 1
    fi
    
    print_warning "この操作は主催者（Organizer）のみが実行できます"
    echo ""
    
    # トレジャリー残高を確認
    STATE=$(sui client object $DAO_POOL_STATE --json)
    TREASURY=$(echo $STATE | jq -r '.data.content.fields.treasury.fields.balance')
    print_info "現在のトレジャリー残高: $TREASURY (最小単位)"
    echo ""
    
    read -p "ボーナス金額（最小単位）[100000000]: " BONUS_AMOUNT
    BONUS_AMOUNT=${BONUS_AMOUNT:-100000000}
    
    if [ $BONUS_AMOUNT -gt $TREASURY ]; then
        print_error "トレジャリー残高が不足しています"
        return 1
    fi
    
    print_info "ボーナス分配を実行中... (金額: $BONUS_AMOUNT 最小単位)"
    echo "Coin Type: $POOL_COIN_TYPE"
    echo ""
    
    sui client call \
        --package $PACKAGE_ID \
        --module dao_pool \
        --function distribute_bonus \
        --type-args "$POOL_COIN_TYPE" \
        --args \
            $DAO_POOL_STATE \
            $BONUS_AMOUNT \
            $CLOCK_OBJECT \
        --gas-budget $GAS_BUDGET
    
    print_success "ボーナス分配の実行完了"
}

# 6. NFT情報の確認
check_nft_info() {
    print_section "6. NFT情報の確認"
    
    print_info "現在のアドレスが保有するNFTを検索中..."
    
    # 現在のアドレスが所有するオブジェクトを取得
    sui client objects --json | jq -r '.[] | select(.data.type | contains("member_nft::MemberNFT")) | .data.objectId' | while read nft_id; do
        echo ""
        print_info "NFT ID: $nft_id"
        sui client object $nft_id --json | jq '.data.content.fields'
    done
    
    print_success "NFT情報の確認完了"
}

# 7. 完全フローテスト
test_full_flow() {
    print_section "7. 完全フローテスト"
    
    print_info "このテストは以下の流れを実行します："
    echo "  1. コントラクト状態の確認"
    echo "  2. 支援の実行"
    echo "  3. NFT発行の確認"
    echo "  4. 分配の実行（30日後）"
    echo ""
    
    read -p "完全フローテストを実行しますか？ (y/N): " confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "テストをキャンセルしました"
        return 0
    fi
    
    # 1. 状態確認
    check_contract_state
    
    # 2. 支援実行
    test_support
    
    # 3. NFT確認
    check_nft_info
    
    print_warning "分配機能は30日間隔が必要なため、スキップします"
    print_info "手動で分配をテストする場合は、メニュー4を選択してください"
    
    print_success "完全フローテスト完了"
}

# 8. すべてのテストを実行
run_all_tests() {
    print_section "8. すべてのテストを実行"
    
    print_warning "このオプションは読み取り専用のテストのみを実行します"
    echo ""
    
    # 状態確認
    check_contract_state
    
    # NFT確認
    check_nft_info
    
    print_success "すべてのテスト完了"
}

# メインループ
main() {
    while true; do
        show_menu
        read -p "選択してください (0-8): " choice
        
        case $choice in
            1) check_contract_state ;;
            2) setup_distribution_addresses ;;
            3) test_support ;;
            4) test_distribution ;;
            5) test_bonus_distribution ;;
            6) check_nft_info ;;
            7) test_full_flow ;;
            8) run_all_tests ;;
            0) 
                echo -e "\n${GREEN}テストを終了します${NC}"
                exit 0
                ;;
            *)
                print_error "無効な選択です"
                ;;
        esac
        
        echo ""
        read -p "Enterキーを押して続行..."
    done
}

# スクリプト実行
main
