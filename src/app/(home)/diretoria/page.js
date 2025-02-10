
"use client"

import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import React, { useEffect, useState, useRef, setOpen } from "react";

export default function Diretoria() {

    const [activeSection, setActiveSection] = useState(0)


    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (!session) {
            router.push("/login");
        } else {
            if (session.user.role < 2) {
                router.push("/inicio");
            }
        }
    }, [session, status, router]);

    if (status === "loading") {
        return null; // Ou um carregando, enquanto a sessão é carregada
    }

    return (
        <>
            <div className="flex mt-6 h-[60px]">
                <Link href={"/inicio"}>
                    <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full ml-8 mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
                </Link>
                <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Área da Diretoria</h1>
            </div>
            <div className="w-full h-[80px] flex flex-col items-center relative">
                <div className="flex gap-[10px]">
                    <Button
                        className="bg-white shadow-none text-black rounded-none w-[200px] hover:bg-pink-100"
                        onClick={() => setActiveSection(0)}
                    >
                        Doadores em Potencial
                    </Button>
                    <Button
                        className="bg-white shadow-none text-black rounded-none w-[200px] hover:bg-pink-100"
                        onClick={() => setActiveSection(1)}
                    >
                        Eventos
                    </Button>
                </div>

                {/* Barra animada abaixo do botão ativo */}
                <motion.div
                    className="w-[200px] h-[2px] bg-pink-200 absolute mt-[35px]"
                    initial={false}
                    animate={{
                        x: activeSection === 0 ? "-105px" : "105px", // Movimenta de um botão para o outro
                    }}
                    transition={{ type: "spring", stiffness: 1000, damping: 100 }}
                />
            </div>
            {activeSection == 0 ? (
                <div className="ml-8 mr-8 flex justify-between">
                    <div>
                        <div className="flex mb-2">
                            <Input className="w-[250px] mr-[1px]" placeholder="Pesquisar"></Input>
                            <Select onValueChange={(value) => {
                                //setOrdenacao(value);
                            }}>
                                <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-[140px] mr-[1px]">
                                    <i className="fas fa-sort"></i>
                                    <SelectValue placeholder="Pesquisar Por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nome">Nome</SelectItem>
                                    <SelectItem value="CPFCNPJ">CPF / CNPJ</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => {
                                //setOrdenacao(value);
                            }}>
                                <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-[218px]">
                                    <i className="fas fa-sort"></i>
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nenhum">Nenhum</SelectItem>
                                    <SelectItem value="adicionadoRecente">Adicionado mais recente</SelectItem>
                                    <SelectItem value="adicionadoAntigo">Adicionado mais Antigo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <ScrollArea className="h-[350px]">
                            <Table className="w-[46vw]">
                                <TableHeader>
                                    <TableRow className>
                                        <TableHead className="w-[150px] text-center text-black">CPF / CNPJ</TableHead>
                                        <TableHead className="text-center text-black">Nome</TableHead>
                                        <TableHead className="w-[160px] text-center text-black">Opções</TableHead>
                                        <TableHead className="w-[30px] text-center text-black">
                                            <Button className="bg-green-400 rounded-none text-2xl w-[35px] h-[35px] hover:bg-green-500">+</Button>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="text-center">482.826.758-14</TableCell>
                                        <TableCell className="text-center">Banco Itaú</TableCell>
                                        <TableCell className="text-center]">
                                            <Button className="rounded-full w-[33px] h-[33px] bg-slate-400 hover:bg-slate-500"><i className="fas fa-hand-holding-heart"></i></Button>
                                            <Button className="rounded-full w-[33px] h-[33px] bg-slate-400 hover:bg-slate-500 ml-[3px]"><i className="fas fa-info-circle"></i></Button>
                                            <Button className="rounded-full w-[33px] h-[33px] bg-slate-400 hover:bg-slate-500 ml-[3px]"><i className="fas fa-user-plus"></i></Button>
                                            <Button className="rounded-full w-[33px] h-[33px] bg-slate-400 hover:bg-slate-500 ml-[3px]"><i className="fas fa-edit"></i></Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                    <div className="w-[46vw]">
                        <div className="mb-2">
                            <Select onValueChange={(value) => {
                                //setOrdenacao(value);
                            }}>
                                <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-full">
                                    <i className="fas fa-sort"></i>
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nenhum">Nenhum</SelectItem>
                                    <SelectItem value="adicionadoRecente">Adicionado mais recente</SelectItem>
                                    <SelectItem value="adicionadoAntigo">Adicionado mais Antigo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <ScrollArea className="h-[350px]">
                            <div className=" rounded-md border-[1px] flex h-[200px] p-3 justify-between mb-4">
                                <div className="w-[60%] h-[10px]">
                                    <h1 className=" text-3xl mb-3">Banco Itaú</h1>
                                    <ScrollArea className="h-[130px]">
                                        <h1>Sunt nostrud aliqua adipisicing anim laborum eu tempor. Deserunt consectetur laboris occaecat dolor consequat veniam tempor ullamco proident duis excepteur minim voluptate nulla. Occaecat sint adipisicing nisi ullamco adipisicing eu enim. Duis ad esse nulla do excepteur culpa qui culpa ut. Laborum minim proident nisi qui Lorem cillum esse.</h1>
                                    </ScrollArea>
                                </div>
                                <div className="w-[30%]">
                                    <h1 className="text-2xl">R$10.000,00</h1>
                                    <h1 className="text-lg mb-2">Feita em: 25/10/2025</h1>
                                    <Button className="bg-white border shadow-none text-black hover:bg-slate-100">Ver Doador</Button>
                                    <Button className="bg-white border shadow-none text-black hover:bg-slate-100 mt-1">Editar Doação</Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            ) : (activeSection == 1 ?
                <div>

                </div>
                : ""
            )}
        </>
    )
}