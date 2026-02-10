export interface Profile {
    id: string
    username: string
    display_name: string
    bio: string
    avatar_url: string
    theme_id: string
    custom_theme: CustomTheme | null
    updated_at: string
}

export interface CustomTheme {
    background: string
    fontFamily: string
    buttonStyle: 'rounded' | 'sharp' | 'pill' | 'blob'
    buttonColor?: string
    textColor?: string
}

export interface Link {
    id: string
    user_id: string
    title: string
    url: string
    icon: string
    is_visible: boolean
    animation: string
    position: number
    created_at: string
}

export interface ThemePreset {
    id: string
    name: string
    styles: CustomTheme
    previewUrl?: string
}
