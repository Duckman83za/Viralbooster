import { Job } from 'bullmq';
import { prisma } from '@contentos/db';
import { scrapeUrl, generatePostsFromUrl, type ScrapedContent, type PostCount } from '@contentos/ai';

export async function urlScanProcessor(job: Job) {
    const {
        workspaceId,
        url,
        platform = 'linkedin',
        postCount = 5
    } = job.data as {
        workspaceId: string;
        url: string;
        platform?: string;
        postCount?: number;
    };

    console.log(`[URL-SCAN] Scanning URL for workspace ${workspaceId}: ${url}`);

    try {
        // 1. Check entitlement (module access)
        const entitlement = await prisma.workspaceModule.findUnique({
            where: {
                workspaceId_moduleKey: {
                    workspaceId,
                    moduleKey: 'module.url_scanner'
                }
            }
        });

        if (!entitlement?.enabled) {
            throw new Error('URL Scanner module not enabled for this workspace');
        }

        // 2. Get API key from workspace integrations (BYOK)
        // Using platform: 'gemini' for AI API keys
        const integration = await prisma.integration.findFirst({
            where: {
                workspaceId,
                platform: 'gemini'
            }
        });

        // Use mock key if no integration (for development)
        let apiKey = 'mock-key';
        if (integration?.credentials) {
            try {
                const parsed = JSON.parse(integration.credentials);
                apiKey = parsed.apiKey || parsed.data || 'mock-key';
            } catch {
                console.log('[URL-SCAN] Could not parse credentials, using mock key');
            }
        }

        // 3. Scrape the URL
        console.log(`[URL-SCAN] Scraping: ${url}`);
        const scrapedContent: ScrapedContent = await scrapeUrl(url);

        // 4. Generate posts
        console.log(`[URL-SCAN] Generating ${postCount} posts for ${platform}`);
        const posts = await generatePostsFromUrl(
            scrapedContent,
            apiKey,
            platform,
            postCount as PostCount
        );

        // 5. Save as drafts (using 'concept' field for source info)
        const createdPosts = await Promise.all(
            posts.map((content: string) =>
                prisma.post.create({
                    data: {
                        workspaceId,
                        platform,
                        content,
                        status: 'DRAFT',
                        concept: `URL Scan: ${scrapedContent.title} | ${url}`
                    }
                })
            )
        );

        console.log(`[URL-SCAN] Created ${createdPosts.length} draft posts`);

        return {
            success: true,
            postIds: createdPosts.map((p: { id: string }) => p.id),
            title: scrapedContent.title
        };

    } catch (error) {
        console.error('[URL-SCAN] Error:', error);
        throw error;
    }
}
