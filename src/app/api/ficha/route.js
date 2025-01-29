import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {

    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const ids = searchParams.get('arrayIdDoacao')
        const arrayIdDoacao = ids
            ? ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id))
            : [];

        const listaDoacoes = await Promise.all(
            arrayIdDoacao.map(id => prisma.doacao.findUnique({ where: { IdDoacao: id } }))
        );

        const listaCompleta = await Promise.all(
            listaDoacoes.map(async (doacao) => {
                const doador = await prisma.doador.findUnique({
                    where: { IdDoador: doacao.IdDoador },
                });

                const contato = await prisma.contato.findMany({
                    where: { IdDoador: doacao.IdDoador },
                });
                
                const itens = await prisma.doacaoItem.findMany({
                    where: { IdDoacao: doacao.IdDoacao },
                });

                const itensComProduto = await Promise.all(
                    itens.map(async (item) => {
                        const produto = await prisma.produto.findUnique({
                            where : {IdProduto : item.IdProduto}
                        })
                        return { ...item, produto}
                    })
                )

                return { ...doacao, doador, contato, itensComProduto };
            })
        );

        return new Response(
            JSON.stringify({ listaCompleta }),
            { status: 201 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}