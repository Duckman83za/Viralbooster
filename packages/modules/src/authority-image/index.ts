/**
 * Authority Image Generator Module
 * 
 * Self-contained module for generating branded 1080x1350 authority images.
 * Creates professional quote/insight images for social media.
 */

import { ModuleDefinition, ModuleConfig, ModuleContext } from '../types';

export const config: ModuleConfig = {
    key: 'module.authority_image',
    name: 'Authority Image Generator',
    description: 'Create branded 1080x1350 quote images for Instagram, Pinterest & Facebook.',
    price: 4900, // $49.00
    requiredApiKeys: [], // No external API needed - uses SVG templates
    category: 'generation',
    icon: '🖼️',
    active: true,
};

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

const authorityImageModule: ModuleDefinition<AuthorityImageInput, AuthorityImageOutput> = {
    config,
    processor: {
        async process(input: AuthorityImageInput, _context: ModuleContext): Promise<AuthorityImageOutput> {
            const { generateAuthorityImage } = await import('@contentos/ai');

            const result = await generateAuthorityImage({
                text: input.text,
                author: input.author,
                backgroundColor: input.backgroundColor,
                textColor: input.textColor,
                accentColor: input.accentColor,
                style: input.style,
            });

            return {
                success: true,
                svg: result.svg,
                dataUrl: result.dataUrl,
                width: result.width,
                height: result.height,
            };
        }
    }
};

export default authorityImageModule;
