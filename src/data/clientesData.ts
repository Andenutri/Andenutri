// Gerenciamento de dados de clientes com Supabase

import { ClienteComFormulario } from './mockClientes';

// Verifica se está conectado ao Supabase
export function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Verificar se as variáveis existem e são válidas
  const isUrlValid = url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://');
  const isKeyValid = key && key !== '' && key.startsWith('eyJ');
  
  return isUrlValid && isKeyValid;
}

// Função para obter todos os clientes (mock ou Supabase)
export async function getAllClientes(): Promise<ClienteComFormulario[]> {
  // Se não estiver conectado ao Supabase, retorna mock data
  if (!isSupabaseConnected()) {
    const { mockClientes } = await import('./mockClientes');
    return mockClientes;
  }

  // Buscar do Supabase
  try {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar clientes do Supabase:', error);
      // Retorna mock como fallback
      const { mockClientes } = await import('./mockClientes');
      return mockClientes;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao importar Supabase:', error);
    const { mockClientes } = await import('./mockClientes');
    return mockClientes;
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
    
    if (cliente.id) {
      // Atualizar cliente existente
      const { data, error } = await supabase
        .from('clientes')
        .update({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          whatsapp: cliente.whatsapp,
          instagram: cliente.instagram,
          status_programa: cliente.status_plano,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', cliente.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Criar novo cliente
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          nome: cliente.nome,
          email: cliente.email || '',
          telefone: cliente.telefone || '',
          whatsapp: cliente.whatsapp || '',
          instagram: cliente.instagram || '',
          status_programa: cliente.status_plano || 'ativo',
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
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return undefined;
  }
}

