import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "seu@email.com" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const usuario = await prisma.usuario.findUnique({
                    where: { EmailUsuario: credentials.email },
                });

                if (!usuario) {
                    throw new Error("Usuário não encontrado!");
                }

                const senhaCorreta = await bcrypt.compare(credentials.password, usuario.SenhaUsuario);

                if (!senhaCorreta) {
                    throw new Error("Senha incorreta!");
                }

                return {
                    id: usuario.IdUsuario.toString(),
                    name: usuario.NomeUsuario,
                    email: usuario.EmailUsuario,
                    role: usuario.TipoUsuario, // Adiciona a role do usuário
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.role = token.role;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login", // Página de login personalizada
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
