import { prisma } from "@contentos/db"

interface AIConfig {
    provider: string;
    model: string;
    apiKey: string | null;
}

/**
 * Get user's AI configuration for a specific module
 * Retrieves the saved API key and model settings from user preferences
 */
export async function getUserAIConfig(
    userId: string,
    moduleKey: string
): Promise<AIConfig> {
    // 1. Get module settings (provider + model selection)
    const moduleSettings = await prisma.userModuleSettings.findUnique({
        where: {
            userId_moduleKey: {
                userId,
                moduleKey,
            }
        }
    });

    const settings = (moduleSettings?.settings as Record<string, string>) || {};
    const provider = settings.aiProvider || 'gemini';
    const model = settings.aiModel || getDefaultModel(provider);

    // 2. Get the API key for this module+provider combination
    // First try module-specific key
    let apiKeyRecord = await prisma.userApiKey.findUnique({
        where: {
            userId_provider: {
                userId,
                provider: `${provider}_${moduleKey}`,
            }
        }
    });

    // If no module-specific key, try provider-level key (fallback)
    if (!apiKeyRecord) {
        apiKeyRecord = await prisma.userApiKey.findUnique({
            where: {
                userId_provider: {
                    userId,
                    provider,
                }
            }
        });
    }

    return {
        provider,
        model,
        apiKey: apiKeyRecord?.apiKey || null,
    };
}

/**
 * Get user's API key for any provider (not module-specific)
 */
export async function getUserApiKey(
    userId: string,
    provider: string
): Promise<string | null> {
    const record = await prisma.userApiKey.findUnique({
        where: {
            userId_provider: {
                userId,
                provider,
            }
        }
    });
    return record?.apiKey || null;
}

function getDefaultModel(provider: string): string {
    const defaults: Record<string, string> = {
        gemini: 'gemini-1.5-flash',
        openai: 'gpt-4o-mini',
        anthropic: 'claude-3-5-sonnet-20241022',
    };
    return defaults[provider] || 'gemini-1.5-flash';
}
