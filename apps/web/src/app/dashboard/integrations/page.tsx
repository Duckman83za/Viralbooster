export default function IntegrationsPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Integrations</h1>
            <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6 border dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">in</div>
                        <div>
                            <h3 className="text-lg font-medium text-black dark:text-white">LinkedIn</h3>
                            <p className="text-sm text-gray-700 dark:text-zinc-400">Connect your personal profile or company page.</p>
                        </div>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">Connect</button>
                </div>
            </div>
            {/* More connectors */}
        </div>
    )
}
