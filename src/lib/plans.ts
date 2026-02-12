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
        limits: {
            links: 5,
            products: false, // No product links
            embeds: false,   // No embed links
            groups: false,   // No link groups
            analytics: 'basic', // View/Click counts only
            themes: 'basic',    // Default themes only
            fonts: 'basic',     // Default fonts only
            banners: false,     // No custom banners
            email_collection: false,
            utm_builder: false,
            support: 'standard',
        }
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
        limits: {
            links: Infinity,
            products: true,
            embeds: true,
            groups: true,
            analytics: 'advanced', // Device, Location, Charts
            themes: 'custom',      // All themes + Custom CSS
            fonts: 'custom',       // Google Fonts
            banners: true,
            email_collection: true,
            utm_builder: true,
            support: 'priority',
        }
    },
} as const

export type PlanType = keyof typeof PLANS

export function canAddLink(plan: string | undefined, currentLinkCount: number): boolean {
    const p = (plan || 'free') as PlanType
    return currentLinkCount < PLANS[p].limits.links
}

export function hasFeature(plan: string | undefined, feature: keyof typeof PLANS['free']['limits']): boolean | string | number {
    const p = (plan || 'free') as PlanType
    return PLANS[p].limits[feature]
}

export function isPro(plan?: string): boolean {
    return plan === 'pro'
}
