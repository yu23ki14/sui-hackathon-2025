#!/bin/bash

# Champion Together - USDC Support Function Test
# USDC型での支援機能テスト

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
echo -e "${BLUE}  USDC支援機能テスト${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# USDC_DAO_POOL_STATEが設定されているかチェック
if [ -z "$USDC_DAO_POOL_STATE" ]; then
    echo -e "${YELLOW}⚠ USDC型のDaoPoolStateが設定されていません${NC}"
    echo ""
    echo "現在の設定:"
    echo "  DAO_POOL_STATE: $DAO_POOL_STATE"
    echo ""
    
    # 現在のDaoPoolStateの型を確認
    echo "現在のDaoPoolStateの型を確認中..."
    CURRENT_POOL_TYPE=$(sui client object $DAO_POOL_STATE --json 2>/dev/null | jq -r '.type' | sed -n 's/.*DaoPoolState<\(.*\)>/\1/p')
    
    if [ -n "$CURRENT_POOL_TYPE" ]; then
        echo "  型: $CURRENT_POOL_TYPE"
        echo ""
        
        if [ "$CURRENT_POOL_TYPE" = "$USDC_TYPE" ]; then
            echo -e "${GREEN}✓ 現在のDaoPoolStateはUSDC型です${NC}"
            USDC_DAO_POOL_STATE=$DAO_POOL_STATE
        else
            echo -e "${RED}✗ 現在のDaoPoolStateはUSDC型ではありません${NC}"
            echo ""
            echo "USDC型のDaoPoolStateを作成する必要があります。"
            echo ""
            echo "オプション:"
            echo "  1) 型安全性のテストを実行（USDC→SUIプールでエラーを確認）"
            echo "  2) キャンセル"
            echo ""
            read -p "選択してください (1-2): " option
            
            case $option in
                1)
                    echo ""
                    echo -e "${YELLOW}[型安全性テスト] USDC→SUIプールでエラーを確認${NC}"
                    echo ""
                    echo "これは、ジェネリック型パラメータが正しく機能していることを"
                    echo "確認するためのテストです。USDC型のコインをSUI型のプールに"
                    echo "送ろうとすると、型の不一致エラーが発生するはずです。"
                    echo ""
                    
                    # USDCコインを検索
                    echo "USDCコインを検索中..."
                    USDC_COINS=$(sui client objects --json 2>/dev/null | jq -r --arg type "$USDC_TYPE" '.[] | select(.data.type | tostring | contains($type)) | .data.objectId')
                    
                    if [ -z "$USDC_COINS" ]; then
                        echo -e "${RED}✗ USDCコインが見つかりませんでした${NC}"
                        echo ""
                        echo "USDCコインを取得するには:"
                        echo "  1. Testnet Faucetを使用"
                        echo "  2. または、他のウォレットから転送"
                        exit 1
                    fi
                    
                    USDC_COIN_ID=$(echo "$USDC_COINS" | head -1)
                    echo -e "${GREEN}✓ USDCコイン見つかりました: $USDC_COIN_ID${NC}"
                    echo ""
                    
                    # コインの残高を確認
                    COIN_BALANCE=$(sui client object $USDC_COIN_ID --json 2>/dev/null | jq -r '.data.content.fields.balance')
                    echo "残高: $COIN_BALANCE (最小単位)"
                    echo ""
                    
                    # 少額でテスト（10 USDC = 10,000,000 最小単位）
                    TEST_AMOUNT=10000000
                    
                    echo "テスト実行:"
                    echo "  DaoPoolState (SUI型): $DAO_POOL_STATE"
                    echo "  USDCコイン: $USDC_COIN_ID"
                    echo "  金額: $TEST_AMOUNT"
                    echo ""
                    
                    read -p "型の不一致エラーを確認しますか？ (y/N): " confirm
                    
                    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
                        echo "テストをキャンセルしました"
                        exit 0
                    fi
                    
                    echo ""
                    echo "支援を実行中（エラーが予想されます）..."
                    echo ""
                    
                    # SUI型のプールにUSDCコインを送ろうとする（エラーが予想される）
                    RESULT=$(sui client call \
                        --package $PACKAGE_ID \
                        --module dao_pool \
                        --function support \
                        --type-args "$USDC_TYPE" \
                        --args \
                            $DAO_POOL_STATE \
                            $NFT_STATE \
                            $USDC_COIN_ID \
                            $CLOCK_OBJECT \
                        --gas-budget $GAS_BUDGET \
                        2>&1) || true
                    
                    if echo "$RESULT" | grep -q "TypeMismatch\|type mismatch\|type argument"; then
                        echo -e "${GREEN}✓ 型安全性テスト成功！${NC}"
                        echo ""
                        echo "予想通り、型の不一致エラーが発生しました:"
                        echo "$RESULT" | grep -i "error\|type"
                        echo ""
                        echo -e "${GREEN}これは、ジェネリック型パラメータが正しく機能していることを示しています。${NC}"
                        echo "USDC型のコインはSUI型のDaoPoolStateでは使用できません。"
                        echo ""
                        echo -e "${YELLOW}次のステップ:${NC}"
                        echo "USDC型のDaoPoolStateを作成して、実際のUSDC支援をテストしてください。"
                        echo ""
                        echo "注意: 現在、init_pool関数は共有オブジェクトを返さないため、"
                        echo "      PTB (Programmable Transaction Block) を使用して"
                        echo "      USDC型のDaoPoolStateを作成する必要があります。"
                    else
                        echo -e "${RED}✗ 予期しない結果${NC}"
                        echo ""
                        echo "結果:"
                        echo "$RESULT"
                    fi
                    
                    exit 0
                    ;;
                *)
                    echo "テストをキャンセルしました"
                    exit 0
                    ;;
            esac
        fi
    else
        echo -e "${RED}✗ DaoPoolStateの型を取得できませんでした${NC}"
        exit 1
    fi
