export interface Profile {
    id: string
    username: string
    display_name: string
    bio: string
    avatar_url: string
    banner_url?: string
    theme_id: string
    custom_theme: CustomTheme | null
    total_views?: number
    updated_at: string
    layout_mode?: 'list' | 'grid' | 'stack'
    social_links?: SocialLink[]
    seo_settings?: SEOSettings | null
    custom_font?: string
    enable_email_collection?: boolean
}

export interface SocialLink {
    platform: string
    url: string
    is_visible: boolean
}

export interface SEOSettings {
    title: string
    description: string
    keywords: string
    og_image_url?: string
}

export interface CustomTheme {
    background: string
    fontFamily: string
    buttonStyle: 'glass' | 'solid' | 'outline' | 'brutal' | 'pill'
    buttonColor?: string
    textColor?: string
    background_type?: 'static' | 'liquid' | 'starfield'
}

export interface Link {
    id: string
    user_id: string
    title: string
    url: string
    icon: string
    thumbnail_url?: string
    is_visible: boolean
    is_pinned?: boolean
    schedule_start?: string | null
    schedule_end?: string | null
    category?: string
    animation: string
    position: number
    click_count?: number
    created_at: string
    group_id?: string | null
    link_type?: 'link' | 'product' | 'embed'
    price?: string
    cta_text?: string
}

export interface LinkGroup {
    id: string
    user_id: string
    name: string
    position: number
    is_collapsible: boolean
}

export interface LinkClickEvent {
    id: string
    link_id: string
    user_id: string
    clicked_at: string
    referrer: string | null
    device_type: string | null
    country: string | null
    browser: string | null
}

export interface Notification {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    is_read: boolean
    created_at: string
}

export interface Subscriber {
    id: string
    user_id: string
    email: string
    subscribed_at: string
}

export interface ThemePreset {
    id: string
    name: string
    styles: CustomTheme
    previewUrl?: string
}
