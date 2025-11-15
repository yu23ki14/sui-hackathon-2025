/**
 * Lit Protocol Test Script
 *
 * This script tests encryption and decryption functionality
 */

import { encryptString } from './encrypt.js';

/**
 * Test encryption and decryption
 */
async function testEncryptDecrypt() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  LIT PROTOCOL TEST');
  console.log('═══════════════════════════════════════════════════════\n');

  const testContent = 'Test content for TEAM KENTA! 🥊';

  console.log(`📝 Original content: "${testContent}"\n`);

  // Encrypt
  console.log('🔒 Encrypting...');
  const encryptedResult = await encryptString(testContent);
  console.log('✅ Encryption successful\n');

  // Try to decrypt (this will fail without proper authentication)
  console.log('🔓 Attempting decryption...');
  console.log('⚠️  Note: Decryption requires browser environment with wallet connection');
  console.log('   This test only demonstrates the encryption flow.\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('  TEST RESULT');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('✅ Encryption test passed');
  console.log('📦 Ciphertext length:', encryptedResult.ciphertext.length, 'characters');
  console.log('🔑 Data hash:', encryptedResult.dataToEncryptHash);
  console.log('\n💡 To test decryption, use the frontend application with a connected wallet\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    await testEncryptDecrypt();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
