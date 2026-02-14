import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Hardcoded for test/demo purposes since I can't easily edit .env.local without user action
// In production, these should be env vars
const API_KEY = 'T8KQPKN-QAJ4H8Y-HVTNPZR-H3GME7S'
const SUBSCRIPTION_PLAN_ID = '783991728'
// Use Sandbox URL
const API_URL = 'https://api-sandbox.nowpayments.io/v1'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const body = await req.json()
        const { email } = body

        // Create subscription in NOWPayments
        const response = await fetch(`${API_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription_plan_id: SUBSCRIPTION_PLAN_ID,
                email: email || user.email,
                order_id: user.id, // Important: Link payment to User ID
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('NOWPayments Error:', error)
            return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 })
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (err: any) {
        console.error('Subscription creation error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
