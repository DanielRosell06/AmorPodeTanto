"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
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
    //Variaveis de Loading
    const[loading, setLoading] = useState(true)

    //Variaveis de Popup
    const [popupAdicionarProduto, setPopupAdicionarProduto] = useState(false)
    const [popupEditarProduto, setPopupEditarProduto] = useState(false)
    const [popupDeletarProduto, setPopupDeletarProduto] = useState(false)

    //Variaveis de Procura de procura
    const [idToDelete, setIdToDelete] = useState(-1)
    const [idToEditar, setIdToEditar] = useState(-1)
    const [nomePesquisa, setNomePesquisa] = useState('')

    //Variaveis de Atualização
    const [varAtualizaLista, setVarAtualizaLista] = useState(-1)

    //Variaveis de lista
    const [produto, setProduto] = useState([]);

    //Variavel de inputs
    const [produtoEditar, setProdutoEditar] = useState({
        IdProduto: "",
        Nome: "",
        UN: ""
    })

    const [novoProduto, setNovoProduto] = useState({
        Nome: "",
        UN: ""
    })


    //Funções normais
    const atualizarLista = () => {
        setVarAtualizaLista(varAtualizaLista * -1)
        setLoading(true)
    }


    //Funções de fetch
    const fetchAdicionarProduto = async () => {
        try {
            const response = await fetch(`/api/produto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoProduto) // Envia os dados do novo doador
            })
            setPopupAdicionarProduto(false) // Fecha o popup após adicionar
            setNovoProduto({
                Nome: "",
                UN: ""
            })
            atualizarLista()
        } catch (error) {
            console.error('Erro ao adicionar doador:', error)
        }
    }

    const fetchDeletarProduto = async () => {
        try {
            const response = await fetch(`/api/produto?IdToDelete=${idToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoProduto) // Envia os dados do novo doador
            })
            setPopupDeletarProduto(false) // Fecha o popup após adicionar
            atualizarLista()
        } catch (error) {
            console.error('Erro ao adicionar doador:', error)
        }
    }

    const fetchEditarProduto = async () => {
        try {
            const response = await fetch(`/api/produto`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoEditar)
            });
            const data = await response.json();
            setIdToEditar(-1)
            setPopupEditarProduto(false);
            setProdutoEditar({
                IdProduto: "",
                Nome: "",
                UN: ""
            })        
        } catch (error) {
            console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
        }
        setLoading(false);
    }

    useEffect(() => {

        if (idToEditar == -1){
            return
        }

        const fetchLoadProdutoToEdit = async () => {
            try {
                const response = await fetch(`/api/produto?IdToGet=${idToEditar}`, {
                    method: 'GET',
                });
                const data = await response.json(); // Converta a resposta para JSON
                setProdutoEditar(data); // Atualize o estado com os dados
                setIdToEditar(-1)
            } catch (error) {
                console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
            }
            setLoading(false);
        }

        fetchLoadProdutoToEdit()

    }, [idToEditar]);


    useEffect(() => {
        const fetchLoadProdutos = async () => {
          try {
            const response = await fetch(`/api/produto?nomeSearch=${nomePesquisa}`, {
              method: 'GET',
            });
            const data = await response.json(); // Converta a resposta para JSON
            setProduto(data); // Atualize o estado com os dados
          } catch (error) {
            console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
          }
          setLoading(false);
        }
    
        fetchLoadProdutos()
      }, [varAtualizaLista, nomePesquisa]);


    return(
        <div className="ml-8">

            <div className="flex mt-6 h-[60px]">
                <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
                <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Produtos</h1>
            </div>

            <div className="flex mt-6 mb-3 justify-center">
                <Input className="w-[230px] mr-2" placeholder="Pesquisar"
                    onChange={(e) => {
                        setNomePesquisa(e.target.value)
                        setLoading(true)
                    }}
                ></Input>

                <Button className="bg-green-400 text-black hover:bg-green-600"
                    onClick={() => {
                        setPopupAdicionarProduto(true)
                    }}
                >
                    + Adidionar Produto
                </Button>
            </div>


            <div className=" flex w-full justify-center">
                <Table className="w-[440px] ml-auto mr-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] border-r">Nome</TableHead>
                            <TableHead className="w-[120px] border-r">Unidade Padrão</TableHead>
                            <TableHead className="w-[120px]">Opções</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? 
                        <>
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
                            <TableRow>
                                <TableCell className="font-medium border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                <TableCell className="border-r"><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                                <TableCell className=""><Skeleton className="h-9 w-[100%]"></Skeleton></TableCell>
                            </TableRow>
                        </>
                        :
                        <>
                            {produto.map((produto) => (
                                <TableRow key={produto.IdProduto}>
                                    <TableCell className="font-medium border-r">{produto.Nome}</TableCell>
                                    <TableCell className="border-r">{produto.UN}</TableCell>
                                    <TableCell className="">
                                        <Button className=" rounded-full bg-slate-300 hover:bg-slate-400 w-[35px] h-[35px] "
                                            onClick={() => {
                                                setIdToEditar(produto.IdProduto)
                                                setProdutoEditar({...produtoEditar, IdProduto: produto.IdProduto})
                                                setPopupEditarProduto(true)
                                            }}
                                        ><i className="fas fa-edit"></i></Button>
                                        <Button className=" rounded-full bg-slate-300 hover:bg-red-400 w-[35px] h-[35px] ml-1"
                                            onClick={() => {
                                                setIdToDelete(produto.IdProduto)
                                                setPopupDeletarProduto(true)
                                            }}
                                        ><i className="fas fa-trash"></i></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                        }
                    </TableBody>
                </Table>
            </div>
            


            {popupAdicionarProduto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h1 className="text-xl font-bold mb-4 text-center">Adicionar Produto</h1>
        
        
                        <div className="flex text-left">
                            <div>
                                <h1>Nome</h1>
                                <Input type="CPF/CNPJ" placeholder="Nome" className="w-[223px]" onChange={(e) => setNovoProduto({ ...novoProduto, Nome: e.target.value })}/>
                            </div>
                            <div>
                                <h1 className="ml-2">Unidade</h1>
                                <Input type="Name" placeholder="Unidade (kg, L, etc.)" className="w-[170px] ml-2" onChange={(e) => setNovoProduto({ ...novoProduto, UN: e.target.value })}/>
                            </div>
                        </div>
        
                        <hr className="mt-4 mb-4"></hr>

                        <div>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                onClick={fetchAdicionarProduto}
                            >
                                Confirmar
                            </button>
                            
                            <button
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                onClick={() => setPopupAdicionarProduto(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {popupEditarProduto && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h1 className="text-xl font-bold mb-4 text-center">Editar Produto</h1>

                <div className="flex text-left">
                    <div>
                    <h1>Nome</h1>
                    <Input 
                        type="text" 
                        placeholder="Nome" 
                        className="w-[223px]" 
                        onChange={(e) => setProdutoEditar({ ...produtoEditar, Nome: e.target.value })} 
                        value={produtoEditar.Nome || ''}
                    />
                    </div>
                    <div>
                    <h1 className="ml-2">Unidade</h1>
                    <Input 
                        type="text" 
                        placeholder="Unidade (kg, L, etc.)" 
                        className="w-[170px] ml-2" 
                        onChange={(e) => setProdutoEditar({ ...produtoEditar, UN: e.target.value })} 
                        value={produtoEditar.UN || ''}
                    />
                    </div>
                </div>

                <hr className="mt-4 mb-4"></hr>

                <div>
                    <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                    onClick={fetchEditarProduto}
                    >
                    Confirmar
                    </button>
                    
                    <button
                    className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                    onClick={() => {setPopupEditarProduto(false)
                    setProdutoEditar({
                        IdProduto: "",
                        Nome: "",
                        UN: ""
                    })   
                    }}
                    >
                    Cancelar
                    </button>
                </div>
                </div>
            </div>
            )}


            {popupDeletarProduto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">

                        <h1 className="text-xl font-bold mb-4 text-center">Deletar Produto</h1>

                        <div className="flex text-left">
                            Você tem certeza que deseja deletar este produto?
                        </div>
        
                        <hr className="mt-4 mb-4"></hr>

                        <div>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                onClick={fetchDeletarProduto}
                            >
                                Confirmar
                            </button>
                            
                            <button
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                onClick={() => setPopupDeletarProduto(false)}
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