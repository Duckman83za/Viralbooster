'use client'

import { useState, useEffect } from 'react'

interface ModuleSettingsPanelProps {
    moduleKey: string;
}

// AI Providers and their models per use case
const AI_PROVIDERS = {
    text: [
        {
            provider: 'gemini',
            label: 'Google Gemini',
            icon: '🔮',
            models: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
            helpUrl: 'https://aistudio.google.com/app/apikey',
            helpText: 'Get your API key from Google AI Studio'
        },
        {
            provider: 'openai',
            label: 'OpenAI',
            icon: '🤖',
            models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
            helpUrl: 'https://platform.openai.com/api-keys',
            helpText: 'Get your API key from OpenAI Platform'
        },
        {
            provider: 'anthropic',
            label: 'Anthropic Claude',
            icon: '🧠',
            models: ['claude-3-5-sonnet-20241022', 'claude-3-opus', 'claude-3-haiku'],
            helpUrl: 'https://console.anthropic.com/settings/keys',
            helpText: 'Get your API key from Anthropic Console'
        },
    ],
    image: [
        {
            provider: 'gemini',
            label: 'Google Imagen',
            icon: '🔮',
            models: ['imagen-3.0-generate-001'],
            helpUrl: 'https://aistudio.google.com/app/apikey',
            helpText: 'Uses Google AI Studio API key'
        },
        {
            provider: 'openai',
            label: 'DALL-E',
            icon: '🎨',
            models: ['dall-e-3', 'dall-e-2'],
            helpUrl: 'https://platform.openai.com/api-keys',
            helpText: 'Uses OpenAI Platform API key'
        },
        {
            provider: 'stability',
            label: 'Stability AI',
            icon: '🌟',
            models: ['stable-diffusion-xl', 'stable-diffusion-3'],
            helpUrl: 'https://platform.stability.ai/account/keys',
            helpText: 'Get your API key from Stability AI'
        },
    ]
};

// Module configurations
const MODULE_CONFIG: Record<string, ModuleConfigDef> = {
    'module.text_viral': {
        type: 'text',
        name: 'Text Generator',
        settings: [
            {
                key: 'defaultPlatform', label: 'Default Platform', type: 'select', options: [
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'twitter', label: 'Twitter/X' },
                    { value: 'facebook', label: 'Facebook' },
                ]
            },
            {
                key: 'defaultTone', label: 'Default Tone', type: 'select', options: [
                    { value: 'professional', label: 'Professional' },
                    { value: 'casual', label: 'Casual' },
                    { value: 'witty', label: 'Witty' },
                ]
            },
            { key: 'autoSaveDrafts', label: 'Auto-save drafts', type: 'toggle' },
        ]
    },
    'module.url_scanner': {
        type: 'text',
        name: 'URL Scanner',
        settings: [
            {
                key: 'defaultPostCount', label: 'Default Post Count', type: 'select', options: [
                    { value: '3', label: '3 posts' },
                    { value: '5', label: '5 posts' },
                    { value: '10', label: '10 posts' },
                    { value: '15', label: '15 posts' },
                ]
            },
            { key: 'includeHashtags', label: 'Include hashtags', type: 'toggle' },
        ]
    },
    'module.authority_image': {
        type: 'none', // SVG-based, no AI needed
        name: 'Authority Image',
        noAiMessage: '✨ This module uses SVG templates — no AI API key required!',
        settings: [
            {
                key: 'defaultStyle', label: 'Default Style', type: 'select', options: [
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'bold', label: 'Bold' },
                    { value: 'gradient', label: 'Gradient' },
                    { value: 'quote', label: 'Quote' },
                ]
            },
            { key: 'defaultBackgroundColor', label: 'Default Background', type: 'color' },
            { key: 'defaultTextColor', label: 'Default Text Color', type: 'color' },
            { key: 'defaultAccentColor', label: 'Default Accent Color', type: 'color' },
        ]
    },
    'module.shorts_generator': {
        type: 'text',
        name: 'Shorts Generator',
        settings: [
            {
                key: 'defaultPlatform', label: 'Default Platform', type: 'select', options: [
                    { value: 'tiktok', label: 'TikTok' },
                    { value: 'reels', label: 'Instagram Reels' },
                    { value: 'youtube_shorts', label: 'YouTube Shorts' },
                ]
            },
            {
                key: 'defaultTone', label: 'Default Tone', type: 'select', options: [
                    { value: 'educational', label: 'Educational' },
                    { value: 'entertaining', label: 'Entertaining' },
                    { value: 'motivational', label: 'Motivational' },
                    { value: 'storytelling', label: 'Storytelling' },
                ]
            },
            { key: 'includeHashtags', label: 'Include hashtags', type: 'toggle' },
        ]
    },
};

