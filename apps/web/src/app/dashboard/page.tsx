export default function DashboardHome() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border dark:border-zinc-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-700 dark:text-zinc-400 truncate">Scheduled Posts</dt>
                        <dd className="mt-1 text-3xl font-semibold text-black dark:text-white">0</dd>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border dark:border-zinc-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-700 dark:text-zinc-400 truncate">Modules Active</dt>
                        <dd className="mt-1 text-3xl font-semibold text-black dark:text-white">1</dd>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border dark:border-zinc-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-700 dark:text-zinc-400 truncate">Generation Credits</dt>
                        <dd className="mt-1 text-3xl font-semibold text-black dark:text-white">∞</dd>
                    </div>
                </div>
            </div>
        </div>
    )
}
