-- ================================================
-- SISTEMA DE REAVALIAÇÃO DE CLIENTES
-- Cada cliente tem um código único para reavaliar antes da consulta
-- ================================================

-- 1. Adicionar campo codigo_reavaliacao na tabela clientes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'codigo_reavaliacao'
    ) THEN
        ALTER TABLE clientes ADD COLUMN codigo_reavaliacao TEXT UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_clientes_codigo_reavaliacao ON clientes(codigo_reavaliacao);
    END IF;
END $$;

-- 2. Gerar códigos únicos para clientes existentes que não têm
DO $$
DECLARE
    cliente_rec RECORD;
    novo_codigo TEXT;
BEGIN
    FOR cliente_rec IN SELECT id FROM clientes WHERE codigo_reavaliacao IS NULL OR codigo_reavaliacao = ''
    LOOP
        -- Gerar código único baseado no UUID (primeiros 8 caracteres)
        novo_codigo := UPPER(SUBSTRING(REPLACE(cliente_rec.id::TEXT, '-', ''), 1, 8));
        
        -- Garantir que é único (adicionar números se necessário)
        WHILE EXISTS (SELECT 1 FROM clientes WHERE codigo_reavaliacao = novo_codigo) LOOP
            novo_codigo := novo_codigo || FLOOR(RANDOM() * 1000)::TEXT;
        END LOOP;
        
        UPDATE clientes 
        SET codigo_reavaliacao = novo_codigo
        WHERE id = cliente_rec.id;
    END LOOP;
END $$;

-- 3. Criar tabela de respostas de reavaliação
CREATE TABLE IF NOT EXISTS reavaliacoes_respostas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Perguntas da Reavalição
  peso_atual TEXT,
  mudancas_corpo_disposicao TEXT,
  energia_dia TEXT,
  intestino_sono TEXT,
  rotina_alimentacao_organizada TEXT,
  refeicoes_faceis TEXT,
  refeicoes_desafiadoras TEXT,
  agua_suplementos TEXT,
  atividade_fisica TEXT,
  o_que_ajudou TEXT,
  o_que_atrapalhou TEXT,
  programa_ajudou TEXT,
  programa_ajudar_mais TEXT,
  mudar_estrategia TEXT,
  maior_foco_nova_fase TEXT,
  
  data_preenchimento TIMESTAMP DEFAULT NOW(),
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reavaliacoes_cliente_id ON reavaliacoes_respostas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reavaliacoes_user_id ON reavaliacoes_respostas(user_id);
CREATE INDEX IF NOT EXISTS idx_reavaliacoes_data_preenchimento ON reavaliacoes_respostas(data_preenchimento DESC);

-- Função para gerar código de reavaliação automaticamente para novos clientes
CREATE OR REPLACE FUNCTION gerar_codigo_reavaliacao()
RETURNS TRIGGER AS $$
DECLARE
    novo_codigo TEXT;
BEGIN
    -- Se não tiver código, gerar um
    IF NEW.codigo_reavaliacao IS NULL OR NEW.codigo_reavaliacao = '' THEN
        -- Gerar código baseado no UUID
        novo_codigo := UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', ''), 1, 8));
        
        -- Garantir que é único
        WHILE EXISTS (SELECT 1 FROM clientes WHERE codigo_reavaliacao = novo_codigo AND id != NEW.id) LOOP
            novo_codigo := novo_codigo || FLOOR(RANDOM() * 1000)::TEXT;
        END LOOP;
        
        NEW.codigo_reavaliacao := novo_codigo;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente
DROP TRIGGER IF EXISTS trigger_gerar_codigo_reavaliacao ON clientes;
CREATE TRIGGER trigger_gerar_codigo_reavaliacao
BEFORE INSERT ON clientes
FOR EACH ROW
EXECUTE FUNCTION gerar_codigo_reavaliacao();

-- Comentários
COMMENT ON COLUMN clientes.codigo_reavaliacao IS 'Código único para acesso ao formulário de reavaliação. Ex: REV123ABC';
COMMENT ON TABLE reavaliacoes_respostas IS 'Respostas das reavaliações preenchidas pelos clientes antes das consultas';

-- ================================================
-- VERIFICAÇÃO: Ver códigos gerados
-- ================================================

-- SELECT 
--   nome,
--   email,
--   codigo_reavaliacao,
--   CASE 
--     WHEN codigo_reavaliacao IS NOT NULL THEN '✅ Tem código'
--     ELSE '❌ Sem código'
--   END as status
-- FROM clientes
-- ORDER BY nome;

