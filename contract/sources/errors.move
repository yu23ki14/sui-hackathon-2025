// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Error codes module for Champion Together platform
/// Defines all error constants used across smart contracts
module champion_together::errors {
    // ===== DaoPool Contract Errors =====
    
    /// Error: Support cap has been reached, no more contributions accepted
    /// Requirement: 9.1, 9.2
    const E_SUPPORT_CAP_REACHED: u64 = 1;
    
    /// Error: Support amount must be greater than zero
    /// Requirement: 9.2
    const E_INSUFFICIENT_AMOUNT: u64 = 2;
    
    /// Error: Distribution interval has not elapsed yet
    const E_DISTRIBUTION_TOO_EARLY: u64 = 3;
    
    /// Error: Treasury is empty, nothing to distribute
    const E_EMPTY_TREASURY: u64 = 4;
    
    /// Error: Caller is not authorized to perform this action
    /// Requirement: 9.5
    const E_UNAUTHORIZED: u64 = 5;
    
    /// Error: Distribution ratios are invalid (must sum to 100)
    const E_INVALID_RATIO: u64 = 6;
    
    /// Error: Invalid recipient address
    /// Requirement: 9.3
    const E_INVALID_ADDRESS: u64 = 7;
    
    // ===== MembersNFT Contract Errors =====
    
    /// Error: Only DaoPool contract can mint NFTs
    /// Requirement: 9.4
    const E_UNAUTHORIZED_MINTER: u64 = 101;
    
    /// Error: Support amount is invalid for NFT minting
    const E_INVALID_SUPPORT_AMOUNT: u64 = 102;
    
    /// Error: Token ID does not exist
    const E_TOKEN_NOT_FOUND: u64 = 103;
    
    /// Error: Invalid rank value
    const E_INVALID_RANK: u64 = 104;
    
    // ===== Public Getter Functions for DaoPool Errors =====
    
    /// Get support cap reached error code
    public fun e_support_cap_reached(): u64 {
        E_SUPPORT_CAP_REACHED
    }
    
    /// Get insufficient amount error code
    public fun e_insufficient_amount(): u64 {
        E_INSUFFICIENT_AMOUNT
    }
    
    /// Get distribution too early error code
    public fun e_distribution_too_early(): u64 {
        E_DISTRIBUTION_TOO_EARLY
    }
    
    /// Get empty treasury error code
    public fun e_empty_treasury(): u64 {
        E_EMPTY_TREASURY
    }
    
    /// Get unauthorized error code
    public fun e_unauthorized(): u64 {
        E_UNAUTHORIZED
    }
    
    /// Get invalid ratio error code
    public fun e_invalid_ratio(): u64 {
        E_INVALID_RATIO
    }
    
    /// Get invalid address error code
    public fun e_invalid_address(): u64 {
        E_INVALID_ADDRESS
    }
    
    // ===== Public Getter Functions for MembersNFT Errors =====
    
    /// Get unauthorized minter error code
    public fun e_unauthorized_minter(): u64 {
        E_UNAUTHORIZED_MINTER
    }
    
    /// Get invalid support amount error code
    public fun e_invalid_support_amount(): u64 {
        E_INVALID_SUPPORT_AMOUNT
    }
    
    /// Get token not found error code
    public fun e_token_not_found(): u64 {
        E_TOKEN_NOT_FOUND
    }
    
    /// Get invalid rank error code
    public fun e_invalid_rank(): u64 {
        E_INVALID_RANK
    }
}
