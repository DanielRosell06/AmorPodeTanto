"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ConvitesNaoPagos({ onOpenContato }) {

    const [convitesNaoPagos, setConvitesNaoPagos] = useState([])

    useEffect(() => {
        const fetchGetConvitesNaoPagos = async () => {
            try {
                const response = await fetch(`/api/convite?Status=0`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                setConvitesNaoPagos(data)

            } catch (error) {
                console.error('Erro ao adicionar usuário:', error);
            }
        };

        fetchGetConvitesNaoPagos()

    }, []);

    return (
        <div className="ml-[5%]">
            <div className="w-[60%] mb-10">
                <h2 className="text-left mt-10 mb-2 text-lg font-semibold">Convites Não Pagos</h2>
                <Table >
                    <TableHeader>
                        <TableRow className="bg-sky-300">
                            <TableHead className="text-center  text-black">Nome do Doador</TableHead>
                            <TableHead className="text-center  text-black">Evento</TableHead>
                            <TableHead className="text-center  text-black w-[20%]">Quantidade de Convites</TableHead>
                            <TableHead className="text-center  text-black w-[10%]">Contatos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {convitesNaoPagos.length > 0 ? (
                            convitesNaoPagos.map((convite) => (
                                <TableRow key={convite.IdConvite}>
                                    <TableCell>{convite.doador.Nome}</TableCell>
                                    <TableCell>{convite.evento.TituloEvento}</TableCell>
                                    <TableCell>{convite.QuantidadeConvite}</TableCell>
                                    <TableCell>
                                        <Button className="bg-white text-black hover:bg-slate-200 shadow-none"
                                            onClick={() => {
                                                onOpenContato(convite.doador.IdDoador)
                                            }}
                                        >
                                            <i className="fas fa-envelope"></i>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="3" className="text-center">
                                    Nenhum convite não pago encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}