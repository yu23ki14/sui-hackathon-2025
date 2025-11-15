#!/bin/bash

# Champion Together - Support Function Test Script
# 支援機能の詳細テスト

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
    # .type または .data.type のどちらかを試す
    local coin_type=$(echo "$coin_info" | jq -r '.type // .data.type' | sed -n 's/.*Coin<\(.*\)>/\1/p')
    
    if [ -z "$coin_type" ]; then
        echo -e "${RED}✗ エラー: コインオブジェクトから型を検出できませんでした${NC}" >&2
        echo "オブジェクトタイプ: $(echo "$coin_info" | jq -r '.type // .data.type')" >&2
        return 1
    fi
    
    echo "$coin_type"
    return 0
}

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
    # .type または .data.type のどちらかを試す
    local pool_type=$(echo "$pool_info" | jq -r '.type // .data.type' | sed -n 's/.*DaoPoolState<\(.*\)>/\1/p')
    
    if [ -z "$pool_type" ]; then
        echo -e "${RED}✗ エラー: DaoPoolStateから型パラメータを検出できませんでした${NC}" >&2
        echo "オブジェクトタイプ: $(echo "$pool_info" | jq -r '.type // .data.type')" >&2
        return 1
    fi
    
    echo "$pool_type"
    return 0
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  支援機能テスト${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# DaoPoolStateの型パラメータを検出
echo -e "${YELLOW}[1/5] DaoPoolStateの型パラメータを検出${NC}"
POOL_COIN_TYPE=$(detect_pool_coin_type $DAO_POOL_STATE)
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ DaoPoolStateの型パラメータを検出できませんでした${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 検出された型: $POOL_COIN_TYPE${NC}"
echo ""

# 支援前の状態を確認
echo -e "${YELLOW}[2/5] 支援前の状態を確認${NC}"
echo "DaoPoolState:"
sui client object $DAO_POOL_STATE --json | jq '(.content.fields // .data.content.fields) | {total_raised, support_cap, treasury}'
echo ""

# 支援額を選択
echo -e "${YELLOW}[3/5] 支援額を選択${NC}"
echo "  1) 10 トークン (Bronze ランク)"
echo "  2) 50 トークン (Silver ランク)"
echo "  3) 100 トークン (Gold ランク)"
echo "  4) 200 トークン (Platinum ランク)"
echo "  5) カスタム金額"
echo ""

read -p "選択してください (1-5): " rank_choice

case $rank_choice in
    1) AMOUNT=10000000 ;;      # 10 tokens (6 decimals)
    2) AMOUNT=50000000 ;;      # 50 tokens
    3) AMOUNT=100000000 ;;     # 100 tokens
    4) AMOUNT=200000000 ;;     # 200 tokens
    5) 
        read -p "金額（最小単位）を入力: " AMOUNT
        ;;
    *)
        echo "無効な選択です"
        exit 1
        ;;
esac

echo -e "${GREEN}✓ 支援額: $AMOUNT (最小単位)${NC}"
echo ""

# コインを準備
echo -e "${YELLOW}[4/5] コインを準備${NC}"
echo ""

# まず、ウォレット内の対象コインを検索
echo "ウォレット内の対象コイン（型: $POOL_COIN_TYPE）を検索中..."
MATCHING_COINS=$(sui client objects --json | jq -r --arg type "$POOL_COIN_TYPE" '.[] | select((.type // .data.type) | contains($type)) | (.objectId // .data.objectId)')

if [ -n "$MATCHING_COINS" ]; then
    echo -e "${GREEN}✓ 対象コインが見つかりました${NC}"
    echo "$MATCHING_COINS" | nl
    echo ""
    
    # 最初のコインを使用
    PAYMENT_COIN_ID=$(echo "$MATCHING_COINS" | head -1)
    
    # コインの残高を確認
    COIN_BALANCE=$(sui client object $PAYMENT_COIN_ID --json | jq -r '.content.fields.balance // .data.content.fields.balance')
    echo "選択されたコイン: $PAYMENT_COIN_ID"
    echo "残高: $COIN_BALANCE (最小単位)"
    echo ""
    
    # コインの型を検証
    DETECTED_COIN_TYPE=$(detect_coin_type $PAYMENT_COIN_ID)
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ コインの型を検出できませんでした${NC}"
        exit 1
    fi
    
    if [ "$DETECTED_COIN_TYPE" != "$POOL_COIN_TYPE" ]; then
        echo -e "${RED}✗ エラー: 型の不一致が検出されました${NC}"
        echo "DaoPoolStateの型: $POOL_COIN_TYPE"
        echo "コインの型: $DETECTED_COIN_TYPE"
        echo ""
        echo "解決方法:"
        echo "  1. DaoPoolStateと同じ型のコインを使用してください"
        echo "  2. または、正しい型のDaoPoolStateを使用してください"
        exit 1
    fi
    
    if [ "$COIN_BALANCE" -lt "$AMOUNT" ]; then
        echo -e "${YELLOW}⚠ 警告: コインの残高が不足しています${NC}"
        echo "必要: $AMOUNT (最小単位)"
        echo "残高: $COIN_BALANCE (最小単位)"
        echo ""
        read -p "それでも続行しますか？ (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            echo "テストをキャンセルしました"
            exit 0
        fi
    fi
