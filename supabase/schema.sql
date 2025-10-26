-- ================================================
-- ANDENUTRI - Supabase Schema
-- Sistema Completo de Gestão de Clientes
-- ================================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. TABELA: clientes
-- ================================================
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  pais_telefone TEXT DEFAULT '+55',
  endereco_completo TEXT,
  pais TEXT DEFAULT 'Brasil',
  estado TEXT,
  cidade TEXT,
  status_programa TEXT DEFAULT 'ativo' CHECK (status_programa IN ('ativo', 'inativo', 'pausado')),
  status_herbalife TEXT DEFAULT 'inativo' CHECK (status_herbalife IN ('ativo', 'inativo')),
  status_challenge TEXT DEFAULT 'nao' CHECK (status_challenge IN ('sim', 'nao')),
  herbalife_usuario TEXT,
  herbalife_senha TEXT,
  indicado_por TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 2. TABELA: formularios_pre_consulta
-- ================================================
CREATE TABLE formularios_pre_consulta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID UNIQUE NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nome_completo TEXT,
  idade TEXT,
  altura TEXT,
  peso_atual TEXT,
  peso_desejado TEXT,
  conheceu_programa TEXT,
  trabalho TEXT,
  horario_trabalho TEXT,
  dias_trabalho TEXT,
  hora_acorda TEXT,
  hora_dorme TEXT,
  qualidade_sono TEXT,
  casada TEXT,
  filhos TEXT,
  nomes_idades_filhos TEXT,
  condicao_saude TEXT,
  uso_medicacao TEXT,
  medicacao_qual TEXT,
  restricao_alimentar TEXT,
  usa_suplemento TEXT,
  quais_suplementos TEXT,
  sente_dor TEXT,
  onde_dor TEXT,
  cafe_manha TEXT,
  lanche_manha TEXT,
  almoco TEXT,
  lanche_tarde TEXT,
  jantar TEXT,
  ceia TEXT,
  alcool_freq TEXT,
  consumo_agua TEXT,
  intestino_vezes_semana TEXT,
  atividade_fisica TEXT,
  refeicao_dificil TEXT,
  belisca_quando TEXT,
  muda_fins_semana TEXT,
  escala_cuidado TEXT,
  data_preenchimento TIMESTAMP DEFAULT NOW(),
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 3. TABELA: avaliacoes_fisicas
-- ================================================
CREATE TABLE avaliacoes_fisicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  data_avaliacao DATE NOT NULL,
  peso DECIMAL(5,2),
  altura DECIMAL(5,2),
  braco_esquerdo DECIMAL(5,2),
  braco_direito DECIMAL(5,2),
  peito DECIMAL(5,2),
  cintura DECIMAL(5,2),
  abdomen DECIMAL(5,2),
  quadril DECIMAL(5,2),
  coxa_esquerda DECIMAL(5,2),
  coxa_direita DECIMAL(5,2),
  foto_frente_url TEXT,
  foto_perfil_url TEXT,
  foto_costas_url TEXT,
  observacoes TEXT,
  tipo_avaliacao TEXT DEFAULT 'inicial' CHECK (tipo_avaliacao IN ('inicial', 'reavaliacao', 'final')),
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 4. TABELA: avaliacoes_emocionais
-- ================================================
CREATE TABLE avaliacoes_emocionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  historia_pessoa TEXT,
  momento_mudanca TEXT,
  incomoda_espelho TEXT,
  situacao_corpo TEXT,
  atrapalha_dia_dia TEXT,
  maior_medo TEXT,
  por_que_eliminar_kilos TEXT,
  tentou_antes TEXT,
  oque_fara_peso_desejado TEXT,
  tres_motivos TEXT,
  nivel_comprometimento INTEGER DEFAULT 0 CHECK (nivel_comprometimento >= 0 AND nivel_comprometimento <= 10),
  conselho_si TEXT,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 5. TABELA: avaliacoes_comportamentais
-- ================================================
CREATE TABLE avaliacoes_comportamentais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  ponto_fraco_alimentacao TEXT,
  organizada_ou_improvisa TEXT,
  come_por_que TEXT,
  momentos_dificeis TEXT,
  prazer_alem_comida TEXT,
  premia_com_comida TEXT,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 6. TABELA: cardapios
