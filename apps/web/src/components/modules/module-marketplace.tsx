'use client'

import { useState } from 'react'

const AVAILABLE_MODULES = [
    {
        key: "module.text_viral",
        name: "Viral Text Generator",
        description: "Generate optimized posts for LinkedIn, X, and Facebook.",
        price: 2900,
        icon: "✍️",
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        key: "module.url_scanner",
        name: "URL Content Scanner",
        description: "Repurpose articles and web pages into viral social posts.",
        price: 3900,
        icon: "🔗",
        gradient: "from-green-500 to-emerald-600",
    },
    {
        key: "module.authority_image",
        name: "Authority Image Generator",
        description: "Create branded 1080x1350 quote images for Instagram & Pinterest.",
        price: 4900,
        icon: "🖼️",
        gradient: "from-purple-500 to-violet-600",
    },
    {
        key: "module.shorts_generator",
        name: "Viral Shorts Script Generator",
        description: "Create 60-second video scripts for TikTok, Reels & YouTube Shorts.",
        price: 2900,
        icon: "🎬",
        gradient: "from-pink-500 to-rose-600",
    },
    {
        key: "module.brand_voice",
        name: "Brand Voice Profiles",
        description: "Create custom voice profiles for consistent brand identity.",
        price: 3900,
        icon: "🎨",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        key: "module.image_viral_nanobanana_pro",
        name: "Viral Image Generator (AI)",
        description: "Generate AI images using Gemini/Imagen.",
        price: 4900,
        icon: "🌟",
        gradient: "from-amber-500 to-orange-600",
    },
]

export function ModuleMarketplace({ currentModules, workspaceId }: { currentModules: { moduleKey: string; enabled: boolean }[], workspaceId: string }) {
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AVAILABLE_MODULES.map((mod) => {
                const isEnabled = currentModules.some(m => m.moduleKey === mod.key && m.enabled)
                return (
                    <div
                        key={mod.key}
                        className="group relative bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-medium hover:border-gray-300 dark:hover:border-zinc-700"
                    >
                        {/* Gradient Header */}
                        <div className={`h-24 bg-gradient-to-br ${mod.gradient} flex items-center justify-center`}>
                            <span className="text-5xl filter drop-shadow-lg">{mod.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {mod.name}
                            </h3>
                            <p className="text-sm text-muted mb-4 line-clamp-2">
                                {mod.description}
                            </p>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${(mod.price / 100).toFixed(0)}
                                    </span>
                                    <span className="text-sm text-muted ml-1">one-time</span>
                                </div>

                                {isEnabled ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Active
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleBuyDev(mod.key)}
                                        disabled={!!loading}
                                        className="btn-primary text-sm px-4 py-2"
                                    >
                                        {loading === mod.key ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Processing
                                            </span>
                                        ) : (
                                            'Get Module'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Active indicator */}
                        {isEnabled && (
                            <div className="absolute top-3 right-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
