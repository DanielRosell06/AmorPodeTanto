import { PrismaClient } from '@prisma/client'
import { stringify } from 'postcss';
const prisma = new PrismaClient()

export async function GET() {
    try {
        const response = await prisma.evento.findMany({
            orderBy: {
                DataEvento: 'asc', // Ordena em ordem crescente (mais antigo para mais recente)
            },
        });

        return new Response(JSON.stringify(response), { status: 200 })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const evento = await req.json();

        if (!evento.Titulo || !evento.Data) {
            return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios.' }), { status: 400 });
        }

        const dados = {
            TituloEvento: evento.Titulo,
            DetalheEvento: evento.Detalhe || "",
            DataEvento: new Date(evento.Data),
            CorEvento: evento.Cor || "slate",
            ValorConviteEvento: evento.ValorConvite || null
        }

        const result = await prisma.evento.create({ data: dados });

        return new Response(JSON.stringify({ message: 'Evento Criado com Sucesso!', evento: result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {

        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const SomenteResultado = searchParams.get('SomenteResultado') || null;

        const dadosBody = await req.json();

        let result

        if (SomenteResultado != null) {
            const dados = {
                ValorArrecadado: dadosBody.ValorArrecadado,
                ValorGasto: dadosBody.ValorGasto
            }

            result = await prisma.evento.update({
                where: { IdEvento: dadosBody.Id },
                data: dados
            })

        } else {
            if (!dadosBody.Titulo || !dadosBody.Data || !dadosBody.Id) {
                return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios.' }), { status: 400 });
            }

            const dados = {
                TituloEvento: dadosBody.Titulo,
                DetalheEvento: dadosBody.Detalhe || "",
                DataEvento: new Date(dadosBody.Data),
                CorEvento: dadosBody.Cor || "slate",
                ValorConviteEvento: dadosBody.ValorConvite || null
            }

            result = await prisma.evento.update({
                where: { IdEvento: dadosBody.Id },
                data: dados
            }
            );
        }


        return new Response(JSON.stringify({ message: 'Evento Editado com Sucesso!', evento: result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}