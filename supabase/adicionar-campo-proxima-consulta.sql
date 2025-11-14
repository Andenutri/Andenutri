-- ================================================
-- ADICIONAR CAMPO DATA_PROXIMA_CONSULTA
-- Para permitir que o usuário defina manualmente a data da próxima consulta
-- ================================================

DO $$ 
BEGIN
    -- Adicionar campo data_proxima_consulta se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'data_proxima_consulta'
    ) THEN
        ALTER TABLE clientes ADD COLUMN data_proxima_consulta DATE;
        RAISE NOTICE '✅ Campo data_proxima_consulta adicionado em clientes';
    ELSE
        RAISE NOTICE 'ℹ️ Campo data_proxima_consulta já existe em clientes';
    END IF;

    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Campo configurado com sucesso!';
    RAISE NOTICE '✅ data_proxima_consulta: Data definida manualmente pelo usuário para a próxima consulta';
    RAISE NOTICE '========================================';
END $$;

-- Verificar resultado
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name = 'data_proxima_consulta';

