#!/bin/bash

# Champion Together - Environment Variables Loader
# このスクリプトは.envファイルから環境変数を読み込みます

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# .envファイルはcontractディレクトリに配置
ENV_FILE="$SCRIPT_DIR/../.env"

# .envファイルが存在するかチェック
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp $SCRIPT_DIR/../.env.example $SCRIPT_DIR/../.env"
    exit 1
fi

# .envファイルを読み込む
# コメント行と空行をスキップ
while IFS='=' read -r key value; do
    # コメント行と空行をスキップ
    if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
        continue
    fi
    
    # 前後の空白を削除
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # 環境変数として設定
    export "$key=$value"
done < "$ENV_FILE"

# 必須の環境変数をチェック
check_required_vars() {
    local missing_vars=()
    
    if [ -z "$PACKAGE_ID" ]; then
        missing_vars+=("PACKAGE_ID")
    fi
    
    if [ -z "$DAO_POOL_STATE" ]; then
        missing_vars+=("DAO_POOL_STATE")
    fi
    
    if [ -z "$NFT_STATE" ]; then
        missing_vars+=("NFT_STATE")
    fi
    
    if [ -z "$CLOCK_OBJECT" ]; then
        missing_vars+=("CLOCK_OBJECT")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo "Error: Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please configure them in $ENV_FILE"
        exit 1
    fi
}

# 環境変数をチェック
check_required_vars

# デフォルト値を設定
export SUI_NETWORK=${SUI_NETWORK:-testnet}
export GAS_BUDGET=${GAS_BUDGET:-10000000}

# 読み込み成功メッセージ（オプション）
if [ "${VERBOSE:-false}" = "true" ]; then
    echo "✓ Environment variables loaded from $ENV_FILE"
    echo "  PACKAGE_ID: $PACKAGE_ID"
    echo "  DAO_POOL_STATE: $DAO_POOL_STATE"
    echo "  NFT_STATE: $NFT_STATE"
    echo "  SUI_NETWORK: $SUI_NETWORK"
    echo "  GAS_BUDGET: $GAS_BUDGET"
    echo ""
fi
