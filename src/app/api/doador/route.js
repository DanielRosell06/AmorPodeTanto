import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET(req) {

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const desativados = searchParams.get('desativados') || 0
    const searchBy = searchParams.get('searchBy')
    const input = searchParams.get('searchIn');

    const where = {};

    // Filtra por status se 'desativados' não for '1'
    if (desativados !== '1') {
        where.Status = { not: 0 };
    }
    
    if (searchBy && input) {
        switch (searchBy){
            case 'CPFCNPJ':
                where.CPFCNPJ = {
                    contains: input,
                    mode: 'insensitive', // Torna a busca case-insensitive
                  };
                break

            case 'nome':
                where.Nome = {
                    contains: input,
                    mode: 'insensitive', // Torna a busca case-insensitive
                  };
                break

            case 'rua':
                where.Rua = {
                    contains: input,
                    mode: 'insensitive', // Torna a busca case-insensitive
                    };
                break

            case 'bairro':
                where.Bairro = {
                    contains: input,
                    mode: 'insensitive', // Torna a busca case-insensitive
                    };
                break
        }
        
    }

    const doadoresList = await prisma.doador.findMany({ where: where });

    const doadoresComTelefone = await Promise.all(doadoresList.map(async (doador) => {
        const contato = await prisma.contato.findFirst({
            where: { IdDoador : doador.IdDoador }
        })

        if (!contato) {
            throw new Error('Contato não encontrado.');
        }

        doador.Telefone = contato.Telefone;

        return doador; // Retorna o doador atualizado
    }))
        
    return new Response(JSON.stringify(doadoresComTelefone))
}

export async function POST(req, res) {
    const { CPFCNPJ, Nome, CEP, Numero, Complemento, Contato, Telefone, Email} = await req.json()

    try{
        const response = await fetch(`https://viacep.com.br/ws/${CEP}/json/`)
        const data = await response.json();
        const Rua = data.logradouro
        const Bairro = data.bairro

        const resultDoador = await prisma.doador.create({
            data: {
                CPFCNPJ,
                Nome,
                CEP, 
                Rua,
                Numero,
                Bairro,
                Complemento
            }
        })
        
        const doador = await prisma.doador.findUnique({
            where: { CPFCNPJ: CPFCNPJ }
        });

        // Verifica se o doador existe e extrai o ID
        if (!doador) {
            throw new Error('Doador não encontrado.');
        }

        const IdDoador = doador.IdDoador;

        const resultContato = await prisma.contato.create({
            data: {
                IdDoador,
                Contato,
                Telefone, 
                Email
            }
        })
        
        return new Response(
            JSON.stringify({ resultDoador, resultContato }),
            { status: 201 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

export async function PUT(req) {
    const { IdDoador, CPFCNPJ, Nome, CEP, Numero, Complemento, Contato, Telefone, Email} = await req.json()

    try{
        const response = await fetch(`https://viacep.com.br/ws/${CEP}/json/`)
        const data = await response.json();
        const Rua = data.logradouro
        const Bairro = data.bairro

        const resultDoador = await prisma.doador.update({
            where: { IdDoador: IdDoador },
            data: {
                CPFCNPJ,
                Nome,
                CEP, 
                Rua,
                Numero,
                Bairro,
                Complemento
            }
        })

        const contato = await prisma.contato.findFirst({
            where: { IdDoador: IdDoador }
        });

        // Verifica se o doador existe e extrai o ID
        if (!contato) {
            throw new Error('Doador não encontrado.');
        }

        const _IdContato = contato.IdContato;


        const resultContato = await prisma.contato.update({
            where: { IdContato: _IdContato },
            data: {
                IdDoador,
                Contato,
                Telefone, 
                Email
            }
        })
        
        return new Response(
            JSON.stringify({ resultDoador, resultContato }),
            { status: 201 }
        );

    } catch (error) {
        // Certifique-se de que o erro é um objeto ou string
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
    
}