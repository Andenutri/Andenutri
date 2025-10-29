-- ================================================
-- TABELAS PARA ANAMNESE PERSONALIZADA
-- ================================================

-- Tabela de modelos de anamnese (criadas pelo profissional)
CREATE TABLE IF NOT EXISTS anamneses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id UUID, -- Pode ser usado para multi-tenant no futuro
  nome TEXT NOT NULL,
  descricao TEXT,
  campos JSONB NOT NULL, -- Array de campos do formulário
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Tabela de respostas das anamneses (preenchidas pelos clientes)
CREATE TABLE IF NOT EXISTS anamneses_respostas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anamnese_id UUID NOT NULL REFERENCES anamneses(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  respostas JSONB NOT NULL, -- Respostas do formulário
  token_acesso TEXT UNIQUE, -- Token para acesso público sem login
  data_preenchimento TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_anamneses_profissional ON anamneses(profissional_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_ativo ON anamneses(ativo);
CREATE INDEX IF NOT EXISTS idx_anamneses_respostas_anamnese ON anamneses_respostas(anamnese_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_respostas_cliente ON anamneses_respostas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_respostas_token ON anamneses_respostas(token_acesso);

-- RLS desabilitado para desenvolvimento (habilitar em produção)
ALTER TABLE anamneses DISABLE ROW LEVEL SECURITY;
ALTER TABLE anamneses_respostas DISABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE anamneses IS 'Modelos de formulários de anamnese personalizados';
COMMENT ON TABLE anamneses_respostas IS 'Respostas preenchidas pelos clientes';

-- ================================================
-- EXEMPLO DE ESTRUTURA DE CAMPOS (JSONB)
-- ================================================
-- Campos é um array JSON com objetos assim:
/*
[
  {
    "id": "campo_1",
    "tipo": "texto",
    "label": "Nome completo",
    "placeholder": "Digite seu nome",
    "obrigatorio": true,
    "validacao": {
      "min": 3,
      "max": 100
    }
  },
  {
    "id": "campo_2",
    "tipo": "numero",
    "label": "Idade",
    "obrigatorio": true,
    "validacao": {
      "min": 18,
      "max": 100
    }
  },
  {
    "id": "campo_3",
    "tipo": "data",
    "label": "Data de nascimento",
    "obrigatorio": true
  },
  {
    "id": "campo_4",
    "tipo": "select",
    "label": "Objetivo",
    "obrigatorio": true,
    "opcoes": [
      "Emagrecimento",
      "Ganho de massa",
      "Melhora de saúde",
      "Outro"
    ]
  },
  {
    "id": "campo_5",
    "tipo": "checkbox",
    "label": "Tem alguma restrição alimentar?",
    "opcoes": [
      "Lactose",
      "Glúten",
      "Açúcar",
      "Outro"
    ]
  },
  {
    "id": "campo_6",
    "tipo": "textarea",
    "label": "Observações",
    "obrigatorio": false,
    "rows": 4
  },
  {
    "id": "campo_7",
    "tipo": "escala",
    "label": "Nível de atividade física",
    "obrigatorio": true,
    "min": 1,
    "max": 10,
    "labels": {
      "1": "Sedentário",
      "10": "Muito ativo"
    }
  }
]
*/

-- Tipos de campo disponíveis:
-- - texto: Campo de texto livre
-- - numero: Campo numérico
-- - data: Seleção de data
-- - select: Seleção única (dropdown)
-- - checkbox: Múltipla seleção
-- - textarea: Texto longo
-- - escala: Escala numérica (ex: 1-10)

