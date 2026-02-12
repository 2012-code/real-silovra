'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const isExtensionError = error.message.includes('ethereum') || error.message.includes('redefine property')

    return (
        <html>
            <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen font-sans p-6 text-center">
                <div className="max-w-md w-full space-y-8 bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
                    <h2 className="text-2xl font-black tracking-tight text-white mb-4">System Interruption</h2>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-left">
                        <p className="font-mono text-[11px] text-red-400 break-words leading-relaxed">
                            ERROR_CODE: {error.message}
                        </p>
                    </div>

                    {isExtensionError && (
                        <div className="space-y-2 text-left">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                Possible Cause Detected
                            </h3>
                            <p className="text-xs text-white/50 leading-relaxed font-medium">
                                This error is usually caused by a crypto wallet extension (MetaMask, Phantom, etc.) conflicting with the application.
                            </p>
                            <p className="text-xs text-white/70 font-bold">
                                Try opening this page in Incognito Mode or disabling your wallet extension for this site.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => reset()}
                        className="w-full py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-zenith-indigo hover:text-white transition-all active:scale-95"
                    >
                        Reboot System
                    </button>
                </div>
            </body>
        </html>
    )
}
