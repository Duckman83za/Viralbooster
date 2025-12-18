'use client'

import { useState } from 'react'

type ImageStyle = 'minimal' | 'bold' | 'gradient' | 'quote';

interface AuthorityImageGeneratorProps {
    workspaceId: string;
}

const STYLE_OPTIONS: { value: ImageStyle; label: string; description: string }[] = [
    { value: 'minimal', label: 'Minimal', description: 'Clean lines, simple elegance' },
    { value: 'bold', label: 'Bold', description: 'Double border, strong presence' },
    { value: 'gradient', label: 'Gradient', description: 'Subtle color transitions' },
    { value: 'quote', label: 'Quote', description: 'Large quotation marks' },
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
        <div className="border rounded-lg p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                🖼️ Authority Image Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                Create branded 1080x1350 quote images for Instagram, Pinterest & Facebook.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-4">
                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Quote / Content *
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your quote, tip, or insight..."
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                            {text.length} characters
                        </p>
                    </div>

                    {/* Author Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Author (optional)
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Your name or brand"
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Style Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STYLE_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setStyle(option.value)}
                                    className={`p-3 rounded-md border text-left transition-colors ${style === option.value
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {option.label}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                                        {option.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Presets */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Color Theme
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_PRESETS.map((preset, i) => (
                                <button
                                    key={i}
                                    onClick={() => setColorPreset(i)}
                                    className={`w-10 h-10 rounded-full border-2 transition-transform ${colorPreset === i
                                            ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                                            : ''
                                        }`}
                                    style={{
                                        backgroundColor: preset.bg,
                                        borderColor: preset.accent
                                    }}
                                    title={preset.name}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                            {currentColors.name}
                        </p>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !text.trim()}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            '✨ Generate Authority Image'
                        )}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right: Preview */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Preview
                    </label>
                    <div
                        className="flex-1 min-h-[400px] rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center"
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
                                <div className="text-4xl mb-2">🖼️</div>
                                <p className="text-sm opacity-60">
                                    Your image will appear here
                                </p>
                            </div>
                        )}
                    </div>

                    {generatedImage && (
                        <button
                            onClick={handleDownload}
                            className="mt-3 w-full border border-indigo-500 text-indigo-600 dark:text-indigo-400 py-2 px-4 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                            ⬇️ Download SVG
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
