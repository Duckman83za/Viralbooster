import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enableAllModules() {
    console.log('Enabling all modules...')

    // Find the workspace
    const workspace = await prisma.workspace.findFirst()
    if (!workspace) {
        console.log('No workspace found. Run seed first.')
        return
    }

    console.log(`Found workspace: ${workspace.name} (${workspace.id})`)

    // Define all modules
    const modules = [
        { key: 'module.url_scanner', name: 'URL Content Scanner', price: 3900 },
        { key: 'module.authority_image', name: 'Authority Image Generator', price: 4900 },
        { key: 'module.shorts_generator', name: 'Viral Shorts Script Generator', price: 2900 },
    ]

    for (const mod of modules) {
        // Create or update module
        await prisma.module.upsert({
            where: { key: mod.key },
            update: {},
            create: {
                key: mod.key,
                name: mod.name,
                description: `${mod.name} module`,
                price: mod.price,
            }
        })

        // Grant entitlement
        await prisma.workspaceModule.upsert({
            where: {
                workspaceId_moduleKey: {
                    workspaceId: workspace.id,
                    moduleKey: mod.key,
                }
            },
            update: { enabled: true },
            create: {
                workspaceId: workspace.id,
                moduleKey: mod.key,
                enabled: true,
                purchasedAt: new Date(),
            }
        })

        console.log(`✅ Enabled: ${mod.name}`)
    }

    // Also add a Gemini integration for BYOK
    await prisma.integration.upsert({
        where: {
            workspaceId_platform: {
                workspaceId: workspace.id,
                platform: 'gemini',
            }
        },
        update: {},
        create: {
            workspaceId: workspace.id,
            platform: 'gemini',
            credentials: JSON.stringify({ apiKey: 'mock-key' }),
            status: 'ACTIVE',
        }
    })
    console.log('✅ Created Gemini integration (mock)')

    console.log('\n🎉 All modules enabled!')
    console.log('\nLogin with: demo@contentos.dev / password')
}

enableAllModules()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })
