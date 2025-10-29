// Gerenciamento de ciclos menstruais

import { supabase } from '../lib/supabase';

export interface CicloMenstrual {
  id: string;
  cliente_id: string;
  data_inicio: string;
  data_fim?: string | null;
  duracao_ciclo?: number | null;
  duracao_menstruacao?: number | null;
  intensidade: 'leve' | 'normal' | 'moderada' | 'intensa';
  notas?: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

// Verificar se Supabase está configurado
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && 
    key && 
    url !== '' && 
    key !== '' && 
    url !== 'https://placeholder.supabase.co' &&
    url.startsWith('https://')
  );
}

// Buscar todos os ciclos de um cliente
export async function getCiclosByCliente(clienteId: string): Promise<CicloMenstrual[]> {
  if (!isSupabaseConfigured() || !clienteId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ciclos_menstruais')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_inicio', { ascending: false });

    if (error) {
      console.error('Erro ao buscar ciclos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ciclos:', error);
    return [];
  }
}

// Buscar ciclo atual (mais recente sem data_fim)
export async function getCicloAtual(clienteId: string): Promise<CicloMenstrual | null> {
  if (!isSupabaseConfigured() || !clienteId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('ciclos_menstruais')
      .select('*')
      .eq('cliente_id', clienteId)
      .is('data_fim', null)
      .order('data_inicio', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar ciclo atual:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar ciclo atual:', error);
    return null;
  }
}

// Criar novo ciclo
export async function criarCiclo(ciclo: Partial<CicloMenstrual>): Promise<CicloMenstrual | null> {
  if (!isSupabaseConfigured() || !ciclo.cliente_id || !ciclo.data_inicio) {
    console.error('Dados incompletos para criar ciclo');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('ciclos_menstruais')
      .insert({
        cliente_id: ciclo.cliente_id,
        data_inicio: ciclo.data_inicio,
        data_fim: ciclo.data_fim || null,
        duracao_ciclo: ciclo.duracao_ciclo || null,
        duracao_menstruacao: ciclo.duracao_menstruacao || null,
        intensidade: ciclo.intensidade || 'normal',
        notas: ciclo.notas || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar ciclo:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar ciclo:', error);
    return null;
  }
}

// Atualizar ciclo
export async function atualizarCiclo(
  cicloId: string,
  atualizacoes: Partial<CicloMenstrual>
): Promise<CicloMenstrual | null> {
  if (!isSupabaseConfigured() || !cicloId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('ciclos_menstruais')
      .update(atualizacoes)
      .eq('id', cicloId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar ciclo:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar ciclo:', error);
    return null;
  }
}

// Finalizar ciclo (adicionar data_fim)
export async function finalizarCiclo(cicloId: string, dataFim: string): Promise<CicloMenstrual | null> {
  const ciclo = await atualizarCiclo(cicloId, { data_fim: dataFim });
  
  if (ciclo && ciclo.data_inicio && ciclo.data_fim) {
    // Calcular duração do ciclo automaticamente
    const dataInicio = new Date(ciclo.data_inicio);
    const dataFinal = new Date(ciclo.data_fim);
    const duracao = Math.ceil((dataFinal.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return await atualizarCiclo(cicloId, { duracao_ciclo: duracao });
  }
  
  return ciclo;
}

// Deletar ciclo
export async function deletarCiclo(cicloId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !cicloId) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('ciclos_menstruais')
      .delete()
      .eq('id', cicloId);

    if (error) {
      console.error('Erro ao deletar ciclo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar ciclo:', error);
    return false;
  }
}

// Calcular estatísticas do ciclo
export async function getEstatisticasCiclo(clienteId: string) {
  const ciclos = await getCiclosByCliente(clienteId);
  
  if (ciclos.length === 0) {
    return null;
  }

  const ciclosCompletos = ciclos.filter(c => c.duracao_ciclo);
  const mediaDuracao = ciclosCompletos.length > 0
    ? Math.round(ciclosCompletos.reduce((sum, c) => sum + (c.duracao_ciclo || 0), 0) / ciclosCompletos.length)
    : null;

  const menstruacoes = ciclos.filter(c => c.duracao_menstruacao);
  const mediaMenstruacao = menstruacoes.length > 0
    ? Math.round(menstruacoes.reduce((sum, c) => sum + (c.duracao_menstruacao || 0), 0) / menstruacoes.length)
    : null;

  return {
    totalCiclos: ciclos.length,
    mediaDuracaoCiclo: mediaDuracao,
    mediaDuracaoMenstruacao: mediaMenstruacao,
    ultimoCiclo: ciclos[0],
  };
}

