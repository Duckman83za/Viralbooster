export interface Post {
    id: string;
    content: string | null;
    assetUrl?: string | null;
}
export interface EncryptedCreds {
    data: string;
    iv: string;
}
export interface ConnectorResult {
    success: boolean;
    platformId?: string;
    error?: string;
}
export interface AccountInfo {
    id: string;
    name: string;
    avatarUrl?: string;
}
export interface SocialConnector {
    validateConnection(creds: EncryptedCreds): Promise<boolean>;
    publishText(post: Post, creds: EncryptedCreds): Promise<ConnectorResult>;
    publishImage(post: Post, imageUrl: string, creds: EncryptedCreds): Promise<ConnectorResult>;
    getAccountInfo(creds: EncryptedCreds): Promise<AccountInfo>;
}
