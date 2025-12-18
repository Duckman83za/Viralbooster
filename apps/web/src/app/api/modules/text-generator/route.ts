import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';
import { checkEntitlement } from '@/lib/modules';
import { getUserAIConfig } from '@/lib/ai-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

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

        // System prompt for all providers
        const systemPrompt = `You are a viral social media content expert. Generate 3 unique, engaging ${platform} posts based on the user's topic.

Rules:
- Each post should be optimized for ${platform}'s algorithm
- Use hooks, storytelling, and calls-to-action
- Include relevant emojis
- LinkedIn: professional tone, 1300 chars max
- Twitter: punchy, 280 chars max
- Facebook: conversational, 500 chars max

Return exactly 3 posts, separated by "---" on its own line. No numbering or labels.`;

        // 6. Generate posts using real AI
        let posts: string[] = [];
        let rawResponse = '';

        if (aiConfig.provider === 'gemini') {
            // Google Gemini
            const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
            const model = genAI.getGenerativeModel({ model: aiConfig.model });
            const result = await model.generateContent(`${systemPrompt}\n\nTopic: ${prompt}`);
            rawResponse = result.response.text();

        } else if (aiConfig.provider === 'openai') {
            // OpenAI (GPT-4o, o1, etc.)
            const openai = new OpenAI({ apiKey: aiConfig.apiKey });

            // o1 models don't support system messages, so we handle differently
            const isO1Model = aiConfig.model.startsWith('o1');

            const completion = await openai.chat.completions.create({
                model: aiConfig.model,
                messages: isO1Model ? [
                    { role: 'user', content: `${systemPrompt}\n\nTopic: ${prompt}` }
                ] : [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Topic: ${prompt}` }
                ],
            });

            rawResponse = completion.choices[0]?.message?.content || '';

        } else if (aiConfig.provider === 'anthropic') {
            // Anthropic Claude
            const anthropic = new Anthropic({ apiKey: aiConfig.apiKey });

            const message = await anthropic.messages.create({
                model: aiConfig.model,
                max_tokens: 2048,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: `Topic: ${prompt}` }
                ],
            });

            // Extract text from content blocks
            rawResponse = message.content
                .filter((block): block is Anthropic.TextBlock => block.type === 'text')
                .map(block => block.text)
                .join('');

        } else {
            return NextResponse.json({
                error: `Unknown provider: ${aiConfig.provider}`,
            }, { status: 400 });
        }

        // Parse the response into 3 posts
        posts = rawResponse.split('---').map(p => p.trim()).filter(p => p.length > 0);

        // Ensure we have exactly 3 posts
        while (posts.length < 3) {
            posts.push(`[Post ${posts.length + 1} generation incomplete]`);
        }
        posts = posts.slice(0, 3);

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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Failed to generate posts: ${errorMessage}` },
            { status: 500 }
        );
    }
}
