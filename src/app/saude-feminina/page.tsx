'use client';

// Marcar como página dinâmica para evitar erro de pré-renderização sem variáveis do Supabase
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CicloDashboard from '@/components/saude-feminina/CicloDashboard';
import CalendarioMenstrual from '@/components/saude-feminina/CalendarioMenstrual';
import TrackerSintomas from '@/components/saude-feminina/TrackerSintomas';
import MenopausaTracking from '@/components/saude-feminina/MenopausaTracking';
import RelatoriosSaude from '@/components/saude-feminina/RelatoriosSaude';
import { getAllClientes, ClienteComFormulario } from '@/data/clientesData';

// Abas disponíveis
type TabType = 'dashboard' | 'calendario' | 'sintomas' | 'menopausa' | 'relatorios';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

export default function SaudeFemininaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [clientes, setClientes] = useState<ClienteComFormulario[]>([]);

  // Carregar clientes ao montar
  useEffect(() => {
    async function loadClientes() {
      const clientesData = await getAllClientes();
      setClientes(clientesData);
      // Selecionar primeiro cliente por padrão se houver
      if (clientesData.length > 0 && !selectedClienteId) {
        setSelectedClienteId(clientesData[0].id);
      }
    }
    loadClientes();
  }, []);

  const tabs: Tab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Visão geral do ciclo e bem-estar',
    },
    {
      id: 'calendario',
      label: 'Calendário',
      icon: '📅',
      description: 'Calendário menstrual interativo',
    },
    {
      id: 'sintomas',
      label: 'Sintomas',
      icon: '📝',
      description: 'Acompanhamento diário de sintomas',
    },
    {
      id: 'menopausa',
      label: 'Menopausa',
      icon: '🔄',
      description: 'Tracking de menopausa e perimenopausa',
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: '📈',
      description: 'Estatísticas e análises',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white p-4 md:p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl md:text-3xl hover:scale-110 transition-transform"
            >
              ☰
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">🌸 Saúde Feminina</h1>
              <p className="text-pink-100 text-sm md:text-base">Acompanhamento do ciclo menstrual e bem-estar</p>
            </div>
          </div>
          
          {/* Seletor de Cliente */}
          <div className="hidden md:block">
            <select
              value={selectedClienteId}
              onChange={(e) => setSelectedClienteId(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id} className="text-gray-800">
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setView={() => {}} />

      {/* Tabs Navigation */}
      <div className="bg-white border-b-2 border-pink-200 shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col md:flex-row items-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-lg transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                  }
                `}
              >
                <span className="text-2xl md:text-3xl">{tab.icon}</span>
                <div className="text-center md:text-left">
                  <div className="font-semibold text-sm md:text-base">{tab.label}</div>
                  <div className="text-xs md:text-sm opacity-80 hidden md:block">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-6">
        {!selectedClienteId && clientes.length > 0 && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👤</span>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Selecione um cliente</h3>
                <p className="text-sm text-gray-600">Escolha um cliente para acompanhar sua saúde feminina</p>
                <select
                  value={selectedClienteId}
                  onChange={(e) => setSelectedClienteId(e.target.value)}
                  className="mt-3 w-full md:w-auto bg-white border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecione...</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-4 md:mt-6">
          {activeTab === 'dashboard' && (
            <CicloDashboard clienteId={selectedClienteId} />
          )}
          {activeTab === 'calendario' && (
            <CalendarioMenstrual clienteId={selectedClienteId} />
          )}
          {activeTab === 'sintomas' && (
            <TrackerSintomas clienteId={selectedClienteId} />
          )}
          {activeTab === 'menopausa' && (
            <MenopausaTracking clienteId={selectedClienteId} />
          )}
          {activeTab === 'relatorios' && (
            <RelatoriosSaude clienteId={selectedClienteId} />
          )}
        </div>
      </div>
    </div>
  );
}

