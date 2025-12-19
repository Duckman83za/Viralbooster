import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@contentos/db"
import { getCurrentWorkspace } from "@/lib/workspace"

// GET - Fetch posts for calendar view
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workspace = await getCurrentWorkspace()
        if (!workspace) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
        }

        const { searchParams } = new URL(req.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        // Fetch posts that are scheduled
        const posts = await prisma.post.findMany({
            where: {
                workspaceId: workspace.id,
                OR: [
                    { scheduledFor: { not: null } },
                    { status: 'SCHEDULED' },
                    { status: 'PUBLISHED' },
                ],
                ...(start && end && {
                    OR: [
                        { scheduledFor: { gte: new Date(start), lte: new Date(end) } },
                        { publishedAt: { gte: new Date(start), lte: new Date(end) } },
                    ]
                })
            },
            orderBy: { scheduledFor: 'asc' },
        })

        return NextResponse.json({ posts })
    } catch (error) {
        console.error('[API] Calendar GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 })
    }
}

// PUT - Schedule/reschedule a post
export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { postId, scheduledFor } = body

        if (!postId) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
        }

        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                status: scheduledFor ? 'SCHEDULED' : 'DRAFT',
            },
        })

        return NextResponse.json({
            success: true,
            post,
            message: scheduledFor ? 'Post scheduled' : 'Removed from schedule'
        })
    } catch (error) {
        console.error('[API] Calendar PUT error:', error)
        return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 })
    }
}
