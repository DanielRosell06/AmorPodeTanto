"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AddResults({ onClose, eventData, atualizarCalendario }) {
    const [title, setTitle] = useState(eventData.TituloEvento)
    const [detalhes, setDetalhes] = useState(eventData.DetalheEvento)
    const [date, setDate] = useState(() => {
        if (eventData?.DataEvento) {
            const adjustedDate = new Date(eventData.DataEvento);
            adjustedDate.setDate(adjustedDate.getDate() - 1);
            return adjustedDate.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
        }
        return ""; // Valor inicial vazio se eventData.DataEvento não estiver definido ainda
    });
    const [color, setColor] = useState(eventData.CorEvento)

    const [editEvent, setEditEvent] = useState(false)

    const colorClasses = {
        slate: "bg-slate-400",
        red: "bg-red-400",
        pink: "bg-pink-400",
        blue: "bg-blue-400",
        green: "bg-green-400",
        yellow: "bg-yellow-400",
    };

    const fetchEditarEvento = async () => {
        try {

            const bodyData = {
                Id: eventData.IdEvento,
                Titulo: title,
                Detalhe: detalhes,
                Data: date,
                Cor: color,
            };

            const response = await fetch(`/api/evento`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            })
            setTitle("")
            setDetalhes("")
            setDate("")
            setColor("slate")
            atualizarCalendario()
            onClose()

        } catch (error) {
            console.error('Erro ao adicionar doacao:', error)
        }
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
                        <div>
                            <h1 className="text-left mt-6 mb-0 text-lg font-bold">
                                Detalhes:
                            </h1>
                            <ScrollArea className="w-[400px] max-h-[200px] text-left mt-0">
                                <h1 className="text-base mt-0">{eventData.DetalheEvento}</h1>
                            </ScrollArea>
                        </div>
                    </>
                    :
                    <>
                        <h2 className="text-2xl font-bold mb-4">Editar Evento</h2>
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
                                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button onClick={fetchEditarEvento}>Confirmar Edição</Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

