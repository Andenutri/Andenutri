-- =====================================================
-- VERIFICAR E LIMPAR CLIENTES DUPLICADOS NAS COLUNAS
-- =====================================================

-- 1. VERIFICAR DUPLICATAS (clientes que aparecem em múltiplas colunas de status)
WITH clientes_por_coluna AS (
    SELECT 
        kc.id as coluna_id,
        kc.nome as coluna_nome,
        jsonb_array_elements_text(kc.clientes_ids)::uuid as cliente_id
    FROM kanban_colunas kc
    WHERE kc.clientes_ids IS NOT NULL
    AND (
        LOWER(kc.nome) LIKE '%ativo%' OR
        LOWER(kc.nome) LIKE '%inativo%' OR
        LOWER(kc.nome) LIKE '%pausado%'
    )
),
duplicatas AS (
    SELECT 
        cliente_id,
        COUNT(DISTINCT coluna_id) as total_colunas,
        array_agg(coluna_nome) as colunas
    FROM clientes_por_coluna
    GROUP BY cliente_id
    HAVING COUNT(DISTINCT coluna_id) > 1
)
SELECT 
    d.cliente_id,
    c.nome as cliente_nome,
    d.total_colunas,
    d.colunas
FROM duplicatas d
LEFT JOIN clientes c ON c.id = d.cliente_id
ORDER BY d.total_colunas DESC;

-- =====================================================
-- LIMPAR DUPLICATAS (manter apenas na primeira coluna encontrada)
-- =====================================================
-- ATENÇÃO: Execute apenas o SELECT acima primeiro para verificar
-- Depois, se quiser limpar, execute o código abaixo

DO $$
DECLARE
    cliente_duplicado UUID;
    coluna_manter UUID;
    colunas_remover UUID[];
    novos_ids JSONB;
    coluna_id_var UUID;
    i INTEGER;
BEGIN
    -- Para cada cliente duplicado
    FOR cliente_duplicado IN (
        SELECT DISTINCT cliente_id
        FROM (
            SELECT 
                kc.id as coluna_id,
                jsonb_array_elements_text(kc.clientes_ids)::uuid as cliente_id
            FROM kanban_colunas kc
            WHERE kc.clientes_ids IS NOT NULL
            AND (
                LOWER(kc.nome) LIKE '%ativo%' OR
                LOWER(kc.nome) LIKE '%inativo%' OR
                LOWER(kc.nome) LIKE '%pausado%'
            )
        ) subquery
        GROUP BY cliente_id
        HAVING COUNT(DISTINCT coluna_id) > 1
    ) LOOP
        -- Encontrar todas as colunas onde este cliente está
        SELECT array_agg(id ORDER BY nome)
        INTO colunas_remover
        FROM kanban_colunas
        WHERE (
            LOWER(nome) LIKE '%ativo%' OR
            LOWER(nome) LIKE '%inativo%' OR
            LOWER(nome) LIKE '%pausado%'
        )
        AND clientes_ids @> jsonb_build_array(cliente_duplicado::text);
        
        -- Manter na primeira coluna (ordem alfabética)
        SELECT id INTO coluna_manter
        FROM kanban_colunas
        WHERE id = ANY(colunas_remover)
        ORDER BY nome ASC
        LIMIT 1;
        
        -- Remover das outras colunas (iterar pelo array)
        FOR i IN 1..array_length(colunas_remover, 1) LOOP
            coluna_id_var := colunas_remover[i];
            
            -- Pular a coluna que queremos manter
            IF coluna_id_var = coluna_manter THEN
                CONTINUE;
            END IF;
            
            -- Remover cliente_id desta coluna
            SELECT jsonb_agg(elem::text)
            INTO novos_ids
            FROM jsonb_array_elements_text(
                (SELECT clientes_ids FROM kanban_colunas WHERE id = coluna_id_var)
            ) elem
            WHERE elem::uuid != cliente_duplicado;
            
            UPDATE kanban_colunas
            SET clientes_ids = novos_ids
            WHERE id = coluna_id_var;
            
            RAISE NOTICE '✅ Cliente % removido da coluna %', cliente_duplicado, coluna_id_var;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE '✅ Limpeza de duplicatas concluída!';
END $$;

-- 3. VERIFICAR RESULTADO FINAL
SELECT 
    nome as coluna_nome,
    jsonb_array_length(COALESCE(clientes_ids, '[]'::jsonb)) as total_clientes,
    clientes_ids
FROM kanban_colunas
WHERE (
    LOWER(nome) LIKE '%ativo%' OR
    LOWER(nome) LIKE '%inativo%' OR
    LOWER(nome) LIKE '%pausado%'
)
ORDER BY nome;

