import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const email = searchParams.get('email')
        const senha = searchParams.get('senha')

        const result = await prisma.usuario.findUnique({
            where : {
                EmailUsuario : email,
                SenhaUsuario : senha
            }
        })

        if(result){
            const usuarioSecao = {
                Nome : result.NomeUsuario,
                Email : result.EmailUsuario,
                Tipo : result.TipoUsuario
            }
            return new Response(JSON.stringify(usuarioSecao))
        } else{
            return new Response(JSON.stringify(false))
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}


export async function POST(req) {
    try {
        const { NomeUsuario, EmailUsuario, SenhaUsuario, TipoUsuario } = await req.json();

        const result = await prisma.usuario.create({  // Adicione "await" aqui
            data: {
                NomeUsuario,
                EmailUsuario,
                SenhaUsuario,
                TipoUsuario
            }
        });

        return new Response(
            JSON.stringify({ success: true, user: result }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Erro desconhecido' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}