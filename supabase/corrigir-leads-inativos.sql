-- ================================================
-- CORRIGIR LEADS INATIVOS
-- Clientes que compraram o programa (data_compra_programa existe)
-- NUNCA devem ser leads, mesmo que estejam inativos
-- ================================================

DO $$ 
BEGIN
    -- CORREÇÃO 1: Clientes que têm data_compra_programa mas estão marcados como lead
    -- Estes são clientes (comprou programa), não leads
    UPDATE clientes 
    SET is_lead = FALSE 
    WHERE data_compra_programa IS NOT NULL 
      AND is_lead = TRUE;
    
    RAISE NOTICE '✅ Clientes com data_compra_programa corrigidos: is_lead = FALSE';
    
    -- CORREÇÃO 2: Clientes que estão inativos mas têm data_compra_programa
    -- Estes são clientes inativos, não leads
    UPDATE clientes 
    SET is_lead = FALSE 
    WHERE status_programa = 'inativo' 
      AND data_compra_programa IS NOT NULL
      AND is_lead = TRUE;
    
    RAISE NOTICE '✅ Clientes inativos com data_compra_programa corrigidos: is_lead = FALSE';
    
    -- CORREÇÃO 3: Clientes que estão pausados mas têm data_compra_programa
    -- Estes são clientes pausados, não leads
    UPDATE clientes 
    SET is_lead = FALSE 
    WHERE status_programa = 'pausado' 
      AND data_compra_programa IS NOT NULL
      AND is_lead = TRUE;
    
    RAISE NOTICE '✅ Clientes pausados com data_compra_programa corrigidos: is_lead = FALSE';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Correção concluída!';
    RAISE NOTICE '✅ REGRA: Se data_compra_programa existe → is_lead = FALSE (sempre)';
    RAISE NOTICE '✅ REGRA: Se data_compra_programa é NULL → pode ser lead (is_lead = TRUE)';
    RAISE NOTICE '========================================';
END $$;

-- Verificar resultado
SELECT 
    CASE 
        WHEN is_lead = TRUE THEN 'Lead'
        WHEN is_lead = FALSE THEN 'Cliente'
        ELSE 'Não definido'
    END as tipo,
    status_programa,
    COUNT(*) as total,
    COUNT(CASE WHEN data_compra_programa IS NOT NULL THEN 1 END) as com_data_compra
FROM clientes
GROUP BY is_lead, status_programa
ORDER BY tipo, status_programa;

-- Mostrar casos problemáticos (se houver)
SELECT 
    id,
    nome,
    status_programa,
    is_lead,
    data_compra_programa,
    CASE 
        WHEN data_compra_programa IS NOT NULL AND is_lead = TRUE THEN '❌ ERRO: Tem data_compra mas é lead'
        WHEN data_compra_programa IS NULL AND is_lead = FALSE AND status_programa = 'inativo' THEN '⚠️ ATENÇÃO: Inativo sem data_compra (pode ser lead antigo)'
        ELSE '✅ OK'
    END as status_validacao
FROM clientes
WHERE (data_compra_programa IS NOT NULL AND is_lead = TRUE)
   OR (data_compra_programa IS NULL AND is_lead = FALSE AND status_programa = 'inativo')
ORDER BY status_validacao, nome;

