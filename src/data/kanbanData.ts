// Gerenciamento de colunas Kanban com Supabase

export interface Column {
  id: string;
  nome: string;
  cor: string;
  clientes: string[];
}

interface KanbanColumn {
  id: string;
  nome: string;
  cor: string;
  ordem: number;
  clientes_ids: string[];
  data_criacao?: string;
}

// Verifica se está conectado ao Supabase
export function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isUrlValid = Boolean(url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://'));
  const isKeyValid = Boolean(key && key !== '' && key.startsWith('eyJ'));
  
  return isUrlValid && isKeyValid;
}

// Função para obter colunas do Kanban
export async function getKanbanColumns(): Promise<Column[]> {
  if (!isSupabaseConnected()) {
    // Retornar colunas padrão se não estiver conectado
    return [
      { id: '1', nome: '✅ Ativo', cor: 'green', clientes: [] },
      { id: '2', nome: '❌ Inativo', cor: 'red', clientes: [] },
      { id: '3', nome: '⏸️ Pausado', cor: 'yellow', clientes: [] },
    ];
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.warn('Usuário não autenticado. Retornando colunas padrão.');
      return [
        { id: '1', nome: '✅ Ativo', cor: 'green', clientes: [] },
        { id: '2', nome: '❌ Inativo', cor: 'red', clientes: [] },
        { id: '3', nome: '⏸️ Pausado', cor: 'yellow', clientes: [] },
      ];
    }

    // Filtrar colunas por usuário
    // Primeiro verificar se a coluna user_id existe
    let hasUserIdColumn = false;
    try {
      const { data: testData, error: testError } = await supabase
        .from('kanban_colunas')
        .select('user_id')
        .limit(1);
      
      if (!testError && testData && testData.length > 0 && testData[0] !== null && 'user_id' in testData[0]) {
        hasUserIdColumn = true;
      }
    } catch (error) {
      console.log('Coluna user_id não existe ainda');
    }
    
    // Construir query com filtro se user_id existir
    let query = supabase.from('kanban_colunas').select('*');
    
    if (hasUserIdColumn) {
      query = query.eq('user_id', userId);
    }
    
    query = query.order('ordem', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('📋 Nenhuma coluna encontrada. Criando colunas padrão...');
      // Criar colunas padrão
      const defaultColumns = await createDefaultColumns();
      return defaultColumns;
    }

    // Verificar se há colunas duplicadas e filtrar
    const colunasUnicas = new Map<string, KanbanColumn>();
    for (const col of data) {
      const nomeLower = col.nome.toLowerCase().trim();
      // Se já existe uma coluna com o mesmo nome (case-insensitive), manter apenas a primeira
      const jaExiste = Array.from(colunasUnicas.values()).some(c => 
        c.nome.toLowerCase().trim() === nomeLower
      );
      if (!jaExiste) {
        colunasUnicas.set(col.id, col);
      } else {
        console.log(`⚠️ Coluna duplicada removida: ${col.nome} (ID: ${col.id})`);
      }
    }

    const colunasFiltradas = Array.from(colunasUnicas.values());

    return colunasFiltradas.map(col => ({
      id: col.id,
      nome: col.nome,
      cor: col.cor,
      clientes: col.clientes_ids || [],
    }));
  } catch (error) {
    console.error('Erro ao buscar colunas do Supabase:', error);
    return [
      { id: '1', nome: '✅ Ativo', cor: 'green', clientes: [] },
      { id: '2', nome: '❌ Inativo', cor: 'red', clientes: [] },
      { id: '3', nome: '⏸️ Pausado', cor: 'yellow', clientes: [] },
    ];
  }
}

