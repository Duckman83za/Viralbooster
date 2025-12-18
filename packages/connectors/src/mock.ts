import { SocialConnector, Post, EncryptedCreds, ConnectorResult, AccountInfo } from "./types";

export class MockConnector implements SocialConnector {
    async validateConnection(creds: EncryptedCreds): Promise<boolean> {
        console.log("[MockConnector] Validating connection...", creds);
        return true;
    }

    async publishText(post: Post, creds: EncryptedCreds): Promise<ConnectorResult> {
        console.log("[MockConnector] Publishing TEXT:", post.content);
        return { success: true, platformId: `mock-text-${Date.now()}` };
    }

    async publishImage(post: Post, imageUrl: string, creds: EncryptedCreds): Promise<ConnectorResult> {
        console.log("[MockConnector] Publishing IMAGE:", imageUrl, post.content);
        return { success: true, platformId: `mock-image-${Date.now()}` };
    }

    async getAccountInfo(creds: EncryptedCreds): Promise<AccountInfo> {
        return {
            id: "mock-user-123",
            name: "Mock User",
            avatarUrl: "https://via.placeholder.com/150"
        };
    }
}
