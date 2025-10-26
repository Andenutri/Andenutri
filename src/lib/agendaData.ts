// Funções para gerenciar dados da agenda

export interface EventoAgenda {
  id: string;
  titulo: string;
  data: string;
  hora?: string;
  tipo: 'aniversario' | 'vencimento' | 'consulta' | 'compromisso';
  cliente_id?: string;
  cliente_nome?: string;
  descricao?: string;
  cor?: string;
}

// Função para calcular aniversários dos clientes
export function calcularAniversarios(clientes: any[]) {
  const aniversarios: EventoAgenda[] = [];
  const hoje = new Date();
  
  clientes.forEach(cliente => {
    // Se o cliente tem data de nascimento
    if (cliente.data_nascimento) {
      const dataNascimento = new Date(cliente.data_nascimento);
      const mes = dataNascimento.getMonth();
      const dia = dataNascimento.getDate();
      
      // Criar evento de aniversário para o ano atual
      aniversarios.push({
        id: `aniversario-${cliente.id}-${hoje.getFullYear()}`,
        titulo: `🎂 Aniversário de ${cliente.nome}`,
        data: `${hoje.getFullYear()}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
        tipo: 'aniversario',
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        descricao: `Feliz aniversário, ${cliente.nome}!`,
        cor: 'pink',
      });
    }
  });
  
  return aniversarios;
}

// Função para calcular vencimentos de planos
export function calcularVencimentos(clientes: any[]) {
  const vencimentos: EventoAgenda[] = [];
  
  clientes.forEach(cliente => {
    // Se o cliente tem data de vencimento
    if (cliente.data_vencimento && cliente.status_plano === 'ativo') {
      vencimentos.push({
        id: `vencimento-${cliente.id}`,
        titulo: `📅 Vencimento de ${cliente.nome}`,
        data: cliente.data_vencimento,
        tipo: 'vencimento',
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        descricao: `Plano vencendo - entrar em contato`,
        cor: 'red',
      });
    }
  });
  
  return vencimentos;
}

// Função para buscar eventos salvos do localStorage ou Supabase
export async function buscarEventos(): Promise<EventoAgenda[]> {
  // Por enquanto, buscar do localStorage
  if (typeof window !== 'undefined') {
    const eventosSalvos = JSON.parse(localStorage.getItem('eventos_agenda') || '[]');
    return eventosSalvos;
  }
  
  return [];
}

// Função para salvar evento
export async function salvarEvento(evento: EventoAgenda) {
  if (typeof window !== 'undefined') {
    const eventos = JSON.parse(localStorage.getItem('eventos_agenda') || '[]');
    eventos.push(evento);
    localStorage.setItem('eventos_agenda', JSON.stringify(eventos));
    return evento;
  }
}

// Função para buscar todos os eventos combinados (aniversários, vencimentos, salvos)
export async function buscarTodosEventos(clientes: any[]): Promise<EventoAgenda[]> {
  const aniversarios = calcularAniversarios(clientes);
  const vencimentos = calcularVencimentos(clientes);
  const eventosSalvos = await buscarEventos();
  
  return [...aniversarios, ...vencimentos, ...eventosSalvos];
}

// Função para buscar eventos do Supabase (futuro)
export async function buscarEventosSupabase(): Promise<EventoAgenda[]> {
  try {
    // Verificar se está conectado ao Supabase
    const { isSupabaseConnected } = await import('../lib/agendaUtils');
    
    if (!isSupabaseConnected()) {
      return [];
    }
    
    // TODO: Implementar busca no Supabase
    // const { supabase } = await import('./supabase');
    // const { data, error } = await supabase
    //   .from('consultas')
    //   .select('*')
    //   .gte('data', new Date().toISOString())
    //   .order('data', { ascending: true });
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar eventos do Supabase:', error);
    return [];
  }
}

// Função para exportar para Google Calendar (futuro)
export function exportarParaGoogleCalendar(eventos: EventoAgenda[]) {
  // TODO: Implementar exportação para Google Calendar
  alert('⚠️ Funcionalidade de exportação para Google Calendar será implementada em breve!\n\nPor enquanto, os eventos estão salvos na sua agenda interna.');
  
  // Exemplo de como seria:
  // const icsContent = gerarICS(eventos);
  // const blob = new Blob([icsContent], { type: 'text/calendar' });
  // const url = window.URL.createObjectURL(blob);
  // window.open(url, '_blank');
}