interface ModuleConfigDef {
    type: 'text' | 'image' | 'none';
    name: string;
    noAiMessage?: string;
    settings: SettingDefinition[];
}

interface SettingDefinition {
    key: string;
    label: string;
    type: 'select' | 'toggle' | 'color' | 'text';
    options?: { value: unknown; label: string }[];
}

export function ModuleSettingsPanel({ moduleKey }: ModuleSettingsPanelProps) {
    const [settings, setSettings] = useState<Record<string, unknown>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [apiKey, setApiKey] = useState('')
    const [showApiKeyInput, setShowApiKeyInput] = useState(false)

    const config = MODULE_CONFIG[moduleKey];
    const providers = config && config.type !== 'none' ? AI_PROVIDERS[config.type] : [];

    useEffect(() => {
        fetchSettings()
    }, [moduleKey])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/settings/modules?key=${moduleKey}`)
            const data = await res.json()
            setSettings(data.settings || {})
        } catch (err) {
            console.error('Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const res = await fetch('/api/settings/modules', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleKey, settings })
            })
            if (res.ok) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        } catch (err) {
            console.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const saveApiKey = async () => {
        if (!apiKey.trim() || !settings.aiProvider) return;

        setSaving(true)
        try {
            // Save to the module-specific key
            const provider = `${settings.aiProvider}_${moduleKey}`;
            await fetch('/api/settings/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    apiKey: apiKey.trim(),
                    label: `${config?.name || moduleKey} - ${settings.aiProvider}`
                })
            });
            setApiKey('')
            setShowApiKeyInput(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (err) {
            console.error('Failed to save API key')
        } finally {
            setSaving(false)
        }
    }

    const updateSetting = (key: string, value: unknown) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const selectedProvider = providers.find(p => p.provider === settings.aiProvider);

    if (loading) {
        return <div className="p-4 text-gray-500">Loading settings...</div>
    }

    if (!config) {
        return <div className="p-4 text-gray-500">No settings available for this module.</div>
    }

    return (
        <div className="space-y-6">
            {/* AI Provider Section - only show if module uses AI */}
            {config.type !== 'none' ? (
                <div className="border-b pb-6 dark:border-zinc-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        🤖 AI Configuration
                    </h3>

                    {/* Provider Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            AI Provider
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {providers.map(provider => (
                                <button
                                    key={provider.provider}
                                    onClick={() => updateSetting('aiProvider', provider.provider)}
                                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${settings.aiProvider === provider.provider
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{provider.icon}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{provider.label}</span>
                                    </div>
                                    {settings.aiProvider === provider.provider && (
                                        <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model Selection */}
                    {selectedProvider && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                Model
                            </label>
                            <select
                                value={String(settings.aiModel || selectedProvider.models[0])}
                                onChange={(e) => updateSetting('aiModel', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            >
                                {selectedProvider.models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* API Key Section */}
                    {selectedProvider && (
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    API Key for {selectedProvider.label}
                                </span>
                                <button
                                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    {showApiKeyInput ? 'Cancel' : 'Set API Key'}
                                </button>
                            </div>

                            {showApiKeyInput ? (
                                <div className="space-y-2">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Paste your API key"
                                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveApiKey}
                                            disabled={saving || !apiKey.trim()}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500 disabled:opacity-50"
                                        >
                                            Save Key
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600 dark:text-zinc-400">
                                    <a
                                        href={selectedProvider.helpUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-500 underline"
                                    >
                                        🔗 {selectedProvider.helpText}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-400 text-sm">
                        {config.noAiMessage || '✨ This module does not require an AI API key.'}
                    </p>
                </div>
            )}

            {/* Module-Specific Settings */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    ⚙️ Module Preferences
                </h3>

                <div className="space-y-4">
                    {config.settings.map(setting => (
                        <div key={setting.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                {setting.label}
                            </label>

                            {setting.type === 'select' && (
                                <select
                                    value={String(settings[setting.key] || '')}
                                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                                    className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                >
                                    {setting.options?.map(opt => (
                                        <option key={String(opt.value)} value={String(opt.value)}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {setting.type === 'toggle' && (
                                <button
                                    onClick={() => updateSetting(setting.key, !settings[setting.key])}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[setting.key] ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            )}

                            {setting.type === 'color' && (
                                <input
                                    type="color"
                                    value={String(settings[setting.key] || '#000000')}
                                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                                    className="w-10 h-10 rounded border cursor-pointer"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t dark:border-zinc-700">
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save All Settings'}
                </button>
            </div>
        </div>
    )
}