fi

# USDC型のDaoPoolStateが設定されている場合
echo -e "${YELLOW}[1/5] DaoPoolStateの型パラメータを確認${NC}"
POOL_COIN_TYPE=$(sui client object $USDC_DAO_POOL_STATE --json 2>/dev/null | jq -r '.type' | sed -n 's/.*DaoPoolState<\(.*\)>/\1/p')

if [ -z "$POOL_COIN_TYPE" ]; then
    echo -e "${RED}✗ DaoPoolStateの型パラメータを検出できませんでした${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 検出された型: $POOL_COIN_TYPE${NC}"

if [ "$POOL_COIN_TYPE" != "$USDC_TYPE" ]; then
    echo -e "${RED}✗ エラー: DaoPoolStateの型がUSDCではありません${NC}"
    echo "  期待: $USDC_TYPE"
    echo "  実際: $POOL_COIN_TYPE"
    exit 1
fi

echo ""

# 支援前の状態を確認
echo -e "${YELLOW}[2/5] 支援前の状態を確認${NC}"
echo "DaoPoolState:"
sui client object $USDC_DAO_POOL_STATE --json 2>/dev/null | jq '.content.fields | {total_raised, support_cap, treasury}'
echo ""

# USDCコインを検索
echo -e "${YELLOW}[3/5] USDCコインを準備${NC}"
echo ""

USDC_COINS=$(sui client objects --json 2>/dev/null | jq -r --arg type "$USDC_TYPE" '.[] | select(.data.type | tostring | contains($type)) | .data.objectId')

if [ -z "$USDC_COINS" ]; then
    echo -e "${RED}✗ USDCコインが見つかりませんでした${NC}"
    echo ""
    echo "USDCコインを取得するには:"
    echo "  1. Testnet Faucetを使用"
    echo "  2. または、他のウォレットから転送"
    exit 1
fi

echo -e "${GREEN}✓ USDCコインが見つかりました${NC}"
echo "$USDC_COINS" | nl
echo ""

# 最初のコインを使用
USDC_COIN_ID=$(echo "$USDC_COINS" | head -1)
COIN_BALANCE=$(sui client object $USDC_COIN_ID --json 2>/dev/null | jq -r '.content.fields.balance')

echo "選択されたコイン: $USDC_COIN_ID"
echo "残高: $COIN_BALANCE (最小単位)"
echo ""

# 支援額を選択
echo -e "${YELLOW}[4/5] 支援額を選択${NC}"
echo "  1) 10 USDC (Bronze ランク)"
echo "  2) 50 USDC (Silver ランク)"
echo "  3) 100 USDC (Gold ランク)"
echo "  4) カスタム金額"
echo ""

read -p "選択してください (1-4): " rank_choice

case $rank_choice in
    1) AMOUNT=10000000 ;;      # 10 USDC (6 decimals)
    2) AMOUNT=50000000 ;;      # 50 USDC
    3) AMOUNT=100000000 ;;     # 100 USDC
    4) 
        read -p "金額（最小単位）を入力: " AMOUNT
        ;;
    *)
        echo "無効な選択です"
        exit 1
        ;;
esac

echo -e "${GREEN}✓ 支援額: $AMOUNT (最小単位)${NC}"
echo ""

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

# 支援を実行
echo -e "${YELLOW}[5/5] 支援を実行${NC}"
echo "Package: $PACKAGE_ID"
echo "DaoPoolState (USDC型): $USDC_DAO_POOL_STATE"
echo "NFTState: $NFT_STATE"
echo "Payment Coin: $USDC_COIN_ID"
echo "Coin Type: $USDC_TYPE"
echo "Amount: $AMOUNT (最小単位)"
echo ""

read -p "支援を実行しますか？ (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "支援をキャンセルしました"
    exit 0
fi

echo "支援を実行中..."
echo ""

RESULT=$(sui client call \
    --package $PACKAGE_ID \
    --module dao_pool \
    --function support \
    --type-args "$USDC_TYPE" \
    --args \
        $USDC_DAO_POOL_STATE \
        $NFT_STATE \
        $USDC_COIN_ID \
        $CLOCK_OBJECT \
    --gas-budget $GAS_BUDGET \
    --json 2>&1)

# エラーチェック
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ エラー: 支援の実行に失敗しました${NC}"
    echo ""
    echo "エラー詳細:"
    echo "$RESULT"
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
sui client object $USDC_DAO_POOL_STATE --json 2>/dev/null | jq '.content.fields | {total_raised, support_cap, treasury}'
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  USDC支援機能テスト完了${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
