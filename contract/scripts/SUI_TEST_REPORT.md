# SUI型支援機能テスト結果

## テスト日時
2025-11-15

## テスト概要
DaoPoolコントラクトのジェネリック型対応後、SUI型での支援機能をテストしました。

## テスト環境
- **Network**: Sui Testnet
- **Package ID**: `0x95284f938b09467b5e1d83132cb1b864c4f1da3578948cadb9fbd9db79bf3f58`
- **DaoPoolState**: `0x1e9f46227e14acb8d79751b1ab40cfea1064e6cd9ff47d27d3c35b803dee24a0`
- **NFTState**: `0x387f81bf1b95142dfbc88f5bfa2de7dc20056324198bc51f787e01326d5ac853`
- **Coin Type**: `0x2::sui::SUI`

## テスト実行

### 支援前の状態
```json
{
  "total_raised": "0",
  "support_cap": "3000000000",
  "treasury": "0"
}
```

### 実行したトランザクション
- **Transaction Digest**: `9Fe3tg1dQPycnpE5JjEygX1PbLdjaat8XR317sj7xKNj`
- **Explorer**: https://testnet.suivision.xyz/txblock/9Fe3tg1dQPycnpE5JjEygX1PbLdjaat8XR317sj7xKNj
- **支援額**: 1,000,000,000 (1 SUI)
- **Status**: ✅ Success

### 発行されたイベント

#### 1. SupportEvent
```json
{
  "amount": "1000000000",
  "supporter": "0x6c1aa061d0495b71eefd97e7d0a1cef0092f5c64d1b751decdc7b5ad0d039c02",
  "timestamp": "1763186401103"
}
```

#### 2. MintEvent
```json
{
  "rank": "Platinum",
  "recipient": "0x6c1aa061d0495b71eefd97e7d0a1cef0092f5c64d1b751decdc7b5ad0d039c02",
  "support_amount": "1000000000",
  "timestamp": "1763186401103",
  "token_id": "1"
}
```

### 支援後の状態
```json
{
  "total_raised": "1000000000",
  "support_cap": "3000000000",
  "treasury": "1000000000"
}
```

### 発行されたNFT
- **Object ID**: `0xff41bdcbdecf4dfee50b0ba44f19b69fd87b94f2ddf1e5737c4e3f3877701dc5`
- **Token ID**: 1
- **Rank**: Platinum
- **Support Amount**: 1,000,000,000 (1 SUI)
- **Minted At**: 1763186401103

## テスト結果

### ✅ 成功した項目

1. **SUIコインでの支援**: SUI型のコインを使用して支援関数を正常に実行できました
2. **型パラメータの検証**: `--type-args "0x2::sui::SUI"` を指定することで、ジェネリック型が正しく機能しました
3. **NFTの発行**: 支援額に応じて正しいランク（Platinum）のNFTが発行されました
4. **Treasury残高の増加**: DaoPoolStateのtreasury残高が支援額分（1 SUI）増加しました
5. **total_raisedの更新**: 総支援額が正しく記録されました
6. **イベントの発行**: SupportEventとMintEventが正しく発行されました

## 注意事項

### コイン型と小数点精度の違い
- **USDC**: 6桁の小数点精度（1 USDC = 1,000,000）
- **SUI**: 9桁の小数点精度（1 SUI = 1,000,000,000）

### 支援上限の考慮
- 現在の`support_cap`は3,000,000,000に設定されています
- これはUSDC用に設計された値（3,000 USDC）ですが、SUIでは3 SUIに相当します
- SUIで大きな金額を支援する場合は、support_capを調整する必要があります

### ランク閾値
現在のランク閾値はUSDC（6桁精度）を前提としています：
- Bronze: 10,000,000 (10 USDC)
- Silver: 50,000,000 (50 USDC)
- Gold: 100,000,000 (100 USDC)
- Platinum: 200,000,000 (200 USDC)

SUIの場合、これらの値は非常に小さな金額になります：
- Bronze: 0.01 SUI
- Silver: 0.05 SUI
- Gold: 0.1 SUI
- Platinum: 0.2 SUI

1 SUI（1,000,000,000）を支援したため、Platinumランクが付与されました。

## 結論

✅ **テスト成功**: SUI型での支援機能は正常に動作しています。

ジェネリック型パラメータの実装により、DaoPoolコントラクトは以下をサポートできることが確認されました：
- SUI型での支援
- USDC型での支援（別途テスト済み）
- その他の任意のコイン型での支援（理論上）

## 次のステップ

1. ✅ Task 17完了: SUI型で支援機能をテスト
2. ⏭️ Task 18（オプション）: 分配機能をテスト
3. ⏭️ Task 19（オプション）: 勝利ボーナス分配機能をテスト
4. ⏭️ Task 20（オプション）: ドキュメントを更新
