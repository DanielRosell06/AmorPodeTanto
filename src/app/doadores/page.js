"use client"

import { Button } from "@/components/ui/button"
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
import React, { useState } from "react";
import { Input } from "@/components/ui/input"

const invoices = [
  {
    invoice: "482.826.758-14",
    paymentStatus: "Daniel Aniceto Rosell",
    totalAmount: "(11) 99380-9760",
    paymentMethod: "Rua Helena Maria, 122, Jardin Santa Mena",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]



export default function Home() {

  const [popupAdicionarDoador, setPopupAdicionarDoador] = useState(false)

  return (
    <div className="text-center">
        <div className="flex mt-6 h-[60px]">
            <button className="w-[50px] h-[50px] bg-slate-200 rounded-full ml-8 mt-auto mb-auto"><i className="fas fa-arrow-left"></i></button>
            <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Doadores</h1>
        </div>

        <div className="flex">
            <Button 
              variant="outline" 
              className="rounded-lg ml-8 mt-6 px-3 py-1 bg-emerald-400 border-none hover:bg-emerald-500" 
              onClick={() => setPopupAdicionarDoador(true)}
            >
                + Adicionar Doador
            </Button>
        </div>

        {popupAdicionarDoador && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h1 className="text-xl font-bold mb-4">Adicionar Doador</h1>


                <div className="flex text-left">
                  <div>
                    <h1>CPF</h1>
                    <Input type="CPF" placeholder="CPF" className="w-[130px]"/>
                  </div>
                  <div>
                    <h1 className="ml-2">Nome</h1>
                    <Input type="Name" placeholder="Nome" className="w-[263px] ml-2"/>
                  </div>
                </div>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1>CPF</h1>
                    <Input type="CEP" placeholder="CEP" className="w-[110px]"/>
                  </div>
                  <div>
                    <h1 className="ml-2">Número</h1>
                    <Input type="Numero" placeholder="Número" className="w-[90px] ml-2"/>
                  </div>
                </div>
                <h1 className="mt-5">Complemento</h1>
                <Input type="Complemento" placeholder="Complemento" className="w-[400px]"/>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1>Nome do Contato</h1>
                    <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[110px]"/>
                  </div>
                  <div>
                    <h1 className="ml-2">Telefone</h1>
                    <Input type="Telefone" placeholder="Telefone" className="w-[90px] ml-2"/>
                  </div>
                </div>
                <h1 className="mt-5">E-mail</h1>
                <Input type="email" placeholder="E-mail" className="w-[400px]"/>

                <hr className="mt-4"></hr>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                  onClick={() => setPopupAdicionarDoador(false)}
                >
                  Confirmar
                </button>
                
                <button
                  className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                  onClick={() => setPopupAdicionarDoador(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        

        <Table className="ml-auto mr-auto w-[95%] mt-3">
            <TableHeader className="bg-sky-400 ">
                <TableRow>
                    <TableHead className="border-slut-100 border text-white">CPF / CNPJ</TableHead>
                    <TableHead className="border-slut-100 border text-white">Nome</TableHead>
                    <TableHead className="border-slut-100 border text-white">Endereço</TableHead>
                    <TableHead className="border-slut-100 border text-white">Telefone</TableHead>
                    <TableHead className="border-slut-100 border text-white">Opções</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium border-slut-100 border">{invoice.invoice}</TableCell>
                    <TableCell className="border-slut-100 border">{invoice.paymentStatus}</TableCell>
                    <TableCell className="border-slut-100 border">{invoice.paymentMethod}</TableCell>
                    <TableCell className="border-slut-100 border">{invoice.totalAmount}</TableCell>
                    <TableCell className="border-slut-100 border">{invoice.totalAmount}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </div>
  )
}
  