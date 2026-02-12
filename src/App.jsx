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
      const mappedClients = data.map(c => {
        // Helper date formatter to avoid timezone issues
        const formatDate = (dateString) => {
          if (!dateString) return '-';
          // Assuming date comes as YYYY-MM-DDT... or YYYY-MM-DD
          const datePart = dateString.split('T')[0];
          const parts = datePart.split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
          }
          return '-';
        };

        return {
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
          aniversario: formatDate(c.data_nascimento),
          cpfCnpj: c.cpf_cnpj || '-',
          sexo: c.sexo || '-',
          restricao: c.restricao === true ? 'Sim' : (c.restricao === false ? 'Não' : '-'),
          status: c.status_ativo ? 'Ativo' : 'Inativo',
          // Preserve original raw data for editing
          rawData: c
        };
      });

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

  const handleSaveClient = (savedData) => {
    // Ao salvar um novo cliente ou editar, recarregamos a lista em background
    fetchClients();

    // Manter na mesma página (não zerar editingClient nem mudar tab)
    // Se era um novo cliente, agora ele tem ID, então atualizamos para "modo edição"
    const normalizedData = {
      ...savedData,
      tipo_pessoa: savedData.tipoPessoa,
      cpf_cnpj: savedData.cpfCnpj,
      rg_inscricao: savedData.rgInscricao,
      data_nascimento: savedData.dataNascimento,
      relacao_familiar: savedData.relacaoFamiliar,
      emitir_nf: savedData.emitirNF === 'Sim',
      iss_retido: savedData.issRetido === 'Sim',
      consumidor_final: savedData.consumidorFinal === 'Sim',
      produtor_rural: savedData.produtorRural === 'Sim',
      tipo_contribuinte: savedData.tipoContribuinte,
      tipo_cliente: savedData.tipoCliente,
      credito_liberado: savedData.creditoLiberado,
      valor_gasto: savedData.valorGasto,
      saldo: savedData.saldo,
      valor_consumido: savedData.valorConsumido,
      valor_custos: savedData.valorCustos,
      lucratividade: savedData.lucratividade,
      comissao: savedData.comissao,
      cnh_vencimento: savedData.cnhVencimento,
      como_conheceu: savedData.comoConheceu,
      nome_amigo: savedData.nomeAmigo,
      cliente_desde: savedData.clienteDesde,
      data_pagamento: savedData.dataPagamento,
      codigo_cidade: savedData.codigoCidade,
      status_ativo: savedData.statusAtivo === 'Sim'
    };
    setEditingClient(normalizedData);
  };

  const handleEditClient = (client) => {
    // Find the raw data for this client from the mapped list
    // The mapped client object has 'rawData' property we added above
    // We merge the mapped ID explicitly to ensure it's present for the update payload
    // This fixes the issue where editing creates a new record if rawData lacks ID
    setEditingClient({ ...client.rawData, id: client.id });
    setActiveTab('cadastrar');
  };

  const handleDeleteClient = async (client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.cliente}?`)) {
      try {
        const response = await fetch(`/api/delete-client?id=${client.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchClients(); // Refresh list
        } else {
          alert('Erro ao excluir cliente');
        }
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir cliente');
      }
    }
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
              onDelete={handleDeleteClient}
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
