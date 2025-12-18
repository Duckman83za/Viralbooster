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
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Marketplace', href: '/dashboard/modules' },
        // Modules
        { name: '✍️ Text Gen', href: '/dashboard/text-generator' },
        { name: '🔗 URL Scanner', href: '/dashboard/url-scanner' },
        { name: '🖼️ Images', href: '/dashboard/authority-image' },
        { name: '🎬 Shorts', href: '/dashboard/shorts-generator' },
        // Settings
        { name: 'Integrations', href: '/dashboard/integrations' },
        { name: '⚙️ Settings', href: '/dashboard/settings' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <h1 className="text-xl font-bold text-indigo-600">ContentOS</h1>
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-950 dark:hover:text-white"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-zinc-800 p-4 justify-between items-center">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.user?.email}</p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 md:pl-64">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
