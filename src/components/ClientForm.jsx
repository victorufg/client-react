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
        telefoneComercial: ''
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
                // Add missing fields mapping as necessary
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
                telefoneComercial: ''
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
            const response = await fetch('/api/save-client', {
                method: 'POST',
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
        const numericValue = value.replace(/\D/g, '');
        const amount = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(numericValue / 100);
        return amount;
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
                                onChange={handleInputChange}
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
                            <select className="modern-input">
                                <option>Homem</option>
                                <option>Mulher</option>
                                <option>Outro</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Relação Familiar</label>
                            <select className="modern-input">
                                <option>Pai / Mãe</option>
                            </select>
                        </div>

                        {/* Row 3: Profissional */}
                        <div className="form-group col-span-2">
                            <label>Profissão</label>
                            <input type="text" className="modern-input" />
                        </div>
                        <div className="form-group col-span-2">
                            <label>CNH Vencimento</label>
                            <input type="date" className="modern-input" />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Cliente desde</label>
                            <input type="date" className="modern-input" />
                        </div>

                        {/* Row 3: Metadata */}
                        <div className="form-group col-span-2">
                            <label>Como nos conheceu?</label>
                            <select
                                className="modern-input"
                                value={formData.comoConheceu || ''}
                                onChange={(e) => handleInputChange({ target: { name: 'comoConheceu', value: e.target.value } })}
                            >
                                <option value="">Selecione...</option>
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
                            <select className="modern-input"><option>Sim</option><option>Não</option></select>
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
                            <select className="modern-input"><option>Sim</option><option>Não</option></select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>ISS retido na fonte?</label>
                            <select className="modern-input"><option>Sim</option><option>Não</option></select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Consumidor final?</label>
                            <select className="modern-input"><option>Sim</option><option>Não</option></select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Produtor Rural?</label>
                            <select className="modern-input"><option>Sim</option><option>Não</option></select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Tipo de Contribuinte</label>
                            <select className="modern-input">
                                <option>Não Contribuinte</option>
                                <option>Contribuinte ICMS</option>
                                <option>Contribuinte Isento</option>
                            </select>
                        </div>
                        <div className="form-group col-span-2">
                            <label>Tipo de Cliente</label>
                            <select className="modern-input">
                                <option>Atacado</option>
                                <option>Varejo</option>
                                <option>Lojista</option>
                            </select>
                        </div>

                        <div className="form-group col-span-2">
                            <label>Crédito Liberado</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor gasto</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Saldo</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor Consumido</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Valor de Custos</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Lucratividade %</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Comissão % por indicação</label>
                            <input type="text" className="modern-input" placeholder="R$ 0,00" onChange={handleMoneyInput} />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Data de pagamento</label>
                            <input type="date" className="modern-input" />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Pix</label>
                            <input type="text" className="modern-input" />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Restrição?</label>
                            <select className="modern-input">
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
                                <option value="">Selecione</option>
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
                            <textarea className="modern-textarea" rows="2"></textarea>
                        </div>
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
