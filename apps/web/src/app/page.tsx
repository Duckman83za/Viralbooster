
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="flex flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
          Content<span className="text-indigo-600">OS</span>
        </h1>
        <p className="max-w-2xl text-lg text-zinc-800 dark:text-zinc-400 sm:text-xl">
          The operating system for your viral content machine. Plan, Generate, and Publish seamlessly.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-800 dark:hover:bg-zinc-800"
          >
            Log in
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-zinc-700">
        &copy; {new Date().getFullYear()} ContentOS. All rights reserved.
      </footer>
    </div>
  )
}
