'use client';

import { useState, useEffect } from 'react';
import { getAllClientes, ClienteComFormulario } from '@/data/clientesData';
import AddClientModal from './AddClientModal';
import ClientDetailsModal from './ClientDetailsModal';
import { syncAllColumns, Column, getKanbanColumns, saveKanbanColumn, associarClientesPorStatus, limparDuplicatasColunasStatus } from '@/data/kanbanData';

interface KanbanBoardProps {
  sidebarOpen: boolean;
  clientesExternos?: ClienteComFormulario[]; // Clientes passados do componente pai (opcional)
  onClientesChange?: () => void; // Callback para notificar mudanças
  searchQuery?: string; // Query de busca para filtrar clientes
}

export default function KanbanBoard({ sidebarOpen, clientesExternos, onClientesChange, searchQuery = '' }: KanbanBoardProps) {
  const [allClientes, setAllClientes] = useState<ClienteComFormulario[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loadingColumns, setLoadingColumns] = useState(true);

  // Se clientes foram passados externamente, usar eles (sincronização automática)
  useEffect(() => {
    if (clientesExternos !== undefined) {
      setAllClientes(clientesExternos);
      setLoadingClientes(false);
    }
  }, [clientesExternos]);

  // Carregar clientes e colunas do Supabase (apenas se não foram passados externamente)
  useEffect(() => {
    async function loadData() {
      // Se já temos clientes externos, pular carregamento
      if (clientesExternos !== undefined) {
        setLoadingColumns(true);
      } else {
        setLoadingClientes(true);
        setLoadingColumns(true);
        
        // Carregar clientes apenas se não foram passados externamente
        const clientesData = await getAllClientes();
        setAllClientes(clientesData);
        setLoadingClientes(false);
      }
      
      // Carregar colunas do Kanban
      const colunasData = await getKanbanColumns();
      
      // Se não houver colunas, criar as padrão
      if (!colunasData || colunasData.length === 0) {
        const { getKanbanColumns } = await import('@/data/kanbanData');
        const novasColunas = await getKanbanColumns(); // Isso cria as padrão se não existirem
        setColumns(novasColunas || []);
        setLoadingColumns(false);
        
        // Aguardar um pouco e recarregar
        setTimeout(async () => {
          const colunasRecarregadas = await getKanbanColumns();
          setColumns(colunasRecarregadas);
          const clientesParaAssociar = clientesExternos || allClientes;
          await associarTodosClientesAsColunas(clientesParaAssociar, colunasRecarregadas);
          const colunasFinais = await getKanbanColumns();
          setColumns(colunasFinais);
        }, 1000);
        return;
      }
      
      setColumns(colunasData);
      setLoadingColumns(false);
      
      // LIMPAR DUPLICATAS PRIMEIRO (clientes que estão em múltiplas colunas)
      console.log('🧹 Limpando duplicatas antes de associar clientes...');
      await limparDuplicatasColunasStatus();
      
      // Recarregar colunas após limpeza
      const colunasLimpas = await getKanbanColumns();
      setColumns(colunasLimpas);
      
      // Associar TODOS os clientes às colunas automaticamente
      const clientesParaAssociar = clientesExternos || clientesData;
      console.log('🔄 Iniciando associação de clientes...');
      await associarTodosClientesAsColunas(clientesParaAssociar, colunasLimpas);
      
      // Aguardar um pouco para garantir que o Supabase processou
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recarregar colunas após associação para exibir clientes atualizados
      console.log('🔄 Recarregando colunas após associação...');
      const colunasAtualizadas = await getKanbanColumns();
      console.log('📋 Colunas recarregadas:', colunasAtualizadas.map(c => ({
        nome: c.nome,
        totalClientes: c.clientes.length,
        ids: c.clientes
      })));
      setColumns(colunasAtualizadas);
    }
    loadData();
  }, [clientesExternos]);

  // Função para associar todos os clientes às colunas
  async function associarTodosClientesAsColunas(clientes: ClienteComFormulario[], colunas: Column[]) {
    if (!clientes || clientes.length === 0 || !colunas || colunas.length === 0) {
      console.log('⚠️ Nenhum cliente ou coluna para associar');
      return;
    }

    console.log(`🔄 Associando ${clientes.length} clientes a ${colunas.length} colunas...`);

    // Mapear nomes de colunas para status (evitar duplicatas - pegar apenas a primeira coluna de cada tipo)
    const mapaStatusColuna: Record<string, string> = {};
    const tiposProcessados = new Set<string>();
    
    for (const coluna of colunas) {
      const nomeLower = coluna.nome.toLowerCase().trim();
      if (nomeLower.includes('ativo') && !tiposProcessados.has('ativo')) {
        mapaStatusColuna['ativo'] = coluna.id;
        tiposProcessados.add('ativo');
        console.log(`✓ Mapeando 'ativo' → ${coluna.nome} (${coluna.id})`);
      } else if (nomeLower.includes('inativo') && !tiposProcessados.has('inativo')) {
        mapaStatusColuna['inativo'] = coluna.id;
        tiposProcessados.add('inativo');
        console.log(`✓ Mapeando 'inativo' → ${coluna.nome} (${coluna.id})`);
      } else if ((nomeLower.includes('pausado') || nomeLower.includes('pausa')) && !tiposProcessados.has('pausado')) {
        mapaStatusColuna['pausado'] = coluna.id;
        tiposProcessados.add('pausado');
        console.log(`✓ Mapeando 'pausado' → ${coluna.nome} (${coluna.id})`);
      }
    }

    console.log('📋 Mapa final de status → colunas:', mapaStatusColuna);

    let clientesAdicionados = 0;
    let clientesJaNaColuna = 0;

      // Para cada cliente, adicionar à coluna correspondente
    for (const cliente of clientes) {
      // Suporta tanto status_plano quanto status_programa (para compatibilidade)
      const status = (cliente.status_plano || (cliente as any).status_programa)?.toLowerCase()?.trim();
      if (!status) {
        console.log(`⚠️ Cliente ${cliente.nome} não tem status_plano/status_programa definido. Usando 'ativo' como padrão.`);
        // Se não tiver status, adicionar à coluna "Ativo" por padrão
        const colunaAtivo = colunas.find(c => c.nome.toLowerCase().includes('ativo'));
        if (colunaAtivo) {
          try {
            const { addClientToColumn } = await import('@/data/kanbanData');
            await addClientToColumn(colunaAtivo.id, cliente.id);
            console.log(`✅ Cliente ${cliente.nome} (sem status) adicionado à coluna ${colunaAtivo.nome}`);
            clientesAdicionados++;
          } catch (error) {
            console.error(`❌ Erro ao adicionar ${cliente.nome}:`, error);
          }
        }
        continue;
      }

      const columnId = mapaStatusColuna[status];
      if (!columnId) {
        console.log(`⚠️ Cliente ${cliente.nome} tem status '${status}' mas não há coluna correspondente`);
        continue;
      }

      // Buscar coluna atualizada do Supabase para verificar se já está lá
      const colunaAtual = colunas.find(c => c.id === columnId);
      if (!colunaAtual) {
        console.log(`⚠️ Coluna ${columnId} não encontrada`);
        continue;
      }

      // Verificar se já está na coluna (comparar IDs como string)
      const clienteIdStr = String(cliente.id);
      const jaEstaNaColuna = colunaAtual.clientes.some(id => String(id) === clienteIdStr);
      
      if (jaEstaNaColuna) {
        console.log(`✓ Cliente ${cliente.nome} já está na coluna ${colunaAtual.nome}`);
        clientesJaNaColuna++;
        continue;
      }

      // Adicionar à coluna
      try {
        const { addClientToColumn } = await import('@/data/kanbanData');
        await addClientToColumn(columnId, cliente.id);
        console.log(`✅ Cliente ${cliente.nome} (${cliente.id}) adicionado à coluna ${colunaAtual.nome}`);
        clientesAdicionados++;
      } catch (error) {
        console.error(`❌ Erro ao adicionar ${cliente.nome}:`, error);
      }
    }

    console.log(`✅ Associação concluída! ${clientesAdicionados} adicionados, ${clientesJaNaColuna} já estavam nas colunas.`);
  }

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClienteComFormulario | null>(null);
  const [newColumnData, setNewColumnData] = useState({ nome: '', cor: 'purple' });
  const [selectedColumnForClient, setSelectedColumnForClient] = useState<string | null>(null);

  // REMOVIDO: syncAllColumns estava causando duplicação e loops infinitos
  // A sincronização agora é feita apenas quando necessário (criar/atualizar coluna)

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

  const adicionarColuna = async () => {
    if (!newColumnData.nome.trim()) return;
    try {
      // Salvar no Supabase primeiro
      const colunaSalva = await saveKanbanColumn({
        nome: newColumnData.nome,
        cor: newColumnData.cor,
        ordem: columns.length,
        clientes_ids: []
      });
      
      // Recarregar colunas do Supabase para pegar o ID correto
      const colunasData = await getKanbanColumns();
      setColumns(colunasData);
      
      setShowAddColumnModal(false);
      setNewColumnData({ nome: '', cor: 'purple' });
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      alert('❌ Erro ao criar coluna. Tente novamente.');
    }
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
        {/* Mobile e Desktop: Horizontal scroll (como Kanban/Trello) */}
        <div className="flex flex-row gap-4 md:gap-6 overflow-x-auto overflow-y-visible pb-4">
          <div className="flex gap-4 md:gap-6">
            {columns.map((column) => {
              const classeCor = getCoresByColumn(column.cor);
              
              // DETERMINAR STATUS ESPERADO DA COLUNA BASEADO NO NOME
              // Isso garante sincronização: Trello mostra os MESMOS clientes que a Lista, apenas organizados
              const nomeColunaLower = column.nome.toLowerCase().trim();
              let statusEsperado: string | null = null;
              
              if (nomeColunaLower.includes('ativo')) {
                statusEsperado = 'ativo';
              } else if (nomeColunaLower.includes('inativo')) {
                statusEsperado = 'inativo';
              } else if (nomeColunaLower.includes('pausado') || nomeColunaLower.includes('pausa')) {
                statusEsperado = 'pausado';
              }

              // Se a coluna tem um status correspondente, mostrar TODOS os clientes com esse status
              // (igual à Lista, mas organizado em colunas)
              // Se não tiver status correspondente, mostrar apenas clientes salvos manualmente na coluna
              let clientesNaColuna: ClienteComFormulario[] = [];
              
              if (statusEsperado) {
                // Coluna com status: mostrar TODOS os clientes com esse status (sincronizado com Lista)
                // MAS: Remover clientes que já estão em OUTRAS colunas de status (evitar duplicatas)
                const clientesComStatus = allClientes.filter(c => {
                  const statusCliente = (c.status_plano || (c as any).status_programa)?.toLowerCase()?.trim();
                  return statusCliente === statusEsperado;
                });
                
                // Verificar quais clientes já estão em outras colunas de status
                const idsEmOutrasColunas = new Set<string>();
                columns.forEach(col => {
                  if (col.id !== column.id) {
                    const nomeColLower = col.nome.toLowerCase().trim();
                    const temStatus = nomeColLower.includes('ativo') || nomeColLower.includes('inativo') || nomeColLower.includes('pausado');
                    if (temStatus) {
                      col.clientes.forEach(id => idsEmOutrasColunas.add(String(id)));
                    }
                  }
                });
                
                // Filtrar: manter apenas clientes que NÃO estão em outras colunas de status
                // OU que já estão nesta coluna (permitir movimento manual)
                clientesNaColuna = clientesComStatus.filter(c => {
                  const clienteIdStr = String(c.id);
                  const jaEstaNestaColuna = column.clientes.some(id => String(id) === clienteIdStr);
                  const estaEmOutraColuna = idsEmOutrasColunas.has(clienteIdStr);
                  
                  // Manter se já está nesta coluna OU se não está em nenhuma outra coluna de status
                  return jaEstaNestaColuna || !estaEmOutraColuna;
                });
                
                // Sincronizar com Supabase em background (adicionar à coluna se não estiver e remover de outras)
                clientesNaColuna.forEach(async (c) => {
                  const clienteIdStr = String(c.id);
                  const jaEstaNoArray = column.clientes.some(id => String(id) === clienteIdStr);
                  
                  if (!jaEstaNoArray) {
                    // Remover de outras colunas de status primeiro
                    for (const col of columns) {
                      if (col.id !== column.id) {
                        const nomeColLower = col.nome.toLowerCase().trim();
                        const temStatus = nomeColLower.includes('ativo') || nomeColLower.includes('inativo') || nomeColLower.includes('pausado');
                        if (temStatus && col.clientes.some(id => String(id) === clienteIdStr)) {
                          try {
                            const { supabase } = await import('../lib/supabase');
                            const { data: colunaData } = await supabase
                              .from('kanban_colunas')
                              .select('clientes_ids')
                              .eq('id', col.id)
                              .single();
                            
                            if (colunaData) {
                              const novosIds = (colunaData.clientes_ids || [])
                                .filter((id: string) => String(id) !== clienteIdStr);
                              
                              await supabase
                                .from('kanban_colunas')
                                .update({ clientes_ids: novosIds })
                                .eq('id', col.id);
                              
                              console.log(`🗑️ Cliente ${c.nome} removido da coluna ${col.nome}`);
                            }
                          } catch (error) {
                            console.error(`Erro ao remover cliente de ${col.nome}:`, error);
                          }
                        }
                      }
                    }
                    
                    // Adicionar à coluna correta
                    try {
                      const { addClientToColumn } = await import('@/data/kanbanData');
                      await addClientToColumn(column.id, c.id);
                      console.log(`✅ Cliente ${c.nome} sincronizado com coluna ${column.nome}`);
                    } catch (error) {
                      console.error(`Erro ao adicionar cliente à coluna:`, error);
                    }
                  }
                });
              } else {
                // Coluna customizada (sem status correspondente): mostrar apenas clientes salvos manualmente
                clientesNaColuna = column.clientes
                  .map(columnClienteId => {
                    const clienteEncontrado = allClientes.find(c => String(c.id) === String(columnClienteId));
                    return clienteEncontrado;
                  })
                  .filter((cliente): cliente is ClienteComFormulario => cliente !== undefined && cliente !== null);
              }
              
              // Log para debug
              console.log(`📊 Coluna "${column.nome}" (${statusEsperado || 'customizada'}):`, {
                totalClientes: clientesNaColuna.length,
                nomes: clientesNaColuna.map(c => c.nome),
                totalClientesDisponiveis: allClientes.length,
                modo: statusEsperado ? 'baseado em status' : 'lista manual'
              });
              
              // Filtrar por busca (usa searchQuery passado como prop)
              if (searchQuery) {
                const query = searchQuery.toLowerCase().trim();
                clientesNaColuna = clientesNaColuna.filter(cliente => {
                  const nomeMatch = cliente.nome?.toLowerCase().includes(query);
                  const statusMatch = cliente.status_plano?.toLowerCase().includes(query);
                  const emailMatch = cliente.email?.toLowerCase().includes(query);
                  const telefoneMatch = cliente.telefone?.toLowerCase().includes(query);
                  const whatsappMatch = cliente.whatsapp?.toLowerCase().includes(query);
                  const leadMatch = query.includes('lead') && (cliente as any).is_lead;
                  const herbalifeMatch = query.includes('herbalife') && (cliente as any).status_herbalife;
                  const indicacaoMatch = (cliente as any).indicado_por?.toLowerCase().includes(query);
                  
                  return nomeMatch || statusMatch || emailMatch || telefoneMatch || whatsappMatch || leadMatch || herbalifeMatch || indicacaoMatch;
                });
              }

              return (
                <div
                  key={column.id}
                  className="w-72 flex-shrink-0"
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

                  {/* Botão Adicionar Cliente - Sempre Visível no Topo */}
                  <div className="bg-gray-50 border-b-2 border-gray-200 px-3 py-2">
                    <button
                      onClick={() => {
                        setSelectedColumnForClient(column.id);
                        setShowAddClientModal(true);
                      }}
                      className="w-full px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <span>➕</span>
                      <span>Adicionar Cliente</span>
                    </button>
                  </div>

                  <div className="bg-gray-100 rounded-b-xl p-3 min-h-[200px] lg:min-h-[500px] lg:max-h-[calc(100vh-250px)] overflow-y-auto space-y-3" style={{ maxHeight: '60vh' }}>
                    {clientesNaColuna.length === 0 && !loadingClientes && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-sm">Nenhum cliente nesta coluna</p>
                        <p className="text-xs mt-1">Clique em "Adicionar Cliente" acima</p>
                      </div>
                    )}
                    {clientesNaColuna.map((cliente) => (
                      <div
                        key={cliente.id}
                        draggable
                        onDragStart={() => handleDragStart(cliente.id)}
                        onClick={() => abrirDetalhesCliente(cliente.id)}
                        className="bg-white rounded-lg p-3 md:p-4 shadow-md cursor-move hover:shadow-lg transition-all border-l-4 border-amber-500"
                      >
                        {/* Nome e Bolinhas de Status */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-gray-800 text-sm md:text-base">{cliente.nome}</div>
                          </div>
                          {/* Bolinhas de Identificação */}
                          <div className="flex gap-2 items-center flex-wrap">
                            {/* Status do Programa */}
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded-full ${
                                cliente.status_plano === 'ativo' ? 'bg-green-500' :
                                cliente.status_plano === 'inativo' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`} title={cliente.status_plano}></div>
                              <span className="text-xs text-gray-600">Programa</span>
                            </div>
                            {/* Status Herbalife */}
                            {(cliente as any).status_herbalife && (
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${
                                  (cliente as any).status_herbalife === 'ativo' ? 'bg-blue-500' : 'bg-gray-400'
                                }`} title={(cliente as any).status_herbalife}></div>
                                <span className="text-xs text-gray-600">Herbalife</span>
                              </div>
                            )}
                            {/* Status Lead */}
                            {(cliente as any).is_lead && (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-purple-500" title="Lead"></div>
                                <span className="text-xs text-gray-600">Lead</span>
                              </div>
                            )}
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
          onClose={async (data) => {
            setShowAddClientModal(false);
            setSelectedColumnForClient(null);
            
            // Recarregar clientes e colunas após salvar
            async function reloadData() {
              // Recarregar clientes (se não vierem externos)
              if (clientesExternos === undefined) {
                const clientesData = await getAllClientes();
                setAllClientes(clientesData);
              } else {
                // Se vem externo, notificar o componente pai para recarregar
                onClientesChange?.();
              }
              
              // Recarregar colunas (pode ter mudado se cliente foi adicionado a uma coluna)
              const colunasData = await getKanbanColumns();
              setColumns(colunasData);
            }
            await reloadData();
          }}
          defaultColumn={selectedColumnForClient}
        />
    </div>
  );
}

