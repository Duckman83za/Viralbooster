import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsPageClient } from "./client"

export default async function SettingsPage() {
    const session = await auth()

    if (!session) {
        redirect("/auth/login")
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-zinc-400 mb-8">
                Manage your API keys and module preferences.
            </p>

            <SettingsPageClient />
        </div>
    )
}
