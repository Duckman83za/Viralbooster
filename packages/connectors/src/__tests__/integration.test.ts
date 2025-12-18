import { describe, it, expect } from 'vitest';
import { MockConnector } from '../mock';

describe('Mock Connector', () => {
    it('should return success on publish', async () => {
        const connector = new MockConnector();
        const result = await connector.publishText(
            { id: '1', content: 'hello' },
            { data: 'enc', iv: 'iv' }
        );
        expect(result.success).toBe(true);
        expect(result.platformId).toBeDefined();
    });
});
