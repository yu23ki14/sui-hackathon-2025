#!/usr/bin/env tsx

/**
 * Champion Together - Initialize USDC Pool
 * USDC型のDaoPoolStateを作成するTypeScriptスクリプト
 */

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { fromBase64 } from '@mysten/sui/utils';
import { bech32 } from 'bech32';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// .envファイルを読み込む（contractディレクトリに配置）
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// 環境変数を取得
const PACKAGE_ID = process.env.PACKAGE_ID;
const NFT_STATE = process.env.NFT_STATE;
const CLOCK_OBJECT = process.env.CLOCK_OBJECT || '0x6';

if (!PACKAGE_ID || !NFT_STATE) {
    console.error('Error: PACKAGE_ID and NFT_STATE must be set in .env file');
    process.exit(1);
}

// USDC型の定義（Testnet USDC）
const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  USDC型DaoPoolState初期化');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Sui Clientを初期化
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    // キーペアを取得（環境変数またはSui CLIの設定から）
    const privateKey = process.env.PRIVATE_KEY;
    let keypair: Ed25519Keypair;

    if (privateKey) {
        // suiprivkey形式の場合はBech32デコードを使用
        if (privateKey.startsWith('suiprivkey')) {
            const decoded = bech32.decode(privateKey);
            const words = bech32.fromWords(decoded.words);
            // 最初の1バイトはスキーマ、残りの32バイトが秘密鍵
            const secretKey = Uint8Array.from(words.slice(1, 33));
            keypair = Ed25519Keypair.fromSecretKey(secretKey);
        } else {
            // Base64形式の場合
            keypair = Ed25519Keypair.fromSecretKey(fromBase64(privateKey));
        }
    } else {
        // Sui CLIの設定から読み込む
        console.log('Note: Using Sui CLI active address. Set PRIVATE_KEY in .env for automation.');
        console.error('Error: Cannot read keypair from Sui CLI config automatically.');
        console.error('Please set PRIVATE_KEY in .env file (suiprivkey format) or use the shell script version.');
        process.exit(1);
    }

    const sender = keypair.getPublicKey().toSuiAddress();
    console.log('Sender Address:', sender);
    console.log('');

    // トランザクションを構築
    const tx = new Transaction();

    // init_pool関数を呼び出し
    const [daoPoolState] = tx.moveCall({
        target: `${PACKAGE_ID}::dao_pool::init_pool`,
        typeArguments: [USDC_TYPE],
        arguments: [
            tx.pure.address(sender), // fighter_address
            tx.pure.address(sender), // gym_address
            tx.pure.address(sender), // organizer_address
            tx.pure.u64(60), // fighter_ratio
            tx.pure.u64(30), // gym_ratio
            tx.pure.u64(10), // organizer_ratio
            tx.object(CLOCK_OBJECT), // clock
        ],
    });

    // 返されたDaoPoolStateを共有オブジェクトとして公開
    // public_share_objectを使用（storeアビリティを持つ型用）
    tx.moveCall({
        target: `0x2::transfer::public_share_object`,
        typeArguments: [`${PACKAGE_ID}::dao_pool::DaoPoolState<${USDC_TYPE}>`],
        arguments: [daoPoolState],
    });

    console.log('トランザクションを実行中...');
    console.log('');

    try {
        // トランザクションを実行
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });

        console.log('✓ DaoPoolStateが作成されました！');
        console.log('');
        console.log('Transaction Digest:', result.digest);
        console.log('Explorer: https://testnet.suivision.xyz/txblock/' + result.digest);
        console.log('');

        // 作成されたDaoPoolStateオブジェクトIDを取得
        const createdObjects = result.objectChanges?.filter(
            (change) => change.type === 'created' && change.objectType.includes('DaoPoolState')
        );

        if (createdObjects && createdObjects.length > 0) {
            const usdcDaoPoolState = (createdObjects[0] as any).objectId;
            console.log('新しいDaoPoolState (USDC型):');
            console.log(usdcDaoPoolState);
            console.log('');

            // .envファイルに追加
            const newLine = `\n# USDC型DaoPoolState (Created ${new Date().toISOString()})\nUSDC_DAO_POOL_STATE=${usdcDaoPoolState}\n`;
            fs.appendFileSync(envPath, newLine);

            console.log('✓ .envファイルに追加しました');
            console.log('');
            console.log('次のステップ:');
            console.log('test_support.shを実行してUSDCで支援をテストできます:');
            console.log(`  DAO_POOL_STATE=${usdcDaoPoolState} ./contract/scripts/test_support.sh`);
        }

        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  初期化完了');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
        console.error('✗ エラー: DaoPoolStateの作成に失敗しました');
        console.error('');
        console.error('エラー詳細:', error);
        process.exit(1);
    }
}

main();
