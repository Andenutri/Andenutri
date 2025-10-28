-- ================================================
-- ANDENUTRI - Atualização de Tabelas
-- Script completo com todas as mudanças de 2025
-- ================================================

-- ================================================
-- 1. TABELA DE EVENTOS/AGENDA
-- ================================================
CREATE TABLE IF NOT EXISTS eventos_agenda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento TIMESTAMP NOT NULL,
  hora TEXT,
  tipo_evento TEXT DEFAULT 'consulta' CHECK (tipo_evento IN ('consulta', 'reavaliacao', 'follow-up', 'outro')),
  lembrete TEXT,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'realizado', 'cancelado')),
  cor TEXT,
  notificado BOOLEAN DEFAULT FALSE,
  data_notificacao TIMESTAMP,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_agenda_cliente ON eventos_agenda(cliente_id);
CREATE INDEX IF NOT EXISTS idx_eventos_agenda_data ON eventos_agenda(data_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_agenda_status ON eventos_agenda(status);
CREATE INDEX IF NOT EXISTS idx_eventos_agenda_tipo ON eventos_agenda(tipo_evento);

-- ================================================
-- 2. ADICIONAR CAMPOS FALTANTES À AVALIACOES_FISICAS
-- ================================================
DO $$ 
BEGIN
    -- Percentual de gordura
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'percentual_gordura'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN percentual_gordura DECIMAL(5,2);
    END IF;

    -- Percentual de músculo
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'percentual_musculo'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN percentual_musculo DECIMAL(5,2);
    END IF;

    -- Gordura visceral
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'gordura_visceral'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN gordura_visceral DECIMAL(5,2);
    END IF;

    -- Metabolismo basal
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'metabolismo_basal'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN metabolismo_basal DECIMAL(5,2);
    END IF;

    -- Barriga
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'barriga'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN barriga DECIMAL(5,2);
    END IF;

    -- Braço (agrupado)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'braco'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN braco DECIMAL(5,2);
    END IF;

    -- Coxa (agrupado)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'coxa'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN coxa DECIMAL(5,2);
    END IF;
END $$;

-- ================================================
-- 3. ADICIONAR RLS SE NECESSÁRIO
-- ================================================
-- Manter RLS desabilitado para desenvolvimento
ALTER TABLE eventos_agenda DISABLE ROW LEVEL SECURITY;

-- ================================================
-- 4. ADICIONAR CAMPOS PERFIL, IS_LEAD E INDICADO_POR NA TABELA CLIENTES
-- ================================================
DO $$ 
BEGIN
    -- Adicionar perfil se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'perfil'
    ) THEN
        ALTER TABLE clientes ADD COLUMN perfil TEXT;
    END IF;

    -- Adicionar is_lead se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'is_lead'
    ) THEN
        ALTER TABLE clientes ADD COLUMN is_lead BOOLEAN DEFAULT FALSE;
    END IF;

    -- Indicado_por já existe na tabela original, então não precisa adicionar
END $$;

-- ================================================
-- 5. COMANDOS DE CONFIRMAÇÃO
-- ================================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ Tabela de eventos_agenda criada com sucesso!';
    RAISE NOTICE '✅ Novos campos adicionados à avaliacoes_fisicas!';
    RAISE NOTICE '✅ Campos perfil, is_lead adicionados à tabela clientes!';
    RAISE NOTICE '✅ Sistema de agenda, lead e indicação pronto para uso!';
END $$;

