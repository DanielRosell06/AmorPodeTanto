"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { se } from "date-fns/locale"

export default function AddEventModal({ onClose, atualizarCalendario }) {
  const [title, setTitle] = useState("")
  const [detalhes, setDetalhes] = useState("")
  const [date, setDate] = useState("")
  const [color, setColor] = useState("slate")
  const [valorConvite, setValorConvite] = useState("")
  const [imagemEvento, setImagemEvento] = useState("")

  const [brRealInputValue, setBrRealInputValue] = useState("")

  const fetchAdicionarEvento = async () => {
    try {
      const formData = new FormData();
      formData.append("Titulo", title);
      formData.append("Detalhe", detalhes);
      formData.append("Data", date);
      formData.append("Cor", color);
      formData.append("ValorConvite", valorConvite);
      if (imagemEvento) {
        formData.append("ImagemEvento", imagemEvento);
      }

      const response = await fetch(`/api/evento`, {
        method: 'POST',
        body: formData,
      });

      setTitle("");
      setDetalhes("");
      setDate("");
      setColor("slate");
      setImagemEvento("");
      atualizarCalendario();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

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
            <label htmlFor="color" className="block mb-1 font-medium">
              Cor do evento
            </label>
            <div>
              {["slate", "green", "blue", "pink", "red", "yellow"].map((colorOption) => (
                <Button
                  key={colorOption}
                  className={`${color === colorOption ? "border-2 border-black" : "border-2 border-transparent"} box-border w-[34px] h-[34px] bg-${colorOption}-500 hover:bg-${colorOption}-600 rounded-none`}
                  onClick={() => setColor(colorOption)}
                />
              ))}
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

        <div className="relative">
          <Input
            type="file"
            id="file-input"
            className="h-[50px] file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors pr-9"
            onChange={(e) => {
              const fileName = e.target.files[0]?.name || "";
              document.getElementById("remove-btn").style.display = fileName ? "block" : "none";
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
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={fetchAdicionarEvento}>Adicionar Evento</Button>
        </div>
      </div>
    </div>
  );
}

