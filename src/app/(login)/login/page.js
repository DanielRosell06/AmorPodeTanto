"use client"

import Image from 'next/image';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState, useRef, setOpen } from "react";

export default function Home() {

    const [verSenha, setVerSenha] = useState(-1)

    const [emailDigitado, setEmailDigitado] = useState("")
    const [senhaDigitada, setSenhaDigitada] = useState("")

    return (
        <div className='flex  w-full h-[100vh]'>
            <div className="border w-[450px]  rounded-xl ml-auto mr-auto mt-auto mb-auto p-5">
                <Image
                    className=" mt-[5px] w-[168px] h-[100px] ml-auto mr-auto"
                    src='/Logo.png'
                    alt='Logo'
                    width={168}
                    height={100}
                    quality={100}
                />
                <h1 className='ml-auto mr-auto text-3xl text-center mt-4'>Login</h1>
                <div>
                    <h1 className='mt-4 mb-1 text-xl ml-2'>Email:</h1>
                    <Input placeholder="Email" className="w-[400px] ml-auto mr-auto"
                        onChange={(e) => {
                            setEmailDigitado(e.target.value)
                        }}
                    ></Input>
                    <h1 className='mt-4 mb-1 text-xl ml-2'>Senha:</h1>
                    <div className='flex'>
                        <Input type={verSenha == 1 ? "" : "password"} placeholder="Senha" className="w-[350px] ml-auto mr-auto"
                            onChange={(e) => {
                                setSenhaDigitada(e.target.value)
                            }}
                        ></Input>
                        <Button
                            className="w-[50px] text-black border bg-slate-50 hover:bg-slate-200"
                            onClick={() => { setVerSenha(verSenha * -1) }}
                        >
                            {verSenha != 1 ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>}
                        </Button>
                    </div>
                    <div className='flex'>
                        <Button className="bg-green-400 hover:bg-green-500 ml-auto mr-auto mt-6 text-lg text-white pl-6 pr-6 mb-5">Entrar</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
