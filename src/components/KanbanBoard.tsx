'use client';

import { useState, useEffect } from 'react';
import { getAllClientes, ClienteComFormulario, deleteCliente } from '@/data/clientesData';
import AddClientModal from './AddClientModal';
import ClientDetailsModal from './ClientDetailsModal';
import EditarInformacoesBasicasModal from './EditarInformacoesBasicasModal';
import { syncAllColumns, Column, getKanbanColumns, saveKanbanColumn, associarClientesPorStatus, limparDuplicatasColunasStatus } from '@/data/kanbanData';
import { calcularVencimentoPrograma, obterStatusVencimento } from '@/utils/calcularVencimento';

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
  const [showEditarBasicasModal, setShowEditarBasicasModal] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<ClienteComFormulario | null>(null);
  const [ordenacaoPorColuna, setOrdenacaoPorColuna] = useState<Record<string, 'alfabetica' | 'alfabetica_inversa' | 'vencimento_proximo' | 'vencimento_distante' | 'compra_recente' | 'compra_antiga' | 'proxima_consulta' | 'criacao_recente' | 'criacao_antiga'>>({});

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
      const clientesParaAssociar = clientesExternos || allClientes;
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
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null); // Para feedback visual ao arrastar cliente
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

  // Drag and Drop de CLIENTES (cards)
  const handleDragStart = (clienteId: string) => {
    setDraggedItem(clienteId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: string) => {
    if (!draggedItem) return;
    
    const clienteIdStr = String(draggedItem);
    console.log(`🔄 [DRAG DROP] Movendo cliente ${clienteIdStr} para coluna ${columnId}`);
    
    // Guardar estado anterior para possível reversão
    const colunasAnteriores = [...columns];
    
    // Atualizar estado local imediatamente para feedback visual
    const newColumns = columns.map(col => {
      const clientesSemDragged = col.clientes.filter(id => String(id) !== clienteIdStr);
      if (col.id === columnId) {
        // Verificar se já não está na lista antes de adicionar
        const jaEstaNaColuna = clientesSemDragged.some(id => String(id) === clienteIdStr);
        if (!jaEstaNaColuna) {
          return { ...col, clientes: [...clientesSemDragged, draggedItem] };
        }
        return { ...col, clientes: clientesSemDragged };
      }
      return { ...col, clientes: clientesSemDragged };
    });
    
    setColumns(newColumns);
    
    // Salvar no Supabase - operação atômica
    try {
      const { addClientToColumn, removeClientFromColumn, getKanbanColumns } = await import('@/data/kanbanData');
      
      // PASSO 1: Buscar todas as colunas do Supabase (estado atual)
      console.log(`📋 [DRAG DROP] Buscando colunas do Supabase...`);
      const todasColunas = await getKanbanColumns();
      console.log(`📋 [DRAG DROP] Encontradas ${todasColunas.length} colunas`);
      
      // PASSO 2: Remover de TODAS as colunas (exceto a destino)
      console.log(`🗑️ [DRAG DROP] Removendo cliente de todas as colunas...`);
      const remocoes = todasColunas.map(async (col) => {
        const clienteEstaNaColuna = col.clientes.some(id => String(id) === clienteIdStr);
        if (clienteEstaNaColuna && col.id !== columnId) {
          console.log(`🗑️ [DRAG DROP] Removendo de ${col.nome} (${col.id})`);
          await removeClientFromColumn(col.id, draggedItem);
        }
      });
      
      await Promise.all(remocoes);
      console.log(`✅ [DRAG DROP] Remoções concluídas`);
      
      // PASSO 3: Aguardar um pouco para garantir que as remoções foram processadas
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // PASSO 4: Buscar coluna destino NOVAMENTE para ter dados atualizados
      const colunasAtualizadas = await getKanbanColumns();
      const colunaDestino = colunasAtualizadas.find(col => col.id === columnId);
      
      if (!colunaDestino) {
        throw new Error(`Coluna destino ${columnId} não encontrada`);
      }
      
      // PASSO 4.5: Determinar status baseado no nome da coluna
      const nomeColunaLower = colunaDestino.nome.toLowerCase().trim();
      let novoStatus: string | null = null;
      
      if (nomeColunaLower.includes('ativo')) {
        novoStatus = 'ativo';
      } else if (nomeColunaLower.includes('inativo')) {
        novoStatus = 'inativo';
      } else if (nomeColunaLower.includes('pausado') || nomeColunaLower.includes('pausa')) {
        novoStatus = 'pausado';
      }
      
      // PASSO 5: Atualizar status_plano do cliente se a coluna determina status
      if (novoStatus) {
        console.log(`🔄 [DRAG DROP] Atualizando status_plano do cliente para "${novoStatus}" (determinado pela coluna "${colunaDestino.nome}")`);
        try {
          const { supabase } = await import('../lib/supabase');
          const { error: statusError } = await supabase
            .from('clientes')
            .update({ status_plano: novoStatus })
            .eq('id', draggedItem);
          
          if (statusError) {
            console.error('❌ [DRAG DROP] Erro ao atualizar status_plano:', statusError);
          } else {
            console.log(`✅ [DRAG DROP] Status_plano atualizado para "${novoStatus}"`);
          }
        } catch (error) {
          console.error('❌ [DRAG DROP] Erro ao atualizar status:', error);
        }
      }
      
      // PASSO 6: Verificar se cliente já está na coluna destino (com dados atualizados)
      const jaEstaNaColunaDestino = colunaDestino.clientes.some(id => String(id) === clienteIdStr);
      
      if (!jaEstaNaColunaDestino) {
        console.log(`➕ [DRAG DROP] Adicionando cliente ${clienteIdStr} à coluna ${colunaDestino.nome}`);
        await addClientToColumn(columnId, draggedItem);
        
        // Aguardar um pouco para garantir que a adição foi processada
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        console.log(`✓ [DRAG DROP] Cliente ${clienteIdStr} já está na coluna destino`);
      }
      
      // PASSO 7: Recarregar colunas do Supabase para garantir sincronização completa
      console.log(`🔄 [DRAG DROP] Recarregando colunas do Supabase...`);
      const colunasFinais = await getKanbanColumns();
      
      // Verificar se a operação foi bem-sucedida
      const colunaDestinoFinal = colunasFinais.find(col => col.id === columnId);
      const clienteEstaNaColunaFinal = colunaDestinoFinal?.clientes.some(id => String(id) === clienteIdStr) || false;
      
      if (clienteEstaNaColunaFinal) {
        console.log(`✅ [DRAG DROP] Cliente ${clienteIdStr} movido com sucesso para ${colunaDestinoFinal?.nome}`);
        setColumns(colunasFinais);
        
        // Recarregar clientes para atualizar status_plano na lista
        if (clientesExternos === undefined) {
          const { getAllClientes } = await import('@/data/clientesData');
          const clientesAtualizados = await getAllClientes();
          setAllClientes(clientesAtualizados);
        } else {
          // Notificar componente pai para recarregar
          onClientesChange?.();
        }
      } else {
        console.error(`❌ [DRAG DROP] Cliente não encontrado na coluna destino após operação!`);
        // Tentar novamente
        const colunasRetry = await getKanbanColumns();
        setColumns(colunasRetry);
      }
      
    } catch (error) {
      console.error('❌ [DRAG DROP] Erro ao salvar mudança de coluna:', error);
      // Reverter estado em caso de erro
      console.log(`🔄 [DRAG DROP] Revertendo estado...`);
      try {
        const { getKanbanColumns } = await import('@/data/kanbanData');
        const colunasRecarregadas = await getKanbanColumns();
        setColumns(colunasRecarregadas);
      } catch (reloadError) {
        console.error('❌ [DRAG DROP] Erro ao recarregar colunas:', reloadError);
        setColumns(colunasAnteriores);
      }
    }
    
    setDraggedItem(null);
  };

  // Drag and Drop de COLUNAS (reordenar)
  const handleColumnDragStart = (columnId: string, e: React.DragEvent) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleColumnDragOver = (columnId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleColumnDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleColumnDrop = async (targetColumnId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    // Reordenar colunas
    const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      return;
    }

    const newColumns = [...columns];
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);

    // Atualizar ordem no array
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      ordem: index
    }));

    setColumns(updatedColumns);

    // Salvar nova ordem no Supabase
    try {
      const { updateKanbanColumn } = await import('@/data/kanbanData');
      await Promise.all(
        updatedColumns.map((col, index) =>
          updateKanbanColumn(col.id, { ordem: index })
        )
      );
      console.log('✅ Ordem das colunas salva no Supabase');
    } catch (error) {
      console.error('Erro ao salvar ordem das colunas:', error);
      // Reverter em caso de erro
      setColumns(columns);
    }

    setDraggedColumn(null);
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

  const handleExcluirCliente = async (clienteId: string) => {
    try {
      const sucesso = await deleteCliente(clienteId);
      if (sucesso) {
        // Remover do estado local
        setAllClientes(prev => prev.filter(c => c.id !== clienteId));
        
        // Notificar componente pai para recarregar
        if (onClientesChange) {
          onClientesChange();
        }
        
        // Recarregar colunas para remover o cliente das colunas
        const colunasAtualizadas = await getKanbanColumns();
        setColumns(colunasAtualizadas);
        
        alert('✅ Cliente excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('❌ Erro ao excluir cliente. Verifique o console.');
    }
  };

  const getClienteById = (id: string) => {
    return allClientes.find(c => c.id === id);
  };

  const getCoresByColumn = (colorId: string) => {
    return cores.find(c => c.id === colorId) || cores[7];
  };

  // Função para ordenar clientes
  const ordenarClientes = (clientes: ClienteComFormulario[], columnId: string): ClienteComFormulario[] => {
    const clientesOrdenados = [...clientes];
    const ordenacao = ordenacaoPorColuna[columnId] || 'alfabetica';

    switch (ordenacao) {
      case 'alfabetica':
        return clientesOrdenados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      
      case 'alfabetica_inversa':
        return clientesOrdenados.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
      
      case 'vencimento_proximo':
        return clientesOrdenados.sort((a, b) => {
          const vencA = calcularVencimentoPrograma((a as any).data_compra_programa, (a as any).duracao_programa_dias);
          const vencB = calcularVencimentoPrograma((b as any).data_compra_programa, (b as any).duracao_programa_dias);
          const timeA = vencA ? vencA.getTime() : Infinity;
          const timeB = vencB ? vencB.getTime() : Infinity;
          return timeA - timeB; // Mais próximo primeiro
        });
      
      case 'vencimento_distante':
        return clientesOrdenados.sort((a, b) => {
          const vencA = calcularVencimentoPrograma((a as any).data_compra_programa, (a as any).duracao_programa_dias);
          const vencB = calcularVencimentoPrograma((b as any).data_compra_programa, (b as any).duracao_programa_dias);
          const timeA = vencA ? vencA.getTime() : 0;
          const timeB = vencB ? vencB.getTime() : 0;
          return timeB - timeA; // Mais distante primeiro
        });
      
      case 'compra_recente':
        return clientesOrdenados.sort((a, b) => {
          const dataA = (a as any).data_compra_programa 
            ? new Date((a as any).data_compra_programa).getTime()
            : 0;
          const dataB = (b as any).data_compra_programa 
            ? new Date((b as any).data_compra_programa).getTime()
            : 0;
          return dataB - dataA; // Mais recente primeiro
        });
      
      case 'compra_antiga':
        return clientesOrdenados.sort((a, b) => {
          const dataA = (a as any).data_compra_programa 
            ? new Date((a as any).data_compra_programa).getTime()
            : Infinity;
          const dataB = (b as any).data_compra_programa 
            ? new Date((b as any).data_compra_programa).getTime()
            : Infinity;
          return dataA - dataB; // Mais antiga primeiro
        });
      
      case 'proxima_consulta':
        return clientesOrdenados.sort((a, b) => {
          const dataA = (a as any).data_proxima_consulta 
            ? new Date((a as any).data_proxima_consulta).getTime()
            : Infinity;
          const dataB = (b as any).data_proxima_consulta 
            ? new Date((b as any).data_proxima_consulta).getTime()
            : Infinity;
          return dataA - dataB; // Mais próxima primeiro
        });
      
      case 'criacao_recente':
        return clientesOrdenados.sort((a, b) => {
          const dataA = (a as any).data_criacao 
            ? new Date((a as any).data_criacao).getTime()
            : 0;
          const dataB = (b as any).data_criacao 
            ? new Date((b as any).data_criacao).getTime()
            : 0;
          return dataB - dataA; // Mais recente primeiro
        });
      
      case 'criacao_antiga':
        return clientesOrdenados.sort((a, b) => {
          const dataA = (a as any).data_criacao 
            ? new Date((a as any).data_criacao).getTime()
            : Infinity;
          const dataB = (b as any).data_criacao 
            ? new Date((b as any).data_criacao).getTime()
            : Infinity;
          return dataA - dataB; // Mais antiga primeiro
        });
      
      default:
        return clientesOrdenados;
    }
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
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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

              // REGRA: A COLUNA DETERMINA O STATUS DO CLIENTE
              // Mostrar APENAS clientes que estão explicitamente na coluna (column.clientes)
              // A coluna define o status, não o contrário
              const clientesNaColuna = column.clientes
                .map(columnClienteId => {
                  const clienteEncontrado = allClientes.find(c => String(c.id) === String(columnClienteId));
                  return clienteEncontrado;
                })
                .filter((cliente): cliente is ClienteComFormulario => cliente !== undefined && cliente !== null);
              
              // Criar versão dos clientes com status atualizado baseado na coluna
              const clientesComStatusDaColuna = clientesNaColuna.map(cliente => {
                // Se a coluna tem um status, criar uma cópia do cliente com status atualizado
                if (statusEsperado) {
                  return {
                    ...cliente,
                    status_plano: statusEsperado as 'ativo' | 'inativo' | 'pausado', // Status determinado pela coluna
                    // Para exibição: mostrar status da coluna, não do cliente
                  };
                }
                return cliente;
              });
              
              // Log para debug
              console.log(`📊 Coluna "${column.nome}" (${statusEsperado || 'customizada'}):`, {
                totalClientes: clientesComStatusDaColuna.length,
                nomes: clientesComStatusDaColuna.map(c => c.nome),
                statusDeterminado: statusEsperado || 'nenhum',
                modo: 'A COLUNA DETERMINA O STATUS'
              });
              
              // Filtrar por busca (usa searchQuery passado como prop)
              let clientesFiltrados = clientesComStatusDaColuna;
              if (searchQuery) {
                const query = searchQuery.toLowerCase().trim();
                clientesFiltrados = clientesComStatusDaColuna.filter(cliente => {
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
              
              // Ordenar clientes filtrados (por coluna)
              const clientesOrdenados = ordenarClientes(clientesFiltrados, column.id);
              
              // Usar clientes ordenados para renderização
              const clientesParaRenderizar = clientesOrdenados;

              const isDraggingColumn = draggedColumn === column.id;
              const isDragOver = dragOverColumn === column.id;
              const isDragOverClient = dragOverColumnId === column.id && draggedItem; // Feedback visual para drag de cliente

              return (
                <div
                  key={column.id}
                  className={`w-72 flex-shrink-0 transition-all ${
                    isDraggingColumn ? 'opacity-50 scale-95' : ''
                  } ${
                    isDragOver ? 'transform translate-x-2' : ''
                  } ${
                    isDragOverClient ? 'ring-2 ring-amber-500 bg-amber-50' : ''
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragOver(e);
                    handleColumnDragOver(column.id, e);
                    // Feedback visual para drag de cliente
                    if (draggedItem && !draggedColumn) {
                      setDragOverColumnId(column.id);
                    }
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    handleColumnDragLeave();
                    // Limpar feedback visual
                    if (draggedItem && !draggedColumn) {
                      setDragOverColumnId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverColumnId(null); // Limpar feedback visual
                    // Verificar se é drop de coluna ou cliente
                    if (draggedColumn) {
                      handleColumnDrop(column.id, e);
                    } else if (draggedItem) {
                      handleDrop(column.id);
                    }
                  }}
                >
                  <div 
                    draggable
                    onDragStart={(e) => handleColumnDragStart(column.id, e)}
                    className={`${classeCor.classe} rounded-t-xl px-3 py-2 md:px-4 md:py-3 border-2 font-bold flex items-center justify-between mb-3 cursor-move hover:shadow-lg transition-all ${
                      isDraggingColumn ? 'ring-2 ring-amber-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">↕️</span>
                      <span className="text-sm md:text-base">{column.nome} ({column.clientes.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={ordenacaoPorColuna[column.id] || 'alfabetica'}
                        onChange={(e) => {
                          setOrdenacaoPorColuna({
                            ...ordenacaoPorColuna,
                            [column.id]: e.target.value as any
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 bg-white/80 rounded border border-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                        title="Ordenar clientes desta coluna"
                      >
                        <option value="alfabetica">📝 A-Z</option>
                        <option value="alfabetica_inversa">📝 Z-A</option>
                        <option value="vencimento_proximo">⏰ Venc. próximo</option>
                        <option value="vencimento_distante">⏰ Venc. distante</option>
                        <option value="compra_recente">📅 Compra recente</option>
                        <option value="compra_antiga">📅 Compra antiga</option>
                        <option value="proxima_consulta">📆 Próx. consulta</option>
                        <option value="criacao_recente">🆕 Criado recente</option>
                        <option value="criacao_antiga">🆕 Criado antigo</option>
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removerColuna(column.id);
                        }}
                        className="text-xs hover:bg-white/30 px-2 py-1 rounded"
                      >
                        🗑️
                      </button>
                    </div>
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
                    {clientesParaRenderizar.length === 0 && !loadingClientes && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-sm">Nenhum cliente nesta coluna</p>
                        <p className="text-xs mt-1">Clique em "Adicionar Cliente" acima</p>
                      </div>
                    )}
                    {clientesParaRenderizar.map((cliente) => {
                      // Status para exibição: usar o status da coluna, não do cliente
                      const statusParaExibir = statusEsperado || cliente.status_plano || 'ativo';
                      
                      return (
                        <div
                          key={cliente.id}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            handleDragStart(cliente.id);
                          }}
                          onDragEnd={() => {
                            // Limpar estado quando drag termina
                            setDraggedItem(null);
                          }}
                          onClick={(e) => {
                            // Só abrir detalhes se não foi um drag
                            if (!draggedItem) {
                              abrirDetalhesCliente(cliente.id);
                            }
                          }}
                          className="bg-white rounded-lg p-3 md:p-4 shadow-md cursor-move hover:shadow-lg transition-all border-l-4 border-amber-500"
                          style={{ userSelect: 'none' }}
                        >
                        {/* Nome e Bolinhas de Status */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-gray-800 text-sm md:text-base flex-1">{cliente.nome}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`⚠️ Tem certeza que deseja excluir o cliente "${cliente.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
                                  handleExcluirCliente(cliente.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-lg font-bold ml-2"
                              title="Excluir cliente"
                            >
                              ×
                            </button>
                          </div>
                          {/* Bolinhas de Identificação */}
                          <div className="flex gap-2 items-center flex-wrap">
                            {/* Status do Programa - determinado pela coluna */}
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded-full ${
                                statusParaExibir === 'ativo' ? 'bg-green-500' :
                                statusParaExibir === 'inativo' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`} title={`Status: ${statusParaExibir} (determinado pela coluna "${column.nome}")`}></div>
                              <span className="text-xs text-gray-600">Programa: {statusParaExibir}</span>
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
                          {(cliente as any).data_proxima_consulta && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <span>📅 Próxima consulta:</span>
                              <span className="font-semibold">{new Date((cliente as any).data_proxima_consulta).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                          {(cliente as any).data_compra_programa && (() => {
                            const vencimento = calcularVencimentoPrograma(
                              (cliente as any).data_compra_programa,
                              (cliente as any).duracao_programa_dias
                            );
                            const status = obterStatusVencimento(vencimento);
                            return vencimento ? (
                              <div className={`flex items-center gap-1 font-semibold ${status.cor}`}>
                                <span>📅 Vence:</span>
                                <span>{vencimento.toLocaleDateString('pt-BR')}</span>
                                {(cliente as any).duracao_programa_dias && (cliente as any).duracao_programa_dias !== 90 && (
                                  <span className="text-xs ml-1">({(cliente as any).duracao_programa_dias} dias)</span>
                                )}
                              </div>
                            ) : null;
                          })()}
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t my-2"></div>
                        
                        {/* Observações Personalizadas */}
                        <div className="text-xs text-gray-500 mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold text-gray-700">📝 Observações:</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setClienteParaEditar(cliente);
                                setShowEditarBasicasModal(true);
                              }}
                              className="text-amber-600 hover:text-amber-700 text-xs font-semibold px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                              title="Editar observações"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                          <div className="max-h-20 overflow-y-auto text-xs whitespace-pre-wrap">
                            {(cliente as any).perfil && (cliente as any).perfil.trim() ? (
                              (cliente as any).perfil
                            ) : (
                              <span className="text-gray-400 italic">Nenhuma observação adicionada ainda. Clique em "Editar" para adicionar.</span>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })}
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

      {/* Modal Editar Informações Básicas (para editar observações) */}
      {showEditarBasicasModal && clienteParaEditar && (
        <EditarInformacoesBasicasModal
          isOpen={showEditarBasicasModal}
          onClose={async () => {
            setShowEditarBasicasModal(false);
            setClienteParaEditar(null);
            // Recarregar clientes após edição
            if (clientesExternos === undefined) {
              const clientesAtualizados = await getAllClientes();
              setAllClientes(clientesAtualizados);
            } else {
              onClientesChange?.();
            }
          }}
          cliente={clienteParaEditar}
        />
      )}
    </div>
  );
}

