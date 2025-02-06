"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function NoLayoutPage() {

  const [dados, setDados] = useState(null);
  const [doacoes, setDoacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [doacoes])

  useEffect(() => {
    // Verifica se está no lado do cliente
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('ArrayIdDoacoes');
      if (storedData) {
        setDados(JSON.parse(storedData));
      }
    }
  }, []);

  useEffect(() => {
    const fetchLoadDoacoes = async () => {
      try {
        const response = await fetch(`api/ficha?arrayIdDoacao=${dados}`, {
          method: 'GET'
        })
        const data = await response.json();
        setDoacoes(data.listaCompleta)
      } catch (error) {
        console.error('Erro ao desativar doador:', error)
      }
    }

    fetchLoadDoacoes()
  }, [dados])

  return (
    <div>
      {loading ?
        <>
          <h1 className=' text-center mt-20'>Carregando... </h1>
        </>
        :
        <>
          {doacoes.length > 0 ?
            doacoes.map((doacao, index) => (

              <div key={doacao.IdDoacao} className='ml-10 mr-10 text-sm '>
                {index % 7 == 0 ?
                  <Image
                    className=" mt-[5px] w-[126px] h-[75px] "
                    src='/Logo.png'
                    alt='Logo'
                    width={168}
                    height={100}
                    quality={100}
                  />
                  : ""}
                <div className='border mt-4'>
                  <div className='flex'>
                    <div className='w-[33%] border-r border-b'>
                      Nome: {(() => {
                        const partes = doacao.doador.Nome.split(" ");
                        if (partes.length > 2 && ["da", "de", "do"].includes(partes[1].toLowerCase())) {
                          return partes.slice(0, 3).join(" ");
                        }
                        return partes.slice(0, 2).join(" ");
                      })()}
                    </div>
                    <div className='w-[33%] border-r border-b'>Telefone: {doacao.contato[0].Telefone}</div>
                    <div className='w-[33%] border-b'>Data Agendada: {new Date(doacao.DataAgendada).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}</div>
                  </div>
                  <div className='border-b pt-1'>
                    Endereço: {doacao.doador.Rua}, {doacao.doador.Numero}, {doacao.doador.Bairro}, {doacao.doador.Complemento}
                  </div>
                  <div className='border-b pt-1 flex'>
                    Itens:{doacao.itensComProduto.map((item, index) => {
                      return (
                        <div key={index}>
                          {index == 0 ? "" : ","}ㅤ{item.Quantidade} {item.UNItem} {item.UNItem != "" ? "de" : ""} {item.produto.Nome}
                        </div>
                      );
                    })}
                  </div>
                  <div className='pt-1 border-b'>
                    Observação: {doacao.Observacao}
                  </div>
                  <div className='pt-1 '>
                    Destino: {doacao.Destino}
                  </div>
                </div>
              </div>
            )) :
            <>
              <h1 className=' text-center mt-20'>Nenhuma doação adicionado à ficha. Caso coloque alguma doação na ficha, recarregue a pagina. </h1>
            </>
          }
        </>
      }
    </div>
  );
}