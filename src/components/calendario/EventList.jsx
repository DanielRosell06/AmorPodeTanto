import { format, compareAsc } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ViewEventDetails from "./ViewEventDetails"
import { ScrollArea } from "@/components/ui/scroll-area"
import { now } from "next-auth/client/_utils"

export default function EventList({ events, onOpenView, onOpenResults }) {
  const sortedEvents = [...events].sort((a, b) => compareAsc(a.date, b.date))

  const colorClasses = {
    slate: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    red: "bg-red-100 text-red-800 hover:bg-red-200",
    pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    green: "bg-green-100 text-green-800 hover:bg-green-200",
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow p-4 h-[54%]">
        <h3 className="text-xl font-bold mb-4">Próximos Eventos</h3>
        {sortedEvents.length > 0 ? (
          <ScrollArea className="h-[90%]">
            <ul className="space-y-2">
              {sortedEvents
                .filter(event => new Date(event.DataEvento) > new Date()) // Filtra eventos futuros
                .map((event) => (
                  <Button key={event.IdEvento} className={`${colorClasses[event.CorEvento] || "bg-gray-100 text-gray-800"} p-2 rounded flex flex-col text-black text-lg h-20 w-full`}
                    onClick={() => {
                      onOpenView(event)
                    }}
                  >
                    <div className="font-semibold">{event.TituloEvento}</div>
                    <div className="text-sm text-gray-600">{format(event.DataEvento, "d 'de' MMMM", { locale: ptBR })}</div>
                  </Button>
                ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-gray-500">Nenhum evento programado.</p>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-4 h-[38%] mt-[5%]">
        <h3 className="text-xl font-bold mb-4">Adicionar Resultados</h3>
        {sortedEvents.length > 0 ? (
          <ScrollArea className="h-[90%]">
            <ul className="space-y-2">
              {sortedEvents
                .filter(event => event.ValorArrecadado == null && new Date(event.DataEvento) < new Date()) // Filtra eventos futuros
                .map((event) => (
                    <Button key={event.IdEvento} className={`${colorClasses[event.CorEvento] || "bg-gray-100 text-gray-800"} p-2 rounded flex flex-col text-black text-lg h-20 w-full`}
                      onClick={() => {
                        onOpenResults(event)
                      }}
                    >
                      <div className="font-semibold">{event.TituloEvento}</div>
                      <div className="text-sm text-gray-600">{format(event.DataEvento, "d 'de' MMMM", { locale: ptBR })}</div>
                    </Button>
                ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-gray-500">Nenhum evento programado.</p>
        )}
      </div>
    </div>
  )
}

