import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const IdEvento_ = parseInt(searchParams.get('IdEvento'), 10) || null;
        const Status = searchParams.get('Status') || null;

        let whereConditions = {};

        if (Status !== null) {
            const statusInt = parseInt(Status);
            if (!isNaN(statusInt)) {
                whereConditions.StatusConvite = statusInt;
            }
        }

        if (IdEvento_ !== null) {
            if (!isNaN(IdEvento_)) {
                whereConditions.IdEvento = IdEvento_;
            }
        }

        // Buscar todos os convites com o status informado
        const dadosConvites = await prisma.convite.findMany({
            where: whereConditions,
        });

        // Buscar os doadores correspondentes
        const idsDoador = dadosConvites.map(convite => convite.IdDoador).filter(id => id !== null);
        const dadosDoadores = await prisma.doador.findMany({
            where: {
                IdDoador: { in: idsDoador }
            }
        });

        // Buscar os eventos correspondentes
        const idsEventos = dadosConvites.map(convite => convite.IdEvento);
        const dadosEventos = await prisma.evento.findMany({
            where: {
                IdEvento: { in: idsEventos }
            }
        });

        // Montar a resposta combinando os dados
        const dadosCompletos = dadosConvites.map(convite => ({
            ...convite,
            doador: dadosDoadores.find(doador => doador.IdDoador === convite.IdDoador) || null,
            evento: dadosEventos.find(evento => evento.IdEvento === convite.IdEvento) || null
        }));

        return new Response(JSON.stringify(dadosCompletos), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function POST(req) {
    const { IdEvento_, IdDoador_, Quantidade, Status } = await req.json()

    try {
        if (!IdEvento_ || !IdDoador_) {
            throw new Error('Falta de Dados.');
        }

        const procuraConviteJaCriado = await prisma.convite.findFirst({
            where : {
                IdEvento : IdEvento_,
                IdDoador : IdDoador_
            }
        }) || null

        if(procuraConviteJaCriado != null) {

            const novaQuantidade = parseInt(procuraConviteJaCriado.QuantidadeConvite, 10) + parseInt(Quantidade, 10)
            let novoStatus
            procuraConviteJaCriado.StatusConvite == 1 ? novoStatus = Status : novoStatus = procuraConviteJaCriado.StatusConvite

            const resultUpdate = await prisma.convite.update({
                where : {
                    IdConvite: procuraConviteJaCriado.IdConvite
                },
                data : {
                    QuantidadeConvite: novaQuantidade,
                    StatusConvite: novoStatus
                }
            })

            return new Response(JSON.stringify({ resultUpdate }), { status: 201 });
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

export async function PUT(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const IdConvitePago = parseInt(searchParams.get('IdConvite'), 10);

        if (!IdConvitePago) {
            throw new Error('Falta de Dados.');
        }

        const result = await prisma.convite.update({
            where: { IdConvite: IdConvitePago },
            data: { StatusConvite: 1 }
        })

        return new Response(JSON.stringify({ result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}