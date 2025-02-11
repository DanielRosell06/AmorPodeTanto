"use client"

import TabelaDoadoresDiretoria from "@/components/TabelaDoadoresDiretoria";
import BotaoInicio from "@/components/BotaoInicio";

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useEffect, useState, useRef, setOpen } from "react";


export default function Diretoria() {
    
    const [activeSection, setActiveSection] = useState(0)
    
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Verifica se a sessão ainda está carregando ou se não existe
        if (status === "loading") return; // Não faz nada enquanto carrega
        if (!session) {
            router.push("/login");
        } else {
            if (session.user.role < 2) {
                router.push("/inicio");
            }
        }
    }, [session, status, router]);

    if (status === "loading") {
        return null; // Ou um carregando, enquanto a sessão é carregada
    }

    return (
        <div className="text-center">
            <BotaoInicio>Área da Diretoria</BotaoInicio>
            <div className="w-full h-[80px] flex flex-col items-center relative">
                <div className="flex gap-[10px]">
                    <Button
                        className="bg-white shadow-none text-black rounded-none w-[200px] hover:bg-pink-100 text-lg"
                        onClick={() => setActiveSection(0)}
                    >
                        Doadores em Potencial
                    </Button>
                    <Button
                        className="bg-white shadow-none text-black rounded-none w-[200px] hover:bg-pink-100 text-lg"
                        onClick={() => setActiveSection(1)}
                    >
                        Eventos
                    </Button>
                </div>

                {/* Barra animada abaixo do botão ativo */}
                <motion.div
                    className="w-[200px] h-[2px] bg-pink-200 absolute mt-[35px]"
                    initial={false}
                    animate={{
                        x: activeSection === 0 ? "-105px" : "105px", // Movimenta de um botão para o outro
                    }}
                    transition={{ type: "spring", stiffness: 1000, damping: 100 }}
                />
            </div>

            {activeSection == 0 &&
                <>
                    <TabelaDoadoresDiretoria>{1}</TabelaDoadoresDiretoria>
                </>
            }
        </div>
    )
}