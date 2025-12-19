import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@contentos/db"
import { getCurrentWorkspace } from "@/lib/workspace"
import { checkEntitlement } from "@/lib/modules"

// GET - Fetch all brand voices for workspace
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workspace = await getCurrentWorkspace()
        if (!workspace) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
        }

        const voices = await prisma.brandVoice.findMany({
            where: { workspaceId: workspace.id },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        })

        return NextResponse.json({ voices })
    } catch (error) {
        console.error('[API] Brand Voice GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch brand voices' }, { status: 500 })
    }
}

// POST - Create new brand voice
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workspace = await getCurrentWorkspace()
        if (!workspace) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
        }

        // Check module entitlement
        const hasAccess = await checkEntitlement(workspace.id, 'module.brand_voice')
        if (!hasAccess) {
            return NextResponse.json({ error: 'Brand Voice module required' }, { status: 403 })
        }

        const body = await req.json()
        const { name, tone, style, audience, keywords, avoidWords, examples, isDefault } = body

        if (!name || !tone) {
            return NextResponse.json({ error: 'Name and tone are required' }, { status: 400 })
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.brandVoice.updateMany({
                where: { workspaceId: workspace.id },
                data: { isDefault: false },
            })
        }

        const voice = await prisma.brandVoice.create({
            data: {
                workspaceId: workspace.id,
                name,
                tone,
                style: style || null,
                audience: audience || null,
                keywords: keywords || [],
                avoidWords: avoidWords || [],
                examples: examples || null,
                isDefault: isDefault || false,
            },
        })

        return NextResponse.json({ success: true, voice })
    } catch (error) {
        console.error('[API] Brand Voice POST error:', error)
        return NextResponse.json({ error: 'Failed to create brand voice' }, { status: 500 })
    }
}

// PUT - Update brand voice
export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workspace = await getCurrentWorkspace()
        if (!workspace) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
        }

        const body = await req.json()
        const { id, name, tone, style, audience, keywords, avoidWords, examples, isDefault } = body

        if (!id) {
            return NextResponse.json({ error: 'Voice ID required' }, { status: 400 })
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.brandVoice.updateMany({
                where: { workspaceId: workspace.id, id: { not: id } },
                data: { isDefault: false },
            })
        }

        const voice = await prisma.brandVoice.update({
            where: { id },
            data: {
                name,
                tone,
                style,
                audience,
                keywords,
                avoidWords,
                examples,
                isDefault,
            },
        })

        return NextResponse.json({ success: true, voice })
    } catch (error) {
        console.error('[API] Brand Voice PUT error:', error)
        return NextResponse.json({ error: 'Failed to update brand voice' }, { status: 500 })
    }
}

// DELETE - Remove brand voice
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Voice ID required' }, { status: 400 })
        }

        await prisma.brandVoice.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[API] Brand Voice DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete brand voice' }, { status: 500 })
    }
}
