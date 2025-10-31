// Funções para salvar avaliações emocionais e comportamentais no Supabase

import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../utils/authHelpers';

export interface AvaliacaoEmocional {
  id?: string;
  cliente_id: string;
  user_id?: string;
  historia_pessoa?: string;
  momento_mudanca?: string;
  incomoda_espelho?: string;
  situacao_corpo?: string;
  atrapalha_dia_dia?: string;
  maior_medo?: string;
  por_que_eliminar_kilos?: string;
  tentou_antes?: string;
  oque_fara_peso_desejado?: string;
  tres_motivos?: string;
  nivel_comprometimento?: number;
  conselho_si?: string;
  data_criacao?: string;
}

export interface AvaliacaoComportamental {
  id?: string;
  cliente_id: string;
  user_id?: string;
  ponto_fraco_alimentacao?: string;
  organizada_ou_improvisa?: string;
  come_por_que?: string;
  momentos_dificeis?: string;
  prazer_alem_comida?: string;
  premia_com_comida?: string;
  data_criacao?: string;
}

// Salvar avaliação emocional
export async function salvarAvaliacaoEmocional(
  avaliacao: Partial<AvaliacaoEmocional>
): Promise<{ success: boolean; error?: string; data?: AvaliacaoEmocional }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const { data, error } = await supabase
      .from('avaliacoes_emocionais')
      .insert({
        cliente_id: avaliacao.cliente_id,
        user_id: userId,
        historia_pessoa: avaliacao.historia_pessoa || null,
        momento_mudanca: avaliacao.momento_mudanca || null,
        incomoda_espelho: avaliacao.incomoda_espelho || null,
        situacao_corpo: avaliacao.situacao_corpo || null,
        atrapalha_dia_dia: avaliacao.atrapalha_dia_dia || null,
        maior_medo: avaliacao.maior_medo || null,
        por_que_eliminar_kilos: avaliacao.por_que_eliminar_kilos || null,
        tentou_antes: avaliacao.tentou_antes || null,
        oque_fara_peso_desejado: avaliacao.oque_fara_peso_desejado || null,
        tres_motivos: avaliacao.tres_motivos || null,
        nivel_comprometimento: avaliacao.nivel_comprometimento !== undefined ? parseInt(String(avaliacao.nivel_comprometimento)) : 0,
        conselho_si: avaliacao.conselho_si || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message || 'Erro ao salvar avaliação emocional' };
    }

    return { success: true, data: data as AvaliacaoEmocional };
  } catch (error: any) {
    console.error('Erro ao salvar avaliação emocional:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

// Salvar avaliação comportamental
export async function salvarAvaliacaoComportamental(
  avaliacao: Partial<AvaliacaoComportamental>
): Promise<{ success: boolean; error?: string; data?: AvaliacaoComportamental }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const { data, error } = await supabase
      .from('avaliacoes_comportamentais')
      .insert({
        cliente_id: avaliacao.cliente_id,
        user_id: userId,
        ponto_fraco_alimentacao: avaliacao.ponto_fraco_alimentacao || null,
        organizada_ou_improvisa: avaliacao.organizada_ou_improvisa || null,
        come_por_que: avaliacao.come_por_que || null,
        momentos_dificeis: avaliacao.momentos_dificeis || null,
        prazer_alem_comida: avaliacao.prazer_alem_comida || null,
        premia_com_comida: avaliacao.premia_com_comida || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message || 'Erro ao salvar avaliação comportamental' };
    }

    return { success: true, data: data as AvaliacaoComportamental };
  } catch (error: any) {
    console.error('Erro ao salvar avaliação comportamental:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

// Buscar avaliações emocionais de um cliente
export async function getAvaliacoesEmocionaisCliente(
  clienteId: string
): Promise<AvaliacaoEmocional[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('avaliacoes_emocionais')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('user_id', userId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações emocionais:', error);
      return [];
    }

    return (data || []) as AvaliacaoEmocional[];
  } catch (error) {
    console.error('Erro ao buscar avaliações emocionais:', error);
    return [];
  }
}

// Buscar avaliações comportamentais de um cliente
export async function getAvaliacoesComportamentaisCliente(
  clienteId: string
): Promise<AvaliacaoComportamental[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('avaliacoes_comportamentais')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('user_id', userId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações comportamentais:', error);
      return [];
    }

    return (data || []) as AvaliacaoComportamental[];
  } catch (error) {
    console.error('Erro ao buscar avaliações comportamentais:', error);
    return [];
  }
}

