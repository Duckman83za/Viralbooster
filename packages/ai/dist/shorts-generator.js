/**
 * Viral Shorts Script Generator
 *
 * Generates 60-second video scripts for TikTok, Instagram Reels, and YouTube Shorts
 * using the proven 4-part framework: Hook → Story → 3 Tips → CTA
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
/**
 * Generate a viral shorts script using the 4-part framework
 */
export async function generateShortsScript(options, apiKey) {
    const { topic, platform, niche = '', tone = 'educational' } = options;
    // Mock response for development
    if (!apiKey || apiKey === 'mock-key') {
        console.log("[AI] Mock generating shorts script for:", topic);
        return generateMockScript(topic, platform, niche, tone);
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const platformNames = {
            tiktok: 'TikTok',
            reels: 'Instagram Reels',
            youtube_shorts: 'YouTube Shorts'
        };
        const prompt = `You are a viral content expert specializing in short-form video scripts. Create a 60-second video script using this proven 4-part framework:

TOPIC: ${topic}
PLATFORM: ${platformNames[platform]}
NICHE: ${niche || 'General'}
TONE: ${tone}

Generate a script with these exact sections:

1. HOOK (0-5 seconds): A scroll-stopping opening line that creates curiosity or shock value.

2. STORY (5-20 seconds): A brief personal story, relatable situation, or context that connects with the viewer emotionally.

3. TIPS (20-50 seconds): Exactly 3 actionable, specific tips or insights. Each tip should be 1-2 sentences max.

4. CTA (50-60 seconds): A strong call-to-action that encourages engagement (follow, like, comment, share).

Also provide 5-7 relevant hashtags for ${platformNames[platform]}.

Format your response EXACTLY like this JSON (no markdown, just raw JSON):
{
    "hook": "Your hook text here",
    "story": "Your story text here",
    "tips": ["Tip 1", "Tip 2", "Tip 3"],
    "cta": "Your CTA text here",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse script response');
        }
        const parsed = JSON.parse(jsonMatch[0]);
        const fullScript = `${parsed.hook}\n\n${parsed.story}\n\n${parsed.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n${parsed.cta}`;
        return {
            hook: parsed.hook,
            story: parsed.story,
            tips: parsed.tips,
            cta: parsed.cta,
            fullScript,
            estimatedDuration: 60,
            hashtags: parsed.hashtags || generateDefaultHashtags(platform, niche),
        };
    }
    catch (error) {
        console.error("[Shorts Generator] Error:", error);
        // Return mock on error
        return generateMockScript(topic, platform, niche, tone);
    }
}
function generateMockScript(topic, platform, niche, tone) {
    const hook = `🛑 STOP scrolling! Here's what nobody tells you about ${topic}...`;
    const story = `I used to struggle with ${topic.toLowerCase()} just like you. Then I discovered these 3 game-changing tips that completely transformed my approach.`;
    const tips = [
        `First, start with the end in mind. Know exactly what outcome you want from ${topic.toLowerCase()}.`,
        `Second, focus on consistency over perfection. Small daily actions beat occasional big efforts.`,
        `Third, find an accountability partner. You're 65% more likely to succeed with support.`
    ];
    const cta = `Follow for more ${niche || topic.toLowerCase()} tips! Drop a 🔥 if this helped! Save this for later and share with someone who needs it.`;
    const fullScript = `${hook}\n\n${story}\n\n1. ${tips[0]}\n2. ${tips[1]}\n3. ${tips[2]}\n\n${cta}`;
    const hashtags = generateDefaultHashtags(platform, niche);
    return {
        hook,
        story,
        tips,
        cta,
        fullScript,
        estimatedDuration: 60,
        hashtags,
    };
}
function generateDefaultHashtags(platform, niche) {
    const baseHashtags = ['#viral', '#fyp', '#tips', '#motivation'];
    if (platform === 'tiktok') {
        baseHashtags.push('#tiktok', '#foryou', '#trending');
    }
    else if (platform === 'reels') {
        baseHashtags.push('#reels', '#instagram', '#explore');
    }
    else {
        baseHashtags.push('#shorts', '#youtube', '#subscribe');
    }
    if (niche) {
        baseHashtags.push(`#${niche.toLowerCase().replace(/\s+/g, '')}`);
    }
    return baseHashtags.slice(0, 7);
}
