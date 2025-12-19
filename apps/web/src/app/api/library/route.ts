import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@contentos/db"

// GET - Fetch saved posts (library)
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspaceId')
        const platform = searchParams.get('platform') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        if (!workspaceId) {
            return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
        }

        // Build where clause - only saved posts
        const where: Record<string, unknown> = { workspaceId, saved: true }
        if (platform !== 'all') {
            where.platform = platform
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: { savedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.post.count({ where }),
        ])

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('[API] Library GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 })
    }
}

// POST - Save/unsave a post to library
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { postId, saved } = body

        if (!postId) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
        }

        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                saved: saved ?? true,
                savedAt: saved ? new Date() : null,
            },
        })

        return NextResponse.json({
            success: true,
            saved: post.saved,
            message: post.saved ? 'Saved to library' : 'Removed from library'
        })
    } catch (error) {
        console.error('[API] Library POST error:', error)
        return NextResponse.json({ error: 'Failed to update library' }, { status: 500 })
    }
}
