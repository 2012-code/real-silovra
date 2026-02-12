'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Palette, Sparkles, Search, Filter, LayoutGrid, List, Columns, Waves, Stars, Pipette, Type, Square, Circle, Hexagon, RectangleHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CustomTheme } from '@/types'
import { THEME_PRESETS, ThemePreset } from '@/lib/themes'

const GOOGLE_FONTS = [
    'Inter', 'Outfit', 'Space Grotesk', 'DM Sans', 'Quicksand',
    'Poppins', 'Montserrat', 'Raleway', 'Playfair Display', 'Lora',
    'JetBrains Mono', 'Fira Code', 'IBM Plex Sans', 'Nunito',
    'Work Sans', 'Rubik', 'Sora', 'Archivo'
]

const BUTTON_STYLE_OPTIONS = [
    { id: 'glass', label: 'Glass', icon: Square, desc: 'Frosted translucent', preview: 'bg-black/20 backdrop-blur-sm rounded-xl border border-white/10' },
    { id: 'solid', label: 'Solid', icon: Square, desc: 'Bold fill', preview: 'bg-white/10 rounded-xl border border-white/5' },
    { id: 'outline', label: 'Outline', icon: Square, desc: 'Clean border only', preview: 'bg-transparent rounded-xl border-2 border-white/20' },
    { id: 'brutal', label: 'Brutal', icon: Hexagon, desc: 'Sharp neo-brutalism', preview: 'bg-white rounded-none border-4 border-black shadow-[3px_3px_0_#000]' },
    { id: 'pill', label: 'Pill', icon: Circle, desc: 'Smooth capsule', preview: 'bg-white/10 rounded-full border border-white/10' },
]

interface ThemeSelectorProps {
    currentTheme: string
    customTheme: CustomTheme | null
    customFont?: string
    layoutMode: 'list' | 'grid' | 'stack'
    onChange: (themeId: string, customTheme: CustomTheme | null) => void
    onLayoutChange: (mode: 'list' | 'grid' | 'stack') => void
    onFontChange?: (font: string) => void
}

