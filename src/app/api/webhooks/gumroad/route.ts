import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const body = Object.fromEntries(formData)

        // Verify it's a sale
        // resource_name should be 'sale'
        // You can also verify the signature here if you have the application secret

        // Custom fields are passed as url_params[key]
        // Note: Gumroad sends custom fields differently depending on how they were passed.
        // If passed as ?user_id=123, it might be in url_params

        const userId = body['url_params[user_id]'] as string
        const productId = body['product_id'] as string
        const email = body['email'] as string

        // Log for debugging
        console.log('Gumroad Webhook:', { userId, productId, email })

        if (!userId) {
            console.error('No user_id found in webhook')
            return NextResponse.json({ error: 'No user_id provided' }, { status: 400 })
        }

        const supabase = await createClient()

        // Update user to pro
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                stripe_customer_id: `gumroad_${body['sale_id']}` // Using this field to store gumroad sale ID for now
            })
            .eq('id', userId)

        if (updateError) {
            console.error('Supabase update error:', updateError)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Gumroad webhook error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
