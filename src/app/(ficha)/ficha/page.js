"use client"

import { useEffect, useState } from 'react';

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
            doacoes.map((doacao) => (
              <div key={doacao.IdDoacao} className='ml-10 mr-10 text-sm mt-4'>
                <div className='border'>
                  <div className='flex'>
                    <div className='w-[33%] border-r border-b'>Nome: {doacao.contato[0].Contato}</div>
                    <div className='w-[33%] border-r border-b'>Telefone: {doacao.contato[0].Telefone}</div>
                    <div className='w-[33%] border-b'>Data Agendada: {new Date(doacao.DataAgendada).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}</div>
                  </div>
                  <div className='border-b pt-1'>
                    Endereço: {doacao.doador.Rua}, {doacao.doador.Numero}, {doacao.doador.Bairro}
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