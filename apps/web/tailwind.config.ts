import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#ff3300",
                    light: "#ff5533",
                    dark: "#e62e00",
                    50: "#fff5f3",
                    100: "#ffe6e0",
                    200: "#ffc9bd",
                    300: "#ffa08a",
                    400: "#ff6b4d",
                    500: "#ff3300",
                    600: "#e62e00",
                    700: "#c72600",
                    800: "#a32100",
                    900: "#871c00",
                },
                secondary: "#292929",
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: {
                    DEFAULT: "#6B7280",
                    foreground: "#9CA3AF",
                },
                border: "var(--border)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
            fontSize: {
                hero: ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
                "hero-sm": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
            },
            spacing: {
                18: "4.5rem",
                22: "5.5rem",
                section: "8rem",
            },
            borderRadius: {
                xl: "12px",
                "2xl": "16px",
                "3xl": "24px",
            },
            boxShadow: {
                soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
                medium: "0 6px 12px rgba(0, 0, 0, 0.1)",
                large: "0 10px 25px rgba(0, 0, 0, 0.15)",
                glow: "0 4px 14px rgba(255, 51, 0, 0.25)",
                "glow-lg": "0 6px 20px rgba(255, 51, 0, 0.35)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-soft": "pulseSoft 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseSoft: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.8" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
