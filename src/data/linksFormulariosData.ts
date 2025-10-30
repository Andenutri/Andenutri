// Gerenciamento de links de formulário

import { supabase } from '../lib/supabase';

export interface LinkFormulario {
  id: string;
  codigo: string;
  user_id: string;
  nutricionista_nome: string | null;
  ativo: boolean;
  total_submissoes: number;
  criado_em: string;
  atualizado_em: string;
}

// Buscar link por código (público - para validar formulário)
export async function getLinkPorCodigo(codigo: string): Promise<LinkFormulario | null> {
  try {
    const { data, error } = await supabase
      .from('links_formularios')
      .select('*')
      .eq('codigo', codigo.toUpperCase())
      .eq('ativo', true)
      .single();

    if (error) {
      console.error('Erro ao buscar link:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar link:', error);
    return null;
  }
}

// Buscar todos os links do usuário atual
export async function getMeusLinks(): Promise<LinkFormulario[]> {
  try {
    const { getCurrentUserId } = await import('../utils/authHelpers');
    const userId = await getCurrentUserId();

    if (!userId) {
      console.warn('Usuário não autenticado');
      return [];
    }

    const { data, error } = await supabase
      .from('links_formularios')
      .select('*')
      .eq('user_id', userId)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar links:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    return [];
  }
}

// Criar novo link
export async function criarNovoLink(nutricionistaNome?: string): Promise<LinkFormulario | null> {
  try {
    const { getCurrentUserId } = await import('../utils/authHelpers');
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Gerar código único
    const codigo = await gerarCodigoUnico();

    const { data, error } = await supabase
      .from('links_formularios')
      .insert({
        codigo,
        user_id: userId,
        nutricionista_nome: nutricionistaNome || null,
        ativo: true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Erro ao criar link:', error);
    return null;
  }
}

// Gerar código único
async function gerarCodigoUnico(): Promise<string> {
  // Gerar código aleatório de 6-8 caracteres
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  
  // Primeira tentativa: 6 caracteres aleatórios
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  // Verificar se já existe
  const existe = await verificarCodigoExiste(codigo);
  
  if (!existe) {
    return codigo;
  }

  // Se existir, adicionar números até encontrar um único
  let tentativas = 0;
  while (existe && tentativas < 100) {
    codigo = codigo.substring(0, 6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const existeNovo = await verificarCodigoExiste(codigo);
    if (!existeNovo) {
      return codigo;
    }
    tentativas++;
  }

  // Fallback: usar timestamp
  return 'LINK' + Date.now().toString().slice(-6).toUpperCase();
}

async function verificarCodigoExiste(codigo: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('links_formularios')
      .select('id')
      .eq('codigo', codigo)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Atualizar link
export async function atualizarLink(id: string, updates: Partial<LinkFormulario>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('links_formularios')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    return false;
  }
}

// Deletar link
export async function deletarLink(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('links_formularios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar link:', error);
    return false;
  }
}

// Obter URL completa do link
export function getUrlFormulario(codigo: string): string {
  if (typeof window === 'undefined') {
    return `https://andenutri.com/formulario/${codigo}`;
  }
  return `${window.location.origin}/formulario/${codigo}`;
}

