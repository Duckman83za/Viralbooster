/**
 * Modules Package - Central Registry
 *
 * This is the main entry point for all modules.
 * Each module is self-contained and can be imported independently.
 */
export * from './types';
import type { ModuleConfig, ModuleDefinition } from './types';
export declare const ALL_MODULES: ModuleDefinition<any, any>[];
export declare function getActiveModuleConfigs(): ModuleConfig[];
export declare function getModule(key: string): ModuleDefinition | undefined;
export declare function getModuleConfig(key: string): ModuleConfig | undefined;
export declare function isModuleActive(key: string): boolean;
export { default as urlScannerModule } from './url-scanner';
export { default as textViralModule } from './text-viral';
export { default as imageViralModule } from './image-viral';
export { default as authorityImageModule } from './authority-image';
export { default as shortsGeneratorModule } from './shorts-generator';