// Criar colunas padrão
async function createDefaultColumns(): Promise<Column[]> {
  if (!isSupabaseConnected()) return [];

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.warn('Usuário não autenticado. Não é possível criar colunas.');
      return [];
    }

    // Verificar se já existem colunas padrão para evitar duplicação
    const { data: colunasExistentes } = await supabase
      .from('kanban_colunas')
      .select('nome')
      .eq('user_id', userId);
    
    const nomesExistentes = new Set(
      (colunasExistentes || []).map(c => c.nome.toLowerCase().trim())
    );

    const colunasParaCriar = [];
    
    if (!nomesExistentes.has('ativo') && !nomesExistentes.has('✅ ativo')) {
      colunasParaCriar.push({ nome: '✅ Ativo', cor: 'green', ordem: 1, clientes_ids: [], user_id: userId });
    }
    if (!nomesExistentes.has('inativo') && !nomesExistentes.has('❌ inativo')) {
      colunasParaCriar.push({ nome: '❌ Inativo', cor: 'red', ordem: 2, clientes_ids: [], user_id: userId });
    }
    if (!nomesExistentes.has('pausado') && !nomesExistentes.has('⏸️ pausado') && !nomesExistentes.has('⏸ pausado')) {
      colunasParaCriar.push({ nome: '⏸️ Pausado', cor: 'yellow', ordem: 3, clientes_ids: [], user_id: userId });
    }

    if (colunasParaCriar.length === 0) {
      console.log('✅ Colunas padrão já existem. Retornando existentes...');
      // Buscar e retornar colunas existentes
      const { data: dataExistentes, error: errorExistentes } = await supabase
        .from('kanban_colunas')
        .select('*')
        .eq('user_id', userId)
        .order('ordem', { ascending: true });
      
      if (errorExistentes) throw errorExistentes;
      
      return (dataExistentes || []).map(col => ({
        id: col.id,
        nome: col.nome,
        cor: col.cor,
        clientes: col.clientes_ids || [],
      }));
    }

    console.log(`📋 Criando ${colunasParaCriar.length} colunas padrão...`);

    // Criar colunas padrão associadas ao usuário atual
    const { data, error } = await supabase
      .from('kanban_colunas')
      .insert(colunasParaCriar)
      .select();

    if (error) throw error;

    return data.map(col => ({
      id: col.id,
      nome: col.nome,
      cor: col.cor,
      clientes: col.clientes_ids || [],
    }));
  } catch (error) {
    console.error('Erro ao criar colunas padrão:', error);
    return [];
  }
}

// Salvar nova coluna
export async function saveKanbanColumn(column: Omit<KanbanColumn, 'id' | 'data_criacao'>) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado. Não será possível salvar colunas.');
    return column;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      throw new Error('Usuário não autenticado. Não é possível criar colunas.');
    }

    const { data, error } = await supabase
      .from('kanban_colunas')
      .insert({
        nome: column.nome,
        cor: column.cor,
        ordem: column.ordem,
        clientes_ids: column.clientes_ids,
        user_id: userId, // Associar ao usuário atual
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar coluna:', error);
    throw error;
  }
}

// Atualizar coluna
export async function updateKanbanColumn(columnId: string, updates: Partial<KanbanColumn>) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { error } = await supabase
      .from('kanban_colunas')
      .update({
        nome: updates.nome,
        cor: updates.cor,
        ordem: updates.ordem,
        clientes_ids: updates.clientes_ids,
      })
      .eq('id', columnId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar coluna:', error);
    throw error;
  }
}

// Deletar coluna
export async function deleteKanbanColumn(columnId: string) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { error } = await supabase
      .from('kanban_colunas')
      .delete()
      .eq('id', columnId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar coluna:', error);
    throw error;
  }
}

// Adicionar cliente a uma coluna específica
export async function addClientToColumn(columnId: string, clienteId: string) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    
    console.log(`🔍 Tentando adicionar cliente ${clienteId} à coluna ${columnId}`);
    
    // Buscar a coluna atual
    const { data: coluna, error: fetchError } = await supabase
      .from('kanban_colunas')
      .select('clientes_ids, nome')
      .eq('id', columnId)
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar coluna:', fetchError);
      throw fetchError;
    }

    console.log(`📋 Coluna encontrada: ${coluna.nome}, clientes_ids atual:`, coluna.clientes_ids);

    // Normalizar clientes_ids (pode vir como JSONB array ou null)
    let clientesIds: string[] = [];
    if (coluna.clientes_ids) {
      // Se for array, usar diretamente
      if (Array.isArray(coluna.clientes_ids)) {
        clientesIds = coluna.clientes_ids;
      } else {
        // Se não for array, tentar converter
        clientesIds = [];
      }
    }

    // Converter IDs para string para comparação consistente
    const clienteIdStr = String(clienteId);
    const clientesIdsStr = clientesIds.map(id => String(id));
    
    // Verificar se já está na lista (comparação como string)
    if (clientesIdsStr.includes(clienteIdStr)) {
      console.log(`✓ Cliente ${clienteId} já está na coluna ${coluna.nome}`);
      return;
    }

    // Adicionar o cliente
    const novosClientesIds = [...clientesIds, clienteId];
    
    console.log(`💾 Salvando novos clientes_ids:`, novosClientesIds);

    const { error: updateError } = await supabase
      .from('kanban_colunas')
      .update({ clientes_ids: novosClientesIds })
      .eq('id', columnId);

    if (updateError) {
      console.error('❌ Erro ao atualizar coluna:', updateError);
      throw updateError;
    }

    console.log(`✅ Cliente ${clienteId} adicionado à coluna ${coluna.nome} (${columnId})`);
  } catch (error) {
    console.error('❌ Erro ao adicionar cliente à coluna:', error);
    throw error;
  }
}

