/**
 * Lit Protocol × Sui Integration
 * Sui残高ベースのコンテンツアクセスコントロール
 */

export { encryptContent } from "./encrypt.js";
export { decryptContent } from "./decrypt.js";
export { suiBalanceCheckAction } from "./litAction.js";

// フロントエンドで使用するための型定義
export interface EncryptedContent {
  ciphertext: string;
  dataToEncryptHash: string;
  litActionCode: string;
  requiredBalance: string;
  network: string;
  createdAt: string;
}

export interface DecryptOptions {
  suiAddress: string;
  encryptedData: EncryptedContent;
  litNetwork?: "datil-test" | "datil";
}

export interface EncryptOptions {
  content: string;
  requiredBalanceSui?: number; // デフォルト: 0.1 SUI
  litNetwork?: "datil-test" | "datil";
}
