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
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {

  const isFirstRender = useRef(true);

  const [doador, setDoador] = useState([]);
  const [popupAdicionarDoador, setPopupAdicionarDoador] = useState(false)
  const [popupEditarDoador, setPopupEditarDoador] = useState(false)
  const [loading, setLoading] = useState(true)
  const [idToFind, setIdToFind] = useState(-1)
  const [novoDoador, setNovoDoador] = useState({
    CPFCNPJ: "",
    Nome: "",
    CEP: "",
    Numero: "",
    Contato: "",
    Telefone: "",
    Email: ""
  })

  const [doadorEditado, setDoadorEditado] = useState({
    IdDoador: "",
    CPFCNPJ: "",
    Nome: "",
    CEP: "",
    Numero: "",
    Contato: "",
    Telefone: "",
    Email: ""
  })

  const fetchLoadDoadores = async () => {
    try {
      const response = await fetch('/api/doador', {
        method: 'GET',
      });
      const data = await response.json(); // Converta a resposta para JSON
      setDoador(data); // Atualize o estado com os dados
    } catch (error) {
      console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
    }
    setLoading(false);
  }

  const fetchAdicionarDoador = async () => {
    try {
      const response = await fetch('/api/doador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoDoador) // Envia os dados do novo doador
      })
      setPopupAdicionarDoador(false) // Fecha o popup após adicionar
    } catch (error) {
      console.error('Erro ao adicionar doador:', error)
    }
  }

  const fetchEditarDoador = async () => {
    try {
      const response = await fetch('/api/doador', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doadorEditado) // Envia os dados do novo doador
      })
      setPopupEditarDoador(false) // Fecha o popup após adicionar

      setNovoDoador({
        CPFCNPJ: "",
        Nome: "",
        CEP: "",
        Numero: "",
        Contato: "",
        Telefone: "",
        Email: ""
      })

    } catch (error) {
      console.error('Erro ao adicionar doador:', error)
    }
  }

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchGetDoador = async () => {
      try {
        const response = await fetch(`api/doadorById?Id=${idToFind}`, {
          method: 'GET',
        })
        const data = await response.json();
        setDoadorEditado(data)
      } catch (error) {
        console.error('Erro ao buscar doador:', error)
      }
    }

    const fetchData = async () => {
      await fetchGetDoador();
    };
    fetchData();
  }, [idToFind]);


  // Função de carregar os doadores quando abre a pagina
  useEffect(() => {
    fetchLoadDoadores()
  }, []);



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

        

        <Table className="ml-auto mr-auto w-[95%] mt-3">
            <TableHeader className="bg-sky-400 ">
                <TableRow>
                    <TableHead className="border-slut-100 border text-white text-center">CPF / CNPJ</TableHead>
                    <TableHead className="border-slut-100 border text-white text-center">Nome</TableHead>
                    <TableHead className="border-slut-100 border text-white text-center">Endereço</TableHead>
                    <TableHead className="border-slut-100 border text-white text-center">Telefone</TableHead>
                    <TableHead className="border-slut-100 border text-white text-center w-0">Opções</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              { loading ? 
                <>
                  <TableRow className="items-center flex-col gap-1">
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                  </TableRow>
                  <TableRow className="items-center flex-col gap-1">
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                  </TableRow>
                  <TableRow className="items-center flex-col gap-1">
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                    <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                  </TableRow>
                </>
                          :
                doador.map((doador) => (
                    <TableRow key={doador.IdDoador}>
                        <TableCell className="font-medium border-slut-100 border">{doador.CPFCNPJ}</TableCell>
                        <TableCell className="border-slut-100 border">{doador.Nome}</TableCell>
                        <TableCell className="border-slut-100 border">{doador.Rua}, {doador.Numero}, {doador.Bairro}</TableCell>
                        <TableCell className="border-slut-100 border">{doador.Telefone}</TableCell>
                        <TableCell className="border-slut-100 border flex">
                          <Button className="rounded-full bg-slate-300 hover:bg-slate-400 w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1"><i className="fas fa-hand-holding-heart text-[10px]"></i></Button>
                          <Button className="rounded-full bg-slate-300 hover:bg-slate-400 w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1"><i className="fas fa-info-circle"></i></Button>
                          <Button 
                            className="rounded-full bg-slate-300 hover:bg-slate-400 w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1"
                            onClick={() => {setPopupEditarDoador(true);
                              setDoadorEditado({ ...doadorEditado, IdDoador: doador.IdDoador});
                              setIdToFind(doador.IdDoador);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button className="rounded-full bg-slate-300 hover:bg-slate-400 w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1"><i className="fas fa-ban"></i></Button>
                        </TableCell>
                    </TableRow>
                ))
              }
            </TableBody>
        </Table>



        {popupAdicionarDoador && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h1 className="text-xl font-bold mb-4">Adicionar Doador</h1>


                <div className="flex text-left">
                  <div>
                    <h1>CPF/CNPJ</h1>
                    <Input type="CPF/CNPJ" placeholder="CPF/CNPJ" className="w-[130px]" onChange={(e) => setNovoDoador({ ...novoDoador, CPFCNPJ: e.target.value })}/>
                  </div>
                  <div>
                    <h1 className="ml-2">Nome</h1>
                    <Input type="Name" placeholder="Nome" className="w-[263px] ml-2" onChange={(e) => setNovoDoador({ ...novoDoador, Nome: e.target.value })}/>
                  </div>
                </div>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1 className="text-left">CEP</h1>
                    <Input type="CEP" placeholder="CEP" className="w-[110px]" onChange={(e) => setNovoDoador({ ...novoDoador, CEP: e.target.value })}/>
                  </div>
                  <div>
                    <h1 className="ml-2 text-left">Número</h1>
                    <Input type="Numero" placeholder="Número" className="w-[90px] ml-2" onChange={(e) => setNovoDoador({ ...novoDoador, Numero: e.target.value })}/>
                  </div>
                </div>
                <h1 className="mt-5 text-left">Complemento</h1>
                <Input type="Complemento" placeholder="Complemento" className="w-[400px]" onChange={(e) => setNovoDoador({ ...novoDoador, Complemento: e.target.value })}/>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1 className="text-left">Nome do Contato</h1>
                    <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[220px]" onChange={(e) => setNovoDoador({ ...novoDoador, Contato: e.target.value })}/>
                  </div>
                  <div className="ml-5">
                    <h1 className="ml-2 text-left">Telefone</h1>
                    <Input type="Telefone" placeholder="Telefone" className="w-[150px] ml-2" onChange={(e) => setNovoDoador({ ...novoDoador, Telefone: e.target.value })}/>
                  </div>
                </div>
                <h1 className="mt-5 text-left">E-mail</h1>
                <Input type="email" placeholder="E-mail" className="w-[400px]" onChange={(e) => setNovoDoador({ ...novoDoador, Email: e.target.value })}/>

                <hr className="mt-4"></hr>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                  onClick={fetchAdicionarDoador}
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
        
        {popupEditarDoador && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h1 className="text-xl font-bold mb-4">Editar Doador</h1>


                <div className="flex text-left">
                  <div>
                    <h1>CPF/CNPJ</h1>
                    <Input type="CPF/CNPJ" placeholder="CPF/CNPJ" className="w-[130px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, CPFCNPJ: e.target.value })} value={doadorEditado.CPFCNPJ || ''}/>
                  </div>
                  <div>
                    <h1 className="ml-2">Nome</h1>
                    <Input type="Name" placeholder="Nome" className="w-[263px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Nome: e.target.value })} value={doadorEditado.Nome || ''}/>
                  </div>
                </div>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1 className="text-left">CEP</h1>
                    <Input type="CEP" placeholder="CEP" className="w-[110px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, CEP: e.target.value })} value={doadorEditado.CEP || ''}/>
                  </div>
                  <div>
                    <h1 className="ml-2 text-left">Número</h1>
                    <Input type="Numero" placeholder="Número" className="w-[90px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Numero: e.target.value })} value={doadorEditado.Numero || ''}/>
                  </div>
                </div>
                <h1 className="mt-5 text-left">Complemento</h1>
                <Input type="Complemento" placeholder="Complemento" className="w-[400px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Complemento: e.target.value })} value={doadorEditado.Complemento || ''}/>

                <hr className="mt-4"></hr>

                <div className="flex mt-4">
                  <div>
                    <h1 className="text-left">Nome do Contato</h1>
                    <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[220px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Contato: e.target.value })} value={doadorEditado.Contato || ''}/>
                  </div>
                  <div className="ml-5">
                    <h1 className="ml-2 text-left">Telefone</h1>
                    <Input type="Telefone" placeholder="Telefone" className="w-[150px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Telefone: e.target.value })} value={doadorEditado.Telefone || ''}/>
                  </div>
                </div>
                <h1 className="mt-5 text-left">E-mail</h1>
                <Input type="email" placeholder="E-mail" className="w-[400px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Email: e.target.value })} value={doadorEditado.Email || ''}/>

                <hr className="mt-4"></hr>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                  onClick={fetchEditarDoador}
                >
                  Confirmar
                </button>
                
                <button
                  className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                  onClick={() => setPopupEditarDoador(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
  