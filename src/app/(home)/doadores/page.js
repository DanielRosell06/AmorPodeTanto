"use client"

import TabelaDoadoresDiretoria from "@/components/TabelaDoadoresDiretoria";
import BotaoInicio from "@/components/BotaoInicio";

import React, { useEffect, useState, useRef, setOpen } from "react";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  //HTML de retorno
  return (
    <div className="text-center">
      <BotaoInicio>Doadores</BotaoInicio>
      <TabelaDoadoresDiretoria>{0}</TabelaDoadoresDiretoria>
    </div>
  )
}