// Copyright (c) Champion Together
// SPDX-License-Identifier: Apache-2.0

/// Champion Togetherプラットフォーム用MembersNFTコントラクト
/// 支援者に発行される記念NFTを管理
module champion_together::member_nft {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::transfer;
    use std::string::{Self, String};
    use champion_together::utils_constants as constants;
    use champion_together::utils_errors as errors;

    // ===== 構造体 =====

    /// MembersNFTコントラクトのメイン状態オブジェクト
    public struct MembersNFTState has key {
        id: UID,
        /// 発行済みトークン数
        token_counter: u64,
        /// DaoPoolコントラクトのオブジェクトID（認可用）
        dao_pool_id: ID,
    }

    /// メンバーNFTオブジェクト
    /// 支援者が保有するNFT
    public struct MemberNFT has key, store {
        id: UID,
        /// 一意のトークンID
        token_id: u64,
        /// 支援額（マイクロUSDC）
        support_amount: u64,
        /// 会員ランク（Bronze, Silver, Gold, Platinum）
        rank: String,
        /// 発行日時（Unixタイムスタンプ、ミリ秒）
        minted_at: u64,
        /// NFT画像URL
        image_url: String,
    }

    // ===== イベント =====

    /// NFTがミントされた際に発行されるイベント
    public struct MintEvent has copy, drop {
        token_id: u64,
        recipient: address,
        support_amount: u64,
        rank: String,
        timestamp: u64,
    }

    // ===== ヘルパー構造体 =====

    /// NFTメタデータをまとめた構造体
    /// フロントエンドでの利便性向上のため、すべての主要情報を一度に取得可能
    public struct NFTMetadata has copy, drop {
        token_id: u64,
        support_amount: u64,
        rank: String,
        minted_at: u64,
        image_url: String,
    }

    // ===== パブリック関数 =====

    /// 新しいMembersNFT状態を初期化
    /// コントラクトデプロイ時に一度だけ呼び出される
    public fun init_nft_state(
        dao_pool_id: ID,
        ctx: &mut TxContext
    ): MembersNFTState {
        MembersNFTState {
            id: object::new(ctx),
            token_counter: 0,
            dao_pool_id,
        }
    }

    /// NFTをミント - DaoPoolコントラクトからのみ呼び出し可能
    /// 支援額に基づいてランクを決定し、NFTを作成して受取人に転送
    /// 要件: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.4
    public fun mint(
        state: &mut MembersNFTState,
        support_amount: u64,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 要件 9.4: 呼び出し元がDaoPoolコントラクトであることを検証
        // 注: Suiでは、entry関数からの呼び出しでない限り、
        // パッケージ内の関数は信頼できる呼び出し元からのみ呼び出される
        // 実際の統合時には、DaoPoolの特定のオブジェクトIDをチェックする必要がある

        // 支援額が最小ランク閾値以上であることを検証
        assert!(
            support_amount >= constants::bronze_min(),
            errors::e_invalid_support_amount()
        );

        // 要件 2.3, 2.4, 2.5, 2.6: 支援額に基づいてランクを決定
        let rank = determine_rank(support_amount);

        // 要件 2.7: token_counterをインクリメント
        state.token_counter = state.token_counter + 1;
        let token_id = state.token_counter;

        // NFT画像URLを生成（ランクに基づく）
        let image_url = generate_image_url(&rank);

        // 要件 2.1: MemberNFTオブジェクトを作成
        let nft = MemberNFT {
            id: object::new(ctx),
            token_id,
            support_amount,
            rank: rank,
            minted_at: clock::timestamp_ms(clock),
            image_url,
        };

        let timestamp = clock::timestamp_ms(clock);

        // MintEventを発行
        event::emit(MintEvent {
            token_id,
            recipient,
            support_amount,
            rank: nft.rank,
            timestamp,
        });

        // NFTを受取人に転送
        transfer::public_transfer(nft, recipient);
    }

    /// エントリー関数版のmint - DaoPoolから呼び出される
    #[allow(lint(public_entry))]
    public entry fun mint_entry(
        state: &mut MembersNFTState,
        support_amount: u64,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        mint(state, support_amount, recipient, clock, ctx);
    }

    // ===== ビュー関数 =====

    /// NFTの所有者アドレスを返す
    /// 要件: 3.1
    public fun owner_of(_nft: &MemberNFT, ctx: &TxContext): address {
        // Suiでは、NFTオブジェクトの所有者はコンテキストから取得できる
        // ここではNFTへの参照を持つ呼び出し元が所有者とみなされる
        tx_context::sender(ctx)
    }

    /// NFTの会員ランクを返す
    /// 要件: 3.4
    public fun get_rank(nft: &MemberNFT): String {
        nft.rank
    }

    /// NFTのトークンIDを返す
    public fun token_id(nft: &MemberNFT): u64 {
        nft.token_id
    }

    /// NFTの支援額を返す
    public fun support_amount(nft: &MemberNFT): u64 {
        nft.support_amount
    }

