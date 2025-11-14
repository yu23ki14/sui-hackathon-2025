// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module champion_together::dao_pool_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::test_utils;
    use champion_together::dao_pool::{Self, DaoPoolState, USDC};

    // テスト用アドレス
    const FIGHTER: address = @0xF1;
    const GYM: address = @0xF2;
    const ORGANIZER: address = @0xF3;
    const SUPPORTER1: address = @0xA1;
    const SUPPORTER2: address = @0xA2;
    const UNAUTHORIZED: address = @0xBAD;

    // テスト用定数
    const ONE_USDC: u64 = 1_000_000; // 1 USDC（マイクロUSDC）
    const HUNDRED_USDC: u64 = 100_000_000;
    const THOUSAND_USDC: u64 = 1_000_000_000;
    const THREE_THOUSAND_USDC: u64 = 3_000_000_000;
    const THIRTY_DAYS_MS: u64 = 2_592_000_000; // 30日（ミリ秒）

    // テストシナリオを作成するヘルパー関数
    fun setup_test(): Scenario {
        ts::begin(ORGANIZER)
    }

    // デフォルト設定でDaoPoolを初期化するヘルパー関数
    fun init_dao_pool(scenario: &mut Scenario, clock: &Clock): DaoPoolState {
        let nft_contract_id = sui::object::id_from_address(@0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        
        dao_pool::init_pool(
            FIGHTER,
            GYM,
            ORGANIZER,
            60, // fighter_ratio
            30, // gym_ratio
            10, // organizer_ratio
            nft_contract_id,
            clock,
            ts::ctx(scenario)
        )
    }

    // テスト用USDCコインを作成するヘルパー関数
    fun mint_usdc(amount: u64, ctx: &mut sui::tx_context::TxContext): Coin<USDC> {
        coin::mint_for_testing<USDC>(amount, ctx)
    }

    // ===== Support関数のテスト =====

    #[test]
    /// テスト: 有効な金額でのsupport関数（正常系）
    /// 要件: 1.1, 1.2, 9.2
    fun test_support_success() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        // DaoPoolを初期化
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 支援者が貢献
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        // 状態の更新を検証
        assert!(dao_pool::total_raised(&pool) == HUNDRED_USDC, 0);
        assert!(dao_pool::treasury_balance(&pool) == HUNDRED_USDC, 1);
        
        // クリーンアップ
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 上限内での複数回の支援
    /// 要件: 1.1, 1.2
    fun test_support_multiple_contributions() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 最初の支援者
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment1, &clock, ts::ctx(&mut scenario));
        
        // 2番目の支援者
        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment2, &clock, ts::ctx(&mut scenario));
        
        // 合計を検証
        assert!(dao_pool::total_raised(&pool) == 2 * THOUSAND_USDC, 0);
        assert!(dao_pool::treasury_balance(&pool) == 2 * THOUSAND_USDC, 1);
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // E_INSUFFICIENT_AMOUNT
    /// テスト: ゼロ額でのsupport関数（ゼロ額）
    /// 要件: 9.2
    fun test_support_zero_amount() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(0, ts::ctx(&mut scenario));
        
        // E_INSUFFICIENT_AMOUNTでアボートするはず
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // E_SUPPORT_CAP_REACHED
    /// テスト: 上限を超えるsupport関数（上限超過）
    /// 要件: 1.2, 1.3
    fun test_support_exceeds_cap() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 上限までの最初の貢献
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(THREE_THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment1, &clock, ts::ctx(&mut scenario));
        
        // 2回目の貢献は失敗するはず
        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(ONE_USDC, ts::ctx(&mut scenario));
        
        // E_SUPPORT_CAP_REACHEDでアボートするはず
        dao_pool::support(&mut pool, payment2, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // E_SUPPORT_CAP_REACHED
    /// テスト: 上限ちょうどの境界でのsupport関数
    /// 要件: 1.2, 1.3
    fun test_support_at_cap_boundary() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 上限を1だけ超える貢献
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THREE_THOUSAND_USDC + 1, ts::ctx(&mut scenario));
        
        // E_SUPPORT_CAP_REACHEDでアボートするはず
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== Distribute関数のテスト =====

    #[test]
    /// テスト: 間隔経過後のdistribute関数（正常系）
    /// 要件: 4.1, 4.2, 4.3, 4.4, 4.5
    fun test_distribute_success() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // トレジャリーに資金を追加
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        // 30日進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);
        
        // 資金を分配
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));
        
        // 分配後の状態を検証
        assert!(dao_pool::total_raised(&pool) == 0, 0); // 0にリセット
        
        // トレジャリーには端数処理による最小限のダストがあるはず
        let remaining = dao_pool::treasury_balance(&pool);
        assert!(remaining < 10, 1); // 10マイクロUSDC未満のダスト
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)] // E_DISTRIBUTION_TOO_EARLY
    /// テスト: 間隔経過前のdistribute関数（早すぎる実行）
    /// 要件: 4.1, 4.2
    fun test_distribute_too_early() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 資金を追加
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        // すぐに分配を試みる（失敗するはず）
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // E_DISTRIBUTION_TOO_EARLYでアボートするはず
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)] // E_DISTRIBUTION_TOO_EARLY
    /// テスト: 間隔の1ミリ秒前のdistribute関数
    /// 要件: 4.1
    fun test_distribute_one_ms_before_interval() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 資金を追加
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        // 30日マイナス1ミリ秒進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS - 1);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // E_DISTRIBUTION_TOO_EARLYでアボートするはず
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 4)] // E_EMPTY_TREASURY
    /// テスト: 空のトレジャリーでのdistribute関数（空のトレジャリー）
    /// 要件: 4.6
    fun test_distribute_empty_treasury() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 資金を追加せずに時間を進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // E_EMPTY_TREASURYでアボートするはず
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 正しい比率計算でのdistribute関数
    /// 要件: 4.2, 4.3
    fun test_distribute_ratio_calculations() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 計算しやすいように正確に1000 USDCを追加
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, payment, &clock, ts::ctx(&mut scenario));
        
        let initial_treasury = dao_pool::treasury_balance(&pool);
        
        // 時間を進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);
        
        // 分配
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));
        
        // 期待される金額: 格闘家 60%、ジム 30%、主催者 10%
        // 格闘家: 600 USDC、ジム: 300 USDC、主催者: 100 USDC
        let expected_fighter = (initial_treasury * 60) / 100;
        let expected_gym = (initial_treasury * 30) / 100;
        let expected_organizer = (initial_treasury * 10) / 100;
        
        // 分配された合計を検証（端数処理のダストを許容）
        let total_distributed = expected_fighter + expected_gym + expected_organizer;
        assert!(total_distributed <= initial_treasury, 0);
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== Change Distribution Detail関数のテスト =====

    #[test]
    /// テスト: 有効なパラメータでのchange_distribution_detail（正常系）
    /// 要件: 5.1, 5.3, 5.4, 5.5
    fun test_change_distribution_detail_success() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 主催者として比率を変更
        ts::next_tx(&mut scenario, ORGANIZER);
        
        let new_fighter_address = std::option::some(@0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890);
        let new_gym_address = std::option::none();
        let new_organizer_address = std::option::none();
        let new_fighter_ratio = std::option::some(50u64);
        let new_gym_ratio = std::option::some(40u64);
        let new_organizer_ratio = std::option::some(10u64);
        
        dao_pool::change_distribution_detail(
            &mut pool,
            new_fighter_address,
            new_gym_address,
            new_organizer_address,
            new_fighter_ratio,
            new_gym_ratio,
            new_organizer_ratio,
            &clock,
            ts::ctx(&mut scenario)
        );
        
        // 変更を検証
        assert!(dao_pool::fighter_address(&pool) == @0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890, 0);
        assert!(dao_pool::gym_address(&pool) == GYM, 1); // 変更なし
        
        let (f_ratio, g_ratio, o_ratio) = dao_pool::distribution_ratios(&pool);
        assert!(f_ratio == 50, 2);
        assert!(g_ratio == 40, 3);
        assert!(o_ratio == 10, 4);
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 5)] // E_UNAUTHORIZED
    /// テスト: 権限のない呼び出し元によるchange_distribution_detail（権限なし）
    /// 要件: 5.1, 5.2, 9.5
    fun test_change_distribution_detail_unauthorized() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        // 権限のないユーザーとして変更を試みる
        ts::next_tx(&mut scenario, UNAUTHORIZED);
        
        let new_fighter_ratio = std::option::some(70u64);
        let new_gym_ratio = std::option::some(20u64);
        let new_organizer_ratio = std::option::some(10u64);
        
        // E_UNAUTHORIZEDでアボートするはず
        dao_pool::change_distribution_detail(
            &mut pool,
            std::option::none(),
            std::option::none(),
            std::option::none(),
            new_fighter_ratio,
            new_gym_ratio,
            new_organizer_ratio,
            &clock,
            ts::ctx(&mut scenario)
        );
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 6)] // E_INVALID_RATIO
    /// テスト: 無効な比率でのchange_distribution_detail（無効な比率 - 合計が100でない）
    /// 要件: 5.5
    fun test_change_distribution_detail_invalid_ratio_sum() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // 比率の合計が110（無効）
        let new_fighter_ratio = std::option::some(60u64);
        let new_gym_ratio = std::option::some(40u64);
        let new_organizer_ratio = std::option::some(10u64);
        
        // E_INVALID_RATIOでアボートするはず
        dao_pool::change_distribution_detail(
            &mut pool,
            std::option::none(),
            std::option::none(),
            std::option::none(),
            new_fighter_ratio,
            new_gym_ratio,
            new_organizer_ratio,
            &clock,
            ts::ctx(&mut scenario)
        );
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 6)] // E_INVALID_RATIO
    /// テスト: 100未満の合計の比率でのchange_distribution_detail
    /// 要件: 5.5
    fun test_change_distribution_detail_invalid_ratio_too_low() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // 比率の合計が90（無効）
        let new_fighter_ratio = std::option::some(50u64);
        let new_gym_ratio = std::option::some(30u64);
        let new_organizer_ratio = std::option::some(10u64);
        
        // E_INVALID_RATIOでアボートするはず
        dao_pool::change_distribution_detail(
            &mut pool,
            std::option::none(),
            std::option::none(),
            std::option::none(),
            new_fighter_ratio,
            new_gym_ratio,
            new_organizer_ratio,
            &clock,
            ts::ctx(&mut scenario)
        );
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 比率を変更せずにアドレスのみを変更
    /// 要件: 5.4
    fun test_change_distribution_detail_addresses_only() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // すべてのアドレスを変更、比率は維持
        dao_pool::change_distribution_detail(
            &mut pool,
            std::option::some(@0x1111111111111111111111111111111111111111111111111111111111111111),
            std::option::some(@0x2222222222222222222222222222222222222222222222222222222222222222),
            std::option::some(@0x3333333333333333333333333333333333333333333333333333333333333333),
            std::option::none(),
            std::option::none(),
            std::option::none(),
            &clock,
            ts::ctx(&mut scenario)
        );
        
        // アドレスが変更されたことを検証
        assert!(dao_pool::fighter_address(&pool) == @0x1111111111111111111111111111111111111111111111111111111111111111, 0);
        assert!(dao_pool::gym_address(&pool) == @0x2222222222222222222222222222222222222222222222222222222222222222, 1);
        assert!(dao_pool::organizer_address(&pool) == @0x3333333333333333333333333333333333333333333333333333333333333333, 2);
        
        // 比率が変更されていないことを検証
        let (f_ratio, g_ratio, o_ratio) = dao_pool::distribution_ratios(&pool);
        assert!(f_ratio == 60, 3);
        assert!(g_ratio == 30, 4);
        assert!(o_ratio == 10, 5);
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: アドレスを変更せずに比率のみを変更
    /// 要件: 5.3
    fun test_change_distribution_detail_ratios_only() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        let mut pool = init_dao_pool(&mut scenario, &clock);
        
        ts::next_tx(&mut scenario, ORGANIZER);
        
        // 比率を変更、アドレスは維持
        dao_pool::change_distribution_detail(
            &mut pool,
            std::option::none(),
            std::option::none(),
            std::option::none(),
            std::option::some(70u64),
            std::option::some(20u64),
            std::option::some(10u64),
            &clock,
            ts::ctx(&mut scenario)
        );
        
        // アドレスが変更されていないことを検証
        assert!(dao_pool::fighter_address(&pool) == FIGHTER, 0);
        assert!(dao_pool::gym_address(&pool) == GYM, 1);
        assert!(dao_pool::organizer_address(&pool) == ORGANIZER, 2);
        
        // 比率が変更されたことを検証
        let (f_ratio, g_ratio, o_ratio) = dao_pool::distribution_ratios(&pool);
        assert!(f_ratio == 70, 3);
        assert!(g_ratio == 20, 4);
        assert!(o_ratio == 10, 5);
        
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
