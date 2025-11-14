-- ================================================
-- ADICIONAR CAMPO: duracao_programa_dias
-- Para permitir programas de diferentes durações (30, 60, 90 dias, etc.)
-- ================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'clientes' AND column_name = 'duracao_programa_dias'
    ) THEN
        ALTER TABLE clientes ADD COLUMN duracao_programa_dias INTEGER DEFAULT 90;
        RAISE NOTICE '✅ Campo duracao_programa_dias adicionado em clientes';
        
        -- Atualizar clientes existentes para ter 90 dias como padrão
        UPDATE clientes 
        SET duracao_programa_dias = 90 
        WHERE duracao_programa_dias IS NULL;
        
        RAISE NOTICE '✅ Clientes existentes atualizados com duração padrão de 90 dias';
    ELSE
        RAISE NOTICE '⚠️ Campo duracao_programa_dias já existe em clientes';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Campo duracao_programa_dias configurado com sucesso!';
    RAISE NOTICE '✅ Permite programas de diferentes durações (30, 60, 90 dias, etc.)';
    RAISE NOTICE '✅ Valor padrão: 90 dias';
    RAISE NOTICE '========================================';
END $$;

