-- ================================================
-- ANDENUTRI - Adicionar Tabela de Agenda
-- Sistema de Eventos e Lembretes
-- ================================================

-- Criar tabela de eventos/agenda
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

-- Índices para performance
CREATE INDEX idx_eventos_agenda_cliente ON eventos_agenda(cliente_id);
CREATE INDEX idx_eventos_agenda_data ON eventos_agenda(data_evento);
CREATE INDEX idx_eventos_agenda_status ON eventos_agenda(status);
CREATE INDEX idx_eventos_agenda_tipo ON eventos_agenda(tipo_evento);

-- Adicionar campos à tabela avaliacoes_fisicas se não existirem
DO $$ 
BEGIN
    -- Adicionar percentual_gordura se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'percentual_gordura'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN percentual_gordura DECIMAL(5,2);
    END IF;

    -- Adicionar percentual_musculo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'percentual_musculo'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN percentual_musculo DECIMAL(5,2);
    END IF;

    -- Adicionar gordura_visceral se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'gordura_visceral'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN gordura_visceral DECIMAL(5,2);
    END IF;

    -- Adicionar metabolismo_basal se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'metabolismo_basal'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN metabolismo_basal DECIMAL(5,2);
    END IF;

    -- Adicionar barriga se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'barriga'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN barriga DECIMAL(5,2);
    END IF;

    -- Adicionar braco se não existir (agrupado)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'braco'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN braco DECIMAL(5,2);
    END IF;

    -- Adicionar coxa se não existir (agrupado)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'coxa'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN coxa DECIMAL(5,2);
    END IF;
END $$;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '✅ Tabela de agenda e novos campos adicionados com sucesso!';
END $$;

