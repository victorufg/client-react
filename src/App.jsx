import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientTable from './components/ClientTable';
import ClientForm from './components/ClientForm';
import Reports from './components/Reports';
import Pagination from './components/Pagination';
import './App.css'; // We'll create this for specific App-level layout if needed

function App() {
  const [activeTab, setActiveTab] = useState('clientes');

  // Initialize state from LocalStorage or default mock data
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('clients_db');
    if (savedClients) {
      return JSON.parse(savedClients);
    }
    return Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      tipo: index % 3 === 0 ? 'Jurídico' : 'Físico',
      cliente: `Cliente Exemplo ${index + 1}`,
      apelido: `Apelido ${index + 1}`,
      endereco: 'Rua Exemplo, 123',
      cidade: index % 2 === 0 ? 'São Paulo' : 'Rio de Janeiro',
      estado: index % 2 === 0 ? 'SP' : 'RJ',
      email: 'email@exemplo.com',
      contatos: '(11) 99999-9999',
      dataCadastro: '10/02/2026',
      aniversario: '01/01',
      cpfCnpj: '000.000.000-00',
      sexo: index % 2 === 0 ? 'M' : 'F',
      profissao: index % 2 === 0 ? 'Desenvolvedor' : 'Designer',
      faixaEtaria: '25-34',
      relacaoFamiliar: 'Solteiro',
      restricao: 'Não',
      status: index % 2 === 0 ? 'Ativo' : 'Inativo',
    }));
  });

  // Sync state to LocalStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('clients_db', JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = (formData) => {
    const newClient = {
      id: clients.length + 1,
      tipo: formData.tipoPessoa || 'Físico',
      cliente: formData.nome,
      apelido: formData.apelido || '',
      endereco: formData.logradouro || 'Rua Nova, 456',
      cidade: formData.cidade || 'São Paulo',
      estado: formData.estado || 'SP',
      email: formData.email || 'novo@email.com',
      contatos: formData.telefone || '(11) 90000-0000',
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      aniversario: formData.dataNascimento ? formData.dataNascimento.substring(5, 10).split('-').reverse().join('/') : '--/--',
      cpfCnpj: formData.cpfCnpj || '000.000.000-00',
      sexo: formData.sexo || 'M',
      status: 'Ativo',
      ...formData // Include all other fields
    };

    setClients([newClient, ...clients]);
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
