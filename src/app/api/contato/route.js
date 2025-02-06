import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

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