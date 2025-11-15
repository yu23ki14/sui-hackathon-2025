/**
 * Lit Action コードを IPFS にアップロードするヘルパー
 */

interface IPFSUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Lit Action コードを IPFS (Pinata) にアップロード
 * 注意: Pinata API キーが必要です
 */
export async function uploadLitActionToIPFS(
  litActionCode: string,
  pinataApiKey?: string,
  pinataSecretKey?: string
): Promise<string> {
  // Pinata API キーの確認
  const apiKey = pinataApiKey || process.env.PINATA_API_KEY;
  const secretKey = pinataSecretKey || process.env.PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error(
      "Pinata API キーが設定されていません。環境変数 PINATA_API_KEY と PINATA_SECRET_KEY を設定してください。"
    );
  }

  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  // FormData を作成して JavaScript コードを直接アップロード
  const formData = new FormData();

  // JavaScript コードを Blob として追加
  const blob = new Blob([litActionCode], { type: "text/javascript" });
  formData.append("file", blob, "lit-action.js");

  // メタデータを追加
  const metadata = JSON.stringify({
    name: "sui-balance-check-lit-action.js",
    keyvalues: {
      type: "lit-action",
      blockchain: "sui",
    },
  });
  formData.append("pinataMetadata", metadata);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS アップロードに失敗しました: ${response.statusText}`);
    }

    const result: IPFSUploadResponse = await response.json();
    const ipfsCid = result.IpfsHash;

    console.log(`✅ IPFS にアップロードしました: ipfs://${ipfsCid}`);

    return `ipfs://${ipfsCid}`;
  } catch (error: any) {
    throw new Error(`IPFS アップロードエラー: ${error.message}`);
  }
}

/**
 * ローカル Lit Action を使用（IPFS アップロードなし）
 * 注意: v7 では制限がある可能性があります
 */
export function createInlineLitActionCondition(
  litActionCode: string,
  returnKey: string = "granted",
  expectedValue: string = "true"
) {
  return {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "",
    parameters: [],
    returnValueTest: {
      comparator: "=",
      value: expectedValue,
    },
  };
}
