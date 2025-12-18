'use client'

import { useState } from 'react'

interface TextGeneratorProps {
    workspaceId: string;
}

export function TextGenerator({ workspaceId }: TextGeneratorProps) {
    const [prompt, setPrompt] = useState('')
    const [platform, setPlatform] = useState('linkedin')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string[] | null>(null)
    const [error, setError] = useState<string | null>(null)

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
        <div className="border rounded-lg p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                ✍️ Viral Text Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                Generate optimized posts for LinkedIn, Twitter/X, and Facebook.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Topic / Prompt *
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 3 lessons I learned about productivity..."
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Platform
                        </label>
                        <div className="flex gap-2">
                            {platforms.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => setPlatform(p.value)}
                                    className={`flex-1 p-3 rounded-md border text-center transition-colors ${platform === p.value
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-xl">{p.icon}</div>
                                    <div className="text-xs text-gray-700 dark:text-zinc-300 mt-1">{p.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
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
                            '✨ Generate Viral Posts'
                        )}
                    </button>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right: Results */}
                <div className="space-y-4">
                    {result ? (
                        result.map((post, i) => (
                            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Post {i + 1}</span>
                                    <button
                                        onClick={() => copyToClipboard(post)}
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-zinc-200 whitespace-pre-wrap">{post}</p>
                            </div>
                        ))
                    ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
                            <div className="text-center p-8 text-gray-500 dark:text-zinc-500">
                                <div className="text-4xl mb-2">✍️</div>
                                <p className="text-sm">Your posts will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
