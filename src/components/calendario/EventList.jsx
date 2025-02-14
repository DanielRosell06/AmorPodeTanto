import { format, compareAsc } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function EventList({ events }) {
  const sortedEvents = [...events].sort((a, b) => compareAsc(a.date, b.date))

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-xl font-bold mb-4">Próximos Eventos</h3>
      {sortedEvents.length > 0 ? (
        <ul className="space-y-2">
          {sortedEvents
            .filter(event => new Date(event.DataEvento) > new Date()) // Filtra eventos futuros
            .map((event) => (
              <li key={event.IdEvento} className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">{event.TituloEvento}</div>
                <div className="text-sm text-gray-600">{format(event.DataEvento, "d 'de' MMMM", { locale: ptBR })}</div>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum evento programado.</p>
      )}
    </div>
  )
}

