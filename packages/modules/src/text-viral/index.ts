/**
 * Viral Text Generator Module
 * 
 * Self-contained module for generating viral text posts.
 */

import { ModuleDefinition, ModuleConfig, ModuleContext } from '../types';

export const config: ModuleConfig = {
    key: 'module.text_viral',
    name: 'Viral Text Generator',
    description: 'Generate optimized posts for LinkedIn, X, and Facebook.',
    price: 2900, // $29.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '✍️',
    active: true,
};

export interface TextViralInput {
    prompt: string;
    platform: 'linkedin' | 'twitter' | 'facebook';
}

export interface TextViralOutput {
    success: boolean;
    posts: string[];
}

const textViralModule: ModuleDefinition<TextViralInput, TextViralOutput> = {
    config,
    processor: {
        async process(input: TextViralInput, context: ModuleContext): Promise<TextViralOutput> {
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
