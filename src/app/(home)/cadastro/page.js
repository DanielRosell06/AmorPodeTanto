"use client"

import Image from 'next/image';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState, useRef, setOpen } from "react";
import Link from 'next/link';

import { toast } from "sonner"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Home() {



    const [verSenha, setVerSenha] = useState(-1)

    const [emailDigitado, setEmailDigitado] = useState("")
    const [senhaDigitada, setSenhaDigitada] = useState("")
    const [nomeDigitado, setNomeDigitado] = useState("")
    const [tipoSelecionado, setTipoSelecionado] = useState(0)

    const fetchAdicionarUsuario = async () => {
        const usuario = {
            NomeUsuario: nomeDigitado,
            EmailUsuario: emailDigitado,
            SenhaUsuario: senhaDigitada,
            TipoUsuario: tipoSelecionado
        };

        try {
            const response = await fetch('/api/logincadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            const data = await response.json();

            if (!response.ok) {
                toast("Erro ao criar o Usuário!", {
                    description: `Erro no Servidor.`,
                })
                throw new Error(`Erro na requisição: ${response.status}`);
            } else {
                toast("Usuário Criado!", {
                    description: `O usuário ${nomeDigitado} foi criado com sucesso!`,
                })
            }
            setEmailDigitado("")
            setSenhaDigitada("")
            setNomeDigitado("")
            setTipoSelecionado(0)

        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
        }
    };

    return (
        <div className='w-full h-[80vh]'>
            <div className="flex mt-0 h-[60px] float-start">
                <Link href={"/inicio"}>
                    <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full ml-8 mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
                </Link>
                <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Cadastro</h1>
            </div>
            <div className="border w-[450px]  rounded-xl ml-auto mr-auto mb-auto p-5 mt-6">
                <Image
                    className=" mt-[5px] w-[168px] h-[100px] ml-auto mr-auto"
                    src='/Logo.png'
                    alt='Logo'
                    width={168}
                    height={100}
                    quality={100}
                />
                <h1 className='ml-auto mr-auto text-3xl text-center mt-4'>Cadastro</h1>
                <div>
                    <div>
                        <h1 className='mt-4 mb-1 text-xl ml-2'>Nome:</h1>
                        <Input placeholder="Nome" className="w-[400px] ml-auto mr-auto"
                            value={nomeDigitado}
                            onChange={(e) => {
                                setNomeDigitado(e.target.value)
                            }}
                        ></Input>
                    </div>
                    <div>
                        <h1 className='mt-4 mb-1 text-xl ml-2'>Email:</h1>
                        <Input placeholder="Email" className="w-[400px] ml-auto mr-auto"
                            value={emailDigitado}
                            onChange={(e) => {
                                setEmailDigitado(e.target.value)
                            }}
                        ></Input>
                    </div>
                    <h1 className='mt-4 mb-1 text-xl ml-2'>Senha:</h1>
                    <div className='flex'>
                        <Input type={verSenha == 1 ? "" : "password"} placeholder="Senha" className="w-[180px] ml-auto mr-auto"
                            value={senhaDigitada}
                            onChange={(e) => {
                                setSenhaDigitada(e.target.value)
                            }}
                        ></Input>
                        <Button
                            className="w-[50px] text-black border bg-slate-50 hover:bg-slate-200"
                            onClick={() => { setVerSenha(verSenha * -1) }}
                        >
                            {verSenha != 1 ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                        </Button>

                        <Select
                            value={tipoSelecionado}
                            onValueChange={(value) => {
                                setTipoSelecionado(value);
                            }}>
                            <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black ml-5 w-[150px]">
                                <h1>Tipo: </h1>
                                <SelectValue placeholder="Tipo de Usuário" />
                            </SelectTrigger>
                            <SelectContent className="p-2">
                                <h1 className='mb-1'>Normal: Pode adicionar doador, adicionar doação, criar produto, imprimir ficha</h1>
                                <h1 className='mb-1'>Administrador: Faz tudo que o Normal faz + Cadastra novos usuários</h1>
                                <h1 className='mb-1'>Diretor: Faz tudo que o Administrador faz + Pode acessar Doadores em Potencial</h1>
                                <SelectItem value={0} >Normal</SelectItem>
                                <SelectItem value={1}>Administrador</SelectItem>
                                <SelectItem value={2}>Diretor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex'>
                        <Button className="bg-green-400 hover:bg-green-500 ml-auto mr-auto mt-6 text-lg text-white pl-6 pr-6 mb-5"
                            onClick={fetchAdicionarUsuario}
                        >Cadastrar</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
