import { prisma } from '@contentos/db';
import { generateAuthorityImage } from '@contentos/ai';
export async function authorityImageProcessor(job) {
    const { workspaceId, text, author, backgroundColor, textColor, accentColor, style = 'minimal' } = job.data;
    console.log(`[AUTHORITY-IMAGE] Generating for workspace ${workspaceId}`);
    try {
        // 1. Check entitlement
        const entitlement = await prisma.workspaceModule.findUnique({
            where: {
                workspaceId_moduleKey: {
                    workspaceId,
                    moduleKey: 'module.authority_image'
                }
            }
        });
        if (!entitlement?.enabled) {
            throw new Error('Authority Image module not enabled for this workspace');
        }
        // 2. Generate the image (no external API needed)
        const options = {
            text,
            author,
            backgroundColor,
            textColor,
            accentColor,
            style,
        };
        const result = await generateAuthorityImage(options);
        // 3. Save as Asset
        const asset = await prisma.asset.create({
            data: {
                workspaceId,
                storagePath: `authority-image-${Date.now()}.svg`,
                publicUrl: result.dataUrl,
                type: 'IMAGE',
                prompt: text,
                provider: 'authority-image-generator',
            }
        });
        console.log(`[AUTHORITY-IMAGE] Created asset ${asset.id}`);
        return {
            success: true,
            assetId: asset.id,
            dataUrl: result.dataUrl,
            width: result.width,
            height: result.height,
        };
    }
    catch (error) {
        console.error('[AUTHORITY-IMAGE] Error:', error);
        throw error;
    }
}
