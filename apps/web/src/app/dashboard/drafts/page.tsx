import { getCurrentWorkspace } from "@/lib/workspace"
import { redirect } from "next/navigation"
import { DraftsClient } from "./client"

export default async function DraftsPage() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        redirect('/auth/login')
    }

    return <DraftsClient workspaceId={workspace.id} />
}
