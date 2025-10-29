// Gerenciamento de avaliações físicas com Supabase

import { supabase } from '../lib/supabase';

export interface AvaliacaoFisica {
  id: string;
  cliente_id: string;
  data_avaliacao: string;
  peso: number | null;
  altura: number | null;
  percentual_gordura: number | null;
  percentual_musculo: number | null;
  gordura_visceral: number | null;
  metabolismo_basal: number | null;
  busto: number | null;
  cintura: number | null;
  barriga: number | null;
  quadril: number | null;
  coxa: number | null;
  braco: number | null;
  pescoco: number | null;
  observacoes: string | null;
  tipo_avaliacao: 'inicial' | 'reavaliacao' | 'final';
  data_criacao: string;
}

// Buscar todas as avaliações de um cliente
export async function getAvaliacoesByCliente(clienteId: string): Promise<AvaliacaoFisica[]> {
  try {
    const { data, error } = await supabase
      .from('avaliacoes_fisicas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_avaliacao', { ascending: true }); // Mais antiga primeiro

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return [];
  }
}

// Criar nova avaliação física
export async function createAvaliacaoFisica(avaliacao: Partial<AvaliacaoFisica>): Promise<AvaliacaoFisica | null> {
  try {
    const { data, error } = await supabase
      .from('avaliacoes_fisicas')
      .insert(avaliacao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar avaliação:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return null;
  }
}

// Atualizar avaliação física
export async function updateAvaliacaoFisica(
  id: string,
  avaliacao: Partial<AvaliacaoFisica>
): Promise<AvaliacaoFisica | null> {
  try {
    const { data, error } = await supabase
      .from('avaliacoes_fisicas')
      .update({ ...avaliacao, data_atualizacao: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar avaliação:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return null;
  }
}

// Deletar avaliação física
export async function deleteAvaliacaoFisica(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('avaliacoes_fisicas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar avaliação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return false;
  }
}

