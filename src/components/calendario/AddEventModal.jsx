"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"

export default function AddEventModal({ onClose, atualizarCalendario }) {
  const [title, setTitle] = useState("")
  const [detalhes, setDetalhes] = useState("")
  const [date, setDate] = useState("")
  const [color, setColor] = useState("slate")
  const [valorConvite, setValorConvite] = useState("")

  const [brRealInputValue, setBrRealInputValue] = useState("")

  const fetchAdicionarEvento = async () => {
    try {

      const bodyData = {
        Titulo: title,
        Detalhe: detalhes,
        Data: date,
        Cor: color,
        ValorConvite: valorConvite
      };

      const response = await fetch(`/api/evento`, {
        method: 'POST',
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
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Evento</h2>
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
        <div className="w-full mt-4 mb-6">
          <h1 className="ml-auto mr-auto">Valor do Convite:</h1>
          <Input
            id="brReal-input"
            type="text"
            value={brRealInputValue}
            onChange={brRealHandleInputChange}
            placeholder="R$ 0,00"
            className="brReal-input w-[100px] px-3 py-1 text-right text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto mr-auto"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={fetchAdicionarEvento}>Adicionar Evento</Button>
        </div>
      </div>
    </div>
  )
}

