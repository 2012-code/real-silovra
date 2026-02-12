/**
 * Returns the base URL for the application based on the environment.
 * Prioritizes custom site URL > Vercel URL > window origin > localhost fallback.
 */
export function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // Server-side
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    return 'http://localhost:3000'
}
