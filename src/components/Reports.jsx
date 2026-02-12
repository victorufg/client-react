import React, { useState } from 'react';
import '../styles/Reports.css';

const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

const getAvatarColor = (name) => {
    if (!name) return '#ccc';
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#e879f9'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const Reports = ({ clients }) => {
    const [activeReport, setActiveReport] = useState('aniversariante');

    const reportTypes = [
        { id: 'aniversariante', label: 'Aniversariante' },
        { id: 'lucratividade', label: 'Lucratividade' },
        { id: 'conheceu', label: 'Como nos Conheceu?' },
        { id: 'nps', label: 'NPS/Pós venda' },
        { id: 'status', label: 'Status dos Clientes' },
        { id: 'indicacao', label: 'Indicação por amigo' },
    ];

    const getReportColumns = () => {
        const baseColumns = ['cliente', 'contatos', 'email'];
        switch (activeReport) {
            case 'aniversariante':
                return [...baseColumns, 'idade', 'faixaEtaria', 'aniversario', 'sexo', 'relacaoFamiliar'];
            case 'lucratividade':
                return [...baseColumns, 'faixaEtaria', 'sexo', 'relacaoFamiliar', 'totalGasto', 'totalLucro', 'lucroPorc', 'dataPrimeiraOS', 'dataUltimaVenda', 'mediaFrequencia', 'qtVezes'];
            case 'conheceu':
                return [...baseColumns, 'idade', 'faixaEtaria', 'sexo', 'relacaoFamiliar', 'comoConheceu', 'cidadeUf', 'dataCadastro'];
            case 'nps':
                return [...baseColumns, 'idade', 'faixaEtaria', 'sexo', 'notaNps'];
            case 'status':
                return [...baseColumns, 'idade', 'faixaEtaria', 'sexo', 'status'];
            case 'indicacao':
                return [...baseColumns, 'idade', 'faixaEtaria', 'sexo', 'indicadoPor'];
            default:
                return baseColumns;
        }
    };

    const columns = getReportColumns();

    const renderHeaderLabel = (col) => {
        const labels = {
            cliente: 'Clientes',
            contatos: 'Contato',
            email: 'E-mail',
            idade: 'Idade',
            faixaEtaria: 'Faixa Etaria',
            aniversario: 'Data Nascimento', // Consistent with image request "Data Nascimento" usually maps to birthday display here
            sexo: 'Sexo',
            relacaoFamiliar: 'Relação Família',
            totalGasto: 'Total Gasto',
            totalLucro: 'Total Lucro',
            lucroPorc: 'Lucro%',
            dataPrimeiraOS: 'Data 1ª O.S',
            dataUltimaVenda: 'Ult. Venda',
            mediaFrequencia: 'Média Freq.',
            qtVezes: 'Qt. Vezes',
            comoConheceu: 'Como conheceu?',
            cidadeUf: 'Cidade/UF',
            dataCadastro: 'Cadastro',
            notaNps: 'Nota NPS',
            status: 'Status',
            indicadoPor: 'Indicado por?'
        };
        return labels[col] || col;
    };

    const renderCell = (row, col) => {
        if (col === 'cliente') {
            return (
                <div className="client-cell">
                    <div className="avatar" style={{ backgroundColor: getAvatarColor(row.cliente) }}>
                        {getInitials(row.cliente)}
                    </div>
                    <span>{row.cliente}</span>
                </div>
            );
        }

        // Mock data for fields not in the main form
        const mocks = {
            idade: row.idade || '30',
            totalGasto: 'R$ 1.500,00',
            totalLucro: 'R$ 450,00',
            lucroPorc: '30%',
            dataPrimeiraOS: '10/01/2026',
            dataUltimaVenda: '05/02/2026',
            mediaFrequencia: '15 dias',
            qtVezes: '4',
            notaNps: '9',
            cidadeUf: `${row.cidade || 'SP'}/${row.estado || 'SP'}`,
            indicadoPor: row.nomeAmigo || 'Direto'
        };

        return <span className="report-text">{row[col] || mocks[col] || '-'}</span>;
    };

    return (
        <div className="reports-container">
            <div className="reports-menu">
                {reportTypes.map((type) => {
                    const isAniversariante = type.id === 'aniversariante';
                    const isActive = activeReport === type.id;
                    const primaryColor = isAniversariante ? '#3b82f6' : '#3b82f6';

                    return (
                        <button
                            key={type.id}
                            className={`report-menu-btn ${type.id} ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveReport(type.id)}
                            style={{
                                borderColor: primaryColor,
                                color: isActive ? 'white' : primaryColor,
                                backgroundColor: isActive ? primaryColor : 'white'
                            }}
                        >
                            {type.label}
                        </button>
                    );
                })}
            </div>

            <div className="report-content">
                <div className="report-table-wrapper">
                    <table className="report-table">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col}>{renderHeaderLabel(col)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((row, idx) => (
                                <tr key={row.id || idx}>
                                    {columns.map(col => (
                                        <td key={col}>{renderCell(row, col)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
