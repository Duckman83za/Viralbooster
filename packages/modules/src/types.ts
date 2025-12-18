/**
 * Module Configuration Types
 * Each module is self-contained with its own config, making it truly independent.
 */

export interface ModuleConfig {
    /** Unique module key (e.g., "module.url_scanner") */
    key: string;

    /** Display name */
    name: string;

    /** Short description */
    description: string;

    /** Price in cents (one-time purchase) */
    price: number;

    /** Required API keys (e.g., ["gemini", "openai"]) */
    requiredApiKeys?: string[];

    /** Category for organization */
    category: 'generation' | 'publishing' | 'analytics' | 'automation';

    /** Icon/emoji for display */
    icon?: string;

    /** Whether the module is currently active/available */
    active: boolean;
}

export interface ModuleProcessor<TInput = unknown, TOutput = unknown> {
    /** Process the module's main function */
    process: (input: TInput, context: ModuleContext) => Promise<TOutput>;
}

export interface ModuleContext {
    workspaceId: string;
    userId: string;
    apiKeys: Record<string, string>;
}

/**
 * Complete module definition - each module exports this
 */
export interface ModuleDefinition<TInput = unknown, TOutput = unknown> {
    config: ModuleConfig;
    processor?: ModuleProcessor<TInput, TOutput>;
}
