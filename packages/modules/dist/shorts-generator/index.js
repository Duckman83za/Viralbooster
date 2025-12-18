/**
 * Viral Shorts Generator Module
 *
 * Self-contained module for generating 60-second video scripts
 * for TikTok, Instagram Reels, and YouTube Shorts.
 */
export const config = {
    key: 'module.shorts_generator',
    name: 'Viral Shorts Script Generator',
    description: 'Create 60-second video scripts for TikTok, Reels & YouTube Shorts.',
    price: 2900, // $29.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '🎬',
    active: true,
};
const shortsGeneratorModule = {
    config,
    processor: {
        async process(input, context) {
            const { generateShortsScript } = await import('@contentos/ai');
            const apiKey = context.apiKeys['gemini'] || 'mock-key';
            const script = await generateShortsScript({
                topic: input.topic,
                platform: input.platform,
                niche: input.niche,
                tone: input.tone,
            }, apiKey);
            return {
                success: true,
                hook: script.hook,
                story: script.story,
                tips: script.tips,
                cta: script.cta,
                fullScript: script.fullScript,
                estimatedDuration: script.estimatedDuration,
                hashtags: script.hashtags,
            };
        }
    }
};
export default shortsGeneratorModule;
