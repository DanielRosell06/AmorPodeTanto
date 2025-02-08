"use client"

import React, { useEffect, useState, useRef, setOpen } from "react";

import { Button } from "@/components/ui/button"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function UserNavbarName() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const [NomeUsuario, setNomeUsuario] = useState(0)
    const [tipoUsuario, setTipoUsuario] = useState(0)

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe  session.user.role
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (session) {
            setNomeUsuario(session.user.name)
            setTipoUsuario(session.user.role)
        }
    }, [session, status, router]);

    return (

        <>
            <HoverCard>
                <HoverCardTrigger className=" mt-auto mb-auto ml-auto text-slate-400 text-sm hover:underline cursor-default">{NomeUsuario}</HoverCardTrigger>
                <HoverCardContent>
                    {tipoUsuario == 2 ?
                        <>
                            <h1>Olá {NomeUsuario}. Você é um usuário diretor! Acesse por aqui a área restrita à diretoria</h1>
                            <Button className="mt-2 bg-white hover:bg-slate-100 border-slate-100 text-black shadow-none border-[2px]"
                                onClick={() => router.push("/diretoria")}
                            >
                                Área da Diretoria
                            </Button>
                        </>
                        : (tipoUsuario == 1 ?
                            <>
                                <h1>Olá {NomeUsuario} Você é um Usuário Administrador, e pode cadastrar novos usuários através do botão ao lado</h1>
                            </> : (tipoUsuario == 0 &&
                                <>
                                    <h1>Olá {NomeUsuario}. Bem vindo ao sistema da ONG Não Sabia Que o Meu Amor Podia Tanto!</h1>
                                </>
                            ))}
                </HoverCardContent>
            </HoverCard>
        </>
    )
}