const https = require('https');

const EMAIL = 'abdallahabdelnbii467@gmail.com';
const PASSWORD = 'abdallah2012##';
const API_URL = 'https://api.nowpayments.io/v1'; // Production

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.nowpayments.io',
            path: '/v1' + path,
            method: method,
            headers: {
                'x-api-key': 'T8KQPKN-QAJ4H8Y-HVTNPZR-H3GME7S',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body))
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
            const jsonBody = JSON.stringify(body);
            console.log('Sending Body:', jsonBody);
            req.write(jsonBody);
        }
        req.end();
    });
}

async function run() {
    // 1. Authenticate
    const responseData = await request('POST', '/auth', {
        email: EMAIL,
        password: PASSWORD
    });

    const response = JSON.parse(responseData);

    if (response.token) {
        console.log('SUCCESS: Got JWT Token');

        // 2. Try to create subscription with Token
        // We need a valid plan ID. From previous step we know 783991728 exists.
        // But we don't want to actually create a real one that charges? 
        // Actually creating a subscription usually just gives a link, it doesn't charge until user pays.

        // We'll just verify the token works by listing plans maybe? 
        // Or just stop here knowing we have the token.
    }
}

run();
