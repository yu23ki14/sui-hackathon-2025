/**
 * Champion Together - Contract Initialization Script
 *
 * This script initializes DaoPoolState and MembersNFTState on Sui testnet
 * using the Sui TypeScript SDK.
 *
 * Prerequisites:
 * - Node.js installed
 * - @mysten/sui installed: npm install @mysten/sui
 * - Private key or keystore configured
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';

// Configuration
const PACKAGE_ID = '0x1832d899979ae0a231f867a58501e4a7f7a7b49d02cb6844857628c37c404805';
const NETWORK = 'testnet';

// Test addresses (dummy addresses for testing)
const FIGHTER_ADDRESS = '0xf19e7562888b60b5e923de1ab442fb0d0634c901df5732a818c735e6ae0ec0f1';
const GYM_ADDRESS = '0x93e12c085e9f2c8e31c47f1c09e0ae8e25d1a1aa87d1f8c3eac5bb8e349ba6e5';
const ORGANIZER_ADDRESS = '0xd6c57debc815d5bc99d33359c5f6f57a677db93965350ea57ca9dfa1dee61353';

// Distribution ratios (must sum to 100)
const FIGHTER_RATIO = 60;
const GYM_RATIO = 30;
const ORGANIZER_RATIO = 10;

async function initializeContracts() {
  console.log('=== Champion Together Contract Initialization ===\n');

  // Initialize Sui client
  const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

  // TODO: Load your keypair
  // Option 1: From environment variable
  // const keypair = Ed25519Keypair.fromSecretKey(
  //   fromBase64(process.env.SUI_PRIVATE_KEY!)
  // );

  // Option 2: From keystore (for CLI wallet)
  // const keypair = await getKeypairFromFile('~/.sui/sui_config/sui.keystore');

  console.log('⚠️  Manual setup required:');
  console.log('Please uncomment and configure the keypair loading in this script.\n');

  // For now, we'll just show the transaction structure
  console.log('📝 Transaction structure for initialization:\n');

  const tx = new Transaction();

  // Step 1: Initialize MembersNFTState
  console.log('Step 1: Initialize MembersNFTState');

  // Create a temporary DAO pool ID (will be updated later)
  const tempDaoPoolId = '0x0000000000000000000000000000000000000000000000000000000000000000';

  const [nftState] = tx.moveCall({
    target: `${PACKAGE_ID}::member_nft::init_nft_state`,
    arguments: [
      tx.pure.address(tempDaoPoolId), // dao_pool_id (temporary)
    ],
  });

  console.log('  ✓ MembersNFTState will be created\n');

  // Step 2: Initialize DaoPoolState
  console.log('Step 2: Initialize DaoPoolState');

  // Extract the ID from the nft_state object
  // Note: In a real transaction, we'd use the actual object

  const [daoPoolState] = tx.moveCall({
    target: `${PACKAGE_ID}::dao_pool::init_pool`,
    arguments: [
      tx.pure.address(FIGHTER_ADDRESS),
      tx.pure.address(GYM_ADDRESS),
      tx.pure.address(ORGANIZER_ADDRESS),
      tx.pure.u64(FIGHTER_RATIO),
      tx.pure.u64(GYM_RATIO),
      tx.pure.u64(ORGANIZER_RATIO),
      tx.object(nftState), // nft_contract_id (from Step 1)
      tx.object('0x6'), // Clock object
    ],
  });

  console.log('  ✓ DaoPoolState will be created\n');

  // Step 3: Share the objects
  console.log('Step 3: Share objects for public access');

  tx.transferObjects([nftState], tx.pure.address(ORGANIZER_ADDRESS));
  tx.transferObjects([daoPoolState], tx.pure.address(ORGANIZER_ADDRESS));

  // Note: If these should be shared objects (accessible by anyone),
  // we need to add share_object functionality to the Move contracts

  console.log('  ✓ Objects will be transferred to organizer\n');

  console.log('📋 Configuration summary:');
  console.log(`  Package ID: ${PACKAGE_ID}`);
  console.log(`  Fighter: ${FIGHTER_ADDRESS} (${FIGHTER_RATIO}%)`);
  console.log(`  Gym: ${GYM_ADDRESS} (${GYM_RATIO}%)`);
  console.log(`  Organizer: ${ORGANIZER_ADDRESS} (${ORGANIZER_RATIO}%)`);
  console.log('');

  // Uncomment to execute the transaction
  /*
  console.log('Executing transaction...');
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log('✅ Transaction successful!');
  console.log(`Transaction Digest: ${result.digest}`);
  console.log(`Explorer: https://testnet.suivision.xyz/txblock/${result.digest}`);

  // Extract created object IDs
  const effects = result.effects;
  if (effects?.created) {
    console.log('\n📦 Created Objects:');
    effects.created.forEach((obj, index) => {
      console.log(`  ${index + 1}. ${obj.reference.objectId}`);
    });
  }
  */

  console.log('\n💡 To execute this script:');
  console.log('1. Install dependencies: npm install @mysten/sui');
  console.log('2. Configure your keypair in this script');
  console.log('3. Uncomment the execution code above');
  console.log('4. Run: npx tsx initialize.ts');
  console.log('');
  console.log('⚠️  Important: The current contract design requires objects to be');
  console.log('shared for public access. Consider adding share_object calls or');
  console.log('modifying the contract to include proper initialization.');
}

// Run the script
initializeContracts().catch(console.error);
