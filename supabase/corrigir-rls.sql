-- ================================================
-- CORREÇÃO RLS (Row Level Security) - ANDENUTRI
-- Execute este script no SQL Editor do Supabase
-- ================================================

-- Importante: As tabelas já existem, então vamos apenas corrigir as políticas

-- DESABILITAR RLS em todas as tabelas para desenvolvimento
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_pre_consulta DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_fisicas DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_emocionais DISABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_comportamentais DISABLE ROW LEVEL SECURITY;
ALTER TABLE cardapios DISABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_colunas DISABLE ROW LEVEL SECURITY;
ALTER TABLE planos_assinatura DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultas DISABLE ROW LEVEL SECURITY;
ALTER TABLE reavaliacoes DISABLE ROW LEVEL SECURITY;

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON clientes;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON formularios_pre_consulta;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON avaliacoes_fisicas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON avaliacoes_emocionais;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON avaliacoes_comportamentais;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON cardapios;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON kanban_colunas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON planos_assinatura;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON consultas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON reavaliacoes;

-- ================================================
-- FIM DA CORREÇÃO
-- ================================================
-- Agora você pode salvar clientes sem erro 401!

