import { prisma } from "@contentos/db"

export const AVAILABLE_MODULES = [
    {
        key: "module.text_viral",
        name: "Viral Text Generator",
        description: "Generate optimized posts for LinkedIn, X, and Facebook.",
        price: 2900, // $29.00
    },
    {
        key: "module.image_viral_nanobanana_pro",
        name: "Viral Image Generator (Nano Banana Pro)",
        description: "Create stunning visuals using Gemini Nano Banana Pro.",
        price: 4900, // $49.00
    },
    {
        key: "module.url_scanner",
        name: "URL Content Scanner",
        description: "Repurpose articles and web pages into viral social posts.",
        price: 3900, // $39.00
    },
]

export async function getWorkspaceModules(workspaceId: string) {
    return prisma.workspaceModule.findMany({
        where: { workspaceId },
        include: { module: true }
    })
}

export async function checkEntitlement(workspaceId: string, moduleKey: string) {
    const record = await prisma.workspaceModule.findUnique({
        where: {
            workspaceId_moduleKey: {
                workspaceId,
                moduleKey
            }
        }
    })
    return record?.enabled ?? false
}

export async function grantEntitlement(workspaceId: string, moduleKey: string) {
    // Ensure module exists first (idempotent seed or check)
    // We'll rely on seed or dynamic creation
    const mod = AVAILABLE_MODULES.find(m => m.key === moduleKey)
    if (!mod) throw new Error("Invalid module key")

    // Upsert Module definition
    await prisma.module.upsert({
        where: { key: moduleKey },
        create: {
            key: moduleKey,
            name: mod.name,
            description: mod.description,
            price: mod.price,
        },
        update: {}
    })

    return prisma.workspaceModule.upsert({
        where: {
            workspaceId_moduleKey: {
                workspaceId,
                moduleKey
            }
        },
        create: {
            workspaceId,
            moduleKey,
            enabled: true,
            purchasedAt: new Date()
        },
        update: {
            enabled: true
        }
    })
}
