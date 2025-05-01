// middleware.js (na raiz do projeto)
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    console.log("[middleware] recebido:", req.nextUrl.pathname);
    const { pathname } = req.nextUrl;
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });


    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    
    if (pathname.startsWith("/api")) {

        if (!token) {
            // 401 JSON para fetch/browser/Postman
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return NextResponse.next();
    }

    const role = token.role ?? 0;     // agora é token.role
    const adminRoutes = ["/cadastro"];
    const diretorRoutes = ["/diretoria"];         // caso queira proteger rotas de diretores

    if (adminRoutes.includes(pathname) && role < 1) {
        return NextResponse.redirect(new URL("/inicio", req.url));
    }
    if (diretorRoutes.includes(pathname) && role < 2) {
        return NextResponse.redirect(new URL("/inicio", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/:path((?!auth).*)",  // protege todas as APIs, exceto /api/auth
        "/cadastro",    // e continue listando suas páginas protegidas
        "/diretoria",    // e continue listando suas páginas protegidas
        "/doacoes",
        "/doadores",
        "/inicio",
        "/produtos",
    ],
};
