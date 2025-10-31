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

// Campos válidos na tabela clientes do Supabase
const CAMPOS_VALIDOS_CLIENTES = [
  'id',
  'nome',
  'email',
  'telefone',
  'whatsapp',
  'instagram',
  'pais_telefone',
  'endereco_completo',
  'pais',
  'estado',
  'cidade',
  'status_programa',
  'status_herbalife',
  'status_challenge',
  'herbalife_usuario',
  'herbalife_senha',
  'indicado_por',
  'perfil',
  'is_lead',
  'user_id',
  'codigo_reavaliacao',
  'data_criacao',
  'data_atualizacao',
];

// Remover campos inválidos do objeto cliente antes de enviar ao Supabase
function sanitizarDadosCliente(dados: any): any {
  const dadosLimpos: any = {};
  
  // Primeiro, garantir que column_id e outros campos inválidos sejam removidos
  delete dados.column_id;
  delete dados.status_plano; // Usar status_programa em vez disso
  
  for (const campo of CAMPOS_VALIDOS_CLIENTES) {
    // Ignorar campos undefined e null
    if (campo in dados && dados[campo] !== undefined && dados[campo] !== null) {
      // Para email, se estiver vazio mas nome existe, permitir string vazia (será tratado pelo Supabase)
      if (campo === 'email' && dados[campo] === '' && dados.nome) {
        dadosLimpos[campo] = dados[campo] || null;
      } else if (dados[campo] !== '') {
        // Para outros campos, incluir mesmo se for string vazia (alguns campos podem ser vazios)
        dadosLimpos[campo] = dados[campo];
      } else if (campo === 'nome' || campo === 'email') {
        // Nome e email podem precisar de valores padrão
        dadosLimpos[campo] = dados[campo] || '';
      }
    }
  }
  
  // Garantir novamente que column_id não está presente (segurança extra)
  delete dadosLimpos.column_id;
  
  return dadosLimpos;
}

// Buscar cliente existente antes de criar (evitar duplicados)
async function verificarClienteExistente(
  nome?: string,
  email?: string,
  whatsapp?: string
): Promise<string | null> {
  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Buscar por email (exato)
    if (email) {
      const { data: porEmail } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', userId)
        .eq('email', email)
        .maybeSingle();

      if (porEmail) return porEmail.id;
    }

    // Buscar por whatsapp (normalizado)
    if (whatsapp) {
      const whatsappLimpo = whatsapp.replace(/\D/g, '');
      const { data: todos } = await supabase
        .from('clientes')
        .select('id, whatsapp')
        .eq('user_id', userId)
        .limit(100);

      if (todos) {
        const encontrado = todos.find(c => 
          (c.whatsapp || '').replace(/\D/g, '') === whatsappLimpo && whatsappLimpo.length > 0
        );
        if (encontrado) return encontrado.id;
      }
    }

    // Buscar por nome similar (se não encontrou por email/whatsapp)
    if (nome) {
      const nomeNormalizado = nome.trim().toLowerCase();
      const { data: porNome } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('user_id', userId)
        .ilike('nome', `%${nomeNormalizado}%`)
        .limit(10);

      if (porNome && porNome.length > 0) {
        // Se nome for muito similar, retornar (ex: "Maria Silva" = "Maria Silva Santos")
        const similar = porNome.find(c => 
          c.nome.toLowerCase().trim() === nomeNormalizado ||
          nomeNormalizado.includes(c.nome.toLowerCase().trim()) ||
          c.nome.toLowerCase().trim().includes(nomeNormalizado)
        );
        if (similar) return similar.id;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar cliente existente:', error);
    return null;
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

      // Sanitizar dados antes de atualizar
      const dadosAtualizacao = sanitizarDadosCliente({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        whatsapp: cliente.whatsapp,
        instagram: cliente.instagram,
        status_programa: cliente.status_plano,
        perfil: cliente.perfil || null,
        is_lead: cliente.is_lead || false,
        data_atualizacao: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('clientes')
        .update(dadosAtualizacao)
        .eq('id', cliente.id)
        .eq('user_id', userId) // Garantir que pertence ao usuário
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // ANTES DE CRIAR: Verificar se cliente já existe
      const clienteExistenteId = await verificarClienteExistente(
        cliente.nome,
        cliente.email,
        cliente.whatsapp
      );

      if (clienteExistenteId) {
        // Cliente já existe - ATUALIZAR em vez de criar
        const dadosAtualizacao = sanitizarDadosCliente({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          whatsapp: cliente.whatsapp,
          instagram: cliente.instagram,
          status_programa: cliente.status_plano,
          perfil: cliente.perfil,
          is_lead: cliente.is_lead,
          data_atualizacao: new Date().toISOString(),
        });

        const { data, error } = await supabase
          .from('clientes')
          .update(dadosAtualizacao)
          .eq('id', clienteExistenteId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        
        alert('✅ Cliente atualizado! Encontramos um cliente similar e atualizamos os dados.');
        return data;
      }

      // Validar campos obrigatórios antes de criar
      const erros: string[] = [];
      
      if (!cliente.nome || !cliente.nome.trim()) {
        erros.push('Nome');
      }
      
      if (!cliente.telefone || !cliente.telefone.trim()) {
        erros.push('Telefone');
      }
      
      if (erros.length > 0) {
        const mensagem = `❌ Não é possível salvar o cliente. Campos obrigatórios faltando: ${erros.join(', ')}`;
        throw new Error(mensagem);
      }

      // Criar novo cliente - user_id será preenchido pelo trigger automaticamente
      // Sanitizar dados para remover campos inválidos (como column_id)
      const dadosParaInserir = sanitizarDadosCliente({
        nome: cliente.nome.trim(),
        telefone: cliente.telefone.trim(),
        email: cliente.email?.trim() || null, // Opcional
        whatsapp: cliente.whatsapp?.trim() || null, // Opcional
        instagram: cliente.instagram?.trim() || null, // Opcional
        status_programa: cliente.status_plano || 'ativo',
        perfil: cliente.perfil || null,
        is_lead: cliente.is_lead || false,
        user_id: userId, // Associar ao usuário atual
        data_criacao: new Date().toISOString(),
      });
      
      const { data, error } = await supabase
        .from('clientes')
        .insert(dadosParaInserir)
        .select()
        .single();

      if (error) throw error;
      
      alert('✅ Cliente salvo com sucesso no Supabase!');
      return data;
    }
  } catch (error: any) {
    console.error('Erro ao salvar no Supabase:', error);
    
    // Mostrar mensagem específica se for erro de validação
    if (error?.message && (error.message.includes('obrigatório') || error.message.includes('Campos obrigatórios'))) {
      alert(error.message);
    } else if (error?.message) {
      alert(`❌ Erro ao salvar: ${error.message}`);
    } else {
      alert('❌ Erro ao salvar no Supabase. Verifique o console para mais detalhes.');
    }
    
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

