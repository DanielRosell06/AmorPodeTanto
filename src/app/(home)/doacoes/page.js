"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState, useRef, setOpen } from "react";
import InterfaceDoacoes from "@/components/InterfaceDoacoes";
import Link from 'next/link';


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BotaoInicio from "@/components/BotaoInicio";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (!session) {
            router.push("/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return null; // Ou um carregando, enquanto a sessão é carregada
    }

    return (
        <div className="ml-8">
            <div className="flex  mb-5 justify-between">
                <BotaoInicio>Doações</BotaoInicio>
            </div>
            <InterfaceDoacoes></InterfaceDoacoes>
        </div>
    )
}