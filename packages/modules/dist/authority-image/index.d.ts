/**
 * Authority Image Generator Module
 *
 * Self-contained module for generating branded 1080x1350 authority images.
 * Creates professional quote/insight images for social media.
 */
import { ModuleDefinition, ModuleConfig } from '../types';
export declare const config: ModuleConfig;
export type ImageStyle = 'minimal' | 'bold' | 'gradient' | 'quote';
export interface AuthorityImageInput {
    /** Main text/quote to display */
    text: string;
    /** Optional author/attribution */
    author?: string;
    /** Background color (hex) */
    backgroundColor?: string;
    /** Text color (hex) */
    textColor?: string;
    /** Accent color (hex) */
    accentColor?: string;
    /** Image style */
    style?: ImageStyle;
}
export interface AuthorityImageOutput {
    success: boolean;
    /** SVG string */
    svg: string;
    /** Data URL for direct display */
    dataUrl: string;
    /** Image dimensions */
    width: number;
    height: number;
}
declare const authorityImageModule: ModuleDefinition<AuthorityImageInput, AuthorityImageOutput>;
export default authorityImageModule;
