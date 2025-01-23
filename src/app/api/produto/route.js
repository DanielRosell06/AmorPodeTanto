import { PrismaClient } from '@prisma/client'
import { Result } from 'postcss'
let prisma = new PrismaClient()

export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const IdToEditar = parseInt(searchParams.get('IdToGet'), 10) || 0
    const NomeToSearch = searchParams.get('nomeSearch')

    let produtos;

    try{
        if(!IdToEditar || IdToEditar == -1){
            if(NomeToSearch != ""){
                produtos = await prisma.produto.findMany({
                    where: {
                        Nome:{
                            contains: NomeToSearch,
                            mode: 'insensitive', // Torna a busca case-insensitive}
                        }
                    }
                })
            }else{
                produtos = await prisma.produto.findMany({})
            }

        }else{
            produtos = await prisma.produto.findUnique({
                where: {IdProduto : IdToEditar}
            })
        }
        return new Response(JSON.stringify(produtos))
    }catch(error){
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function POST(req) {
    const { Nome, UN } = await req.json()

    try{
        const result = await prisma.produto.create({
            data: {
                Nome: Nome,
                UN: UN
            }
        })
        
        return new Response(
            JSON.stringify({ result }),
            { status: 201 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function PUT(req) {
    const { IdProduto, Nome, UN } = await req.json()

    try{
        const result = await prisma.produto.update({
            where: { IdProduto : IdProduto},
            data: {
                Nome: Nome,
                UN: UN
            }
        })
        
        return new Response(
            JSON.stringify({ result }),
            { status: 201 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function DELETE(req) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const IdToDelete = parseInt(searchParams.get('IdToDelete'), 10) || 0

    try{
        if (IdToDelete == 0){
            throw new Error('É necessario passar um Id pela URL.');
        }

        const result = await prisma.produto.delete({
            where: {IdProduto : IdToDelete}
        })

        return new Response(
            JSON.stringify({ result }),
            { status: 201 }
        );
    }catch(error){
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}