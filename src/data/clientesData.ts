// Gerenciamento de dados de clientes com Supabase

import { ClienteComFormulario } from './mockClientes';

// Re-exportar o tipo para facilitar importações
export type { ClienteComFormulario };

// Verifica se está conectado ao Supabase
export function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Verificar se as variáveis existem e são válidas
  const isUrlValid = Boolean(url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://'));
  const isKeyValid = Boolean(key && key !== '' && key.startsWith('eyJ'));
  
  return isUrlValid && isKeyValid;
}

// Função para obter todos os clientes (mock, localStorage ou Supabase)
export async function getAllClientes(): Promise<ClienteComFormulario[]> {
  // Se não estiver conectado ao Supabase, busca do localStorage
  if (!isSupabaseConnected()) {
    // Tentar buscar do localStorage
    const clientesLocal = typeof window !== 'undefined' ? localStorage.getItem('clientes') : null;
    
    if (clientesLocal) {
      try {
        const clientesParsed = JSON.parse(clientesLocal);
        // Mesclar com mock data para garantir que há dados
        const { mockClientes } = await import('./mockClientes');
        // Retorna clientes do localStorage primeiro, depois mock
        return [...clientesParsed, ...mockClientes];
      } catch (error) {
        console.error('Erro ao parsear localStorage:', error);
      }
    }
    
    // Retorna apenas mock se não houver localStorage
    const { mockClientes } = await import('./mockClientes');
    return mockClientes;
  }

  // Buscar do Supabase - FILTRADO POR USER_ID
  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      // Se não houver usuário autenticado, retornar vazio
      console.warn('Usuário não autenticado. Retornando lista vazia.');
      return [];
    }

    // Buscar apenas clientes do usuário atual
    let query = supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .order('data_criacao', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar clientes do Supabase:', error);
      // Retorna vazio em caso de erro (não mock, para garantir isolamento)
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao importar Supabase:', error);
    return [];
  }
}

// Função para criar/atualizar cliente
export async function saveCliente(cliente: Partial<ClienteComFormulario>) {
  // Se não estiver conectado ao Supabase, permite salvar localmente
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado. Salvando localmente.');
    
    // Salvar em localStorage como fallback
    const clientesLocal = localStorage.getItem('clientes');
    const clientesList = clientesLocal ? JSON.parse(clientesLocal) : [];
    
    if (cliente.id) {
      // Atualizar existente
      const index = clientesList.findIndex((c: any) => c.id === cliente.id);
      if (index >= 0) {
        clientesList[index] = { ...clientesList[index], ...cliente };
      }
    } else {
      // Novo cliente
      const novoCliente = {
        id: Date.now().toString(),
        ...cliente,
        data_criacao: new Date().toISOString(),
      };
      clientesList.push(novoCliente);
    }
    
    localStorage.setItem('clientes', JSON.stringify(clientesList));
    alert('✅ Cliente salvo localmente! Configure o Supabase para sincronização permanente.\n\nVeja: CONFIGURAR_SUPABASE.txt');
    return cliente;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      alert('❌ Você precisa estar autenticado para salvar clientes.');
      return null;
    }
    
    if (cliente.id) {
      // Atualizar cliente existente - verificar se pertence ao usuário
      const { data: existingCliente, error: fetchError } = await supabase
        .from('clientes')
        .select('user_id')
        .eq('id', cliente.id)
        .single();

      if (fetchError || existingCliente?.user_id !== userId) {
        alert('❌ Você não tem permissão para editar este cliente.');
        return null;
      }

      const { data, error } = await supabase
        .from('clientes')
        .update({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          whatsapp: cliente.whatsapp,
          instagram: cliente.instagram,
          status_programa: cliente.status_plano,
          perfil: cliente.perfil || null,
          is_lead: cliente.is_lead || false,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', cliente.id)
        .eq('user_id', userId) // Garantir que pertence ao usuário
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Criar novo cliente - user_id será preenchido pelo trigger automaticamente
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          nome: cliente.nome,
          email: cliente.email || '',
          telefone: cliente.telefone || '',
          whatsapp: cliente.whatsapp || '',
          instagram: cliente.instagram || '',
          status_programa: cliente.status_plano || 'ativo',
          perfil: cliente.perfil || null,
          is_lead: cliente.is_lead || false,
          column_id: cliente.column_id || null,
          user_id: userId, // Associar ao usuário atual
          data_criacao: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      alert('✅ Cliente salvo com sucesso no Supabase!');
      return data;
    }
  } catch (error) {
    console.error('Erro ao salvar no Supabase:', error);
    alert('❌ Erro ao salvar no Supabase. Verifique o console.');
    return null;
  }
}

// Função para buscar cliente por ID
export async function getClienteById(id: string): Promise<ClienteComFormulario | undefined> {
  if (!isSupabaseConnected()) {
    const { getClienteById } = await import('./mockClientes');
    return getClienteById(id);
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.warn('Usuário não autenticado. Não é possível buscar cliente.');
      return undefined;
    }

    // Buscar apenas se pertencer ao usuário atual
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Filtrar por usuário
      .single();

    if (error) {
      // PGRST116 = nenhum resultado encontrado
      if (error.code === 'PGRST116') {
        console.warn('Cliente não encontrado ou não pertence ao usuário atual');
        return undefined;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return undefined;
  }
}

