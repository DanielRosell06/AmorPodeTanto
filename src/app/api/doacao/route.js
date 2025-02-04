import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    try {
        const now = new Date(); // Data e hora atual
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1); // Fim do dia de hoje

        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Segunda-feira da semana atual
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7)); // Domingo da semana atual

        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const searchBy = searchParams.get('searchBy');
        const searchIn = searchParams.get('searchIn');
        const orderBy = searchParams.get('orderBy');
        const filterBy = searchParams.get('filterBy');

        let doacoes;
        let whereFilter = {};

        if (filterBy && filterBy !== "Nenhum") {
            switch (filterBy) {
                case "agendado":
                    whereFilter = { 
                        StatusDoacao: 0,
                        DataAgendada: {
                            gte: todayStart,
                        }
                     };
                    break;
                case "pendente":
                    whereFilter = {
                        StatusDoacao: 0,
                        DataAgendada: { lt: todayEnd },
                    };
                    break;
                case "agendadoHoje":
                    whereFilter = {
                        StatusDoacao: 0,
                        DataAgendada: {
                            gte: todayStart,
                            lt: todayEnd,
                        },
                    };
                    break;
                case "agendadoSemana":
                    whereFilter = {
                        StatusDoacao: 0,
                        DataAgendada: {
                            gte: startOfWeek,
                            lt: endOfWeek,
                        },
                    };
                    break;
                case "retirado":
                    whereFilter = { StatusDoacao: 1 };
                    break;

                case "cancelado":
                    whereFilter = { StatusDoacao: 3 };
                    break;
            }
        }

        // Definindo o filtro para pesquisa
        if (searchBy && searchIn) {
            if (searchBy === 'Nome') {
                whereFilter = {
                    ...whereFilter,
                    IdDoador: {
                        in: await prisma.doador.findMany({
                            where: {
                                Nome: {
                                    contains: searchIn,
                                    mode: 'insensitive',
                                },
                            },
                            select: {
                                IdDoador: true,
                            },
                        }).then(donors => donors.map(d => d.IdDoador)),
                    },
                };
            } else if (searchBy === 'Telefone') {
                whereFilter = {
                    ...whereFilter,
                    IdDoador: {
                        in: await prisma.contato.findMany({
                            where: {
                                Telefone: {
                                    contains: searchIn,
                                    mode: 'insensitive',
                                },
                            },
                            select: {
                                IdDoador: true,
                            },
                        }).then(contacts => contacts.map(c => c.IdDoador)),
                    },
                };
            } else if (searchBy === 'CPFCNPJ') {
                whereFilter = {
                    ...whereFilter,
                    IdDoador: {
                        in: await prisma.doador.findMany({
                            where: {
                                CPFCNPJ: {
                                    contains: searchIn,
                                    mode: 'insensitive',
                                },
                            },
                            select: {
                                IdDoador: true,
                            },
                        }).then(donors => donors.map(d => d.IdDoador)),
                    },
                };
            }
        }

        // Lógica para ordenação das doações
        if (orderBy) {
            switch (orderBy) {
                case "adicionadoRecente":
                    doacoes = await prisma.doacao.findMany({
                        orderBy: { DataDoacao: 'desc' },
                        where: whereFilter,
                    });
                    break;
                case "adicionadoAntigo":
                    doacoes = await prisma.doacao.findMany({
                        orderBy: { DataDoacao: 'asc' },
                        where: whereFilter,
                    });
                    break;
                case "agendamentoMaisProximo":
                    doacoes = await prisma.doacao.findMany({
                        where: {
                            DataAgendada: { gte: todayStart },
                            ...whereFilter,
                        },
                        orderBy: { DataAgendada: 'asc' },
                    });
                    break;
                case "agendamentoMaisLonge":
                    doacoes = await prisma.doacao.findMany({
                        where: {
                            DataAgendada: { gte: todayStart },
                            ...whereFilter,
                        },
                        orderBy: { DataAgendada: 'desc' },
                    });
                    break;
                default:
                    doacoes = await prisma.doacao.findMany({ where: whereFilter });
                    break;
            }
        } else {
            doacoes = await prisma.doacao.findMany({ where: whereFilter });
        }

        const doacoesCompletas = await Promise.all(
            doacoes.map(async (doacao) => {
                const doador = await prisma.doador.findUnique({
                    where: { IdDoador: doacao.IdDoador },
                });

                const contato = await prisma.contato.findMany({
                    where: { IdDoador: doacao.IdDoador },
                });

                return { ...doacao, doador, contato };
            })
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

    try {
        // Tenta interpretar o corpo da requisição
        Itens = await req.json();

        // Extrai a observacao e a data do corpo da requisição
        observacao = Itens.observacao || ""; // Atribui uma string vazia caso não tenha observação
        destino = Itens.destino || ""; // Atribui uma string vazia caso não tenha observação
        date = Itens.date ? new Date(Itens.date) : null; // Usa a data fornecida ou a data atual

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

        // Aguarda a criação de todos os itens
        await Promise.all(itemPromises);

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
        updateData.Destino = novoDestino

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