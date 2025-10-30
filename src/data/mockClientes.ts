// Dados Mock de Clientes

export interface ClienteComFormulario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  instagram: string;
  endereco_completo?: string;
  codigo_reavaliacao?: string;
  perfil?: string | null;
  is_lead?: boolean;
  column_id?: string | null;
  formulario_preenchido: boolean;
  formulario: {
    nome_completo: string;
    endereco_completo: string;
    whatsapp: string;
    instagram: string;
    idade: string;
    altura: string;
    peso_atual: string;
    peso_desejado: string;
    conheceu_programa: string;
    trabalho: string;
    horario_trabalho: string;
    dias_trabalho: string;
    hora_acorda: string;
    hora_dorme: string;
    qualidade_sono: string;
    casada: string;
    filhos: string;
    nomes_idades_filhos: string;
    condicao_saude: string;
    uso_medicacao: string;
    medicacao_qual: string;
    restricao_alimentar: string;
    usa_suplemento: string;
    quais_suplementos: string;
    sente_dor: string;
    onde_dor: string;
    cafe_manha: string;
    lanche_manha: string;
    almoco: string;
    lanche_tarde: string;
    jantar: string;
    ceia: string;
    alcool_freq: string;
    consumo_agua: string;
    intestino_vezes_semana: string;
    atividade_fisica: string;
    refeicao_dificil: string;
    belisca_quando: string;
    muda_fins_semana: string;
    escala_cuidado: string;
    data_preenchimento: string;
  };
  status_plano: 'ativo' | 'inativo' | 'pausado';
  avaliacao_feita: boolean;
}

