-- ================================================
-- TABELA DE CONFIGURAÇÕES DO PROFISSIONAL
-- ================================================

-- Tabela de configurações gerais (branding, contatos, etc)
CREATE TABLE IF NOT EXISTS configuracoes_profissional (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id UUID, -- Pode ser usado para multi-tenant no futuro
  logo_url TEXT, -- URL do logo armazenado no Supabase Storage
  nome_profissional TEXT,
  nome_empresa TEXT,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  site TEXT,
  cores_tema JSONB, -- { primaria: "#hex", secundaria: "#hex" }
  assinatura_digital TEXT, -- URL da imagem de assinatura (opcional)
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Criar índice único para garantir uma única configuração ativa
CREATE UNIQUE INDEX IF NOT EXISTS idx_configuracoes_profissional_ativo 
ON configuracoes_profissional (profissional_id) 
WHERE ativo = TRUE;

-- RLS desabilitado para desenvolvimento (habilitar em produção)
ALTER TABLE configuracoes_profissional DISABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE configuracoes_profissional IS 'Configurações de branding e informações do profissional/clínica';
COMMENT ON COLUMN configuracoes_profissional.logo_url IS 'URL do logo (pode estar no Supabase Storage ou externo)';
COMMENT ON COLUMN configuracoes_profissional.cores_tema IS 'Cores personalizadas para relatórios em formato JSON';

-- ================================================
-- EXEMPLO DE ESTRUTURA DE CORES_TEMA
-- ================================================
/*
{
  "primaria": "#3b82f6",
  "secundaria": "#8b5cf6",
  "destaque": "#10b981",
  "fundo": "#f9fafb"
}
*/

