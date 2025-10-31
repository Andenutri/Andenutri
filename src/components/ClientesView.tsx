'use client';

import { useState, useEffect } from 'react';
import { getAllClientes, ClienteComFormulario } from '@/data/clientesData';
import ClientList from './ClientList';
import KanbanBoard from './KanbanBoard';
import AddClientModal from './AddClientModal';
import ClientDetailsModal from './ClientDetailsModal';

type ViewMode = 'lista' | 'trello';

export default function ClientesView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [allClientes, setAllClientes] = useState<ClienteComFormulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClienteComFormulario | null>(null);

  // Carregar clientes UMA ÚNICA VEZ - compartilhado entre as duas visualizações
  useEffect(() => {
    async function loadClientes() {
      setLoading(true);
      const clientesData = await getAllClientes();
      setAllClientes(clientesData);
      setLoading(false);
    }
    loadClientes();
  }, []);

  // Função para recarregar clientes (quando adicionar/editar)
  const reloadClientes = async () => {
    const clientesData = await getAllClientes();
    setAllClientes(clientesData);
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
      {/* Header Unificado com Toggle de Visualização */}
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">👥 Clientes</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Gestão completa de clientes
              {loading && <span className="ml-2 text-xs">(Carregando...)</span>}
              {!loading && <span className="ml-2 text-xs text-amber-600">({allClientes.length} clientes)</span>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center">
            {/* Toggle de Visualização - Como a Agenda */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border-2 border-gray-200">
              <button
                onClick={() => setViewMode('lista')}
                className={`px-4 py-2 rounded-md text-sm md:text-base font-semibold transition-all ${
                  viewMode === 'lista'
                    ? 'bg-white text-amber-700 shadow-md'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setViewMode('trello')}
                className={`px-4 py-2 rounded-md text-sm md:text-base font-semibold transition-all ${
                  viewMode === 'trello'
                    ? 'bg-white text-amber-700 shadow-md'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                📊 Trello
              </button>
            </div>

            {/* Botão Adicionar Cliente */}
            <button 
              onClick={() => setShowAddClientModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 md:py-3 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base font-semibold"
            >
              ➕ Adicionar Cliente
            </button>
          </div>
        </div>

        {/* Barra de Busca - Sempre Visível */}
        <div className="mt-4 px-4 md:px-8">
          <div className="bg-white rounded-lg border-2 border-amber-200 p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Buscar por nome, email, telefone, status, lead, herbalife..."
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-sm md:text-base"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 md:py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm md:text-base whitespace-nowrap"
                >
                  🗑️ Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Baseado na Visualização Selecionada */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mb-4"></div>
            <p className="text-gray-600">Carregando clientes...</p>
          </div>
        </div>
      ) : viewMode === 'lista' ? (
        // Visualização em Lista
        <div className="p-4 md:p-6 pb-8">
          {allClientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum cliente cadastrado ainda.</p>
              <p className="text-gray-500 text-sm mt-2">Clique em "➕ Adicionar Cliente" para começar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {allClientes
                .filter(cliente => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase().trim();
                  const nomeMatch = cliente.nome?.toLowerCase().includes(query);
                  const emailMatch = cliente.email?.toLowerCase().includes(query);
                  const telefoneMatch = cliente.telefone?.toLowerCase().includes(query);
                  const whatsappMatch = cliente.whatsapp?.toLowerCase().includes(query);
                  const statusMatch = cliente.status_plano?.toLowerCase().includes(query);
                  const leadMatch = query.includes('lead') && (cliente as any).is_lead;
                  const herbalifeMatch = query.includes('herbalife') && (cliente as any).status_herbalife;
                  const indicacaoMatch = (cliente as any).indicado_por?.toLowerCase().includes(query);
                  
                  return nomeMatch || emailMatch || telefoneMatch || whatsappMatch || statusMatch || leadMatch || herbalifeMatch || indicacaoMatch;
                })
                .map((cliente) => (
                <div
                  key={cliente.id}
                  onClick={() => {
                    setSelectedClient(cliente);
                    setShowClientModal(true);
                  }}
                  className="block bg-white rounded-xl shadow-lg p-4 md:p-6 hover:scale-105 transition-transform cursor-pointer border-l-4 border-amber-500"
                >
                  <div className="mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{cliente.nome}</h3>
                    {/* Bolinhas de Status */}
                    <div className="flex gap-3 items-center flex-wrap">
                      <div className="flex items-center gap-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          cliente.status_plano === 'ativo' ? 'bg-green-500' :
                          cliente.status_plano === 'inativo' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Programa</span>
                      </div>
                      {(cliente as any).status_herbalife && (
                        <div className="flex items-center gap-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            (cliente as any).status_herbalife === 'ativo' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-xs text-gray-600">Herbalife</span>
                        </div>
                      )}
                      {(cliente as any).is_lead && (
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                          <span className="text-xs text-gray-600">Lead</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">📧 {cliente.email || 'Sem email'}</p>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">📱 {cliente.whatsapp || cliente.telefone || 'Sem telefone'}</p>
                  {cliente.formulario && (
                    <p className="text-xs md:text-sm text-gray-600 mb-1">⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Visualização Trello - Passa os clientes como prop
        <KanbanBoard 
          sidebarOpen={sidebarOpen} 
          clientesExternos={allClientes}
          onClientesChange={reloadClientes}
          searchQuery={searchQuery}
        />
      )}

      {/* Modal Adicionar Cliente */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={async (data) => {
          setShowAddClientModal(false);
          // Recarregar clientes após adicionar
          await reloadClientes();
        }}
      />

      {/* Modal Detalhes do Cliente */}
      {showClientModal && selectedClient && (
        <ClientDetailsModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setSelectedClient(null);
            // Recarregar clientes caso tenha sido editado
            reloadClientes();
          }}
          cliente={selectedClient}
        />
      )}
    </div>
  );
}

