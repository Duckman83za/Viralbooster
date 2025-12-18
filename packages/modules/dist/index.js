/**
 * Modules Package - Central Registry
 *
 * This is the main entry point for all modules.
 * Each module is self-contained and can be imported independently.
 */
export * from './types';
// Import all module configs for registry
import urlScannerModule from './url-scanner';
import textViralModule from './text-viral';
import imageViralModule from './image-viral';
import authorityImageModule from './authority-image';
import shortsGeneratorModule from './shorts-generator';
// Registry of all available modules
// Using 'any' for the array since each module has different input/output types
// Individual modules should be imported directly for type-safe usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALL_MODULES = [
    textViralModule,
    imageViralModule,
    authorityImageModule,
    shortsGeneratorModule,
    urlScannerModule,
];
// Get all active module configs
export function getActiveModuleConfigs() {
    return ALL_MODULES
        .filter(m => m.config.active)
        .map(m => m.config);
}
// Get a specific module by key
export function getModule(key) {
    return ALL_MODULES.find(m => m.config.key === key);
}
// Get module config by key
export function getModuleConfig(key) {
    return getModule(key)?.config;
}
// Check if a module is active
export function isModuleActive(key) {
    return getModule(key)?.config.active ?? false;
}
// Re-export individual modules for tree-shaking
export { default as urlScannerModule } from './url-scanner';
export { default as textViralModule } from './text-viral';
export { default as imageViralModule } from './image-viral';
export { default as authorityImageModule } from './authority-image';
export { default as shortsGeneratorModule } from './shorts-generator';
