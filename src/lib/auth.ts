import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "RuralMate Login",
            credentials: {
                phone: { label: "Phone", type: "text" },
                name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phone) return null;

                const trimmedPhone = credentials.phone.trim();
                if (!/^\+?\d{8,15}$/.test(trimmedPhone.replace(/\s/g, ""))) {
                    return null;
                }

                return {
                    id: trimmedPhone,
                    name: credentials.name?.trim() || "Kisan Ji",
                    phone: trimmedPhone,
                } as any;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).phone = (token as any).phone;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.phone = (user as any).phone;
            }
            return token;
        },
    },
};
