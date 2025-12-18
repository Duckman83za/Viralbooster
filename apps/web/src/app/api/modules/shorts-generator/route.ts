import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';
import { checkEntitlement } from '@/lib/modules';
import { getUserAIConfig } from '@/lib/ai-config';
import { generateShortsScript, type ShortsScriptOptions } from '@contentos/ai';

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
            topic,
            platform = 'tiktok',
            niche = '',
            tone = 'educational',
            workspaceId
        } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        // Validate platform
        const validPlatforms = ['tiktok', 'reels', 'youtube_shorts'];
        if (!validPlatforms.includes(platform)) {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        // 3. Verify workspace access & get user
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
        const hasAccess = await checkEntitlement(workspaceId, 'module.shorts_generator');
        if (!hasAccess) {
            return NextResponse.json({
                error: 'Shorts Generator module not enabled. Please purchase the module first.'
            }, { status: 403 });
        }

        // 5. Get user's AI config for this module (BYOK)
        const aiConfig = await getUserAIConfig(user.id, 'module.shorts_generator');

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'No API key configured. Please add your API key in Settings → Shorts Generator.',
                needsApiKey: true
            }, { status: 400 });
        }

        // 6. Generate script with user's provider/model
        const options: ShortsScriptOptions = {
            topic,
            platform,
            niche,
            tone,
            provider: aiConfig.provider as 'gemini' | 'openai' | 'anthropic',
            model: aiConfig.model,
        };

        const script = await generateShortsScript(options, aiConfig.apiKey);

        // 7. Save as draft post
        const post = await prisma.post.create({
            data: {
                workspaceId,
                platform: platform === 'youtube_shorts' ? 'youtube' : platform === 'reels' ? 'instagram' : 'tiktok',
                content: script.fullScript,
                status: 'DRAFT',
                concept: `Shorts Script: ${topic}`,
            }
        });

        return NextResponse.json({
            success: true,
            postId: post.id,
            script,
            provider: aiConfig.provider,
            model: aiConfig.model,
        });

    } catch (error) {
        console.error('[API] Shorts Generator error:', error);
        return NextResponse.json(
            { error: 'Failed to generate shorts script' },
            { status: 500 }
        );
    }
}
