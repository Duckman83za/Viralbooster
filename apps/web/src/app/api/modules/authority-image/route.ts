import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';
import { checkEntitlement } from '@/lib/modules';
import { generateAuthorityImage, type AuthorityImageOptions } from '@contentos/ai';

export async function POST(req: NextRequest) {
    try {
        // 1. Check authentication
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body
        const body = await req.json();
        const {
            text,
            author = '',
            backgroundColor = '#1a1a2e',
            textColor = '#ffffff',
            accentColor = '#f59e0b',
            style = 'minimal',
            workspaceId
        } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        // 3. Verify workspace access
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                workspaces: {
                    where: { workspaceId }
                }
            }
        });

        if (!user || user.workspaces.length === 0) {
            return NextResponse.json({ error: 'Access denied to workspace' }, { status: 403 });
        }

        // 4. Check entitlement
        const hasAccess = await checkEntitlement(workspaceId, 'module.authority_image');
        if (!hasAccess) {
            return NextResponse.json({
                error: 'Authority Image module not enabled. Please purchase the module first.'
            }, { status: 403 });
        }

        // 5. Generate image (synchronous - no queue needed as it's fast SVG generation)
        const options: AuthorityImageOptions = {
            text,
            author,
            backgroundColor,
            textColor,
            accentColor,
            style,
        };

        const result = await generateAuthorityImage(options);

        // 6. Save as Asset
        const asset = await prisma.asset.create({
            data: {
                workspaceId,
                storagePath: `authority-image-${Date.now()}.svg`,
                publicUrl: result.dataUrl,
                type: 'IMAGE',
                prompt: text,
                provider: 'authority-image-generator',
            }
        });

        return NextResponse.json({
            success: true,
            assetId: asset.id,
            dataUrl: result.dataUrl,
            width: result.width,
            height: result.height,
        });

    } catch (error) {
        console.error('[API] Authority Image error:', error);
        return NextResponse.json(
            { error: 'Failed to generate authority image' },
            { status: 500 }
        );
    }
}
