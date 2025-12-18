export class MockConnector {
    async validateConnection(creds) {
        console.log("[MockConnector] Validating connection...", creds);
        return true;
    }
    async publishText(post, creds) {
        console.log("[MockConnector] Publishing TEXT:", post.content);
        return { success: true, platformId: `mock-text-${Date.now()}` };
    }
    async publishImage(post, imageUrl, creds) {
        console.log("[MockConnector] Publishing IMAGE:", imageUrl, post.content);
        return { success: true, platformId: `mock-image-${Date.now()}` };
    }
    async getAccountInfo(creds) {
        return {
            id: "mock-user-123",
            name: "Mock User",
            avatarUrl: "https://via.placeholder.com/150"
        };
    }
}
