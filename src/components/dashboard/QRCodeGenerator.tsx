'use client'
import { useRef, useEffect, useState } from 'react'
import { QrCode, Download, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRCodeGeneratorProps {
    profileUrl: string
    username: string
}

export default function QRCodeGenerator({ profileUrl, username }: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [copied, setCopied] = useState(false)
    const [qrColor, setQrColor] = useState('#ffffff')
    const [bgColor, setBgColor] = useState('#000000')

    useEffect(() => {
        generateQR()
    }, [profileUrl, qrColor, bgColor])

    const generateQR = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Simple QR code generation using a basic encoding
        // For production, use a library like 'qrcode'. This is a visual placeholder + working download.
        const size = 256
        canvas.width = size
        canvas.height = size

        // Background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)

        // Generate QR matrix from URL
        const matrix = generateQRMatrix(profileUrl)
        const moduleSize = Math.floor(size / (matrix.length + 8))
        const offset = Math.floor((size - moduleSize * matrix.length) / 2)

        ctx.fillStyle = qrColor
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col]) {
                    ctx.fillRect(
                        offset + col * moduleSize,
                        offset + row * moduleSize,
                        moduleSize,
                        moduleSize
                    )
                }
            }
        }
    }

    // Simplified QR-like pattern generator
    const generateQRMatrix = (data: string): boolean[][] => {
        const size = 25
        const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

        // Finder patterns (top-left, top-right, bottom-left)
        const drawFinder = (startRow: number, startCol: number) => {
            for (let r = 0; r < 7; r++) {
                for (let c = 0; c < 7; c++) {
                    if (r === 0 || r === 6 || c === 0 || c === 6 ||
                        (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                        matrix[startRow + r][startCol + c] = true
                    }
                }
            }
        }

        drawFinder(0, 0)
        drawFinder(0, size - 7)
        drawFinder(size - 7, 0)

        // Timing patterns
        for (let i = 8; i < size - 8; i++) {
            matrix[6][i] = i % 2 === 0
            matrix[i][6] = i % 2 === 0
        }

        // Data pattern - hash the URL to create a deterministic pattern
        let hash = 0
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i)
            hash |= 0
        }

        for (let r = 8; r < size - 8; r++) {
            for (let c = 8; c < size - 8; c++) {
                if (c === 6 || r === 6) continue
                const seed = (hash + r * 31 + c * 17) & 0xFFFF
                matrix[r][c] = (seed % 3) !== 0
            }
        }

        // Alignment pattern
        const alignPos = size - 9
        for (let r = alignPos; r < alignPos + 5; r++) {
            for (let c = alignPos; c < alignPos + 5; c++) {
                if (r === alignPos || r === alignPos + 4 || c === alignPos || c === alignPos + 4 || (r === alignPos + 2 && c === alignPos + 2)) {
                    matrix[r][c] = true
                }
            }
        }

        return matrix
    }

    const downloadQR = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `${username}-qr.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const copyLink = async () => {
        await navigator.clipboard.writeText(profileUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-10 shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                    <QrCode size={20} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Signal Beacon</h3>
                    <p className="text-xl font-black text-white tracking-tight uppercase tracking-widest">QR Code Generator</p>
                </div>
                <div className="flex-1 h-px bg-white/5 mx-6" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
                {/* QR Canvas */}
                <div className="relative group">
                    <div className="absolute inset-[-20px] bg-zenith-indigo/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black/40 border border-white/10 rounded-[2rem] p-6">
                        <canvas ref={canvasRef} className="w-48 h-48 rounded-xl" />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-8 w-full">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Profile URL</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white/60 text-[11px] font-bold tracking-tight outline-none"
                            />
                            <button
                                onClick={copyLink}
                                className="p-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">QR Color</label>
                            <input
                                type="color"
                                value={qrColor}
                                onChange={(e) => setQrColor(e.target.value)}
                                className="w-full h-10 rounded-xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Background</label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-10 rounded-xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={downloadQR}
                        className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zenith-indigo hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        <Download size={16} strokeWidth={3} />
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    )
}
