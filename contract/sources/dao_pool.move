// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Champion Togetherプラットフォーム用DaoPoolコントラクト
/// 支援金の管理と格闘家、ジム、主催者への自動分配を行う
module champion_together::dao_pool {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::transfer;
    use std::option::Option;
    use champion_together::utils_constants as constants;

    // ===== エラー定数 =====
    const E_SUPPORT_CAP_REACHED: u64 = 1;
    const E_INSUFFICIENT_AMOUNT: u64 = 2;
    const E_DISTRIBUTION_TOO_EARLY: u64 = 3;
    const E_EMPTY_TREASURY: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_INVALID_RATIO: u64 = 6;

    // ===== 構造体 =====

    /// DaoPoolコントラクトのメイン状態オブジェクト
    /// 支援金、分配設定、受取人情報を管理
    public struct DaoPoolState has key {
        id: UID,
        /// 現在の分配サイクルで集まった総額（マイクロUSDC）
        total_raised: u64,
        /// 支援上限額（デフォルト: 3,000 USDC = 3,000,000,000 マイクロUSDC）
        support_cap: u64,
        /// 最後の分配のタイムスタンプ（Unixタイムスタンプ、ミリ秒）
        last_distribution: u64,
        /// 分配間隔（ミリ秒）（デフォルト: 30日 = 2,592,000,000 ms）
        distribution_interval: u64,
        /// 格闘家のウォレットアドレス
        fighter_address: address,
        /// ジムのウォレットアドレス
        gym_address: address,
        /// 主催者のウォレットアドレス
        organizer_address: address,
        /// 格闘家の分配比率（例: 60 = 60%）
        fighter_ratio: u64,
        /// ジムの分配比率（例: 30 = 30%）
        gym_ratio: u64,
        /// 主催者の分配比率（例: 10 = 10%）
        organizer_ratio: u64,
        /// USDCを保持するトレジャリー残高
        treasury: Balance<USDC>,
    }

    /// プレースホルダーUSDC型 - 実際のUSDCトークン型に置き換えられる
    public struct USDC has drop {}

    // ===== イベント =====

    /// 支援者が貢献した際に発行されるイベント
    public struct SupportEvent has copy, drop {
        supporter: address,
        amount: u64,
        timestamp: u64,
    }

    /// 資金が分配された際に発行されるイベント
    public struct DistributionEvent has copy, drop {
        total_amount: u64,
        fighter_amount: u64,
        gym_amount: u64,
        organizer_amount: u64,
        timestamp: u64,
    }

    /// 分配設定が変更された際に発行されるイベント
    public struct ConfigChangeEvent has copy, drop {
        changed_by: address,
        timestamp: u64,
    }

    // ===== パブリック関数 =====

    /// 新しいDaoPool状態を初期化
    /// コントラクトデプロイ時に一度だけ呼び出される
    public fun init_pool(
        fighter_address: address,
        gym_address: address,
        organizer_address: address,
        fighter_ratio: u64,
        gym_ratio: u64,
        organizer_ratio: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): DaoPoolState {
        // 比率の合計が100であることを検証
        assert!(fighter_ratio + gym_ratio + organizer_ratio == 100, E_INVALID_RATIO);

        DaoPoolState {
            id: object::new(ctx),
            total_raised: 0,
            support_cap: constants::default_support_cap(),
            last_distribution: clock::timestamp_ms(clock),
            distribution_interval: constants::default_distribution_interval() * 1000, // 秒をミリ秒に変換
            fighter_address,
            gym_address,
            organizer_address,
            fighter_ratio,
            gym_ratio,
            organizer_ratio,
            treasury: balance::zero<USDC>(),
        }
    }

