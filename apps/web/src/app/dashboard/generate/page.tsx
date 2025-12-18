'use client'
import { useState } from 'react'

export default function GeneratePage() {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Call API to trigger worker
        // For MVP, just log
        console.log("Triggering generation for:", prompt)
        setTimeout(() => setLoading(false), 2000)
        alert("Generation job queued!")
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Generate Content</h1>
            <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-black dark:text-white">Prompt / Topic</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32 p-2 border bg-white dark:bg-zinc-950 text-black dark:text-white"
                        placeholder="e.g. 3 viral tweets about AI productivity..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Now'}
                </button>
            </form>
        </div>
    )
}