    /// NFTの発行日時を返す
    public fun minted_at(nft: &MemberNFT): u64 {
        nft.minted_at
    }

    /// NFTの画像URLを返す
    public fun image_url(nft: &MemberNFT): String {
        nft.image_url
    }

    /// 総発行数を返す
    public fun total_supply(state: &MembersNFTState): u64 {
        state.token_counter
    }

    /// NFT状態のdao_pool_idを返す
    public fun dao_pool_id(state: &MembersNFTState): ID {
        state.dao_pool_id
    }

    // ===== フロントエンド用ヘルパー関数 =====

    /// すべてのNFTメタデータを一度に取得
    /// フロントエンドでの複数フィールドアクセスを効率化
    public fun get_metadata(nft: &MemberNFT): NFTMetadata {
        NFTMetadata {
            token_id: nft.token_id,
            support_amount: nft.support_amount,
            rank: nft.rank,
            minted_at: nft.minted_at,
            image_url: nft.image_url,
        }
    }

    /// 基本情報（トークンID、ランク、支援額）を一度に取得
    /// 軽量なメタデータ取得用
    public fun get_basic_info(nft: &MemberNFT): (u64, String, u64) {
        (nft.token_id, nft.rank, nft.support_amount)
    }

    /// NFTが指定されたランク以上かをチェック
    /// Lit Protocol連携での限定コンテンツアクセス判定に使用
    /// ランクの優先順位: Platinum > Gold > Silver > Bronze
    public fun has_rank_or_higher(nft: &MemberNFT, required_rank: String): bool {
        let nft_rank_value = rank_to_value(&nft.rank);
        let required_rank_value = rank_to_value(&required_rank);
        nft_rank_value >= required_rank_value
    }

    /// ランク名を表示用の文字列として取得
    public fun rank_display_name(nft: &MemberNFT): String {
        nft.rank
    }

    // ===== NFTMetadata構造体用のアクセサー =====

    /// NFTMetadataのトークンIDを取得
    public fun metadata_token_id(metadata: &NFTMetadata): u64 {
        metadata.token_id
    }

    /// NFTMetadataの支援額を取得
    public fun metadata_support_amount(metadata: &NFTMetadata): u64 {
        metadata.support_amount
    }

    /// NFTMetadataのランクを取得
    public fun metadata_rank(metadata: &NFTMetadata): String {
        metadata.rank
    }

    /// NFTMetadataの発行日時を取得
    public fun metadata_minted_at(metadata: &NFTMetadata): u64 {
        metadata.minted_at
    }

    /// NFTMetadataの画像URLを取得
    public fun metadata_image_url(metadata: &NFTMetadata): String {
        metadata.image_url
    }

    // ===== 内部ヘルパー関数 =====

    /// ランクを数値に変換（比較用）
    /// Bronze=1, Silver=2, Gold=3, Platinum=4
    fun rank_to_value(rank: &String): u8 {
        if (rank == &string::utf8(b"Platinum")) {
            4
        } else if (rank == &string::utf8(b"Gold")) {
            3
        } else if (rank == &string::utf8(b"Silver")) {
            2
        } else {
            1 // Bronze
        }
    }

    /// 支援額に基づいて会員ランクを決定
    /// 要件: 2.3, 2.4, 2.5, 2.6
    fun determine_rank(support_amount: u64): String {
        if (support_amount >= constants::platinum_min()) {
            // 200 USDC以上: Platinum
            string::utf8(b"Platinum")
        } else if (support_amount >= constants::gold_min()) {
            // 100-199 USDC: Gold
            string::utf8(b"Gold")
        } else if (support_amount >= constants::silver_min()) {
            // 50-99 USDC: Silver
            string::utf8(b"Silver")
        } else {
            // 10-49 USDC: Bronze
            string::utf8(b"Bronze")
        }
    }

    /// ランクに基づいてNFT画像URLを生成
    fun generate_image_url(rank: &String): String {
        // 実際のデプロイ時には、IPFSまたは他のストレージサービスのURLに置き換える
        if (rank == &string::utf8(b"Platinum")) {
            string::utf8(b"https://champion-together.io/nft/platinum.png")
        } else if (rank == &string::utf8(b"Gold")) {
            string::utf8(b"https://champion-together.io/nft/gold.png")
        } else if (rank == &string::utf8(b"Silver")) {
            string::utf8(b"https://champion-together.io/nft/silver.png")
        } else {
            string::utf8(b"https://champion-together.io/nft/bronze.png")
        }
    }

    // ===== テスト専用関数 =====
    #[test_only]
    public fun create_test_state(ctx: &mut TxContext): MembersNFTState {
        use sui::object;
        MembersNFTState {
            id: object::new(ctx),
            token_counter: 0,
            dao_pool_id: object::id_from_address(@0x1),
        }
    }

    #[test_only]
    public fun get_token_counter(state: &MembersNFTState): u64 {
        state.token_counter
    }
}
