'use client'

import { useState, useEffect, useMemo } from 'react'

interface Post {
    id: string
    content: string | null
    platform: string
    status: string
    scheduledFor: string | null
    publishedAt: string | null
}

function getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
        linkedin: '💼',
        twitter: '🐦',
        facebook: '👥',
        instagram: '📷',
        tiktok: '📱',
    }
    return icons[platform] || '📝'
}

function getDaysInMonth(year: number, month: number): Date[] {
    const date = new Date(year, month, 1)
    const days: Date[] = []
    while (date.getMonth() === month) {
        days.push(new Date(date))
        date.setDate(date.getDate() + 1)
    }
    return days
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay()
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarClient({ workspaceId }: { workspaceId: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('09:00')

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const days = useMemo(() => getDaysInMonth(year, month), [year, month])
    const firstDay = useMemo(() => getFirstDayOfMonth(year, month), [year, month])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const start = new Date(year, month, 1).toISOString()
            const end = new Date(year, month + 1, 0).toISOString()
            const res = await fetch(`/api/calendar?start=${start}&end=${end}`)
            const data = await res.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Failed to fetch calendar:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [year, month])

    const getPostsForDay = (day: Date): Post[] => {
        return posts.filter(post => {
            const postDate = post.scheduledFor || post.publishedAt
            if (!postDate) return false
            const d = new Date(postDate)
            return d.getDate() === day.getDate() &&
                d.getMonth() === day.getMonth() &&
                d.getFullYear() === day.getFullYear()
        })
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleSchedule = async () => {
        if (!selectedPost || !scheduleDate) return

        const dateTime = new Date(`${scheduleDate}T${scheduleTime}`)

        try {
            await fetch('/api/calendar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: selectedPost.id,
                    scheduledFor: dateTime.toISOString(),
                }),
            })
            setSelectedPost(null)
            fetchPosts()
        } catch (error) {
            console.error('Failed to schedule:', error)
        }
    }

    const handleUnschedule = async (postId: string) => {
        try {
            await fetch('/api/calendar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, scheduledFor: null }),
            })
            fetchPosts()
        } catch (error) {
            console.error('Failed to unschedule:', error)
        }
    }

    const isToday = (day: Date): boolean => {
        const today = new Date()
        return day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span>📅</span> Content Calendar
                    </h1>
                    <p className="text-muted mt-1">
                        Schedule and manage your content publishing
                    </p>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-soft overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <button
                        onClick={prevMonth}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-semibold text-white">
                        {MONTHS[month]} {year}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                    >
                        →
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-muted">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted mt-3">Loading calendar...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-7">
                        {/* Empty cells for days before first of month */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50" />
                        ))}

                        {/* Day cells */}
                        {days.map((day) => {
                            const dayPosts = getPostsForDay(day)
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`min-h-[100px] p-2 border-b border-r border-gray-100 dark:border-zinc-800 ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-zinc-300'
                                        }`}>
                                        {day.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayPosts.slice(0, 3).map(post => (
                                            <div
                                                key={post.id}
                                                onClick={() => setSelectedPost(post)}
                                                className={`text-xs p-1.5 rounded-lg cursor-pointer truncate ${post.status === 'PUBLISHED'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                    }`}
                                            >
                                                {getPlatformIcon(post.platform)} {post.content?.slice(0, 20) || 'Post'}...
                                            </div>
                                        ))}
                                        {dayPosts.length > 3 && (
                                            <div className="text-xs text-muted">
                                                +{dayPosts.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Unscheduled Drafts */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📋 Unscheduled Drafts
                </h3>
                <UnscheduledDrafts
                    workspaceId={workspaceId}
                    onSchedule={(post) => {
                        setSelectedPost(post)
                        setScheduleDate('')
                    }}
                />
            </div>

            {/* Schedule Modal */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedPost.scheduledFor ? 'Reschedule Post' : 'Schedule Post'}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-sm text-muted line-clamp-3">
                                {selectedPost.content?.slice(0, 150)}...
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="input-modern text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="input-modern text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                            {selectedPost.scheduledFor && (
                                <button
                                    onClick={() => {
                                        handleUnschedule(selectedPost.id)
                                        setSelectedPost(null)
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Unschedule
                                </button>
                            )}
                            <div className="flex-1" />
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSchedule}
                                disabled={!scheduleDate}
                                className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Component for unscheduled drafts
function UnscheduledDrafts({ workspaceId, onSchedule }: { workspaceId: string; onSchedule: (post: Post) => void }) {
    const [drafts, setDrafts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDrafts() {
            try {
                const res = await fetch(`/api/drafts?workspaceId=${workspaceId}&status=DRAFT&limit=5`)
                const data = await res.json()
                setDrafts(data.posts?.filter((p: Post) => !p.scheduledFor) || [])
            } catch (error) {
                console.error('Failed to fetch drafts:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDrafts()
    }, [workspaceId])

    if (loading) {
        return <div className="text-muted text-sm">Loading drafts...</div>
    }

    if (drafts.length === 0) {
        return (
            <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-zinc-800 p-6 text-center">
                <p className="text-muted text-sm">No unscheduled drafts</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {drafts.map(draft => (
                <div
                    key={draft.id}
                    className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-zinc-800 p-4 hover:shadow-medium transition-shadow"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span>{getPlatformIcon(draft.platform)}</span>
                        <span className="text-xs text-muted capitalize">{draft.platform}</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2 mb-3">
                        {draft.content?.slice(0, 80) || 'No content'}...
                    </p>
                    <button
                        onClick={() => onSchedule(draft)}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        📅 Schedule
                    </button>
                </div>
            ))}
        </div>
    )
}
