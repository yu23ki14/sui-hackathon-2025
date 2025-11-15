/**
 * Lit Action: Sui Balance Check
 *
 * This action checks if a Sui address has at least 0.1 SUI (100,000,000 MIST)
 * and grants access to decrypt content if the condition is met.
 */

export const suiBalanceCheckAction = `
(async () => {
  const REQUIRED_BALANCE = "100000000"; // 0.1 SUI in MIST (1 SUI = 1,000,000,000 MIST)
  const SUI_RPC_URL = "https://fullnode.testnet.sui.io:443";

  // MOCK: ハードコードされた Sui アドレス（テスト用）
  // 残高不足のアドレスでテスト
  const suiAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";

  if (!suiAddress) {
    throw new Error("Sui address is required");
  }

  // Call Sui RPC to get balance
  const response = await fetch(SUI_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "suix_getBalance",
      params: [suiAddress, "0x2::sui::SUI"]
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error("Failed to fetch balance: " + JSON.stringify(data.error));
  }

  const balance = data.result?.totalBalance || "0";
  const hasEnoughBalance = BigInt(balance) >= BigInt(REQUIRED_BALANCE);

  // If balance requirement is NOT met, throw an error to deny access
  if (!hasEnoughBalance) {
    throw new Error(\`Insufficient balance: \${balance} MIST (required: \${REQUIRED_BALANCE} MIST)\`);
  }

  // If we reach here, access is granted
  // Return true to indicate success
  LitActions.setResponse({ response: "true" });
})();
`;
