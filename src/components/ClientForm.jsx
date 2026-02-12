import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import '../styles/ClientForm.css';

const Section = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="form-section">
            <div className="section-header" onClick={onToggle}>
                <span className="section-title">{title}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isOpen && <div className="section-content">{children}</div>}
        </div>
    );
};

const ClientForm = ({ onSave, initialData }) => {
    const [sections, setSections] = useState({
        cadastrais: true,
        fiscais: true,
        contato: true,
        mensagens: true,
    });

    const [tipoPessoa, setTipoPessoa] = useState('Pessoa Física');
    const [dataNascimento, setDataNascimento] = useState('');
    const [faixaEtaria, setFaixaEtaria] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        cpfCnpj: '',
        rgInscricao: '',
        apelido: '',
        comoConheceu: '',
        nomeAmigo: '',
        email: '',
        emailComercial: '',
        telefone: '',
        telefoneComercial: '',
        gestaoMensagens: [],
    });

    const [address, setAddress] = useState({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        codigoCidade: '',
        referencia: '',
    });

    const [errors, setErrors] = useState({});

    // Populate form if initialData is provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setTipoPessoa(initialData.tipo_pessoa || 'Pessoa Física');
            setDataNascimento(initialData.data_nascimento ? initialData.data_nascimento.split('T')[0] : '');

            // Calculate age/faixaEtaria if needed
            if (initialData.data_nascimento) {
                // Trigger logic or just set it
                calculateAge(initialData.data_nascimento.split('T')[0]);
            }

            setFormData({
                nome: initialData.nome || '',
                cpfCnpj: initialData.cpf_cnpj || '',
                rgInscricao: initialData.rg_inscricao || '',
                apelido: initialData.apelido || '',
                comoConheceu: initialData.como_conheceu || '',
                nomeAmigo: initialData.nome_amigo || '',
                email: initialData.email || '',
                emailComercial: initialData.email_comercial || '',
                telefone: initialData.telefone || '',
                telefoneComercial: initialData.telefone_comercial || '',
                // New bindings
                sexo: initialData.sexo || '-',
                relacaoFamiliar: initialData.relacao_familiar || '-',
                profissao: initialData.profissao || '',
                cnhVencimento: initialData.cnh_vencimento ? initialData.cnh_vencimento.split('T')[0] : '',
                clienteDesde: initialData.cliente_desde ? initialData.cliente_desde.split('T')[0] : '',
                statusAtivo: initialData.status_ativo ? 'Sim' : 'Não', // Assuming boolean or specific string
                emitirNF: initialData.emitir_nf === true ? 'Sim' : (initialData.emitir_nf === false ? 'Não' : '-'),
                issRetido: initialData.iss_retido === true ? 'Sim' : (initialData.iss_retido === false ? 'Não' : '-'),
                consumidorFinal: initialData.consumidor_final === true ? 'Sim' : (initialData.consumidor_final === false ? 'Não' : '-'),
                produtorRural: initialData.produtor_rural === true ? 'Sim' : (initialData.produtor_rural === false ? 'Não' : '-'),
                tipoContribuinte: initialData.tipo_contribuinte || '-',
                tipoCliente: initialData.tipo_cliente || '-',
                creditoLiberado: formatCurrency(initialData.credito_liberado),
                valorGasto: formatCurrency(initialData.valor_gasto),
                saldo: formatCurrency(initialData.saldo),
                valorConsumido: formatCurrency(initialData.valor_consumido),
                valorCustos: formatCurrency(initialData.valor_custos),
                lucratividade: formatCurrency(initialData.lucratividade),
                comissao: formatCurrency(initialData.comissao),
                dataPagamento: initialData.data_pagamento ? initialData.data_pagamento.split('T')[0] : '',
                pix: initialData.pix || '',
                restricao: initialData.restricao === true ? 'Sim' : (initialData.restricao === false ? 'Não' : '-'),
                observacao: initialData.observacao || '',
                gestaoMensagens: initialData.gestao_mensagens ? initialData.gestao_mensagens.split(', ') : [],
            });

            setAddress({
                cep: initialData.cep || '',
                logradouro: initialData.logradouro || '',
                numero: initialData.numero || '',
                complemento: initialData.complemento || '',
                bairro: initialData.bairro || '',
                cidade: initialData.cidade || '',
                estado: initialData.estado || '',
                codigoCidade: initialData.codigo_cidade || '',
                referencia: initialData.referencia || '',
            });

            // Expand first section or all?
            setSections({ cadastrais: true, fiscais: true, contato: true });
        } else {
            // Reset form if no initialData (New Mode)
            setTipoPessoa('Pessoa Física');
            setDataNascimento('');
            setFaixaEtaria('');
            setFormData({
                nome: '',
                cpfCnpj: '',
                rgInscricao: '',
                apelido: '',
                comoConheceu: '',
                nomeAmigo: '',
                email: '',
                emailComercial: '',
                telefone: '',
                telefoneComercial: '',
                sexo: '-',
                relacaoFamiliar: '-',
                profissao: '',
                cnhVencimento: '',
                clienteDesde: '',
                statusAtivo: 'Sim',
                emitirNF: '-',
                issRetido: '-',
                consumidorFinal: '-',
                produtorRural: '-',
                tipoContribuinte: '-',
                tipoCliente: '-',
                creditoLiberado: '',
                valorGasto: '',
                saldo: '',
                valorConsumido: '',
                valorCustos: '',
                lucratividade: '',
                comissao: '',
                dataPagamento: '',
                pix: '',
                restricao: '-',
                observacao: '',
                gestaoMensagens: [],
            });
            setAddress({
                cep: '',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                codigoCidade: '',
                referencia: '',
            });
        }
    }, [initialData]);

    const calculateAge = (date) => {
        if (!date) {
            setFaixaEtaria('');
            return;
        }
        const today = new Date();
        const birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 0) {
            setFaixaEtaria('Data Inválida');
        } else if (age < 12) {
            setFaixaEtaria(`Criança (${age} anos)`);
        } else if (age < 18) {
            setFaixaEtaria(`Adolescente (${age} anos)`);
        } else if (age < 60) {
            setFaixaEtaria(`Adulto (${age} anos)`);
        } else {
            setFaixaEtaria(`Idoso (${age} anos)`);
        }
    };

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatCNPJ = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const handleCpfCnpjChange = (e) => {
        let value = e.target.value;
        if (tipoPessoa === 'Pessoa Física') {
            value = formatCPF(value);
        } else {
            value = formatCNPJ(value);
        }

        setFormData(prev => ({ ...prev, cpfCnpj: value }));

        if (errors.cpfCnpj) {
            setErrors(prev => ({ ...prev, cpfCnpj: undefined }));
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    const handleSave = async () => {
        const newErrors = {};
        if (!formData.nome || !formData.nome.trim()) {
            newErrors.nome = 'Campo obrigatório';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        setLoading(true);
        setStatusMessage({ text: 'Salvando no banco de dados...', type: 'info' });

        const payload = {
            id: initialData ? initialData.id : undefined, // Include ID if editing
            ...formData,
            ...address,
            tipoPessoa,
            dataNascimento,
            faixaEtaria
            // Ensure all fields map back to what backend expects
        };

        try {
            // Determine if update (PUT) or create (POST)
            const method = initialData && initialData.id ? 'PUT' : 'POST';
            const response = await fetch('/api/save-client', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar no banco de dados');
            }

            const result = await response.json();
            setStatusMessage({ text: 'Cliente salvo com sucesso!', type: 'success' });

            if (onSave) {
                onSave({
                    id: result.id,
                    ...payload
                });
            }
        } catch (error) {
            console.error(error);
            setStatusMessage({ text: 'Falha ao salvar: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDataNascimentoChange = (e) => {
        const date = e.target.value;
        setDataNascimento(date);
        calculateAge(date);
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === '') return '';
        // If it's already a number (coming from DB), format it directly
        if (typeof value === 'number') {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
            }).format(value);
        }
        // If it's a string (user typing), remove non-digits and format
        const numericValue = value.replace(/\D/g, '');
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(numericValue / 100);
    };

    const handleCheckboxChange = (option) => {
        setFormData(prev => {
            const current = prev.gestaoMensagens || [];
            const updated = current.includes(option)
                ? current.filter(item => item !== option)
                : [...current, option];
            return { ...prev, gestaoMensagens: updated };
        });
    };

    const handleMoneyInput = (e) => {
        e.target.value = formatCurrency(e.target.value);
    };

    const formatCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const formatPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const formatLandline = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCEPInput = async (e) => {
        const value = formatCEP(e.target.value);
        setAddress(prev => ({ ...prev, cep: value }));

        const cleanCEP = value.replace(/\D/g, '');
        if (cleanCEP.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setAddress(prev => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                        codigoCidade: data.ibge,
                        cep: value
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const handlePhoneInput = (e) => {
        e.target.value = formatPhone(e.target.value);
    };

    const handleLandlineInput = (e) => {
        e.target.value = formatLandline(e.target.value);
    };

    const toggleSection = (key) => {
        setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="form-container">
            <div className="form-header">
                {statusMessage.text && (
                    <div className={`status-message ${statusMessage.type}`}>
                        {statusMessage.text}
                    </div>
                )}
                <button
                    className="btn-save"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? 'SALVANDO...' : 'SALVAR'} <Save size={18} />
                </button>
            </div>

            <div className="form-scroll-area">
                {/* Dados Cadastrais */}
                <Section
                    title="Dados Cadastrais"
                    isOpen={sections.cadastrais}
                    onToggle={() => toggleSection('cadastrais')}
                >
                    <div className="form-grid">
                        {/* Row 1: Identificação e Nomes */}
                        <div className="form-group col-span-2">
                            <label>Tipo de Pessoa</label>
                            <select
                                className="modern-input"
                                value={tipoPessoa}
                                onChange={(e) => setTipoPessoa(e.target.value)}
                                autoFocus
                            >
                                <option>-</option>
                                <option>Pessoa Física</option>
                                <option>Pessoa Jurídica</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>{tipoPessoa === 'Pessoa Física' ? 'CPF' : 'CNPJ'}</label>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder={tipoPessoa === 'Pessoa Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                                name="cpfCnpj"
                                value={formData.cpfCnpj}
                                onChange={handleCpfCnpjChange}
                                maxLength={tipoPessoa === 'Pessoa Física' ? 14 : 18}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>{tipoPessoa === 'Pessoa Física' ? 'RG' : 'Insc. Estadual'}</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="rgInscricao"
                                value={formData.rgInscricao}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-3">
                            <label>
                                {tipoPessoa === 'Pessoa Física' ? 'Nome Completo' : 'Razão Social'}
                                {errors.nome && <span style={{ color: '#ef4444', marginLeft: '5px' }}>(Obrigatório)</span>}
                            </label>
                            <input
                                type="text"
                                className={`modern-input ${errors.nome ? 'input-error' : ''}`}
                                name="nome"
                                value={formData.nome || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-3">
                            <label>{tipoPessoa === 'Pessoa Física' ? 'Apelido' : 'Nome Fantasia'}</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="apelido"
                                value={formData.apelido || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Row 2: Dados Pessoais */}
                        <div className="form-group col-span-2">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                className="modern-input"
                                value={dataNascimento}
                                onChange={handleDataNascimentoChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Faixa Etária</label>
                            <input
                                type="text"
                                className="modern-input"
                                value={faixaEtaria}
                                disabled
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Sexo</label>
                            <select
                                className="modern-input"
                                name="sexo"
                                value={formData.sexo || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Homem</option>
                                <option>Mulher</option>
                                <option>Outro</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Relação Familiar</label>
                            <select
                                className="modern-input"
                                name="relacaoFamiliar"
                                value={formData.relacaoFamiliar || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Pai / Mãe</option>
                            </select>
                        </div>

                        {/* Row 3: Profissional */}
                        <div className="form-group col-span-2">
                            <label>Profissão</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="profissao"
                                value={formData.profissao || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>CNH Vencimento</label>
                            <input
                                type="date"
                                className="modern-input"
                                name="cnhVencimento"
                                value={formData.cnhVencimento || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Cliente desde</label>
                            <input
                                type="date"
                                className="modern-input"
                                name="clienteDesde"
                                value={formData.clienteDesde || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Row 3: Metadata */}
                        <div className="form-group col-span-2">
                            <label>Como nos conheceu?</label>
                            <select
                                className="modern-input"
                                value={formData.comoConheceu || ''}
                                onChange={(e) => handleInputChange({ target: { name: 'comoConheceu', value: e.target.value } })}
                            >
                                <option value="">-</option>
                                <option>Internet</option>
                                <option>Google</option>
                                <option>Facebook</option>
                                <option>Instagram</option>
                                <option>Radio</option>
                                <option>Panfleto</option>
                                <option>WhatsApp</option>
                                <option>Amigo</option>
                            </select>
                        </div>
                        {formData.comoConheceu === 'Amigo' && (
                            <div className="form-group col-span-2">
                                <label>Indique o amigo</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    name="nomeAmigo"
                                    placeholder="Nome do amigo"
                                    value={formData.nomeAmigo || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                        <div className="form-group col-span-2">
                            <label>Status Ativo?</label>
                            <select
                                className="modern-input"
                                name="statusAtivo"
                                value={formData.statusAtivo || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Data de cadastro</label>
                            <input
                                type="date"
                                className="modern-input"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                disabled
                            />
                        </div>
                    </div>
                </Section>

                {/* Dados Fiscais / Financeiro */}
                <Section
                    title="Dados Fiscais / Financeiro"
                    isOpen={sections.fiscais}
                    onToggle={() => toggleSection('fiscais')}
                >
                    <div className="form-grid">
                        <div className="form-group col-span-2">
                            <label>Emitir Notas Fiscais?</label>
                            <select
                                className="modern-input"
                                name="emitirNF"
                                value={formData.emitirNF || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>ISS retido na fonte?</label>
                            <select
                                className="modern-input"
                                name="issRetido"
                                value={formData.issRetido || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Consumidor final?</label>
                            <select
                                className="modern-input"
                                name="consumidorFinal"
                                value={formData.consumidorFinal || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Produtor Rural?</label>
                            <select
                                className="modern-input"
                                name="produtorRural"
                                value={formData.produtorRural || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Tipo de Contribuinte</label>
                            <select
                                className="modern-input"
                                name="tipoContribuinte"
                                value={formData.tipoContribuinte || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Não Contribuinte</option>
                                <option>Contribuinte ICMS</option>
                                <option>Contribuinte Isento</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Tipo de Cliente</label>
                            <select
                                className="modern-input"
                                name="tipoCliente"
                                value={formData.tipoCliente || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Atacado</option>
                                <option>Varejo</option>
                                <option>Lojista</option>
                            </select>
                        </div>

                        <div className="form-group col-span-2">
                            <label>Crédito Liberado</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="creditoLiberado"
                                placeholder="R$ 0,00"
                                value={formData.creditoLiberado || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor gasto</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="valorGasto"
                                placeholder="R$ 0,00"
                                value={formData.valorGasto || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Saldo</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="saldo"
                                placeholder="R$ 0,00"
                                value={formData.saldo || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor Consumido</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="valorConsumido"
                                placeholder="R$ 0,00"
                                value={formData.valorConsumido || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor de Custos</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="valorCustos"
                                placeholder="R$ 0,00"
                                value={formData.valorCustos || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Lucratividade %</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="lucratividade"
                                placeholder="R$ 0,00"
                                value={formData.lucratividade || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Comissão % por indicação</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="comissao"
                                placeholder="R$ 0,00"
                                value={formData.comissao || ''}
                                onChange={(e) => { handleMoneyInput(e); handleGeneralChange(e); }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Data de pagamento</label>
                            <input
                                type="date"
                                className="modern-input"
                                name="dataPagamento"
                                value={formData.dataPagamento || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Pix</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="pix"
                                value={formData.pix || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Restrição?</label>
                            <select
                                className="modern-input"
                                name="restricao"
                                value={formData.restricao || ''}
                                onChange={handleInputChange}
                            >
                                <option>-</option>
                                <option>Não</option>
                                <option>Sim</option>
                            </select>
                        </div>
                    </div>
                </Section>

                {/* Dados de Contato e Endereço */}
                <Section
                    title="Dados de Contato e Endereço"
                    isOpen={sections.contato}
                    onToggle={() => toggleSection('contato')}
                >
                    <div className="form-grid">
                        <div className="form-group col-span-2">
                            <label>Contato Particular</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="telefone"
                                placeholder="(00) 00000-0000"
                                value={formData.telefone || ''}
                                onChange={(e) => {
                                    handlePhoneInput(e);
                                    handleGeneralChange(e);
                                }}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Contato Comercial</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="telefoneComercial"
                                placeholder="(00) 0000-0000"
                                value={formData.telefoneComercial || ''}
                                onChange={(e) => {
                                    handleLandlineInput(e);
                                    handleGeneralChange(e);
                                }}
                            />
                        </div>
                        <div className="form-group col-span-4">
                            <label>Email Particular</label>
                            <input
                                type="email"
                                className="modern-input"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleGeneralChange}
                            />
                        </div>
                        <div className="form-group col-span-4">
                            <label>Email Comercial</label>
                            <input
                                type="email"
                                className="modern-input"
                                name="emailComercial"
                                value={formData.emailComercial || ''}
                                onChange={handleGeneralChange}
                            />
                        </div>

                        <div className="form-group col-span-2">
                            <label>Cep</label>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="00000-000"
                                value={address.cep}
                                onChange={handleCEPInput}
                            />
                        </div>
                        <div className="form-group col-span-5">
                            <label>Endereço</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="logradouro"
                                value={address.logradouro}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Número</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="numero"
                                value={address.numero}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group col-span-3">
                            <label>Bairro</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="bairro"
                                value={address.bairro}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Complemento</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="complemento"
                                value={address.complemento}
                                onChange={handleAddressChange}
                            />
                        </div>

                        <div className="form-group col-span-2">
                            <label>Estado</label>
                            <select
                                className="modern-input"
                                name="estado"
                                value={address.estado}
                                onChange={handleAddressChange}
                            >
                                <option value="">-</option>
                                <option value="AC">Acre - AC</option>
                                <option value="AL">Alagoas - AL</option>
                                <option value="AP">Amapá - AP</option>
                                <option value="AM">Amazonas - AM</option>
                                <option value="BA">Bahia - BA</option>
                                <option value="CE">Ceará - CE</option>
                                <option value="DF">Distrito Federal - DF</option>
                                <option value="ES">Espírito Santo - ES</option>
                                <option value="GO">Goiás - GO</option>
                                <option value="MA">Maranhão - MA</option>
                                <option value="MT">Mato Grosso - MT</option>
                                <option value="MS">Mato Grosso do Sul - MS</option>
                                <option value="MG">Minas Gerais - MG</option>
                                <option value="PA">Pará - PA</option>
                                <option value="PB">Paraíba - PB</option>
                                <option value="PR">Paraná - PR</option>
                                <option value="PE">Pernambuco - PE</option>
                                <option value="PI">Piauí - PI</option>
                                <option value="RJ">Rio de Janeiro - RJ</option>
                                <option value="RN">Rio Grande do Norte - RN</option>
                                <option value="RS">Rio Grande do Sul - RS</option>
                                <option value="RO">Rondônia - RO</option>
                                <option value="RR">Roraima - RR</option>
                                <option value="SC">Santa Catarina - SC</option>
                                <option value="SP">São Paulo - SP</option>
                                <option value="SE">Sergipe - SE</option>
                                <option value="TO">Tocantins - TO</option>
                            </select>
                        </div>
                        <div className="form-group col-span-3">
                            <label>Cidade</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="cidade"
                                value={address.cidade}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Código Cidade</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="codigoCidade"
                                value={address.codigoCidade}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group col-span-3">
                            <label>Referência</label>
                            <input
                                type="text"
                                className="modern-input"
                                name="referencia"
                                value={address.referencia}
                                onChange={handleAddressChange}
                            />
                        </div>

                        <div className="form-group col-span-12">
                            <label>Observação</label>
                            <textarea
                                className="modern-textarea"
                                rows="2"
                                name="observacao"
                                value={formData.observacao || ''}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>
                </Section>

                {/* Gestão de Mensagens */}
                <Section
                    title="Gestão de Mensagens"
                    isOpen={sections.mensagens}
                    onToggle={() => toggleSection('mensagens')}
                >
                    <div className="checkbox-grid">
                        {[
                            'Aniversário',
                            'Coleta de Data de Aniversário',
                            'Pós Venda',
                            'Atualizar KM',
                            'Lembrete de Cobrança',
                            'Retirada de Veículo'
                        ].map((option) => (
                            <label key={option} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={formData.gestaoMensagens?.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </Section>

                <div className="form-footer">
                    <button className="btn-save" onClick={handleSave}>
                        SALVAR <Save size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ClientForm;
