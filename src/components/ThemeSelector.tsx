'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CustomTheme } from '@/types'

const PRESET_THEMES = [
    { id: 'default', name: 'Original', background: 'linear-gradient(to bottom right, #4f46e5, #ec4899)' },
    { id: 'dark', name: 'Midnight', background: '#000000' },
    { id: 'light', name: 'Clean', background: '#ffffff' },
    { id: 'forest', name: 'Forest', background: 'linear-gradient(to bottom right, #134e5e, #71b280)' },
]

interface ThemeSelectorProps {
    currentTheme: CustomTheme | null
    onSelect: (theme: CustomTheme) => void
}

export default function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
    const [selectedPreset, setSelectedPreset] = useState<string>('default')

    const handlePresetSelect = (preset: typeof PRESET_THEMES[0]) => {
        setSelectedPreset(preset.id)
        onSelect({
            background: preset.background,
            fontFamily: 'Inter',
            buttonStyle: 'rounded'
        })
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</h3>
            <div className="grid grid-cols-4 gap-3">
                {PRESET_THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handlePresetSelect(theme)}
                        className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                            selectedPreset === theme.id
                                ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-zinc-800"
                                : "border-transparent hover:border-gray-300 dark:hover:border-zinc-600"
                        )}
                        style={{ background: theme.background }}
                        title={theme.name}
                    >
                        {selectedPreset === theme.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Check className="text-white w-5 h-5" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Customization controls could go here (Color picker, etc.) */}
        </div>
    )
}
