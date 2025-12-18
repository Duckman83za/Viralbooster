import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';

// GET /api/settings/modules?key=module.xxx - Get module settings
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const moduleKey = searchParams.get('key');

        if (moduleKey) {
            // Get specific module settings
            const settings = await prisma.userModuleSettings.findUnique({
                where: {
                    userId_moduleKey: {
                        userId: user.id,
                        moduleKey,
                    }
                }
            });

            return NextResponse.json({
                settings: settings?.settings || getDefaultSettings(moduleKey)
            });
        }

        // Get all module settings
        const allSettings = await prisma.userModuleSettings.findMany({
            where: { userId: user.id }
        });

        return NextResponse.json({ settings: allSettings });

    } catch (error) {
        console.error('[API] Get module settings error:', error);
        return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
    }
}

// PATCH /api/settings/modules - Update module settings
export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { moduleKey, settings } = body;

        if (!moduleKey) {
            return NextResponse.json({ error: 'Module key is required' }, { status: 400 });
        }

        const saved = await prisma.userModuleSettings.upsert({
            where: {
                userId_moduleKey: {
                    userId: user.id,
                    moduleKey,
                }
            },
            create: {
                userId: user.id,
                moduleKey,
                settings: settings || {},
            },
            update: {
                settings: settings || {},
            }
        });

        return NextResponse.json({ success: true, settings: saved.settings });

    } catch (error) {
        console.error('[API] Update module settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

// Default settings per module
function getDefaultSettings(moduleKey: string): Record<string, unknown> {
    const defaults: Record<string, Record<string, unknown>> = {
        'module.text_viral': {
            defaultPlatform: 'linkedin',
            defaultTone: 'professional',
            autoSaveDrafts: true,
        },
        'module.url_scanner': {
            defaultPostCount: 5,
            defaultPlatforms: ['linkedin', 'twitter'],
            includeHashtags: true,
        },
        'module.authority_image': {
            defaultStyle: 'minimal',
            defaultBackgroundColor: '#1a1a2e',
            defaultTextColor: '#ffffff',
            defaultAccentColor: '#f59e0b',
        },
        'module.shorts_generator': {
            defaultPlatform: 'tiktok',
            defaultTone: 'educational',
            includeHashtags: true,
        },
    };

    return defaults[moduleKey] || {};
}
