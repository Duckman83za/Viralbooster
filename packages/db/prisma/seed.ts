import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const email = 'demo@contentos.dev'

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Demo User',
        },
    })

    // 2. Create Workspace
    const workspace = await prisma.workspace.create({
        data: {
            name: "Viral Launchpad",
            slug: "viral-launchpad",
            users: {
                create: {
                    userId: user.id,
                    role: 'OWNER'
                }
            }
        }
    })

    // 3. Create Modules
    const viralText = await prisma.module.upsert({
        where: { key: 'module.text_viral' },
        update: {},
        create: {
            key: 'module.text_viral',
            name: 'Viral Text Generator',
            description: 'Generate optimized posts for LinkedIn, X, and Facebook.',
            price: 2900,
        }
    })

    // 4. Grant Entitlement
    await prisma.workspaceModule.create({
        data: {
            workspaceId: workspace.id,
            moduleKey: viralText.key,
            enabled: true,
            purchasedAt: new Date()
        }
    })

    // 5. Create Mock Integration
    await prisma.integration.create({
        data: {
            workspaceId: workspace.id,
            platform: 'linkedin',
            credentials: JSON.stringify({ data: 'mock', iv: 'mock' }),
            status: 'ACTIVE'
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
