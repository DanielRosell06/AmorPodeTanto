"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import MonthView from "./MonthView"
import EventList from "./EventList"
import AddEventButton from "./AddEventButton"
import AddEventModal from "./AddEventModal"

const mockEvents = [
  { id: "1", title: "Reunião de Equipe", date: new Date(2025, 1, 15), color: "pink"},
  { id: "2", title: "Entrega do Projeto", date: new Date(2025, 1, 20), color: "blue"},
  { id: "3", title: "Aniversário do João", date: new Date(2025, 1, 25), color: "green"},
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="flex gap-8 h-[calc(100vh-100px)] w-[90%] ml-auto mr-auto mb-4">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={prevMonth} variant="outline">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</h2>
          <Button onClick={nextMonth} variant="outline">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <MonthView currentDate={currentDate} events={mockEvents} />
      </div>
      <div className="w-80 flex flex-col">
        <AddEventButton onClick={() => setIsModalOpen(true)} className="mb-4" />
        <ScrollArea className="flex-1">
          <EventList events={mockEvents} />
        </ScrollArea>
      </div>
      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

