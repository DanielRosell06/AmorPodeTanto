import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()


export async function POST(req) {
    const { IdEvento_, IdDoador_, Quantidade, Status } = await req.json()

    try {
        if (!IdEvento_ || !IdDoador_) {
            throw new Error('Falta de Dados.');
        }

        const dados = {
            IdEvento: IdEvento_,
            IdDoador: IdDoador_,
            QuantidadeConvite: parseInt(Quantidade, 10) || 1,
            StatusConvite: Status || 0
        }

        const result = await prisma.convite.create({
            data: dados
        })

        return new Response(JSON.stringify({ result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}