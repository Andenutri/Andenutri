// Gerenciamento de tracking de menopausa

import { supabase } from '../lib/supabase';

export interface MenopausaTracking {
  id: string;
  cliente_id: string;
  data: string;
  
  ondas_calor: boolean;
  intensidade_ondas_calor?: number | null;
  frequencia_ondas_calor?: string | null;
  
  suores_noturnos: boolean;
  intensidade_suores?: number | null;
  
  disturbios_sono: boolean;
  qualidade_sono?: number | null;
  
  mudancas_humor: boolean;
  intensidade_humor?: number | null;
  
  secura_vaginal: boolean;
  intensidade_secura?: number | null;
  
  fadiga: boolean;
  intensidade_fadiga?: number | null;
  
  ansiedade: boolean;
  intensidade_ansiedade?: number | null;
  
  irritabilidade: boolean;
  intensidade_irritabilidade?: number | null;
  
  esquecimento: boolean;
  dores_articulacoes: boolean;
  ganho_peso: boolean;
  perda_cabelo: boolean;
  
  terapia_hormonal: boolean;
  suplementos?: string | null;
  medicamentos?: string | null;
  
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

// Buscar tracking por cliente e data
export async function getMenopausaByClienteEData(
  clienteId: string,
  data?: string
): Promise<MenopausaTracking | null> {
  if (!isSupabaseConfigured() || !clienteId) {
    return null;
  }

  const dataBusca = data || new Date().toISOString().split('T')[0];

  try {
    const { data: tracking, error } = await supabase
      .from('menopausa_tracking')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('data', dataBusca)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar tracking menopausa:', error);
      return null;
    }

    return tracking;
  } catch (error) {
    console.error('Erro ao buscar tracking menopausa:', error);
    return null;
  }
}

// Buscar tracking por período
export async function getMenopausaByPeriodo(
  clienteId: string,
  dataInicio: string,
  dataFim: string
): Promise<MenopausaTracking[]> {
  if (!isSupabaseConfigured() || !clienteId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('menopausa_tracking')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tracking menopausa:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar tracking menopausa:', error);
    return [];
  }
}

// Salvar ou atualizar tracking do dia
export async function salvarMenopausaDia(
  clienteId: string,
  data: string,
  tracking: Partial<MenopausaTracking>
): Promise<MenopausaTracking | null> {
  if (!isSupabaseConfigured() || !clienteId || !data) {
    console.error('Dados incompletos para salvar tracking menopausa');
    return null;
  }

  try {
    // Verificar se já existe registro para este dia
    const existente = await getMenopausaByClienteEData(clienteId, data);

    if (existente) {
      // Atualizar existente
      const { data: atualizado, error } = await supabase
        .from('menopausa_tracking')
        .update({
          ...tracking,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', existente.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tracking menopausa:', error);
        return null;
      }

      return atualizado;
    } else {
      // Criar novo
      const { data: novo, error } = await supabase
        .from('menopausa_tracking')
        .insert({
          cliente_id: clienteId,
          data: data,
          ondas_calor: tracking.ondas_calor || false,
          intensidade_ondas_calor: tracking.intensidade_ondas_calor || null,
          frequencia_ondas_calor: tracking.frequencia_ondas_calor || null,
          suores_noturnos: tracking.suores_noturnos || false,
          intensidade_suores: tracking.intensidade_suores || null,
          disturbios_sono: tracking.disturbios_sono || false,
          qualidade_sono: tracking.qualidade_sono || null,
          mudancas_humor: tracking.mudancas_humor || false,
          intensidade_humor: tracking.intensidade_humor || null,
          secura_vaginal: tracking.secura_vaginal || false,
          intensidade_secura: tracking.intensidade_secura || null,
          fadiga: tracking.fadiga || false,
          intensidade_fadiga: tracking.intensidade_fadiga || null,
          ansiedade: tracking.ansiedade || false,
          intensidade_ansiedade: tracking.intensidade_ansiedade || null,
          irritabilidade: tracking.irritabilidade || false,
          intensidade_irritabilidade: tracking.intensidade_irritabilidade || null,
          esquecimento: tracking.esquecimento || false,
          dores_articulacoes: tracking.dores_articulacoes || false,
          ganho_peso: tracking.ganho_peso || false,
          perda_cabelo: tracking.perda_cabelo || false,
          terapia_hormonal: tracking.terapia_hormonal || false,
          suplementos: tracking.suplementos || null,
          medicamentos: tracking.medicamentos || null,
          notas: tracking.notas || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tracking menopausa:', error);
        return null;
      }

      return novo;
    }
  } catch (error) {
    console.error('Erro ao salvar tracking menopausa:', error);
    return null;
  }
}

// Deletar tracking
export async function deletarMenopausaTracking(trackingId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !trackingId) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('menopausa_tracking')
      .delete()
      .eq('id', trackingId);

    if (error) {
      console.error('Erro ao deletar tracking menopausa:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar tracking menopausa:', error);
    return false;
  }
}

