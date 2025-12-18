/**
 * Authority Image Generator Module
 *
 * Self-contained module for generating branded 1080x1350 authority images.
 * Creates professional quote/insight images for social media.
 */
export const config = {
    key: 'module.authority_image',
    name: 'Authority Image Generator',
    description: 'Create branded 1080x1350 quote images for Instagram, Pinterest & Facebook.',
    price: 4900, // $49.00
    requiredApiKeys: [], // No external API needed - uses SVG templates
    category: 'generation',
    icon: '🖼️',
    active: true,
};
const authorityImageModule = {
    config,
    processor: {
        async process(input, _context) {
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
