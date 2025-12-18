import { getCurrentWorkspace } from "@/lib/workspace"
import { checkEntitlement } from "@/lib/modules"
import { UrlScanner } from "@/components/modules/url-scanner"
import { AuthorityImageGenerator } from "@/components/modules/authority-image"
import { ShortsGenerator } from "@/components/modules/shorts-generator"
import { redirect } from "next/navigation"

export default async function GeneratePage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        redirect("/auth/login")
    }

    // Check which modules user has access to
    const [hasUrlScanner, hasAuthorityImage, hasShortsGenerator] = await Promise.all([
        checkEntitlement(workspace.id, 'module.url_scanner'),
        checkEntitlement(workspace.id, 'module.authority_image'),
        checkEntitlement(workspace.id, 'module.shorts_generator'),
    ])

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">Content Generator</h1>
            <p className="text-gray-600 dark:text-zinc-400 mb-8">Use your enabled modules to create viral content.</p>

            <div className="space-y-8">
                {/* URL Scanner Module */}
                {hasUrlScanner && (
                    <UrlScanner workspaceId={workspace.id} />
                )}

                {/* Authority Image Module */}
                {hasAuthorityImage && (
                    <AuthorityImageGenerator workspaceId={workspace.id} />
                )}

                {/* Shorts Generator Module */}
                {hasShortsGenerator && (
                    <ShortsGenerator workspaceId={workspace.id} />
                )}

                {/* No modules enabled */}
                {!hasUrlScanner && !hasAuthorityImage && !hasShortsGenerator && (
                    <div className="border rounded-lg p-8 text-center bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No modules enabled
                        </h3>
                        <p className="text-gray-600 dark:text-zinc-400 mb-4">
                            Purchase modules from the marketplace to start generating content.
                        </p>
                        <a
                            href="/dashboard/modules"
                            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                        >
                            Browse Modules
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
