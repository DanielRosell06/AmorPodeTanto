import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddEventButton({ onClick, className }) {
  return (
    <Button onClick={onClick} className={`w-full ${className} bg-green-400 hover:bg-green-500`}>
      <Plus className="mr-2 h-4 w-4" /> Adicionar Evento
    </Button>
  )
}

