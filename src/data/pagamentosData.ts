// Gerenciamento de pagamentos com Supabase

export interface Pagamento {
  id: string;
  cliente_id: string;
  user_id?: string;
  valor: number;
  forma_pagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'transferencia' | 'boleto' | 'outro';
  data_pagamento: string;
  observacoes?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

// Verifica se está conectado ao Supabase
function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isUrlValid = Boolean(url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://'));
  const isKeyValid = Boolean(key && key !== '' && key.startsWith('eyJ'));
  
  return isUrlValid && isKeyValid;
}

// Buscar todos os pagamentos do usuário
export async function getAllPagamentos(): Promise<Pagamento[]> {
  if (!isSupabaseConnected()) {
    return [];
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('user_id', userId)
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return [];
  }
}

// Buscar pagamentos de um cliente específico
export async function getPagamentosByCliente(clienteId: string): Promise<Pagamento[]> {
  if (!isSupabaseConnected() || !clienteId) {
    return [];
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('user_id', userId)
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pagamentos do cliente:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pagamentos do cliente:', error);
    return [];
  }
}

// Criar novo pagamento
export async function createPagamento(pagamento: Omit<Pagamento, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Pagamento | null> {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return null;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      alert('❌ Você precisa estar autenticado para criar pagamentos.');
      return null;
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .insert({
        ...pagamento,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error);
    alert(`❌ Erro ao criar pagamento: ${error.message}`);
    return null;
  }
}

// Atualizar pagamento
export async function updatePagamento(pagamentoId: string, updates: Partial<Pagamento>): Promise<Pagamento | null> {
  if (!isSupabaseConnected()) {
    return null;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .update(updates)
      .eq('id', pagamentoId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Erro ao atualizar pagamento:', error);
    alert(`❌ Erro ao atualizar pagamento: ${error.message}`);
    return null;
  }
}

// Deletar pagamento
export async function deletePagamento(pagamentoId: string): Promise<boolean> {
  if (!isSupabaseConnected()) {
    return false;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return false;
    }

    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', pagamentoId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Erro ao deletar pagamento:', error);
    alert(`❌ Erro ao deletar pagamento: ${error.message}`);
    return false;
  }
}

// Buscar pagamentos filtrados por período
export async function getPagamentosByPeriodo(
  dataInicio?: string,
  dataFim?: string,
  mes?: number,
  ano?: number
): Promise<Pagamento[]> {
  if (!isSupabaseConnected()) {
    return [];
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    let query = supabase
      .from('pagamentos')
      .select('*')
      .eq('user_id', userId);

    // Filtrar por período específico
    if (dataInicio && dataFim) {
      query = query.gte('data_pagamento', dataInicio).lte('data_pagamento', dataFim);
    } else if (mes && ano) {
      // Filtrar por mês/ano
      const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0];
      query = query.gte('data_pagamento', primeiroDia).lte('data_pagamento', ultimoDia);
    } else if (ano) {
      // Filtrar por ano
      const primeiroDia = `${ano}-01-01`;
      const ultimoDia = `${ano}-12-31`;
      query = query.gte('data_pagamento', primeiroDia).lte('data_pagamento', ultimoDia);
    }

    const { data, error } = await query.order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pagamentos por período:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pagamentos por período:', error);
    return [];
  }
}

// Calcular total de pagamentos
export function calcularTotalPagamentos(pagamentos: Pagamento[]): number {
  return pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor), 0);
}

// Formas de pagamento disponíveis
export const FORMAS_PAGAMENTO = [
  { value: 'dinheiro', label: '💵 Dinheiro' },
  { value: 'pix', label: '📱 PIX' },
  { value: 'cartao_credito', label: '💳 Cartão de Crédito' },
  { value: 'cartao_debito', label: '💳 Cartão de Débito' },
  { value: 'transferencia', label: '🏦 Transferência Bancária' },
  { value: 'boleto', label: '📄 Boleto' },
  { value: 'outro', label: '🔖 Outro' },
];

