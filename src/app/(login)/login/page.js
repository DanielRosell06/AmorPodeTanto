"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

export default function Login() {

    const [verSenha, setVerSenha] = useState(-1);

    const [carregando, setCarregando] = useState(false)

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password: senha,
        });

        setCarregando(false)

        if (result.error) {
            setErro("Email ou senha incorretos!");
        } else {
            router.push("/inicio");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
            setCarregando(true)
        }
    };

    return (
        <div className="flex w-full h-[100vh]">
            <div className="border w-[450px] rounded-xl ml-auto mr-auto mt-auto mb-auto p-5">
                <Image
                    className=" mt-[5px] w-[168px] h-[100px] ml-auto mr-auto"
                    src='/Logo.png'
                    alt='Logo'
                    width={168}
                    height={100}
                    quality={100}
                />
                <h1 className="text-3xl text-center mt-4">Login</h1>
                <div onKeyDown={handleKeyDown}>
                    <h1 className="mt-4 mb-1 text-xl ml-2">Email:</h1>
                    <Input
                        placeholder="Email"
                        className="w-[400px] ml-auto mr-auto"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <h1 className="mt-4 mb-1 text-xl ml-2">Senha:</h1>
                    <div className="flex">
                        <Input
                            type={verSenha == 1 ? "" : "password"}
                            placeholder="Senha"
                            className="w-[400px] ml-auto mr-auto"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <Button
                            className="w-[50px] text-black border bg-slate-50 hover:bg-slate-200 ml-2"
                            onClick={() => { setVerSenha(verSenha * -1) }}
                        >
                            {verSenha != 1 ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                        </Button>
                    </div>
                    {carregando && <p className="text-slate-500">Procurando...</p>}
                    {erro && <p className="text-red-500">{erro}</p>}
                    <Button
                        className="bg-green-400 hover:bg-green-500 mt-6 text-lg text-white w-full"
                        onClick={() => {
                            handleLogin();
                            setCarregando(true);
                        }}
                    >
                        Entrar
                    </Button>
                </div>
            </div>
        </div>
    );
}
