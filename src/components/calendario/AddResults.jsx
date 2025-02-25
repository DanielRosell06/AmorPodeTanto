"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function AddResults({ onClose, eventData, atualizarCalendario }) {
    const [valorGasto, setValorGasto] = useState(0)
    const [valorRecebido, setValorRecebido] = useState(0)

    const fetchAdicionarEvento = async () => {
        try {
            const bodyData = {
                Id: eventData.IdEvento,
                ValorArrecadado: valorRecebido, // Já salvo como inteiro
                ValorGasto: valorGasto // Já salvo como inteiro
            };

            const response = await fetch(`/api/evento?SomenteResultado=1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            })

            toast("Resultados Adicionados!", {
                description: `Os resultados do evento foram registrados.`,
            })
            atualizarCalendario()
            onClose()
        } catch (error) {
            console.error('Erro ao adicionar resultados:', error)
        }
    }

    const formatarValorParaMoeda = (valor) => {
        return (valor / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const handleValorChange = (event, setValor) => {
        const rawValue = event.target.value.replace(/\D/g, "") // Remove tudo que não for número
        const intValue = Number(rawValue) // Converte para número inteiro
        setValor(intValue) // Armazena o valor multiplicado por 100
    }

    const lucroTotal = valorRecebido - valorGasto // Cálculo do lucro

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-4">
                <h1 className="font-bold text-2xl mb-8">Adicionar Resultado ao Evento: {eventData.TituloEvento}</h1>
                <div className="flex">
                    <div className="text-left mr-10">
                        <h1 className="font-bold">Valor adicional arrecadado:</h1>
                        <Input
                            className="mb-4"
                            onChange={(e) => handleValorChange(e, setValorRecebido)}
                            value={formatarValorParaMoeda(valorRecebido)}
                        />
                        <h1 className="font-bold">Valor gasto neste Evento:</h1>
                        <Input
                            onChange={(e) => handleValorChange(e, setValorGasto)}
                            value={formatarValorParaMoeda(valorGasto)}
                        />
                    </div>
                    <div className="text-left">
                        <h1 className="font-bold mb-4">Valor recebido com convites: {formatarValorParaMoeda(0)}</h1>
                        <h1 className="font-bold text-xl">Lucro total: {formatarValorParaMoeda(lucroTotal)}</h1>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        className="bg-green-400 border hover:bg-green-red-500"
                        onClick={fetchAdicionarEvento}
                    >
                        Confirmar
                    </Button>
                    <Button
                        className="bg-red-400 border hover:bg-red-500"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    )
}