// Associar clientes existentes automaticamente às colunas baseado no status_plano
export async function associarClientesPorStatus() {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('Usuário não autenticado.');
      return;
    }

    console.log('🔄 Iniciando associação de clientes às colunas...');

    // Buscar todos os clientes do usuário
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('id, nome, status_plano')
      .eq('user_id', userId);

    if (clientesError) {
      console.error('❌ Erro ao buscar clientes:', clientesError);
      throw clientesError;
    }
    
    if (!clientes || clientes.length === 0) {
      console.log('ℹ️ Nenhum cliente encontrado para associar.');
      return;
    }

    console.log(`📊 Encontrados ${clientes.length} clientes para associar.`);

    // Buscar todas as colunas do usuário
    const colunas = await getKanbanColumns();
    
    if (!colunas || colunas.length === 0) {
      console.log('ℹ️ Nenhuma coluna encontrada.');
      return;
    }

    console.log(`📋 Encontradas ${colunas.length} colunas:`, colunas.map(c => c.nome));
    
    // Mapear status para nomes de colunas (mais flexível)
    const statusMap: Record<string, string[]> = {
      'ativo': ['ativo', '✅ ativo'],
      'inativo': ['inativo', '❌ inativo'],
      'pausado': ['pausado', '⏸️ pausado', 'pausa'],
    };

    let clientesAssociados = 0;

    // Para cada cliente, encontrar a coluna correspondente e adicionar
    for (const cliente of clientes) {
      const status = cliente.status_plano?.toLowerCase()?.trim();
      if (!status) {
        console.log(`⚠️ Cliente ${cliente.nome} não tem status_plano definido.`);
        continue;
      }

      const nomesPossiveis = statusMap[status] || [];
      
      if (nomesPossiveis.length === 0) {
        console.log(`⚠️ Status '${status}' não mapeado para nenhuma coluna. Cliente: ${cliente.nome}`);
        continue;
      }
      
      // Encontrar coluna que corresponda ao status (busca mais flexível)
      const colunaCorreta = colunas.find(col => {
        const nomeColunaLower = col.nome.toLowerCase().trim();
        return nomesPossiveis.some(nome => nomeColunaLower.includes(nome.toLowerCase()));
      });

      if (!colunaCorreta) {
        console.log(`⚠️ Nenhuma coluna encontrada para status '${status}'. Cliente: ${cliente.nome}`);
        continue;
      }

      // Verificar se cliente já está nesta coluna
      const clienteIdStr = String(cliente.id);
      const jaEstaNestaColuna = colunaCorreta.clientes.some(id => String(id) === clienteIdStr);
      
      if (jaEstaNestaColuna) {
        console.log(`✓ Cliente ${cliente.nome} já está na coluna ${colunaCorreta.nome}`);
        continue;
      }

      // Verificar se cliente está em OUTRA coluna de status e remover primeiro
      for (const col of colunas) {
        if (col.id !== colunaCorreta.id) {
          const nomeColLower = col.nome.toLowerCase().trim();
          const temStatus = nomeColLower.includes('ativo') || nomeColLower.includes('inativo') || nomeColLower.includes('pausado');
          if (temStatus && col.clientes.some(id => String(id) === clienteIdStr)) {
            // Remover de outra coluna
            try {
              const { supabase } = await import('../lib/supabase');
              const { data: colData } = await supabase
                .from('kanban_colunas')
                .select('clientes_ids')
                .eq('id', col.id)
                .single();
              
              if (colData) {
                const novosIds = (colData.clientes_ids || [])
                  .filter((id: string) => String(id) !== clienteIdStr);
                
                await supabase
                  .from('kanban_colunas')
                  .update({ clientes_ids: novosIds })
                  .eq('id', col.id);
                
                console.log(`🗑️ Cliente ${cliente.nome} removido da coluna ${col.nome}`);
              }
            } catch (error) {
              console.error(`Erro ao remover de ${col.nome}:`, error);
            }
          }
        }
      }

      console.log(`➕ Adicionando cliente ${cliente.nome} (${cliente.id}) à coluna ${colunaCorreta.nome} (${colunaCorreta.id})`);
      
      try {
        await addClientToColumn(colunaCorreta.id, cliente.id);
        clientesAssociados++;
      } catch (error) {
        console.error(`❌ Erro ao adicionar cliente ${cliente.nome} à coluna:`, error);
      }
    }

    console.log(`✅ Processo concluído. ${clientesAssociados} clientes associados às colunas.`);
  } catch (error) {
    console.error('❌ Erro ao associar clientes por status:', error);
    throw error;
  }
}

