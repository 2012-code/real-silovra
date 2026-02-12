export interface ThemePreset {
    id: string;
    name: string;
    category: 'Minimal' | 'Vibrant' | 'Glass' | 'Brutal' | 'Nature' | 'Dark' | 'Pastel' | 'Neon';
    background: string;
    textColor: string;
    buttonStyle: string;
    fontFamily: string;
}

export const THEME_PRESETS: ThemePreset[] = [
    // =============================================
    //  NATURE (12 themes)
    // =============================================
    { id: 'desert-rose', name: 'Desert Rose', category: 'Nature', background: 'linear-gradient(90deg, #c28484 0%, #ab5252 49%, #bdb5a2 98%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'teal-cream', name: 'Ocean & Cream', category: 'Nature', background: 'linear-gradient(90deg, rgba(132, 193, 194, 1) 0%, rgba(255, 255, 255, 1) 49%, rgba(189, 181, 162, 1) 98%)', textColor: '#1a2e2e', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'nat-wood', name: 'Driftwood', category: 'Nature', background: '#78350f', textColor: '#fef3c7', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'nat-moss', name: 'Forest Moss', category: 'Nature', background: '#064e3b', textColor: '#d1fae5', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'nat-earth', name: 'Terra Cotta', category: 'Nature', background: '#9a3412', textColor: '#ffedd5', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'nat-sky', name: 'Summer Sky', category: 'Nature', background: '#0ea5e9', textColor: '#f0f9ff', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'nat-clay', name: 'Clay Red', category: 'Nature', background: '#b45309', textColor: '#fffbeb', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'nat-leaf', name: 'Sage Leaf', category: 'Nature', background: '#4d7c0f', textColor: '#f7fee7', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'nat-stone', name: 'Blue Stone', category: 'Nature', background: '#1e3a8a', textColor: '#eff6ff', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'nat-autumn', name: 'Autumn Maple', category: 'Nature', background: '#c2410c', textColor: '#fff7ed', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'nat-sand', name: 'Sahara', category: 'Nature', background: '#d97706', textColor: '#fef3c7', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'nat-night', name: 'Starlight', category: 'Nature', background: '#0f172a', textColor: '#94a3b8', buttonStyle: 'solid', fontFamily: 'Inter' },

    // =============================================
    //  GLASS (12 themes)
    // =============================================
    { id: 'glass-frosted', name: 'Frosted Glass', category: 'Glass', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', textColor: '#1e293b', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-dark', name: 'Obsidian Blur', category: 'Glass', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', textColor: '#f8fafc', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-aurora', name: 'Aurora Borealis', category: 'Glass', background: 'linear-gradient(215deg, #4facfe 0%, #00f2fe 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Outfit' },
    { id: 'glass-neon', name: 'Cyberpunk', category: 'Glass', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Space Grotesk' },
    { id: 'glass-emerald', name: 'Deep Sea Glass', category: 'Glass', background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-sunset', name: 'Malibu Sunset', category: 'Glass', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', textColor: '#3d3d3d', buttonStyle: 'glass', fontFamily: 'Quicksand' },
    { id: 'glass-lavender', name: 'Lavender Mist', category: 'Glass', background: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)', textColor: '#4b5563', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-golden', name: 'Royal Gold', category: 'Glass', background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', textColor: '#1a1a1a', buttonStyle: 'glass', fontFamily: 'Outfit' },
    { id: 'glass-midnight', name: 'Midnight Blue', category: 'Glass', background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-cherry', name: 'Cherry Blossom', category: 'Glass', background: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Quicksand' },
    { id: 'glass-ocean', name: 'Ocean Depth', category: 'Glass', background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'glass-wine', name: 'Merlot Glass', category: 'Glass', background: 'linear-gradient(135deg, #4a0e0e 0%, #8b2252 100%)', textColor: '#f5c6d0', buttonStyle: 'glass', fontFamily: 'Outfit' },

    // =============================================
    //  MINIMAL (12 themes)
    // =============================================
    { id: 'min-clean', name: 'Clean White', category: 'Minimal', background: '#ffffff', textColor: '#1a1a1a', buttonStyle: 'outline', fontFamily: 'Inter' },
    { id: 'min-dark', name: 'Pure Dark', category: 'Minimal', background: '#0a0a0a', textColor: '#ffffff', buttonStyle: 'outline', fontFamily: 'Inter' },
    { id: 'min-gray', name: 'Industrial', category: 'Minimal', background: '#334155', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'min-sand', name: 'Soft Sand', category: 'Minimal', background: '#f5f5f4', textColor: '#44403c', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'min-blue', name: 'Corporate', category: 'Minimal', background: '#eff6ff', textColor: '#1e40af', buttonStyle: 'outline', fontFamily: 'Inter' },
    { id: 'min-emerald', name: 'Mint Leaf', category: 'Minimal', background: '#ecfdf5', textColor: '#065f46', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'min-rose', name: 'Blush', category: 'Minimal', background: '#fff1f2', textColor: '#9f1239', buttonStyle: 'outline', fontFamily: 'Quicksand' },
    { id: 'min-slate', name: 'Slate Gray', category: 'Minimal', background: '#1e293b', textColor: '#f8fafc', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'min-zinc', name: 'Iron Core', category: 'Minimal', background: '#525252', textColor: '#ffffff', buttonStyle: 'outline', fontFamily: 'Outfit' },
    { id: 'min-cream', name: 'Ivory', category: 'Minimal', background: '#fafaf9', textColor: '#292524', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'min-warm', name: 'Warm Gray', category: 'Minimal', background: '#78716c', textColor: '#fafaf9', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'min-paper', name: 'Parchment', category: 'Minimal', background: '#fef9ef', textColor: '#451a03', buttonStyle: 'outline', fontFamily: 'Quicksand' },

    // =============================================
    //  VIBRANT (12 themes)
    // =============================================
    { id: 'vib-fire', name: 'Wildfire', category: 'Vibrant', background: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Space Grotesk' },
    { id: 'vib-neon', name: 'Electric Violet', category: 'Vibrant', background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'vib-candy', name: 'Cotton Candy', category: 'Vibrant', background: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', textColor: '#3d3d3d', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'vib-ocean', name: 'Deep Ocean', category: 'Vibrant', background: 'linear-gradient(to right, #00c6ff, #0072ff)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'vib-citrus', name: 'Clementine', category: 'Vibrant', background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'vib-forest', name: 'Amazonia', category: 'Vibrant', background: 'linear-gradient(to right, #11998e, #38ef7d)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'vib-purple', name: 'Royal Purple', category: 'Vibrant', background: 'linear-gradient(to right, #ed4264, #ffedbc)', textColor: '#1a1a1a', buttonStyle: 'solid', fontFamily: 'Space Grotesk' },
    { id: 'vib-black', name: 'Midnight Gold', category: 'Vibrant', background: 'linear-gradient(to top, #09203f 0%, #537895 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'vib-pink', name: 'Tokyo Pink', category: 'Vibrant', background: 'linear-gradient(to right, #ff0844 0%, #ffb199 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'vib-aqua', name: 'Blue Lagoon', category: 'Vibrant', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'vib-rainbow', name: 'Spectrum', category: 'Vibrant', background: 'linear-gradient(to right, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Space Grotesk' },
    { id: 'vib-magma', name: 'Magma Flow', category: 'Vibrant', background: 'linear-gradient(to right, #f12711, #f5af19)', textColor: '#ffffff', buttonStyle: 'solid', fontFamily: 'Outfit' },

    // =============================================
    //  BRUTAL (12 themes)
    // =============================================
    { id: 'brut-raw', name: 'Concrete', category: 'Brutal', background: '#94a3b8', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-yellow', name: 'High Vis', category: 'Brutal', background: '#fef08a', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-green', name: 'Signal Green', category: 'Brutal', background: '#86efac', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-blue', name: 'Digital Blue', category: 'Brutal', background: '#60a5fa', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-red', name: 'Stop Sign', category: 'Brutal', background: '#f87171', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-mono', name: 'B&W Brutal', category: 'Brutal', background: '#ffffff', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-dark', name: 'Onyx Brutal', category: 'Brutal', background: '#18181b', textColor: '#ffffff', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-orange', name: 'Hazard', category: 'Brutal', background: '#fb923c', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-pink', name: 'Neon Brutal', category: 'Brutal', background: '#f472b6', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-teal', name: 'Teal Block', category: 'Brutal', background: '#2dd4bf', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-lime', name: 'Acid Lime', category: 'Brutal', background: '#a3e635', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },
    { id: 'brut-violet', name: 'Ultraviolet', category: 'Brutal', background: '#a78bfa', textColor: '#000000', buttonStyle: 'brutal', fontFamily: 'Space Grotesk' },

    // =============================================
    //  DARK (14 themes) — NEW
    // =============================================
    { id: 'dark-void', name: 'Void', category: 'Dark', background: '#000000', textColor: '#ffffff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'dark-charcoal', name: 'Charcoal', category: 'Dark', background: '#1c1c1e', textColor: '#e5e5e5', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'dark-navy', name: 'Deep Navy', category: 'Dark', background: '#0a1628', textColor: '#60a5fa', buttonStyle: 'glass', fontFamily: 'Outfit' },
    { id: 'dark-wine', name: 'Dark Wine', category: 'Dark', background: '#1a0a0a', textColor: '#fca5a5', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'dark-forest', name: 'Dark Forest', category: 'Dark', background: '#0a1a0a', textColor: '#86efac', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'dark-purple', name: 'Purple Haze', category: 'Dark', background: 'linear-gradient(135deg, #1a0533 0%, #0d001a 100%)', textColor: '#c4b5fd', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'dark-ember', name: 'Ember', category: 'Dark', background: 'linear-gradient(135deg, #1a0a00 0%, #2d1600 100%)', textColor: '#fb923c', buttonStyle: 'solid', fontFamily: 'Space Grotesk' },
    { id: 'dark-matrix', name: 'Matrix', category: 'Dark', background: '#000a00', textColor: '#22c55e', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'dark-blood', name: 'Blood Moon', category: 'Dark', background: 'linear-gradient(135deg, #0f0000 0%, #1a0505 50%, #200a0a 100%)', textColor: '#ef4444', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'dark-ocean', name: 'Abyss', category: 'Dark', background: 'linear-gradient(180deg, #000510 0%, #001030 100%)', textColor: '#38bdf8', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'dark-gold', name: 'Black & Gold', category: 'Dark', background: '#0a0a0a', textColor: '#fbbf24', buttonStyle: 'outline', fontFamily: 'Outfit' },
    { id: 'dark-rose', name: 'Dark Rose', category: 'Dark', background: '#0f0a0c', textColor: '#fb7185', buttonStyle: 'glass', fontFamily: 'Quicksand' },
    { id: 'dark-ice', name: 'Black Ice', category: 'Dark', background: 'linear-gradient(135deg, #0c1220 0%, #0a0a14 100%)', textColor: '#a5f3fc', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'dark-carbon', name: 'Carbon Fiber', category: 'Dark', background: '#171717', textColor: '#a3a3a3', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },

    // =============================================
    //  PASTEL (14 themes) — NEW
    // =============================================
    { id: 'pastel-pink', name: 'Blush Pink', category: 'Pastel', background: '#fce7f3', textColor: '#831843', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-blue', name: 'Baby Blue', category: 'Pastel', background: '#dbeafe', textColor: '#1e3a5f', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'pastel-green', name: 'Mint Fresh', category: 'Pastel', background: '#dcfce7', textColor: '#14532d', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-purple', name: 'Soft Lilac', category: 'Pastel', background: '#f3e8ff', textColor: '#581c87', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'pastel-yellow', name: 'Lemon Drop', category: 'Pastel', background: '#fef9c3', textColor: '#713f12', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-peach', name: 'Soft Peach', category: 'Pastel', background: '#fff7ed', textColor: '#7c2d12', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'pastel-sky', name: 'Cloud Nine', category: 'Pastel', background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)', textColor: '#0c4a6e', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-rose', name: 'Rose Quartz', category: 'Pastel', background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', textColor: '#9f1239', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'pastel-lavender', name: 'Lavender Dream', category: 'Pastel', background: 'linear-gradient(135deg, #ede9fe 0%, #e8e0ff 100%)', textColor: '#5b21b6', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-coral', name: 'Coral Reef', category: 'Pastel', background: '#fff1f0', textColor: '#b91c1c', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'pastel-matcha', name: 'Matcha Latte', category: 'Pastel', background: '#f0fdf4', textColor: '#166534', buttonStyle: 'solid', fontFamily: 'Outfit' },
    { id: 'pastel-vanilla', name: 'Vanilla Cream', category: 'Pastel', background: '#fffbeb', textColor: '#92400e', buttonStyle: 'solid', fontFamily: 'Quicksand' },
    { id: 'pastel-dusk', name: 'Twilight Dusk', category: 'Pastel', background: 'linear-gradient(180deg, #fdf2f8 0%, #ede9fe 100%)', textColor: '#6b21a8', buttonStyle: 'solid', fontFamily: 'Inter' },
    { id: 'pastel-ocean', name: 'Sea Foam', category: 'Pastel', background: 'linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%)', textColor: '#0e7490', buttonStyle: 'solid', fontFamily: 'Outfit' },

    // =============================================
    //  NEON (14 themes) — NEW
    // =============================================
    { id: 'neon-pink', name: 'Hot Pink', category: 'Neon', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a14 100%)', textColor: '#ff1493', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-green', name: 'Toxic Green', category: 'Neon', background: '#0a0a0a', textColor: '#39ff14', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-blue', name: 'Electric Blue', category: 'Neon', background: '#020210', textColor: '#00bfff', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-orange', name: 'Neon Orange', category: 'Neon', background: '#0a0500', textColor: '#ff6600', buttonStyle: 'outline', fontFamily: 'Outfit' },
    { id: 'neon-yellow', name: 'Laser Lemon', category: 'Neon', background: '#0a0a00', textColor: '#ffff00', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-purple', name: 'Plasma', category: 'Neon', background: 'linear-gradient(135deg, #05000a 0%, #10001a 100%)', textColor: '#bf00ff', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-red', name: 'Neon Red', category: 'Neon', background: '#0a0000', textColor: '#ff0033', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-cyan', name: 'Cyber Cyan', category: 'Neon', background: '#000a0a', textColor: '#00ffff', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-miami', name: 'Miami Vice', category: 'Neon', background: 'linear-gradient(135deg, #0a0010 0%, #100020 100%)', textColor: '#ff69b4', buttonStyle: 'glass', fontFamily: 'Outfit' },
    { id: 'neon-retro', name: 'Synthwave', category: 'Neon', background: 'linear-gradient(180deg, #0a0020 0%, #1a0040 100%)', textColor: '#ff6ec7', buttonStyle: 'glass', fontFamily: 'Space Grotesk' },
    { id: 'neon-acid', name: 'Acid Trip', category: 'Neon', background: 'linear-gradient(135deg, #000a00 0%, #001a00 100%)', textColor: '#7fff00', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
    { id: 'neon-frost', name: 'Neon Frost', category: 'Neon', background: 'linear-gradient(135deg, #000510 0%, #001020 100%)', textColor: '#7df9ff', buttonStyle: 'glass', fontFamily: 'Inter' },
    { id: 'neon-sunset', name: 'Neon Sunset', category: 'Neon', background: 'linear-gradient(135deg, #0a0505 0%, #1a0a0a 100%)', textColor: '#ff4500', buttonStyle: 'outline', fontFamily: 'Outfit' },
    { id: 'neon-gold', name: 'Neon Gold', category: 'Neon', background: '#0a0800', textColor: '#ffd700', buttonStyle: 'outline', fontFamily: 'Space Grotesk' },
];
