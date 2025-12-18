import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@contentos/db"
import authConfig from "./auth.config"

import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Resend({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                console.log("██████████████████████████████████████████████████")
                console.log(`LOGIN LINK FOR ${identifier}:`)
                console.log(url)
                console.log("██████████████████████████████████████████████████")
            },
        }),
        Credentials({
            name: "Dev Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials.password === "password") {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string }
                    })
                    return user
                }
                return null
            }
        })
    ],
})