// Limpar clientes duplicados das colunas de status
// Garante que cada cliente apareça apenas em UMA coluna de status por vez
export async function limparDuplicatasColunasStatus() {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('Usuário não autenticado.');
      return;
    }

    console.log('🧹 Limpando clientes duplicados das colunas...');

    // Buscar todas as colunas do usuário
    const colunas = await getKanbanColumns();
    
    // Identificar colunas de status
    const colunasStatus = colunas.filter(col => {
      const nomeLower = col.nome.toLowerCase().trim();
      return nomeLower.includes('ativo') || nomeLower.includes('inativo') || nomeLower.includes('pausado');
    });

    // Criar mapa: cliente_id -> colunas onde ele aparece
    const clienteParaColunas = new Map<string, string[]>();
    
    colunasStatus.forEach(coluna => {
      coluna.clientes.forEach(clienteId => {
        const idStr = String(clienteId);
        if (!clienteParaColunas.has(idStr)) {
          clienteParaColunas.set(idStr, []);
        }
        clienteParaColunas.get(idStr)!.push(coluna.id);
      });
    });

    // Encontrar duplicatas (clientes em múltiplas colunas de status)
    const duplicatas: Array<{ clienteId: string; colunas: string[] }> = [];
    clienteParaColunas.forEach((colunasIds, clienteId) => {
      if (colunasIds.length > 1) {
        duplicatas.push({ clienteId, colunas: colunasIds });
      }
    });

    if (duplicatas.length === 0) {
      console.log('✅ Nenhuma duplicata encontrada.');
      return;
    }

    console.log(`⚠️ Encontradas ${duplicatas.length} duplicatas. Removendo...`);

    // Para cada duplicata, manter apenas na primeira coluna (ordem alfabética do nome da coluna)
    for (const dup of duplicatas) {
      // Ordenar colunas por nome para manter na primeira
      const colunasOrdenadas = dup.colunas.sort((a, b) => {
        const colA = colunasStatus.find(c => c.id === a);
        const colB = colunasStatus.find(c => c.id === b);
        return (colA?.nome || '').localeCompare(colB?.nome || '');
      });

      const colunaManter = colunasOrdenadas[0];
      const colunasRemover = colunasOrdenadas.slice(1);

      // Remover das outras colunas
      for (const colunaId of colunasRemover) {
        const coluna = colunasStatus.find(c => c.id === colunaId);
        if (coluna) {
          const novosIds = coluna.clientes.filter(id => String(id) !== dup.clienteId);
          
          const { error } = await supabase
            .from('kanban_colunas')
            .update({ clientes_ids: novosIds })
            .eq('id', colunaId);

          if (error) {
            console.error(`❌ Erro ao remover duplicata de ${coluna.nome}:`, error);
          } else {
            console.log(`✅ Cliente ${dup.clienteId} removido da coluna ${coluna.nome}`);
          }
        }
      }
    }

    console.log(`✅ Limpeza concluída! ${duplicatas.length} duplicatas removidas.`);
  } catch (error) {
    console.error('❌ Erro ao limpar duplicatas:', error);
  }
}

// Sincronizar todas as colunas de uma vez
export async function syncAllColumns(columns: Column[]) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado. Colunas serão salvas apenas localmente.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    
    // Deletar todas as colunas existentes
    await supabase.from('kanban_colunas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inserir todas as colunas
    const inserts = columns.map((col, index) => ({
      id: col.id,
      nome: col.nome,
      cor: col.cor,
      ordem: index,
      clientes_ids: col.clientes,
    }));

    const { error } = await supabase
      .from('kanban_colunas')
      .insert(inserts);

    if (error) throw error;
    
    console.log('✅ Colunas sincronizadas com Supabase!');
  } catch (error) {
    console.error('Erro ao sincronizar colunas:', error);
    throw error;
  }
}
