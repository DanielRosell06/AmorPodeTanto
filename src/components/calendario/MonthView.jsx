
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import ViewEventDetails from "./ViewEventDetails"

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    format,
    isSameDay,
    isToday,
} from "date-fns"

export default function MonthView({ currentDate, events, onOpenView }) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const dateRange = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const colorClasses = {
        slate: "bg-slate-100 text-slate-800 hover:bg-slate-300",
        red: "bg-red-100 text-red-800 hover:bg-red-300",
        pink: "bg-pink-100 text-pink-800 hover:bg-pink-300",
        blue: "bg-blue-100 text-blue-800 hover:bg-blue-300",
        green: "bg-green-100 text-green-800 hover:bg-green-300",
        yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-300",
    };

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {weekDays.map((day) => (
                    <div key={day} className="text-center font-semibold py-2 bg-gray-100">
                        {day}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-gray-200">
                {dateRange.map((date) => {
                    const dayEvents = events.filter((event) => isSameDay(event.DataEvento, date))
                    return (
                        <div
                            key={date.toString()}
                            className={`p-1 ${isSameMonth(date, monthStart) ? "bg-white" : "bg-gray-50 text-gray-400"
                                } ${isToday(date) ? "ring-2 ring-blue-500" : ""}`}
                        >
                            <div className={`text-right ${isToday(date) ? "font-bold text-blue-500" : ""}`}>{format(date, "d")}</div>
                            <div className="mt-1 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <Button key={event.IdEvento} className={`text-xs truncate rounded px-1 h-4 w-full ${colorClasses[event.CorEvento] || "bg-gray-100 text-gray-800"}`}
                                        onClick={() => {
                                            onOpenView(event)
                                        }}
                                    >
                                        {event.TituloEvento}
                                    </Button>
                                ))}
                                {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} mais</div>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

