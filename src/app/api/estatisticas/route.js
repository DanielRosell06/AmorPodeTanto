import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Pegando todos os itens de doação
        const doacaoItens = await prisma.doacaoItem.findMany({
            where : {
                NOT : { IdProduto : 100}
            }
        });

        // Pegando os IDs dos produtos dos itens de doação
        const produtoIds = [...new Set(doacaoItens.map(item => item.IdProduto))];

        // Buscando os produtos com base nos IDs obtidos
        const produtos = await prisma.produto.findMany({
            where: {
                IdProduto: {
                    in: produtoIds,
                },
            },
        });

        // Mapeando os produtos para um objeto de fácil acesso
        const produtosMap = produtos.reduce((acc, produto) => {
            acc[produto.IdProduto] = produto.Nome;
            return acc;
        }, {});

        // Contabilizando a quantidade de cada produto
        const produtoQuantidades = doacaoItens.reduce((acc, item) => {
            const produtoNome = produtosMap[item.IdProduto];
            if (acc[produtoNome]) {
                acc[produtoNome].quantidade += item.Quantidade;
            } else {
                acc[produtoNome] = {
                    nome: produtoNome,
                    quantidade: item.Quantidade,
                };
            }
            return acc;
        }, {});

        // Transformando o objeto em um array e ordenando pela quantidade
        const produtosOrdenados = Object.values(produtoQuantidades).sort((a, b) => b.quantidade - a.quantidade);

        // Se o número de produtos for maior que 9, vamos somar os outros produtos em uma categoria "Outros"
        let topProdutos = produtosOrdenados.slice(0, 9);
        let outrosQuant = 0;

        if (produtosOrdenados.length > 9) {
            // Contabilizando a quantidade de produtos que não estão entre os 9 primeiros
            for (let i = 9; i < produtosOrdenados.length; i++) {
                outrosQuant += produtosOrdenados[i].quantidade;
            }
            topProdutos.push({
                nome: 'Outros',
                quantidade: outrosQuant,
            });
        }

        // Contando o total de produtos
        const totalProdutos = produtosOrdenados.reduce((acc, item) => acc + item.quantidade, 0);

        // Obtendo os dados dos últimos 3 meses com o número de doadores e doações feitas
        const ultimosTresMeses = await prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('day', d."DataDoacao") AS date, 
                COUNT(DISTINCT d."IdDoacao") AS "doacoesFeitas",
                COUNT(DISTINCT doador."IdDoador") AS "doadoresAdicionados"
            FROM "Doacao" d
            LEFT JOIN "Doador" doador ON DATE_TRUNC('day', doador."DataDoador") = DATE_TRUNC('day', d."DataDoacao")
            WHERE d."DataDoacao" >= NOW() - INTERVAL '3 months'
            GROUP BY DATE_TRUNC('day', d."DataDoacao")
            ORDER BY date ASC;
        `;

        // Convertendo BigInt para string ou número em todos os lugares necessários
        const produtosOrdenadosComStrings = produtosOrdenados.map(item => ({
            ...item,
            quantidade: item.quantidade.toString() // Converte para string
        }));

        const ultimosTresMesesComStrings = ultimosTresMeses.map(item => ({
            ...item,
            doacoesFeitas: item.doacoesFeitas.toString(),  // Converte para string
            doadoresAdicionados: item.doadoresAdicionados.toString()  // Converte para string
        }));

        // Fazendo a resposta final
        return new Response(
            JSON.stringify({
                totalProdutos: totalProdutos.toString(), // Se totalProdutos for BigInt
                topProdutos: produtosOrdenadosComStrings,
                ultimosTresMeses: ultimosTresMesesComStrings
            }),
            { status: 200 }
        );
    } catch (error) {
        // Certifique-se de que o erro é um objeto ou string
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}
