/**
 * URL Content Scanner Module
 * 
 * Self-contained module that can work independently.
 * Repurposes articles and web content into viral social posts.
 */

import { ModuleDefinition, ModuleConfig, ModuleContext } from '../types';

// Module Configuration - all metadata in one place
export const config: ModuleConfig = {
    key: 'module.url_scanner',
    name: 'URL Content Scanner',
    description: 'Repurpose articles and web pages into viral social posts.',
    price: 3900, // $39.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '🔗',
    active: true,
};

// Input/Output types for this module
export interface UrlScannerInput {
    url: string;
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram';
    postCount: 3 | 5 | 10 | 15;
}

export interface UrlScannerOutput {
    success: boolean;
    posts: string[];
    title: string;
    sourceUrl: string;
}

// Module Definition
const urlScannerModule: ModuleDefinition<UrlScannerInput, UrlScannerOutput> = {
    config,
    processor: {
        async process(input: UrlScannerInput, context: ModuleContext): Promise<UrlScannerOutput> {
            // Import AI functions dynamically to keep module independent
            const { scrapeUrl, generatePostsFromUrl } = await import('@contentos/ai');

            const apiKey = context.apiKeys['gemini'] || 'mock-key';

            // Scrape the URL
            const scrapedContent = await scrapeUrl(input.url);

            // Generate posts
            const posts = await generatePostsFromUrl(
                scrapedContent,
                apiKey,
                input.platform,
                input.postCount
            );

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
