'use client'

import { useState, useEffect } from 'react'

interface Post {
    id: string
    content: string | null
    platform: string
    status: string
    concept: string | null
    savedAt: string
    createdAt: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

const PLATFORMS = [
    { value: 'all', label: 'All Platforms' },
    { value: 'linkedin', label: '💼 LinkedIn' },
    { value: 'twitter', label: '🐦 Twitter/X' },
    { value: 'facebook', label: '👥 Facebook' },
    { value: 'instagram', label: '📷 Instagram' },
    { value: 'tiktok', label: '📱 TikTok' },
]

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

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function LibraryClient({ workspaceId }: { workspaceId: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [platform, setPlatform] = useState('all')

    const fetchPosts = async (page = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                workspaceId,
                page: page.toString(),
                platform,
            })
            const res = await fetch(`/api/library?${params}`)
            const data = await res.json()
            setPosts(data.posts || [])
            setPagination(data.pagination)
        } catch (error) {
            console.error('Failed to fetch library:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [platform])

    const handleRemove = async (postId: string) => {
        try {
            await fetch('/api/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, saved: false }),
            })
            fetchPosts(pagination?.page || 1)
        } catch (error) {
            console.error('Failed to remove:', error)
        }
    }

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="text-3xl">📚</span>
                    Saved Library
                </h1>
                <p className="text-muted mt-1">
                    Your collection of favorite posts, ready to use anytime
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    {PLATFORMS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </select>
                <div className="flex-1" />
                {pagination && (
                    <p className="text-sm text-muted self-center">
                        {pagination.total} saved posts
                    </p>
                )}
            </div>

            {/* Posts Grid */}
            {loading ? (
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted mt-3">Loading library...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Your library is empty
                    </h3>
                    <p className="text-muted mb-4">
                        Save posts from your drafts to build your collection
                    </p>
                    <a href="/dashboard/drafts" className="btn-primary px-6 py-2 inline-block">
                        Browse Drafts
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden group hover:shadow-medium transition-shadow"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {post.platform.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-500">⭐</span>
                                    <span className="text-xs text-muted">
                                        Saved {formatDate(post.savedAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className="text-sm text-gray-900 dark:text-white line-clamp-4 leading-relaxed">
                                    {post.content || post.concept || 'No content'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                                <button
                                    onClick={() => handleCopy(post.content || '')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary transition-colors"
                                >
                                    📋 Copy
                                </button>
                                <div className="flex-1" />
                                <button
                                    onClick={() => handleRemove(post.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                                >
                                    ⭐ Unsave
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => fetchPosts(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-muted">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => fetchPosts(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
