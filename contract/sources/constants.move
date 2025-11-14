// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Constants module for Champion Together platform
/// Defines USDC token address and system-wide constants
module champion_together::constants {
    // ===== USDC Token Configuration =====
    
    /// USDC Testnet token address on Sui
    /// Reference: https://testnet.suivision.xyz/coin/0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC
    const USDC_TESTNET_ADDRESS: address = @0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29;
    
    /// USDC decimal precision (6 decimals)
    const USDC_DECIMALS: u8 = 6;
    
    // ===== System Configuration =====
    
    /// Default support cap: 3,000 USDC (in micro USDC: 3,000 * 10^6)
    const DEFAULT_SUPPORT_CAP: u64 = 3_000_000_000;
    
    /// Default distribution interval: 30 days in seconds
    const DEFAULT_DISTRIBUTION_INTERVAL: u64 = 2_592_000;
    
    // ===== Member Rank Thresholds (in micro USDC) =====
    
    /// Bronze rank minimum: 10 USDC
    const BRONZE_MIN: u64 = 10_000_000;
    
    /// Silver rank minimum: 50 USDC
    const SILVER_MIN: u64 = 50_000_000;
    
    /// Gold rank minimum: 100 USDC
    const GOLD_MIN: u64 = 100_000_000;
    
    /// Platinum rank minimum: 200 USDC
    const PLATINUM_MIN: u64 = 200_000_000;
    
    // ===== Public Getter Functions =====
    
    /// Get USDC testnet token address
    public fun usdc_testnet_address(): address {
        USDC_TESTNET_ADDRESS
    }
    
    /// Get USDC decimal precision
    public fun usdc_decimals(): u8 {
        USDC_DECIMALS
    }
    
    /// Get default support cap
    public fun default_support_cap(): u64 {
        DEFAULT_SUPPORT_CAP
    }
    
    /// Get default distribution interval
    public fun default_distribution_interval(): u64 {
        DEFAULT_DISTRIBUTION_INTERVAL
    }
    
    /// Get Bronze rank minimum threshold
    public fun bronze_min(): u64 {
        BRONZE_MIN
    }
    
    /// Get Silver rank minimum threshold
    public fun silver_min(): u64 {
        SILVER_MIN
    }
    
    /// Get Gold rank minimum threshold
    public fun gold_min(): u64 {
        GOLD_MIN
    }
    
    /// Get Platinum rank minimum threshold
    public fun platinum_min(): u64 {
        PLATINUM_MIN
    }
}
