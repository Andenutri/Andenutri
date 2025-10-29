// Helpers para trabalhar com autenticação e user_id

import { supabase } from '@/lib/supabase';

/**
 * Obtém o user_id do usuário atualmente autenticado
 * @returns UUID do usuário ou null se não estiver autenticado
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Erro ao obter user_id:', error);
    return null;
  }
}

/**
 * Obtém o user_id do usuário atualmente autenticado (síncrono via session)
 * Nota: Esta função é assíncrona agora devido à API do Supabase v2
 * @returns UUID do usuário ou null se não estiver autenticado
 */
export async function getCurrentUserIdSync(): Promise<string | null> {
  try {
    // Obter sessão de forma assíncrona (getSession é async no Supabase v2)
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    return null;
  }
}

