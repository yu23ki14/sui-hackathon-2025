// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Champion Togetherプラットフォーム用定数モジュール
/// USDCトークンアドレスとシステム全体の定数を定義
module champion_together::utils_constants {
    // ===== USDCトークン設定 =====
    
    /// Sui上のUSDC Testnetトークンアドレス
    /// 参照: https://testnet.suivision.xyz/coin/0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC
    const USDC_TESTNET_ADDRESS: address = @0xa09fd1f4c7cfafcafdec341cd971c28621b451c8a60b950a92685d64cf1f1e0a;
    
    /// USDC小数点精度（6桁）
    const USDC_DECIMALS: u8 = 6;
    
    // ===== システム設定 =====
    
    /// デフォルト支援上限: 3,000 USDC（マイクロUSDC: 3,000 * 10^6）
    const DEFAULT_SUPPORT_CAP: u64 = 3_000_000_000;
    
    /// デフォルト分配間隔: 30日（秒単位）
    const DEFAULT_DISTRIBUTION_INTERVAL: u64 = 2_592_000;
    
    // ===== メンバーランク閾値（マイクロUSDC） =====
    
    /// ブロンズランク最小値: 10 USDC
    const BRONZE_MIN: u64 = 10_000_000;
    
    /// シルバーランク最小値: 50 USDC
    const SILVER_MIN: u64 = 50_000_000;
    
    /// ゴールドランク最小値: 100 USDC
    const GOLD_MIN: u64 = 100_000_000;
    
    /// プラチナランク最小値: 200 USDC
    const PLATINUM_MIN: u64 = 200_000_000;
    
    // ===== パブリックゲッター関数 =====
    
    /// USDC testnetトークンアドレスを取得
    public fun usdc_testnet_address(): address {
        USDC_TESTNET_ADDRESS
    }
    
    /// USDC小数点精度を取得
    public fun usdc_decimals(): u8 {
        USDC_DECIMALS
    }
    
    /// デフォルト支援上限を取得
    public fun default_support_cap(): u64 {
        DEFAULT_SUPPORT_CAP
    }
    
    /// デフォルト分配間隔を取得
    public fun default_distribution_interval(): u64 {
        DEFAULT_DISTRIBUTION_INTERVAL
    }
    
    /// ブロンズランク最小閾値を取得
    public fun bronze_min(): u64 {
        BRONZE_MIN
    }
    
    /// シルバーランク最小閾値を取得
    public fun silver_min(): u64 {
        SILVER_MIN
    }
    
    /// ゴールドランク最小閾値を取得
    public fun gold_min(): u64 {
        GOLD_MIN
    }
    
    /// プラチナランク最小閾値を取得
    public fun platinum_min(): u64 {
        PLATINUM_MIN
    }
}
