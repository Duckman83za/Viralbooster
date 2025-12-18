/**
 * URL Content Scanner Module
 *
 * Self-contained module that can work independently.
 * Repurposes articles and web content into viral social posts.
 */
// Module Configuration - all metadata in one place
export const config = {
    key: 'module.url_scanner',
    name: 'URL Content Scanner',
    description: 'Repurpose articles and web pages into viral social posts.',
    price: 3900, // $39.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '🔗',
    active: true,
};
// Module Definition
const urlScannerModule = {
    config,
    processor: {
        async process(input, context) {
            // Import AI functions dynamically to keep module independent
            const { scrapeUrl, generatePostsFromUrl } = await import('@contentos/ai');
            const apiKey = context.apiKeys['gemini'] || 'mock-key';
            // Scrape the URL
            const scrapedContent = await scrapeUrl(input.url);
            // Generate posts
            const posts = await generatePostsFromUrl(scrapedContent, apiKey, input.platform, input.postCount);
            return {
                success: true,
                posts,
                title: scrapedContent.title,
                sourceUrl: input.url,
            };
        }
    }
};
export default urlScannerModule;
