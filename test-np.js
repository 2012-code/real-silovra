const https = require('https');

const API_KEY = 'T8KQPKN-QAJ4H8Y-HVTNPZR-H3GME7S';
const API_URL = 'https://api.nowpayments.io/v1'; // Production
// const API_URL = 'https://api-sandbox.nowpayments.io/v1'; // Sandbox

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.nowpayments.io',
            path: '/v1' + path,
            method: method,
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\n--- ${method} ${path} ---`);
                console.log('Status:', res.statusCode);
                console.log('Body:', data);
                resolve(data);
            });
        });

        req.on('error', (e) => {
            console.error(e);
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    // 1. Get Plan (verified working)
    // await request('GET', '/subscriptions/plans/783991728');

    // 2. Try to create invoice
    await request('POST', '/invoice', {
        price_amount: 9,
        price_currency: 'usd',
        order_id: 'test_user_123',
        order_description: 'Test Invoice'
    });
}

run();
