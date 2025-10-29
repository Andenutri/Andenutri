'use client';

// Marcar como página dinâmica para evitar erro de pré-renderização sem variáveis do Supabase
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ClientProgressReport from '@/components/ferramentas/ClientProgressReport';
import PhotoUploader from '@/components/ferramentas/PhotoUploader';
import PhotoGallery from '@/components/ferramentas/PhotoGallery';
import AnamneseBuilder from '@/components/ferramentas/AnamneseBuilder';
import BrandingSettings from '@/components/ferramentas/BrandingSettings';
import AdvancedFilters from '@/components/ferramentas/AdvancedFilters';
import { getAllClientes, ClienteComFormulario } from '@/data/clientesData';
import { getAllAnamneses, Anamnese } from '@/data/anamnesesData';
import { getKanbanColumns, Column } from '@/data/kanbanData';

// Abas disponíveis (serão desenvolvidas progressivamente)
type TabType = 'relatorios' | 'fotos' | 'anamnese' | 'branding' | 'filtros';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  component: React.ReactNode;
  description: string;
}

export default function FerramentasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('relatorios');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [selectedClienteIdPhotos, setSelectedClienteIdPhotos] = useState<string>('');
  const [clientes, setClientes] = useState<ClienteComFormulario[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [loadingAnamneses, setLoadingAnamneses] = useState(true);
  const [creatingAnamnese, setCreatingAnamnese] = useState(false);
  const [selectedAnamnese, setSelectedAnamnese] = useState<Anamnese | undefined>(undefined);
  const [allClientesForFilters, setAllClientesForFilters] = useState<ClienteComFormulario[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteComFormulario[]>([]);
  const [columnsForFilters, setColumnsForFilters] = useState<Column[]>([]);

  useEffect(() => {
    async function loadClientes() {
      setLoadingClientes(true);
      const clientesData = await getAllClientes();
      setClientes(clientesData);
      setLoadingClientes(false);
    }
    loadClientes();
  }, []);

  useEffect(() => {
    async function loadAnamneses() {
      setLoadingAnamneses(true);
      const anamnesesData = await getAllAnamneses();
      setAnamneses(anamnesesData);
      setLoadingAnamneses(false);
    }
    if (activeTab === 'anamnese') {
      loadAnamneses();
    }
  }, [activeTab]);

  useEffect(() => {
    async function loadDataForFilters() {
      const [clientesData, columnsData] = await Promise.all([
        getAllClientes(),
        getKanbanColumns(),
      ]);
      setAllClientesForFilters(clientesData);
      setFilteredClientes(clientesData);
      setColumnsForFilters(columnsData);
    }
    if (activeTab === 'filtros') {
      loadDataForFilters();
    }
  }, [activeTab]);

  // Componentes placeholder - serão implementados progressivamente
  const RelatoriosTab = () => (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-2">📊 Relatórios Visuais</h2>
        <p className="text-blue-100">Geração de relatórios gráficos de progresso do cliente</p>
      </div>

      {/* Seleção de Cliente */}
      <div className="bg-white rounded-lg border-2 border-blue-200 p-4 md:p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 Selecione um cliente para ver o relatório:
        </label>
        {loadingClientes ? (
          <div className="p-4 text-center text-gray-500">
            Carregando clientes...
          </div>
        ) : (
          <>
            <select
              value={selectedClienteId}
              onChange={(e) => setSelectedClienteId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} {cliente.email ? `(${cliente.email})` : ''}
                </option>
              ))}
            </select>
            
            {clientes.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Nenhum cliente encontrado. Cadastre clientes primeiro.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Relatório do Cliente Selecionado */}
      {selectedClienteId && (
        <div className="bg-white rounded-lg border-2 border-gray-200">
          <ClientProgressReport clienteId={selectedClienteId} />
        </div>
      )}

      {!selectedClienteId && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
          <p className="text-gray-500">
            Escolha um cliente no campo acima para visualizar seu relatório completo de progresso
          </p>
        </div>
      )}
    </div>
  );

  const FotosTab = () => (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-2">📸 Fotos de Antes e Depois</h2>
        <p className="text-pink-100">Sistema de upload e visualização de fotos de progresso</p>
      </div>

      {/* Seleção de Cliente */}
      <div className="bg-white rounded-lg border-2 border-pink-200 p-4 md:p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 Selecione um cliente:
        </label>
        {loadingClientes ? (
          <div className="p-4 text-center text-gray-500">
            Carregando clientes...
          </div>
        ) : (
          <>
            <select
              value={selectedClienteIdPhotos}
              onChange={(e) => setSelectedClienteIdPhotos(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-base"
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} {cliente.email ? `(${cliente.email})` : ''}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {selectedClienteIdPhotos ? (
        <div className="space-y-6">
          {/* Upload de Fotos */}
          <div className="bg-white rounded-lg border-2 border-pink-200 p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">📤 Enviar Fotos</h3>
            <PhotoUploader clienteId={selectedClienteIdPhotos} />
          </div>

          {/* Galeria de Fotos */}
          <div className="bg-white rounded-lg border-2 border-pink-200 p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">📷 Galeria de Fotos</h3>
            <PhotoGallery clienteId={selectedClienteIdPhotos} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
          <p className="text-gray-500">
            Escolha um cliente no campo acima para gerenciar suas fotos de progresso
          </p>
        </div>
      )}
    </div>
  );

  const AnamneseTab = () => (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-2">📋 Anamnese Personalizada</h2>
        <p className="text-green-100">Criação de formulários customizados para coleta de dados</p>
      </div>

      {!creatingAnamnese && !selectedAnamnese && (
        <div className="space-y-4">
          {/* Botão Criar Nova */}
          <div className="bg-white rounded-lg border-2 border-green-200 p-4 md:p-6">
            <button
              onClick={() => setCreatingAnamnese(true)}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center gap-3"
            >
              <span>➕</span>
              <span>Criar Nova Anamnese</span>
            </button>
          </div>

          {/* Lista de Anamneses */}
          <div className="bg-white rounded-lg border-2 border-green-200 p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Anamneses Criadas</h3>
            {loadingAnamneses ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p>Carregando anamneses...</p>
              </div>
            ) : anamneses.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>Nenhuma anamnese criada ainda.</p>
                <p className="text-sm mt-1">Clique em "Criar Nova Anamnese" para começar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {anamneses.map((anamnese) => (
                  <div
                    key={anamnese.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{anamnese.nome}</h4>
                        {anamnese.descricao && (
                          <p className="text-sm text-gray-600 mb-2">{anamnese.descricao}</p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>📝 {anamnese.campos.length} campo(s)</span>
                          <span>
                            📅 Criada em{' '}
                            {new Date(anamnese.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedAnamnese(anamnese);
                            setCreatingAnamnese(false);
                          }}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-semibold"
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modo Criação/Edição */}
      {(creatingAnamnese || selectedAnamnese) && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-green-200 p-4">
            <button
              onClick={() => {
                setCreatingAnamnese(false);
                setSelectedAnamnese(undefined);
                // Recarregar lista
                getAllAnamneses().then(setAnamneses);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold flex items-center gap-2"
            >
              <span>←</span>
              <span>Voltar para Lista</span>
            </button>
          </div>

          <AnamneseBuilder
            anamnese={selectedAnamnese}
            onSave={(anamnese) => {
              setSelectedAnamnese(undefined);
              setCreatingAnamnese(false);
              getAllAnamneses().then(setAnamneses);
            }}
          />
        </div>
      )}
    </div>
  );

  const BrandingTab = () => (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-2">🎨 Branding e Personalização</h2>
        <p className="text-amber-100">Personalizar relatórios com logo e informações de contato</p>
      </div>
      
      <BrandingSettings />
    </div>
  );

  const FiltrosTab = () => (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-2">🔍 Filtros Avançados</h2>
        <p className="text-purple-100">Busca e filtros avançados de clientes</p>
      </div>

      {/* Componente de Filtros */}
      <AdvancedFilters
        clientes={allClientesForFilters}
        columns={columnsForFilters.map((col) => ({ id: col.id, nome: col.nome }))}
        onFilterChange={setFilteredClientes}
      />

      {/* Lista de Clientes Filtrados */}
      <div className="mt-6 bg-white border-2 border-purple-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          👥 Clientes Filtrados ({filteredClientes.length})
        </h3>

        {filteredClientes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>Nenhum cliente encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
              >
                <h4 className="font-semibold text-gray-800 mb-2">{cliente.nome}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {cliente.email && <p>📧 {cliente.email}</p>}
                  {cliente.telefone && <p>📞 {cliente.telefone}</p>}
                  <div className="flex gap-2 mt-2">
                    {(cliente.status_plano === 'ativo' || (cliente as any).status_programa === 'ativo') && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        ✅ Programa Ativo
                      </span>
                    )}
                    {(cliente as any).status_herbalife === 'ativo' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        🥗 Herbalife Ativo
                      </span>
                    )}
                    {(cliente as any).is_lead && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                        🎯 Lead
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const tabs: Tab[] = [
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: '📊',
      component: <RelatoriosTab />,
      description: 'Relatórios visuais com gráficos'
    },
    {
      id: 'fotos',
      label: 'Fotos',
      icon: '📸',
      component: <FotosTab />,
      description: 'Fotos de antes e depois'
    },
    {
      id: 'anamnese',
      label: 'Anamnese',
      icon: '📋',
      component: <AnamneseTab />,
      description: 'Formulários customizados'
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: '🎨',
      component: <BrandingTab />,
      description: 'Personalização de relatórios'
    },
    {
      id: 'filtros',
      label: 'Filtros',
      icon: '🔍',
      component: <FiltrosTab />,
      description: 'Busca avançada'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 relative">
      {/* Header com Botão Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-lg md:text-xl shadow-lg hover:scale-105 transition-all"
      >
        ☰
      </button>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setView={() => {}} />

      {/* Conteúdo Principal */}
      <div className="pt-16 md:pt-20">
        {/* Header da Página */}
        <div className="bg-white shadow-md border-b-2 border-amber-200 sticky top-16 md:top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              🔧 Ferramentas Avançadas
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Desenvolvimento paralelo de funcionalidades do FineShape
            </p>
          </div>
        </div>

        {/* Sistema de Abas */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {/* Barra de Abas */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 min-w-[120px] px-4 md:px-6 py-4 md:py-5 
                    transition-all duration-200
                    border-b-4
                    ${activeTab === tab.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl md:text-3xl">{tab.icon}</span>
                    <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                    <span className="text-xs text-gray-500 hidden md:block">{tab.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 min-h-[500px]">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
}

