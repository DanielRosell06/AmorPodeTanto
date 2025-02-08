
"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


import React, { useEffect, useState, useRef, setOpen } from "react";

export default function Diretoria() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (!session) {
            router.push("/login");
        } else {
            if (session.user.role < 2){
                router.push("/inicio");
            }
        }
    }, [session, status, router]);

    if (status === "loading") {
        return null; // Ou um carregando, enquanto a sessão é carregada
    }

    return (
        <>
        
        </>
    )
}