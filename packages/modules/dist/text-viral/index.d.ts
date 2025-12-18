/**
 * Viral Text Generator Module
 *
 * Self-contained module for generating viral text posts.
 */
import { ModuleDefinition, ModuleConfig } from '../types';
export declare const config: ModuleConfig;
export interface TextViralInput {
    prompt: string;
    platform: 'linkedin' | 'twitter' | 'facebook';
}
export interface TextViralOutput {
    success: boolean;
    posts: string[];
}
declare const textViralModule: ModuleDefinition<TextViralInput, TextViralOutput>;
export default textViralModule;
