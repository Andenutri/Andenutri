// Gerenciamento de fotos de antes/depois dos clientes

import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../utils/authHelpers';

const BUCKET_NAME = 'client-photos';

export type TipoFoto = 'antes' | 'depois';
export type PosicaoFoto = 'frente' | 'lateral' | 'costa' | 'outra';

export interface FotoCliente {
  id: string;
  cliente_id: string;
  user_id: string;
  url: string;
  tipo: TipoFoto;
  posicao: PosicaoFoto;
  data_foto: string; // YYYY-MM-DD
  anotacao?: string | null;
  ordem: number;
  data_criacao: string;
  data_atualizacao: string;
}

// Upload de foto para o storage
export async function uploadFotoStorage(
  clienteId: string,
  file: File,
  tipo: TipoFoto,
  posicao: PosicaoFoto
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `${tipo}_${posicao}_${timestamp}_${file.name}`;
    const filePath = `clientes/${clienteId}/progresso/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }
}

// Salvar foto no banco de dados
export async function saveFotoCliente(
  foto: Partial<FotoCliente> & { cliente_id: string; url: string; tipo: TipoFoto; data_foto: string }
): Promise<FotoCliente | null> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  const dataToSave = {
    ...foto,
    user_id: userId,
    posicao: foto.posicao || 'frente',
    ordem: foto.ordem || 0,
    data_atualizacao: new Date().toISOString(),
  };

  if (foto.id) {
    // Update
    const { data, error } = await supabase
      .from('fotos_clientes')
      .update(dataToSave)
      .eq('id', foto.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert
    const { data, error } = await supabase
      .from('fotos_clientes')
      .insert(dataToSave)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Buscar todas as fotos de um cliente
export async function getFotosByCliente(clienteId: string): Promise<FotoCliente[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('fotos_clientes')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('user_id', userId)
    .order('data_foto', { ascending: false })
    .order('tipo', { ascending: true })
    .order('posicao', { ascending: true })
    .order('ordem', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Deletar foto
export async function deleteFotoCliente(fotoId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  // Buscar foto para obter URL e deletar do storage
  const { data: foto, error: fetchError } = await supabase
    .from('fotos_clientes')
    .select('url')
    .eq('id', fotoId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !foto) {
    throw new Error('Foto não encontrada.');
  }

  // Extrair path do storage da URL
  try {
    const urlObj = new URL(foto.url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(p => p === BUCKET_NAME);
    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);
    }
  } catch (error) {
    console.warn('Erro ao deletar do storage (continuando):', error);
  }

  // Deletar do banco
  const { error } = await supabase
    .from('fotos_clientes')
    .delete()
    .eq('id', fotoId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}

// Buscar fotos agrupadas por tipo e posição
export async function getFotosAgrupadas(clienteId: string): Promise<{
  antes: Record<PosicaoFoto, FotoCliente[]>;
  depois: Record<PosicaoFoto, FotoCliente[]>;
}> {
  const fotos = await getFotosByCliente(clienteId);
  
  const agrupadas = {
    antes: {
      frente: [] as FotoCliente[],
      lateral: [] as FotoCliente[],
      costa: [] as FotoCliente[],
      outra: [] as FotoCliente[],
    },
    depois: {
      frente: [] as FotoCliente[],
      lateral: [] as FotoCliente[],
      costa: [] as FotoCliente[],
      outra: [] as FotoCliente[],
    },
  };

  fotos.forEach(foto => {
    agrupadas[foto.tipo][foto.posicao].push(foto);
  });

  // Ordenar por data e ordem
  Object.keys(agrupadas.antes).forEach(pos => {
    agrupadas.antes[pos as PosicaoFoto].sort((a, b) => {
      const dataCompare = new Date(b.data_foto).getTime() - new Date(a.data_foto).getTime();
      if (dataCompare !== 0) return dataCompare;
      return a.ordem - b.ordem;
    });
  });

  Object.keys(agrupadas.depois).forEach(pos => {
    agrupadas.depois[pos as PosicaoFoto].sort((a, b) => {
      const dataCompare = new Date(b.data_foto).getTime() - new Date(a.data_foto).getTime();
      if (dataCompare !== 0) return dataCompare;
      return a.ordem - b.ordem;
    });
  });

  return agrupadas;
}

