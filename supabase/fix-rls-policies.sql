-- ================================================
-- CORREÇÃO RLS (Row Level Security) - ANDENUTRI
-- Execute este script no SQL Editor do Supabase
-- ================================================

-- Desabilitar RLS temporariamente para desenvolvimento
-- IMPORTANTE: Para produção, configure as políticas adequadas!

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

-- OU se preferir manter RLS habilitado, crie políticas mais permissivas:

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

-- Criar políticas que permitem TUDO sem autenticação (APENAS PARA DESENVOLVIMENTO)
CREATE POLICY "Allow all operations" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON formularios_pre_consulta FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON avaliacoes_fisicas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON avaliacoes_emocionais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON avaliacoes_comportamentais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON cardapios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON kanban_colunas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON planos_assinatura FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON consultas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON reavaliacoes FOR ALL USING (true) WITH CHECK (true);

-- ================================================
-- FIM DA CORREÇÃO
-- ================================================

