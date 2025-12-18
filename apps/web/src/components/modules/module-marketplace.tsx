'use client'

import { useState } from 'react'

// Duplicate for client-side, or import from shared constant if possible (requires types fix)
const AVAILABLE_MODULES = [
    {
        key: "module.text_viral",
        name: "Viral Text Generator",
        description: "Generate optimized posts for LinkedIn, X, and Facebook.",
        price: 2900,
    },
    {
        key: "module.image_viral_nanobanana_pro",
        name: "Viral Image Generator (Nano Banana Pro)",
        description: "Create stunning visuals using Gemini Nano Banana Pro.",
        price: 4900,
    },
    {
        key: "module.url_scanner",
        name: "URL Content Scanner",
        description: "Repurpose articles and web pages into viral social posts.",
        price: 3900,
    },
]

export function ModuleMarketplace({ currentModules, workspaceId }: { currentModules: any[], workspaceId: string }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleBuyDev = async (moduleKey: string) => {
        setLoading(moduleKey)
        try {
            await fetch('/api/webhooks/paddle', {
                method: 'POST',
                body: JSON.stringify({
                    event_type: 'dev.grant',
                    data: {
                        workspaceId,
                        moduleKey
                    }
                })
            })
            window.location.reload()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AVAILABLE_MODULES.map((mod) => {
                const isEnabled = currentModules.some(m => m.moduleKey === mod.key && m.enabled)
                return (
                    <div key={mod.key} className="border rounded-lg p-6 shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
                        <h3 className="text-lg font-medium text-black dark:text-white">{mod.name}</h3>
                        <p className="text-gray-700 dark:text-zinc-400 mt-2 text-sm">{mod.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xl font-bold text-black dark:text-white">${(mod.price / 100).toFixed(2)}</span>
                            {isEnabled ? (
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Active
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleBuyDev(mod.key)}
                                    disabled={!!loading}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    {loading === mod.key ? 'Processing...' : 'Buy (Dev)'}
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
