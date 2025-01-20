import { PrismaClient } from '@prisma/client'
let prisma = new PrismaClient()

export async function GET() {
    const doadoresList = await prisma.doador.findMany()
    
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

        // AQUI, O QUE EU QUERO FAZER É, EU BUSCO UM DOADOR QUE TENHA O CPFCNPJ = CPFCNPJ, E PEGO O ID DESSE CARA
        // DAI COM O ID EU CONSIGO CADASTRAR O CONTATO DELE
        
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