import prisma from "@/libs/prisma";
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", placeholder: "Enter Email" },
                password: { label: "Password", placeholder: "Enter Password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user: any = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) return null;

                //check if password is correct
                const validPassword = await bcryptjs.compare(credentials.password, user.password)
                if (!validPassword) return null;

                const tokenData = {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                }
                //create token
                const token = await jwt.sign(tokenData, process.env.NEXTAUTH_SECRET!, { expiresIn: "1d" })
                user['token'] = token
                return user
            }
        })
    ],
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    token: token.token,
                    role: token.role,
                    name: token.name,
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id,
                    token: u.token,
                    role: u.role,
                    name: `${u.firstName} ${u.lastName}`,
                }
            }
            return token
        }
    },
    debug: process.env.NODE_ENV === "development",
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }