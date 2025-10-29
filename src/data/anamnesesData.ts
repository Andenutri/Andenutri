// Gerenciamento de anamneses personalizadas com Supabase

import { supabase } from '../lib/supabase';

export type CampoType = 'texto' | 'numero' | 'data' | 'select' | 'checkbox' | 'textarea' | 'escala';

export interface CampoAnamnese {
  id: string;
  tipo: CampoType;
  label: string;
  placeholder?: string;
  obrigatorio?: boolean;
  validacao?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  opcoes?: string[]; // Para select e checkbox
  rows?: number; // Para textarea
  min?: number; // Para escala
  max?: number; // Para escala
  labels?: Record<string, string>; // Para escala (ex: {"1": "Sedentário", "10": "Muito ativo"})
}

export interface Anamnese {
  id: string;
  profissional_id?: string;
  nome: string;
  descricao?: string;
  campos: CampoAnamnese[];
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export interface AnamneseResposta {
  id: string;
  anamnese_id: string;
  cliente_id?: string;
  respostas: Record<string, any>; // { campo_id: valor }
  token_acesso?: string;
  data_preenchimento: string;
  data_atualizacao: string;
}

// Buscar todas as anamneses
export async function getAllAnamneses(): Promise<Anamnese[]> {
  try {
    const { data, error } = await supabase
      .from('anamneses')
      .select('*')
      .eq('ativo', true)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar anamneses:', error);
      return [];
    }

    return data?.map(transformAnamnese) || [];
  } catch (error) {
    console.error('Erro ao buscar anamneses:', error);
    return [];
  }
}

// Buscar anamnese por ID
export async function getAnamneseById(id: string): Promise<Anamnese | null> {
  try {
    const { data, error } = await supabase
      .from('anamneses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar anamnese:', error);
      return null;
    }

    return transformAnamnese(data);
  } catch (error) {
    console.error('Erro ao buscar anamnese:', error);
    return null;
  }
}

// Criar nova anamnese
export async function createAnamnese(anamnese: Partial<Anamnese>): Promise<Anamnese | null> {
  try {
    const { data, error } = await supabase
      .from('anamneses')
      .insert({
        nome: anamnese.nome,
        descricao: anamnese.descricao,
        campos: anamnese.campos || [],
        ativo: anamnese.ativo !== undefined ? anamnese.ativo : true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar anamnese:', error);
      return null;
    }

    return transformAnamnese(data);
  } catch (error) {
    console.error('Erro ao criar anamnese:', error);
    return null;
  }
}

// Atualizar anamnese
export async function updateAnamnese(
  id: string,
  anamnese: Partial<Anamnese>
): Promise<Anamnese | null> {
  try {
    const { data, error } = await supabase
      .from('anamneses')
      .update({
        nome: anamnese.nome,
        descricao: anamnese.descricao,
        campos: anamnese.campos,
        ativo: anamnese.ativo,
        data_atualizacao: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar anamnese:', error);
      return null;
    }

    return transformAnamnese(data);
  } catch (error) {
    console.error('Erro ao atualizar anamnese:', error);
    return null;
  }
}

// Deletar anamnese
export async function deleteAnamnese(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('anamneses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar anamnese:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar anamnese:', error);
    return false;
  }
}

// Salvar resposta de anamnese
export async function saveAnamneseResposta(
  resposta: Partial<AnamneseResposta>
): Promise<AnamneseResposta | null> {
  try {
    // Gerar token de acesso único se não fornecido
    const token_acesso = resposta.token_acesso || generateToken();

    const { data, error } = await supabase
      .from('anamneses_respostas')
      .insert({
        anamnese_id: resposta.anamnese_id,
        cliente_id: resposta.cliente_id || null,
        respostas: resposta.respostas || {},
        token_acesso,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar resposta:', error);
      return null;
    }

    return transformResposta(data);
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return null;
  }
}

// Buscar resposta por token
export async function getRespostaByToken(token: string): Promise<AnamneseResposta | null> {
  try {
    const { data, error } = await supabase
      .from('anamneses_respostas')
      .select('*')
      .eq('token_acesso', token)
      .single();

    if (error) {
      console.error('Erro ao buscar resposta:', error);
      return null;
    }

    return transformResposta(data);
  } catch (error) {
    console.error('Erro ao buscar resposta:', error);
    return null;
  }
}

// Buscar respostas de um cliente
export async function getRespostasByCliente(clienteId: string): Promise<AnamneseResposta[]> {
  try {
    const { data, error } = await supabase
      .from('anamneses_respostas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_preenchimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar respostas:', error);
      return [];
    }

    return data?.map(transformResposta) || [];
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return [];
  }
}

// Funções auxiliares
function transformAnamnese(data: any): Anamnese {
  return {
    id: data.id,
    profissional_id: data.profissional_id,
    nome: data.nome,
    descricao: data.descricao,
    campos: data.campos || [],
    ativo: data.ativo !== undefined ? data.ativo : true,
    data_criacao: data.data_criacao,
    data_atualizacao: data.data_atualizacao,
  };
}

function transformResposta(data: any): AnamneseResposta {
  return {
    id: data.id,
    anamnese_id: data.anamnese_id,
    cliente_id: data.cliente_id,
    respostas: data.respostas || {},
    token_acesso: data.token_acesso,
    data_preenchimento: data.data_preenchimento,
    data_atualizacao: data.data_atualizacao,
  };
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

