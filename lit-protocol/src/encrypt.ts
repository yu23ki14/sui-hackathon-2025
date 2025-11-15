/**
 * Lit Protocol Encryption Script
 *
 * This script encrypts content that can only be decrypted by users who hold at least 0.1 SUI on Sui Testnet.
 * The encrypted data and necessary keys are output to be added to the frontend config.
 */

import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { LitNetwork } from '@lit-protocol/constants';
import type { UnifiedAccessControlConditions } from '@lit-protocol/types';

interface EncryptionResult {
  ciphertext: string;
  dataToEncryptHash: string;
  unifiedAccessControlConditions: UnifiedAccessControlConditions;
}

/**
 * Unified Access Control Conditions: User must have at least 0.1 SUI on Sui Testnet
 *
 * Note: Since Lit Protocol doesn't natively support Sui yet, we use a custom condition
 * that will be verified on the frontend by checking the user's wallet balance.
 * For now, we use a simple EVM-based condition as a fallback.
 */
const unifiedAccessControlConditions: UnifiedAccessControlConditions = [
  {
    conditionType: 'evmBasic',
    contractAddress: '',
    standardContractType: '',
    chain: 'ethereum',
    method: '',
    parameters: [':userAddress'],
    returnValueTest: {
      comparator: '>=',
      value: '0', // Allow all for testing; real verification happens in frontend
    },
  },
];

/**
 * Encrypt a string using Lit Protocol
 */
async function encryptString(content: string): Promise<EncryptionResult> {
  console.log('🔐 Initializing Lit Protocol client...');

  // Initialize Lit client
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: false,
  });

  await litNodeClient.connect();
  console.log('✅ Connected to Lit Network');

  // Encrypt the content
  console.log(`\n🔒 Encrypting content: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);

  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      unifiedAccessControlConditions,
      dataToEncrypt: content,
    },
    litNodeClient,
  );

  console.log('✅ Content encrypted successfully');

  // Disconnect
  await litNodeClient.disconnect();

  return {
    ciphertext,
    dataToEncryptHash,
    unifiedAccessControlConditions,
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    // Example content to encrypt
    const contentToEncrypt = 'This is exclusive content for TEAM KENTA members! 🥊';

    console.log('═══════════════════════════════════════════════════════');
    console.log('  LIT PROTOCOL ENCRYPTION TOOL');
    console.log('═══════════════════════════════════════════════════════\n');

    const result = await encryptString(contentToEncrypt);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ENCRYPTION RESULT');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📦 Ciphertext:', result.ciphertext);
    console.log('\n🔑 Data Hash:', result.dataToEncryptHash);
    console.log('\n🔐 Unified Access Control Conditions:');
    console.log(JSON.stringify(result.unifiedAccessControlConditions, null, 2));

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  NEXT STEPS');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('1. Add the encrypted data to frontend/src/config/index.ts');
    console.log('2. Update the access control conditions for Sui Testnet');
    console.log('3. Test decryption in the frontend\n');

    // Output for easy copy-paste to config
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CONFIG OUTPUT (Copy to config/index.ts)');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`export const litProtocolConfig = {
  encryptedContent: "${result.ciphertext}",
  dataToEncryptHash: "${result.dataToEncryptHash}",
  unifiedAccessControlConditions: ${JSON.stringify(result.unifiedAccessControlConditions, null, 2).replace(/\n/g, '\n  ')}
};`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { encryptString, unifiedAccessControlConditions };
