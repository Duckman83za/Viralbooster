import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session) redirect('/auth/login')

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Marketplace', href: '/dashboard/modules', icon: '🛒' },
    ]

    const modules = [
        { name: 'Text Generator', href: '/dashboard/text-generator', icon: '✍️' },
        { name: 'URL Scanner', href: '/dashboard/url-scanner', icon: '🔗' },
        { name: 'Images', href: '/dashboard/authority-image', icon: '🖼️' },
        { name: 'Shorts', href: '/dashboard/shorts-generator', icon: '🎬' },
    ]

    const settings = [
        { name: 'Integrations', href: '/dashboard/integrations', icon: '🔌' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ]

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0a0a0a] flex">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col bg-white dark:bg-[#18181b] border-r border-gray-200 dark:border-zinc-800 shadow-soft">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <h1 className="text-xl font-bold text-secondary dark:text-white">ContentOS</h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                        {/* Main Nav */}
                        <div>
                            <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-3">Main</p>
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-primary transition-all duration-200"
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Modules */}
                        <div>
                            <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-3">Modules</p>
                            <div className="space-y-1">
                                {modules.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-primary transition-all duration-200"
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div>
                            <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-3">Settings</p>
                            <div className="space-y-1">
                                {settings.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-primary transition-all duration-200"
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* User Section */}
                    <div className="flex-shrink-0 border-t border-gray-100 dark:border-zinc-800 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {session.user?.email?.[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                                        {session.user?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-muted">Free Plan</p>
                                </div>
                            </div>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-zinc-800 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <h1 className="text-lg font-bold text-secondary dark:text-white">ContentOS</h1>
                </div>
                <ModeToggle />
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 md:pl-64">
                <main className="flex-1 pt-16 md:pt-0">
                    <div className="p-6 md:p-8 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
