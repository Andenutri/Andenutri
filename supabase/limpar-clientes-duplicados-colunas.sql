-- Script para limpar clientes duplicados nas colunas do Kanban
-- Remove clientes que estão em múltiplas colunas ao mesmo tempo

-- 1. Verificar clientes duplicados (mesmo cliente_id em múltiplas colunas)
SELECT 
    cliente_id,
    COUNT(*) as total_colunas,
    array_agg(column_id) as colunas
FROM (
    SELECT 
        id as column_id,
        jsonb_array_elements_text(clientes_ids)::uuid as cliente_id
    FROM kanban_colunas
    WHERE clientes_ids IS NOT NULL
) subquery
GROUP BY cliente_id
HAVING COUNT(*) > 1;

-- 2. Limpar duplicatas: manter cliente apenas na primeira coluna (menor ordem ou menor ID)
-- ATENÇÃO: Execute apenas se tiver certeza
-- Comentar o UPDATE e executar apenas o SELECT primeiro para verificar

WITH duplicados AS (
    SELECT 
        column_id,
        cliente_id,
        ROW_NUMBER() OVER (
            PARTITION BY cliente_id 
            ORDER BY 
                (SELECT ordem FROM kanban_colunas WHERE id = column_id),
                column_id
        ) as rn
    FROM (
        SELECT 
            kc.id as column_id,
            jsonb_array_elements_text(kc.clientes_ids)::uuid as cliente_id
        FROM kanban_colunas kc
        WHERE kc.clientes_ids IS NOT NULL
    ) subquery
),
clientes_para_remover AS (
    SELECT column_id, cliente_id
    FROM duplicados
    WHERE rn > 1
)
UPDATE kanban_colunas
SET clientes_ids = (
    SELECT jsonb_agg(elem::text)
    FROM jsonb_array_elements_text(clientes_ids) elem
    WHERE elem::uuid NOT IN (
        SELECT cliente_id::text
        FROM clientes_para_remover
        WHERE column_id = kanban_colunas.id
    )
)
WHERE EXISTS (
    SELECT 1 FROM clientes_para_remover
    WHERE column_id = kanban_colunas.id
);

-- 3. Verificar resultado após limpeza
SELECT 
    nome,
    jsonb_array_length(COALESCE(clientes_ids, '[]'::jsonb)) as total_clientes
FROM kanban_colunas
ORDER BY ordem;

