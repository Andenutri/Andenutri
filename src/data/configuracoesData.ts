// Gerenciamento de configurações de branding

import { supabase } from '../lib/supabase';

export interface ConfiguracaoProfissional {
  id: string;
  profissional_id?: string;
  logo_url?: string;
  nome_profissional?: string;
  nome_empresa?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  instagram?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  site?: string;
  cores_tema?: {
    primaria?: string;
    secundaria?: string;
    destaque?: string;
    fundo?: string;
  };
  assinatura_digital?: string;
  ativo: boolean;
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

// Buscar configuração atual
export async function getConfiguracaoAtual(): Promise<ConfiguracaoProfissional | null> {
  // Se Supabase não estiver configurado, retornar configuração padrão
  if (!isSupabaseConfigured()) {
    return {
      id: '',
      ativo: true,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from('configuracoes_profissional')
      .select('*')
      .eq('ativo', true)
      .order('data_atualizacao', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = nenhum resultado encontrado (não é erro)
      console.error('Erro ao buscar configuração:', error);
      return {
        id: '',
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      };
    }

    if (!data) {
      // Retornar configuração padrão vazia
      return {
        id: '',
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      };
    }

    return transformConfiguracao(data);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return {
      id: '',
      ativo: true,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    };
  }
}

// Salvar ou atualizar configuração
export async function saveConfiguracao(
  configuracao: Partial<ConfiguracaoProfissional>
): Promise<ConfiguracaoProfissional | null> {
  try {
    // Verificar se já existe uma configuração ativa
    const existente = await getConfiguracaoAtual();

    if (existente?.id) {
      // Atualizar existente
      const { data, error } = await supabase
        .from('configuracoes_profissional')
        .update({
          ...configuracao,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', existente.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar configuração:', error);
        return null;
      }

      return transformConfiguracao(data);
    } else {
      // Criar nova
      const { data, error } = await supabase
        .from('configuracoes_profissional')
        .insert({
          ...configuracao,
          ativo: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar configuração:', error);
        return null;
      }

      return transformConfiguracao(data);
    }
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return null;
  }
}

// Upload de logo para Supabase Storage
export async function uploadLogo(file: File): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `logo_${timestamp}_${file.name}`;
    const filePath = `branding/${fileName}`;

    const { data, error } = await supabase.storage
      .from('client-photos') // Reutilizando o bucket existente, ou criar bucket 'branding'
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Erro ao fazer upload do logo:', error);
      return null;
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('client-photos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload do logo:', error);
    return null;
  }
}

// Função auxiliar
function transformConfiguracao(data: any): ConfiguracaoProfissional {
  return {
    id: data.id,
    profissional_id: data.profissional_id,
    logo_url: data.logo_url,
    nome_profissional: data.nome_profissional,
    nome_empresa: data.nome_empresa,
    email: data.email,
    telefone: data.telefone,
    whatsapp: data.whatsapp,
    instagram: data.instagram,
    endereco: data.endereco,
    cidade: data.cidade,
    estado: data.estado,
    cep: data.cep,
    site: data.site,
    cores_tema: data.cores_tema || {},
    assinatura_digital: data.assinatura_digital,
    ativo: data.ativo !== undefined ? data.ativo : true,
    data_criacao: data.data_criacao,
    data_atualizacao: data.data_atualizacao,
  };
}

