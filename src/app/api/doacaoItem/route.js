import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {
    
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const IdDoacao = parseInt(searchParams.get('IdDoacao'), 10)

    let Itens
    let ItensCompletos

    try{
        if (!IdDoacao){
            throw new Error('Nenhum Id foi passado.');
            
        }else{
            Itens = await prisma.doacaoItem.findMany({
                where : {IdDoacao : IdDoacao}
            })
            
            const doacao = await prisma.doacao.findUnique({
                where: {IdDoacao: IdDoacao}
            })
            
            ItensCompletos = await Promise.all(
                Itens.map(async (Item) => {
                    const produto = await prisma.produto.findUnique({
                        where: { IdProduto: Item.IdProduto },
                    });

                    return {
                        ...Item,
                        produto,
                        doacao
                    };
                })
            );

            ItensCompletos.sort((a, b) => 
                a.produto.Nome.localeCompare(b.produto.Nome)
            );
        }

        return new Response(JSON.stringify(ItensCompletos), { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}