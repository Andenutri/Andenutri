-- ================================================
-- ADICIONAR CAMPO: suplementos
-- Campo de texto livre para informações sobre suplementos do cliente
-- ================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'clientes' AND column_name = 'suplementos'
    ) THEN
        ALTER TABLE clientes ADD COLUMN suplementos TEXT;
        RAISE NOTICE '✅ Campo suplementos adicionado em clientes';
    ELSE
        RAISE NOTICE '⚠️ Campo suplementos já existe em clientes';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Campo suplementos configurado com sucesso!';
    RAISE NOTICE '✅ Permite preenchimento livre de informações sobre suplementos';
    RAISE NOTICE '========================================';
END $$;

