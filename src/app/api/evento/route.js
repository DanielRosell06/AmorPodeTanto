import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary';
const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const response = await prisma.evento.findMany({
            orderBy: {
                DataEvento: 'asc', // Ordena em ordem crescente (mais antigo para mais recente)
            },
        });

        return new Response(JSON.stringify(response), { status: 200 })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const Titulo = formData.get("Titulo");
        const Detalhe = formData.get("Detalhe") || "";
        const Data = formData.get("Data");
        const Cor = formData.get("Cor") || "slate";
        const ValorConvite = parseInt(formData.get("ValorConvite"), 10) || null;
        const ImagemEvento = formData.get("ImagemEvento");

        if (!Titulo || !Data) {
            return new Response(JSON.stringify({ error: 'Todos os campos obrigatórios devem ser preenchidos.' }), { status: 400 });
        }

        let imagemUrl = null;

        if (ImagemEvento && typeof ImagemEvento === "object") {
            const arrayBuffer = await ImagemEvento.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "eventos" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });

            imagemUrl = uploadResponse.secure_url;
        }

        const dados = {
            TituloEvento: Titulo,
            DetalheEvento: Detalhe,
            DataEvento: new Date(Data),
            CorEvento: Cor,
            ValorConviteEvento: ValorConvite,
            URLImagemEvento: imagemUrl
        };


        const result = await prisma.evento.create({ data: dados });

        return new Response(JSON.stringify({ message: 'Evento Criado com Sucesso!', evento: result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {

        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const SomenteResultado = searchParams.get('SomenteResultado') || null;

        const dadosBody = await req.json();

        let result

        if (SomenteResultado != null) {
            const dados = {
                ValorArrecadado: dadosBody.ValorArrecadado,
                ValorGasto: dadosBody.ValorGasto
            }

            result = await prisma.evento.update({
                where: { IdEvento: dadosBody.Id },
                data: dados
            })

        } else {
            if (!dadosBody.Titulo || !dadosBody.Data || !dadosBody.Id) {
                return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios.' }), { status: 400 });
            }

            const dados = {
                TituloEvento: dadosBody.Titulo,
                DetalheEvento: dadosBody.Detalhe || "",
                DataEvento: new Date(dadosBody.Data),
                CorEvento: dadosBody.Cor || "slate",
                ValorConviteEvento: dadosBody.ValorConvite || null
            }

            result = await prisma.evento.update({
                where: { IdEvento: dadosBody.Id },
                data: dados
            }
            );
        }


        return new Response(JSON.stringify({ message: 'Evento Editado com Sucesso!', evento: result }), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao processar a requisição:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}