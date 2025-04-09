"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function AddEventModal({ onClose, eventData, atualizarCalendario, atualizarConvitesNaoPagos }) {
    const [title, setTitle] = useState(eventData.TituloEvento)
    const [detalhes, setDetalhes] = useState(eventData.DetalheEvento)
    const [valorConvite, setValorConvite] = useState(eventData.ValorConviteEvento)
    const [urlImagem, setUrlImagem] = useState(eventData.URLImagemEvento)
    const [alterandoImagem, setAlterandoImagem] = useState(false)
    const [tituloSite, setTituloSite] = useState(eventData.TituloSiteEvento)
    const [detalhesSite, setDetalhesSite] = useState(eventData.DescricaoSiteEvento)
    const [imagemEvento, setImagemEvento] = useState("")
    const [date, setDate] = useState(() => {
        if (eventData?.DataEvento) {
            const adjustedDate = new Date(eventData.DataEvento);
            adjustedDate.setDate(adjustedDate.getDate() - 1);
            return adjustedDate.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
        }
        return ""; // Valor inicial vazio se eventData.DataEvento não estiver definido ainda
    });
    const [color, setColor] = useState(eventData.CorEvento)

    const [adicionarConvite, setAdicionarConvite] = useState(-1)
    const switchAdicionarConvite = function () {
        setAdicionarConvite(adicionarConvite * -1)
    }
    const [editEvent, setEditEvent] = useState(false)


    const [brRealInputValue, setBrRealInputValue] = useState(eventData.ValorConviteEvento)

    const colorClasses = {
        slate: "bg-slate-400",
        red: "bg-red-400",
        pink: "bg-pink-400",
        blue: "bg-blue-400",
        green: "bg-green-400",
        yellow: "bg-yellow-400",
    };

    const [pesquisa, setPesquisa] = useState("")
    const [pesquisaInput, setPesquisaInput] = useState("")

    const [doador, setDoador] = useState([])

    const [doadorConvite, setDoadorConvite] = useState("")
    const [doadorConviteNome, setDoadorConviteNome] = useState("")

    const [quantidadeConvites, setQuantidadeConvites] = useState("");


    const formatCurrency = (value) => {
        if (value == null) {
            value = "0"
        }
        if (typeof value !== "string") {
            value = String(value); // Converte para string caso não seja
        }
        const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
        const floatValue = parseFloat(numericValue) / 100; // Ajusta para casas decimais
        return floatValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const [statusPagamentoConvite, setStatusPagamentoConvite] = useState(1);

    const handleCheckboxChange = (checked) => {
        checked ? setStatusPagamentoConvite(1) : setStatusPagamentoConvite(0);
    };

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
        }, 1000);
    };

    const handleChangeQuantidadeConvites = (e) => {
        const novoValor = e.target.value;
        setQuantidadeConvites(novoValor);
    };


    useEffect(() => {
        setBrRealInputValue(formatCurrency(brRealInputValue));
    }, [])

    useEffect(() => {
        const fetchLoadDoadores = async () => {
            try {
                const response = await fetch(`/api/doador?searchBy=${pesquisa}&searchIn=${pesquisaInput}`,
                    { method: 'GET' }
                );
                const data = await response.json();
                setDoador(data);
            } catch (error) {
                console.error('Erro ao carregar doadores:', error);
            }
        }

        fetchLoadDoadores()

    }, [pesquisaInput])

    const fetchEditarEvento = async () => {
        try {
            const formData = new FormData();
            formData.append("Id", eventData.IdEvento);
            formData.append("Titulo", title);
            formData.append("Detalhe", detalhes);
            formData.append("Data", date);
            formData.append("Cor", color);
            formData.append("ValorConvite", valorConvite);
            if (imagemEvento) {
                formData.append("ImagemEvento", imagemEvento);
            }
            if (tituloSite) {
                formData.append("TituloSite", tituloSite);
            }
            if (detalhesSite) {
                formData.append("DetalhesSite", detalhesSite);
            }

            const response = await fetch(`/api/evento`, {
                method: 'PUT',
                body: formData
            });

            setTitle("");
            setDetalhes("");
            setDate("");
            setColor("slate");
            setValorConvite(null);
            atualizarCalendario();
            onClose();

        } catch (error) {
            console.error('Erro ao editar evento:', error);
        }
    };

    const fetchAdicionarConvite = async () => {
        try {

            const bodyData = {
                IdEvento_: eventData.IdEvento,
                IdDoador_: doadorConvite,
                Quantidade: quantidadeConvites,
                Status: statusPagamentoConvite
            };

            const response = await fetch(`/api/convite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            })

            setQuantidadeConvites(0)
            setStatusPagamentoConvite(0)
            setDoadorConvite("")
            setDoadorConviteNome("")
            setAdicionarConvite(-1)
            atualizarConvitesNaoPagos()

            toast("Convite Adicionado!", {
                description: `Convite adicionado com sucesso.`,
            })

        } catch (error) {
            console.error('Erro ao adicionar doacao:', error)
        }
    }

    const [dadosConvites, setDadosConvites] = useState([])
    const [atualizarConvitesVar, setAtualizarConvitesVar] = useState(-1)
    const [valorTotalArrecadado, setValorTotalArrecadado] = useState(-1)

    const atualizarConvites = function () {
        setAtualizarConvitesVar(atualizarConvitesVar * -1)
    }

    useEffect(() => {
        const fetchGetDadosConvite = async () => {
            try {
                const response = await fetch(`/api/convite?IdEvento=${eventData.IdEvento}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json();
                setDadosConvites(data)

                let novoValorArrecadado;

                if (data.length > 0) {
                    const totalConvites = data.reduce((sum, convite) => sum + convite.QuantidadeConvite, 0);
                    novoValorArrecadado = eventData.ValorArrecadado + (totalConvites * eventData.ValorConviteEvento);
                } else {
                    novoValorArrecadado = eventData.ValorArrecadado
                }
                setValorTotalArrecadado(novoValorArrecadado);
            } catch (error) {
                console.error('Erro ao buscar dados dos convites:', error)
            }
        }

        if (eventData?.IdEvento) {
            fetchGetDadosConvite()
        }
    }, [eventData, atualizarConvitesVar])


    const brRealFormatCurrency = (brRealRawValue) => {
        // Remove tudo que não for dígito
        const brRealDigitsOnly = brRealRawValue.replace(/\D/g, "")

        // Converte para número e divide por 100 para ter os centavos
        const brRealNumberValue = Number(brRealDigitsOnly) / 100

        const ValorFinal = brRealNumberValue * 100
        setValorConvite(ValorFinal)

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-4">
                <div className="text-right">
                    <Button className="rounded-full w-[50px] h-[50px] bg-white border hover:bg-slate-200 text-black text-lg mr-3"
                        onClick={() => {
                            editEvent ? setEditEvent(false) : setEditEvent(true)
                        }}
                    >
                        <i className="fas fa-pen"></i>
                    </Button>
                    <Button className="rounded-full w-[50px] h-[50px] bg-white border hover:bg-slate-200 text-black text-lg "
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                    </Button>
                </div>
                {!editEvent ?
                    <>
                        <div className="flex">
                            <div className="mr-10">
                                <h1 className="font-bold mb-[30px]">Convites já Comprados</h1>
                                <ScrollArea className="h-[240px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">Doador</TableHead>
                                                <TableHead className="w-[100px] text-center">Quantidade</TableHead>
                                                <TableHead className="w-[100px] text-center">Pago</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dadosConvites != -1 && (
                                                dadosConvites.map((convite) => (
                                                    <TableRow key={convite.IdConvite} className={convite.StatusConvite == 1 ? 'bg-white' : 'bg-red-100 hover:bg-red-200'}>
                                                        <TableCell className="">{convite.doador.Nome}</TableCell>
                                                        <TableCell className="">{convite.QuantidadeConvite}</TableCell>
                                                        <TableCell className="">{convite.StatusConvite == 1 ? "Sim" : "Não"}</TableCell>
                                                    </TableRow>
                                                ))
                                            )
                                            }
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            <div>
                                <div>
                                    <h1 className="text-2xl mt-5 font-bold">{eventData.TituloEvento}</h1>
                                </div>
                                <div>
                                    <h1 className="font-bold">Data: {new Date(eventData.DataEvento).toLocaleDateString()}</h1>
                                </div>
                                <div className="flex h-[30px] ml-auto mr-auto w-[80px]">
                                    <h1 className="font-bold mt-auto mb-auto">Cor: </h1>
                                    <div className={`w-[30px] h-[30px] ml-2 ${colorClasses[eventData.CorEvento]}`}></div>
                                </div>
                                {eventData.ValorGasto != null && <div className="mt-4">
                                    <div className="flex">
                                        <h1 className="font-bold">Total Arrecadado: ....</h1>
                                        <h1>
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(valorTotalArrecadado / 100)}
                                        </h1>
                                    </div>
                                    <div className="flex">
                                        <h1 className="font-bold">Valor Gasto: .............</h1>
                                        <h1>
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(eventData.ValorGasto / 100)}
                                        </h1>
                                    </div>
                                    <div className="flex">
                                        <h1 className="font-bold">Lucro Total: ..............</h1>
                                        <h1>
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format((valorTotalArrecadado - eventData.ValorGasto) / 100)}
                                        </h1>
                                    </div>
                                </div>

                                }
                                <div>
                                    <h1 className="text-left mt-6 mb-0 text-lg font-bold">
                                        Detalhes:
                                    </h1>
                                    <ScrollArea className="w-[400px] h-[100px] text-left mt-0">
                                        {eventData.DetalheEvento}
                                    </ScrollArea>
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl mb-3">Site:</h2>
                                    {eventData.TituloSiteEvento != null ?
                                        <div className=" w-full mb-3">
                                            <p className="ml-auto"><span className="font-bold">Título:</span> {eventData.TituloSiteEvento}</p>
                                            <p className="ml-auto"><span className="font-bold">Descrição:</span> {eventData.DescricaoSiteEvento}</p>
                                        </div>
                                        : ""}
                                    {eventData.URLImagemEvento != null && eventData.URLImagemEvento != "" ?
                                        <div className="flex w-full mb-3">
                                            <p className="ml-auto mt-auto mb-auto font-bold">Imagem: </p>
                                            <Image src={`${eventData.URLImagemEvento}`} alt="Imagem do Evento" width={100} height={100} className="ml-3 rounded-lg mr-auto"></Image>
                                        </div>
                                        : ""}
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <h1 className="font-bold">Valor do Convite: {eventData.ValorConviteEvento ? `R$${(eventData.ValorConviteEvento / 100).toFixed(2)}` : "Indisponível"}</h1>
                                    <Button className="bg-green-400 hover:bg-green-500"
                                        onClick={() => {
                                            switchAdicionarConvite()
                                        }}
                                    >Compra de  Convite</Button>
                                </div>
                            </div>
                            {adicionarConvite == 1 ?
                                <div className="ml-4 pt-5 flex">
                                    <div className="w-[2px] h-full bg-slate-200"></div>
                                    <div className="ml-4 text-center">
                                        <div>
                                            <h1 className="font-bold text-xl">Registrar Compra de Convite</h1>
                                        </div>
                                        <div className="flex mt-4">
                                            <Input className="w-[250px]" placeholder="Pesquisar doador..."
                                                value={inputValue}
                                                onChange={handleInputChange}
                                            />
                                            <Select value={pesquisa} onValueChange={setPesquisa}>
                                                <SelectTrigger className="w-[120px] ml-1">
                                                    <SelectValue placeholder="Por:" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="nome">Nome</SelectItem>
                                                    <SelectItem value="CPFCNPJ">CPF / CNPJ</SelectItem>
                                                    <SelectItem value="telefone">Telefone</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <ScrollArea className="h-[120px]">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="text-center">Nome</TableHead>
                                                            <TableHead className="w-[100px] text-center"><i className="fas fa-caret-down"></i></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {doador.map((doador) => (
                                                            <TableRow key={doador.IdDoador} className={doador.Status ? 'bg-white' : 'bg-red-100 hover:bg-red-200'}>
                                                                <TableCell className="">{doador.Nome}</TableCell>
                                                                <Button className="bg-slate-400 hover:bg-green-500"
                                                                    onClick={() => {
                                                                        setDoadorConvite(doador.IdDoador)
                                                                        setDoadorConviteNome(doador.Nome)
                                                                    }}
                                                                ><i className="fas fa-check "></i></Button>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </ScrollArea>
                                        </div>
                                        <div className="mt-4">
                                            Adicionar Compra à: {doadorConviteNome}
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <div className="flex h-[36px]">
                                                    <h1 className="mt-auto mb-auto">Quantidade:</h1>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="w-[80px]"
                                                        value={quantidadeConvites}
                                                        onChange={handleChangeQuantidadeConvites}
                                                    />
                                                </div>
                                                <div className="flex h-[30px]">
                                                    <h1 className="mt-auto mb-auto">Foi pago?</h1>
                                                    <Checkbox
                                                        checked={statusPagamentoConvite}
                                                        onCheckedChange={handleCheckboxChange}
                                                        className="ml-2 mt-auto mb-auto"
                                                    />
                                                    <p className="ml-1 mt-auto mb-auto">{statusPagamentoConvite ? "Sim" : "Não"}</p>
                                                </div>
                                            </div>
                                            <Button className="bg-green-400 hover:bg-green-500"
                                                onClick={() => {
                                                    fetchAdicionarConvite()
                                                    atualizarConvites()
                                                }}
                                            >Confirmar</Button>
                                        </div>

                                    </div>
                                </div>
                                : ""}
                        </div>
                    </>
                    :
                    <>
                        <h2 className="text-2xl font-bold mb-4">Editar Evento</h2>
                        <div className="flex">
                            <div>
                                <div>
                                    <label htmlFor="title" className="block mb-1 font-medium">
                                        Título do Evento
                                    </label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="Digite o título do evento"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label>
                                        Detalhes do Evento
                                    </label>
                                    <Textarea
                                        id="detalhes"
                                        value={detalhes}
                                        onChange={(e) => setDetalhes(e.target.value)}
                                        required
                                        placeholder="Digite detalhes sobre o evento"
                                        className=" resize-none "
                                    />
                                </div>
                                <div className="flex mt-4">
                                    <div>
                                        <label htmlFor="date" className="block mb-1 font-medium">
                                            Data do Evento
                                        </label>
                                        {new Date(date) < new Date() ?
                                            new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                                            :
                                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                        }

                                    </div>
                                    <div className="ml-9">
                                        <label htmlFor="date" className="block mb-1 font-medium">
                                            Cor do evento
                                        </label>
                                        <div>
                                            <Button className={`${color === "slate" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-slate-300 hover:bg-slate-400 rounded-none`}
                                                onClick={() => setColor("slate")}>
                                            </Button>

                                            <Button className={`${color === "green" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-green-500 hover:bg-green-600 rounded-none`}
                                                onClick={() => setColor("green")}>
                                            </Button>

                                            <Button className={`${color === "blue" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-blue-500 hover:bg-blue-600 rounded-none`}
                                                onClick={() => setColor("blue")}>
                                            </Button>

                                            <Button className={`${color === "pink" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-pink-500 hover:bg-pink-600 rounded-none`}
                                                onClick={() => setColor("pink")}>
                                            </Button>

                                            <Button className={`${color === "red" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-red-500 hover:bg-red-600 rounded-none`}
                                                onClick={() => setColor("red")}>
                                            </Button>

                                            <Button className={`${color === "yellow" ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-yellow-500 hover:bg-yellow-600 rounded-none`}
                                                onClick={() => setColor("yellow")}>
                                            </Button>

                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-4 mb-6">
                                    <h1 className="ml-auto mr-auto">Valor do Convite:</h1>
                                    <Input
                                        id="brReal-input"
                                        type="text"
                                        onChange={brRealHandleInputChange}
                                        value={brRealInputValue}
                                        placeholder="R$ 0,00"
                                        className="brReal-input w-[100px] px-3 py-1 text-right text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto mr-auto"
                                    />
                                </div>
                            </div>
                            <div className="h-full mr-4 ml-4 bg-slate-300 w-[2px]"></div>
                            <div>
                                <h2 className="font-bold text-xl mb-2">Para o Site</h2>

                                <div className="mb-4">
                                    <h2>Título do evento no site:</h2>
                                    <Input placeholder="Título no Site" value={tituloSite} onChange={(e) => setTituloSite(e.target.value)}></Input>
                                </div>
                                <div className="mb-4">
                                    <h2>Descrição do evento no site:</h2>
                                    <Textarea className="resize-none" placeholder="Descrição no Site" value={detalhesSite} onChange={(e) => setDetalhesSite(e.target.value)}></Textarea>
                                </div>
                                {!alterandoImagem ?
                                    <div className="flex">
                                        <h1 className="mt-auto mb-auto text-lg">Imagem:</h1>
                                        <Image src={urlImagem} alt="Imagem do Evento" width={100} height={100} className="ml-3 rounded-lg mt-4"></Image>
                                        <Button className="mt-auto mb-auto ml-3 bg-slate-400 hover:bg-red-500"
                                            onClick={() => {
                                                setAlterandoImagem(true)
                                            }}
                                        >Alterar Imagem</Button>

                                    </div>
                                    :
                                    <>
                                        <h1>Imagem:</h1>
                                        <Input
                                            type="file"
                                            id="file-input"
                                            className="h-[50px] file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors pr-9"
                                            onChange={(e) => {
                                                const fileName = e.target.files[0]?.name || "";
                                                document.getElementById("remove-btn").style.display = imagemEvento != "" ? "block" : "none";
                                                setImagemEvento(e.target.files[0]);
                                            }}
                                        />
                                        <button
                                            id="remove-btn"
                                            onClick={() => {
                                                const fileInput = document.getElementById("file-input");
                                                fileInput.value = "";
                                                document.getElementById("remove-btn").style.display = "none";
                                            }}
                                            className=" mt-[7px] hidden absolute top-1 right-1 bg-red-500 text-white rounded-md p-1 hover:bg-red-600 transition-colors mr-2"
                                            aria-label="Remover arquivo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button onClick={fetchEditarEvento}>Confirmar Edição</Button>
                        </div>

                    </>
                }
            </div>
        </div >
    )
}

