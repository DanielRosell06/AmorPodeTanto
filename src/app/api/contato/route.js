import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const contatoDoadorId = parseInt(searchParams.get('contatoDoadorId'), 10) || -1;

        if (contatoDoadorId != -1) {
            const Contatos = await prisma.contato.findMany({
                where: { IdDoador: contatoDoadorId }
            })
            return new Response(JSON.stringify(Contatos), { status: 200 });
        }
        else{
            const Contatos = prisma.contato.findMany({})
            return new Response(JSON.stringify(Contatos), { status: 200 });
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function POST(req) {
    const { IdDoador, Contato, Telefone, Email } = await req.json()

    try {
        const result = await prisma.contato.create({
            data: {
                IdDoador,
                Contato,
                Telefone,
                Email
            }
        })

        return new Response(
            JSON.stringify({ result }),
            { status: 201 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}