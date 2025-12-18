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
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'twitter', label: 'Twitter/X' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' }
    ]

    const postCounts: PostCount[] = [3, 5, 10, 15]

    return (
        <div className="border rounded-lg p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                🔗 URL Content Scanner
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                Paste any article or blog URL to generate viral social posts from its content.
            </p>

            <div className="space-y-4">
                {/* URL Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Article URL
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Platform Select */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Platform
                        </label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {platforms.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Post Count Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Number of Posts
                        </label>
                        <select
                            value={postCount}
                            onChange={(e) => setPostCount(parseInt(e.target.value) as PostCount)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {postCounts.map(count => (
                                <option key={count} value={count}>{count} posts</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={loading || !url}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scanning...
                        </span>
                    ) : (
                        '🚀 Scan & Generate Posts'
                    )}
                </button>

                {/* Result Message */}
                {result && (
                    <div className={`p-3 rounded-md ${result.success
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {result.success ? result.message : result.error}
                    </div>
                )}
            </div>
        </div>
    )
}
