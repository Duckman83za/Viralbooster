/**
 * URL Content Scanner Module
 *
 * Self-contained module that can work independently.
 * Repurposes articles and web content into viral social posts.
 */
import { ModuleDefinition, ModuleConfig } from '../types';
export declare const config: ModuleConfig;
export interface UrlScannerInput {
    url: string;
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram';
    postCount: 3 | 5 | 10 | 15;
}
export interface UrlScannerOutput {
    success: boolean;
    posts: string[];
    title: string;
    sourceUrl: string;
}
declare const urlScannerModule: ModuleDefinition<UrlScannerInput, UrlScannerOutput>;
export default urlScannerModule;
