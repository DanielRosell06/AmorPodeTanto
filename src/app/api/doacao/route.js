import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const searchBy = searchParams.get('searchBy');
        const searchIn = searchParams.get('searchIn');
        const orderBy = searchParams.get('orderBy');
        const filterBy = searchParams.get('filterBy');
        const tipoDoador = parseInt(searchParams.get('tipoDoador'), 10) || 0;

        let doacoes;
        let whereFilter = {};

        // Aplicar filtros de status e datas
        if (filterBy && filterBy !== "Nenhum") {
            switch (filterBy) {
                case "agendado":
                    whereFilter.StatusDoacao = 0;
                    whereFilter.DataAgendada = { gte: todayStart };
                    break;
                case "pendente":
                    whereFilter.StatusDoacao = 0;
                    whereFilter.DataAgendada = { lt: todayEnd };
                    break;
                case "agendadoHoje":
                    whereFilter.StatusDoacao = 0;
                    whereFilter.DataAgendada = {
                        gte: todayStart,
                        lt: todayEnd,
                    };
                    break;
                case "agendadoSemana":
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
                    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
                    whereFilter.StatusDoacao = 0;
                    whereFilter.DataAgendada = {
                        gte: startOfWeek,
                        lt: endOfWeek,
                    };
                    break;
                case "retirado":
                    whereFilter.StatusDoacao = 1;
                    break;
                case "cancelado":
                    whereFilter.StatusDoacao = 3;
                    break;
            }
        }

        // Filtro de pesquisa
        if (searchBy && searchIn) {
            let idsDoadores = [];
            
            if (searchBy === 'Nome') {
                idsDoadores = await prisma.doador.findMany({
                    where: { Nome: { contains: searchIn, mode: 'insensitive' } },
                    select: { IdDoador: true },
                }).then(d => d.map(({ IdDoador }) => IdDoador));
            }
            else if (searchBy === 'Telefone') {
                idsDoadores = await prisma.contato.findMany({
                    where: { Telefone: { contains: searchIn, mode: 'insensitive' } },
                    select: { IdDoador: true },
                }).then(c => c.map(({ IdDoador }) => IdDoador));
            }
            else if (searchBy === 'CPFCNPJ') {
                idsDoadores = await prisma.doador.findMany({
                    where: { CPFCNPJ: { contains: searchIn, mode: 'insensitive' } },
                    select: { IdDoador: true },
                }).then(d => d.map(({ IdDoador }) => IdDoador));
            }

            if (idsDoadores.length > 0) {
                whereFilter.IdDoador = { in: idsDoadores };
            } else {
                // Retorna vazio se não encontrar na pesquisa
                return new Response(JSON.stringify([]), { status: 200 });
            }
        }

        // Filtro de tipo de doador combinado com outros filtros
        const doadoresFiltrados = await prisma.doador.findMany({
            where: { TipoDoador: tipoDoador },
            select: { IdDoador: true },
        });

        const idsPorTipo = doadoresFiltrados.map(d => d.IdDoador);

        if (whereFilter.IdDoador) {
            // Interseção entre IDs da pesquisa e IDs do tipo
            const idsIntersecao = whereFilter.IdDoador.in.filter(id => 
                idsPorTipo.includes(id)
            );
            whereFilter.IdDoador.in = idsIntersecao;
        } else {
            whereFilter.IdDoador = { in: idsPorTipo };
        }

        // Ordenação
        let orderByClause = {};
        if (orderBy) {
            switch (orderBy) {
                case "adicionadoRecente":
                    orderByClause = { DataDoacao: 'desc' };
                    break;
                case "adicionadoAntigo":
                    orderByClause = { DataDoacao: 'asc' };
                    break;
                case "agendamentoMaisProximo":
                    orderByClause = { DataAgendada: 'asc' };
                    whereFilter.DataAgendada = { ...whereFilter.DataAgendada, gte: todayStart };
                    break;
                case "agendamentoMaisLonge":
                    orderByClause = { DataAgendada: 'desc' };
                    whereFilter.DataAgendada = { ...whereFilter.DataAgendada, gte: todayStart };
                    break;
            }
        }

        doacoes = await prisma.doacao.findMany({
            where: whereFilter,
            orderBy: orderByClause,
        });

        // Popular dados relacionados
        const doacoesCompletas = await Promise.all(
            doacoes.map(async (doacao) => ({
                ...doacao,
                doador: await prisma.doador.findUnique({
                    where: { IdDoador: doacao.IdDoador },
                }),
                contato: await prisma.contato.findMany({
                    where: { IdDoador: doacao.IdDoador },
                }),
            }))
        );

        return new Response(JSON.stringify(doacoesCompletas), { status: 200 });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}


