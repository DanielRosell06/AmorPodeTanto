"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useEffect, useState, useRef, setOpen } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



export default function Home() {

    

    return(
        <div className="ml-8">
            <div className="flex mt-6 h-[60px] mb-3">
                <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
                <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Doações</h1>
            </div>
            <div className="flex justify-between">
                <div className="w-[60%] ml-auto mr-auto">
                    <div className="flex justify-between mb-3">
                        <Button className=" w-[32%] bg-slate-500 hover:bg-slate-600">Ordenar Por</Button>
                        <Button className=" w-[32%] bg-slate-500 hover:bg-slate-600">Filtrar</Button>
                        <Button className=" w-[32%] bg-green-400 hover:bg-green-500">Adicionar Doação</Button>
                    </div>
                    <div className="flex justify-between mb-3">
                        <Input placeholder="Pesquisar " className=" w-[66%]"></Input>
                        <Button className=" w-[32%] bg-slate-500 hover:bg-slate-600">Pesquisar Por</Button>
                    </div>
                    <div className="h-[58vh]">
                        <ScrollArea className="border-none rounded-none h-[100%]">
                            <div className="flex pt-3 pl-4 pb-3 pr-4 rounded-xl border mb-5">
                                <div className="w-[50%]">
                                    <div className="flex">
                                        <h1 className="text-lg text-slate-300">Status: </h1>
                                        <h1 className="font-bold text-yellow-500 text-xl ml-1">Pendente</h1>
                                    </div>
                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="font-bold text-lg mt-3 mb-2">Informações do Doador</h1>
                                        <h1>Nome: Daniel Aniceto Rosell</h1>
                                        <h1>Endereço: Rua José Maria Pinto Villares, 122, Jardin Santa Mena</h1>
                                        <h1>Telefone: (11) 93809760</h1>
                                        <Button className=" bg-white text-black border border-slate-300 hover:bg-slate-300 text-sm mt-2 w-36">Mais Informações</Button>
                                    </div>
                                </div>
                                <div className="text-right w-[50%]">
                                    <div className="flex justify-end">
                                        <h1 className="text-lg text-slate-300">Data: </h1>
                                        <h1 className=" text-black text-lg ml-1">08/07/2006</h1>
                                    </div>
                                    <ScrollArea className="h-[168px] mt-3">
                                        <Table className=" ml-auto mr-auto text-center">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px] border-r text-center">Nome</TableHead>
                                                    <TableHead className="w-[90px] border-r text-center">Quantidade</TableHead>
                                                    <TableHead className="w-[90px] text-center">Unidade</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r">Arroz</TableCell>
                                                    <TableCell className="border-r">2</TableCell>
                                                    <TableCell className="">kg</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className="border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className=""><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className="border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className=""><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                    <Button className="bg-green-400 mt-4">Imprimir Ficha de Retirada</Button>
                                </div>
                            </div>
                            <div className="flex pt-3 pl-4 pb-3 pr-4 rounded-md border">
                                <div className="w-[50%]">
                                    <div className="flex">
                                        <h1 className="text-lg text-slate-300">Status: </h1>
                                        <h1 className="font-bold text-yellow-500 text-xl ml-1">Pendente</h1>
                                    </div>
                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="font-bold text-lg mt-3 mb-2">Informações do Doador</h1>
                                        <h1>Nome: Daniel Aniceto Rosell</h1>
                                        <h1>Endereço: Rua José Maria Pinto Villares, 122, Jardin Santa Mena</h1>
                                        <h1>Telefone: (11) 93809760</h1>
                                        <Button className=" bg-white text-black border border-slate-300 hover:bg-slate-300 text-sm mt-2 w-36">Mais Informações</Button>
                                    </div>
                                </div>
                                <div className="text-right w-[50%]">
                                    <div className="flex justify-end">
                                        <h1 className="text-lg text-slate-300">Data: </h1>
                                        <h1 className=" text-black text-lg ml-1">08/07/2006</h1>
                                    </div>
                                    <ScrollArea className="h-[168px] mt-3">
                                        <Table className=" ml-auto mr-auto text-center">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px] border-r text-center">Nome</TableHead>
                                                    <TableHead className="w-[90px] border-r text-center">Quantidade</TableHead>
                                                    <TableHead className="w-[90px] text-center">Unidade</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r">Arroz</TableCell>
                                                    <TableCell className="border-r">2</TableCell>
                                                    <TableCell className="">kg</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className="border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className=""><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className="border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                    <TableCell className=""><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                    <Button className="bg-green-400 mt-4">Imprimir Ficha de Retirada</Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    )
}