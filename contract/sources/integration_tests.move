// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// 統合テスト - DaoPoolとMembersNFTの連携をテスト
/// 要件: 1.4, 4.3, 4.4, 4.5
#[test_only]
module champion_together::integration_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::test_utils;
    use champion_together::dao_pool::{Self, DaoPoolState, USDC};
    use champion_together::member_nft::{Self, MembersNFTState, MemberNFT};
    use std::string;

    // テスト用アドレス
    const FIGHTER: address = @0xF1;
    const GYM: address = @0xF2;
    const ORGANIZER: address = @0xF3;
    const SUPPORTER1: address = @0xA1;
    const SUPPORTER2: address = @0xA2;
    const SUPPORTER3: address = @0xA3;

    // テスト用定数
    const ONE_USDC: u64 = 1_000_000;
    const TEN_USDC: u64 = 10_000_000;
    const FIFTY_USDC: u64 = 50_000_000;
    const HUNDRED_USDC: u64 = 100_000_000;
    const TWO_HUNDRED_USDC: u64 = 200_000_000;
    const FIVE_HUNDRED_USDC: u64 = 500_000_000;
    const THOUSAND_USDC: u64 = 1_000_000_000;
    const THREE_THOUSAND_USDC: u64 = 3_000_000_000;
    const THIRTY_DAYS_MS: u64 = 2_592_000_000;

    // ===== ヘルパー関数 =====

    fun setup_test(): Scenario {
        ts::begin(ORGANIZER)
    }

    fun init_dao_pool(scenario: &mut Scenario, clock: &Clock): DaoPoolState {
        dao_pool::init_pool(
            FIGHTER,
            GYM,
            ORGANIZER,
            60, // fighter_ratio
            30, // gym_ratio
            10, // organizer_ratio
            clock,
            ts::ctx(scenario)
        )
    }

    fun mint_usdc(amount: u64, ctx: &mut sui::tx_context::TxContext): Coin<USDC> {
        coin::mint_for_testing<USDC>(amount, ctx)
    }

    // ===== 統合テスト: support → mint の連携 =====

    #[test]
    /// テスト: support関数がNFTを正しくミントすることを確認
    /// 要件: 1.4
    fun test_support_mints_nft() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        // DaoPoolとNFT状態を初期化
        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 支援者が100 USDCを支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment, &clock, ts::ctx(&mut scenario));

        // DaoPoolの状態を検証
        assert!(dao_pool::total_raised(&pool) == HUNDRED_USDC, 0);
        assert!(dao_pool::treasury_balance(&pool) == HUNDRED_USDC, 1);

        // NFTが発行されたことを検証
        assert!(member_nft::total_supply(&nft_state) == 1, 2);

        // 支援者がNFTを受け取ったことを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        let nft = ts::take_from_sender<MemberNFT>(&scenario);

        // NFTの詳細を検証
        assert!(member_nft::token_id(&nft) == 1, 3);
        assert!(member_nft::support_amount(&nft) == HUNDRED_USDC, 4);
        assert!(member_nft::get_rank(&nft) == string::utf8(b"Gold"), 5);

        // クリーンアップ
        test_utils::destroy(nft);
        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 異なる金額の支援が正しいランクのNFTをミントすることを確認
    /// 要件: 1.4
    fun test_support_mints_correct_ranks() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // Bronze: 10 USDC
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(TEN_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        // Silver: 50 USDC
        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(FIFTY_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        // Platinum: 200 USDC
        ts::next_tx(&mut scenario, SUPPORTER3);
        let payment3 = mint_usdc(TWO_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment3, &clock, ts::ctx(&mut scenario));

        // 3つのNFTが発行されたことを確認
        assert!(member_nft::total_supply(&nft_state) == 3, 0);

        // SUPPORTER1のBronze NFTを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Bronze"), 1);
            assert!(member_nft::support_amount(&nft) == TEN_USDC, 2);
            test_utils::destroy(nft);
        };

        // SUPPORTER2のSilver NFTを確認
        ts::next_tx(&mut scenario, SUPPORTER2);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Silver"), 3);
            assert!(member_nft::support_amount(&nft) == FIFTY_USDC, 4);
            test_utils::destroy(nft);
        };

        // SUPPORTER3のPlatinum NFTを確認
        ts::next_tx(&mut scenario, SUPPORTER3);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Platinum"), 5);
            assert!(member_nft::support_amount(&nft) == TWO_HUNDRED_USDC, 6);
            test_utils::destroy(nft);
        };

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== 統合テスト: 複数回の支援とNFT発行 =====

    #[test]
    /// テスト: 同じ支援者が複数回支援し、複数のNFTを受け取ることを確認
    /// 要件: 1.4
    fun test_multiple_supports_multiple_nfts() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 1回目の支援: 50 USDC (Silver)
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(FIFTY_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        // 1つ目のNFTを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft1 = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft1) == 1, 2);
            assert!(member_nft::get_rank(&nft1) == string::utf8(b"Silver"), 3);
            test_utils::destroy(nft1);
        };

        // 2回目の支援: 100 USDC (Gold)
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment2 = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        // 2つ目のNFTを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft2 = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft2) == 2, 4);
            assert!(member_nft::get_rank(&nft2) == string::utf8(b"Gold"), 5);
            test_utils::destroy(nft2);
        };

        // 3回目の支援: 200 USDC (Platinum)
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment3 = mint_usdc(TWO_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment3, &clock, ts::ctx(&mut scenario));

        // 3つ目のNFTを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft3 = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft3) == 3, 6);
            assert!(member_nft::get_rank(&nft3) == string::utf8(b"Platinum"), 7);
            test_utils::destroy(nft3);
        };

        // 総支援額を検証
        let total_supported = FIFTY_USDC + HUNDRED_USDC + TWO_HUNDRED_USDC;
        assert!(dao_pool::total_raised(&pool) == total_supported, 0);

        // 3つのNFTが発行されたことを確認
        assert!(member_nft::total_supply(&nft_state) == 3, 1);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 複数の支援者が支援し、それぞれがNFTを受け取ることを確認
    /// 要件: 1.4
    fun test_multiple_supporters_receive_nfts() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 5人の支援者がそれぞれ支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUPPORTER3);
        let payment3 = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment3, &clock, ts::ctx(&mut scenario));

        // 総支援額を検証
        assert!(dao_pool::total_raised(&pool) == 3 * HUNDRED_USDC, 0);

        // 3つのNFTが発行されたことを確認
        assert!(member_nft::total_supply(&nft_state) == 3, 1);

        // 各支援者がNFTを受け取ったことを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft) == 1, 2);
            test_utils::destroy(nft);
        };

        ts::next_tx(&mut scenario, SUPPORTER2);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft) == 2, 3);
            test_utils::destroy(nft);
        };

        ts::next_tx(&mut scenario, SUPPORTER3);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::token_id(&nft) == 3, 4);
            test_utils::destroy(nft);
        };

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== 統合テスト: distribute の資金分配フロー =====

    #[test]
    /// テスト: 支援 → 分配の完全なフローを確認
    /// 要件: 4.3, 4.4, 4.5
    fun test_full_support_and_distribution_flow() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 複数の支援者が支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(FIVE_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(FIVE_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        // 総支援額を検証
        let total_supported = THOUSAND_USDC;
        assert!(dao_pool::total_raised(&pool) == total_supported, 0);
        assert!(dao_pool::treasury_balance(&pool) == total_supported, 1);

        // 30日進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        // 分配を実行
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        // 分配後の状態を検証
        assert!(dao_pool::total_raised(&pool) == 0, 2); // リセットされた
        
        // トレジャリーには端数処理による最小限のダストがあるはず
        let remaining = dao_pool::treasury_balance(&pool);
        assert!(remaining < 10, 3);

        // NFTは保持されている
        assert!(member_nft::total_supply(&nft_state) == 2, 4);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 複数サイクルの支援と分配を確認
    /// 要件: 4.3, 4.4, 4.5
    fun test_multiple_distribution_cycles() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // サイクル1: 支援と分配
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(FIVE_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        assert!(dao_pool::total_raised(&pool) == 0, 0);

        // サイクル2: 再度支援と分配
        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(FIVE_HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        assert!(dao_pool::total_raised(&pool) == FIVE_HUNDRED_USDC, 1);

        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        assert!(dao_pool::total_raised(&pool) == 0, 2);

        // 2つのNFTが発行されたことを確認
        assert!(member_nft::total_supply(&nft_state) == 2, 3);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 上限に達した後の分配を確認
    /// 要件: 4.3, 4.4, 4.5
    fun test_distribution_at_support_cap() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 上限まで支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THREE_THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment, &clock, ts::ctx(&mut scenario));

        assert!(dao_pool::total_raised(&pool) == THREE_THOUSAND_USDC, 0);

        // 30日進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        // 分配を実行
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        // 分配後、再度支援可能になることを確認
        assert!(dao_pool::total_raised(&pool) == 0, 1);

        // 新しい支援が可能
        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(HUNDRED_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        assert!(dao_pool::total_raised(&pool) == HUNDRED_USDC, 2);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 分配比率が正しく適用されることを確認
    /// 要件: 4.3
    fun test_distribution_ratios_applied_correctly() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 計算しやすい金額で支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment, &clock, ts::ctx(&mut scenario));

        let initial_treasury = dao_pool::treasury_balance(&pool);

        // 30日進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        // 分配を実行
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        // 期待される配分額を計算
        // Fighter: 60% = 600 USDC
        // Gym: 30% = 300 USDC
        // Organizer: 10% = 100 USDC
        let expected_fighter = (initial_treasury * 60) / 100;
        let expected_gym = (initial_treasury * 30) / 100;
        let expected_organizer = (initial_treasury * 10) / 100;

        let total_distributed = expected_fighter + expected_gym + expected_organizer;
        
        // 分配された合計が元の金額以下であることを確認
        assert!(total_distributed <= initial_treasury, 0);

        // 残りは端数処理によるダスト
        let remaining = dao_pool::treasury_balance(&pool);
        assert!(remaining == initial_treasury - total_distributed, 1);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    /// テスト: 支援とNFT発行が上限に達するまで継続できることを確認
    /// 要件: 1.4, 4.3
    fun test_support_until_cap_then_distribute() {
        let mut scenario = setup_test();
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));

        let mut pool = init_dao_pool(&mut scenario, &clock);
        let mut nft_state = member_nft::create_test_state(ts::ctx(&mut scenario));

        // 複数の支援者が上限まで支援
        ts::next_tx(&mut scenario, SUPPORTER1);
        let payment1 = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment1, &clock, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUPPORTER2);
        let payment2 = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment2, &clock, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUPPORTER3);
        let payment3 = mint_usdc(THOUSAND_USDC, ts::ctx(&mut scenario));
        dao_pool::support(&mut pool, &mut nft_state, payment3, &clock, ts::ctx(&mut scenario));

        // 上限に達したことを確認
        assert!(dao_pool::total_raised(&pool) == THREE_THOUSAND_USDC, 0);

        // 3つのNFTが発行されたことを確認
        assert!(member_nft::total_supply(&nft_state) == 3, 1);

        // 30日進める
        clock::increment_for_testing(&mut clock, THIRTY_DAYS_MS);

        // 分配を実行
        ts::next_tx(&mut scenario, ORGANIZER);
        dao_pool::distribute(&mut pool, &clock, ts::ctx(&mut scenario));

        // 分配後、total_raisedがリセットされたことを確認
        assert!(dao_pool::total_raised(&pool) == 0, 2);

        // NFTは保持されている
        assert!(member_nft::total_supply(&nft_state) == 3, 3);

        test_utils::destroy(nft_state);
        test_utils::destroy(pool);
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
