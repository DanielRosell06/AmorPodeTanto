import { format, compareAsc } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

export default function EventList({ events, onOpenView }) {
  const sortedEvents = [...events].sort((a, b) => compareAsc(new Date(a.DataEvento), new Date(b.DataEvento)));
  const [pesquisaEventosPassadosInput, setPesquisaEventosPassadosInput] = useState("");
  const [dadosConvites, setDadosConvites] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null); // Estado para armazenar o evento selecionado

  const colorClasses = {
    slate: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    red: "bg-red-100 text-red-800 hover:bg-red-200",
    pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    green: "bg-green-100 text-green-800 hover:bg-green-200",
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  };

  return (
    <div className="ml-[2vw] w-[35vw] h-full mb-[50px] mt-4">
      <div className="bg-white rounded-lg shadow p-4 h-[54%]">
        <h3 className="text-xl font-bold mb-4">Eventos Passados</h3>

        {/* Input de Pesquisa */}
        <Input
          placeholder="Pesquisar..."
          className="mb-4"
          value={pesquisaEventosPassadosInput}
          onChange={(e) => setPesquisaEventosPassadosInput(e.target.value)}
        />

        {sortedEvents.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <ul className="space-y-2">
              {sortedEvents
                .filter(
                  (event) =>
                    new Date(event.DataEvento) < new Date() &&
                    event.ValorGasto != null &&
                    event.TituloEvento.toLowerCase().includes(pesquisaEventosPassadosInput.toLowerCase()) // Filtra eventos pelo nome
                )
                .map((event) => (
                  <Button
                    key={event.IdEvento}
                    className={`${colorClasses[event.CorEvento] || "bg-gray-100 text-gray-800"} p-2 rounded flex flex-col text-black text-lg h-20 w-full`}
                    onClick={() => {
                      setEventoSelecionado(event); // Define o evento selecionado
                      onOpenView(event);
                    }}
                  >
                    <div className="font-semibold">{event.TituloEvento}</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(event.DataEvento), "d 'de' MMMM", { locale: ptBR })}
                    </div>
                  </Button>
                ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-gray-500">Nenhum evento programado.</p>
        )}
      </div>
    </div>
  );
}
