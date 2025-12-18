'use client'

import { useState } from 'react'

type Platform = 'tiktok' | 'reels' | 'youtube_shorts';
type Tone = 'educational' | 'entertaining' | 'motivational' | 'storytelling';

interface ShortsGeneratorProps {
    workspaceId: string;
}

interface GeneratedScript {
    hook: string;
    story: string;
    tips: [string, string, string];
    cta: string;
    fullScript: string;
    estimatedDuration: number;
    hashtags: string[];
}

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
    { value: 'tiktok', label: 'TikTok', icon: '📱' },
    { value: 'reels', label: 'Instagram Reels', icon: '📷' },
    { value: 'youtube_shorts', label: 'YouTube Shorts', icon: '▶️' },
];

const TONES: { value: Tone; label: string }[] = [
    { value: 'educational', label: '📚 Educational' },
    { value: 'entertaining', label: '🎉 Entertaining' },
    { value: 'motivational', label: '💪 Motivational' },
    { value: 'storytelling', label: '📖 Storytelling' },
];

export function ShortsGenerator({ workspaceId }: ShortsGeneratorProps) {
    const [topic, setTopic] = useState('')
    const [niche, setNiche] = useState('')
    const [platform, setPlatform] = useState<Platform>('tiktok')
    const [tone, setTone] = useState<Tone>('educational')
    const [loading, setLoading] = useState(false)
    const [script, setScript] = useState<GeneratedScript | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setLoading(true)
        setError(null)
        setScript(null)

        try {
            const response = await fetch('/api/modules/shorts-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topic.trim(),
                    niche: niche.trim(),
                    platform,
                    tone,
                    workspaceId
                })
            })

            const data = await response.json()

            if (response.ok && data.script) {
                setScript(data.script)
            } else {
                setError(data.error || 'Failed to generate script')
            }
        } catch (err) {
            setError('Failed to generate script. Please try again.')
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
                🎬 Viral Shorts Script Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                Create 60-second video scripts using the proven Hook → Story → Tips → CTA framework.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-4">
                    {/* Topic Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Topic / Theme *
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., 3 morning habits that changed my life"
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Niche Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                            Niche (optional)
                        </label>
                        <input
                            type="text"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            placeholder="e.g., Productivity, Fitness, Business"
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Platform Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Platform
                        </label>
                        <div className="flex gap-2">
                            {PLATFORMS.map(p => (
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

                    {/* Tone Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Tone
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {TONES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value)}
                                    className={`p-2 rounded-md border text-sm transition-colors ${tone === t.value
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Script...
                            </span>
                        ) : (
                            '🚀 Generate Viral Script'
                        )}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right: Script Output */}
                <div className="space-y-4">
                    {script ? (
                        <>
                            {/* Hook */}
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">🎣 HOOK (0-5s)</span>
                                    <button onClick={() => copyToClipboard(script.hook)} className="text-xs text-amber-600 hover:underline">Copy</button>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-zinc-200">{script.hook}</p>
                            </div>

                            {/* Story */}
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">📖 STORY (5-20s)</span>
                                    <button onClick={() => copyToClipboard(script.story)} className="text-xs text-blue-600 hover:underline">Copy</button>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-zinc-200">{script.story}</p>
                            </div>

                            {/* Tips */}
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">💡 3 TIPS (20-50s)</span>
                                    <button onClick={() => copyToClipboard(script.tips.join('\n'))} className="text-xs text-green-600 hover:underline">Copy</button>
                                </div>
                                <ol className="text-sm text-gray-800 dark:text-zinc-200 space-y-2 list-decimal list-inside">
                                    {script.tips.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ol>
                            </div>

                            {/* CTA */}
                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">📣 CTA (50-60s)</span>
                                    <button onClick={() => copyToClipboard(script.cta)} className="text-xs text-purple-600 hover:underline">Copy</button>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-zinc-200">{script.cta}</p>
                            </div>

                            {/* Hashtags */}
                            <div className="flex flex-wrap gap-2">
                                {script.hashtags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-zinc-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Copy Full Script */}
                            <button
                                onClick={() => copyToClipboard(script.fullScript)}
                                className="w-full border border-indigo-500 text-indigo-600 dark:text-indigo-400 py-2 px-4 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                                📋 Copy Full Script
                            </button>
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
                            <div className="text-center p-8 text-gray-500 dark:text-zinc-500">
                                <div className="text-4xl mb-2">🎬</div>
                                <p className="text-sm">Your script will appear here</p>
                                <p className="text-xs mt-2">Hook → Story → Tips → CTA</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
