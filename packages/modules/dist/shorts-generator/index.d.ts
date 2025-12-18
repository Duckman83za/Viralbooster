/**
 * Viral Shorts Generator Module
 *
 * Self-contained module for generating 60-second video scripts
 * for TikTok, Instagram Reels, and YouTube Shorts.
 */
import { ModuleDefinition, ModuleConfig } from '../types';
export declare const config: ModuleConfig;
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
declare const shortsGeneratorModule: ModuleDefinition<ShortsGeneratorInput, ShortsGeneratorOutput>;
export default shortsGeneratorModule;
