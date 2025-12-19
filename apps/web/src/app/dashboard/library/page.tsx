import { getCurrentWorkspace } from "@/lib/workspace"
import { redirect } from "next/navigation"
import { LibraryClient } from "./client"

export default async function LibraryPage() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        redirect('/auth/login')
    }

    return <LibraryClient workspaceId={workspace.id} />
}
