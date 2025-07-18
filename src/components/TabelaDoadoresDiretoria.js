"use client"

import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import React, { useEffect, useState, useRef, setOpen } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch"
import { Check, ChevronsUpDown, ScanLine } from "lucide-react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importando a localidade do Brasil
import { toast } from "sonner"
import CustomDateInput from "@/components/CustomDateInput"
import { isValid } from "date-fns";

import { cn } from "@/lib/utils"



import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
    {
        value: "CPFCNPJ",
        label: "CPF / CNPJ",
    },
    {
        value: "nome",
        label: "Nome",
    },

    {
        value: "telefone",
        label: "Telefone",
    },

    {
        value: "rua",
        label: "Rua",
    },

    {
        value: "bairro",
        label: "Bairro",
    },
]

export default function TabelaDoadoresDiretoria({ children }) {

    const [brRealInputValue, setBrRealInputValue] = useState("")
    const [valorFinalDoacaoDinheiro, setValorFinalDoacaoDinheiro] = useState("")

    const [tipoDoadores, setTipoDoadores] = useState(children)

    //Variavel de ordenar
    const [ordenacao, setOrdenacao] = useState('');

    const [date, setDate] = React.useState();

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const [openProduto, setOpenProduto] = React.useState(false)
    const [valueProduto, setValueProduto] = React.useState("")

    const [isFirstRender, setIsFirstRender] = React.useState(true);

    //Variaveis de popup
    const [popupAdicionarDoador, setPopupAdicionarDoador] = useState(false)
    const [popupEditarDoador, setPopupEditarDoador] = useState(false)
    const [popupInformacoes, setPopupInformacoes] = useState(false)
    const [popupAdicionarDoacao, setPopupAdicionarDoacao] = useState(false)
    const [popupAdicionarProduto, setPopupAdicionarProduto] = useState(false)
    const [popupAdicionarContato, setPopupAdicionarContato] = useState(false)
    const [popupDesativarDoador, setPopupDesativarDoador] = useState(false)
    const [popupReativarDoador, setPopupReativarDoador] = useState(false)

    //Variaveis de loading
    const [loading, setLoading] = useState(true)

    //Variaveis de Atualização
    const [varAtualizarLista, SetVarAtualizarLista] = useState(1)

    //Variaveis de switch
    const [switchDesativos, setSwitchDesativos] = useState(-1)

    //Variaveis de controllers ativos ou não
    const [pesquisa, setPesquisa] = useState('')

    //Variaveis que vem do usuario
    const [pesquisaInput, setPesquisaInput] = useState('')
    const [observacao, setObservacao] = useState("")
    const [destino, setDestino] = useState("")
    const [enderecoCEP, setEnderecoCEP] = useState("")

    //Lista
    const [doador, setDoador] = useState([]);
    const [Produtos, setProdutos] = useState([])
    const [Itens, setItens] = useState([])
    const [editandoId, setEditandoId] = useState(null); // Armazena o ID do item sendo editado
    const [novaQuantidade, setNovaQuantidade] = useState(''); // Armazena o valor do input de edição
    const [contatos, setContatos] = useState([])

    //Variaveis simples
    const [nomeDoadorAdicionado, setNomeDoadorAdicionado] = useState('')
    const [unidadeAtual, setunidadeAtual] = useState('')
    const [quantidadeAtual, setQuantidadeAtual] = useState(1); // Estado para o primeiro input
    const [nomeProdutoAtual, setnomeProdutoAtual] = useState("");
    const [nomeDoadorAdicionarContato, setNomeDoadorAdicionarContato] = useState("")
    const [verMaisContatosInformacoes, setVerMaisContatosInformacoes] = useState(-1)
    const [adicionarDinheiro, setAdicionarDinheiro] = useState(false)
    const [flagDesativaBotaoAdicionar, setFlagDesativaBotaoAdicionar] = useState(false)

    //Ids
    const [IdDoadorDoando, setIdDoadorDoando] = useState(0);

    //Ids de busca
    const [idToFind, setIdToFind] = useState(-1)
    const [idToDesativar, setIdToDesativar] = useState(-1)
    const [idToReativar, setIdToReativar] = useState(-1)
    const [idDoadorContato, setIdDoadorContato] = useState(-1)

    //Doadores a serem editados
    const [novoDoador, setNovoDoador] = useState({
        CPFCNPJ: "",
        Nome: "",
        CEP: "",
        Sexo: null,
        DataAniversario: null,
        OrigemDoador: "",
        ObservacaoDoador: "",
        Numero: "",
        Contato: "",
        Telefone: "",
        Email: ""
    })
    const [novoContato, setNovoContato] = useState({
        IdDoador: "",
        Contato: "",
        Telefone: "",
        Email: ""
    })
    const [doadorEditado, setDoadorEditado] = useState({
        IdDoador: " ",
        CPFCNPJ: " ",
        Nome: " ",
        CEP: " ",
        Numero: " ",
        Complemento: " ",
        ObservacaoDoador: " ",
        OrigemDoador: " ",
        IdContato: " ",
        Contato: " ",
        Telefone: " ",
        Email: " "
    })
    const [novoProduto, setNovoProduto] = useState({
        Nome: "",
        UN: ""
    })

    //#region Funções Normais
    const atualizarLista = () => {
        SetVarAtualizarLista(varAtualizarLista * -1)
        setLoading(true)
    }

    const alteraSwitchDesativos = () => {
        setSwitchDesativos(switchDesativos * -1)
        atualizarLista()
    }

    const handleDateChange = (date) => {
        setNovoDoador({ ...novoDoador, DataAniversario: date })
    }
    const handleEditarDateChange = (date) => {
        setDoadorEditado({ ...doadorEditado, DataAniversario: date })
    }

    const timeoutRef = useRef(null); // Referência para o timeout
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Reseta o timer a cada nova digitação
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Inicia um novo timer para atualizar searchIn após 1 segundo
        timeoutRef.current = setTimeout(() => {
            setPesquisaInput(value); // Atualiza searchIn após 1 segundo
            atualizarLista()
        }, 1000);
    };

    //#endregion 

    //#region Funções de Fetch
    const fetchAdicionarDoador = async () => {
        try {
            const response = await fetch(`/api/doador?tipoDoador=${children ? children : 0}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoDoador)
            });

            const data = await response.json(); // Extrai os dados em ambos os casos (sucesso/erro)

            if (!response.ok) {
                throw new Error(data.error || "Erro ao adicionar doador");
            }

            // Se chegou aqui foi sucesso
            setPopupAdicionarDoador(false);
            atualizarLista();

            setNovoDoador({
                CPFCNPJ: "",
                Nome: "",
                CEP: "",
                Sexo: null,
                DataAniversario: null,
                OrigemDoador: "",
                ObservacaoDoador: "",
                Numero: "",
                Contato: "",
                Telefone: "",
                Email: ""
            })
            setFlagDesativaBotaoAdicionar(false)

        } catch (error) {
            console.error("Erro ao adicionar doador:", error);
            setFlagDesativaBotaoAdicionar(false)
            console.log("ERRO: " + error.message)

            if (error.message === "Erro ao buscar o CEP") {
                toast("CEP digitado não encontrado", {
                    description: "Por favor, verifique o CEP e tente novamente",
                });
                return
            }

            if (error.message === "Erro Nome sem sobrenome") {
                toast("Nome sem Sobrenome", {
                    description: "Por favor, digite o sobrenome do doador.",
                });
                return
            }

            toast("Erro ao processar solicitação", {
                description: error.message,
            });
            return
        }
    };

    const fetchAdicionarContato = async () => {
        try {
            const response = await fetch('/api/contato', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoContato) // Envia os dados do novo doador
            })
            setPopupAdicionarContato(false) // Fecha o popup após adicionar
            toast("Novo contato Cadastrado!", {
                description: `Um novo contato foi adicionado à ${nomeDoadorAdicionarContato}`,
            })
            setNovoContato({
                IdDoador: "",
                Contato: "",
                Telefone: "",
                Email: ""
            })
            setFlagDesativaBotaoAdicionar(false)
        } catch (error) {
            console.error('Erro ao adicionar contato:', error)
        }
    }

    const fetchPegarContatos = async () => {
        try {
            const response = await fetch(`/api/contato?contatoDoadorId=${idDoadorContato}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            setContatos(data)
        } catch (error) {
            console.error('Erro ao pegar contato:', error)
        }
    }

    const fetchEditarDoador = async () => {
        try {
            const response = await fetch('/api/doador', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doadorEditado) // Envia os dados do novo doador
            })
            setPopupEditarDoador(false) // Fecha o popup após adicionar

            setDoadorEditado({
                IdDoador: " ",
                CPFCNPJ: " ",
                Nome: " ",
                CEP: " ",
                Numero: " ",
                Complemento: " ",
                ObservacaoDoador: " ",
                OrigemDoador: " ",
                IdContato: " ",
                Contato: " ",
                Telefone: " ",
                Email: " "
            })
            setFlagDesativaBotaoAdicionar(false)

            setVerMaisContatosInformacoes(-1)
            setIdDoadorContato(-1)
            setContatos([])
            atualizarLista()

        } catch (error) {
            console.error('Erro ao editar doador:', error)
        }
    }

    const fetchAdicionarProduto = async () => {
        try {
            const response = await fetch(`/api/produto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoProduto)
            })
            setPopupAdicionarProduto(false)
            fetchLoadProdutos()
            setNovoProduto({
                Nome: "",
                UN: ""
            })
            atualizarLista()
            setFlagDesativaBotaoAdicionar(false)
        } catch (error) {
            console.error('Erro ao adicionar produto:', error)
        }
    }

    const fetchAdicionarDoacao = async () => {
        try {

            const bodyData = {
                IdDoador: IdDoadorDoando,
                itens: Itens,
                date: date,
                observacao: observacao,
                destino: destino,
                valorDinheiro: valorFinalDoacaoDinheiro
            };

            const response = await fetch(`/api/doacao?IdDoador=${IdDoadorDoando}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            })
            setPopupAdicionarDoacao(false)
            setIdDoadorDoando(0)
            setItens([])
            setValueProduto('');
            setnomeProdutoAtual('');
            setQuantidadeAtual(0);
            setunidadeAtual('');
            setObservacao("");
            setDestino("");
            setDate(null)
            setAdicionarDinheiro(false)
            setValorFinalDoacaoDinheiro("")
            setBrRealInputValue("")
            setFlagDesativaBotaoAdicionar(false)

        } catch (error) {
            console.error('Erro ao adicionar doacao:', error)
        }
    }

    const fetchDesativarDoador = async () => {
        try {
            const response = await fetch(`api/doadorById?action=1&id=${idToDesativar}`, {
                method: 'PUT'
            })
            setPopupDesativarDoador(false) // Fecha o popup após adicionar
            setIdToDesativar(-1)
            atualizarLista()
        } catch (error) {
            console.error('Erro ao desativar doador:', error)
        }
    }

    const fetchReativarDoador = async () => {
        try {
            const response = await fetch(`api/doadorById?action=2&id=${idToReativar}`, {
                method: 'PUT'
            })
            setPopupReativarDoador(false) // Fecha o popup após adicionar
            setIdToReativar(-1)
            atualizarLista()
        } catch (error) {
            console.error('Erro ao inativar doador:', error)
        }
    }

    useEffect(() => {

        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }

        if (idToFind == -1) {
            return
        }

        const fetchGetDoador = async () => {
            try {
                const response = await fetch(`api/doadorById?Id=${idToFind}`, {
                    method: 'GET',
                })
                const data = await response.json();
                console.log(data)
                setDoadorEditado(data)
                setIdToFind(-1)
            } catch (error) {
                console.error('Erro ao buscar doador:', error)
            }
        }

        const fetchData = async () => {
            await fetchGetDoador();
        };
        fetchData();
    }, [idToFind, isFirstRender]);

    const fetchLoadProdutos = async () => {
        try {
            const response = await fetch(`/api/produto`, {
                method: 'GET',
            });
            const data = await response.json(); // Converta a resposta para JSON
            setProdutos(data); // Atualize o estado com os dados
        } catch (error) {
            console.error('Erro ao carregar produtos:', error); // Adicione um tratamento de erro
        }
    }


    // Função de carregar os doadores quando abre a pagina
    useEffect(() => {
        const fetchLoadDoadores = async () => {
            try {
                const response = await fetch(`/api/doador?desativados=${switchDesativos}&searchBy=${pesquisa}&searchIn=${pesquisaInput}&ordenarPor=${ordenacao}&tipoDoador=${tipoDoadores}`,
                    { method: 'GET' }
                );
                const data = await response.json();
                setDoador(data);
            } catch (error) {
                console.error('Erro ao carregar doadores:', error);
            }
            setLoading(false);
        }

        fetchLoadDoadores();
    }, [varAtualizarLista, switchDesativos, pesquisa, pesquisaInput, ordenacao, tipoDoadores]);

    //#endregion 

    //#region Formatando campo real
    const brRealFormatCurrency = (brRealRawValue) => {
        // Remove tudo que não for dígito
        const brRealDigitsOnly = brRealRawValue.replace(/\D/g, "")

        // Converte para número e divide por 100 para ter os centavos
        const brRealNumberValue = Number(brRealDigitsOnly) / 100

        const ValorFinal = brRealNumberValue * 100
        setValorFinalDoacaoDinheiro(ValorFinal)

        // Formata o número para a moeda brasileira
        return brRealNumberValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const brRealHandleInputChange = (brRealEvent) => {
        const brRealCurrentInputValue = brRealEvent.target.value
        const brRealFormattedValue = brRealFormatCurrency(brRealCurrentInputValue)
        setBrRealInputValue(brRealFormattedValue)
    }
    //#endregion

    return (
        <>
            <div className="flex mt-6 justify-between w-[95%] ml-auto mr-auto">
                <div className="flex">
                    <Input className="w-[66%] mr-2" placeholder="Pesquisar"
                        value={inputValue}
                        onChange={handleInputChange}
                    ></Input>

                    <Popover open={open} onOpenChange={setOpen} className="w-10">
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[160px] justify-between"
                            >
                                {value
                                    ? frameworks.find((framework) => framework.value === value)?.label
                                    : "Pesquisar Por..."}
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
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setPesquisa(currentValue)
                                                    atualizarLista()
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
                </div>

                <div className="flex">

                    <Select onValueChange={(value) => {
                        setOrdenacao(value);
                        atualizarLista();
                    }}>
                        <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black ml-10 w-[240px]">
                            <i className="fas fa-sort"></i>
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nenhum">Nenhum</SelectItem>
                            <SelectItem value="AdicionadoRecente">Adicionado mais Recente</SelectItem>
                            <SelectItem value="AdicionadoAntigo">Adicionado mais Antigo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-auto mb-auto flex">
                    <p className="mr-1">Mostrar Inativos</p>
                    <Switch onClick={alteraSwitchDesativos} />
                </div>

                <Button
                    variant="outline"
                    className="rounded-lg ml-8 px-3 py-1 bg-emerald-400 border-none hover:bg-emerald-500"
                    onClick={() => setPopupAdicionarDoador(true)}
                >
                    {tipoDoadores == 1 ? "+ Adicionar Doador em Potencial" : "+ Adicionar Doador"}
                </Button>
            </div>



            <Table className="ml-auto mr-auto w-[95%] mt-3 text-center">
                <TableHeader className={tipoDoadores == 1 ? "bg-pink-400 " : "bg-sky-400"}>
                    <TableRow>
                        <TableHead className="border-slut-100 border text-white text-center">CPF / CNPJ</TableHead>
                        <TableHead className="border-slut-100 border text-white text-center">Nome</TableHead>
                        <TableHead className="border-slut-100 border text-white text-center">Endereço</TableHead>
                        <TableHead className="border-slut-100 border text-white text-center">Telefone</TableHead>
                        <TableHead className="border-slut-100 border text-white text-center w-0">Opções</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ?
                        <>
                            <TableRow className="items-center flex-col gap-1">
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                            </TableRow>
                            <TableRow className="items-center flex-col gap-1">
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                            </TableRow>
                            <TableRow className="items-center flex-col gap-1">
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                                <TableCell className="h-full"><Skeleton className="h-16 w-[100%]" /></TableCell>
                            </TableRow>
                        </>
                        :
                        doador.map((doador) => (
                            <TableRow key={doador.IdDoador} className={doador.Status ? 'bg-white' : 'bg-red-100 hover:bg-red-200'}>
                                <TableCell className="font-medium border-slut-100 border">{doador.CPFCNPJ}</TableCell>
                                <TableCell className="border-slut-100 border">{doador.Nome}</TableCell>
                                <TableCell className="border-slut-100 border">{
                                    doador.Rua ?
                                        `${doador.Rua}, ${doador.Numero}, ${doador.Bairro}`
                                        : "Sem endereço registrado"}
                                </TableCell>
                                <TableCell className="border-slut-100 border">{doador.Telefone}</TableCell>
                                <TableCell className="border-slut-100 border flex">

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button className={(doador.Status ? 'bg-slate-300 hover:bg-slate-400' : 'bg-red-300 hover:bg-red-400') + ' rounded-full  w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1'}
                                                    onClick={() => {
                                                        setPopupAdicionarDoacao(true);
                                                        setNomeDoadorAdicionado(doador.Nome)
                                                        fetchLoadProdutos()
                                                        setIdDoadorDoando(doador.IdDoador)
                                                    }}
                                                ><i className="fas fa-hand-holding-heart text-[10px]"></i></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Adicionar doação à {doador.Nome}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    className={(doador.Status ? 'bg-slate-300 hover:bg-slate-400' : 'bg-red-300 hover:bg-red-400') + ' rounded-full  w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1'}
                                                    onClick={() => {
                                                        setPopupInformacoes(true);
                                                        setDoadorEditado({ ...doadorEditado, IdDoador: doador.IdDoador });
                                                        setIdDoadorContato(doador.IdDoador);
                                                        setIdToFind(doador.IdDoador);
                                                    }}
                                                >
                                                    <i className="fas fa-info-circle"></i>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Informações do Doador</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    className={(doador.Status ? 'bg-slate-300 hover:bg-slate-400' : 'bg-red-300 hover:bg-red-400') + ' rounded-full  w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1'}
                                                    onClick={() => {
                                                        setPopupEditarDoador(true);
                                                        setDoadorEditado({ ...doadorEditado, IdDoador: doador.IdDoador });
                                                        setIdToFind(doador.IdDoador);
                                                        setIdDoadorContato(doador.IdDoador);
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Editar Doador</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    className={(doador.Status ? 'bg-slate-300 hover:bg-slate-400' : 'bg-red-300 hover:bg-red-400') + ' rounded-full  w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1'}
                                                    onClick={() => {
                                                        setPopupAdicionarContato(true);
                                                        setNomeDoadorAdicionarContato(doador.Nome);
                                                        setNovoContato({ ...novoContato, IdDoador: doador.IdDoador });
                                                    }}
                                                >
                                                    <i className="fas fa-user-plus"></i>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Adicionar Contato</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    className={(doador.Status ? 'bg-slate-300 hover:bg-slate-400' : 'bg-green-300 hover:bg-green-400') + ' rounded-full  w-[35px] h-[35px] flex ml-1 mr-1 mt-1 mb-1'}
                                                    onClick={doador.Status ? () => {
                                                        setIdToDesativar(doador.IdDoador);
                                                        setPopupDesativarDoador(true);
                                                    } : () => {
                                                        setIdToReativar(doador.IdDoador);
                                                        setPopupReativarDoador(true);
                                                    }}
                                                >
                                                    <i className={doador.Status ? 'fas fa-ban' : 'fas fa-sync'}></i>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{doador.Status ? 'Inativar Doador' : 'Reativar Doador'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {popupAdicionarDoador && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg pl-6 pr-6 pt-4 pb-4">
                        <h1 className="text-2xl font-bold mb-6">Adicionar Doador</h1>

                        <div className="flex">
                            <div>
                                <h1 className=" font-bold text-xl mb-4">Informações principais</h1>
                                <div className="flex text-left">
                                    <div>
                                        <h1>CPF/CNPJ</h1>
                                        <Input type="CPF/CNPJ" placeholder="CPF/CNPJ" className="w-[130px]" onChange={(e) => setNovoDoador({ ...novoDoador, CPFCNPJ: e.target.value })} />
                                    </div>
                                    <div>
                                        <h1 className="ml-2">Nome Completo</h1>
                                        <Input type="Name" placeholder="Nome Completo" className="w-[263px] ml-2" onChange={(e) => setNovoDoador({ ...novoDoador, Nome: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex text-left mt-1">
                                    <div>
                                        <h1>Sexo</h1>
                                        <Select onValueChange={(value) => {
                                            setNovoDoador({ ...novoDoador, Sexo: parseInt(value, 10) });
                                        }}>
                                            <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-[160px]">
                                                <i className="fas fa-sort"></i>
                                                <SelectValue placeholder="Sexo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Masculino</SelectItem>
                                                <SelectItem value="1">Feminino</SelectItem>
                                                <SelectItem value="2">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="ml-2">
                                        <h1>Data de aniversário</h1>
                                        <CustomDateInput onChange={handleDateChange} />
                                    </div>
                                </div>

                                <hr className="mt-4"></hr>

                                <h1 className=" font-bold text-xl mb-4 mt-4">Endereço</h1>

                                <div className="flex mt-4">
                                    <div>
                                        <h1 className="text-left">CEP</h1>
                                        <Input type="CEP" placeholder="CEP" className="w-[110px]" onChange={async (e) => {
                                            setNovoDoador({ ...novoDoador, CEP: e.target.value })
                                            const sanitizedCEP = e.target.value.replace(/\D/g, '');
                                            if (sanitizedCEP.length == 8) {
                                                const response = await fetch(`https://viacep.com.br/ws/${sanitizedCEP}/json/`)
                                                const data = await response.json()
                                                setEnderecoCEP(data);
                                            } else {
                                                setEnderecoCEP("")
                                            }
                                        }} />
                                    </div>
                                    <div className="ml-2 text-left">
                                        <h1>Endereço</h1>
                                        <div className="border rounded bg-gray-100 text-gray-400 text-sm  w-[260px] p-2">
                                            <p>{enderecoCEP != "" ? (enderecoCEP.logradouro ? (`${enderecoCEP.logradouro}, ${enderecoCEP.bairro} - ${enderecoCEP.localidade}, ${enderecoCEP.uf}`) : "Digite um CEP Válido") : "Digite um CEP"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mt-4">
                                    <div>
                                        <h1 className=" text-left">Número</h1>
                                        <Input type="Numero" placeholder="Número" className="w-[90px]" onChange={(e) => setNovoDoador({ ...novoDoador, Numero: e.target.value })} />
                                    </div>
                                    <div className="ml-2">
                                        <h1 className=" text-left">Complemento</h1>
                                        <Input type="Complemento" placeholder="Complemento" className="w-[270px]" onChange={(e) => setNovoDoador({ ...novoDoador, Complemento: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="w-[1px] h-auto bg-slate-200 ml-5 mr-5"></div>

                            <div>
                                <div>
                                    <h1 className=" font-bold text-xl mb-4">Contato</h1>

                                    <div className="flex">
                                        <div>
                                            <h1 className="text-left">Nome do Contato</h1>
                                            <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[220px]" onChange={(e) => setNovoDoador({ ...novoDoador, Contato: e.target.value })} />
                                        </div>
                                        <div className="ml-5">
                                            <h1 className="ml-2 text-left">Telefone</h1>
                                            <Input type="Telefone" placeholder="Telefone" className="w-[150px] ml-2" onChange={(e) => setNovoDoador({ ...novoDoador, Telefone: e.target.value })} />
                                        </div>
                                    </div>
                                    <h1 className="mt-5 text-left">E-mail</h1>
                                    <Input type="email" placeholder="E-mail" className="w-[400px]" onChange={(e) => setNovoDoador({ ...novoDoador, Email: e.target.value })} />
                                </div>

                                <hr className="mt-4"></hr>

                                <h1 className=" font-bold text-xl mb-4 mt-4">Outras Informações</h1>

                                <div className="mt-4">
                                    <div>
                                        <h1 className="text-left">Origem</h1>
                                        <Input type="Origem do Doador" placeholder="Origem do Doador" className="" onChange={(e) => setNovoDoador({ ...novoDoador, OrigemDoador: e.target.value })} />
                                    </div>
                                    <h1 className="mt-5 text-left">Observações</h1>
                                    <Textarea
                                        placeholder="Observações do Doador"
                                        className="w-[400px] h-[80px] p-2 border rounded-md resize-none"
                                        onChange={(e) => setNovoDoador({ ...novoDoador, ObservacaoDoador: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end mt-3">
                            <Button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                onClick={() => {
                                    if (!flagDesativaBotaoAdicionar) {
                                        fetchAdicionarDoador()
                                        setFlagDesativaBotaoAdicionar(true)
                                    }
                                }}
                            >
                                Confirmar
                            </Button>

                            <Button
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                onClick={() => setPopupAdicionarDoador(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div >
            )
            }

            {
                popupEditarDoador && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 flex">
                            {verMaisContatosInformacoes == 1 && contatos.length > 0 ?
                                <div className="flex">
                                    <div>
                                        <h1 className="w-[200px] mb-5 font-bold">Todos os Contatos</h1>
                                        {contatos.map((contato, index) => (
                                            <div key={index} className="flex flex-col">
                                                <Button className=" mt-1 w-[180px] text-left justify-start bg-white hover:bg-slate-100 text-slate-500 border-none shadow-none"
                                                    onClick={() => {
                                                        setDoadorEditado({
                                                            ...doadorEditado,
                                                            IdContato: contato.IdContato,
                                                            Contato: contato.Contato,
                                                            Telefone: contato.Telefone,
                                                            Email: contato.Email
                                                        });
                                                    }}
                                                >{contato.Contato}</Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[1px] h-full bg-slate-300 mr-8" />
                                </div>
                                : ""
                            }
                            <div>
                                <h1 className="text-xl font-bold mb-4">Editar Doador</h1>

                                <div className="flex">
                                    <div>
                                        <div className="flex text-left">
                                            <div>
                                                <h1>CPF/CNPJ</h1>
                                                <Input type="CPF/CNPJ" placeholder="CPF/CNPJ" className="w-[130px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, CPFCNPJ: e.target.value })} value={doadorEditado.CPFCNPJ || ''} />
                                            </div>
                                            <div>
                                                <h1 className="ml-2">Nome</h1>
                                                <Input type="Name" placeholder="Nome" className="w-[263px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Nome: e.target.value })} value={doadorEditado.Nome || ''} />
                                            </div>
                                        </div>

                                        <div className="flex text-left mt-1">
                                            <div>
                                                <h1>Sexo</h1>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setDoadorEditado({ ...doadorEditado, Sexo: parseInt(value, 10) });
                                                    }}
                                                    value={String(doadorEditado?.Sexo ?? "")}
                                                >
                                                    <SelectTrigger className="bg-slate-50 hover:bg-slate-300 text-black w-[160px]">
                                                        <i className="fas fa-sort"></i>
                                                        <SelectValue placeholder="Sexo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">Masculino</SelectItem>
                                                        <SelectItem value="1">Feminino</SelectItem>
                                                        <SelectItem value="2">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="ml-2">
                                                <h1>Data de aniversário</h1>
                                                <CustomDateInput onChange={handleEditarDateChange} initialValue={doadorEditado.DataAniversario != " " && doadorEditado.DataAniversario} />
                                            </div>
                                        </div>

                                        <hr className="mt-4 mb-4"></hr>

                                        <div className="flex mt-4">
                                            <div>
                                                <h1 className="text-left">CEP</h1>
                                                <Input type="CEP" placeholder="CEP" className="w-[110px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, CEP: e.target.value })} value={doadorEditado.CEP || ''} />
                                            </div>
                                            <div>
                                                <h1 className="ml-2 text-left">Número</h1>
                                                <Input type="Numero" placeholder="Número" className="w-[90px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Numero: e.target.value })} value={doadorEditado.Numero || ''} />
                                            </div>
                                        </div>
                                        <h1 className="mt-5 text-left">Complemento</h1>
                                        <Input type="Complemento" placeholder="Complemento" className="w-[400px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Complemento: e.target.value })} value={doadorEditado.Complemento || ''} />
                                    </div>

                                    <div className="w-[1px] ml-6 mr-6 bg-slate-300"></div>

                                    <div>
                                        <div>
                                            <div className="flex mt-4">
                                                <div>
                                                    <h1 className="text-left">Nome do Contato</h1>
                                                    <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[220px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Contato: e.target.value })} value={doadorEditado.Contato || ''} />
                                                </div>
                                                <div className="ml-5">
                                                    <h1 className="ml-2 text-left">Telefone</h1>
                                                    <Input type="Telefone" placeholder="Telefone" className="w-[150px] ml-2" onChange={(e) => setDoadorEditado({ ...doadorEditado, Telefone: e.target.value })} value={doadorEditado.Telefone || ''} />
                                                </div>
                                            </div>
                                            <h1 className="mt-5 text-left">E-mail</h1>
                                            <Input type="email" placeholder="E-mail" className="w-[400px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, Email: e.target.value })} value={doadorEditado.Email || ''} />
                                        </div>

                                        <hr className="mt-4 mb-4"></hr>

                                        <div>
                                            <div>
                                                <h1 className="text-left">Obsercações</h1>
                                                <Textarea type="Nome do Contato" placeholder="Observações do Doador" className="w-[400px] h-[30px] resize-none" onChange={(e) => setDoadorEditado({ ...doadorEditado, ObservacaoDoador: e.target.value })} value={doadorEditado.ObservacaoDoador || ''} />
                                            </div>
                                            <div className="mt-4">
                                                <h1 className="text-left">Origem</h1>
                                                <Input type="Nome do Contato" placeholder="Origem do Doador" className="w-[400px]" onChange={(e) => setDoadorEditado({ ...doadorEditado, OrigemDoador: e.target.value })} value={doadorEditado.OrigemDoador || ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        className={verMaisContatosInformacoes == 1 ? "bg-slate-500 hover:bg-slate-600" : "bg-slate-400 hover:bg-slate-500"}
                                        onClick={() => {
                                            setVerMaisContatosInformacoes(verMaisContatosInformacoes * -1);
                                            fetchPegarContatos()
                                        }}
                                    >
                                        Mostrar Outros Contatos
                                    </Button>
                                    <div>
                                        <Button
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                            onClick={fetchEditarDoador}
                                        >
                                            Confirmar
                                        </Button>

                                        <Button
                                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                            onClick={() => {
                                                setPopupEditarDoador(false)
                                                setDoadorEditado({
                                                    IdDoador: " ",
                                                    CPFCNPJ: " ",
                                                    Nome: " ",
                                                    CEP: " ",
                                                    Numero: " ",
                                                    Complemento: " ",
                                                    ObservacaoDoador: " ",
                                                    OrigemDoador: " ",
                                                    IdContato: " ",
                                                    Contato: " ",
                                                    Telefone: " ",
                                                    Email: " "
                                                })
                                                setVerMaisContatosInformacoes(-1)
                                                setIdDoadorContato(-1)
                                                setContatos([])
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            }


            {
                popupAdicionarContato && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                            <h1 className="text-xl font-bold mb-4">Adicionar Contato à {nomeDoadorAdicionarContato}</h1>

                            <div className="flex mt-4">
                                <div>
                                    <h1 className="text-left">Nome do Contato</h1>
                                    <Input type="Nome do Contato" placeholder="Nome do Contato" className="w-[220px]" onChange={(e) => setNovoContato({ ...novoContato, Contato: e.target.value })} />
                                </div>
                                <div className="ml-5">
                                    <h1 className="ml-2 text-left">Telefone</h1>
                                    <Input type="Telefone" placeholder="Telefone" className="w-[150px] ml-2" onChange={(e) => setNovoContato({ ...novoContato, Telefone: e.target.value })} />
                                </div>
                            </div>
                            <h1 className="mt-5 text-left">E-mail</h1>
                            <Input type="email" placeholder="E-mail" className="w-[400px]" onChange={(e) => setNovoContato({ ...novoContato, Email: e.target.value })} />

                            <hr className="mt-4"></hr>

                            <div className="flex justify-end mt-3">
                                <Button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                    onClick={() => {
                                        if (!flagDesativaBotaoAdicionar) {
                                            fetchAdicionarContato()
                                            setFlagDesativaBotaoAdicionar(true)
                                        }
                                    }}
                                >
                                    Confirmar
                                </Button>

                                <Button
                                    className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                    onClick={() => {
                                        setPopupAdicionarContato(false)
                                        setNovoContato({
                                            IdDoador: "",
                                            Contato: "",
                                            Telefone: "",
                                            Email: ""
                                        })
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                popupInformacoes && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6  flex">

                            {verMaisContatosInformacoes == 1 && contatos.length > 0 ?
                                <div className="flex">
                                    <div>
                                        <h1 className="w-[200px] mb-5 font-bold">Todos os Contatos</h1>
                                        {contatos.map((contato, index) => (
                                            <div key={index} className="flex flex-col">
                                                <Button className=" mt-1 w-[180px] text-left justify-start bg-white hover:bg-slate-100 text-slate-500 border-none shadow-none"
                                                    onClick={() => {
                                                        setDoadorEditado({
                                                            ...doadorEditado,
                                                            Contato: contato.Contato,
                                                            Telefone: contato.Telefone,
                                                            Email: contato.Email
                                                        });
                                                    }}
                                                >{contato.Contato}</Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[1px] h-full bg-slate-300 mr-8" />
                                </div>
                                : ""
                            }
                            <div>
                                <h1 className="text-xl font-bold mb-4">Informações de {doadorEditado.Nome}</h1>

                                <div className="flex">
                                    <div>
                                        <div className="flex text-left">
                                            <div>
                                                <h1 className=" font-bold">CPF/CNPJ:</h1>
                                                <h1>{doadorEditado.CPFCNPJ}</h1>
                                            </div>
                                            <div className="ml-10">
                                                <h1 className=" font-bold">Nome:</h1>
                                                <h1>{doadorEditado.Nome}</h1>
                                            </div>
                                        </div>

                                        <div className="flex text-left mt-2">
                                            <div>
                                                <h1 className=" font-bold">Sexo:</h1>
                                                <h1>{doadorEditado.Sexo == 0 ? "Masculino" :
                                                    (doadorEditado.Sexo == 1 ? "Feminino" :
                                                        (doadorEditado.Sexo == 2 ? "Outro" : "")
                                                    )
                                                }</h1>
                                            </div>
                                            <div className="ml-10">
                                                <h1 className=" font-bold">Data de Aniversário:</h1>
                                                <h1>
                                                    {doadorEditado.DataAniversario &&
                                                        isValid(new Date(doadorEditado.DataAniversario))
                                                        ? format(new Date(doadorEditado.DataAniversario), "dd 'de' MMMM", { locale: ptBR })
                                                        : ""}
                                                </h1>
                                            </div>
                                        </div>

                                        <hr className="mt-4"></hr>

                                        <div className="flex mt-4">
                                            <div>
                                                <h1 className="text-left font-bold">CEP:</h1>
                                                <h1>{doadorEditado.CEP}</h1>
                                            </div>
                                            <div>
                                                <h1 className="ml-2 text-left font-bold">Número:</h1>
                                                <h1>{doadorEditado.Numero}</h1>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col text-left mt-4">
                                                <h1 className="font-bold">Rua:</h1>
                                                <h1>{doadorEditado.Rua}</h1>
                                            </div>

                                            <div className="flex flex-col text-left mt-4 ml-10">
                                                <h1 className="font-bold">Bairro:</h1>
                                                <h1>{doadorEditado.Bairro}</h1>
                                            </div>
                                        </div>

                                        <div className="flex flex-col text-left mt-4">
                                            <h1 className="mt-5 font-bold">Complemento:</h1>
                                            <h1>{doadorEditado.Complemento}</h1>
                                        </div>
                                    </div>

                                    <div className="w-[1px]  bg-slate-200 ml-6 mr-6"></div>

                                    <div>
                                        <div>
                                            <div className="flex mt-4 text-left">
                                                <div>
                                                    <h1 className="font-bold ">Nome do Contato:</h1>
                                                    <h1>{doadorEditado.Contato}</h1>
                                                </div>
                                                <div className="ml-20">
                                                    <h1 className="text-left font-bold">Telefone:</h1>
                                                    <h1>{doadorEditado.Telefone}</h1>
                                                </div>
                                            </div>
                                            <div className=" text-left">
                                                <h1 className="mt-5 font-bold">E-mail:</h1>
                                                <h1>{doadorEditado.Email}</h1>
                                            </div>
                                        </div>

                                        <hr className="mt-4 mb-4"></hr>

                                        <div>
                                            <div>
                                                <h1 className=" text-left font-bold">Observações:</h1>
                                                <ScrollArea className="h-[80px]">
                                                    <h1 className=" text-left ">{doadorEditado.ObservacaoDoador}</h1>
                                                </ScrollArea>
                                            </div>
                                            <div>
                                                <h1 className=" text-left font-bold">Origem:</h1>
                                                <h1 className=" text-left ">{doadorEditado.OrigemDoador}</h1>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <Button
                                        className={verMaisContatosInformacoes == 1 ? "bg-slate-500 hover:bg-slate-600" : "bg-slate-400 hover:bg-slate-500"}
                                        onClick={() => {
                                            setVerMaisContatosInformacoes(verMaisContatosInformacoes * -1);
                                            fetchPegarContatos()
                                        }}
                                    >
                                        Mostrar Outros Contatos
                                    </Button>

                                    <Button
                                        className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-500 transition"
                                        onClick={() => {
                                            setPopupInformacoes(false)
                                            setDoadorEditado({
                                                IdDoador: " ",
                                                CPFCNPJ: " ",
                                                Nome: " ",
                                                CEP: " ",
                                                Numero: " ",
                                                Complemento: " ",
                                                ObservacaoDoador: " ",
                                                OrigemDoador: " ",
                                                IdContato: " ",
                                                Contato: " ",
                                                Telefone: " ",
                                                Email: " "
                                            })
                                            setVerMaisContatosInformacoes(-1)
                                            setIdDoadorContato(-1)
                                            setContatos([])
                                        }}
                                    >
                                        Fechar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                popupAdicionarDoacao && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 flex">
                            {popupAdicionarProduto && (
                                <div className="mr-5 pr-5 border-r mt-auto mb-auto">
                                    <h1 className="text-left font-bold">Adicionar Prduto</h1>
                                    <h1 className="text-left mt-3">Nome do Produto</h1>
                                    <Input placeholder="Nome" onChange={(e) => setNovoProduto({ ...novoProduto, Nome: e.target.value })}></Input>
                                    <h1 className="text-left mt-3">Unidade Padrão</h1>
                                    <Input placeholder="Unidade" onChange={(e) => setNovoProduto({ ...novoProduto, UN: e.target.value })}></Input>
                                    <Button className="pl-11 pr-11 bg-green-400 hover:bg-green-500 text-white mt-10"
                                        onClick={() => {
                                            if (!flagDesativaBotaoAdicionar) {
                                                fetchAdicionarProduto()
                                                setFlagDesativaBotaoAdicionar(true)
                                            }
                                        }}
                                    >Adicionar Produto</Button>
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold mb-8">Adicionar Doação à {nomeDoadorAdicionado}</h1>

                                <div className="flex ">

                                    <div className="mr-10">
                                        <h1 className="text-left font-bold mb-2">Adicionar Item</h1>
                                        <Popover open={openProduto} onOpenChange={setOpenProduto}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openProduto}
                                                    className="w-[200px] justify-between"
                                                >
                                                    {valueProduto
                                                        ? Produtos.find((produto) => produto.IdProduto === Number(valueProduto))?.Nome
                                                        : "Selecione um Produto..."}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar produto..." className="h-9" />
                                                    <CommandList>
                                                        <ScrollArea className="h-40">
                                                            <CommandEmpty>Nenhum Produto Encontrado.</CommandEmpty>
                                                            <CommandGroup>
                                                                {Array.isArray(Produtos) && Produtos.length > 0 ? (
                                                                    Produtos.map((produto) => (
                                                                        <CommandItem
                                                                            key={produto.IdProduto}
                                                                            value={`${produto.IdProduto}-${produto.Nome}`} // Inclui ID e Nome no value
                                                                            onSelect={(currentValue) => {
                                                                                const idSelecionado = currentValue.split("-")[0]; // Extrai apenas o ID

                                                                                const selectedProduto = Produtos.find(
                                                                                    (item) => item.IdProduto === Number(idSelecionado)
                                                                                );

                                                                                setValueProduto(Number(idSelecionado));
                                                                                setunidadeAtual(selectedProduto?.UN || "");
                                                                                setnomeProdutoAtual(selectedProduto?.Nome || "");
                                                                                setOpenProduto(false);
                                                                            }}
                                                                        >
                                                                            {produto.Nome}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    valueProduto === produto.IdProduto ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))
                                                                ) : (
                                                                    <CommandEmpty>Nenhum Produto Encontrado.</CommandEmpty>
                                                                )}
                                                            </CommandGroup>
                                                        </ScrollArea>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        <Button className={`pl-10 pr-10 mt-5 block text-black ${popupAdicionarProduto ? "bg-slate-400 hover:bg-slate-500" : "bg-slate-300 hover:bg-slate-400"}`}
                                            onClick={() => { popupAdicionarProduto ? setPopupAdicionarProduto(false) : setPopupAdicionarProduto(true) }}
                                        >Criar novo Produto</Button>

                                        <div className="flex">
                                            <div className="mr-5">
                                                <h1 className="text-left mb-0 mt-3">Quantidade</h1>
                                                <Input
                                                    className="w-[90px]"
                                                    value={quantidadeAtual}
                                                    type="Number"
                                                    onChange={(e) => setQuantidadeAtual(e.target.value)} // Atualiza o estado
                                                />
                                            </div>
                                            <div>
                                                <h1 className="text-left mb-0 mt-3">Unidade</h1>
                                                <Input
                                                    className="w-[90px]"
                                                    value={unidadeAtual}
                                                    onChange={(e) => setunidadeAtual(e.target.value)} // Atualiza o estado
                                                />
                                            </div>
                                        </div>


                                        <Button
                                            className="pl-6 pr-6 bg-green-400 hover:bg-green-500 text-white mt-5"
                                            onClick={() => {
                                                if (quantidadeAtual > 0 && valueProduto !== '') {
                                                    setItens([
                                                        ...Itens, // Adiciona os itens existentes
                                                        {
                                                            IdProduto: valueProduto,
                                                            Quantidade: quantidadeAtual,
                                                            Nome: nomeProdutoAtual,
                                                            UNItem: unidadeAtual
                                                        },
                                                    ]);
                                                    setValueProduto(''); // Reseta o valor do produto
                                                    setnomeProdutoAtual(''); // Reseta o valor do produto
                                                    setQuantidadeAtual(0); // Reseta o valor do produto
                                                    setunidadeAtual(''); // Reseta o valor do produto
                                                }
                                            }}
                                        >
                                            Adicionar Item
                                        </Button>


                                    </div>
                                    <div>
                                        <h1 className="font-bold text-left mb-2">Itens Doados</h1>
                                        <ScrollArea className="h-[167px] w-[350px] rounded-md border p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px] text-center">Nome</TableHead>
                                                        <TableHead className="w-[90px] text-center">Quantidade</TableHead>
                                                        <TableHead className="w-[75px] text-center">Unidade</TableHead>
                                                        <TableHead className="w-[40px] text-center"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Itens.map((item) => (
                                                        <TableRow key={item.IdProduto}>
                                                            <TableCell>{item.Nome}</TableCell>
                                                            <TableCell className="text-center flex justify-between">
                                                                {/* Condicionalmente renderiza o input ou o texto */}
                                                                {editandoId === item.IdProduto ? (
                                                                    <input
                                                                        type="number"
                                                                        value={novaQuantidade}
                                                                        onChange={(e) => setNovaQuantidade(e.target.value)}
                                                                        className="mt-auto mb-auto w-full h-[24px] text-center p-1 rounded border-2 border-stone-200" // Adapte as classes conforme sua UI
                                                                    />
                                                                ) : (
                                                                    <p className="w-full mt-auto mb-auto">{item.Quantidade}</p>
                                                                )}
                                                                {editandoId === item.IdProduto ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            // Lógica para salvar a nova quantidade
                                                                            const quantidadeNumerica = parseFloat(novaQuantidade);
                                                                            if (!isNaN(quantidadeNumerica) && quantidadeNumerica >= 0) { // Validação simples
                                                                                setItens(Itens.map(i =>
                                                                                    i.IdProduto === item.IdProduto
                                                                                        ? { ...i, Quantidade: quantidadeNumerica }
                                                                                        : i
                                                                                ));
                                                                                setEditandoId(null); // Sai do modo de edição
                                                                                setNovaQuantidade(''); // Limpa o valor temporário
                                                                            } else {
                                                                                alert('Por favor, insira uma quantidade válida.');
                                                                            }
                                                                        }}
                                                                        className="float-right rounded-full w-[27px] h-[27px] flex items-center justify-center text-slate-700 bg-slate-300 hover:bg-slate-400" // Classes para o botão Salvar
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="w-3 h-3" // Mantém o mesmo tamanho do lápis
                                                                        >
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditandoId(item.IdProduto); // Entra no modo de edição para este item
                                                                            setNovaQuantidade(item.Quantidade.toString()); // Preenche o input com a quantidade atual
                                                                        }}
                                                                        className="float-right hover:bg-slate-200 rounded-full w-[27px] h-[27px] flex items-center justify-center text-slate-400" // Classes para o botão Lápis
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            className="w-3 h-3"
                                                                        >
                                                                            <path d="M12 20h9M16.5 3.5l4 4L7.5 20.5H3v-4L16.5 3.5z" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-center">{item.UNItem}</TableCell>
                                                            <TableCell className="text-center">
                                                                {/* Botão de Lixo (Remover) */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setItens(Itens.filter(tempItem => tempItem.IdProduto !== item.IdProduto)) }}
                                                                    className="text-gray-600 hover:text-white rounded-full  bg-slate-300 hover:bg-red-500 w-[27px] h-[27px] flex items-center justify-center" // Adicionei mr-2 para espaçamento
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        className="w-3 h-3"
                                                                    >
                                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                    </svg>
                                                                </button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                        {adicionarDinheiro ?
                                            <div className="flex mt-[19px]">
                                                <h1 className="mt-[6px]">Valor:</h1>
                                                <input
                                                    id="brReal-input"
                                                    type="text"
                                                    value={brRealInputValue}
                                                    onChange={brRealHandleInputChange}
                                                    placeholder="R$ 0,00"
                                                    className="brReal-input w-[200px] px-3 py-1 text-right text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Button className="bg-red-400 ml-5"
                                                    onClick={() => {
                                                        setBrRealInputValue("")
                                                        setAdicionarDinheiro(false)
                                                    }}
                                                >Cancelar</Button>
                                            </div>
                                            :
                                            <Button className="mt-[19px] bg-green-400 text-white hover:bg-green-500 w-[350px]"
                                                onClick={() => {
                                                    setAdicionarDinheiro(true)
                                                }}
                                            >+ Adicionar Doação em Dinheiro</Button>
                                        }
                                    </div>
                                    <div className="ml-8">
                                        <h1 className="text-left font-bold mb-2">Agendamento</h1>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data de Agendamento</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <h1 className="text-left font-bold mb-2 mt-3">Observações</h1>
                                        <Textarea className="resize-none h-[64px]"
                                            onChange={(e) => {
                                                setObservacao(e.target.value)
                                            }}
                                        ></Textarea>
                                        <h1 className="text-left font-bold mb-2 mt-3">Destino</h1>
                                        <Input
                                            onChange={(e) => {
                                                setDestino(e.target.value)
                                            }}
                                        ></Input>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-3">
                                    <Button
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                        onClick={() => {
                                            if (!flagDesativaBotaoAdicionar) {
                                                fetchAdicionarDoacao()
                                                setFlagDesativaBotaoAdicionar(true)
                                            }
                                        }}
                                    >
                                        Confirmar
                                    </Button>

                                    <Button
                                        className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-red-700 transition"
                                        onClick={() => {
                                            setPopupAdicionarDoacao(false);
                                            setPopupAdicionarProduto(false);
                                            setItens([]); setObservacao("");
                                            setDate(null)
                                            setBrRealInputValue("")
                                            setAdicionarDinheiro(false)
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                popupDesativarDoador && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">

                            <h1 className=" text-2xl mb-5">
                                Inativar Doador
                            </h1>

                            <div className="text-left flex flex-col gap-5">
                                <p>- Ao desativar este doador, não será permitido que voce adicione doações a ele.</p>
                                <p>- Este doador não irá aparecer na lista de doadores, a não ser que voce habilite a opção de mostrar doadores inativos.</p>
                                <p>- Você pode reverter esta ação à qualquer momento.</p>

                                <hr></hr>
                            </div>

                            <p className="mt-4">Tem certeza que deseja confirmar esta ação?</p>

                            <div className="flex justify-center mt-3">
                                <Button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                    onClick={fetchDesativarDoador}
                                >
                                    Confirmar
                                </Button>

                                <Button
                                    className="px-4 py-2 bg-red-500 text-white rounded  transition"
                                    onClick={() => {
                                        setPopupDesativarDoador(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                popupReativarDoador && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">

                            <h1 className=" text-2xl mb-5">
                                Reativar Doador
                            </h1>

                            <div className="text-left flex flex-col gap-5">
                                <p>- Ao reativar este doador, Ele voltará a aparecer na lista de doadores e em todas as outras listas.</p>
                                <p>- Poderá ser adicionado doações à este doador.</p>
                                <p>- Você pode reverter esta ação à qualquer momento.</p>

                                <hr></hr>
                            </div>

                            <p className="mt-4">Tem certeza que deseja confirmar esta ação?</p>

                            <div className="flex justify-center mt-3">
                                <Button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition mr-4"
                                    onClick={fetchReativarDoador}
                                >
                                    Confirmar
                                </Button>

                                <Button
                                    className="px-4 py-2 bg-red-500 text-white rounded  transition"
                                    onClick={() => {
                                        setPopupReativarDoador(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}