export async function POST(req) {
    let Itens;
    let observacao;
    let destino;
    let date;
    let valorDinheiro;

    try {
        // Tenta interpretar o corpo da requisição
        Itens = await req.json();

        // Extrai a observacao e a data do corpo da requisição
        observacao = Itens.observacao || ""; // Atribui uma string vazia caso não tenha observação
        destino = Itens.destino || ""; // Atribui uma string vazia caso não tenha observação
        date = Itens.date ? new Date(Itens.date) : null; // Usa a data fornecida ou a data atual
        valorDinheiro = Itens.valorDinheiro || null;
        console.log(valorDinheiro)

        // Verifica se Itens.itens é um array
        if (!Array.isArray(Itens.itens)) {
            throw new Error("Formato inválido. Esperado um array contendo a chave 'itens'.");
        }

        const itemArray = Itens.itens;

        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const IdDoador = parseInt(searchParams.get('IdDoador'), 10);

        // Cria a doação e aguarda o resultado, incluindo a observação e a data
        const resultDoacao = await prisma.doacao.create({
            data: {
                IdDoador: IdDoador,
                Observacao: observacao,
                Destino: destino,
                DataAgendada: date, // Salva a data no formato Date
                StatusDoacao: 0
            }
        });

        // Cria os itens da doação
        const itemPromises = itemArray.map(async (item) => {
            return prisma.doacaoItem.create({
                data: {
                    IdDoacao: resultDoacao.IdDoacao,
                    IdProduto: item.IdProduto,
                    Quantidade: parseInt(item.Quantidade, 10),
                    UNItem: item.UNItem
                }
            });
        });

        let resultado;

        // Aguarda a criação de todos os itens
        await Promise.all(itemPromises);

        if (valorDinheiro != null) {
            resultado = await prisma.doacaoItem.create({
                data: {
                    IdDoacao: resultDoacao.IdDoacao,
                    IdProduto: 100,
                    Quantidade: valorDinheiro,
                    UNItem: "Reais"
                }
            })
        }

        // Retorna uma resposta bem-sucedida
        return new Response(JSON.stringify({ message: 'Doação e itens criados com sucesso!' }), { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function PUT(req) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const IdToUpdate = parseInt(searchParams.get('idToUpdate'), 10);
    const novaObservacao = (searchParams.get('novaObservacao'));
    const novoDestino = (searchParams.get('novoDestino'));
    const novoStatus = searchParams.has('novoStatus')
        ? parseInt(searchParams.get('novoStatus'), 10)
        : undefined;
    const novaDataAgendada = searchParams.has('novaDataAgendada')
        ? new Date(searchParams.get('novaDataAgendada'))
        : undefined;
    const novaDataRetirada = searchParams.has('novaDataRetirada')
        ? new Date(searchParams.get('novaDataRetirada'))
        : undefined;

    if (isNaN(IdToUpdate)) {
        return new Response(
            JSON.stringify({ error: 'IdToUpdate deve ser um número válido' }),
            { status: 400 }
        );
    }

    try {
        const updateData = {};

        updateData.Observacao = novaObservacao
        if (novoDestino != "null" && novoDestino != null) {
            updateData.Destino = novoDestino
        }

        if (novoStatus !== undefined && !isNaN(novoStatus)) {
            updateData.StatusDoacao = novoStatus;
        }

        if (novaDataAgendada !== undefined && !isNaN(novaDataAgendada.getTime())) {
            updateData.DataAgendada = novaDataAgendada;
        }

        if (novaDataRetirada !== undefined && !isNaN(novaDataRetirada.getTime())) {
            updateData.DataRetirada = novaDataRetirada;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado válido para atualizar');
        }

        const result = await prisma.doacao.update({
            where: { IdDoacao: IdToUpdate },
            data: updateData,
        });

        return new Response(
            JSON.stringify({ message: 'Doação atualizada com sucesso!', result }),
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}