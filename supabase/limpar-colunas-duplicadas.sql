-- Script para limpar colunas duplicadas do Kanban
-- Remove colunas com nomes duplicados, mantendo apenas a primeira de cada tipo

-- Primeiro, vamos ver quais colunas duplicadas existem
SELECT 
    nome,
    COUNT(*) as total,
    array_agg(id) as ids
FROM kanban_colunas
GROUP BY nome
HAVING COUNT(*) > 1;

-- Remover colunas duplicadas mantendo apenas a primeira de cada tipo (menor ordem ou menor id)
-- ATENÇÃO: Execute apenas se tiver certeza que quer remover duplicatas
-- Comentar o DELETE e executar apenas o SELECT primeiro para verificar

WITH duplicadas AS (
    SELECT 
        id,
        nome,
        ordem,
        ROW_NUMBER() OVER (
            PARTITION BY LOWER(TRIM(nome)) 
            ORDER BY ordem ASC, id ASC
        ) as rn
    FROM kanban_colunas
)
DELETE FROM kanban_colunas
WHERE id IN (
    SELECT id FROM duplicadas WHERE rn > 1
);

-- Verificar resultado
SELECT 
    nome,
    COUNT(*) as total
FROM kanban_colunas
GROUP BY nome
ORDER BY nome;

