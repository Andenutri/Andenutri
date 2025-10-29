// Gerenciamento de sintomas diários

import { supabase } from '../lib/supabase';

export interface SintomasDiarios {
  id: string;
  cliente_id: string;
  data: string;
  
  // Sintomas físicos
  colicas: boolean;
  intensidade_colicas?: number | null;
  dor_cabeca: boolean;
  inchaco: boolean;
  sensibilidade_mamas: boolean;
  dor_lombar: boolean;
  nauseas: boolean;
  
  // Bem-estar emocional
  humor: 'muito-baixo' | 'baixo' | 'normal' | 'bom' | 'muito-bom';
  energia: 'muito-baixa' | 'baixa' | 'media' | 'alta' | 'muito-alta';
  libido: 'muito-baixa' | 'baixa' | 'normal' | 'alta' | 'muito-alta';
  ansiedade?: number | null;
  irritabilidade?: number | null;
  
  // Outros
  qualidade_sono?: number | null;
  apetite?: 'muito-baixo' | 'baixo' | 'normal' | 'alto' | 'muito-alto' | null;
  acne: boolean;
  prisao_ventre: boolean;
  
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

// Buscar sintomas por cliente e data
export async function getSintomasByClienteEData(
  clienteId: string,
  data?: string
): Promise<SintomasDiarios | null> {
  if (!isSupabaseConfigured() || !clienteId) {
    return null;
  }

  const dataBusca = data || new Date().toISOString().split('T')[0];

  try {
    const { data: sintomas, error } = await supabase
      .from('sintomas_diarios')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('data', dataBusca)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar sintomas:', error);
      return null;
    }

    return sintomas;
  } catch (error) {
    console.error('Erro ao buscar sintomas:', error);
    return null;
  }
}

// Buscar sintomas por período
export async function getSintomasByPeriodo(
  clienteId: string,
  dataInicio: string,
  dataFim: string
): Promise<SintomasDiarios[]> {
  if (!isSupabaseConfigured() || !clienteId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('sintomas_diarios')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao buscar sintomas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar sintomas:', error);
    return [];
  }
}

// Salvar ou atualizar sintomas do dia
export async function salvarSintomasDia(
  clienteId: string,
  data: string,
  sintomas: Partial<SintomasDiarios>
): Promise<SintomasDiarios | null> {
  if (!isSupabaseConfigured() || !clienteId || !data) {
    console.error('Dados incompletos para salvar sintomas');
    return null;
  }

  try {
    // Verificar se já existe registro para este dia
    const existente = await getSintomasByClienteEData(clienteId, data);

    if (existente) {
      // Atualizar existente
      const { data: atualizado, error } = await supabase
        .from('sintomas_diarios')
        .update({
          ...sintomas,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', existente.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar sintomas:', error);
        return null;
      }

      return atualizado;
    } else {
      // Criar novo
      const { data: novo, error } = await supabase
        .from('sintomas_diarios')
        .insert({
          cliente_id: clienteId,
          data: data,
          colicas: sintomas.colicas || false,
          intensidade_colicas: sintomas.intensidade_colicas || null,
          dor_cabeca: sintomas.dor_cabeca || false,
          inchaco: sintomas.inchaco || false,
          sensibilidade_mamas: sintomas.sensibilidade_mamas || false,
          dor_lombar: sintomas.dor_lombar || false,
          nauseas: sintomas.nauseas || false,
          humor: sintomas.humor || 'normal',
          energia: sintomas.energia || 'media',
          libido: sintomas.libido || 'normal',
          ansiedade: sintomas.ansiedade || null,
          irritabilidade: sintomas.irritabilidade || null,
          qualidade_sono: sintomas.qualidade_sono || null,
          apetite: sintomas.apetite || null,
          acne: sintomas.acne || false,
          prisao_ventre: sintomas.prisao_ventre || false,
          notas: sintomas.notas || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sintomas:', error);
        return null;
      }

      return novo;
    }
  } catch (error) {
    console.error('Erro ao salvar sintomas:', error);
    return null;
  }
}

// Deletar sintomas do dia
export async function deletarSintomasDia(sintomasId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !sintomasId) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('sintomas_diarios')
      .delete()
      .eq('id', sintomasId);

    if (error) {
      console.error('Erro ao deletar sintomas:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar sintomas:', error);
    return false;
  }
}

// Buscar sintomas dos últimos N dias
export async function getSintomasRecentes(clienteId: string, dias: number = 30): Promise<SintomasDiarios[]> {
  if (!isSupabaseConfigured() || !clienteId) {
    return [];
  }

  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - dias);
  const dataLimiteStr = dataLimite.toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('sintomas_diarios')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('data', dataLimiteStr)
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao buscar sintomas recentes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar sintomas recentes:', error);
    return [];
  }
}

