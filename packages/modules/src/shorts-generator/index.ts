/**
 * Viral Shorts Generator Module
 * 
 * Self-contained module for generating 60-second video scripts
 * for TikTok, Instagram Reels, and YouTube Shorts.
 */

import { ModuleDefinition, ModuleConfig, ModuleContext } from '../types';

export const config: ModuleConfig = {
    key: 'module.shorts_generator',
    name: 'Viral Shorts Script Generator',
    description: 'Create 60-second video scripts for TikTok, Reels & YouTube Shorts.',
    price: 2900, // $29.00
    requiredApiKeys: ['gemini'],
    category: 'generation',
    icon: '🎬',
    active: true,
};

export type Platform = 'tiktok' | 'reels' | 'youtube_shorts';
export type Tone = 'educational' | 'entertaining' | 'motivational' | 'storytelling';

export interface ShortsGeneratorInput {
    topic: string;
    platform: Platform;
    niche?: string;
    tone?: Tone;
}

export interface ShortsGeneratorOutput {
    success: boolean;
    hook: string;
    story: string;
    tips: [string, string, string];
    cta: string;
    fullScript: string;
    estimatedDuration: number;
    hashtags: string[];
}

const shortsGeneratorModule: ModuleDefinition<ShortsGeneratorInput, ShortsGeneratorOutput> = {
    config,
    processor: {
        async process(input: ShortsGeneratorInput, context: ModuleContext): Promise<ShortsGeneratorOutput> {
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
