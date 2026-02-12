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
                    <div className="filter-field" style={{ flex: 1 }}>
                        <label className="field-label">Busca Global</label>
                        <input
                            type="text"
                            className="modern-input"
                            placeholder="Buscar em todas as colunas..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="filter-field" style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
                        <button
                            className={`btn-outline ${showAdvanced ? 'active' : ''}`}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            title="Busca Avançada"
                            style={{ height: '45px', display: 'flex', alignItems: 'center' }}
                        >
                            {showAdvanced ? <X size={18} /> : <Filter size={18} />}
                        </button>
                    </div>
                </div>

                {showAdvanced && (
                    <div className="advanced-filters">
                        <div className="filter-row">
                            <div className="filter-field">
                                <label className="field-label">Nome/Empresa</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Nome ou Razão"
                                    value={advancedFilters.cliente}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, cliente: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">CPF/CNPJ</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="000.000.000-00"
                                    value={advancedFilters.cpfCnpj}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, cpfCnpj: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Apelido/Nome Fantasia</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Apelido"
                                    value={advancedFilters.apelido}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, apelido: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Sexo</label>
                                <select
                                    className="modern-select"
                                    value={advancedFilters.sexo}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, sexo: e.target.value })}
                                >
                                    <option value="">-</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Data de Cadastro</label>
                                <input
                                    type="date"
                                    className="modern-input"
                                    value={advancedFilters.dataCadastro}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, dataCadastro: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Contatos</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="(00) 00000-0000"
                                    value={advancedFilters.contatos}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, contatos: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Restrição</label>
                                <select
                                    className="modern-select"
                                    value={advancedFilters.restricao}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, restricao: e.target.value })}
                                >
                                    <option value="">-</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Cidade</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Cidade"
                                    value={advancedFilters.cidade}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, cidade: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Estado</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="UF"
                                    value={advancedFilters.estado}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, estado: e.target.value })}
                                    maxLength={2}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Profissão</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Profissão"
                                    value={advancedFilters.profissao}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, profissao: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Faixa Etária</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Ex: 20-30"
                                    value={advancedFilters.faixaEtaria}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, faixaEtaria: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Relação Familiar</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Relação"
                                    value={advancedFilters.relacaoFamiliar}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, relacaoFamiliar: e.target.value })}
                                />
                            </div>
                            <div className="filter-field">
                                <label className="field-label">Status</label>
                                <select
                                    className="modern-select"
                                    value={advancedFilters.status}
                                    onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, status: e.target.value })}
                                >
                                    <option value="">-</option>
                                    <option value="Ativo">Ativos</option>
                                    <option value="Inativo">Inativos</option>
                                </select>
                            </div>
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
