import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@contentos/db"

// GET - Fetch drafts with pagination
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspaceId')
        const status = searchParams.get('status') || 'all'
        const platform = searchParams.get('platform') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        if (!workspaceId) {
            return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
        }

        // Build where clause
        const where: Record<string, unknown> = { workspaceId }
        if (status !== 'all') {
            where.status = status
        }
        if (platform !== 'all') {
            where.platform = platform
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: { createdAt: 'desc' },
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
        console.error('[API] Drafts GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
    }
}

// PUT - Update draft content
export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { id, content, status } = body

        if (!id) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {}
        if (content !== undefined) updateData.content = content
        if (status !== undefined) updateData.status = status

        const post = await prisma.post.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json({ success: true, post })
    } catch (error) {
        console.error('[API] Drafts PUT error:', error)
        return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
    }
}

// DELETE - Remove draft
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
        }

        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[API] Drafts DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
    }
}
