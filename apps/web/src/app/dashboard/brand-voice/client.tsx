'use client'

import { useState, useEffect } from 'react'

interface BrandVoice {
    id: string
    name: string
    tone: string
    style: string | null
    audience: string | null
    keywords: string[]
    avoidWords: string[]
    examples: string | null
    isDefault: boolean
}

const TONE_OPTIONS = [
    { value: 'professional', label: 'Professional', icon: '👔', description: 'Business-focused, authoritative' },
    { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly, conversational' },
    { value: 'humorous', label: 'Humorous', icon: '😄', description: 'Witty, playful' },
    { value: 'inspiring', label: 'Inspiring', icon: '✨', description: 'Motivational, uplifting' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Informative, clear' },
    { value: 'bold', label: 'Bold', icon: '🔥', description: 'Direct, confident' },
]

export function BrandVoiceManager({ workspaceId }: { workspaceId: string }) {
    const [voices, setVoices] = useState<BrandVoice[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form state
    const [name, setName] = useState('')
    const [tone, setTone] = useState('professional')
    const [style, setStyle] = useState('')
    const [audience, setAudience] = useState('')
    const [keywords, setKeywords] = useState('')
    const [avoidWords, setAvoidWords] = useState('')
    const [examples, setExamples] = useState('')
    const [isDefault, setIsDefault] = useState(false)

    const fetchVoices = async () => {
        try {
            const res = await fetch('/api/brand-voices')
            const data = await res.json()
            setVoices(data.voices || [])
        } catch (error) {
            console.error('Failed to fetch voices:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVoices()
    }, [])

    const resetForm = () => {
        setName('')
        setTone('professional')
        setStyle('')
        setAudience('')
        setKeywords('')
        setAvoidWords('')
        setExamples('')
        setIsDefault(false)
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (voice: BrandVoice) => {
        setEditingId(voice.id)
        setName(voice.name)
        setTone(voice.tone)
        setStyle(voice.style || '')
        setAudience(voice.audience || '')
        setKeywords(voice.keywords.join(', '))
        setAvoidWords(voice.avoidWords.join(', '))
        setExamples(voice.examples || '')
        setIsDefault(voice.isDefault)
        setShowForm(true)
    }

    const handleSubmit = async () => {
        if (!name || !tone) return

        const payload = {
            id: editingId,
            name,
            tone,
            style: style || null,
            audience: audience || null,
            keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [],
            avoidWords: avoidWords ? avoidWords.split(',').map(k => k.trim()).filter(k => k) : [],
            examples: examples || null,
            isDefault,
        }

        try {
            await fetch('/api/brand-voices', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            resetForm()
            fetchVoices()
        } catch (error) {
            console.error('Failed to save voice:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this brand voice?')) return

        try {
            await fetch(`/api/brand-voices?id=${id}`, { method: 'DELETE' })
            fetchVoices()
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span>🎨</span> Brand Voice Profiles
                    </h1>
                    <p className="text-muted mt-1">
                        Create custom voices to maintain consistent brand identity
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary px-5 py-2.5"
                    >
                        + New Voice
                    </button>
                )}
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">
                            {editingId ? 'Edit Voice' : 'Create New Voice'}
                        </h2>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Voice Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., CEO Thought Leader, Friendly Expert"
                                className="input-modern"
                            />
                        </div>

                        {/* Tone Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Tone *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {TONE_OPTIONS.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTone(t.value)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${tone === t.value
                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{t.icon}</span>
                                            <span className={`text-sm font-medium ${tone === t.value ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                {t.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted">{t.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style & Audience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Writing Style
                                </label>
                                <textarea
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    placeholder="e.g., Use short sentences, include data points, avoid jargon..."
                                    rows={3}
                                    className="input-modern resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Target Audience
                                </label>
                                <textarea
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                    placeholder="e.g., B2B executives, startup founders, young professionals..."
                                    rows={3}
                                    className="input-modern resize-none"
                                />
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Keywords to Include
                                </label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="innovation, growth, results (comma-separated)"
                                    className="input-modern"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Words to Avoid
                                </label>
                                <input
                                    type="text"
                                    value={avoidWords}
                                    onChange={(e) => setAvoidWords(e.target.value)}
                                    placeholder="synergy, leverage, pivot (comma-separated)"
                                    className="input-modern"
                                />
                            </div>
                        </div>

                        {/* Examples */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Example Content
                            </label>
                            <textarea
                                value={examples}
                                onChange={(e) => setExamples(e.target.value)}
                                placeholder="Paste examples of content that represents this voice..."
                                rows={4}
                                className="input-modern resize-none"
                            />
                        </div>

                        {/* Default Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-5 h-5 rounded accent-primary"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Set as default voice
                            </span>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button onClick={handleSubmit} className="btn-primary px-6 py-2.5">
                                {editingId ? 'Save Changes' : 'Create Voice'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-6 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Voice Cards */}
            {loading ? (
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted mt-3">Loading voices...</p>
                </div>
            ) : voices.length === 0 && !showForm ? (
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
                    <div className="text-5xl mb-4">🎨</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No brand voices yet
                    </h3>
                    <p className="text-muted mb-6">
                        Create your first voice profile to get started
                    </p>
                    <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2.5">
                        Create First Voice
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {voices.map((voice) => (
                        <div
                            key={voice.id}
                            className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{TONE_OPTIONS.find(t => t.value === voice.tone)?.icon || '🎨'}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {voice.name}
                                            </h3>
                                            <p className="text-xs text-muted capitalize">{voice.tone}</p>
                                        </div>
                                    </div>
                                    {voice.isDefault && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            Default
                                        </span>
                                    )}
                                </div>

                                {voice.audience && (
                                    <p className="text-sm text-muted mb-3 line-clamp-1">
                                        <span className="font-medium">Audience:</span> {voice.audience}
                                    </p>
                                )}

                                {voice.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {voice.keywords.slice(0, 4).map((kw, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                                                {kw}
                                            </span>
                                        ))}
                                        {voice.keywords.length > 4 && (
                                            <span className="text-xs text-muted">+{voice.keywords.length - 4}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <button
                                        onClick={() => handleEdit(voice)}
                                        className="text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => handleDelete(voice.id)}
                                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
