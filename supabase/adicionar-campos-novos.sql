-- ================================================
-- ANDENUTRI - Adicionar Novos Campos
-- Script para adicionar novos campos sem recriar tabelas
-- ================================================

-- Adicionar novos campos à tabela avaliacoes_fisicas
DO $$ 
BEGIN
    -- Adicionar massa_gorda se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'massa_gorda'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN massa_gorda DECIMAL(5,2);
    END IF;

    -- Adicionar massa_magra se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'massa_magra'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN massa_magra DECIMAL(5,2);
    END IF;

    -- Adicionar visceral se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'visceral'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN visceral DECIMAL(5,2);
    END IF;

    -- Adicionar busto se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'busto'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN busto DECIMAL(5,2);
    END IF;

    -- Adicionar pescoco se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'pescoco'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN pescoco DECIMAL(5,2);
    END IF;

    -- Adicionar protocolo_aplicado se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'protocolo_aplicado'
    ) THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN protocolo_aplicado TEXT;
    END IF;
END $$;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '✅ Novos campos adicionados com sucesso à tabela avaliacoes_fisicas!';
END $$;

