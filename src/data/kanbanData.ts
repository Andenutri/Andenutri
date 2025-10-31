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
    let query = supabase
      .from('kanban_colunas')
      .select('*');
    
    // Sempre filtrar por user_id se existir a coluna (usando RPC para verificar schema dinamicamente)
    // Tentar filtrar por user_id - se falhar, significa que a coluna não existe ainda
    query = query.order('ordem', { ascending: true });
    
    // Tentar filtrar por user_id (pode falhar se coluna não existir)
    try {
      const { data: testData } = await supabase
        .from('kanban_colunas')
        .select('user_id')
        .limit(1);
      
      if (testData && testData.length > 0 && 'user_id' in testData[0]) {
        query = query.eq('user_id', userId);
      }
    } catch (error) {
      // Se não existir coluna user_id, continuar sem filtro
      console.log('Coluna user_id não existe ainda, retornando todas as colunas');
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      // Criar colunas padrão
      const defaultColumns = await createDefaultColumns();
      return defaultColumns;
    }

    return data.map(col => ({
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

    // Criar colunas padrão associadas ao usuário atual
    const { data, error } = await supabase
      .from('kanban_colunas')
      .insert([
        { nome: '✅ Ativo', cor: 'green', ordem: 1, clientes_ids: [], user_id: userId },
        { nome: '❌ Inativo', cor: 'red', ordem: 2, clientes_ids: [], user_id: userId },
        { nome: '⏸️ Pausado', cor: 'yellow', ordem: 3, clientes_ids: [], user_id: userId },
      ])
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
    
    // Buscar a coluna atual
    const { data: coluna, error: fetchError } = await supabase
      .from('kanban_colunas')
      .select('clientes_ids')
      .eq('id', columnId)
      .single();

    if (fetchError) throw fetchError;

    // Adicionar o cliente se ainda não estiver na lista
    const clientesIds = coluna.clientes_ids || [];
    if (!clientesIds.includes(clienteId)) {
      const novosClientesIds = [...clientesIds, clienteId];
      
      const { error: updateError } = await supabase
        .from('kanban_colunas')
        .update({ clientes_ids: novosClientesIds })
        .eq('id', columnId);

      if (updateError) throw updateError;
      console.log(`✅ Cliente ${clienteId} adicionado à coluna ${columnId}`);
    }
  } catch (error) {
    console.error('Erro ao adicionar cliente à coluna:', error);
    throw error;
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

