/**
 * Viral Image Generator Module
 *
 * Self-contained module for generating viral images.
 */
import { ModuleDefinition, ModuleConfig } from '../types';
export declare const config: ModuleConfig;
export interface ImageViralInput {
    prompt: string;
    style?: string;
}
export interface ImageViralOutput {
    success: boolean;
    imageUrl: string;
}
declare const imageViralModule: ModuleDefinition<ImageViralInput, ImageViralOutput>;
export default imageViralModule;
