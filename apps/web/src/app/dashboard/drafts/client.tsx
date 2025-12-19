'use client'

import { useState, useEffect } from 'react'

interface Post {
    id: string
    content: string | null
    platform: string
    status: string
    concept: string | null
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

const STATUSES = [
    { value: 'all', label: 'All Status' },
    { value: 'DRAFT', label: '📋 Draft' },
    { value: 'SCHEDULED', label: '📅 Scheduled' },
    { value: 'PUBLISHED', label: '✅ Published' },
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
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function DraftsClient({ workspaceId }: { workspaceId: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [platform, setPlatform] = useState('all')
    const [status, setStatus] = useState('all')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')

    const fetchPosts = async (page = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                workspaceId,
                page: page.toString(),
                platform,
                status,
            })
            const res = await fetch(`/api/drafts?${params}`)
            const data = await res.json()
            setPosts(data.posts || [])
            setPagination(data.pagination)
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [platform, status])

    const handleEdit = (post: Post) => {
        setEditingId(post.id)
        setEditContent(post.content || '')
    }

    const handleSave = async () => {
        if (!editingId) return

        try {
            await fetch('/api/drafts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingId, content: editContent }),
            })
            setEditingId(null)
            fetchPosts(pagination?.page || 1)
        } catch (error) {
            console.error('Failed to save:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            await fetch(`/api/drafts?id=${id}`, { method: 'DELETE' })
            fetchPosts(pagination?.page || 1)
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Content Drafts
                </h1>
                <p className="text-muted mt-1">
                    View, edit, and manage your generated content
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
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <div className="flex-1" />
                {pagination && (
                    <p className="text-sm text-muted self-center">
                        {pagination.total} posts
                    </p>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted mt-3">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No posts found
                        </h3>
                        <p className="text-muted">
                            Generate some content to see it here
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden"
                        >
                            {/* Post Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{getPlatformIcon(post.platform)}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {post.platform.replace('_', ' ')}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'DRAFT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300'
                                        }`}>
                                        {post.status}
                                    </span>
                                </div>
                                <span className="text-xs text-muted">
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>

                            {/* Post Content */}
                            <div className="p-5">
                                {editingId === post.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                className="btn-primary px-4 py-2 text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 text-sm border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                                            {post.content || post.concept || 'No content'}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => handleCopy(post.content || '')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors"
                                            >
                                                📋 Copy
                                            </button>
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <div className="flex-1" />
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

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
