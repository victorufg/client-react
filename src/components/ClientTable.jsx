import React from 'react';
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import '../styles/ClientTable.css';
import Filters from './Filters';

const getInitials = (name) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

const getAvatarColor = (name) => {
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#e879f9'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const ClientTable = ({ clients }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [visibleColumns, setVisibleColumns] = React.useState([
        'id', 'tipo', 'cliente', 'endereco', 'email', 'contatos', 'dataCadastro', 'aniversario', 'cpfCnpj', 'sexo'
    ]);

    const [advancedFilters, setAdvancedFilters] = React.useState({
        cidade: '',
        estado: '',
        tipo: '',
        sexo: '',
        profissao: '',
        dataCadastro: '',
        status: ''
    });

    const availableColumns = [
        { key: 'id', label: 'ID' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'cliente', label: 'Cliente' },
        { key: 'apelido', label: 'Apelido/Nome Fantasia' },
        { key: 'endereco', label: 'Endereço' },
        { key: 'cidade', label: 'Cidade' },
        { key: 'estado', label: 'Estado' },
        { key: 'email', label: 'Email' },
        { key: 'contatos', label: 'Contatos' },
        { key: 'dataCadastro', label: 'Cadastro' },
        { key: 'aniversario', label: 'Aniversário' },
        { key: 'cpfCnpj', label: 'CPF/CNPJ' },
        { key: 'sexo', label: 'Sexo' },
        { key: 'profissao', label: 'Profissão' },
        { key: 'faixaEtaria', label: 'Faixa Etária' },
        { key: 'relacaoFamiliar', label: 'Relação Familiar' },
        { key: 'restricao', label: 'Restrição' },
        { key: 'status', label: 'Status' },
    ];

    const filteredRows = (clients || []).filter(row => {
        // Global Search
        const matchesSearch = Object.values(row).some(value => {
            if (value === null || value === undefined) return false;
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Advanced Filters (including Status)
        const matchesAdvanced = Object.entries(advancedFilters).every(([key, value]) => {
            if (!value) return true; // Skip empty filters
            const rowValue = row[key];
            if (rowValue === null || rowValue === undefined) return false;
            return rowValue.toString().toLowerCase().includes(value.toLowerCase());
        });

        return matchesSearch && matchesAdvanced;
    });

    const toggleColumn = (key) => {
        setVisibleColumns(prev =>
            prev.includes(key)
                ? prev.filter(c => c !== key)
                : [...prev, key]
        );
    };

    const [openMenuId, setOpenMenuId] = React.useState(null);

    React.useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const isVisible = (key) => visibleColumns.includes(key);

    return (
        <div className="table-wrapper">
            <Filters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                availableColumns={availableColumns}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                advancedFilters={advancedFilters}
                onAdvancedFilterChange={setAdvancedFilters}
            />
            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th className="th-action">Ações</th>
                            {isVisible('id') && <th className="th-id">ID</th>}
                            {isVisible('tipo') && <th>Tipo</th>}
                            {isVisible('cliente') && <th>
                                <div className="th-content">
                                    Cliente <ArrowUpDown size={14} className="sort-icon" />
                                </div>
                            </th>}
                            {isVisible('apelido') && <th>Apelido</th>}
                            {isVisible('endereco') && <th>Endereço</th>}
                            {isVisible('cidade') && <th>Cidade</th>}
                            {isVisible('estado') && <th>Estado</th>}
                            {isVisible('email') && <th>Email</th>}
                            {isVisible('contatos') && <th>Contatos</th>}
                            {isVisible('dataCadastro') && <th>Cadastro</th>}
                            {isVisible('aniversario') && <th>Aniversário</th>}
                            {isVisible('cpfCnpj') && <th>CPF/CNPJ</th>}
                            {isVisible('sexo') && <th>Sexo</th>}
                            {isVisible('profissao') && <th>Profissão</th>}
                            {isVisible('faixaEtaria') && <th>Faixa Etária</th>}
                            {isVisible('relacaoFamiliar') && <th>Relação</th>}
                            {isVisible('restricao') && <th>Restrição</th>}
                            {isVisible('status') && <th>Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row, index) => {
                            const isLastRows = index >= filteredRows.length - 2 && filteredRows.length > 3;

                            return (
                                <tr key={row.id} className="table-row">
                                    <td className="td-action">
                                        <div className="action-container">
                                            <button
                                                className={`action-btn ${openMenuId === row.id ? 'active' : ''}`}
                                                onClick={(e) => toggleMenu(e, row.id)}
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {openMenuId === row.id && (
                                                <div className={`action-menu ${isLastRows ? 'open-up' : ''}`}>
                                                    <button className="menu-item" onClick={() => console.log('Editar', row.id)}>
                                                        <Edit size={14} /> Editar
                                                    </button>
                                                    <button className="menu-item delete" onClick={() => console.log('Excluir', row.id)}>
                                                        <Trash2 size={14} /> Excluir
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {isVisible('id') && <td className="td-id">#{row.id}</td>}
                                    {isVisible('tipo') && <td><span className="badge-tipo">{row.tipo}</span></td>}
                                    {isVisible('cliente') && <td>
                                        <div className="client-cell">
                                            <div
                                                className="avatar"
                                                style={{ backgroundColor: getAvatarColor(row.cliente) }}
                                            >
                                                {getInitials(row.cliente)}
                                            </div>
                                            <span className="client-name">{row.cliente}</span>
                                        </div>
                                    </td>}
                                    {isVisible('apelido') && <td className="text-muted">{row.apelido}</td>}
                                    {isVisible('endereco') && <td className="text-muted">{row.endereco}</td>}
                                    {isVisible('cidade') && <td className="text-muted">{row.cidade}</td>}
                                    {isVisible('estado') && <td className="text-muted">{row.estado}</td>}
                                    {isVisible('email') && <td className="text-muted">{row.email}</td>}
                                    {isVisible('contatos') && <td className="text-muted">{row.contatos}</td>}
                                    {isVisible('dataCadastro') && <td>{row.dataCadastro}</td>}
                                    {isVisible('aniversario') && <td>{row.aniversario}</td>}
                                    {isVisible('cpfCnpj') && <td className="font-mono">{row.cpfCnpj}</td>}
                                    {isVisible('sexo') && <td><span className={`sexo-badge ${(row.sexo || '').toLowerCase()}`}>{row.sexo || '-'}</span></td>}
                                    {isVisible('profissao') && <td className="text-muted">{row.profissao}</td>}
                                    {isVisible('faixaEtaria') && <td className="text-muted">{row.faixaEtaria}</td>}
                                    {isVisible('relacaoFamiliar') && <td className="text-muted">{row.relacaoFamiliar}</td>}
                                    {isVisible('restricao') && <td>{row.restricao}</td>}
                                    {isVisible('status') && <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            backgroundColor: row.status === 'Ativo' ? '#dcfce7' : '#f3f4f6',
                                            color: row.status === 'Ativo' ? '#166534' : '#374151'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientTable;
