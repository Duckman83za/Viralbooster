import { prisma } from '@contentos/db';
import { MockConnector } from '@contentos/connectors';
export async function publishProcessor(job) {
    const { postId } = job.data;
    console.log(`[PUBLISH] Publishing post ${postId}`);
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { workspace: true } });
    if (!post)
        throw new Error("Post not found");
    // Get Connector
    // const connector = getConnector(post.platform); // Factory
    const connector = new MockConnector();
    const result = await connector.publishText({ id: post.id, content: post.content }, { data: "mock-encrypted", iv: "mock-iv" });
    if (result.success) {
        await prisma.post.update({
            where: { id: postId },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });
    }
    else {
        await prisma.post.update({
            where: { id: postId },
            data: {
                status: 'FAILED',
                failedAt: new Date(),
                errorReason: result.error
            }
        });
        throw new Error(result.error);
    }
    return result;
}
