'use client'

import { useState, useEffect } from 'react'

interface ApiKey {
    id: string;
    provider: string;
    label: string;
    maskedKey: string;
    createdAt: string;
}

const PROVIDERS = [
    { value: 'gemini', label: 'Google Gemini', icon: '🔮' },
    { value: 'openai', label: 'OpenAI', icon: '🤖' },
    { value: 'anthropic', label: 'Anthropic Claude', icon: '🧠' },
];

export function ApiKeyManager() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editProvider, setEditProvider] = useState<string | null>(null)
    const [newKey, setNewKey] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchApiKeys()
    }, [])

    const fetchApiKeys = async () => {
        try {
            const res = await fetch('/api/settings/api-keys')
            const data = await res.json()
            setApiKeys(data.apiKeys || [])
        } catch (err) {
            setError('Failed to load API keys')
        } finally {
            setLoading(false)
        }
    }

    const saveApiKey = async (provider: string) => {
        if (!newKey.trim()) return;

        setSaving(true)
        setError(null)

        try {
            const res = await fetch('/api/settings/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, apiKey: newKey.trim() })
            })

            if (res.ok) {
                setEditProvider(null)
                setNewKey('')
                fetchApiKeys()
            } else {
                const data = await res.json()
                setError(data.error || 'Failed to save')
            }
        } catch (err) {
            setError('Failed to save API key')
        } finally {
            setSaving(false)
        }
    }

    const deleteApiKey = async (provider: string) => {
        if (!confirm('Are you sure you want to delete this API key?')) return;

        try {
            const res = await fetch(`/api/settings/api-keys?provider=${provider}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                fetchApiKeys()
            }
        } catch (err) {
            setError('Failed to delete API key')
        }
    }

    const getKeyForProvider = (provider: string) => {
        return apiKeys.find(k => k.provider === provider)
    }

    if (loading) {
        return <div className="p-4 text-gray-500">Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    Add your own API keys to use real AI generation. Your keys are stored securely and never shared.
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {PROVIDERS.map(provider => {
                    const existingKey = getKeyForProvider(provider.value)
                    const isEditing = editProvider === provider.value

                    return (
                        <div
                            key={provider.value}
                            className="border rounded-lg p-4 dark:border-zinc-700"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{provider.icon}</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {provider.label}
                                        </h4>
                                        {existingKey && !isEditing && (
                                            <p className="text-sm text-gray-500 dark:text-zinc-500">
                                                {existingKey.maskedKey}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!isEditing && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditProvider(provider.value)
                                                setNewKey('')
                                            }}
                                            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500"
                                        >
                                            {existingKey ? 'Update' : 'Add Key'}
                                        </button>
                                        {existingKey && (
                                            <button
                                                onClick={() => deleteApiKey(provider.value)}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <div className="mt-3 flex gap-2">
                                    <input
                                        type="password"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        placeholder="Paste your API key"
                                        className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm"
                                    />
                                    <button
                                        onClick={() => saveApiKey(provider.value)}
                                        disabled={saving || !newKey.trim()}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditProvider(null)
                                            setNewKey('')
                                        }}
                                        className="px-4 py-2 border rounded-md text-sm dark:border-zinc-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
