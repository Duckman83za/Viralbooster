import { getCurrentWorkspace } from "@/lib/workspace"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@contentos/db"

async function getDashboardStats(workspaceId: string) {
    const [totalPosts, drafts, modulesActive, recentPosts] = await Promise.all([
        // Total posts generated
        prisma.post.count({
            where: { workspaceId }
        }),
        // Drafts pending
        prisma.post.count({
            where: { workspaceId, status: 'DRAFT' }
        }),
        // Active modules
        prisma.workspaceModule.count({
            where: { workspaceId, enabled: true }
        }),
        // Recent posts (last 5)
        prisma.post.findMany({
            where: { workspaceId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        })
    ])

    // Posts this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const postsThisWeek = await prisma.post.count({
        where: {
            workspaceId,
            createdAt: { gte: weekAgo }
        }
    })

    return { totalPosts, drafts, modulesActive, postsThisWeek, recentPosts }
}

const QUICK_ACTIONS = [
    { name: 'Generate Text Post', href: '/dashboard/text-generator', icon: '✍️', gradient: 'from-blue-500 to-indigo-600' },
    { name: 'Scan URL', href: '/dashboard/url-scanner', icon: '🔗', gradient: 'from-green-500 to-emerald-600' },
    { name: 'Create Shorts Script', href: '/dashboard/shorts-generator', icon: '🎬', gradient: 'from-pink-500 to-rose-600' },
    { name: 'Create Quote Image', href: '/dashboard/authority-image', icon: '🖼️', gradient: 'from-purple-500 to-violet-600' },
]

function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

function getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
        linkedin: '💼',
        twitter: '🐦',
        facebook: '👥',
        instagram: '📷',
        tiktok: '📱',
        youtube_shorts: '▶️',
        reels: '📷',
    }
    return icons[platform] || '📝'
}

export default async function DashboardHome() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        redirect('/auth/login')
    }

    const stats = await getDashboardStats(workspace.id)

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back! 👋
                </h1>
                <p className="text-muted mt-1">
                    Here's what's happening with your content
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-xl">📝</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
                            <p className="text-xs text-muted">Total Posts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span className="text-xl">📋</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.drafts}</p>
                            <p className="text-xs text-muted">Drafts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-xl">🧩</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.modulesActive}</p>
                            <p className="text-xs text-muted">Active Modules</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="text-xl">📈</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.postsThisWeek}</p>
                            <p className="text-xs text-muted">This Week</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="group flex items-center gap-4 p-4 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 shadow-soft hover:shadow-medium"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white text-2xl`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                        {action.name}
                                    </p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Activity
                        </h2>
                        {stats.recentPosts.length > 0 && (
                            <Link href="/dashboard/drafts" className="text-sm font-medium text-primary hover:underline">
                                View all →
                            </Link>
                        )}
                    </div>

                    <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
                        {stats.recentPosts.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {stats.recentPosts.map((post) => (
                                    <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                                                {getPlatformIcon(post.platform)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                                    {post.content?.slice(0, 100) || post.concept || 'No content'}
                                                    {(post.content?.length ?? 0) > 100 && '...'}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'DRAFT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                    <span className="text-xs text-muted">
                                                        {formatRelativeTime(post.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="text-4xl mb-3">📝</div>
                                <p className="text-muted font-medium">No posts yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Generate your first post using one of the quick actions
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
