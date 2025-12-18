'use client'

import { useState } from 'react'
import { ModuleSettingsPanel } from '@/components/settings/module-settings-panel'

type Tab = 'text-gen' | 'url-scanner' | 'authority-image' | 'shorts-gen';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'text-gen', label: 'Text Generator', icon: '✍️' },
    { id: 'url-scanner', label: 'URL Scanner', icon: '🔗' },
    { id: 'authority-image', label: 'Authority Image', icon: '🖼️' },
    { id: 'shorts-gen', label: 'Shorts Generator', icon: '🎬' },
];

const MODULE_KEYS: Record<Tab, string> = {
    'text-gen': 'module.text_viral',
    'url-scanner': 'module.url_scanner',
    'authority-image': 'module.authority_image',
    'shorts-gen': 'module.shorts_generator',
};

export function SettingsPageClient() {
    const [activeTab, setActiveTab] = useState<Tab>('text-gen')

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-48 flex-shrink-0">
                <nav className="space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 border rounded-lg p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                    {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label} Settings
                </h2>
                <ModuleSettingsPanel moduleKey={MODULE_KEYS[activeTab]} />
            </div>
        </div>
    )
}