    /// モジュール初期化関数 - パッケージ公開時に自動実行
    /// DaoPoolStateを共有オブジェクトとして作成
    /// 注: 初期値は後でupdate_config関数で変更可能
    fun init(ctx: &mut TxContext) {
        // デフォルト値で初期化（後で変更可能）
        let state = DaoPoolState {
            id: object::new(ctx),
            total_raised: 0,
            support_cap: constants::default_support_cap(),
            last_distribution: 0, // 初回は0
            distribution_interval: constants::default_distribution_interval() * 1000,
            fighter_address: @0x0, // ダミーアドレス
            gym_address: @0x0,
            organizer_address: @0x0,
            fighter_ratio: 60,
            gym_ratio: 30,
            organizer_ratio: 10,
            treasury: balance::zero<USDC>(),
        };
        transfer::share_object(state);
    }

    /// 支援関数 - 支援者からのUSDC貢献を受け付ける
    /// 金額と上限を検証し、トレジャリーに追加し、NFTミントをトリガー
    /// 要件: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2
    public entry fun support(
        state: &mut DaoPoolState,
        nft_state: &mut champion_together::member_nft::MembersNFTState,
        payment: Coin<USDC>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        use champion_together::member_nft;

        let amount = coin::value(&payment);
        let supporter = tx_context::sender(ctx);

        // 要件 9.2: 金額がゼロより大きいことを検証
        assert!(amount > 0, E_INSUFFICIENT_AMOUNT);

        // 要件 1.2, 1.3: 支援上限を超えていないことを検証
        assert!(state.total_raised + amount <= state.support_cap, E_SUPPORT_CAP_REACHED);

        // 要件 1.1: USDCをトレジャリーに追加
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut state.treasury, payment_balance);

        // 総額を更新
        state.total_raised = state.total_raised + amount;

        // 要件 1.5: 支援イベントを発行
        event::emit(SupportEvent {
            supporter,
            amount,
            timestamp: clock::timestamp_ms(clock),
        });

