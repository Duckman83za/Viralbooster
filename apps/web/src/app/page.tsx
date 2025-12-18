import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#0a0a0a] text-foreground font-sans">
      <main className="flex flex-col items-center justify-center gap-8 px-4 text-center max-w-4xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-hero-sm md:text-hero tracking-tight text-secondary dark:text-white">
          The Operating System for<br />
          <span className="text-primary">Viral Content</span>
        </h1>

        <p className="max-w-2xl text-lg text-muted md:text-xl leading-relaxed">
          Plan, generate, and publish viral social content seamlessly.
          Powered by AI, designed for creators.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/dashboard"
            className="btn-primary px-8 py-4 text-base rounded-xl"
          >
            🚀 Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary px-8 py-4 text-base rounded-xl"
          >
            Log In
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-6 mt-8 text-sm text-muted">
          <div className="flex -space-x-2">
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <div
                key={letter}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xs font-semibold border-2 border-white dark:border-zinc-900"
              >
                {letter}
              </div>
            ))}
          </div>
          <span>Join 500+ creators going viral</span>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-muted">
        &copy; {new Date().getFullYear()} ContentOS. All rights reserved.
      </footer>
    </div>
  )
}
