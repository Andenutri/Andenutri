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
 * @returns UUID do usuário ou null se não estiver autenticado
 */
export function getCurrentUserIdSync(): string | null {
  try {
    // Tentar obter da sessão armazenada
    const session = supabase.auth.session();
    return session?.user?.id || null;
  } catch (error) {
    return null;
  }
}

