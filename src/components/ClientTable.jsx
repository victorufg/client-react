import React from 'react';
import ReactDOM from 'react-dom';
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import '../styles/ClientTable.css';
import Filters from './Filters';
import Pagination from './Pagination';

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

const ClientTable = ({ clients, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(100);

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

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, advancedFilters]);

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

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    const toggleColumn = (key) => {
        setVisibleColumns(prev =>
            prev.includes(key)
                ? prev.filter(c => c !== key)
                : [...prev, key]
        );
    };

    const [openMenuId, setOpenMenuId] = React.useState(null);
    const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Do nothing here, rely on global click listener below
            }
        };

        const closeMenu = () => setOpenMenuId(null);
        if (openMenuId) {
            window.addEventListener('click', closeMenu);
        }
        return () => window.removeEventListener('click', closeMenu);
    }, [openMenuId]);

    // Handle scroll to update position or close
    React.useEffect(() => {
        const handleScroll = () => {
            if (openMenuId) setOpenMenuId(null);
        };
        if (openMenuId) {
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [openMenuId]);

    const toggleMenu = (e, id) => {
        e.stopPropagation(); // Stop click from bubbling to document (which closes menu)
        e.nativeEvent.stopImmediatePropagation();

        if (openMenuId === id) {
            setOpenMenuId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            // Check if there is space below, otherwise open up
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 150; // approximate menu height

            setMenuPosition({
                top: openUp ? (rect.top + window.scrollY - 5) : (rect.bottom + window.scrollY + 5),
                // Align left side of menu with left side of button (Standard Dropdown)
                left: rect.left + window.scrollX,
                transformOrigin: openUp ? 'bottom left' : 'top left',
                // Only transform Y for up direction, no X transform (so it stays left aligned)
                transform: openUp ? 'translateY(-100%)' : 'none',
                isUp: openUp
            });
            setOpenMenuId(id);
        }
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
                            {isVisible('relacaoFamiliar') && <th>Relação Familiar</th>}
                            {isVisible('restricao') && <th>Restrição</th>}
                            {isVisible('status') && <th>Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row) => (
                            <tr key={row.id} className="table-row">
                                <td className="td-action">
                                    <div className="action-container">
                                        <button
                                            className={`action-btn ${openMenuId === row.id ? 'active' : ''}`}
                                            onClick={(e) => toggleMenu(e, row.id)}
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
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
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredRows.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => {
                    setItemsPerPage(val);
                    setCurrentPage(1);
                }}
            />

            {openMenuId && typeof document !== 'undefined' && ReactDOM.createPortal(
                <div
                    style={{
                        position: 'absolute',
                        top: Math.round(menuPosition.top),
                        left: Math.round(menuPosition.left),
                        zIndex: 9999,
                        // We use the wrapper to handle the Up direction shift.
                        // The inner element handles the animation within this frame.
                        transform: menuPosition.transform,
                        transformOrigin: menuPosition.transformOrigin
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className={`action-menu ${menuPosition.isUp ? 'open-up' : ''}`}
                        style={{
                            // Override absolute positioning from CSS class to let the wrapper control position
                            position: 'static',
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            // Ensure no transform on inner element interferes with outer wrapper
                        }}
                    >
                        <button className="menu-item" onClick={() => {
                            if (onEdit) {
                                // Find the actual client row object using openMenuId (which is the ID)
                                const clientToEdit = clients.find(c => c.id === openMenuId);
                                if (clientToEdit) onEdit(clientToEdit); // Pass the whole mapped client object
                            }
                            setOpenMenuId(null);
                        }}>
                            <Edit size={14} /> Editar
                        </button>
                        <button className="menu-item delete" onClick={() => {
                            if (onDelete) {
                                const clientToDelete = clients.find(c => c.id === openMenuId);
                                if (clientToDelete) onDelete(clientToDelete);
                            }
                            setOpenMenuId(null);
                        }}>
                            <Trash2 size={14} /> Excluir
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ClientTable;
