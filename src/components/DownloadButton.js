import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import DonationPDF from './PDFFicha'; // Importe o componente que gera o PDF
import { Button } from "@/components/ui/button"

const DownloadButton = ({ IdDoações }) => {
    const [donationData, setDonationData] = useState([])
    const [dados, setDados] = useState(null)

    useEffect(() => {
        setDados(IdDoações)
    }, [IdDoações]);

    useEffect(() => {
        const fetchLoadDoacoes = async () => {
            try {
                const response = await fetch(`api/ficha?arrayIdDoacao=${dados}`, {
                    method: 'GET'
                })
                const data = await response.json();
                console.log(data)
                setDonationData(data.listaCompleta)
            } catch (error) {
                console.error('Erro ao desativar doador:', error)
            }
        }

        fetchLoadDoacoes()
    }, [dados])

    const handleDownload = async () => {
        console.log(dados)
        // Gera o documento PDF
        const doc = <DonationPDF data={donationData} />;
        // Converte o documento em um blob
        const asBlob = await pdf(doc).toBlob();
        // Cria uma URL para o blob
        const url = URL.createObjectURL(asBlob);
        // Abre o PDF em uma nova aba
        window.open(url, '_blank');
    };

    return (
        <Button
            onClick={handleDownload}
            className="bg-green-400 hover:bg-green-500 mr-8 mt-6 w-full mb-3"
        >
            Imprimir Ficha de Retirada ({dados != null && dados.length} Doações)
        </Button>
    );
};

export default DownloadButton;
