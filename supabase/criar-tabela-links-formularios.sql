-- ================================================
-- TABELA: links_formularios
-- Cada nutricionista tem seu link único para receber leads
-- ================================================

-- Criar tabela de links de formulários
CREATE TABLE IF NOT EXISTS links_formularios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL, -- Ex: "DISE123", "MARIA456"
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nutricionista_nome TEXT, -- Nome do nutricionista
  ativo BOOLEAN DEFAULT true,
  total_submissoes INTEGER DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_links_formularios_codigo ON links_formularios(codigo);
CREATE INDEX IF NOT EXISTS idx_links_formularios_user_id ON links_formularios(user_id);
CREATE INDEX IF NOT EXISTS idx_links_formularios_ativo ON links_formularios(ativo);

-- Função para incrementar contador de submissões (RPC)
CREATE OR REPLACE FUNCTION incrementar_submissoes_link(codigo_link_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE links_formularios
  SET 
    total_submissoes = total_submissoes + 1,
    atualizado_em = NOW()
  WHERE codigo = codigo_link_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp_links()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_timestamp_links
BEFORE UPDATE ON links_formularios
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp_links();

-- Adicionar coluna codigo_link em clientes para rastrear origem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'codigo_link'
    ) THEN
        ALTER TABLE clientes ADD COLUMN codigo_link TEXT;
        CREATE INDEX IF NOT EXISTS idx_clientes_codigo_link ON clientes(codigo_link);
    END IF;
END $$;

-- Comentários
COMMENT ON TABLE links_formularios IS 'Links únicos de formulário para cada nutricionista';
COMMENT ON COLUMN links_formularios.codigo IS 'Código único do link (ex: DISE123)';
COMMENT ON COLUMN links_formularios.user_id IS 'ID do nutricionista que possui este link';
COMMENT ON COLUMN links_formularios.total_submissoes IS 'Total de formulários recebidos via este link';
COMMENT ON COLUMN clientes.codigo_link IS 'Código do link usado para criar este cliente (rastreamento)';

-- ================================================
-- FUNÇÃO: Criar link automático para novo usuário
-- ================================================

CREATE OR REPLACE FUNCTION criar_link_automatico_novo_usuario()
RETURNS TRIGGER AS $$
DECLARE
    codigo_gerado TEXT;
BEGIN
    -- Gerar código baseado no email do usuário
    -- Ex: deisefaula@gmail.com -> DISEFAULA (primeiras 8 letras maiúsculas)
    codigo_gerado := UPPER(SUBSTRING(REPLACE(NEW.email, '@', ''), 1, 8));
    
    -- Se código já existir, adicionar números
    WHILE EXISTS (SELECT 1 FROM links_formularios WHERE codigo = codigo_gerado) LOOP
        codigo_gerado := codigo_gerado || FLOOR(RANDOM() * 1000)::TEXT;
    END LOOP;
    
    -- Criar link para o novo usuário
    INSERT INTO links_formularios (codigo, user_id, nutricionista_nome, ativo)
    VALUES (codigo_gerado, NEW.id, NEW.raw_user_meta_data->>'nome', true);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar link automático quando novo usuário é criado
-- (Opcional - pode ser feito manualmente também)
-- DROP TRIGGER IF EXISTS trigger_criar_link_novo_usuario ON auth.users;
-- CREATE TRIGGER trigger_criar_link_novo_usuario
-- AFTER INSERT ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION criar_link_automatico_novo_usuario();

-- ================================================
-- RLS (Row Level Security) - Links são privados
-- ================================================

ALTER TABLE links_formularios ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios links
CREATE POLICY "Usuários veem apenas seus links"
ON links_formularios
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários podem criar seus próprios links
CREATE POLICY "Usuários criam seus links"
ON links_formularios
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus links
CREATE POLICY "Usuários atualizam seus links"
ON links_formularios
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Leitura pública do código (para validar link no formulário)
CREATE POLICY "Leitura pública por código"
ON links_formularios
FOR SELECT
USING (
  codigo IS NOT NULL 
  AND ativo = true
);

-- ================================================
-- SCRIPT: Criar link para usuários existentes
-- ================================================

-- Para criar link da Deise Faula manualmente:
-- INSERT INTO links_formularios (codigo, user_id, nutricionista_nome, ativo)
-- SELECT 'DISE123', id, email, true
-- FROM auth.users
-- WHERE email = 'deisefaula@gmail.com'
-- ON CONFLICT (codigo) DO NOTHING;

-- ================================================
-- VERIFICAÇÃO: Ver links criados
-- ================================================

-- SELECT 
--   lf.codigo,
--   u.email as nutricionista_email,
--   lf.nutricionista_nome,
--   lf.ativo,
--   lf.total_submissoes,
--   lf.criado_em
-- FROM links_formularios lf
-- JOIN auth.users u ON u.id = lf.user_id
-- ORDER BY lf.criado_em DESC;

