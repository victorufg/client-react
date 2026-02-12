import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientTable from './components/ClientTable';
import ClientForm from './components/ClientForm';
import Reports from './components/Reports';
import Pagination from './components/Pagination';
import './App.css'; // We'll create this for specific App-level layout if needed

function App() {
  const [activeTab, setActiveTab] = useState('clientes');

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-clients');
      if (!response.ok) throw new Error('Falha ao carregar clientes');
      const data = await response.json();

      // Mapeia os dados do banco para o formato esperado pelos componentes
      const mappedClients = data.map(c => ({
        id: c.id,
        tipo: c.tipo_pessoa || 'Físico',
        cliente: c.nome,
        apelido: c.apelido || '',
        endereco: c.logradouro ? `${c.logradouro}${c.numero ? ', ' + c.numero : ''}${c.bairro ? ' - ' + c.bairro : ''}` : 'Endereço não informado',
        cidade: c.cidade || '',
        estado: c.estado || '',
        email: c.email || '',
        contatos: c.telefone || '',
        dataCadastro: c.data_cadastro ? new Date(c.data_cadastro).toLocaleDateString('pt-BR') : '--/--',
        aniversario: c.data_nascimento ? new Date(c.data_nascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '--/--',
        cpfCnpj: c.cpf_cnpj || '',
        sexo: c.sexo || 'M',
        status: c.status_ativo ? 'Ativo' : 'Inativo',
        ...c // Mantém todos os outros campos originais
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Erro ao buscar clientes do banco:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = (newClientData) => {
    // Ao salvar um novo cliente, recarregamos a lista do banco para garantir sincronia
    fetchClients();
    setActiveTab('clientes');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clientes':
        return (
          <>
            <ClientTable clients={clients} />
            <Pagination />
          </>
        );
      case 'cadastrar':
        return <ClientForm onSave={handleAddClient} />;
      case 'dashboard':
        return <Reports clients={clients} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
