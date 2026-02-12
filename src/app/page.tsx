import Link from 'next/link'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'

export default function Home() {
  return (
    <div className="relative bg-[#030303] min-h-screen overflow-hidden">
      <HeroGeometric
        badge="Silovra"
        title1="Empower Your Brand"
        title2="Beyond The Link"
      >
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
              Claim Your Link
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-semibold transition-all hover:bg-white/10 hover:border-white/20"
            >
              Sign In
            </Link>
          </div>

          <p className="text-white/40 text-sm font-light tracking-wide">
            100% Free • Custom Themes • Instant Analytics
          </p>
        </div>
      </HeroGeometric>
    </div>
  )
}
