import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Rotas protegidas por nível de permissão
    const adminRoutes = ["/cadastro"]; // Apenas Admins (role >= 1) e Diretores (role >= 2)
    const diretorRoutes = []; // Apenas Diretores (role >= 2)

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token?.TipoUsuario ?? 0; // Assume "Usuário Normal (0)" se não houver role

    // Bloqueia usuários sem permissão para rotas administrativas
    if (adminRoutes.includes(req.nextUrl.pathname) && userRole < 1) {
        return NextResponse.redirect(new URL("/inicio", req.url));
    }

    // Bloqueia usuários sem permissão para rotas de diretores
    if (diretorRoutes.includes(req.nextUrl.pathname) && userRole < 2) {
        return NextResponse.redirect(new URL("/inicio", req.url));
    }

    return NextResponse.next();
}

// Protege todas as rotas necessárias
export const config = {
    matcher: ["/cadastro"], 
};
