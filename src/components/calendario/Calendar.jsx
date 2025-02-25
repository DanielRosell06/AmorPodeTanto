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
import ConvitesNaoPagos from "./ConvitesNaoPagos"
import { isValid } from "date-fns";
import { toast } from "sonner"

export default function Calendar() {

  const [mockEvents, setMockEvents] = useState([])

  const [popupViewEvent, setPopupViewEvent] = useState(false)
  const [popupResults, setPopupResults] = useState(false)
  const [popupInformacoes, setPopupInformacoes] = useState(false)
  const [popupPagarConvite, setPopupPagarConvite] = useState(false)

  const [eventData, setEventData] = useState([])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [atualizarCalendarioVar, setAtualizarCalendarioVar] = useState(-1)
  const [atualizarConvitesNaoPagosVar, setAtualizarConvitesNaoPagosVar] = useState(-1)

  const [idConvitePago, setIdConvitePago] = useState(-1)
  const [idConvitePagoTemp, setIdConvitePagoTemp] = useState(-1)
  const [idToFind, setIdToFind] = useState(-1)
  const [verMaisContatosInformacoes, setVerMaisContatosInformacoes] = useState(-1)

  const [contatos, setContatos] = useState([])
  const [convitesNaoPagos, setConvitesNaoPagos] = useState([])  
  const [idDoadorContato, setIdDoadorContato] = useState("")
  const [doadorEditado, setDoadorEditado] = useState({
    IdDoador: " ",
    CPFCNPJ: " ",
    Nome: " ",
    CEP: " ",
    Numero: " ",
    Complemento: " ",
    IdContato: " ",
    Contato: " ",
    Telefone: " ",
    Email: " "
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const atualizarCalendario = () => {
    setAtualizarCalendarioVar(atualizarCalendarioVar * -1)
  }

  const atualizarConvitesNaoPagos = () => {
    setAtualizarConvitesNaoPagosVar(atualizarConvitesNaoPagosVar * -1)
  }


  useEffect(() => {
    const fetchGetDoador = async () => {
      try {
        const response = await fetch(`api/doadorById?Id=${idToFind}`, {
          method: 'GET',
        })
        const data = await response.json();
        setDoadorEditado(data)
        console.log(data)
        setIdToFind(-1)
        setPopupInformacoes(true)

      } catch (error) {
        console.error('Erro ao buscar doador:', error)
      }
    }

    if (idToFind != -1) {
      fetchGetDoador()
    }

  }, [idToFind])

  const fetchPegarContatos = async () => {
    try {
      const response = await fetch(`/api/contato?contatoDoadorId=${idDoadorContato}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      setContatos(data)
    } catch (error) {
      console.error('Erro ao pegar contato:', error)
    }
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

  useEffect(() => {
    const fetchConvitePago = async () => {
      try {
        const response = await fetch(`/api/convite?IdConvite=${idConvitePago}`,
          {
            method: 'PUT'
          });
        const data = await response.json();
        toast("Convite Pago!", {
          description: `Pagamento do convite cadastrado com sucesso.`,
        })

      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
      atualizarConvitesNaoPagos()
      setPopupPagarConvite(false)
    };

    if (idConvitePago != -1) {
      fetchConvitePago();
    }

  }, [idConvitePago]);


  useEffect(() => {
    const fetchGetConvitesNaoPagos = async () => {
      try {
        const response = await fetch(`/api/convite?Status=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setConvitesNaoPagos(data)

      } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
      }
    };

    fetchGetConvitesNaoPagos()

  }, [atualizarConvitesNaoPagosVar]);

  return (
    <div>
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
      </div>
      <div>
        <ConvitesNaoPagos convitesNaoPagos={convitesNaoPagos} onOpenContato={(e) => {
          setIdToFind(e)
          setIdDoadorContato(e)
        }}
          onConvitePago={(e) => {
            setIdConvitePagoTemp(e)
            setPopupPagarConvite(true)
          }}
        ></ConvitesNaoPagos>
      </div>

      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} atualizarCalendario={atualizarCalendario} />}
      {popupViewEvent ? (<ViewEventDetails eventData={eventData} onClose={() => { setPopupViewEvent(false) }} atualizarCalendario={atualizarCalendario} atualizarConvitesNaoPagos={atualizarConvitesNaoPagos}></ViewEventDetails>) : ""}
      {popupResults ? (<AddResults eventData={eventData} onClose={() => { setPopupResults(false) }} onAtualizarCalendario={atualizarCalendario}></AddResults>) : "" }
      {popupInformacoes && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6  flex">

            {verMaisContatosInformacoes == 1 && contatos.length > 0 ?
              <div className="flex">
                <div>
                  <h1 className="w-[200px] mb-5 font-bold">Todos os Contatos</h1>
                  {contatos.map((contato, index) => (
                    <div key={index} className="flex flex-col">
                      <Button className=" mt-1 w-[180px] text-left justify-start bg-white hover:bg-slate-100 text-slate-500 border-none shadow-none"
                        onClick={() => {
                          setDoadorEditado({
                            ...doadorEditado,
                            Contato: contato.Contato,
                            Telefone: contato.Telefone,
                            Email: contato.Email
                          });
                        }}
                      >{contato.Contato}</Button>
                    </div>
                  ))}
                </div>
                <div className="w-[1px] h-full bg-slate-300 mr-8" />
              </div>
              : ""
            }
            <div>
              <h1 className="text-xl font-bold mb-4">Informações de {doadorEditado.Nome}</h1>


              <div className="flex text-left">
                <div>
                  <h1 className=" font-bold">CPF/CNPJ:</h1>
                  <h1>{doadorEditado.CPFCNPJ}</h1>
                </div>
                <div className="ml-10">
                  <h1 className=" font-bold">Nome:</h1>
                  <h1>{doadorEditado.Nome}</h1>
                </div>
              </div>

              <div className="flex text-left mt-2">
                <div>
                  <h1 className=" font-bold">Sexo:</h1>
                  <h1>{doadorEditado.Sexo == 0 ? "Masculino" :
                    (doadorEditado.Sexo == 1 ? "Feminino" :
                      (doadorEditado.Sexo == 2 ? "Outro" : "")
                    )
                  }</h1>
                </div>
                <div className="ml-10">
                  <h1 className=" font-bold">Data de Aniversário:</h1>
                  <h1>
                    {doadorEditado.DataAniversario && isValid(new Date(doadorEditado.DataAniversario))
                      ? format(new Date(doadorEditado.DataAniversario), "dd 'de' MMMM", { locale: ptBR })
                      : ""}
                  </h1>
                </div>
              </div>

              <hr className="mt-4"></hr>

              <div className="flex mt-4">
                <div>
                  <h1 className="text-left font-bold">CEP:</h1>
                  <h1>{doadorEditado.CEP}</h1>
                </div>
                <div>
                  <h1 className="ml-2 text-left font-bold">Número:</h1>
                  <h1>{doadorEditado.Numero}</h1>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col text-left mt-4">
                  <h1 className="font-bold">Rua:</h1>
                  <h1>{doadorEditado.Rua}</h1>
                </div>

                <div className="flex flex-col text-left mt-4 ml-10">
                  <h1 className="font-bold">Bairro:</h1>
                  <h1>{doadorEditado.Bairro}</h1>
                </div>
              </div>

              <div className="flex flex-col text-left mt-4">
                <h1 className="mt-5 font-bold">Complemento:</h1>
                <h1>{doadorEditado.Complemento}</h1>
              </div>

              <hr className="mt-4"></hr>

              <div className="flex mt-4 text-left">
                <div>
                  <h1 className="font-bold ">Nome do Contato:</h1>
                  <h1>{doadorEditado.Contato}</h1>
                </div>
                <div className="ml-20">
                  <h1 className="text-left font-bold">Telefone:</h1>
                  <h1>{doadorEditado.Telefone}</h1>
                </div>
              </div>
              <div className=" text-left">
                <h1 className="mt-5 font-bold">E-mail:</h1>
                <h1>{doadorEditado.Email}</h1>
              </div>

              <hr className="mt-4"></hr>

              <div className="flex justify-between mt-3">
                <Button
                  className={verMaisContatosInformacoes == 1 ? "bg-slate-500 hover:bg-slate-600" : "bg-slate-400 hover:bg-slate-500"}
                  onClick={() => {
                    setVerMaisContatosInformacoes(verMaisContatosInformacoes * -1);
                    fetchPegarContatos()
                  }}
                >
                  Mostrar Outros Contatos
                </Button>

                <Button
                  className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-500 transition"
                  onClick={() => {
                    setPopupInformacoes(false)
                    setDoadorEditado({
                      IdDoador: " ",
                      CPFCNPJ: " ",
                      Nome: " ",
                      CEP: " ",
                      Numero: " ",
                      Complemento: " ",
                      IdDoador: " ",
                      Contato: " ",
                      Telefone: " ",
                      Email: " "
                    })
                    setVerMaisContatosInformacoes(-1)
                    setIdDoadorContato(-1)
                    setContatos([])
                  }}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupPagarConvite && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-[370px]">
            <h1>Tem certeza que deseja marcar este convite como pago?</h1>
            <div className="flex w-full justify-center mt-4">
              <Button
                className={"bg-slate-400 hover:bg-green-500 mr-4"}
                onClick={() => {
                  setIdConvitePago(idConvitePagoTemp)
                }}
              >
                Confirmar
              </Button>

              <Button
                className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition"
                onClick={() => {
                  setPopupPagarConvite(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}

