import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';
import { checkEntitlement } from '@/lib/modules';
import { getUserAIConfig } from '@/lib/ai-config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        // 1. Check authentication
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body
        const body = await req.json();
        const { prompt, platform = 'linkedin', workspaceId } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
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
        const hasAccess = await checkEntitlement(workspaceId, 'module.text_viral');
        if (!hasAccess) {
            return NextResponse.json({
                error: 'Text Generator module not enabled. Please purchase the module first.'
            }, { status: 403 });
        }

        // 5. Get user's AI config (BYOK)
        const aiConfig = await getUserAIConfig(user.id, 'module.text_viral');

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'No API key configured. Please add your API key in Settings → Text Generator.',
                needsApiKey: true
            }, { status: 400 });
        }

        // 6. Generate posts using real AI
        let posts: string[] = [];

        if (aiConfig.provider === 'gemini') {
            const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
            const model = genAI.getGenerativeModel({ model: aiConfig.model });

            const systemPrompt = `You are a viral social media content expert. Generate 3 unique, engaging ${platform} posts based on the user's topic.

Rules:
- Each post should be optimized for ${platform}'s algorithm
- Use hooks, storytelling, and calls-to-action
- Include relevant emojis
- LinkedIn: professional tone, 1300 chars max
- Twitter: punchy, 280 chars max
- Facebook: conversational, 500 chars max

Return exactly 3 posts, separated by "---" on its own line. No numbering or labels.`;

            const result = await model.generateContent(`${systemPrompt}\n\nTopic: ${prompt}`);
            const response = result.response.text();

            // Parse the 3 posts
            posts = response.split('---').map(p => p.trim()).filter(p => p.length > 0);

            // Ensure we have exactly 3 posts
            while (posts.length < 3) {
                posts.push(`[Post ${posts.length + 1} generation incomplete]`);
            }
            posts = posts.slice(0, 3);
        } else {
            // For OpenAI/Anthropic, add similar logic later
            // For now, return a helpful error
            return NextResponse.json({
                error: `${aiConfig.provider} integration coming soon. Please use Gemini for now.`,
            }, { status: 400 });
        }

        // 7. Save as drafts
        for (const content of posts) {
            await prisma.post.create({
                data: {
                    workspaceId,
                    platform,
                    content,
                    status: 'DRAFT',
                    concept: prompt.slice(0, 200),
                }
            });
        }

        return NextResponse.json({
            success: true,
            posts,
            provider: aiConfig.provider,
            model: aiConfig.model,
        });

    } catch (error) {
        console.error('[API] Text Generator error:', error);
        return NextResponse.json(
            { error: 'Failed to generate posts. Please check your API key.' },
            { status: 500 }
        );
    }
}
