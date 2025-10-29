// Gerenciamento de fotos com Supabase Storage

import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'client-photos';

// Tipo de foto
export type PhotoType = 'frente' | 'lateral' | 'costa' | 'outra';

export interface PhotoInfo {
  id: string;
  cliente_id: string;
  avaliacao_id?: string;
  tipo: PhotoType;
  url: string;
  data_upload: string;
}

// Upload de foto
export async function uploadPhoto(
  clienteId: string,
  avaliacaoId: string | null,
  file: File,
  tipo: PhotoType
): Promise<string | null> {
  try {
    // Criar path único
    const timestamp = Date.now();
    const fileName = `${tipo}_${timestamp}_${file.name}`;
    const filePath = avaliacaoId
      ? `clientes/${clienteId}/avaliacoes/${avaliacaoId}/${fileName}`
      : `clientes/${clienteId}/${fileName}`;

    // Fazer upload
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

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }
}

// Buscar todas as fotos de um cliente
export async function getPhotosByCliente(clienteId: string): Promise<PhotoInfo[]> {
  try {
    // Listar arquivos no storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`clientes/${clienteId}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Erro ao buscar fotos:', error);
      return [];
    }

    // Converter para formato PhotoInfo
    const photos: PhotoInfo[] = [];
    
    // Função recursiva para listar subpastas
    const listRecursive = async (path: string) => {
      const { data: folderData } = await supabase.storage
        .from(BUCKET_NAME)
        .list(path);

      if (folderData) {
        for (const item of folderData) {
          if (item.id === null) {
            // É uma pasta, listar recursivamente
            await listRecursive(`${path}/${item.name}`);
          } else {
            // É um arquivo
            const { data: urlData } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`${path}/${item.name}`);

            // Extrair tipo do nome do arquivo
            let tipo: PhotoType = 'outra';
            if (item.name.includes('frente')) tipo = 'frente';
            else if (item.name.includes('lateral')) tipo = 'lateral';
            else if (item.name.includes('costa')) tipo = 'costa';

            photos.push({
              id: item.id || item.name,
              cliente_id: clienteId,
              tipo,
              url: urlData.publicUrl,
              data_upload: item.created_at || new Date().toISOString(),
            });
          }
        }
      }
    };

    await listRecursive(`clientes/${clienteId}`);

    return photos.sort((a, b) => 
      new Date(b.data_upload).getTime() - new Date(a.data_upload).getTime()
    );
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    return [];
  }
}

// Deletar foto
export async function deletePhoto(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return false;
  }
}

// Verificar se o bucket existe, criar se não existir
export async function ensureBucketExists(): Promise<boolean> {
  try {
    // Tentar listar buckets
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Erro ao listar buckets:', error);
      return false;
    }

    // Verificar se bucket existe
    const bucketExists = data?.some(bucket => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      // Criar bucket (nota: criação de bucket requer permissões admin)
      console.warn(`Bucket ${BUCKET_NAME} não existe. Crie manualmente no Supabase Dashboard > Storage.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar bucket:', error);
    return false;
  }
}

