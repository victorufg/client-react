import React from 'react';
import { ChevronDown, FileText, FileSpreadsheet, File, Printer, Download, Columns3, Filter, X } from 'lucide-react';
import '../styles/Filters.css';

const Filters = ({
    searchTerm,
    onSearchChange,
    availableColumns,
    visibleColumns,
    onToggleColumn,
    advancedFilters,
    onAdvancedFilterChange
}) => {
    const [showColumnMenu, setShowColumnMenu] = React.useState(false);
    const [showExportMenu, setShowExportMenu] = React.useState(false);
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const columnMenuRef = React.useRef(null);
    const exportMenuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
                setShowColumnMenu(false);
            }
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="card filters-card">
            <div className="filter-group" style={{ flex: 1 }}>
                <div className="filter-row">
                    <input
                        type="text"
                        className="modern-input"
                        placeholder="Buscar em todas as colunas..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <button
                        className={`btn-outline ${showAdvanced ? 'active' : ''}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        title="Busca Avançada"
                    >
                        {showAdvanced ? <X size={18} /> : <Filter size={18} />}
                    </button>
                </div>

                {showAdvanced && (
                    <div className="advanced-filters">
                        <div className="filter-row">
                            <select
                                className="modern-select"
                                value={advancedFilters.status}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, status: e.target.value })}
                            >
                                <option value="">-</option>
                                <option value="Ativo">Ativos</option>
                                <option value="Inativo">Inativos</option>
                            </select>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="Cidade"
                                value={advancedFilters.cidade}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, cidade: e.target.value })}
                            />
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="Estado (UF)"
                                value={advancedFilters.estado}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, estado: e.target.value })}
                                maxLength={2}
                            />
                            <select
                                className="modern-select"
                                value={advancedFilters.tipo}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, tipo: e.target.value })}
                            >
                                <option value="">-</option>
                                <option value="Físico">Físico</option>
                                <option value="Jurídico">Jurídico</option>
                            </select>
                            <select
                                className="modern-select"
                                value={advancedFilters.sexo}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, sexo: e.target.value })}
                            >
                                <option value="">-</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="Profissão"
                                value={advancedFilters.profissao}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, profissao: e.target.value })}
                            />
                            <input
                                type="date"
                                className="modern-input"
                                title="Data de Cadastro"
                                value={advancedFilters.dataCadastro}
                                onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, dataCadastro: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-actions">
                <div className="export-actions">
                    <div className="dropdown-container" ref={columnMenuRef}>
                        <button
                            className="btn-outline"
                            onClick={() => setShowColumnMenu(!showColumnMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Columns3 size={16} /> Colunas <ChevronDown size={14} />
                        </button>
                        {showColumnMenu && (
                            <div className="dropdown-menu">
                                {availableColumns.map(col => (
                                    <label key={col.key} className="dropdown-item">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.includes(col.key)}
                                            onChange={() => onToggleColumn(col.key)}
                                        />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-container" ref={exportMenuRef}>
                        <button
                            className="btn-outline"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Download size={16} /> Exportar <ChevronDown size={14} />
                        </button>
                        {showExportMenu && (
                            <div className="dropdown-menu" style={{ width: '150px' }}>
                                <div className="dropdown-item" onClick={() => console.log('Export CSV')}>
                                    <FileText size={16} />
                                    <span>CSV</span>
                                </div>
                                <div className="dropdown-item" onClick={() => console.log('Export Excel')}>
                                    <FileSpreadsheet size={16} />
                                    <span>Excel</span>
                                </div>
                                <div className="dropdown-item" onClick={() => console.log('Export PDF')}>
                                    <File size={16} />
                                    <span>PDF</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Printer size={16} /> Imprimir
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Filters;
