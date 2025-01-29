import { PrismaClient } from '@prisma/client';
import { hash, compare } from "bcryptjs";

let prisma = new PrismaClient();

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const email = searchParams.get('email');
        const senha = searchParams.get('senha');

        if (!email || !senha) {
            return new Response(JSON.stringify({ error: "E-mail e senha são obrigatórios" }), { status: 400 });
        }

        const result = await prisma.usuario.findUnique({
            where: {
                EmailUsuario: email,
            }
        });

        if (!result) {
            return new Response(JSON.stringify(false));
        }

        const senhaValida = await compare(senha, result.SenhaUsuario);

        if (!senhaValida) {
            return new Response(JSON.stringify(false));
        }

        const usuarioSecao = {
            Nome: result.NomeUsuario,
            Email: result.EmailUsuario,
            Tipo: result.TipoUsuario
        };

        return new Response(JSON.stringify(usuarioSecao));

    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return new Response(JSON.stringify({ error: error.message || 'Erro desconhecido' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => null);

        if (!body || Object.keys(body).length === 0) {
            return new Response(JSON.stringify({ error: "Requisição inválida ou corpo vazio" }), { status: 400 });
        }

        const { NomeUsuario, EmailUsuario, SenhaUsuario, TipoUsuario } = body;

        if (!NomeUsuario || !EmailUsuario || !SenhaUsuario || TipoUsuario === undefined) {
            return new Response(JSON.stringify({ error: "Todos os campos são obrigatórios" }), { status: 400 });
        }

        const senhaCriptografada = await hash(SenhaUsuario, 10);

        const result = await prisma.usuario.create({
            data: {
                NomeUsuario,
                EmailUsuario,
                SenhaUsuario: senhaCriptografada,
                TipoUsuario
            }
        });

        return new Response(JSON.stringify({ success: true, user: result }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return new Response(JSON.stringify({ error: error.message || 'Erro desconhecido' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
