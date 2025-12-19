import { getCurrentWorkspace } from "@/lib/workspace"
import { redirect } from "next/navigation"
import { CalendarClient } from "./client"

export default async function CalendarPage() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        redirect('/auth/login')
    }

    return <CalendarClient workspaceId={workspace.id} />
}
