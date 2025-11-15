// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module champion_together::member_nft_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use sui::object;
    use sui::test_utils;
    use std::string;
    use champion_together::member_nft::{Self, MembersNFTState, MemberNFT};

    // テスト用アドレス
    const ADMIN: address = @0xAD;
    const SUPPORTER1: address = @0xB1;
    const SUPPORTER2: address = @0xB2;
    const DAO_POOL: address = @0xDA0;

    // ===== ヘルパー関数 =====

    fun setup_test(): Scenario {
        ts::begin(ADMIN)
    }

    fun create_clock(scenario: &mut Scenario): Clock {
        ts::next_tx(scenario, ADMIN);
        clock::create_for_testing(ts::ctx(scenario))
    }

    // ===== 初期化テスト =====

    #[test]
    fun test_init_nft_state() {
        let mut scenario = setup_test();

        ts::next_tx(&mut scenario, ADMIN);
        {
            let state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            assert!(member_nft::total_supply(&state) == 0, 0);

            test_utils::destroy(state);
        };

        ts::end(scenario);
    }

    // ===== ミント機能テスト =====

    #[test]
    fun test_mint_bronze() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // ブロンズランク: 10 USDC = 10,000,000 マイクロUSDC
            let support_amount = 10_000_000;

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            assert!(member_nft::total_supply(&state) == 1, 0);

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::token_id(&nft) == 1, 0);
            assert!(member_nft::support_amount(&nft) == 10_000_000, 1);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Bronze"), 2);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_mint_silver() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // シルバーランク: 50 USDC = 50,000,000 マイクロUSDC
            let support_amount = 50_000_000;

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::get_rank(&nft) == string::utf8(b"Silver"), 0);
            assert!(member_nft::support_amount(&nft) == 50_000_000, 1);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_mint_gold() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // ゴールドランク: 100 USDC = 100,000,000 マイクロUSDC
            let support_amount = 100_000_000;

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::get_rank(&nft) == string::utf8(b"Gold"), 0);
            assert!(member_nft::support_amount(&nft) == 100_000_000, 1);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_mint_platinum() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // プラチナランク: 200 USDC = 200,000,000 マイクロUSDC
            let support_amount = 200_000_000;

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::get_rank(&nft) == string::utf8(b"Platinum"), 0);
            assert!(member_nft::support_amount(&nft) == 200_000_000, 1);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_mint_multiple() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // 1つ目のNFTをミント
            member_nft::mint(
                &mut state,
                10_000_000,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            // 2つ目のNFTをミント
            member_nft::mint(
                &mut state,
                50_000_000,
                SUPPORTER2,
                &clock,
                ts::ctx(&mut scenario)
            );

            assert!(member_nft::total_supply(&state) == 2, 0);

            test_utils::destroy(state);
        };

        // SUPPORTER1のNFTを確認
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::token_id(&nft) == 1, 0);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Bronze"), 1);

            test_utils::destroy(nft);
        };

        // SUPPORTER2のNFTを確認
        ts::next_tx(&mut scenario, SUPPORTER2);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            assert!(member_nft::token_id(&nft) == 2, 0);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Silver"), 1);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure]
    fun test_mint_insufficient_amount() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // 最小額未満: 5 USDC = 5,000,000 マイクロUSDC (Bronze最小値は10 USDC)
            let support_amount = 5_000_000;

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            test_utils::destroy(state);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== ビュー関数テスト =====

    #[test]
    fun test_nft_metadata() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            let support_amount = 100_000_000; // Gold

            member_nft::mint(
                &mut state,
                support_amount,
                SUPPORTER1,
                &clock,
                ts::ctx(&mut scenario)
            );

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // すべてのメタデータを検証
            assert!(member_nft::token_id(&nft) == 1, 0);
            assert!(member_nft::support_amount(&nft) == 100_000_000, 1);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Gold"), 2);
            assert!(member_nft::minted_at(&nft) >= 0, 3);
            assert!(member_nft::image_url(&nft) == string::utf8(b"https://champion-together.io/nft/gold.png"), 4);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== ランク境界値テスト =====

    #[test]
    fun test_rank_boundaries() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // Bronze: 49.999999 USDC (Silver未満)
            member_nft::mint(&mut state, 49_999_999, SUPPORTER1, &clock, ts::ctx(&mut scenario));

            // Silver: 99.999999 USDC (Gold未満)
            member_nft::mint(&mut state, 99_999_999, SUPPORTER2, &clock, ts::ctx(&mut scenario));

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Bronze"), 0);
            test_utils::destroy(nft);
        };

        ts::next_tx(&mut scenario, SUPPORTER2);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);
            assert!(member_nft::get_rank(&nft) == string::utf8(b"Silver"), 0);
            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ===== ヘルパー関数テスト =====

    #[test]
    fun test_get_metadata() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // Goldランクでミント
            member_nft::mint(&mut state, 150_000_000, SUPPORTER1, &clock, ts::ctx(&mut scenario));

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // get_metadata関数のテスト
            let metadata = member_nft::get_metadata(&nft);
            assert!(member_nft::metadata_token_id(&metadata) == 1, 0);
            assert!(member_nft::metadata_support_amount(&metadata) == 150_000_000, 1);
            assert!(member_nft::metadata_rank(&metadata) == string::utf8(b"Gold"), 2);
            assert!(member_nft::metadata_minted_at(&metadata) >= 0, 3);
            assert!(member_nft::metadata_image_url(&metadata) == string::utf8(b"https://champion-together.io/nft/gold.png"), 4);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_get_basic_info() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            member_nft::mint(&mut state, 50_000_000, SUPPORTER1, &clock, ts::ctx(&mut scenario));

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // get_basic_info関数のテスト
            let (token_id, rank, support_amount) = member_nft::get_basic_info(&nft);
            assert!(token_id == 1, 0);
            assert!(rank == string::utf8(b"Silver"), 1);
            assert!(support_amount == 50_000_000, 2);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_has_rank_or_higher() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // Goldランクのユーザー
            member_nft::mint(&mut state, 100_000_000, SUPPORTER1, &clock, ts::ctx(&mut scenario));

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // Goldは自分自身以下のランクにアクセス可能
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Bronze")), 0);
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Silver")), 1);
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Gold")), 2);

            // Goldは Platinumにはアクセス不可
            assert!(!member_nft::has_rank_or_higher(&nft, string::utf8(b"Platinum")), 3);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_rank_comparison_all_levels() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            // 各ランクのユーザーをミント
            member_nft::mint(&mut state, 10_000_000, SUPPORTER1, &clock, ts::ctx(&mut scenario)); // Bronze
            member_nft::mint(&mut state, 250_000_000, SUPPORTER2, &clock, ts::ctx(&mut scenario)); // Platinum

            test_utils::destroy(state);
        };

        // Bronzeユーザーのテスト
        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // Bronzeは自分自身のみアクセス可能
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Bronze")), 0);
            assert!(!member_nft::has_rank_or_higher(&nft, string::utf8(b"Silver")), 1);
            assert!(!member_nft::has_rank_or_higher(&nft, string::utf8(b"Gold")), 2);
            assert!(!member_nft::has_rank_or_higher(&nft, string::utf8(b"Platinum")), 3);

            test_utils::destroy(nft);
        };

        // Platinumユーザーのテスト
        ts::next_tx(&mut scenario, SUPPORTER2);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // Platinumはすべてのランクにアクセス可能
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Bronze")), 0);
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Silver")), 1);
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Gold")), 2);
            assert!(member_nft::has_rank_or_higher(&nft, string::utf8(b"Platinum")), 3);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_rank_display_name() {
        let mut scenario = setup_test();
        let clock = create_clock(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut state = member_nft::init_nft_state(ts::ctx(&mut scenario));

            member_nft::mint(&mut state, 100_000_000, SUPPORTER1, &clock, ts::ctx(&mut scenario));

            test_utils::destroy(state);
        };

        ts::next_tx(&mut scenario, SUPPORTER1);
        {
            let nft = ts::take_from_sender<MemberNFT>(&scenario);

            // rank_display_name関数のテスト
            assert!(member_nft::rank_display_name(&nft) == string::utf8(b"Gold"), 0);

            test_utils::destroy(nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
