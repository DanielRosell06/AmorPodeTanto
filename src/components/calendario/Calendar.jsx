"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import MonthView from "./MonthView"
import EventList from "./EventList"
import AddEventButton from "./AddEventButton"
import AddEventModal from "./AddEventModal"
import { addDays } from "date-fns"
import { Value } from "@radix-ui/react-select"
import ViewEventDetails from "./ViewEventDetails"
import AddResults from "./AddResults"

export default function Calendar() {

  const [mockEvents, setMockEvents] = useState([])

  const [popupViewEvent, setPopupViewEvent] = useState(false)
  const [popupResults, setPopupResults] = useState(false)
  const [eventData, setEventData] = useState([])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [atualizarCalendarioVar, setAtualizarCalendarioVar] = useState(-1)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const atualizarCalendario = () => {
    setAtualizarCalendarioVar(atualizarCalendarioVar * -1)
  }

  useEffect(() => {
    const fetchLoadEventos = async () => {
      try {
        const response = await fetch(`/api/evento`, { method: 'GET' });
        const data = await response.json();

        // Corrige a data de cada evento, adicionando 1 dia
        const correctedData = data.map(evento => ({
          ...evento,
          DataEvento: addDays(new Date(evento.DataEvento), 1),
        }));

        setMockEvents(correctedData);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };

    fetchLoadEventos();
  }, [atualizarCalendarioVar]);

  return (
    <div className="flex gap-8 h-[calc(100vh-100px)] w-[90%] ml-auto mr-auto mb-4">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={prevMonth} variant="outline">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex">
            <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</h2>
          </div>
          <Button onClick={nextMonth} variant="outline">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <MonthView currentDate={currentDate} events={mockEvents} onOpenView={(e) => {
          setEventData(e)
          setPopupViewEvent(true)
        }}
        />
      </div>
      <div className="w-80 flex flex-col">
        <AddEventButton onClick={() => setIsModalOpen(true)} className="mb-4" />
        <EventList events={mockEvents} onOpenView={(e) => {
          setEventData(e)
          console.log(e)
          setPopupViewEvent(true)
        }}
          onOpenResults={(e) => {
            setEventData(e)
            setPopupResults(true)
          }}
        />
      </div>
      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} atualizarCalendario={atualizarCalendario} />}
      {popupViewEvent ? (<ViewEventDetails eventData={eventData} onClose={() => { setPopupViewEvent(false) }} atualizarCalendario={atualizarCalendario}></ViewEventDetails>) : ""}
      {popupResults ? (<AddResults eventData={eventData} onClose={() => { setPopupResults(false) }}></AddResults>) : ""}
    </div>
  )
}

