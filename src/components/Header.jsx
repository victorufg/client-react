import React from 'react';
import { Users, UserPlus, LayoutDashboard } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ activeTab, setActiveTab, isEditing }) => {
  const tabs = [
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'cadastrar', label: isEditing ? 'Edição Cliente' : 'Cadastrar Cliente', icon: UserPlus }, // Keep same icon or change if desired
    { id: 'dashboard', label: 'Relatório / Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="main-header">
      <nav className="segmented-control">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`segment-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} className="segment-icon" />
              <span className="segment-label">{tab.label}</span>
              {activeTab === tab.id && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
