-- ================================================
-- VERIFICAÇÃO E CORREÇÃO DA ESTRUTURA DO SUPABASE
-- Este script verifica e adiciona campos necessários
-- ================================================

-- ================================================
-- 1. VERIFICAR E ADICIONAR CAMPOS FALTANTES EM CLIENTES
-- ================================================

DO $$ 
BEGIN
    -- user_id (para isolamento multi-usuário)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE clientes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
        RAISE NOTICE '✅ Adicionado campo user_id em clientes';
    END IF;

    -- perfil
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'perfil'
    ) THEN
        ALTER TABLE clientes ADD COLUMN perfil TEXT;
        RAISE NOTICE '✅ Adicionado campo perfil em clientes';
    END IF;

    -- is_lead
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'is_lead'
    ) THEN
        ALTER TABLE clientes ADD COLUMN is_lead BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Adicionado campo is_lead em clientes';
    END IF;

    -- codigo_reavaliacao
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'codigo_reavaliacao'
    ) THEN
        ALTER TABLE clientes ADD COLUMN codigo_reavaliacao TEXT UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_clientes_codigo_reavaliacao ON clientes(codigo_reavaliacao);
        RAISE NOTICE '✅ Adicionado campo codigo_reavaliacao em clientes';
    END IF;

    -- Remover restrição UNIQUE do email se for necessário permitir emails duplicados entre usuários
    -- (Isso é opcional, mas pode ser necessário para multi-tenant)
    
    RAISE NOTICE '✅ Verificação de campos em clientes concluída';
END $$;

-- ================================================
-- 2. VERIFICAR SE TABELA reavaliacoes_respostas EXISTE
-- ================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'reavaliacoes_respostas'
    ) THEN
        CREATE TABLE reavaliacoes_respostas (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          
          -- Perguntas da Reavalição
          peso_atual TEXT,
          mudancas_corpo_disposicao TEXT,
          energia_dia TEXT,
          intestino_sono TEXT,
          rotina_alimentacao_organizada TEXT,
          refeicoes_faceis TEXT,
          refeicoes_desafiadoras TEXT,
          agua_suplementos TEXT,
          atividade_fisica TEXT,
          o_que_ajudou TEXT,
          o_que_atrapalhou TEXT,
          programa_ajudou TEXT,
          programa_ajudar_mais TEXT,
          mudar_estrategia TEXT,
          maior_foco_nova_fase TEXT,
          
          data_preenchimento TIMESTAMP DEFAULT NOW(),
          data_criacao TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_reavaliacoes_cliente_id ON reavaliacoes_respostas(cliente_id);
        CREATE INDEX IF NOT EXISTS idx_reavaliacoes_user_id ON reavaliacoes_respostas(user_id);
        CREATE INDEX IF NOT EXISTS idx_reavaliacoes_data_preenchimento ON reavaliacoes_respostas(data_preenchimento DESC);

        RAISE NOTICE '✅ Tabela reavaliacoes_respostas criada';
    ELSE
        RAISE NOTICE '✅ Tabela reavaliacoes_respostas já existe';
    END IF;
END $$;

-- ================================================
-- 3. LISTAR TODOS OS CAMPOS DA TABELA CLIENTES
-- ================================================

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes'
ORDER BY ordinal_position;

-- ================================================
-- 4. VERIFICAR SE HÁ DADOS ÓRFÃOS (SEM user_id)
-- ================================================

SELECT 
    COUNT(*) as clientes_sem_user_id
FROM clientes
WHERE user_id IS NULL;

-- ================================================
-- 5. GERAR CÓDIGOS DE REAVALIAÇÃO PARA CLIENTES SEM CÓDIGO
-- ================================================

DO $$
DECLARE
    cliente_rec RECORD;
    novo_codigo TEXT;
BEGIN
    FOR cliente_rec IN SELECT id FROM clientes WHERE codigo_reavaliacao IS NULL OR codigo_reavaliacao = ''
    LOOP
        -- Gerar código único baseado no UUID (primeiros 8 caracteres)
        novo_codigo := UPPER(SUBSTRING(REPLACE(cliente_rec.id::TEXT, '-', ''), 1, 8));
        
        -- Garantir que é único (adicionar números se necessário)
        WHILE EXISTS (SELECT 1 FROM clientes WHERE codigo_reavaliacao = novo_codigo) LOOP
            novo_codigo := novo_codigo || FLOOR(RANDOM() * 1000)::TEXT;
        END LOOP;
        
        UPDATE clientes 
        SET codigo_reavaliacao = novo_codigo
        WHERE id = cliente_rec.id;
    END LOOP;
    
    RAISE NOTICE '✅ Códigos de reavaliação gerados para clientes sem código';
END $$;

-- ================================================
-- 6. RESUMO FINAL
-- ================================================

DO $$
DECLARE
    total_clientes INTEGER;
    clientes_com_user_id INTEGER;
    clientes_com_codigo INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_clientes FROM clientes;
    SELECT COUNT(*) INTO clientes_com_user_id FROM clientes WHERE user_id IS NOT NULL;
    SELECT COUNT(*) INTO clientes_com_codigo FROM clientes WHERE codigo_reavaliacao IS NOT NULL;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESUMO DA ESTRUTURA';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total de clientes: %', total_clientes;
    RAISE NOTICE 'Clientes com user_id: %', clientes_com_user_id;
    RAISE NOTICE 'Clientes com codigo_reavaliacao: %', clientes_com_codigo;
    RAISE NOTICE '========================================';
END $$;

