/**
 * Viral Shorts Script Generator
 *
 * Generates 60-second video scripts for TikTok, Instagram Reels, and YouTube Shorts
 * using the proven 4-part framework: Hook → Story → 3 Tips → CTA
 *
 * Supports: Gemini, OpenAI (GPT-4o, o1), and Anthropic Claude
 */
export interface ShortsScriptOptions {
    /** Main topic or theme for the video */
    topic: string;
    /** Target platform */
    platform: 'tiktok' | 'reels' | 'youtube_shorts';
    /** Niche/industry (optional) */
    niche?: string;
    /** Tone of the content */
    tone?: 'educational' | 'entertaining' | 'motivational' | 'storytelling';
    /** AI provider to use */
    provider?: 'gemini' | 'openai' | 'anthropic';
    /** Specific model to use */
    model?: string;
}
export interface ShortsScript {
    /** Attention-grabbing hook (0-5 seconds) */
    hook: string;
    /** Personal story or context (5-20 seconds) */
    story: string;
    /** Three actionable tips (20-50 seconds) */
    tips: [string, string, string];
    /** Call to action (50-60 seconds) */
    cta: string;
    /** Full combined script */
    fullScript: string;
    /** Estimated duration in seconds */
    estimatedDuration: number;
    /** Platform-specific hashtags */
    hashtags: string[];
}
/**
 * Generate a viral shorts script using the 4-part framework
 */
export declare function generateShortsScript(options: ShortsScriptOptions, apiKey: string): Promise<ShortsScript>;
