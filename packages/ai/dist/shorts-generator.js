/**
 * Viral Shorts Script Generator
 *
 * Generates 60-second video scripts for TikTok, Instagram Reels, and YouTube Shorts
 * using the proven 4-part framework: Hook → Story → 3 Tips → CTA
 *
 * Supports: Gemini, OpenAI (GPT-4o, o1), and Anthropic Claude
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
const PLATFORM_NAMES = {
    tiktok: 'TikTok',
    reels: 'Instagram Reels',
    youtube_shorts: 'YouTube Shorts'
};
function buildPrompt(topic, platform, niche, tone) {
    return `You are a viral content expert specializing in short-form video scripts. Create a 60-second video script using this proven 4-part framework:

TOPIC: ${topic}
PLATFORM: ${PLATFORM_NAMES[platform]}
NICHE: ${niche || 'General'}
TONE: ${tone}

Generate a script with these exact sections:

1. HOOK (0-5 seconds): A scroll-stopping opening line that creates curiosity or shock value.

2. STORY (5-20 seconds): A brief personal story, relatable situation, or context that connects with the viewer emotionally.

3. TIPS (20-50 seconds): Exactly 3 actionable, specific tips or insights. Each tip should be 1-2 sentences max.

4. CTA (50-60 seconds): A strong call-to-action that encourages engagement (follow, like, comment, share).

Also provide 5-7 relevant hashtags for ${PLATFORM_NAMES[platform]}.

Format your response EXACTLY like this JSON (no markdown, just raw JSON):
{
    "hook": "Your hook text here",
    "story": "Your story text here",
    "tips": ["Tip 1", "Tip 2", "Tip 3"],
    "cta": "Your CTA text here",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}`;
}
function parseScriptResponse(text, platform, niche) {
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
/**
 * Generate a viral shorts script using the 4-part framework
 */
export async function generateShortsScript(options, apiKey) {
    const { topic, platform, niche = '', tone = 'educational', provider = 'gemini', model } = options;
    // Mock response for development
    if (!apiKey || apiKey === 'mock-key') {
        console.log("[AI] Mock generating shorts script for:", topic);
        return generateMockScript(topic, platform, niche, tone);
    }
    const prompt = buildPrompt(topic, platform, niche, tone);
    try {
        let responseText = '';
        if (provider === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const genModel = genAI.getGenerativeModel({ model: model || "gemini-1.5-flash" });
            const result = await genModel.generateContent(prompt);
            responseText = result.response.text().trim();
        }
        else if (provider === 'openai') {
            const openai = new OpenAI({ apiKey });
            const modelName = model || 'gpt-4o-mini';
            const isO1Model = modelName.startsWith('o1');
            const completion = await openai.chat.completions.create({
                model: modelName,
                messages: isO1Model ? [
                    { role: 'user', content: prompt }
                ] : [
                    { role: 'system', content: 'You are a viral content expert.' },
                    { role: 'user', content: prompt }
                ],
            });
            responseText = completion.choices[0]?.message?.content || '';
        }
        else if (provider === 'anthropic') {
            const anthropic = new Anthropic({ apiKey });
            const message = await anthropic.messages.create({
                model: model || 'claude-3-5-sonnet-latest',
                max_tokens: 2048,
                system: 'You are a viral content expert specializing in short-form video scripts.',
                messages: [
                    { role: 'user', content: prompt }
                ],
            });
            responseText = message.content
                .filter((block) => block.type === 'text')
                .map(block => block.text)
                .join('');
        }
        return parseScriptResponse(responseText, platform, niche);
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
    return {
        hook,
        story,
        tips,
        cta,
        fullScript,
        estimatedDuration: 60,
        hashtags: generateDefaultHashtags(platform, niche),
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
