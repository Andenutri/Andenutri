'use client';

import { useState } from 'react';
import { getAllClientes, ClienteComFormulario } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';
import ClientDetailsModal from './ClientDetailsModal';

interface Column {
  id: string;
  nome: string;
  cor: string;
  clientes: string[];
}

export default function KanbanBoard({ sidebarOpen }: { sidebarOpen: boolean }) {
  const allClientes = getAllClientes();
  
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', nome: '✅ Ativo', cor: 'green', clientes: ['1', '2', '4', '5'] },
    { id: '2', nome: '❌ Inativo', cor: 'red', clientes: [] },
    { id: '3', nome: '⏸️ Pausado', cor: 'yellow', clientes: ['3'] },
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClienteComFormulario | null>(null);
  const [newColumnData, setNewColumnData] = useState({ nome: '', cor: 'purple' });

  const cores = [
    { id: 'green', nome: 'Verde', classe: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'red', nome: 'Vermelho', classe: 'bg-red-100 border-red-300 text-red-800' },
    { id: 'yellow', nome: 'Amarelo', classe: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { id: 'blue', nome: 'Azul', classe: 'bg-blue-100 border-blue-300 text-blue-800' },
    { id: 'purple', nome: 'Roxo', classe: 'bg-purple-100 border-purple-300 text-purple-800' },
    { id: 'pink', nome: 'Rosa', classe: 'bg-pink-100 border-pink-300 text-pink-800' },
    { id: 'indigo', nome: 'Índigo', classe: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { id: 'gray', nome: 'Cinza', classe: 'bg-gray-100 border-gray-300 text-gray-800' },
  ];

  const handleDragStart = (clienteId: string) => {
    setDraggedItem(clienteId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedItem) return;
    const newColumns = columns.map(col => {
      const clientesSemDragged = col.clientes.filter(id => id !== draggedItem);
      if (col.id === columnId) {
        return { ...col, clientes: [...clientesSemDragged, draggedItem] };
      }
      return { ...col, clientes: clientesSemDragged };
    });
    setColumns(newColumns);
    setDraggedItem(null);
  };

  const adicionarColuna = () => {
    if (!newColumnData.nome.trim()) return;
    const novaColuna: Column = {
      id: Date.now().toString(),
      nome: newColumnData.nome,
      cor: newColumnData.cor,
      clientes: []
    };
    setColumns([...columns, novaColuna]);
    setShowAddColumnModal(false);
    setNewColumnData({ nome: '', cor: 'purple' });
  };

  const removerColuna = (columnId: string) => {
    if (confirm('Tem certeza que deseja remover esta coluna?')) {
      setColumns(columns.filter(col => col.id !== columnId));
    }
  };

  const abrirDetalhesCliente = (clienteId: string) => {
    const cliente = allClientes.find(c => c.id === clienteId);
    if (cliente) {
      setSelectedClient(cliente);
      setShowClientModal(true);
    }
  };

  const getClienteById = (id: string) => {
    return allClientes.find(c => c.id === id);
  };

  const getCoresByColumn = (colorId: string) => {
    return cores.find(c => c.id === colorId) || cores[7];
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
      {/* Header Mobile-First */}
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="md:ml-24">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">📋 Trello</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Organize seus clientes em colunas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
            <button
              onClick={() => setShowAddColumnModal(true)}
              className="w-full sm:w-auto bg-amber-50 text-amber-700 px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-amber-100 transition-colors border-2 border-amber-200 font-semibold text-sm md:text-base"
            >
              ➕ Nova Coluna
            </button>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-sm md:text-base"
            >
              👤 Adicionar Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Board Mobile-First */}
      <div className="p-4 md:p-6">
        {/* Mobile: Stack verticalmente, Desktop: Horizontal scroll */}
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:overflow-x-auto lg:overflow-y-visible pb-4">
          <div className="flex lg:contents flex-col lg:flex-row gap-4 lg:gap-6">
            {columns.map((column) => {
              const classeCor = getCoresByColumn(column.cor);
              const clientesNaColuna = column.clientes.map(id => getClienteById(id)).filter(Boolean) as ClienteComFormulario[];

              return (
                <div
                  key={column.id}
                  className="w-full lg:w-80 lg:flex-shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id)}
                >
                  <div className={`${classeCor.classe} rounded-t-xl px-3 py-2 md:px-4 md:py-3 border-2 font-bold flex items-center justify-between mb-3`}>
                    <span className="text-sm md:text-base">{column.nome} ({clientesNaColuna.length})</span>
                    <button
                      onClick={() => removerColuna(column.id)}
                      className="text-xs hover:bg-white/30 px-2 py-1 rounded"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="bg-gray-100 rounded-b-xl p-3 min-h-[200px] lg:min-h-[500px] lg:max-h-[calc(100vh-250px)] overflow-y-auto space-y-3" style={{ maxHeight: '60vh' }}>
                    {clientesNaColuna.map((cliente) => (
                      <div
                        key={cliente.id}
                        draggable
                        onDragStart={() => handleDragStart(cliente.id)}
                        onClick={() => abrirDetalhesCliente(cliente.id)}
                        className="bg-white rounded-lg p-3 md:p-4 shadow-md cursor-move hover:shadow-lg transition-all border-l-4 border-amber-500"
                      >
                        {/* Nome e Status */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-bold text-gray-800 text-sm md:text-base">{cliente.nome}</div>
                          <div className="flex gap-1 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              cliente.status_plano === 'ativo' ? 'bg-green-100 text-green-700' :
                              cliente.status_plano === 'inativo' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {cliente.status_plano === 'ativo' ? '🟢' : cliente.status_plano === 'inativo' ? '🔴' : '🟡'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Informações Principais */}
                        <div className="text-xs text-gray-600 space-y-1 mt-2">
                          {cliente.formulario && (
                            <>
                              <div className="flex items-center gap-1">
                                <span>📊 Meta:</span>
                                <span className="font-semibold">{cliente.formulario.peso_desejado}kg</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>⚖️ Atual:</span>
                                <span className="font-semibold">{cliente.formulario.peso_atual}kg</span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1 text-blue-600">
                            <span>📅 Próxima consulta:</span>
                            <span className="font-semibold">20/02/2025</span>
                          </div>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t my-2"></div>
                        
                        {/* Observações Personalizadas */}
                        <div className="text-xs text-gray-500 mt-2">
                          <div className="font-semibold text-gray-700 mb-1">📝 Observações:</div>
                          <div className="max-h-20 overflow-y-auto text-xs">
                            Protocolo: Mudança gradual{cliente.formulario_preenchido && ' • Formulário preenchido'}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {clientesNaColuna.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-sm">Nenhum cliente</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddColumnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-amber-700 mb-4">➕ Nova Coluna</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Coluna</label>
              <input
                type="text"
                value={newColumnData.nome}
                onChange={(e) => setNewColumnData({...newColumnData, nome: e.target.value})}
                placeholder="Ex: Primeira Consulta"
                className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-sm md:text-base"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Cor</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {cores.map(cor => (
                  <button
                    key={cor.id}
                    onClick={() => setNewColumnData({...newColumnData, cor: cor.id})}
                    className={`p-2 md:p-3 rounded-lg border-2 text-xs md:text-sm ${
                      newColumnData.cor === cor.id ? 'border-amber-500 scale-110' : 'border-gray-200'
                    } ${cor.classe}`}
                  >
                    {cor.nome}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={() => setShowAddColumnModal(false)}
                className="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarColuna}
                className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 shadow-lg text-sm md:text-base"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal completo com todos os dados do cliente */}
      {showClientModal && selectedClient && (
        <ClientDetailsModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setSelectedClient(null);
          }}
          cliente={selectedClient}
        />
      )}

      {/* Modal Adicionar Cliente */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
      />
    </div>
  );
}
