import { getCurrentWorkspace } from "@/lib/workspace"
import { checkEntitlement } from "@/lib/modules"
import { TextGenerator } from "@/components/modules/text-generator"
import { redirect } from "next/navigation"

export default async function TextGeneratorPage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        redirect("/auth/login")
    }

    const hasAccess = await checkEntitlement(workspace.id, 'module.text_viral')

    if (!hasAccess) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="border rounded-lg p-8 text-center bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Module Not Enabled
                    </h3>
                    <p className="text-gray-600 dark:text-zinc-400 mb-4">
                        Purchase the Viral Text Generator to create optimized social posts.
                    </p>
                    <a
                        href="/dashboard/modules"
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                    >
                        Get Text Generator - $29
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <TextGenerator workspaceId={workspace.id} />
        </div>
    )
}
