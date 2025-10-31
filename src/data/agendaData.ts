// Gerenciamento de eventos da agenda com Supabase

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  hora: string;
  cliente: string;
  tipo: 'consulta' | 'reavaliacao' | 'follow-up' | 'outro';
  cor: string;
  lembrete?: string;
  notificado?: boolean;
}

// Verifica se está conectado ao Supabase
export function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isUrlValid = Boolean(url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://'));
  const isKeyValid = Boolean(key && key !== '' && key.startsWith('eyJ'));
  
  return isUrlValid && isKeyValid;
}

// Obter todos os eventos
export async function getAllEventos(): Promise<Evento[]> {
  if (!isSupabaseConnected()) {
    return [];
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('eventos_agenda')
      .select('*')
      .order('data_evento', { ascending: true });

    if (error) throw error;

    return (data || []).map(evento => ({
      id: evento.id,
      titulo: evento.titulo,
      descricao: evento.descricao || '',
      data: new Date(evento.data_evento),
      hora: evento.hora_evento || '',
      cliente: evento.cliente_nome || '',
      tipo: evento.tipo_evento as Evento['tipo'],
      cor: evento.cor || 'blue',
      lembrete: evento.lembrete || '',
      notificado: evento.notificado || false,
    }));
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}

// Salvar novo evento
export async function saveEvento(evento: Omit<Evento, 'id'>, clienteId?: string) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return null;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { getCurrentUserId } = await import('../utils/authHelpers');
    
    const userId = await getCurrentUserId();
    
    const eventoData: any = {
      titulo: evento.titulo,
      descricao: evento.descricao,
      data_evento: evento.data.toISOString(),
      hora_evento: evento.hora,
      cliente_nome: evento.cliente,
      tipo_evento: evento.tipo,
      cor: evento.cor,
      lembrete: evento.lembrete,
      status: 'agendado',
    };

    // Adicionar cliente_id se fornecido
    if (clienteId) {
      eventoData.cliente_id = clienteId;
    }

    // Adicionar user_id se disponível
    if (userId) {
      eventoData.user_id = userId;
    }

    const { data, error } = await supabase
      .from('eventos_agenda')
      .insert(eventoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    throw error;
  }
}

// Atualizar evento
export async function updateEvento(eventoId: string, updates: Partial<Evento>) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const updateData: any = {};

    if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
    if (updates.data !== undefined) updateData.data_evento = updates.data.toISOString();
    if (updates.hora !== undefined) updateData.hora_evento = updates.hora;
    if (updates.cliente !== undefined) updateData.cliente_nome = updates.cliente;
    if (updates.tipo !== undefined) updateData.tipo_evento = updates.tipo;
    if (updates.cor !== undefined) updateData.cor = updates.cor;
    if (updates.lembrete !== undefined) updateData.lembrete = updates.lembrete;
    if (updates.notificado !== undefined) updateData.notificado = updates.notificado;

    const { error } = await supabase
      .from('eventos_agenda')
      .update(updateData)
      .eq('id', eventoId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
}

// Deletar evento
export async function deleteEvento(eventoId: string) {
  if (!isSupabaseConnected()) {
    console.warn('⚠️ Supabase não configurado.');
    return;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const { error } = await supabase
      .from('eventos_agenda')
      .delete()
      .eq('id', eventoId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    throw error;
  }
}

