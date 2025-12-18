import { prisma } from "@contentos/db"
import { auth } from "@/lib/auth"

export async function getCurrentWorkspace() {
    const session = await auth()
    if (!session?.user?.email) return null

    // Find user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { workspaces: { include: { workspace: true } } }
    })

    if (!user) {
        // Should be created on auth callback, but specific logic here
        return null
    }

    // Return first workspace or default
    if (user.workspaces.length === 0) {
        // Create default workspace
        const ws = await prisma.workspace.create({
            data: {
                name: "My Workspace",
                slug: `ws-${Date.now()}`,
                users: {
                    create: {
                        userId: user.id,
                        role: "OWNER"
                    }
                }
            }
        })
        return ws
    }

    return user.workspaces[0].workspace
}
