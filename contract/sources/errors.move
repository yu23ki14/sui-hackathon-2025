// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Champion Togetherプラットフォーム用エラーコードモジュール
/// スマートコントラクト全体で使用されるすべてのエラー定数を定義
module champion_together::utils_errors {
    // ===== DaoPoolコントラクトエラー =====
    
    /// エラー: 支援上限に達しました。これ以上の貢献は受け付けられません
    /// 要件: 9.1, 9.2
    const E_SUPPORT_CAP_REACHED: u64 = 1;
    
    /// エラー: 支援額はゼロより大きい必要があります
    /// 要件: 9.2
    const E_INSUFFICIENT_AMOUNT: u64 = 2;
    
    /// エラー: 分配間隔がまだ経過していません
    const E_DISTRIBUTION_TOO_EARLY: u64 = 3;
    
    /// エラー: トレジャリーが空です。分配するものがありません
    const E_EMPTY_TREASURY: u64 = 4;
    
    /// エラー: 呼び出し元はこのアクションを実行する権限がありません
    /// 要件: 9.5
    const E_UNAUTHORIZED: u64 = 5;
    
    /// エラー: 分配比率が無効です（合計が100である必要があります）
    const E_INVALID_RATIO: u64 = 6;
    
    /// エラー: 無効な受取人アドレス
    /// 要件: 9.3
    const E_INVALID_ADDRESS: u64 = 7;
    
    // ===== MembersNFTコントラクトエラー =====
    
    /// エラー: DaoPoolコントラクトのみがNFTをミントできます
    /// 要件: 9.4
    const E_UNAUTHORIZED_MINTER: u64 = 101;
    
    /// エラー: NFTミントに対して支援額が無効です
    const E_INVALID_SUPPORT_AMOUNT: u64 = 102;
    
    /// エラー: トークンIDが存在しません
    const E_TOKEN_NOT_FOUND: u64 = 103;
    
    /// エラー: 無効なランク値
    const E_INVALID_RANK: u64 = 104;
    
    // ===== DaoPoolエラー用パブリックゲッター関数 =====
    
    /// 支援上限到達エラーコードを取得
    public fun e_support_cap_reached(): u64 {
        E_SUPPORT_CAP_REACHED
    }
    
    /// 不十分な金額エラーコードを取得
    public fun e_insufficient_amount(): u64 {
        E_INSUFFICIENT_AMOUNT
    }
    
    /// 分配が早すぎるエラーコードを取得
    public fun e_distribution_too_early(): u64 {
        E_DISTRIBUTION_TOO_EARLY
    }
    
    /// 空のトレジャリーエラーコードを取得
    public fun e_empty_treasury(): u64 {
        E_EMPTY_TREASURY
    }
    
    /// 権限なしエラーコードを取得
    public fun e_unauthorized(): u64 {
        E_UNAUTHORIZED
    }
    
    /// 無効な比率エラーコードを取得
    public fun e_invalid_ratio(): u64 {
        E_INVALID_RATIO
    }
    
    /// 無効なアドレスエラーコードを取得
    public fun e_invalid_address(): u64 {
        E_INVALID_ADDRESS
    }
    
    // ===== MembersNFTエラー用パブリックゲッター関数 =====
    
    /// 権限のないミンターエラーコードを取得
    public fun e_unauthorized_minter(): u64 {
        E_UNAUTHORIZED_MINTER
    }
    
    /// 無効な支援額エラーコードを取得
    public fun e_invalid_support_amount(): u64 {
        E_INVALID_SUPPORT_AMOUNT
    }
    
    /// トークンが見つからないエラーコードを取得
    public fun e_token_not_found(): u64 {
        E_TOKEN_NOT_FOUND
    }
    
    /// 無効なランクエラーコードを取得
    public fun e_invalid_rank(): u64 {
        E_INVALID_RANK
    }
}
