"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CustomDateInput({ onChange, initialValue }) {
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date)) return ""
    return format(date, "dd/MM")
  }

  const [inputValue, setInputValue] = useState(formatDate(initialValue))
  const [previewDate, setPreviewDate] = useState(initialValue ? new Date(initialValue) : null)

  useEffect(() => {
    setInputValue(formatDate(initialValue))
    setPreviewDate(initialValue ? new Date(initialValue) : null)
  }, [initialValue])

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    if (value.length <= 5) {
      setInputValue(value)

      if (value.length === 5) {
        const [day, month] = value.split("/")
        const date = new Date(2000, Number(month) - 1, Number(day))
        if (!isNaN(date)) {
          setPreviewDate(date)
          onChange?.(date)
        } else {
          setPreviewDate(null)
          onChange?.(null)
        }
      } else {
        setPreviewDate(null)
        onChange?.(null)
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
