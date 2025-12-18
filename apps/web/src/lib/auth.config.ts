
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [],
    debug: true,
    pages: {
        signIn: "/auth/login",
        verifyRequest: "/auth/verify",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // return Response.redirect(new URL('/dashboard', nextUrl)) // Optional: redirect logged in users to dashboard
            }
            return true
        },
    }
} satisfies NextAuthConfig
