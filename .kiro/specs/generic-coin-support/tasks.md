# Implementation Plan

- [x] 1. DaoPoolState構造体をジェネリック型対応に更新
  - `DaoPoolState`に`<phantom T>`型パラメータを追加
  - `treasury`フィールドを`Balance<USDC>`から`Balance<T>`に変更
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

- [ ] 2. init_pool関数をジェネリック型対応に更新
  - 関数シグネチャに`<T>`型パラメータを追加
  - 戻り値の型を`DaoPoolState`から`DaoPoolState<T>`に変更
  - `balance::zero<USDC>()`を`balance::zero<T>()`に変更
  - _Requirements: 1.1, 6.1, 6.2, 6.3, 6.4_

- [ ] 3. init関数（モジュール初期化）を更新
  - `DaoPoolState`を`DaoPoolState<SUI>`に変更（デフォルト型としてSUIを使用）
  - `balance::zero<USDC>()`を`balance::zero<SUI>()`に変更
  - `transfer::share_object`の呼び出しを更新
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 4. support関数をジェネリック型対応に更新
  - 関数シグネチャに`<T>`型パラメータを追加
  - `state`パラメータの型を`&mut DaoPoolState`から`&mut DaoPoolState<T>`に変更
  - `payment`パラメータの型を`Coin<USDC>`から`Coin<T>`に変更
  - `coin::into_balance`と`balance::join`の呼び出しが型パラメータ`T`を使用することを確認
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. distribute関数をジェネリック型対応に更新
  - 関数シグネチャに`<T>`型パラメータを追加
  - `state`パラメータの型を`&mut DaoPoolState`から`&mut DaoPoolState<T>`に変更
  - `balance::split`、`coin::from_balance`、`transfer::public_transfer`の呼び出しが型パラメータ`T`を使用することを確認
  - 3つの受取人（fighter、gym、organizer）すべてに対して型パラメータを適用
  - _Requirements: 1.1, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. distribute_bonus関数をジェネリック型対応に更新
  - 関数シグネチャに`<T>`型パラメータを追加
  - `state`パラメータの型を`&mut DaoPoolState`から`&mut DaoPoolState<T>`に変更
  - `balance::split`、`coin::from_balance`、`transfer::public_transfer`の呼び出しが型パラメータ`T`を使用することを確認
  - _Requirements: 1.1, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7. change_distribution_detail関数をジェネリック型対応に更新
  - 関数シグネチャに`<T>`型パラメータを追加
  - `state`パラメータの型を`&mut DaoPoolState`から`&mut DaoPoolState<T>`に変更
  - 関数本体は`treasury`フィールドにアクセスしないため、他の変更は不要
  - _Requirements: 2.4_

- [ ] 8. すべてのビュー関数をジェネリック型対応に更新
  - `total_raised`、`support_cap`、`treasury_balance`、`last_distribution`、`distribution_interval`、`fighter_address`、`gym_address`、`organizer_address`、`distribution_ratios`、`is_admin`、`get_distribution_config`の各関数に`<T>`型パラメータを追加
  - 各関数の`state`パラメータの型を`&DaoPoolState`から`&DaoPoolState<T>`に変更
  - `DistributionConfig`構造体は型パラメータ不要（値のみを返すため）
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. コントラクトをビルドして型エラーを修正
  - `sui move build`を実行
  - コンパイルエラーがあれば修正
  - すべての型パラメータが正しく伝播されていることを確認
  - _Requirements: 1.5_

- [ ] 10. test_support.shスクリプトを更新
  - コインオブジェクトから型を自動検出する機能を追加
  - `sui client call`コマンドに`--type-args`パラメータを追加
  - USDC型とSUI型の両方をサポート
  - 型の不一致エラーに対する明確なエラーメッセージを追加
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 11. test_admin.shスクリプトを更新
  - `distribute`関数呼び出しに`--type-args`パラメータを追加
  - `distribute_bonus`関数呼び出しに`--type-args`パラメータを追加
  - `change_distribution_detail`関数呼び出しに`--type-args`パラメータを追加
  - DaoPoolStateオブジェクトから型を検出する機能を追加
  - _Requirements: 9.1, 9.2, 9.3_

- [ ]* 12. check_nft.shスクリプトを更新（必要に応じて）
  - NFT関連の関数がDaoPoolStateの型パラメータに依存する場合は更新
  - 型パラメータが不要な場合はスキップ
  - _Requirements: 9.1_

- [ ]* 13. test_contract.shスクリプトを更新
  - すべての関数呼び出しに適切な`--type-args`を追加
  - 統合テストフローが新しいジェネリック型で動作することを確認
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 14. Testnetに新しいコントラクトをデプロイ
  - `sui client publish --gas-budget 100000000`を実行
  - 新しいパッケージIDを記録
  - DaoPoolStateオブジェクトIDを記録
  - _Requirements: 1.1_

- [ ] 15. 環境変数ファイルを更新
  - `.env`ファイルに新しいパッケージIDを設定
  - 新しいDaoPoolStateオブジェクトIDを設定
  - `load_env.sh`が正しく動作することを確認
  - _Requirements: 9.1_

- [ ] 16. USDC型で支援機能をテスト
  - 実際のTestnet USDCコインを使用
  - `test_support.sh`を実行してUSDCで支援
  - NFTが正しく発行されることを確認
  - DaoPoolStateのtreasury残高が増加することを確認
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 17. SUI型で支援機能をテスト
  - SUIコインを使用
  - `test_support.sh`を実行してSUIで支援
  - NFTが正しく発行されることを確認
  - DaoPoolStateのtreasury残高が増加することを確認
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 18. 分配機能をテスト
  - `test_admin.sh`を使用して`distribute`関数を呼び出し
  - 格闘家、ジム、主催者のウォレットに正しい金額が転送されることを確認
  - DistributionEventが正しく発行されることを確認
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 19. 勝利ボーナス分配機能をテスト
  - `test_admin.sh`を使用して`distribute_bonus`関数を呼び出し
  - 指定した金額が正しく分配されることを確認
  - BonusDistributionEventが正しく発行されることを確認
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 20. ドキュメントを更新
  - README.mdにジェネリック型の使用方法を追加
  - `--type-args`パラメータの使用例を追加
  - サポートされるコイン型のリストを追加
  - TypeMismatchエラーのトラブルシューティングガイドを追加
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
