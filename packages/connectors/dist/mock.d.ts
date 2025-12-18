import { SocialConnector, Post, EncryptedCreds, ConnectorResult, AccountInfo } from "./types";
export declare class MockConnector implements SocialConnector {
    validateConnection(creds: EncryptedCreds): Promise<boolean>;
    publishText(post: Post, creds: EncryptedCreds): Promise<ConnectorResult>;
    publishImage(post: Post, imageUrl: string, creds: EncryptedCreds): Promise<ConnectorResult>;
    getAccountInfo(creds: EncryptedCreds): Promise<AccountInfo>;
}
