import { NextRequest } from "next/server"
import { grantEntitlement } from "@/lib/modules"

// Stub for MVP - in prod use Paddle SDK verifier
export async function POST(req: NextRequest) {
    const signature = req.headers.get("Paddle-Signature")
    if (process.env.NODE_ENV === "production" && !signature) {
        return new Response("Missing signature", { status: 401 })
    }

    const body = await req.json()

    // Handle transaction.completed
    if (body.event_type === "transaction.completed") {
        const { custom_data } = body.data
        const { workspaceId, moduleKey } = custom_data || {}

        if (workspaceId && moduleKey) {
            await grantEntitlement(workspaceId, moduleKey)
            return new Response("OK")
        }
    }

    // Handle dev/mock event
    if (body.event_type === "dev.grant") {
        const { workspaceId, moduleKey } = body.data
        await grantEntitlement(workspaceId, moduleKey)
        return new Response("Granted (Dev)")
    }

    return new Response("Ignored")
}
