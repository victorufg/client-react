import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientTable from './components/ClientTable';
import ClientForm from './components/ClientForm';
import Reports from './components/Reports';
import Pagination from './components/Pagination';
import './App.css'; // We'll create this for specific App-level layout if needed

function App() {
  const [activeTab, setActiveTab] = useState('clientes');
  const [editingClient, setEditingClient] = useState(null); // State for the client being edited

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
        ...c,
        id: c.id,
        tipo: c.tipo_pessoa || '-',
        cliente: c.nome || '-',
        apelido: c.apelido || '-',
        endereco: c.logradouro ? `${c.logradouro}${c.numero ? ', ' + c.numero : ''}${c.bairro ? ' - ' + c.bairro : ''}` : '-',
        cidade: c.cidade || '-',
        estado: c.estado || '-',
        email: c.email || '-',
        contatos: c.telefone || '-',
        dataCadastro: c.data_cadastro ? new Date(c.data_cadastro).toLocaleDateString('pt-BR') : '-',
        aniversario: c.data_nascimento ? new Date(c.data_nascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-',
        cpfCnpj: c.cpf_cnpj || '-',
        sexo: c.sexo || '-',
        restricao: c.restricao === true ? 'Sim' : (c.restricao === false ? 'Não' : '-'),
        status: c.status_ativo ? 'Ativo' : 'Inativo',
        // Preserve original raw data for editing
        rawData: c
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

  const handleSaveClient = (savedClient) => {
    // Ao salvar um novo cliente ou editar, recarregamos a lista
    fetchClients();
    setEditingClient(null); // Clear editing state
    setActiveTab('clientes'); // Return to list
  };

  const handleEditClient = (client) => {
    // Find the raw data for this client from the mapped list
    // The mapped client object has 'rawData' property we added above
    setEditingClient(client.rawData);
    setActiveTab('cadastrar');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // If switching away from 'cadastrar' or manually clicking 'clientes', clear edit state?
    // User expectation: If I click 'Clientes', I probably want to see the list.
    // If I click 'Cadastrar' again, I probably want a new form.
    if (tabId === 'clientes') {
      setEditingClient(null);
    }
    // If clicking 'cadastrar' manually (not via Edit button), we should probably clear edit state too
    // unless we want to persist it. For now, let's assume manual click = new client.
    if (tabId === 'cadastrar' && !editingClient) {
      // already null, fine.
    } else if (tabId === 'cadastrar' && editingClient) {
      // If we are already editing and click the tab, maybe keep it?
      // But if we come from 'Clients' -> 'Cadastrar', it should be empty.
      // We'll solve this by strictly setting editingClient only via the Edit button.
      // And clearing it when leaving the tab or explicitly requesting new.
      // For this specific requirement, let's just clear it if we are switching TO cadastrar manually.
      // But handleTabChange is called for ALL clicks.
      // We need to distinguish manual click vs programmatic switch.
      // Actually, handleEditClient calls setEditingClient THEN setActiveTab.
      // So editingClient is set.
      // If I click the tab manually, this function is called.
      // If I was on 'clientes' and click 'cadastrar', editingClient is null (from lines above).
      // So it works for New.
      // If I am on 'cadastrar' (editing) and click 'cadastrar' again?
      // Maybe reset? Let's leave as is for now.
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clientes':
        return (
          <>
            <ClientTable
              clients={clients}
              onEdit={handleEditClient}
            />
            <Pagination />
          </>
        );
      case 'cadastrar':
        return (
          <ClientForm
            onSave={handleSaveClient}
            initialData={editingClient}
          />
        );
      case 'dashboard':
        return <Reports clients={clients} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isEditing={!!editingClient && activeTab === 'cadastrar'}
      />
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
