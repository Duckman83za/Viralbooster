/**
 * Viral Image Generator Module
 * 
 * Self-contained module for generating viral images.
 */

import { ModuleDefinition, ModuleConfig, ModuleContext } from '../types';

export const config: ModuleConfig = {
    key: 'module.image_viral_nanobanana_pro',
    name: 'Viral Image Generator (Nano Banana Pro)',
    description: 'Create stunning visuals using Gemini Nano Banana Pro.',
    price: 4900, // $49.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '🖼️',
    active: true,
};

export interface ImageViralInput {
    prompt: string;
    style?: string;
}

export interface ImageViralOutput {
    success: boolean;
    imageUrl: string;
}

const imageViralModule: ModuleDefinition<ImageViralInput, ImageViralOutput> = {
    config,
    processor: {
        async process(input: ImageViralInput, context: ModuleContext): Promise<ImageViralOutput> {
            const { generateViralImage } = await import('@contentos/ai');

            const apiKey = context.apiKeys['gemini'] || 'mock-key';
            const imageUrl = await generateViralImage(input.prompt, apiKey);

            return {
                success: true,
                imageUrl,
            };
        }
    }
};

export default imageViralModule;
