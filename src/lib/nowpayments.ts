const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY
const NOWPAYMENTS_API_URL = process.env.NOWPAYMENTS_API_URL || 'https://api-sandbox.nowpayments.io/v1'


export async function createInvoice(price_amount: number, order_id: string, order_description: string) {
    if (!NOWPAYMENTS_API_KEY) throw new Error('NOWPayments API Key missing')

    const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
        method: 'POST',
        headers: {
            'x-api-key': NOWPAYMENTS_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price_amount,
            price_currency: 'usd',
            order_id,
            order_description,
            ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create invoice')
    }

    return response.json()
}

export function verifySignature(params: any, signature: string, ipnSecret: string) {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(params).sort()
    const sortedParams = sortedKeys.map(key => `${key}=${params[key]}`).join('&')

    // HMAC SHA-512 (You might need a crypto library if 'crypto' is not available in Edge runtime, but it usually is in Node)
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha512', ipnSecret)
    hmac.update(sortedParams)
    return hmac.digest('hex') === signature
}
