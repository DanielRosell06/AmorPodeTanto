"use client"

import React, { useEffect, useState, useRef, setOpen } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function UserNavbarName() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const [NomeUsuario, setNomeUsuario] = useState(0)

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe  session.user.role
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (session) {
            setNomeUsuario(session.user.name)
        }
    }, [session, status, router]);

    return (

        <>
            <h1 className=" mt-auto mb-auto ml-auto text-slate-400 text-sm">{NomeUsuario}</h1>
        </>
    )
}