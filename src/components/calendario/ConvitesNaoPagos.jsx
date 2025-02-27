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

export default function ConvitesNaoPagos({ onOpenContato, onConvitePago, convitesNaoPagos }) {
    const [convites, setConvites] = useState(convitesNaoPagos);

    // Atualiza o estado local sempre que a prop convitesNaoPagos mudar
    useEffect(() => {
        setConvites(convitesNaoPagos);
    }, [convitesNaoPagos]);

    return (
        <div >
            <div className="w-[63vw] mb-10">
                <h2 className="text-left mt-4 mb-2 text-lg font-semibold">Convites Não Pagos</h2>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-sky-300 hover:bg-sky-700">
                            <TableHead className="text-center text-black">Nome do Doador</TableHead>
                            <TableHead className="text-center text-black">Evento</TableHead>
                            <TableHead className="text-center text-black w-[20%]">Quantidade de Convites</TableHead>
                            <TableHead className="text-center text-black w-[10%]">Contatos</TableHead>
                            <TableHead className="text-center text-black w-[10%]">Pagamento Realizado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {convites.length > 0 ? (
                            convites.map((convite) => (
                                <TableRow key={convite.IdConvite}>
                                    <TableCell>{convite.doador.Nome}</TableCell>
                                    <TableCell>{convite.evento.TituloEvento}</TableCell>
                                    <TableCell>{convite.QuantidadeConvite}</TableCell>
                                    <TableCell>
                                        <Button className="bg-white text-black hover:bg-slate-200 shadow-none"
                                            onClick={() => onOpenContato(convite.doador.IdDoador)}
                                        >
                                            <i className="fas fa-envelope"></i>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button className="bg-white text-black hover:bg-slate-200 shadow-none"
                                            onClick={() => {
                                                onConvitePago(convite.IdConvite);
                                            }}
                                        >
                                            <i className="fas fa-check-circle"></i>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">
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
