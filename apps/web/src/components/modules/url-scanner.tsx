'use client'

import { useState, useEffect } from 'react'

type PostCount = 3 | 5 | 10 | 15;

interface UrlScannerProps {
    workspaceId: string;
}

export function UrlScanner({ workspaceId }: UrlScannerProps) {
    const [url, setUrl] = useState('')
    const [platform, setPlatform] = useState('linkedin')
    const [postCount, setPostCount] = useState<PostCount>(5)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

    // Load saved settings on mount
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings/modules?key=module.url_scanner')
                const data = await res.json()
                if (data.settings) {
                    if (data.settings.defaultPostCount) {
                        const count = parseInt(data.settings.defaultPostCount)
                        if ([3, 5, 10, 15].includes(count)) {
                            setPostCount(count as PostCount)
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load settings')
            }
        }
        loadSettings()
    }, [])

    const handleScan = async () => {
        if (!url) return;

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/modules/url-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, platform, postCount, workspaceId })
            })

            const data = await response.json()

            if (response.ok) {
                setResult({ success: true, message: data.message })
                setUrl('')
            } else {
                setResult({ success: false, error: data.error })
            }
        } catch (error) {
            setResult({ success: false, error: 'Failed to scan URL. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const platforms = [
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
        { value: 'instagram', label: 'Instagram', icon: '📷' }
    ]

    const postCounts: PostCount[] = [3, 5, 10, 15]

    return (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">🔗</span>
                    URL Content Scanner
                </h3>
                <p className="text-green-100 text-sm mt-1">
                    Transform any article into viral social posts
                </p>
            </div>

            <div className="p-6 space-y-5">
                {/* URL Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Article URL *
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">🔗</span>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/blog-post"
                            className="input-modern pl-10"
                        />
                    </div>
                </div>

                {/* Platform Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Platform
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {platforms.map(p => (
                            <button
                                key={p.value}
                                onClick={() => setPlatform(p.value)}
                                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${platform === p.value
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                    }`}
                            >
                                <div className="text-xl mb-1">{p.icon}</div>
                                <div className={`text-xs font-medium ${platform === p.value ? 'text-primary' : 'text-gray-600 dark:text-zinc-400'}`}>
                                    {p.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post Count */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Number of Posts
                    </label>
                    <div className="flex gap-3">
                        {postCounts.map(count => (
                            <button
                                key={count}
                                onClick={() => setPostCount(count)}
                                className={`flex-1 py-3 rounded-xl border-2 text-center font-medium transition-all duration-200 ${postCount === count
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                                        : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-gray-300'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={loading || !url}
                    className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Scanning & Generating...
                        </span>
                    ) : (
                        '🚀 Scan & Generate Posts'
                    )}
                </button>

                {/* Result Message */}
                {result && (
                    <div className={`p-4 rounded-xl border ${result.success
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                        }`}>
                        <div className="flex items-center gap-2">
                            <span>{result.success ? '✅' : '❌'}</span>
                            {result.success ? result.message : result.error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