export default function ThemeSelector({
    currentTheme,
    customTheme,
    customFont,
    layoutMode = 'list',
    onChange,
    onLayoutChange,
    onFontChange
}: ThemeSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<ThemePreset['category'] | 'All'>('All')

    const filteredThemes = THEME_PRESETS.filter(theme => {
        const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'All' || theme.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-12">
            {/* 1. Search & Filter Hub */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-zenith-indigo transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH VISUAL REGISTRY..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/[0.08] rounded-3xl text-[11px] text-white font-black uppercase tracking-[0.3em] focus:border-zenith-indigo/40 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="flex bg-white/[0.02] p-2 rounded-[2rem] border border-white/[0.08] w-full sm:w-auto overflow-x-auto no-scrollbar">
                    {['All', 'Minimal', 'Vibrant', 'Glass', 'Dark', 'Pastel', 'Neon', 'Brutal', 'Nature'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as any)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap",
                                activeCategory === cat
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    : "text-white/20 hover:text-white/60"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Atmospheric Matrix (Theme Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                <AnimatePresence>
                    {filteredThemes.map((theme) => (
                        <motion.button
                            key={theme.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                // Preserve background_type when switching presets
                                const currentBgType = customTheme?.background_type
                                const newCustom = currentBgType ? { background_type: currentBgType } : null
                                onChange(theme.id, newCustom as any)
                            }}
                            className={cn(
                                "group relative flex flex-col h-40 rounded-[2.5rem] p-1.5 transition-all duration-700",
                                currentTheme === theme.id
                                    ? "bg-white/[0.08] border border-zenith-indigo/40 zenith-glow"
                                    : "bg-white/[0.02] border border-white/[0.08] hover:border-white/20"
                            )}
                        >
                            <div
                                className="w-full h-full rounded-[2rem] flex items-center justify-center relative overflow-hidden"
                                style={{ background: theme.background }}
                            >
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white mix-blend-difference px-4 text-center leading-tight">
                                    {theme.name}
                                </span>
                                {currentTheme === theme.id && (
                                    <div className="absolute inset-0 border-2 border-white/20 rounded-[1.8rem] animate-pulse" />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* 2.5. Text Color Override */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40">
                        <Palette size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Text Color</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {[
                        { color: '#ffffff', label: 'White' },
                        { color: '#f8fafc', label: 'Snow' },
                        { color: '#e5e5e5', label: 'Silver' },
                        { color: '#a3a3a3', label: 'Gray' },
                        { color: '#000000', label: 'Black' },
                        { color: '#f5f5dc', label: 'Cream' },
                        { color: '#ef4444', label: 'Red' },
                        { color: '#fb923c', label: 'Orange' },
                        { color: '#fbbf24', label: 'Amber' },
                        { color: '#a3e635', label: 'Lime' },
                        { color: '#22c55e', label: 'Green' },
                        { color: '#2dd4bf', label: 'Teal' },
                        { color: '#38bdf8', label: 'Sky' },
                        { color: '#60a5fa', label: 'Blue' },
                        { color: '#c084fc', label: 'Purple' },
                        { color: '#f472b6', label: 'Pink' },
                        { color: '#fb7185', label: 'Rose' },
                        { color: '#ffd700', label: 'Gold' },
                    ].map((swatch) => {
                        const currentTextColor = customTheme?.textColor || THEME_PRESETS.find(t => t.id === currentTheme)?.textColor || '#ffffff'
                        const isActive = currentTextColor.toLowerCase() === swatch.color.toLowerCase()
                        const isLight = ['#ffffff', '#f8fafc', '#e5e5e5', '#f5f5dc', '#fbbf24', '#a3e635', '#ffd700', '#2dd4bf'].includes(swatch.color)
                        return (
                            <button
                                key={swatch.color}
                                onClick={() => {
                                    const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                    const baseTheme: any = customTheme || {}
                                    onChange(currentTheme, {
                                        ...baseTheme,
                                        background: baseTheme.background || currentPreset?.background || '',
                                        fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                        buttonStyle: baseTheme.buttonStyle || currentPreset?.buttonStyle || 'glass',
                                        textColor: swatch.color,
                                    })
                                }}
                                className={cn(
                                    "relative w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110",
                                    isActive
                                        ? "border-zenith-indigo ring-2 ring-zenith-indigo/30 scale-110"
                                        : "border-white/10 hover:border-white/30"
                                )}
                                style={{ background: swatch.color }}
                                title={swatch.label}
                            >
                                {isActive && (
                                    <Check size={12} className="absolute inset-0 m-auto" style={{ color: isLight ? '#000' : '#fff' }} />
                                )}
                            </button>
                        )
                    })}

                    {/* Custom hex input */}
                    <input
                        type="color"
                        value={customTheme?.textColor || THEME_PRESETS.find(t => t.id === currentTheme)?.textColor || '#ffffff'}
                        onChange={(e) => {
                            const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                            const baseTheme: any = customTheme || {}
                            onChange(currentTheme, {
                                ...baseTheme,
                                background: baseTheme.background || currentPreset?.background || '',
                                fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                buttonStyle: baseTheme.buttonStyle || currentPreset?.buttonStyle || 'glass',
                                textColor: e.target.value,
                            })
                        }}
                        className="w-9 h-9 rounded-full cursor-pointer border-2 border-dashed border-white/20 hover:border-white/40 transition-all bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                        title="Pick any color"
                    />
                </div>
            </div>

            {/* 2.7. Custom Theme Builder */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40">
                        <Pipette size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Custom Background</h3>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 space-y-8">
                    {/* Gradient builder */}
                    <div className="space-y-4">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Gradient Colors</p>
                        <div className="flex items-center gap-4">
                            <div className="space-y-2 flex-1">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">From</label>
                                <input
                                    type="color"
                                    value={(() => {
                                        const bg = customTheme?.background || ''
                                        const match = bg.match(/#[0-9a-fA-F]{6}/)
                                        return match ? match[0] : '#4f46e5'
                                    })()}
                                    onChange={(e) => {
                                        const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                        const baseTheme: any = customTheme || {}
                                        const currentBg = baseTheme.background || ''
                                        const colors = currentBg.match(/#[0-9a-fA-F]{6}/g) || ['#4f46e5', '#ec4899']
                                        const c2 = colors[1] || '#ec4899'
                                        onChange(currentTheme, {
                                            ...baseTheme,
                                            background: `linear-gradient(135deg, ${e.target.value} 0%, ${c2} 100%)`,
                                            fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                            buttonStyle: baseTheme.buttonStyle || currentPreset?.buttonStyle || 'glass',
                                        })
                                    }}
                                    className="w-full h-12 rounded-2xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none"
                                />
                            </div>
                            <div className="space-y-2 flex-1">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">To</label>
                                <input
                                    type="color"
                                    value={(() => {
                                        const bg = customTheme?.background || ''
                                        const colors = bg.match(/#[0-9a-fA-F]{6}/g) || []
                                        return colors[1] || '#ec4899'
                                    })()}
                                    onChange={(e) => {
                                        const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                        const baseTheme: any = customTheme || {}
                                        const currentBg = baseTheme.background || ''
                                        const colors = currentBg.match(/#[0-9a-fA-F]{6}/g) || ['#4f46e5', '#ec4899']
                                        const c1 = colors[0] || '#4f46e5'
                                        onChange(currentTheme, {
                                            ...baseTheme,
                                            background: `linear-gradient(135deg, ${c1} 0%, ${e.target.value} 100%)`,
                                            fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                            buttonStyle: baseTheme.buttonStyle || currentPreset?.buttonStyle || 'glass',
                                        })
                                    }}
                                    className="w-full h-12 rounded-2xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none"
                                />
                            </div>
                        </div>
                        {/* Solid color option */}
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Or Solid Color</label>
                            <input
                                type="color"
                                value={(() => {
                                    const bg = customTheme?.background || ''
                                    const match = bg.match(/^#[0-9a-fA-F]{6}$/)
                                    return match ? bg : '#1a1a2e'
                                })()}
                                onChange={(e) => {
                                    const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                    const baseTheme: any = customTheme || {}
                                    onChange(currentTheme, {
                                        ...baseTheme,
                                        background: e.target.value,
                                        fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                        buttonStyle: baseTheme.buttonStyle || currentPreset?.buttonStyle || 'glass',
                                    })
                                }}
                                className="w-full h-12 rounded-2xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none"
                            />
                        </div>
                    </div>

                    {/* Preview swatch */}
                    <div
                        className="h-16 rounded-2xl border border-white/10 shadow-inner"
                        style={{ background: customTheme?.background || THEME_PRESETS.find(t => t.id === currentTheme)?.background || '#1a1a2e' }}
                    />
                </div>
            </div>

            {/* 2.8. Button Style Customizer */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40">
                        <RectangleHorizontal size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Button Style</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {BUTTON_STYLE_OPTIONS.map((style) => {
                        const currentButtonStyle = customTheme?.buttonStyle || 'glass'
                        const isActive = currentButtonStyle === style.id
                        return (
                            <button
                                key={style.id}
                                onClick={() => {
                                    const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                    const baseTheme: any = customTheme || {}
                                    onChange(currentTheme, {
                                        ...baseTheme,
                                        background: baseTheme.background || currentPreset?.background || '',
                                        fontFamily: baseTheme.fontFamily || currentPreset?.fontFamily || 'Inter',
                                        buttonStyle: style.id as any,
                                    })
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-5 rounded-[2rem] border transition-all duration-500 group",
                                    isActive
                                        ? "bg-white/[0.08] border-zenith-indigo/40 zenith-glow"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className={cn("w-full h-8 transition-all", style.preview)} />
                                <div className="text-center space-y-0.5">
                                    <p className="text-[9px] font-black text-white uppercase tracking-widest">{style.label}</p>
                                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-wider">{style.desc}</p>
                                </div>
                                {isActive && <Check size={10} className="text-zenith-indigo" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 2.9. Custom Font Picker */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40">
                        <Type size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Typography</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {GOOGLE_FONTS.map((font) => {
                        const activeFont = customFont || customTheme?.fontFamily || 'Inter'
                        const isActive = activeFont === font
                        return (
                            <button
                                key={font}
                                onClick={() => onFontChange?.(font)}
                                className={cn(
                                    "flex flex-col gap-2 p-5 rounded-[2rem] border transition-all duration-500 text-left group",
                                    isActive
                                        ? "bg-white/[0.08] border-zenith-indigo/40 zenith-glow"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                <span className="text-lg font-bold text-white truncate" style={{ fontFamily: font }}>
                                    Aa
                                </span>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest truncate">{font}</span>
                                    {isActive && <Check size={10} className="text-zenith-indigo shrink-0" />}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 3. Structure Matrix (Layout Mode) */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40">
                        <Columns size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Structure Matrix</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { id: 'list', label: 'Linear Stack', icon: List, desc: 'Classic vertical progression' },
                        { id: 'grid', label: 'Bento Grid', icon: LayoutGrid, desc: 'Dense information density' },
                        { id: 'stack', label: 'Side Stack', icon: Columns, desc: 'Modern asymmetrical flow' },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => onLayoutChange(mode.id as any)}
                            className={cn(
                                "flex flex-col gap-4 p-6 rounded-[2.5rem] border transition-all duration-500 text-left group",
                                layoutMode === mode.id
                                    ? "bg-white/[0.08] border-zenith-indigo/40 zenith-glow"
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-colors",
                                    layoutMode === mode.id ? "bg-zenith-indigo/20 text-zenith-indigo" : "bg-white/5 text-white/20 group-hover:text-white/40"
                                )}>
                                    <mode.icon size={18} />
                                </div>
                                {layoutMode === mode.id && <Check size={14} className="text-zenith-indigo" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{mode.label}</p>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider leading-relaxed">{mode.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
                {/* 4. Atmospheric Vibe (Background Engine) */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-xl text-white/40">
                            <Waves size={14} />
                        </div>
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Cinematic Atmosphere</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { id: 'static', label: 'Static Void', icon: Filter, desc: 'Zero-latency solid state' },
                            { id: 'liquid', label: 'Liquid Nebula', icon: Waves, desc: 'Flowing gradient mesh' },
                            { id: 'starfield', label: 'Deep Starfield', icon: Stars, desc: 'Parallax stellar drift' },
                        ].map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => {
                                    // When selecting atmosphere, include the current preset's background
                                    const currentPreset = THEME_PRESETS.find(t => t.id === currentTheme)
                                    const baseTheme: any = customTheme || {}
                                    onChange(currentTheme, {
                                        ...baseTheme,
                                        background: currentPreset?.background || baseTheme.background || '',
                                        fontFamily: currentPreset?.fontFamily || baseTheme.fontFamily || 'Inter',
                                        buttonStyle: currentPreset?.buttonStyle || baseTheme.buttonStyle || 'glass',
                                        background_type: bg.id as any
                                    })
                                }}
                                className={cn(
                                    "flex flex-col gap-4 p-6 rounded-[2.5rem] border transition-all duration-500 text-left group",
                                    customTheme?.background_type === bg.id
                                        ? "bg-white/[0.08] border-zenith-indigo/40 zenith-glow"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "p-3 rounded-2xl transition-colors",
                                        customTheme?.background_type === bg.id ? "bg-zenith-indigo/20 text-zenith-indigo" : "bg-white/5 text-white/20 group-hover:text-white/40"
                                    )}>
                                        <bg.icon size={18} />
                                    </div>
                                    {customTheme?.background_type === bg.id && <Check size={14} className="text-zenith-indigo" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{bg.label}</p>
                                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider leading-relaxed">{bg.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* 5. Technical Note */}
            <div className="bg-zenith-indigo/[0.03] border border-zenith-indigo/10 rounded-[3rem] p-10 flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 text-zenith-indigo/5 pointer-events-none">
                    <Sparkles size={80} strokeWidth={0.5} />
                </div>
                <div className="p-4 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo zenith-glow">
                    <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-zenith-indigo">Environment Registry Active</h4>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-loose max-w-2xl">
                        Atmospheric presets are computed in real-time. Selecting a signature override will propagate through the entire Silovra system. Ensure resolution is calibrated.
                    </p>
                </div>
            </div>
        </div>
    )
}
