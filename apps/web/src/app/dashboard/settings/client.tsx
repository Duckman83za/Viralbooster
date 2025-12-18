'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { ModuleSettingsPanel } from '@/components/settings/module-settings-panel'

type Tab = 'general' | 'text-gen' | 'url-scanner' | 'authority-image' | 'shorts-gen';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'text-gen', label: 'Text Generator', icon: '✍️' },
    { id: 'url-scanner', label: 'URL Scanner', icon: '🔗' },
    { id: 'authority-image', label: 'Authority Image', icon: '🖼️' },
    { id: 'shorts-gen', label: 'Shorts Generator', icon: '🎬' },
];

const MODULE_KEYS: Record<Exclude<Tab, 'general'>, string> = {
    'text-gen': 'module.text_viral',
    'url-scanner': 'module.url_scanner',
    'authority-image': 'module.authority_image',
    'shorts-gen': 'module.shorts_generator',
};

function GeneralSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="space-y-8">
            {/* Appearance Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    🎨 Appearance
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
                            Theme
                        </label>
                        <div className="flex gap-3">
                            {[
                                { value: 'light', label: 'Light', icon: '☀️' },
                                { value: 'dark', label: 'Dark', icon: '🌙' },
                                { value: 'system', label: 'Auto', icon: '💻' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTheme(option.value)}
                                    className={`flex-1 p-4 rounded-xl border-2 text-center transition-all duration-200 ${theme === option.value
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <div className={`text-xs font-medium ${theme === option.value ? 'text-primary' : 'text-gray-600 dark:text-zinc-400'}`}>
                                        {option.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Section */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    👤 Account
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                        <p className="text-sm text-muted">
                            Account management features coming soon: profile editing, password change, and account deletion.
                        </p>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    🔔 Notifications
                </h3>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</p>
                            <p className="text-xs text-muted">Receive updates about your generated content</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Weekly digest</p>
                            <p className="text-xs text-muted">Summary of your content performance</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
                    </label>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">
                    ⚠️ Danger Zone
                </h3>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export function SettingsPageClient() {
    const [activeTab, setActiveTab] = useState<Tab>('general')

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-52 flex-shrink-0">
                <nav className="space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{TABS.find(t => t.id === activeTab)?.icon}</span>
                        {TABS.find(t => t.id === activeTab)?.label} Settings
                    </h2>
                </div>
                <div className="p-6">
                    {activeTab === 'general' ? (
                        <GeneralSettings />
                    ) : (
                        <ModuleSettingsPanel moduleKey={MODULE_KEYS[activeTab as Exclude<Tab, 'general'>]} />
                    )}
                </div>
            </div>
        </div>
    )
}
