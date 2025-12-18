
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 border rounded-full p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-0">
                {/* Skeleton / invisible spacer to prevent layout shift */}
                <button className="px-3 py-1.5 text-sm font-medium">Light</button>
                <button className="px-3 py-1.5 text-sm font-medium">Dark</button>
                <button className="px-3 py-1.5 text-sm font-medium">Auto</button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 border rounded-full p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${theme === 'light' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
                Light
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-100'}`}
            >
                Dark
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${theme === 'system' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
                Auto
            </button>
        </div>
    )
}
