const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const url = process.env.DATABASE_URL;
    console.log('Testing connection with URL (partially hidden):', url.replace(/:.*@/, ':****@'));

    try {
        const connection = await mysql.createConnection(url);
        console.log('✅ Connection successful!');
        await connection.end();
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Tip: This usually means:');
            console.log('1. The password or username is wrong.');
            console.log('2. Your current IP is not whitelisted in Hostinger (Remote MySQL).');
        }
    }
}

test();