        // 要件 1.4: MembersNFTをミント
        member_nft::mint(nft_state, amount, supporter, clock, ctx);
    }

    /// 分配関数 - トレジャリー資金を受取人に分配
    /// 分配間隔が経過した後にのみ呼び出し可能
    /// 要件: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
    public entry fun distribute(
        state: &mut DaoPoolState,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        
        // 要件 4.1: 分配間隔が経過したことを検証
        assert!(
            current_time >= state.last_distribution + state.distribution_interval,
            E_DISTRIBUTION_TOO_EARLY
        );
        
        let treasury_balance = balance::value(&state.treasury);
        
        // 要件 4.6: トレジャリーが空でないことを検証
        assert!(treasury_balance > 0, E_EMPTY_TREASURY);
        
        // 要件 4.2: 比率に基づいて分配額を計算
        let fighter_amount = (treasury_balance * state.fighter_ratio) / 100;
        let gym_amount = (treasury_balance * state.gym_ratio) / 100;
        let organizer_amount = (treasury_balance * state.organizer_ratio) / 100;
        
        // 要件 4.3: 各受取人に転送
        // トレジャリーからコインを抽出して転送
        let fighter_balance = balance::split(&mut state.treasury, fighter_amount);
        let fighter_coin = coin::from_balance(fighter_balance, ctx);
        transfer::public_transfer(fighter_coin, state.fighter_address);
        
        let gym_balance = balance::split(&mut state.treasury, gym_amount);
        let gym_coin = coin::from_balance(gym_balance, ctx);
        transfer::public_transfer(gym_coin, state.gym_address);
        
        let organizer_balance = balance::split(&mut state.treasury, organizer_amount);
        let organizer_coin = coin::from_balance(organizer_balance, ctx);
        transfer::public_transfer(organizer_coin, state.organizer_address);
        
        // 端数処理による残りのダストを処理
        // これは次回の分配のためにトレジャリーに残る
        
        // 要件 4.4: total_raisedをリセット
        state.total_raised = 0;
        
        // 最後の分配タイムスタンプを更新
        state.last_distribution = current_time;
        
        // 要件 4.5: 分配イベントを発行
        event::emit(DistributionEvent {
            total_amount: fighter_amount + gym_amount + organizer_amount,
            fighter_amount,
            gym_amount,
            organizer_amount,
            timestamp: current_time,
        });
    }

    /// 分配詳細変更 - 受取人アドレスおよび/または分配比率を更新
    /// 主催者のみが呼び出し可能
    /// 要件: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.5
    public entry fun change_distribution_detail(
        state: &mut DaoPoolState,
        new_fighter_address: Option<address>,
        new_gym_address: Option<address>,
        new_organizer_address: Option<address>,
        new_fighter_ratio: Option<u64>,
        new_gym_ratio: Option<u64>,
        new_organizer_ratio: Option<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        use sui::tx_context;
        use std::option;
        
        let caller = tx_context::sender(ctx);
        
        // 要件 5.1, 9.5: 呼び出し元が主催者であることを検証
        assert!(caller == state.organizer_address, E_UNAUTHORIZED);
        
        // 要件 5.4: 指定されている場合はアドレスを更新
        if (option::is_some(&new_fighter_address)) {
            state.fighter_address = option::destroy_some(new_fighter_address);
        } else {
            option::destroy_none(new_fighter_address);
        };
        
        if (option::is_some(&new_gym_address)) {
            state.gym_address = option::destroy_some(new_gym_address);
        } else {
            option::destroy_none(new_gym_address);
        };
        
        if (option::is_some(&new_organizer_address)) {
            state.organizer_address = option::destroy_some(new_organizer_address);
        } else {
            option::destroy_none(new_organizer_address);
        };
        
        // 要件 5.3: 指定されている場合は比率を更新
        let mut fighter_ratio = state.fighter_ratio;
        let mut gym_ratio = state.gym_ratio;
        let mut organizer_ratio = state.organizer_ratio;
        
        if (option::is_some(&new_fighter_ratio)) {
            fighter_ratio = option::destroy_some(new_fighter_ratio);
        } else {
            option::destroy_none(new_fighter_ratio);
        };
        
        if (option::is_some(&new_gym_ratio)) {
            gym_ratio = option::destroy_some(new_gym_ratio);
        } else {
            option::destroy_none(new_gym_ratio);
        };
        
        if (option::is_some(&new_organizer_ratio)) {
            organizer_ratio = option::destroy_some(new_organizer_ratio);
        } else {
            option::destroy_none(new_organizer_ratio);
        };
        
        // 要件 5.5: 比率の合計が100であることを検証
        assert!(fighter_ratio + gym_ratio + organizer_ratio == 100, E_INVALID_RATIO);
        
        // 新しい比率で状態を更新
        state.fighter_ratio = fighter_ratio;
        state.gym_ratio = gym_ratio;
        state.organizer_ratio = organizer_ratio;
        
        // 要件 5.6: 設定変更イベントを発行
        event::emit(ConfigChangeEvent {
            changed_by: caller,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ===== ビュー関数 =====

    /// 総調達額を取得
    public fun total_raised(state: &DaoPoolState): u64 {
        state.total_raised
    }

    /// 支援上限額を取得
    public fun support_cap(state: &DaoPoolState): u64 {
        state.support_cap
    }

    /// トレジャリー残高を取得
    public fun treasury_balance(state: &DaoPoolState): u64 {
        balance::value(&state.treasury)
    }

    /// 最後の分配タイムスタンプを取得
    public fun last_distribution(state: &DaoPoolState): u64 {
        state.last_distribution
    }

    /// 分配間隔を取得
    public fun distribution_interval(state: &DaoPoolState): u64 {
        state.distribution_interval
    }

    /// 格闘家アドレスを取得
    public fun fighter_address(state: &DaoPoolState): address {
        state.fighter_address
    }

    /// ジムアドレスを取得
    public fun gym_address(state: &DaoPoolState): address {
        state.gym_address
    }

    /// 主催者アドレスを取得
    public fun organizer_address(state: &DaoPoolState): address {
        state.organizer_address
    }

    /// 分配比率を取得
    public fun distribution_ratios(state: &DaoPoolState): (u64, u64, u64) {
        (state.fighter_ratio, state.gym_ratio, state.organizer_ratio)
    }
}
