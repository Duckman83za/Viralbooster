/**
 * Authority Image Generator
 *
 * Generates branded 1080x1350px images with text overlays
 * Perfect for Instagram, Pinterest, and Facebook posts.
 */
export declare function generateViralImage(prompt: string, apiKey: string): Promise<string>;
/**
 * Authority Image Options
 */
export interface AuthorityImageOptions {
    /** Main text content (quote, tip, insight) */
    text: string;
    /** Optional author/attribution */
    author?: string;
    /** Background color (hex) */
    backgroundColor?: string;
    /** Text color (hex) */
    textColor?: string;
    /** Accent color for decorative elements (hex) */
    accentColor?: string;
    /** Image style template */
    style?: 'minimal' | 'bold' | 'gradient' | 'quote';
    /** Optional logo URL */
    logoUrl?: string;
}
export interface AuthorityImageResult {
    /** SVG string that can be rendered or converted */
    svg: string;
    /** Data URL for direct use */
    dataUrl: string;
    /** Dimensions */
    width: number;
    height: number;
}
/**
 * Generate an Authority Image using SVG templates
 *
 * For MVP, we generate SVG which can be displayed directly or converted to PNG.
 * This approach works without external API calls and produces crisp results.
 */
export declare function generateAuthorityImage(options: AuthorityImageOptions): Promise<AuthorityImageResult>;