else
    echo -e "${YELLOW}⚠ 対象コイン（型: $POOL_COIN_TYPE）が見つかりませんでした${NC}"
    echo ""
    echo "オプション:"
    echo "  1) 手動でコインIDを入力"
    echo "  2) キャンセル"
    echo ""
    read -p "選択してください (1-2): " option
    
    case $option in
        1)
            read -p "Coin Object ID を入力: " PAYMENT_COIN_ID
            if [ -z "$PAYMENT_COIN_ID" ]; then
                echo "コインIDが入力されませんでした"
                exit 1
            fi
            
            # 入力されたコインの型を検証
            DETECTED_COIN_TYPE=$(detect_coin_type $PAYMENT_COIN_ID)
            if [ $? -ne 0 ]; then
                echo -e "${RED}✗ コインの型を検出できませんでした${NC}"
                exit 1
            fi
            
            if [ "$DETECTED_COIN_TYPE" != "$POOL_COIN_TYPE" ]; then
                echo -e "${RED}✗ エラー: 型の不一致が検出されました${NC}"
                echo "DaoPoolStateの型: $POOL_COIN_TYPE"
                echo "入力されたコインの型: $DETECTED_COIN_TYPE"
                echo ""
                echo "解決方法:"
                echo "  1. DaoPoolStateと同じ型のコインを使用してください"
                echo "  2. または、正しい型のDaoPoolStateを使用してください"
                exit 1
            fi
            
            echo -e "${GREEN}✓ コインの型が一致しました${NC}"
            ;;
        *)
            echo "テストをキャンセルしました"
            exit 0
            ;;
    esac
fi

echo ""

# 支援を実行
echo -e "${YELLOW}[5/5] 支援を実行${NC}"
echo "Package: $PACKAGE_ID"
echo "DaoPoolState: $DAO_POOL_STATE"
echo "NFTState: $NFT_STATE"
echo "Payment Coin: $PAYMENT_COIN_ID"
echo "Coin Type: $POOL_COIN_TYPE"
echo "Amount: $AMOUNT (最小単位)"
echo ""

read -p "支援を実行しますか？ (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "支援をキャンセルしました"
    exit 0
fi

echo "支援を実行中..."
echo "コマンド: sui client call --type-args \"$POOL_COIN_TYPE\" ..."
echo ""

RESULT=$(sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function support \
    --type-args "$POOL_COIN_TYPE" \
    --args \
        $DAO_POOL_STATE \
        $NFT_STATE \
        $PAYMENT_COIN_ID \
        $CLOCK_OBJECT \
    --gas-budget $GAS_BUDGET \
    --json 2>&1)

# エラーチェック
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ エラー: 支援の実行に失敗しました${NC}"
    echo ""
    echo "エラー詳細:"
    echo "$RESULT"
    echo ""
    
    # TypeMismatchエラーの場合は詳細な説明を表示
    if echo "$RESULT" | grep -q "TypeMismatch\|type mismatch"; then
        echo -e "${YELLOW}型の不一致エラーが発生しました${NC}"
        echo ""
        echo "考えられる原因:"
        echo "  1. DaoPoolStateの型パラメータとコインの型が一致していない"
        echo "  2. --type-args で指定した型が正しくない"
        echo ""
        echo "確認事項:"
        echo "  - DaoPoolStateの型: $POOL_COIN_TYPE"
        echo "  - 使用したコインID: $PAYMENT_COIN_ID"
        echo ""
        echo "解決方法:"
        echo "  1. sui client object $DAO_POOL_STATE --json | jq '.data.type'"
        echo "     でDaoPoolStateの正確な型を確認"
        echo "  2. sui client object $PAYMENT_COIN_ID --json | jq '.data.type'"
        echo "     でコインの正確な型を確認"
        echo "  3. 両方の型が一致することを確認"
    fi
    
    exit 1
fi

echo ""
echo -e "${GREEN}✓ 支援が完了しました！${NC}"
echo ""

# トランザクション結果を表示
TX_DIGEST=$(echo $RESULT | jq -r '.digest')
echo "Transaction Digest: $TX_DIGEST"
echo "Explorer: https://testnet.suivision.xyz/txblock/$TX_DIGEST"
echo ""

# 発行されたNFTを確認
echo "発行されたNFT:"
echo $RESULT | jq '.objectChanges[] | select(.objectType | contains("MemberNFT"))'
echo ""

# 支援後の状態を確認
echo "支援後のDaoPoolState:"
sui client object $DAO_POOL_STATE --json | jq '(.content.fields // .data.content.fields) | {total_raised, support_cap, treasury}'
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  支援機能テスト完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
