/**
 * Viral Text Generator Module
 *
 * Self-contained module for generating viral text posts.
 */
export const config = {
    key: 'module.text_viral',
    name: 'Viral Text Generator',
    description: 'Generate optimized posts for LinkedIn, X, and Facebook.',
    price: 2900, // $29.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '✍️',
    active: true,
};
const textViralModule = {
    config,
    processor: {
        async process(input, context) {
            const { generateViralText } = await import('@contentos/ai');
            const apiKey = context.apiKeys['gemini'] || 'mock-key';
            const posts = await generateViralText(input.prompt, apiKey);
            return {
                success: true,
                posts,
            };
        }
    }
};
export default textViralModule;
