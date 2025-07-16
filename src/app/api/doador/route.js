import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

// Verificador de sessão
export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const desativados = searchParams.get('desativados') || 0
    const searchBy = searchParams.get('searchBy')
    const input = searchParams.get('searchIn');
    const ordenarPor = searchParams.get('ordenarPor');
    const tipoDoador = parseInt(searchParams.get('tipoDoador'), 10) || 0;

    const where = {};
    let orderBy = {};
    let doadoresList;

    if (tipoDoador != null) {
        where.TipoDoador = tipoDoador
    }

    // Filtra por status se 'desativados' não for '1'
    if (desativados !== '1') {
        where.Status = { not: 0 };
    }

    if (searchBy && input) {
        switch (searchBy) {
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

            case 'telefone':
                // Primeiro busca os contatos com o telefone
                const contatos = await prisma.contato.findMany({
                    where: {
                        Telefone: {
                            contains: input,
                            mode: 'insensitive'
                        }
                    },
                    select: {
                        IdDoador: true
                    }
                });

                // Pega apenas os IDs dos doadores encontrados
                const idsDoadores = contatos.map(c => c.IdDoador);

                // Busca os doadores com esses IDs
                where.IdDoador = {
                    in: idsDoadores
                };
                break;

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

    orderBy = {
        DataDoador: 'desc'
    };

    if (ordenarPor) {
        switch (ordenarPor) {
            case "AdicionadoRecente":
                doadoresList = await prisma.doador.findMany({ where: where, orderBy: orderBy, take: 50 });
                break;

            case "AdicionadoAntigo":
                orderBy = {
                    DataDoador: 'asc'
                };
                doadoresList = await prisma.doador.findMany({ where: where, orderBy: orderBy, take: 50 });
                break;
        }
    } else {
        doadoresList = await prisma.doador.findMany({ where: where, take: 50, orderBy: orderBy });
    }



    const doadoresComTelefone = await Promise.all(doadoresList.map(async (doador) => {
        const contato = await prisma.contato.findFirst({
            where: { IdDoador: doador.IdDoador }
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
    const { CPFCNPJ, Nome, CEP, Sexo, DataAniversario, OrigemDoador, ObservacaoDoador, Numero, Complemento, Contato, Telefone, Email } = await req.json()

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const TipoDoador = parseInt(searchParams.get('tipoDoador'), 10) || 0
    
    try {

        if (Nome.trim().split(/\s+/).length < 2) {
            throw new Error("Erro Nome sem sobrenome");
        } else if (Nome.trim().split(/\s+/)[1].length < 3 || !/^[a-zA-Z\s-]+$/.test(Nome.trim().split(/\s+/)[1])) {
            throw new Error("Erro Nome sem sobrenome");
        }
        
        let Rua
        let Bairro

        if (!CEP || CEP == null || CEP == "") {
            Rua = null
            Bairro = null
        } else {

            // Remove any non-numeric characters from the CEP
            const sanitizedCEP = CEP.replace(/\D/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${sanitizedCEP}/json/`)
            const data = await response.json();

            if (data.erro) {
                throw new Error("Erro ao buscar o CEP");
            }

            Rua = data.logradouro
            Bairro = data.bairro
        }


        const resultDoador = await prisma.doador.create({
            data: {
                CPFCNPJ,
                Nome,
                CEP,
                Rua,
                Numero,
                Bairro,
                Complemento,
                ObservacaoDoador,
                OrigemDoador,
                Sexo,
                DataAniversario,
                TipoDoador
            }
        })

        const IdDoador = resultDoador.IdDoador;

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
    const { IdDoador, CPFCNPJ, Nome, CEP, Sexo, DataAniversario, Numero, Complemento, ObservacaoDoador, OrigemDoador, Contato, Telefone, Email, IdContato } = await req.json()

    try {
        if (!CEP || CEP == null || CEP == "") {
            Rua = null
            Bairro = null
        } else {

            // Remove any non-numeric characters from the CEP
            const sanitizedCEP = CEP.replace(/\D/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${sanitizedCEP}/json/`)
            const data = await response.json();

            if (data.erro) {
                throw new Error("Erro ao buscar o CEP");
            }

            Rua = data.logradouro
            Bairro = data.bairro
        }

        const resultDoador = await prisma.doador.update({
            where: { IdDoador: IdDoador },
            data: {
                CPFCNPJ,
                Nome,
                CEP,
                Rua,
                Numero,
                Bairro,
                Complemento,
                ObservacaoDoador,
                OrigemDoador,
                Sexo,
                DataAniversario
            }
        })

        const resultContato = await prisma.contato.update({
            where: { IdContato: IdContato },
            data: {
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