import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontSize: 9,
        fontFamily: "Helvetica",
        backgroundColor: '#f5f5f5',
        position: 'relative'
    },
    logoSpace: {
        position: 'absolute',
        top: 0,
        marginLeft: 5,
        width: 84,
        height: 50,
        zIndex: 1
    },
    header: {
        textAlign: "center",
        marginBottom: 10,
        paddingTop: 50,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: "black",
        marginBottom: 4,
        color: '#2c3e50',
        lineHeight: 1.2
    },
    headerText: {
        fontSize: 8,
        marginBottom: 2,
        color: '#666',
        lineHeight: 1.2
    },
    section: {
        marginBottom: 6,
        padding: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: 'white'
    },
    sectionDadosDoador: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: '#34495e',
        textTransform: 'uppercase'
    },
    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        gap: 10
    },
    table: {
        width: "100%",
        marginTop: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white'
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        minHeight: 18
    },
    tableHeader: {
        backgroundColor: '#ecf0f1',
        fontWeight: 'bold'
    },
    tableCell: {
        flex: 1,
        padding: 3,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        textAlign: "center",
        color: '#2c3e50'
    },
    separator: {
        borderTopWidth: 1,
        borderTopColor: '#999',
        borderStyle: 'dashed',
        marginVertical: 10,
        position: 'relative'
    },
    copyLabel: {
        marginTop: 15,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        fontSize: 7,
        color: '#666',
        paddingHorizontal: 4
    },
    corteText: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        fontSize: 7,
        color: '#666',
        paddingHorizontal: 4
    },
    observation: {
        marginTop: 8,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        fontStyle: 'italic',
        color: '#666'
    },
    label: {
        fontWeight: "bold",
        color: '#2c3e50'
    }
});

const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 ?
        `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}` :
        cleaned.substring(0, 4) + '-' + cleaned.substring(4);
};

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const DonationSection = ({ donation, isCopy }) => (
    <View>
        {/* Logo apenas na via do Doador */}
        {!isCopy && (
            <View style={styles.logoSpace}>
                <Image
                    src="Logo.png"
                    style={{ width: '100%', height: '100%' }}
                    alt="Logo"
                />
            </View>
        )}

        {/* Cabeçalho Institucional Completo */}
        {!isCopy && (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    INSTITUTO BENEFICENTE E SOCIAL EU NÃO SABIA QUE MEU AMOR PODIA TANTO
                </Text>
                <Text style={styles.headerText}>CNPJ: 28 417 972 0001/03 | Sede: Rua Heloisa Penteado, 317 Vila Esperança - SP</Text>
                <Text style={styles.headerText}>Telefone: 11 2791-3224 / 11 98998-8133 | E-mail: contato@oamorpodetanto.org.br</Text>
                <Text style={styles.headerText}>Conheça tudo sobre nosso trabalho através do @oamorpodetanto</Text>
            </View>
        )}

        {/* Seção de Datas */}
        <View style={[styles.section, isCopy && { padding: 4 }]}>
            <Text style={styles.title}>COMPROVANTE DE RETIRADA</Text>
            <View style={styles.dateRow}>
                <Text>Registrada: {formatDate(donation.DataDoacao)}</Text>
                {isCopy && <Text>Gerada: {formatDate(new Date())}</Text>}
                <Text>Agendada: {formatDate(donation.DataAgendada)}</Text>
            </View>
        </View>

        <View style={[styles.section, styles.sectionDadosDoador, { marginTop: 8 }]}>
            <View>
                <Text style={styles.label}>DOADOR: {donation.doador.Nome}</Text>
            <Text>Endereço: {donation.doador.Rua}, {donation.doador.Numero}{donation.doador.Complemento!=null??","} {donation.doador.Complemento} - {donation.doador.Bairro}</Text>
                <Text>Contato: {donation.contato.map(c => formatPhone(c.Telefone)).join(' | ')}</Text>
            </View>
            {isCopy && (
                <Text style={[styles.label, {textAlign: 'right'}]}>IDENTIFICADOR: {donation.IdDoacao}</Text>
            )}
        </View>

        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>#</Text>
                <Text style={styles.tableCell}>Produto</Text>
                <Text style={styles.tableCell}>Quantidade</Text>
                <Text style={styles.tableCell}>Unidade</Text>
            </View>

            {Array.from({ length: 8 }).map((_, i) => {
                const item = donation.itensComProduto[i] || {};
                const isMoney = item.produto?.Nome === "Valor em Dinheiro";
                const value = isMoney ?
                    (item.Quantidade / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) :
                    item.Quantidade;

                return (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{i + 1}</Text>
                        <Text style={[styles.tableCell, { textAlign: 'left' }]}>{item.produto?.Nome || ''}</Text>
                        <Text style={styles.tableCell}>{value || ''}</Text>
                        <Text style={styles.tableCell}>{item.produto?.UN || ''}</Text>
                    </View>
                );
            })}
        </View>

        {/* Observações */}
        <View style={styles.observation}>
            <Text>Observações: {donation.Observacao || '_________________________________________'}</Text>
        </View>

        {/* Etiqueta de Via */}
        <Text style={styles.copyLabel}>
            {isCopy ? "VIA INSTITUIÇÃO" : "VIA DOADOR"}
        </Text>
    </View>
);

const DonationPDF = ({ data }) => (
    <Document>
        {data.map((donation, index) => (
            <Page key={index} style={styles.page} size="A4">
                <DonationSection donation={donation} isCopy={false} />

                <View style={styles.separator}>
                    <Text style={styles.corteText}>CORTE AQUI | DOCUMENTO VÁLIDO APENAS COM AMBAS AS VIAS</Text>
                </View>

                <DonationSection donation={donation} isCopy={true} />
            </Page>
        ))}
    </Document>
);

export default DonationPDF;