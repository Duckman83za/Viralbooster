import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Queue } from 'bullmq';
import { prisma } from '@contentos/db';
import { checkEntitlement } from '@/lib/modules';
import { getUserAIConfig } from '@/lib/ai-config';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
};

const urlScanQueue = new Queue('URL_SCAN', { connection });

export async function POST(req: NextRequest) {
    try {
        // 1. Check authentication
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body
        const body = await req.json();
        const { url, platform = 'linkedin', postCount = 5, workspaceId } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Validate postCount
        const validCounts = [3, 5, 10, 15];
        if (!validCounts.includes(postCount)) {
            return NextResponse.json({ error: 'Post count must be 3, 5, 10, or 15' }, { status: 400 });
        }

        // 3. Verify user has access to workspace & get user
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

        // 4. Check module entitlement
        const hasAccess = await checkEntitlement(workspaceId, 'module.url_scanner');
        if (!hasAccess) {
            return NextResponse.json({
                error: 'URL Scanner module not enabled. Please purchase the module first.'
            }, { status: 403 });
        }

        // 5. Get user's AI config (BYOK)
        const aiConfig = await getUserAIConfig(user.id, 'module.url_scanner');

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'No API key configured. Please add your API key in Settings → URL Scanner.',
                needsApiKey: true
            }, { status: 400 });
        }

        // 6. Add job to queue with API key
        const job = await urlScanQueue.add('scan', {
            workspaceId,
            url,
            platform,
            postCount,
            // Pass AI config to worker
            aiProvider: aiConfig.provider,
            aiModel: aiConfig.model,
            apiKey: aiConfig.apiKey,
        });

        return NextResponse.json({
            success: true,
            jobId: job.id,
            message: `Scanning URL and generating ${postCount} posts...`
        });

    } catch (error) {
        console.error('[API] URL Scan error:', error);
        return NextResponse.json(
            { error: 'Failed to process URL scan request' },
            { status: 500 }
        );
    }
}
