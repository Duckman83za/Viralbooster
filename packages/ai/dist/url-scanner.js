import { GoogleGenerativeAI } from "@google/generative-ai";
/**
 * Scrape content from a URL.
 * Uses fetch + basic HTML parsing (cheerio-like extraction).
 */
export async function scrapeUrl(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ContentOS/1.0; +https://contentos.app)'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status}`);
        }
        const html = await response.text();
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';
        // Extract meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        const description = descMatch ? descMatch[1].trim() : '';
        // Extract main content (simplified - gets text from article, main, or body)
        let mainContent = '';
        // Try to find article content first
        const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        if (articleMatch) {
            mainContent = articleMatch[1];
        }
        else {
            // Fall back to main content
            const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
            if (mainMatch) {
                mainContent = mainMatch[1];
            }
            else {
                // Fall back to body (less accurate)
                const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                mainContent = bodyMatch ? bodyMatch[1] : html;
            }
        }
        // Strip HTML tags and clean up
        mainContent = mainContent
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 5000); // Limit content length for API
        return {
            title,
            description,
            mainContent,
            url
        };
    }
    catch (error) {
        console.error('[URL Scanner] Scrape error:', error);
        throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Generate viral social media posts from scraped content.
 */
export async function generatePostsFromUrl(content, apiKey, platform, postCount = 5) {
    if (!apiKey || apiKey === "mock-key") {
        console.log("[AI] Mock generating posts from URL:", content.url);
        const mockPosts = [
            `🔥 Just discovered this gem: "${content.title}" - Here's what you need to know... #${platform}`,
            `💡 Key insight from ${content.url}: ${content.description || 'This changes everything!'} #Viral`,
            `🚀 Stop scrolling! This article about "${content.title}" has the answers you've been looking for.`,
            `📚 Thread: I summarized "${content.title}" so you don't have to. Here's the breakdown 👇`,
            `⚡ Hot take on "${content.title}" - The insights are mind-blowing! #ContentOS`
        ];
        return mockPosts.slice(0, postCount);
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const platformGuides = {
            linkedin: "LinkedIn (professional, insightful, use relevant hashtags, emojis sparingly)",
            twitter: "Twitter/X (punchy, conversational, hooks, under 280 chars ideally)",
            facebook: "Facebook (engaging, storytelling, call-to-action)",
            instagram: "Instagram (visually descriptive, compelling hooks, many hashtags)"
        };
        const platformStyle = platformGuides[platform.toLowerCase()] || platformGuides.linkedin;
        const prompt = `You are a viral content expert. Based on the following article content, create ${postCount} unique, engaging social media posts optimized for ${platformStyle}.

ARTICLE TITLE: ${content.title}
ARTICLE DESCRIPTION: ${content.description}
ARTICLE CONTENT (excerpt): ${content.mainContent.slice(0, 3000)}
SOURCE URL: ${content.url}

Requirements:
1. Each post should have a strong hook to grab attention
2. Extract key insights, stats, or quotes from the content
3. Use appropriate emojis and hashtags for the platform
4. Vary the format: some short, some longer, some as threads/lists
5. Include a subtle call-to-action where appropriate
6. Make each post unique - different angles on the same content

Generate exactly ${postCount} posts, separated by "---".`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const posts = text
            .split("---")
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, postCount);
        // Ensure we have the requested number of posts
        while (posts.length < postCount) {
            posts.push(`📌 Check out this article: "${content.title}" - ${content.url}`);
        }
        return posts;
    }
    catch (error) {
        console.error("[URL Scanner] Generation error:", error);
        throw new Error(`Failed to generate posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
