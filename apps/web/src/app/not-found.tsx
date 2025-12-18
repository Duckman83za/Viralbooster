import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
            <div className="text-center p-8">
                <h2 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    404
                </h2>
                <h3 className="text-xl font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Page Not Found
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 mb-6">
                    The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors inline-block"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
