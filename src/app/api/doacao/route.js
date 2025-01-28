import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET() {
    try {
        // Busca todas as doações
        const doacoes = await prisma.doacao.findMany();

        // Para cada doação, carrega os dados relacionados manualmente
        const doacoesCompletas = await Promise.all(
            doacoes.map(async (doacao) => {
                const doador = await prisma.doador.findUnique({
                    where: { IdDoador: doacao.IdDoador },
                });

                const contato = await prisma.contato.findMany({
                    where: { IdDoador: doacao.IdDoador },
                });

                return {
                    ...doacao,
                    doador,
                    contato,
                };
            })
        );

        // Retorna as doações completas
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
    let date;

    try {
        // Tenta interpretar o corpo da requisição
        Itens = await req.json();

        // Extrai a observacao e a data do corpo da requisição
        observacao = Itens.observacao || ""; // Atribui uma string vazia caso não tenha observação
        date = Itens.date ? new Date(Itens.date) : new Date(); // Usa a data fornecida ou a data atual

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
                DataAgendada: date, // Salva a data no formato Date
                StatusDoacao: date? 0 : 2
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