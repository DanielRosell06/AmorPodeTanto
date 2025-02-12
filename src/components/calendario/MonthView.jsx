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

export default function MonthView({ currentDate, events }) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const dateRange = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

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
                    const dayEvents = events.filter((event) => isSameDay(event.date, date))
                    return (
                        <div
                            key={date.toString()}
                            className={`p-1 ${isSameMonth(date, monthStart) ? "bg-white" : "bg-gray-50 text-gray-400"
                                } ${isToday(date) ? "ring-2 ring-blue-500" : ""}`}
                        >
                            <div className={`text-right ${isToday(date) ? "font-bold text-blue-500" : ""}`}>{format(date, "d")}</div>
                            <div className="mt-1 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div key={event.id} className={`text-xs truncate bg-${event.color}-100 text-${event.color}-800 rounded px-1`}>
                                        {event.title}
                                    </div>
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

