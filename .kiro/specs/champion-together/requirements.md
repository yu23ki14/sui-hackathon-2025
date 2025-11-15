# Requirements Document

## Introduction

CHAMPION TOGETHERは、格闘家とファンを繋ぐ分散型自律組織（DAO）プラットフォームです。Suiブロックチェーン上で動作し、格闘家の「練習時間の確保」と「資金調達」の課題を解決します。ファンはUSDCステーブルコインで支援を行い、支援額に応じてメンバーNFTを受け取ります。集まった資金は、スマートコントラクトにより格闘家、ジム、後援会幹事に自動分配されます。

## Glossary

- **DaoPool_Contract**: 支援金を管理し、格闘家・ジム・後援会幹事への分配を実行するスマートコントラクト
- **MembersNFT_Contract**: 支援者に発行される記念NFTを管理するスマートコントラクト
- **Supporter**: 格闘家を支援するファン（支援者）
- **Fighter**: 支援を受ける格闘家
- **Gym**: 格闘家が所属するジム
- **Organizer**: 後援会幹事
- **USDC**: Sui Testnet上のステーブルコイン（支援に使用される通貨）
- **Member_Rank**: 支援額に応じて決定されるランク（Bronze, Silver, Gold, Platinum）
- **Distribution_Ratio**: 資金分配比率（格闘家、ジム、後援会幹事への配分割合）
- **Support_Cap**: 支援金の上限額（3,000 USDC）
- **Distribution_Interval**: 資金分配の実行間隔（30日）
- **Frontend_Application**: React + Viteで構築されたWebアプリケーション
- **Lit_Protocol**: 会員ランクに応じた限定コンテンツへのアクセス制御を提供する分散型プロトコル

## Requirements

### Requirement 1: 支援金の受付と管理

**User Story:** Supporterとして、格闘家を支援するためにUSDCをDaoPool_Contractにデポジットしたい。そうすることで、格闘家の成長を直接サポートできる。

#### Acceptance Criteria

1. WHEN SupporterがSupport関数を呼び出す, THE DaoPool_Contract SHALL 指定されたUSDC額をSupporterのウォレットから受け取る
2. WHILE 累計支援額がSupport_Cap未満である, THE DaoPool_Contract SHALL 新規支援を受け付ける
3. IF 累計支援額がSupport_Capに達している, THEN THE DaoPool_Contract SHALL 新規支援を拒否する
4. WHEN 支援が成功する, THE DaoPool_Contract SHALL MembersNFT_ContractのMint関数を呼び出す
5. THE DaoPool_Contract SHALL 各Supporterの支援額と支援日時を記録する

### Requirement 2: メンバーNFTの発行

**User Story:** Supporterとして、支援の証としてメンバーNFTを受け取りたい。そうすることで、支援の記念品を保有し、会員特典にアクセスできる。

#### Acceptance Criteria

1. WHEN DaoPool_ContractからMint関数が呼び出される, THE MembersNFT_Contract SHALL 新しいNFTをSupporterのウォレットに発行する
2. THE MembersNFT_Contract SHALL NFTメタデータに支援額、発行日時、Rankを含める
3. WHEN 支援額が10 USDC以上50 USDC未満である, THE MembersNFT_Contract SHALL RankをBronzeに設定する
4. WHEN 支援額が50 USDC以上100 USDC未満である, THE MembersNFT_Contract SHALL RankをSilverに設定する
5. WHEN 支援額が100 USDC以上200 USDC未満である, THE MembersNFT_Contract SHALL RankをGoldに設定する
6. WHEN 支援額が200 USDC以上である, THE MembersNFT_Contract SHALL RankをPlatinumに設定する
7. THE MembersNFT_Contract SHALL 各NFTに一意のトークンIDを割り当てる

### Requirement 3: NFT所有情報の照会

**User Story:** Supporterとして、自分が保有するメンバーNFTの情報を確認したい。そうすることで、自分の支援履歴と会員ランクを把握できる。

#### Acceptance Criteria

1. WHEN ownerOf関数が呼び出される, THE MembersNFT_Contract SHALL 指定されたトークンIDの所有者アドレスを返す
2. WHEN balanceOf関数が呼び出される, THE MembersNFT_Contract SHALL 指定されたアドレスが保有するNFTの総数を返す
3. IF 指定されたトークンIDが存在しない, THEN THE MembersNFT_Contract SHALL エラーを返す
4. THE MembersNFT_Contract SHALL NFTメタデータ（Member_Rank、支援額、発行日時）を照会可能にする

### Requirement 4: 資金の自動分配

**User Story:** Fighterとして、定期的に支援金を受け取りたい。そうすることで、練習に集中でき、バイトやスポンサー探しの時間を減らせる。

#### Acceptance Criteria

1. WHEN Distribution_Intervalが経過する, THE DaoPool_Contract SHALL Distribute関数の実行を許可する
2. WHEN Distribute関数が呼び出される, THE DaoPool_Contract SHALL 累積支援金をDistribution_Ratioに基づいて分配する
3. THE DaoPool_Contract SHALL Fighter、Gym、Organizerのウォレットアドレスにそれぞれの配分額を送金する
4. WHEN 分配が完了する, THE DaoPool_Contract SHALL 累積支援金残高をゼロにリセットする
5. THE DaoPool_Contract SHALL 分配履歴（日時、総額、各受取人への配分額）を記録する
6. IF 累積支援金がゼロである, THEN THE DaoPool_Contract SHALL 分配を実行せずエラーを返す

### Requirement 5: 分配設定の変更

**User Story:** Organizerとして、資金分配の設定を変更したい。そうすることで、状況に応じて柔軟に配分比率や受取人を調整できる。

