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
                className="text-sm mt-auto mb-auto hover:bg-slate-100 mr-3 ml-8 text-slate-400 hover:text-black border pl-3 pr-3 pt-1 pb-1 rounded-sm"
            >
                Sair
            </button>
            {tipoUsuario < 1 ? "" :
                <>
                    <button
                        onClick={() => { router.push("/cadastro"); }}
                        className="text-sm mt-auto mb-auto hover:bg-slate-100 mr-8  text-slate-400 hover:text-black border pl-3 pr-3 pt-1 pb-1 rounded-sm"
                    >
                        Cadastrar Usuário
                    </button>

                </>
            }
        </>
    )
}