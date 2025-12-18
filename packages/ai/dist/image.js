/**
 * Authority Image Generator
 *
 * Generates branded 1080x1350px images with text overlays
 * Perfect for Instagram, Pinterest, and Facebook posts.
 */
// Simple image generation (returns placeholder for MVP)
export async function generateViralImage(prompt, apiKey) {
    // Stub for Gemini Nano Banana Pro / Imagen
    // In a real app, this would call the appropriate endpoint (Vertex AI or Gemini Advanced)
    console.log("[AI] Mock generating image for:", prompt);
    // Return a placeholder that looks good
    // Using a deterministic random image from Unsplash for "Viral" vibe
    return `https://source.unsplash.com/random/1080x1080/?${encodeURIComponent(prompt.split(' ')[0] || 'business')}`;
}
/**
 * Generate an Authority Image using SVG templates
 *
 * For MVP, we generate SVG which can be displayed directly or converted to PNG.
 * This approach works without external API calls and produces crisp results.
 */
export async function generateAuthorityImage(options) {
    const { text, author = '', backgroundColor = '#1a1a2e', textColor = '#ffffff', accentColor = '#f59e0b', style = 'minimal', } = options;
    const width = 1080;
    const height = 1350;
    // Split text into lines for proper wrapping (approx 35 chars per line)
    const maxCharsPerLine = 32;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
            currentLine = (currentLine + ' ' + word).trim();
        }
        else {
            if (currentLine)
                lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine)
        lines.push(currentLine);
    // Generate SVG based on style
    const svg = generateStyledSvg(style, {
        width,
        height,
        lines,
        author,
        backgroundColor,
        textColor,
        accentColor,
    });
    // Create data URL
    const encodedSvg = encodeURIComponent(svg);
    const dataUrl = `data:image/svg+xml,${encodedSvg}`;
    return {
        svg,
        dataUrl,
        width,
        height,
    };
}
function generateStyledSvg(style, params) {
    const { width, height, lines, author, backgroundColor, textColor, accentColor } = params;
    // Calculate text positioning
    const fontSize = Math.min(56, Math.floor(width / (Math.max(...lines.map(l => l.length)) * 0.5)));
    const lineHeight = fontSize * 1.4;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize;
    // Escape XML special characters
    const escapeXml = (str) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    const textLines = lines.map((line, i) => `<text x="${width / 2}" y="${startY + (i * lineHeight)}" 
            font-family="'Inter', 'Segoe UI', sans-serif" 
            font-size="${fontSize}" 
            font-weight="600" 
            fill="${textColor}" 
            text-anchor="middle">${escapeXml(line)}</text>`).join('\n');
    const authorText = author ?
        `<text x="${width / 2}" y="${startY + (lines.length * lineHeight) + 60}" 
            font-family="'Inter', 'Segoe UI', sans-serif" 
            font-size="28" 
            fill="${accentColor}" 
            text-anchor="middle"
            font-weight="500">— ${escapeXml(author)}</text>` : '';
    switch (style) {
        case 'bold':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="${backgroundColor}"/>
                <rect x="40" y="40" width="${width - 80}" height="${height - 80}" 
                    fill="none" stroke="${accentColor}" stroke-width="4" rx="20"/>
                <rect x="80" y="80" width="${width - 160}" height="${height - 160}" 
                    fill="none" stroke="${accentColor}" stroke-width="2" rx="10" opacity="0.3"/>
                ${textLines}
                ${authorText}
            </svg>`;
        case 'gradient':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.3" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg)"/>
                <circle cx="${width}" cy="0" r="400" fill="${accentColor}" opacity="0.1"/>
                <circle cx="0" cy="${height}" r="300" fill="${accentColor}" opacity="0.08"/>
                ${textLines}
                ${authorText}
            </svg>`;
        case 'quote':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="${backgroundColor}"/>
                <text x="${width / 2 - 200}" y="${startY - 80}" 
                    font-family="Georgia, serif" 
                    font-size="200" 
                    fill="${accentColor}" 
                    opacity="0.3">"</text>
                <text x="${width / 2 + 200}" y="${startY + totalTextHeight + 40}" 
                    font-family="Georgia, serif" 
                    font-size="200" 
                    fill="${accentColor}" 
                    opacity="0.3">"</text>
                ${textLines}
                ${authorText}
            </svg>`;
        case 'minimal':
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="${backgroundColor}"/>
                <line x1="100" y1="${startY - 60}" x2="${width - 100}" y2="${startY - 60}" 
                    stroke="${accentColor}" stroke-width="2" opacity="0.5"/>
                <line x1="100" y1="${startY + totalTextHeight + 40}" x2="${width - 100}" y2="${startY + totalTextHeight + 40}" 
                    stroke="${accentColor}" stroke-width="2" opacity="0.5"/>
                ${textLines}
                ${authorText}
            </svg>`;
    }
}
