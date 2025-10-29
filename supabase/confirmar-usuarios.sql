-- ================================================
-- IMPORTANTE: Este script NÃO funciona diretamente!
-- ================================================
-- 
-- A coluna `confirmed_at` é uma coluna GERADA automaticamente
-- pelo Supabase e NÃO pode ser atualizada via SQL UPDATE.
--
-- ERRO que você receberá:
-- "ERROR: 428C9: column 'confirmed_at' can only be updated to DEFAULT"
-- "DETAIL: Column 'confirmed_at' is a generated column."
--
-- ================================================
-- SOLUÇÃO: Confirmar via Dashboard do Supabase
-- ================================================
--
-- Opção 1: Manual (um por um)
-- 1. Acesse: Authentication → Users
-- 2. Clique nos 3 pontos (⋮) ao lado de cada usuário
-- 3. Selecione "Confirm User"
--
-- Opção 2: Via Supabase Admin API (avançado)
-- Use a API administrativa do Supabase para confirmar usuários programaticamente
--
-- ================================================
-- Verificar usuários não confirmados
-- ================================================
-- Este query você PODE executar para ver quais usuários não estão confirmados:

SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    email_confirmed_at,
    CASE 
        WHEN confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '❌ Não confirmado'
    END as status
FROM auth.users
ORDER BY created_at DESC;

-- ================================================
-- Solução Alternativa: Desabilitar confirmação
-- ================================================
-- Em vez de confirmar usuários um por um, você pode:
--
-- 1. Desabilitar a necessidade de confirmação:
--    - Vá em Authentication → Providers → Email
--    - Desabilite "Enable email confirmations"
--
-- 2. Depois disso, novos usuários não precisarão confirmar email
--
-- ================================================

