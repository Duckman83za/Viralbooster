import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@contentos/db';

// GET /api/settings/api-keys - Get user's API keys (masked)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { apiKeys: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return keys with masked values
        const maskedKeys = user.apiKeys.map(key => ({
            id: key.id,
            provider: key.provider,
            label: key.label,
            // Show only last 4 chars
            maskedKey: key.apiKey ? `****${key.apiKey.slice(-4)}` : null,
            createdAt: key.createdAt,
        }));

        return NextResponse.json({ apiKeys: maskedKeys });

    } catch (error) {
        console.error('[API] Get API keys error:', error);
        return NextResponse.json({ error: 'Failed to get API keys' }, { status: 500 });
    }
}

// POST /api/settings/api-keys - Add or update an API key
export async function POST(req: NextRequest) {
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
        const { provider, apiKey, label } = body;

        if (!provider || !apiKey) {
            return NextResponse.json({ error: 'Provider and API key are required' }, { status: 400 });
        }

        // Valid providers
        const validProviders = ['gemini', 'openai', 'anthropic'];
        if (!validProviders.includes(provider)) {
            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        // Upsert the API key
        const savedKey = await prisma.userApiKey.upsert({
            where: {
                userId_provider: {
                    userId: user.id,
                    provider,
                }
            },
            create: {
                userId: user.id,
                provider,
                apiKey, // In production, encrypt this!
                label: label || provider,
            },
            update: {
                apiKey,
                label: label || provider,
            }
        });

        return NextResponse.json({
            success: true,
            id: savedKey.id,
            provider: savedKey.provider,
            maskedKey: `****${apiKey.slice(-4)}`,
        });

    } catch (error) {
        console.error('[API] Save API key error:', error);
        return NextResponse.json({ error: 'Failed to save API key' }, { status: 500 });
    }
}

// DELETE /api/settings/api-keys - Delete an API key
export async function DELETE(req: NextRequest) {
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
        const provider = searchParams.get('provider');

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        await prisma.userApiKey.delete({
            where: {
                userId_provider: {
                    userId: user.id,
                    provider,
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[API] Delete API key error:', error);
        return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }
}
