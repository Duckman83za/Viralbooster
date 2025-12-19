'use client'

import { useState } from 'react'

type ImageStyle = 'minimal' | 'bold' | 'gradient' | 'quote';

interface AuthorityImageGeneratorProps {
    workspaceId: string;
}

const STYLE_OPTIONS: { value: ImageStyle; label: string; icon: string; description: string }[] = [
    { value: 'minimal', label: 'Minimal', icon: '◻️', description: 'Clean & simple' },
    { value: 'bold', label: 'Bold', icon: '🔳', description: 'Strong presence' },
    { value: 'gradient', label: 'Gradient', icon: '🌈', description: 'Color transitions' },
    { value: 'quote', label: 'Quote', icon: '💬', description: 'Quote marks' },
];

const COLOR_PRESETS = [
    { bg: '#1a1a2e', text: '#ffffff', accent: '#f59e0b', name: 'Dark Gold' },
    { bg: '#0f172a', text: '#f8fafc', accent: '#3b82f6', name: 'Navy Blue' },
    { bg: '#18181b', text: '#fafafa', accent: '#22c55e', name: 'Dark Green' },
    { bg: '#fefce8', text: '#1c1917', accent: '#dc2626', name: 'Light Red' },
    { bg: '#f8fafc', text: '#0f172a', accent: '#8b5cf6', name: 'Light Purple' },
];

export function AuthorityImageGenerator({ workspaceId }: AuthorityImageGeneratorProps) {
    const [text, setText] = useState('')
    const [author, setAuthor] = useState('')
    const [style, setStyle] = useState<ImageStyle>('minimal')
    const [colorPreset, setColorPreset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const currentColors = COLOR_PRESETS[colorPreset];

    const handleGenerate = async () => {
        if (!text.trim()) return;

        setLoading(true)
        setError(null)
        setGeneratedImage(null)

        try {
            const response = await fetch('/api/modules/authority-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text.trim(),
                    author: author.trim(),
                    backgroundColor: currentColors.bg,
                    textColor: currentColors.text,
                    accentColor: currentColors.accent,
                    style,
                    workspaceId
                })
            })

            const data = await response.json()

            if (response.ok && data.dataUrl) {
                setGeneratedImage(data.dataUrl)
            } else {
                setError(data.error || 'Failed to generate image')
            }
        } catch (err) {
            setError('Failed to generate image. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!generatedImage) return;

        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `authority-image-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    Authority Image Generator
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                    Create branded 1080×1350 quote images for Instagram & Pinterest
                </p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div className="space-y-5">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Quote / Content *
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter your quote, tip, or insight..."
                                rows={4}
                                className="input-modern resize-none"
                            />
                            <p className="text-xs text-muted mt-2">
                                {text.length} characters
                            </p>
                        </div>

                        {/* Author Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Author (optional)
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Your name or brand"
                                className="input-modern"
                            />
                        </div>

                        {/* Style Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Style
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {STYLE_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setStyle(option.value)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${style === option.value
                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{option.icon}</span>
                                            <span className={`text-sm font-medium ${style === option.value ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                {option.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted mt-1 ml-7">
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Presets */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Color Theme
                            </label>
                            <div className="flex gap-3">
                                {COLOR_PRESETS.map((preset, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setColorPreset(i)}
                                        className={`w-12 h-12 rounded-xl transition-all duration-200 ${colorPreset === i
                                                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-900 scale-110'
                                                : 'hover:scale-105'
                                            }`}
                                        style={{
                                            backgroundColor: preset.bg,
                                            border: `3px solid ${preset.accent}`
                                        }}
                                        title={preset.name}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted mt-2">
                                Selected: {currentColors.name}
                            </p>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !text.trim()}
                            className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                '✨ Generate Authority Image'
                            )}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Preview */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            Preview
                        </label>
                        <div
                            className="min-h-[400px] rounded-xl border-2 border-gray-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: currentColors.bg }}
                        >
                            {generatedImage ? (
                                <img
                                    src={generatedImage}
                                    alt="Generated authority image"
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="text-center p-8" style={{ color: currentColors.text }}>
                                    <div className="text-5xl mb-3 opacity-50">🖼️</div>
                                    <p className="text-sm font-medium opacity-60">
                                        Your image will appear here
                                    </p>
                                    <p className="text-xs opacity-40 mt-1">
                                        1080 × 1350 pixels
                                    </p>
                                </div>
                            )}
                        </div>

                        {generatedImage && (
                            <button
                                onClick={handleDownload}
                                className="w-full border-2 border-primary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                            >
                                ⬇️ Download SVG
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
