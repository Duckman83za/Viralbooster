import { getCurrentWorkspace } from "@/lib/workspace"
import { getWorkspaceModules } from "@/lib/modules"
import { ModuleMarketplace } from "@/components/modules/module-marketplace"
import { redirect } from "next/navigation"

export default async function ModulesPage() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        // Handle onboarding or error
        return <div>No workspace found</div>
    }

    const currentModules = await getWorkspaceModules(workspace.id)

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Module Marketplace</h1>
                    <p className="mt-1 text-sm text-gray-700 dark:text-zinc-400">
                        Expand your ContentOS capabilities with premium modules.
                    </p>
                </div>
            </div>
            <div className="mt-8">
                <ModuleMarketplace
                    currentModules={currentModules}
                    workspaceId={workspace.id}
                />
            </div>
        </div>
    )
}
