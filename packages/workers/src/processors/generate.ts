import { Job } from 'bullmq';
import { prisma } from '@contentos/db';
import { generateViralText } from '@contentos/ai';
// import { generateViralImage } from '@contentos/ai';

export async function generateProcessor(job: Job) {
    const { workspaceId, prompt, type, platform = 'linkedin' } = job.data;
    console.log(`[GENERATE] Generating ${type} for workspace ${workspaceId}`);

    // Fetch integration for keys (BYOK) - Mock logic
    // const integration = await prisma.integration.findFirst(...)
    const apiKey = "mock-key"; // Decrypt integration.credentials

    if (type === 'text') {
        const variants = await generateViralText(prompt, apiKey);

        // Pick best (first for MVP)
        const content = variants[0];

        // Save Draft
        const post = await prisma.post.create({
            data: {
                workspaceId,
                platform,
                content,
                status: 'DRAFT',
                concept: prompt
            }
        });

        return { postId: post.id };
    }

    // Image logic stub
    return { error: 'Not implemented' };
}
