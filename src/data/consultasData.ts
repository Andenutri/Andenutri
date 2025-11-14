// Gerenciamento de consultas com Supabase

// Verifica se está conectado ao Supabase
function isSupabaseConnected(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isUrlValid = Boolean(url && url !== '' && url !== 'https://xxxxx.supabase.co' && url.startsWith('https://'));
  const isKeyValid = Boolean(key && key !== '' && key.startsWith('eyJ'));
  
  return isUrlValid && isKeyValid;
}

// Buscar próxima consulta de um cliente
export async function getProximaConsulta(clienteId: string): Promise<Date | null> {
  if (!isSupabaseConnected() || !clienteId) {
    return null;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Buscar consultas futuras do cliente, ordenadas por data (mais próxima primeiro)
    const { data, error } = await supabase
      .from('consultas')
      .select('data_consulta')
      .eq('cliente_id', clienteId)
      .eq('status', 'agendada')
      .gte('data_consulta', hoje.toISOString())
      .order('data_consulta', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar próxima consulta:', error);
      return null;
    }

    if (!data || !data.data_consulta) {
      return null;
    }

    return new Date(data.data_consulta);
  } catch (error) {
    console.error('Erro ao buscar próxima consulta:', error);
    return null;
  }
}

// Buscar próximas consultas para múltiplos clientes (otimizado)
export async function getProximasConsultas(clientesIds: string[]): Promise<Map<string, Date>> {
  const consultasMap = new Map<string, Date>();
  
  if (!isSupabaseConnected() || clientesIds.length === 0) {
    return consultasMap;
  }

  try {
    const { supabase } = await import('../lib/supabase');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Buscar todas as consultas futuras dos clientes
    const { data, error } = await supabase
      .from('consultas')
      .select('cliente_id, data_consulta')
      .in('cliente_id', clientesIds)
      .eq('status', 'agendada')
      .gte('data_consulta', hoje.toISOString())
      .order('data_consulta', { ascending: true });

    if (error) {
      console.error('Erro ao buscar próximas consultas:', error);
      return consultasMap;
    }

    if (!data || data.length === 0) {
      return consultasMap;
    }

    // Agrupar por cliente_id e pegar apenas a primeira (mais próxima) de cada
    const consultasPorCliente = new Map<string, Date>();
    
    data.forEach((consulta: any) => {
      const clienteId = consulta.cliente_id;
      const dataConsulta = new Date(consulta.data_consulta);
      
      // Se já existe uma consulta para este cliente, manter apenas a mais próxima
      if (!consultasPorCliente.has(clienteId) || 
          (consultasPorCliente.get(clienteId) && consultasPorCliente.get(clienteId)! > dataConsulta)) {
        consultasPorCliente.set(clienteId, dataConsulta);
      }
    });

    return consultasPorCliente;
  } catch (error) {
    console.error('Erro ao buscar próximas consultas:', error);
    return consultasMap;
  }
}

