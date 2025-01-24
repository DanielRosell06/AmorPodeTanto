import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function POST(req) {
    let Itens;

    try {
        // Tenta interpretar o corpo da requisição
        Itens = await req.json();
        console.log(Itens);

        // Verifica se Itens é um array ou contém a chave `array`
        if (!Array.isArray(Itens) && !Array.isArray(Itens.array)) {
            throw new Error("Formato inválido. Esperado um array ou uma chave 'array' contendo um array.");
        }

        const itemArray = Array.isArray(Itens) ? Itens : Itens.array;

        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const IdDoador = parseInt(searchParams.get('IdDoador'), 10);

        // Cria a doação e aguarda o resultado
        const resultDoacao = await prisma.doacao.create({
            data: { IdDoador: IdDoador }
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