import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const Id = searchParams.get('Id');

    if (!Id) {
      return new Response(JSON.stringify({ error: 'Id é obrigatório.' }), { status: 400 });
    }

    const numericId = parseInt(Id, 10);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: 'Id inválido.' }), { status: 400 });
    }

    const doador = await prisma.doador.findUnique({
      where: { IdDoador: numericId },
    });

    if (!doador) {
      return new Response(JSON.stringify({ error: 'Doador não encontrado.' }), { status: 404 });
    }

    const contato = await prisma.contato.findFirst({
      where: { IdDoador: numericId },
    });

    const doadorComContato = {
      IdDoador: doador.IdDoador,
      CPFCNPJ: doador.CPFCNPJ,
      Nome: doador.Nome,
      CEP: doador.CEP,
      Rua: doador.Rua,
      Numero: doador.Numero,
      Bairro: doador.Bairro,
      Complemento: doador.Complemento,
      Contato: contato?.Contato || null,
      Telefone: contato?.Telefone || null,
      Email: contato?.Email || null,
    };

    return new Response(JSON.stringify(doadorComContato), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}