-- ================================================
CREATE TABLE cardapios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  texto_cardapio TEXT,
  tipo_cardapio TEXT DEFAULT 'perda_peso' CHECK (tipo_cardapio IN ('perda_peso', 'ganho_massa', 'manutencao', 'detox')),
  data_inicio DATE,
  data_fim DATE,
  enviado_por_email BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 7. TABELA: kanban_colunas
-- ================================================
CREATE TABLE kanban_colunas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  clientes_ids JSONB DEFAULT '[]'::JSONB,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 8. TABELA: planos_assinatura
-- ================================================
CREATE TABLE planos_assinatura (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_plano TEXT DEFAULT 'basico' CHECK (tipo_plano IN ('basico', 'premium', 'vip')),
  data_inicio DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  valor_mensal DECIMAL(10,2),
  status_pagamento TEXT DEFAULT 'pendente' CHECK (status_pagamento IN ('pago', 'pendente', 'atrasado', 'cancelado')),
  metodo_pagamento TEXT,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 9. TABELA: consultas
-- ================================================
CREATE TABLE consultas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  data_consulta TIMESTAMP NOT NULL,
  tipo_consulta TEXT DEFAULT 'videochamada' CHECK (tipo_consulta IN ('videochamada', 'presencial', 'seguimento')),
  titulo TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 10. TABELA: reavaliacoes
-- ================================================
CREATE TABLE reavaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  avaliacao_fisica_id UUID REFERENCES avaliacoes_fisicas(id) ON DELETE SET NULL,
  avaliacao_emocional_id UUID REFERENCES avaliacoes_emocionais(id) ON DELETE SET NULL,
  avaliacao_comportamental_id UUID REFERENCES avaliacoes_comportamentais(id) ON DELETE SET NULL,
  data_reavaliacao DATE NOT NULL,
  observacoes TEXT,
  progresso TEXT,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_status ON clientes(status_programa);
CREATE INDEX idx_formularios_cliente ON formularios_pre_consulta(cliente_id);
CREATE INDEX idx_avaliacoes_fisicas_cliente ON avaliacoes_fisicas(cliente_id);
CREATE INDEX idx_avaliacoes_emocionais_cliente ON avaliacoes_emocionais(cliente_id);
CREATE INDEX idx_avaliacoes_comportamentais_cliente ON avaliacoes_comportamentais(cliente_id);
CREATE INDEX idx_cardapios_cliente ON cardapios(cliente_id);
CREATE INDEX idx_consultas_cliente ON consultas(cliente_id);
CREATE INDEX idx_consultas_data ON consultas(data_consulta);
CREATE INDEX idx_planos_vencimento ON planos_assinatura(data_vencimento);
CREATE INDEX idx_planos_status ON planos_assinatura(status_pagamento);
CREATE INDEX idx_reavaliacoes_cliente ON reavaliacoes(cliente_id);

-- ================================================
-- TRIGGERS: Atualização automática de data_atualizacao
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_data_atualizacao BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS) - DESABILITADO PARA DESENVOLVIMENTO
-- ================================================

-- DESABILITAR RLS em todas as tabelas (para desenvolvimento)
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_pre_consulta DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_fisicas DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_emocionais DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_comportamentais DISABLE ROW LEVEL SECURITY;
ALTER TABLE cardapios DISABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_colunas DISABLE ROW LEVEL SECURITY;
ALTER TABLE planos_assinatura DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultas DISABLE ROW LEVEL SECURITY;
ALTER TABLE reavaliacoes DISABLE ROW LEVEL SECURITY;

-- ================================================
-- DADOS INICIAIS
-- ================================================

-- Inserir colunas padrão do Kanban
INSERT INTO kanban_colunas (nome, cor, ordem) VALUES 
  ('✅ Ativo', 'green', 1),
  ('❌ Inativo', 'red', 2),
  ('⏸️ Pausado', 'yellow', 3);

-- ================================================
-- FIM DO SCHEMA
-- ================================================
