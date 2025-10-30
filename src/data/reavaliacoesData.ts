// Gerenciamento de reavaliações

import { supabase } from '../lib/supabase';

export interface ReavaliacaoResposta {
  id?: string;
  cliente_id: string;
  user_id: string;
  peso_atual?: string;
  mudancas_corpo_disposicao?: string;
  energia_dia?: string;
  intestino_sono?: string;
  rotina_alimentacao_organizada?: string;
  refeicoes_faceis?: string;
  refeicoes_desafiadoras?: string;
  agua_suplementos?: string;
  atividade_fisica?: string;
  o_que_ajudou?: string;
  o_que_atrapalhou?: string;
  programa_ajudou?: string;
  programa_ajudar_mais?: string;
  mudar_estrategia?: string;
  maior_foco_nova_fase?: string;
  data_preenchimento?: string;
  data_criacao?: string;
}

// Buscar cliente por código de reavaliação
export async function buscarClientePorCodigoReavaliacao(
  codigo: string
): Promise<{ id: string; nome: string; codigo_reavaliacao: string } | null> {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome, codigo_reavaliacao')
      .eq('codigo_reavaliacao', codigo.toUpperCase())
      .single();

    if (error || !data) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  }
}

// Salvar resposta de reavaliação
export async function salvarReavaliacao(
  clienteId: string,
  userId: string,
  respostas: Partial<ReavaliacaoResposta>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('reavaliacoes_respostas').insert({
      cliente_id: clienteId,
      user_id: userId,
      peso_atual: respostas.peso_atual || null,
      mudancas_corpo_disposicao: respostas.mudancas_corpo_disposicao || null,
      energia_dia: respostas.energia_dia || null,
      intestino_sono: respostas.intestino_sono || null,
      rotina_alimentacao_organizada: respostas.rotina_alimentacao_organizada || null,
      refeicoes_faceis: respostas.refeicoes_faceis || null,
      refeicoes_desafiadoras: respostas.refeicoes_desafiadoras || null,
      agua_suplementos: respostas.agua_suplementos || null,
      atividade_fisica: respostas.atividade_fisica || null,
      o_que_ajudou: respostas.o_que_ajudou || null,
      o_que_atrapalhou: respostas.o_que_atrapalhou || null,
      programa_ajudou: respostas.programa_ajudou || null,
      programa_ajudar_mais: respostas.programa_ajudar_mais || null,
      mudar_estrategia: respostas.mudar_estrategia || null,
      maior_foco_nova_fase: respostas.maior_foco_nova_fase || null,
      data_preenchimento: new Date().toISOString(),
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erro ao salvar reavaliação',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao salvar reavaliação:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    };
  }
}

// Buscar reavaliações de um cliente
export async function getReavaliacoesCliente(
  clienteId: string
): Promise<ReavaliacaoResposta[]> {
  try {
    const { data, error } = await supabase
      .from('reavaliacoes_respostas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_preenchimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar reavaliações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar reavaliações:', error);
    return [];
  }
}

// Obter última reavaliação de um cliente
export async function getUltimaReavaliacao(
  clienteId: string
): Promise<ReavaliacaoResposta | null> {
  try {
    const { data, error } = await supabase
      .from('reavaliacoes_respostas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_preenchimento', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

