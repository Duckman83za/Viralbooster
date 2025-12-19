import { getCurrentWorkspace } from "@/lib/workspace"
import { checkEntitlement } from "@/lib/modules"
import { redirect } from "next/navigation"
import { BrandVoiceManager } from "./client"

export default async function BrandVoicePage() {
    const workspace = await getCurrentWorkspace()
    if (!workspace) {
        redirect('/auth/login')
    }

    const hasAccess = await checkEntitlement(workspace.id, 'module.brand_voice')

    if (!hasAccess) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-soft">
                    <div className="text-5xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Brand Voice Profiles
                    </h3>
                    <p className="text-muted mb-6 max-w-md mx-auto">
                        Create custom voice profiles to maintain consistent brand identity across all your content.
                    </p>
                    <a
                        href="/dashboard/modules"
                        className="btn-primary px-6 py-3 inline-block"
                    >
                        Get Brand Voice - $39
                    </a>
                </div>
            </div>
        )
    }

    return <BrandVoiceManager workspaceId={workspace.id} />
}
