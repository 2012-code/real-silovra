import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-01-28.clover',
})

export const PLANS = {
    free: {
        name: 'Free',
        price: 0,
        linkLimit: 5,
        features: [
            '5 links',
            'Basic profile',
            'QR code sharing',
            'Basic themes',
        ],
    },
    pro: {
        name: 'Pro',
        price: 9,
        linkLimit: Infinity,
        features: [
            'Unlimited links',
            'Advanced analytics',
            'Product & embed blocks',
            'Email collection',
            'Custom themes & fonts',
            'UTM builder',
            'Priority support',
            'Banner images',
            'Link groups',
        ],
    },
} as const

export type PlanType = keyof typeof PLANS

export function canAddLink(plan: PlanType, currentLinkCount: number): boolean {
    return currentLinkCount < PLANS[plan].linkLimit
}

export function isPro(plan?: string): boolean {
    return plan === 'pro'
}
