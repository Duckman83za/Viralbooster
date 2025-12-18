'use client'

import { useState, useEffect } from 'react'

interface TextGeneratorProps {
    workspaceId: string;
}

export function TextGenerator({ workspaceId }: TextGeneratorProps) {
    const [prompt, setPrompt] = useState('')
    const [platform, setPlatform] = useState('linkedin')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [settingsLoaded, setSettingsLoaded] = useState(false)

    // Load saved settings on mount
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings/modules?key=module.text_viral')
                const data = await res.json()
                if (data.settings) {
                    if (data.settings.defaultPlatform) {
                        setPlatform(data.settings.defaultPlatform)
                    }
                }
            } catch (err) {
                console.error('Failed to load settings')
            } finally {
                setSettingsLoaded(true)
            }
        }
        loadSettings()
    }, [])

    const platforms = [
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
    ]

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/modules/text-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, platform, workspaceId })
            })

            const data = await response.json()

            if (response.ok && data.posts) {
                setResult(data.posts)
            } else if (data.needsApiKey) {
                setError('⚠️ Please add your API key in Settings → Text Generator before generating.')
            } else {
                setError(data.error || 'Failed to generate')
            }
        } catch (err) {
            setError('Failed to connect. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">✍️</span>
                    Viral Text Generator
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                    Generate optimized posts for LinkedIn, Twitter/X, and Facebook.
                </p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Topic / Prompt *
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., 3 lessons I learned about productivity..."
                                rows={4}
                                className="input-modern resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Platform
                            </label>
                            <div className="flex gap-3">
                                {platforms.map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => setPlatform(p.value)}
                                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all duration-200 ${platform === p.value
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{p.icon}</div>
                                        <div className={`text-xs font-medium ${platform === p.value ? 'text-primary' : 'text-gray-600 dark:text-zinc-400'}`}>
                                            {p.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
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
                                '✨ Generate Viral Posts'
                            )}
                        </button>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Results */}
                    <div className="space-y-4">
                        {result ? (
                            result.map((post, i) => (
                                <div key={i} className="p-5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                            Post {i + 1}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(post)}
                                            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                                        >
                                            📋 Copy
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">{post}</p>
                                </div>
                            ))
                        ) : (
                            <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50/50 dark:bg-zinc-800/30">
                                <div className="text-center p-8">
                                    <div className="text-5xl mb-3 opacity-50">✍️</div>
                                    <p className="text-sm font-medium text-muted">Your posts will appear here</p>
                                    <p className="text-xs text-muted-foreground mt-1">Enter a topic and click generate</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
