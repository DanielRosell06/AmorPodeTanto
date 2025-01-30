"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useEffect, useState, useRef, setOpen } from "react";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, ChevronsUpDown } from "lucide-react"

import Link from 'next/link';

import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const frameworks = [
    {
        value: '3',
        label: "Cancelado",
    },
    {
        value: '0',
        label: "Agendado",
    },
    {
        value: '1',
        label: "Retirado",
    },
]

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {


    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [semiValue, setSemiValue] = React.useState("")

    const [dateAgenda, setDateAgenda] = React.useState();
    const [dateRetirado, setDateRetirado] = React.useState();
    const [semiDateAgenda, setSemiDateAgenda] = React.useState();
    const [semiDateRetirado, setSemiDateRetirado] = React.useState();

    const [loading, setLoading] = useState(true)
    const [loadingItens, setLoadingItens] = useState(false)

    // Variaveis de Busca
    const [idDoacaoBusca, setIdDoacaoBusca] = useState(-1)
    const [searchBy, setSearchBy] = useState("")
    const [orderBy, setOrderBy] = useState("")
    const [searchIn, setSearchIn] = useState("")
    const [filterBy, setFilterBy] = useState("")

    //Variaveis locais
    const [IdDoacoesFicha, setIdDoacoesFicha] = useState([])

    const toggleIdDoacoesFicha = (Id) => {
        if (IdDoacoesFicha.includes(Id)) {
            // Remove o ID se já estiver presente
            setIdDoacoesFicha(IdDoacoesFicha.filter(num => num !== Id));
        } else {
            // Adiciona o ID se não estiver presente
            setIdDoacoesFicha([...IdDoacoesFicha, Id]);
        }
    };

    useEffect(() => {
        localStorage.setItem('ArrayIdDoacoes', JSON.stringify(IdDoacoesFicha));
    }, [IdDoacoesFicha])

    // Variaveis de atualizar
    const [varLista, setVarLista] = useState(-1)

    //Variaveis normais
    const [observacaoSemiAtual, setObservacaoSemiAtual] = useState("")
    const [observacaoAtual, setObservacaoAtual] = useState("")
    const [destinoSemiAtual, setDestinoSemiAtual] = useState("")
    const [destinoAtual, setDestinoAtual] = useState("")

    //Variaveis de atualização
    const [update, setUpdate] = useState("")
    const [idToUpdate, setIdToUpdate] = useState(-1)
    const [novoStatus, setNovoStatus] = useState(-1)
    const [novaDataAgendada, setNovaDataAgendada] = useState()

    // Variaveis de lista
    const [doacao, setDoacao] = useState([])
    const [itens, setItens] = useState([])


    //Funções normais
    const atualizarLista = () => {
        setVarLista(varLista * -1)
        setLoading(true)
    }

    const [inputValue, setInputValue] = useState("");
    const timeoutRef = useRef(null); // Referência para o timeout
    let timer;
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Reseta o timer a cada nova digitação
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Inicia um novo timer para atualizar searchIn após 1 segundo
        timeoutRef.current = setTimeout(() => {
            setSearchIn(value); // Atualiza searchIn após 1 segundo
            setLoading(true)
        }, 1000);
    };



    // Fetchs sem UseEffect
    const fetchUpdateDoacao = async () => {
        try {
            const response = await fetch(`/api/doacao?&idToUpdate=${idToUpdate}&novoStatus=${value}&novaDataAgendada=${dateAgenda}&novaDataRetirada=${dateRetirado}&novaObservacao=${observacaoAtual}&novoDestino=${destinoAtual}`, {
                method: 'PUT',
            });
            const result = await response.json();
            atualizarLista()
        } catch (error) {
            console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
        }
    }


    // Fetchs com useEffect
    useEffect(() => {
        const fetchLoadDoacoes = async () => {
            try {
                const response = await fetch(`/api/doacao?orderBy=${orderBy}&searchBy=${searchBy}&searchIn=${searchIn}&filterBy=${filterBy}`, {
                    method: 'GET',
                });
                const data = await response.json();
                setDoacao(data);
                setLoading(false)
            } catch (error) {
                console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
            }
        }

        fetchLoadDoacoes()
    }, [varLista, orderBy, searchBy, searchIn, filterBy])

    useEffect(() => {
        const fetchLoadItens = async () => {

            if (idDoacaoBusca == -1) {
                return
            }

            try {
                const response = await fetch(`/api/doacaoItem?IdDoacao=${idDoacaoBusca}`, {
                    method: 'GET',
                });
                const data = await response.json();
                setObservacaoAtual(observacaoSemiAtual)
                setDestinoAtual(destinoSemiAtual)
                setDateAgenda(semiDateAgenda)
                setDateRetirado(semiDateRetirado)
                setValue(semiValue)
                setItens(data);
                setLoadingItens(false)
            } catch (error) {
                console.error('Erro ao carregar doadores:', error); // Adicione um tratamento de erro
            }
        }

        fetchLoadItens()
    }, [idDoacaoBusca, observacaoSemiAtual, semiDateAgenda, semiDateRetirado, semiValue, destinoSemiAtual])

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
            <div className="flex mt-6 h-[60px] mb-3 justify-between">
                <div className="flex">
                    <Link href={"/inicio"}>
                        <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
                    </Link>
                    <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">Doações</h1>
                </div>
                <Link href="/ficha" target="_blank">
                    <Button className={(IdDoacoesFicha.length > 0 ? "bg-green-400 hover:bg-green-500" : "bg-slate-200 text-slate-400 hover:bg-slate-200 cursor-default") + " mr-8"}>Imprimir Ficha de Retirada ({IdDoacoesFicha.length} Doações)</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <div className="w-[60%]">
                    <div className="flex justify-between mb-3">


                        <Select onValueChange={(value) => {
                            setOrderBy(value);
                            atualizarLista();
                        }}>
                            <SelectTrigger className="bg-slate-200 hover:bg-slate-300 text-black w-[49%]">
                                <i></i>
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Nenhum">Nenhum</SelectItem>
                                <SelectItem value="adicionadoRecente">Adicionado mais Recente</SelectItem>
                                <SelectItem value="adicionadoAntigo">Adicionado mais Antigo</SelectItem>
                                <SelectItem value="agendamentoMaisProximo">Agendamento mais Próximo</SelectItem>
                                <SelectItem value="agendamentoMaisLonge">Agendamento mais Longe</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => {
                            setFilterBy(value);
                            atualizarLista();
                        }}>
                            <SelectTrigger className="bg-slate-200 hover:bg-slate-300 text-black w-[49%]">
                                <i></i>
                                <SelectValue placeholder="Filtrar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Nenhum">Nenhum</SelectItem>
                                <SelectItem value="agendado">Agendado</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="agendadoHoje">Agendado para Hoje</SelectItem>
                                <SelectItem value="agendadoSemana">Agendado para Esta Semana</SelectItem>
                                <SelectItem value="retirado">Retirado</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between mb-3">

                        <Input className="w-[66%] mr-2" placeholder="Pesquisar"
                            value={inputValue}
                            onChange={handleInputChange}
                        ></Input>


                        <Select onValueChange={(value) => {
                            setSearchBy(value);
                            atualizarLista();
                        }}>
                            <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-[32%]">
                                <i></i>
                                <SelectValue placeholder="Pesquisar Por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Nenhum">Nenhum</SelectItem>
                                <SelectItem value="Nome">Nome</SelectItem>
                                <SelectItem value="Telefone">Telefone</SelectItem>
                            </SelectContent>
                        </Select>


                    </div>
                    <div className="h-[58vh]">
                        <ScrollArea className="border-none rounded-none h-[100%]">
                            {loading ?
                                <>
                                    <div className="flex flex-col gap-5">
                                        <Skeleton className="w-full h-56"></Skeleton>
                                        <Skeleton className="w-full h-56"></Skeleton>
                                        <Skeleton className="w-full h-56"></Skeleton>
                                    </div>
                                </>
                                :
                                <div >
                                    {doacao.map((doacao, index) => (
                                        <div key={index} className="flex pt-3 pl-4 pb-3 pr-4 rounded-xl border mb-5 hover:bg-slate-200 hover:cursor-pointer transition"
                                            onClick={() => {
                                                if (idToUpdate != doacao.IdDoacao) {
                                                    setSemiDateAgenda(doacao.DataAgendada ? new Date(doacao.DataAgendada) : null)
                                                    setSemiDateRetirado(doacao.DataRetirada ? new Date(doacao.DataRetirada) : null)
                                                    setSemiValue(doacao.StatusDoacao)
                                                    setIdDoacaoBusca(doacao.IdDoacao)
                                                    setObservacaoSemiAtual(doacao.Observacao)
                                                    setDestinoSemiAtual(doacao.Destino)
                                                    setIdToUpdate(doacao.IdDoacao)
                                                    setLoadingItens(true)
                                                }
                                            }}
                                        >
                                            <div className="w-[50%]">
                                                <div className="flex">
                                                    <h1 className="text-lg text-slate-300">Status: </h1>
                                                    <h1
                                                        className={`font-bold text-xl ml-1 ${doacao.StatusDoacao === 0
                                                            ? (new Date(doacao.DataAgendada).getTime() < new Date().getTime() ? "text-yellow-500" : "text-blue-500")
                                                            : doacao.StatusDoacao === 1
                                                                ? "text-green-500"
                                                                : doacao.StatusDoacao === 3
                                                                    ? "text-red-500"
                                                                    : ""
                                                            }`}
                                                    >
                                                        {(() => {
                                                            switch (doacao.StatusDoacao) {
                                                                case 0:
                                                                    return `${new Date(doacao.DataAgendada).getTime() < new Date().getTime() ? "Pendente. Agendado para" : "Agendado"}: ${doacao.DataAgendada ? new Date(doacao.DataAgendada).toLocaleDateString("pt-BR") : "Data não informada"}`;
                                                                case 1:
                                                                    return `Retirado: ${new Date(doacao.DataRetirada).toLocaleDateString("pt-BR") || "Não informado"}`;
                                                                case 3:
                                                                    return "Cancelado";
                                                                default:
                                                                    return "Status desconhecido";
                                                            }
                                                        })()}
                                                    </h1>
                                                </div>
                                                <div className="flex flex-col gap-[10px]">
                                                    <h1 className="font-bold text-lg mt-3 mb-2">Informações do Doador</h1>
                                                    <h1>Nome: {doacao.doador.Nome || "Não informado"}</h1>
                                                    <h1>Telefone: {doacao.contato?.[0]?.Telefone || "Não informado"}</h1>
                                                    <Button className=" bg-white text-black border border-slate-300 hover:bg-slate-300 text-sm mt-2 w-36">
                                                        Mais Informações
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-right w-[50%]">
                                                <div className="flex justify-end">
                                                    <h1 className="text-lg text-slate-300">Data: </h1>
                                                    <h1 className="text-black text-lg ml-1">
                                                        {new Date(doacao.DataDoacao).toLocaleDateString("pt-BR") || "Não informado"}
                                                    </h1>
                                                </div>
                                                <div className="text-left">
                                                    <h1 className="mt-[16px] font-bold text-lg">Endereço:</h1>
                                                    <h1 className="mt-[16px]">
                                                        {doacao.doador.Rua}, {doacao.doador.Numero}, {doacao.doador.Bairro}
                                                    </h1>
                                                </div>
                                                <Button
                                                    className={(IdDoacoesFicha.includes(doacao.IdDoacao) ? "bg-red-400 hover:bg-red-500" : "bg-green-400 hover:bg-green-500") + " mt-[26px]"}
                                                    onClick={() => toggleIdDoacoesFicha(doacao.IdDoacao)}
                                                >
                                                    {IdDoacoesFicha.includes(doacao.IdDoacao)
                                                        ? "Remover da Ficha de Retirada"
                                                        : "Adicionar à Ficha de Retirada"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </ScrollArea>
                    </div>
                </div>
                <div className={(itens.length === 0 && !loadingItens ? "border-2 border-dashed flex" : "text-left") + " w-[35%] mr-8 h-[73vh]"}>
                    {itens.length === 0 && !loadingItens ? <>
                        <h1 className=" mt-auto mb-auto ml-auto mr-auto text-lg">Clique em uma doação para ver mais detalhes aqui </h1>
                    </>
                        :
                        <>
                            {loadingItens ?
                                <Skeleton className="w-full h-full"></Skeleton>
                                :
                                <>
                                    <h1 className="font-bold text-xl mb-2">Itens Doados:</h1>
                                    <ScrollArea className="h-[168px] mt-3 border">
                                        <Table className=" ml-auto mr-auto text-center">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px] border-r text-center">Nome</TableHead>
                                                    <TableHead className="w-[90px] border-r text-center">Quantidade</TableHead>
                                                    <TableHead className="w-[90px] text-center">Unidade</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {itens.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableHead className="w-[100px] border-r text-center">{item.produto.Nome}</TableHead>
                                                        <TableHead className="w-[90px] border-r text-center">{item.Quantidade}</TableHead>
                                                        <TableHead className="w-[90px] text-center">{item.UNItem}</TableHead>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                    <h1 className="font-bold text-xl mb-2 mt-2">Observações:</h1>
                                    <Textarea className="resize-none"
                                        value={observacaoAtual ? observacaoAtual : ""}
                                        onChange={(e) => {
                                            setObservacaoAtual(e.target.value)
                                        }}>
                                    </Textarea>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[48%] mt-4 justify-start text-left font-normal",
                                                    !dateAgenda && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateAgenda ? format(dateAgenda, "PPP", { locale: ptBR }) : <span>Alterar data agendada</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dateAgenda}
                                                onSelect={setDateAgenda}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[48%] justify-start text-left font-normal ml-[4%] mt-4",
                                                    !dateRetirado && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateRetirado ? format(dateRetirado, "PPP", { locale: ptBR }) : <span>Alterar data de Retirada</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dateRetirado}
                                                onSelect={setDateRetirado}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <div className="flex">
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-[48%] justify-between mt-4"
                                                >
                                                    {value != 'a'
                                                        ? frameworks.find((framework) => framework.value === `${value}`)?.label
                                                        : "Alterar Status"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandList>
                                                        <CommandEmpty>No framework found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {frameworks.map((framework) => (
                                                                <CommandItem
                                                                    key={framework.value}
                                                                    value={framework.value}
                                                                    onSelect={(currentValue) => {
                                                                        setValue(currentValue)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            value === framework.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {framework.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        <Input placeholder="Destino" className="w-[48%] ml-[4%] mt-4"
                                            value={destinoAtual ? destinoAtual : ""}
                                            onChange={(e) => {
                                                setDestinoAtual(e.target.value)
                                            }}>
                                        </Input>
                                    </div>

                                    <Button className="bg-green-400 hover:bg-green-500 w-full mt-4"
                                        onClick={fetchUpdateDoacao}
                                    >Aplicar Edições</Button>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}