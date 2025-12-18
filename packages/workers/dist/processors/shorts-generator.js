import { prisma } from '@contentos/db';
import { generateShortsScript } from '@contentos/ai';
export async function shortsGeneratorProcessor(job) {
    const { workspaceId, topic, platform, niche, tone = 'educational' } = job.data;
    console.log(`[SHORTS-GENERATOR] Generating for workspace ${workspaceId}: ${topic}`);
    try {
        // 1. Check entitlement
        const entitlement = await prisma.workspaceModule.findUnique({
            where: {
                workspaceId_moduleKey: {
                    workspaceId,
                    moduleKey: 'module.shorts_generator'
                }
            }
        });
        if (!entitlement?.enabled) {
            throw new Error('Shorts Generator module not enabled for this workspace');
        }
        // 2. Get API key (BYOK)
        const integration = await prisma.integration.findFirst({
            where: {
                workspaceId,
                platform: 'gemini'
            }
        });
        let apiKey = 'mock-key';
        if (integration?.credentials) {
            try {
                const parsed = JSON.parse(integration.credentials);
                apiKey = parsed.apiKey || parsed.data || 'mock-key';
            }
            catch {
                console.log('[SHORTS-GENERATOR] Could not parse credentials, using mock key');
            }
        }
        // 3. Generate script
        const options = {
            topic,
            platform,
            niche,
            tone,
        };
        const script = await generateShortsScript(options, apiKey);
        // 4. Save as draft post
        const post = await prisma.post.create({
            data: {
                workspaceId,
                platform: platform === 'youtube_shorts' ? 'youtube' : platform === 'reels' ? 'instagram' : 'tiktok',
                content: script.fullScript,
                status: 'DRAFT',
                concept: `Shorts Script: ${topic}`,
            }
        });
        console.log(`[SHORTS-GENERATOR] Created post ${post.id}`);
        return {
            success: true,
            postId: post.id,
            script,
        };
    }
    catch (error) {
        console.error('[SHORTS-GENERATOR] Error:', error);
        throw error;
    }
}
