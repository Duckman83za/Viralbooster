export interface ScrapedContent {
    title: string;
    description: string;
    mainContent: string;
    url: string;
}
export type PostCount = 3 | 5 | 10 | 15;
/**
 * Scrape content from a URL.
 * Uses fetch + basic HTML parsing (cheerio-like extraction).
 */
export declare function scrapeUrl(url: string): Promise<ScrapedContent>;
/**
 * Generate viral social media posts from scraped content.
 */
export declare function generatePostsFromUrl(content: ScrapedContent, apiKey: string, platform: string, postCount?: PostCount): Promise<string[]>;
