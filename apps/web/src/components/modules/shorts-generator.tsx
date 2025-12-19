'use client'

import { useState, useEffect } from 'react'

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
    { value: 'reels', label: 'Reels', icon: '📷' },
    { value: 'youtube_shorts', label: 'Shorts', icon: '▶️' },
];

const TONES: { value: Tone; label: string; icon: string }[] = [
    { value: 'educational', label: 'Educational', icon: '📚' },
    { value: 'entertaining', label: 'Entertaining', icon: '🎉' },
    { value: 'motivational', label: 'Motivational', icon: '💪' },
    { value: 'storytelling', label: 'Storytelling', icon: '📖' },
];

export function ShortsGenerator({ workspaceId }: ShortsGeneratorProps) {
    const [topic, setTopic] = useState('')
    const [niche, setNiche] = useState('')
    const [platform, setPlatform] = useState<Platform>('tiktok')
    const [tone, setTone] = useState<Tone>('educational')
    const [loading, setLoading] = useState(false)
    const [script, setScript] = useState<GeneratedScript | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings/modules?key=module.shorts_generator')
                const data = await res.json()
                if (data.settings) {
                    if (data.settings.defaultPlatform && ['tiktok', 'reels', 'youtube_shorts'].includes(data.settings.defaultPlatform)) {
                        setPlatform(data.settings.defaultPlatform as Platform)
                    }
                    if (data.settings.defaultTone && ['educational', 'entertaining', 'motivational', 'storytelling'].includes(data.settings.defaultTone)) {
                        setTone(data.settings.defaultTone as Tone)
                    }
                }
            } catch (err) {
                console.error('Failed to load settings')
            }
        }
        loadSettings()
    }, [])

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
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    Viral Shorts Script Generator
                </h3>
                <p className="text-pink-100 text-sm mt-1">
                    Create 60-second scripts using Hook → Story → Tips → CTA
                </p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div className="space-y-5">
                        {/* Topic Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Topic / Theme *
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 3 morning habits that changed my life"
                                className="input-modern"
                            />
                        </div>

                        {/* Niche Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Niche (optional)
                            </label>
                            <input
                                type="text"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                placeholder="e.g., Productivity, Fitness, Business"
                                className="input-modern"
                            />
                        </div>

                        {/* Platform Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Platform
                            </label>
                            <div className="flex gap-3">
                                {PLATFORMS.map(p => (
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

                        {/* Tone Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Tone
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {TONES.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTone(t.value)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${tone === t.value
                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <span className="text-lg mr-2">{t.icon}</span>
                                        <span className={`text-sm font-medium ${tone === t.value ? 'text-primary' : 'text-gray-600 dark:text-zinc-400'}`}>
                                            {t.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic.trim()}
                            className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating Script...
                                </span>
                            ) : (
                                '🚀 Generate Viral Script'
                            )}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Script Output */}
                    <div className="space-y-4">
                        {script ? (
                            <>
                                {/* Hook */}
                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-400">
                                            🎣 HOOK (0-5s)
                                        </span>
                                        <button onClick={() => copyToClipboard(script.hook)} className="text-xs font-medium text-amber-600 hover:underline">📋 Copy</button>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-zinc-200 leading-relaxed">{script.hook}</p>
                                </div>

                                {/* Story */}
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-400">
                                            📖 STORY (5-20s)
                                        </span>
                                        <button onClick={() => copyToClipboard(script.story)} className="text-xs font-medium text-blue-600 hover:underline">📋 Copy</button>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-zinc-200 leading-relaxed">{script.story}</p>
                                </div>

                                {/* Tips */}
                                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-400">
                                            💡 3 TIPS (20-50s)
                                        </span>
                                        <button onClick={() => copyToClipboard(script.tips.join('\n'))} className="text-xs font-medium text-green-600 hover:underline">📋 Copy</button>
                                    </div>
                                    <ol className="text-sm text-gray-800 dark:text-zinc-200 space-y-2 list-decimal list-inside leading-relaxed">
                                        {script.tips.map((tip, i) => (
                                            <li key={i}>{tip}</li>
                                        ))}
                                    </ol>
                                </div>

                                {/* CTA */}
                                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-400">
                                            📣 CTA (50-60s)
                                        </span>
                                        <button onClick={() => copyToClipboard(script.cta)} className="text-xs font-medium text-purple-600 hover:underline">📋 Copy</button>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-zinc-200 leading-relaxed">{script.cta}</p>
                                </div>

                                {/* Hashtags */}
                                <div className="flex flex-wrap gap-2">
                                    {script.hashtags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-zinc-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Copy Full Script */}
                                <button
                                    onClick={() => copyToClipboard(script.fullScript)}
                                    className="w-full border-2 border-primary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                                >
                                    📋 Copy Full Script
                                </button>
                            </>
                        ) : (
                            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50/50 dark:bg-zinc-800/30">
                                <div className="text-center p-8">
                                    <div className="text-5xl mb-3 opacity-50">🎬</div>
                                    <p className="text-sm font-medium text-muted">Your script will appear here</p>
                                    <p className="text-xs text-muted-foreground mt-1">Hook → Story → Tips → CTA</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