#### Acceptance Criteria

1. WHEN ChangeDistributionDetail関数が呼び出される, THE DaoPool_Contract SHALL 呼び出し元がOrganizerであることを検証する
2. IF 呼び出し元がOrganizerでない, THEN THE DaoPool_Contract SHALL 実行を拒否しエラーを返す
3. WHEN Organizerが新しいDistribution_Ratioを指定する, THE DaoPool_Contract SHALL 分配比率を更新する
4. WHEN Organizerが新しい受取人アドレスを指定する, THE DaoPool_Contract SHALL Fighter、Gym、Organizerのアドレスを更新する
5. THE DaoPool_Contract SHALL Distribution_Ratioの合計が100%であることを検証する
6. THE DaoPool_Contract SHALL 設定変更履歴（変更日時、変更内容）を記録する

### Requirement 6: フロントエンドでの支援実行

**User Story:** Supporterとして、Webブラウザから簡単に支援を実行したい。そうすることで、技術的な知識がなくても格闘家を支援できる。

#### Acceptance Criteria

1. WHEN SupporterがFrontend_Applicationにアクセスする, THE Frontend_Application SHALL Sui Walletへの接続オプションを表示する
2. WHEN Supporterがウォレットを接続する, THE Frontend_Application SHALL Supporterのウォレットアドレスと残高を表示する
3. THE Frontend_Application SHALL 支援額入力フォームを提供する
4. WHEN Supporterが支援額を入力し送信する, THE Frontend_Application SHALL DaoPool_ContractのSupport関数を呼び出す
5. WHEN トランザクションが成功する, THE Frontend_Application SHALL 成功メッセージとトランザクションハッシュを表示する
6. IF トランザクションが失敗する, THEN THE Frontend_Application SHALL エラーメッセージと失敗理由を表示する

### Requirement 7: フロントエンドでの支援状況表示

**User Story:** Supporterとして、現在の支援状況を確認したい。そうすることで、目標達成度や自分の貢献度を把握できる。

#### Acceptance Criteria

1. WHEN SupporterがFrontend_Applicationにアクセスする, THE Frontend_Application SHALL 累計支援額とSupport_Capまでの進捗を表示する
2. THE Frontend_Application SHALL 次回Distribution_Intervalまでの残り日数を表示する
3. WHEN Supporterがウォレットを接続する, THE Frontend_Application SHALL Supporterの支援履歴を表示する
4. THE Frontend_Application SHALL Supporterが保有するメンバーNFTの一覧とMember_Rankを表示する
5. THE Frontend_Application SHALL 過去の分配履歴（日時、総額）を表示する

### Requirement 8: 限定コンテンツへのアクセス制御

**User Story:** Supporterとして、会員ランクに応じた限定コンテンツにアクセスしたい。そうすることで、支援の特典を享受できる。

#### Acceptance Criteria

1. WHEN SupporterがLit_Protocolで保護されたコンテンツにアクセスする, THE Frontend_Application SHALL MembersNFT_Contractに対してSupporterのMember_Rankを照会する
2. WHEN Member_Rankが確認される, THE Lit_Protocol SHALL アクセス条件を評価する
3. IF Member_Rankがコンテンツのアクセス要件を満たす, THEN THE Lit_Protocol SHALL コンテンツへのアクセスを許可する
4. IF Member_Rankがコンテンツのアクセス要件を満たさない, THEN THE Lit_Protocol SHALL アクセスを拒否しエラーメッセージを表示する
5. THE Frontend_Application SHALL 各Member_Rankでアクセス可能なコンテンツの一覧を表示する

### Requirement 9: スマートコントラクトのセキュリティ

**User Story:** システム管理者として、スマートコントラクトが安全に動作することを保証したい。そうすることで、支援者と受取人の資金を保護できる。

#### Acceptance Criteria

1. THE DaoPool_Contract SHALL すべての入力パラメータ（支援額、アドレス）を検証する
2. THE DaoPool_Contract SHALL 支援額がゼロより大きいことを検証する
3. THE DaoPool_Contract SHALL 受取人アドレスが有効なSuiアドレスであることを検証する
4. THE MembersNFT_Contract SHALL Mint関数の呼び出し元がDaoPool_Contractであることを検証する
5. THE DaoPool_Contract SHALL ChangeDistributionDetail関数の呼び出し元がOrganizerであることを検証する
6. THE DaoPool_Contract SHALL 整数オーバーフローを防止する（Moveの組み込み機能を活用）
7. THE DaoPool_Contract SHALL リエントランシー攻撃を防止する（Suiのリソースモデルを活用）

### Requirement 10: エラーハンドリングとユーザーフィードバック

**User Story:** Supporterとして、エラーが発生した際に明確な理由を知りたい。そうすることで、問題を解決して再試行できる。

#### Acceptance Criteria

1. WHEN DaoPool_ContractまたはMembersNFT_Contractでエラーが発生する, THE Contract SHALL 明確なエラーメッセージを返す
2. WHEN Frontend_Applicationがコントラクトエラーを受け取る, THE Frontend_Application SHALL ユーザーフレンドリーなエラーメッセージを日本語で表示する
3. IF 支援額がSupport_Capを超える, THEN THE Frontend_Application SHALL 「支援上限に達しています」というメッセージを表示する
4. IF Supporterのウォレット残高が不足している, THEN THE Frontend_Application SHALL 「ウォレット残高が不足しています」というメッセージを表示する
5. IF ネットワークエラーが発生する, THEN THE Frontend_Application SHALL 「ネットワークエラーが発生しました。再試行してください」というメッセージを表示する
