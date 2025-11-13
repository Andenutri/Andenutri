-- ================================================
-- ADICIONAR CAMPO DATA_COMPRA_PROGRAMA
-- Para rastrear quando um Lead virou Cliente
-- ================================================

DO $$ 
BEGIN
    -- Adicionar campo data_compra_programa se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'data_compra_programa'
    ) THEN
        ALTER TABLE clientes ADD COLUMN data_compra_programa TIMESTAMP;
        RAISE NOTICE '✅ Campo data_compra_programa adicionado em clientes';
    END IF;

    -- Garantir que is_lead existe e tem valor padrão
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'is_lead'
    ) THEN
        ALTER TABLE clientes ADD COLUMN is_lead BOOLEAN DEFAULT TRUE;
        RAISE NOTICE '✅ Campo is_lead adicionado em clientes';
    END IF;

    -- Atualizar is_lead para FALSE onde já existe data_compra_programa (clientes antigos que já compraram)
    UPDATE clientes 
    SET is_lead = FALSE 
    WHERE data_compra_programa IS NOT NULL AND is_lead = TRUE;
    
    RAISE NOTICE '✅ Clientes com data_compra_programa atualizados para is_lead = FALSE';

    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Campos configurados com sucesso!';
    RAISE NOTICE '✅ is_lead: TRUE = Lead, FALSE = Cliente';
    RAISE NOTICE '✅ data_compra_programa: Data em que comprou o programa de 90 dias';
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
AND column_name IN ('is_lead', 'data_compra_programa')
ORDER BY column_name;

-- Mostrar estatísticas
SELECT 
    CASE 
        WHEN is_lead = TRUE THEN 'Lead'
        WHEN is_lead = FALSE THEN 'Cliente'
        ELSE 'Não definido'
    END as tipo,
    COUNT(*) as total
FROM clientes
GROUP BY is_lead
ORDER BY tipo;

