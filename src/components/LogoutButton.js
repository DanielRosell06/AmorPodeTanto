"use client"

import { signOut } from "next-auth/react";

import React, { useEffect, useState, useRef, setOpen } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LogoutButton() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const [tipoUsuario, setTipoUsuario] = useState(0)

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe  session.user.role
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (session) {
            setTipoUsuario(session.user.role)
        }
    }, [session, status, router]);

    return (

        <>
            <button
                onClick={() => {signOut(); router.push("/login")}}
                className="mt-auto mb-auto hover:underline mr-8 ml-auto text-slate-400 hover:text-black"
            >
                Sair
            </button>
            {tipoUsuario < 1 ? "" :
                <>
                    <button
                        onClick={() => { router.push("/cadastro"); }}
                        className="mt-auto mb-auto text-slate-400 hover:text-black hover:underline mr-10"
                    >
                        Cadastrar Usuário
                    </button>

                </>
            }
        </>
    )
}