export const mockClientes: ClienteComFormulario[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 98765-4321',
    whatsapp: '(11) 98765-4321',
    instagram: '@mariiasilva',
    formulario_preenchido: true,
    status_plano: 'ativo',
    avaliacao_feita: false,
    formulario: {
      nome_completo: 'Maria Silva Santos',
      endereco_completo: 'Rua das Flores, 123, Apto 45, Jardim Primavera, São Paulo - SP',
      whatsapp: '(11) 98765-4321',
      instagram: '@mariiasilva',
      idade: '34',
      altura: '165',
      peso_atual: '78',
      peso_desejado: '65',
      conheceu_programa: 'Instagram',
      trabalho: 'Professora',
      horario_trabalho: '07:00 às 17:00',
      dias_trabalho: 'Segunda a Sexta',
      hora_acorda: '06:00',
      hora_dorme: '22:30',
      qualidade_sono: 'profundo',
      casada: 'sim',
      filhos: 'sim',
      nomes_idades_filhos: 'João (8 anos) e Ana (5 anos)',
      condicao_saude: 'Saudável',
      uso_medicacao: 'não',
      medicacao_qual: '',
      restricao_alimentar: 'Não',
      usa_suplemento: 'não',
      quais_suplementos: '',
      sente_dor: 'sim',
      onde_dor: 'Lombar, às vezes',
      cafe_manha: 'Café com adoçante e pão integral com manteiga',
      lanche_manha: 'Geralmente não',
      almoco: 'Arroz, feijão, frango grelhado, salada verde',
      lanche_tarde: 'Biscoito ou fruta',
      jantar: 'Sopa ou lanche',
      ceia: 'Chá ou água',
      alcool_freq: 'Fins de semana, 1-2 copos',
      consumo_agua: '1.5L',
      intestino_vezes_semana: 'Todos os dias',
      atividade_fisica: 'Academia 3x por semana',
      refeicao_dificil: 'Jantar - sempre chego tarde e com pressa',
      belisca_quando: 'Ansiosa ou estressada',
      muda_fins_semana: 'Sim, como mais pesado',
      escala_cuidado: '8',
      data_preenchimento: '2025-01-15T10:30:00'
    }
  },
  {
    id: '2',
    nome: 'João Santos',
    email: 'joao.santos@email.com',
    telefone: '(11) 99876-5432',
    whatsapp: '(11) 99876-5432',
    instagram: '@joaosantos',
    formulario_preenchido: true,
    status_plano: 'ativo',
    avaliacao_feita: true,
    formulario: {
      nome_completo: 'João Santos Oliveira',
      endereco_completo: 'Av. Paulista, 1000, Sala 30, Centro, São Paulo - SP',
      whatsapp: '(11) 99876-5432',
      instagram: '@joaosantos',
      idade: '42',
      altura: '180',
      peso_atual: '95',
      peso_desejado: '82',
      conheceu_programa: 'Indicação de amigo',
      trabalho: 'Empresário',
      horario_trabalho: '08:00 às 18:00',
      dias_trabalho: 'Segunda a Sexta',
      hora_acorda: '07:00',
      hora_dorme: '23:30',
      qualidade_sono: 'leve',
      casada: 'não',
      filhos: 'não',
      nomes_idades_filhos: '',
      condicao_saude: 'Pressão alta controlada',
      uso_medicacao: 'sim',
      medicacao_qual: 'Losartana',
      restricao_alimentar: 'Lactose',
      usa_suplemento: 'sim',
      quais_suplementos: 'Whey protein e creatina',
      sente_dor: 'não',
      onde_dor: '',
      cafe_manha: 'Café forte e pão com queijo',
      lanche_manha: 'Café ou lanche rápido',
      almoco: 'Marmita - arroz, feijão, carne e legumes',
      lanche_tarde: 'Fruta ou barrinha de cereal',
      jantar: 'Restaurante ou delivery',
      ceia: 'Às vezes algo doce',
      alcool_freq: '3-4x por semana',
      consumo_agua: '2.5L',
      intestino_vezes_semana: 'A cada 2 dias',
      atividade_fisica: '5x por semana - musculação',
      refeicao_dificil: 'Jantar e lanches',
      belisca_quando: 'Trabalhando no escritório',
      muda_fins_semana: 'Muito',
      escala_cuidado: '9',
      data_preenchimento: '2025-01-10T14:20:00'
    }
  },
  {
    id: '3',
    nome: 'Ana Paula',
    email: 'ana.paula@email.com',
    telefone: '(11) 97654-3210',
    whatsapp: '(11) 97654-3210',
    instagram: '@anapaula',
    formulario_preenchido: true,
    status_plano: 'pausado',
    avaliacao_feita: true,
    formulario: {
      nome_completo: 'Ana Paula Costa',
      endereco_completo: 'Rua XV de Novembro, 500, Vila Nova, São Paulo - SP',
      whatsapp: '(11) 97654-3210',
      instagram: '@anapaula',
      idade: '28',
      altura: '162',
      peso_atual: '85',
      peso_desejado: '70',
      conheceu_programa: 'Facebook',
      trabalho: 'Estudante de medicina',
      horario_trabalho: '08:00 às 12:00 e 14:00 às 18:00',
      dias_trabalho: 'Segunda a Sexta',
      hora_acorda: '06:30',
      hora_dorme: '00:00',
      qualidade_sono: 'insonia',
      casada: 'não',
      filhos: 'não',
      nomes_idades_filhos: '',
      condicao_saude: 'Saudável',
      uso_medicacao: 'não',
      medicacao_qual: '',
      restricao_alimentar: 'Não',
      usa_suplemento: 'sim',
      quais_suplementos: 'Multivitamínico',
      sente_dor: 'sim',
      onde_dor: 'Cabeça, costas',
      cafe_manha: 'Café preto e pão com nutella',
      lanche_manha: 'Não',
      almoco: 'Restaurante universitário',
      lanche_tarde: 'Bolacha ou chocolate',
      jantar: 'Delivery ou macarrão instantâneo',
      ceia: 'Às vezes sorvete',
      alcool_freq: '1x por semana',
      consumo_agua: '2L',
      intestino_vezes_semana: 'A cada 2-3 dias',
      atividade_fisica: 'Não faço',
      refeicao_dificil: 'Todas - estou sempre com fome',
      belisca_quando: 'Durante estudos',
      muda_fins_semana: 'Não muito',
      escala_cuidado: '7',
      data_preenchimento: '2025-01-08T16:45:00'
    }
  },
  {
    id: '4',
    nome: 'Carlos Alberto',
    email: 'carlos.alberto@email.com',
    telefone: '(11) 94567-8901',
    whatsapp: '(11) 94567-8901',
    instagram: '@carlos_alberto',
    formulario_preenchido: true,
    status_plano: 'ativo',
    avaliacao_feita: false,
    formulario: {
      nome_completo: 'Carlos Alberto Oliveira',
      endereco_completo: 'Av. Faria Lima, 2000, Apto 1203, Jardim Paulista, São Paulo - SP',
      whatsapp: '(11) 94567-8901',
      instagram: '@carlos_alberto',
      idade: '38',
      altura: '175',
      peso_atual: '92',
      peso_desejado: '78',
      conheceu_programa: 'Google',
      trabalho: 'Advogado',
      horario_trabalho: '09:00 às 19:00',
      dias_trabalho: 'Segunda a Sexta (às vezes sábado)',
      hora_acorda: '07:00',
      hora_dorme: '23:00',
      qualidade_sono: 'leve',
      casada: 'sim',
      filhos: 'sim',
      nomes_idades_filhos: 'Lucas (12 anos) e Sofia (9 anos)',
      condicao_saude: 'Saudável',
      uso_medicacao: 'não',
      medicacao_qual: '',
      restricao_alimentar: 'Não',
      usa_suplemento: 'não',
      quais_suplementos: '',
      sente_dor: 'sim',
      onde_dor: 'Joelhos (jogava futebol)',
      cafe_manha: 'Café com leite e pão de forma com requeijão',
      lanche_manha: 'Biscoito',
      almoco: 'Restaurante empresarial',
      lanche_tarde: 'Banana ou barra de cereal',
      jantar: 'Em casa - arroz, feijão, proteína, salada',
      ceia: 'Raramente',
      alcool_freq: 'Final de semana, 2-3 cervejas',
      consumo_agua: '2L',
      intestino_vezes_semana: 'Todos os dias',
      atividade_fisica: 'Musculação 2x por semana',
      refeicao_dificil: 'Nenhuma - como relativamente bem',
      belisca_quando: 'Estresse no trabalho',
      muda_fins_semana: 'Sim, como mais carboidrato',
      escala_cuidado: '8',
      data_preenchimento: '2025-01-16T09:15:00'
    }
  },
  {
    id: '5',
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    telefone: '(11) 91234-5678',
    whatsapp: '(11) 91234-5678',
    instagram: '@ferlima_fit',
    formulario_preenchido: true,
    status_plano: 'ativo',
    avaliacao_feita: false,
    formulario: {
      nome_completo: 'Fernanda Lima Santos',
      endereco_completo: 'Rua Augusta, 1500, Apto 80, Consolação, São Paulo - SP',
      whatsapp: '(11) 91234-5678',
      instagram: '@ferlima_fit',
      idade: '29',
      altura: '168',
      peso_atual: '88',
      peso_desejado: '68',
      conheceu_programa: 'Instagram - patrocinado',
      trabalho: 'Personal Trainer / Influencer Fitness',
      horario_trabalho: '06:00 às 22:00 (flexível)',
      dias_trabalho: 'Todos os dias (intermitente)',
      hora_acorda: '05:30',
      hora_dorme: '22:30',
      qualidade_sono: 'profundo',
      casada: 'sim',
      filhos: 'não',
      nomes_idades_filhos: '',
      condicao_saude: 'Saudável',
      uso_medicacao: 'não',
      medicacao_qual: '',
      restricao_alimentar: 'Nenhuma',
      usa_suplemento: 'sim',
      quais_suplementos: 'Whey protein, BCAA, glutamina, creatina',
      sente_dor: 'não',
      onde_dor: '',
      cafe_manha: 'Aveia, whey protein, banana e amendoim',
      lanche_manha: '2x ovos cozidos ou iogurte',
      almoco: 'Frango grelhado, batata doce, brócolis',
      lanche_tarde: 'Whey protein ou fruta com granola',
      jantar: 'Peixe, arroz integral, salada',
      ceia: 'Raramente',
      alcool_freq: 'Muito raro - 1x por mês',
      consumo_agua: '4L',
      intestino_vezes_semana: 'Todos os dias (normal)',
      atividade_fisica: '6x por semana - treino funcional + corrida',
      refeicao_dificil: 'Nenhuma - tenho muita disciplina',
      belisca_quando: 'Período menstrual',
      muda_fins_semana: 'Não',
      escala_cuidado: '10',
      data_preenchimento: '2025-01-17T11:30:00'
    }
  }
];

export function getAllClientes(): ClienteComFormulario[] {
  return mockClientes;
}

export function getClientesParaAvaliar(): ClienteComFormulario[] {
  return mockClientes.filter(cliente => 
    cliente.formulario_preenchido && !cliente.avaliacao_feita
  );
}

export function getClienteById(id: string): ClienteComFormulario | undefined {
  return mockClientes.find(cliente => cliente.id === id);
}

