"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CustomDateInput({ onChange }) {
  const [inputValue, setInputValue] = useState("")
  const [previewDate, setPreviewDate] = useState(null)

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, "") // Remove não-dígitos

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    if (value.length <= 5) {
      setInputValue(value)

      if (value.length === 5) {
        const [day, month] = value.split("/")
        const dayNum = Number.parseInt(day, 10)
        const monthNum = Number.parseInt(month, 10)

        if (dayNum > 0 && dayNum <= 31 && monthNum > 0 && monthNum <= 12) {
          const date = new Date(2000, monthNum - 1, dayNum)
          setPreviewDate(date)
          if (typeof onChange === "function") {
            onChange(date)
          }
        } else {
          setPreviewDate(null)
          if (typeof onChange === "function") {
            onChange(null)
          }
        }
      } else {
        setPreviewDate(null)
        if (typeof onChange === "function") {
          onChange(null)
        }
      }
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="DD/MM"
        maxLength={5}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Digite o dia e mês (DD/MM)"
      />
      {previewDate && (
        <div className="mt-2 text-sm text-gray-600">
          Data selecionada: {format(previewDate, "dd 'de' MMMM", { locale: ptBR })}
        </div>
      )}
    </div>
  )
}