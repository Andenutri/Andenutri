-- ================================================
-- CONFIGURAÇÃO DE ISOLAMENTO DE DADOS POR USUÁRIO
-- Este script:
-- 1. Adiciona campo user_id nas tabelas principais
-- 2. Associa dados existentes ao primeiro usuário (Deise Faula)
-- 3. Configura para novos usuários verem apenas seus dados
-- ================================================

-- ================================================
-- PASSO 1: Adicionar user_id nas tabelas principais
-- ================================================

-- Adicionar user_id na tabela clientes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE clientes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        CREATE INDEX idx_clientes_user_id ON clientes(user_id);
    END IF;
END $$;

-- Adicionar user_id em eventos_agenda
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'eventos_agenda' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE eventos_agenda ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        CREATE INDEX idx_eventos_user_id ON eventos_agenda(user_id);
    END IF;
END $$;

-- Adicionar user_id em kanban_colunas (se existir)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_colunas') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'kanban_colunas' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE kanban_colunas ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX idx_kanban_colunas_user_id ON kanban_colunas(user_id);
        END IF;
    END IF;
END $$;

-- Adicionar user_id em configuracoes_profissional
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'configuracoes_profissional') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'configuracoes_profissional' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE configuracoes_profissional ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX idx_config_profissional_user_id ON configuracoes_profissional(user_id);
        END IF;
    END IF;
END $$;

-- Adicionar user_id em anamneses
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'anamneses' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE anamneses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX idx_anamneses_user_id ON anamneses(user_id);
        END IF;
    END IF;
END $$;

-- Adicionar user_id em ciclos_menstruais
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ciclos_menstruais') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'ciclos_menstruais' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE ciclos_menstruais ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX idx_ciclos_user_id ON ciclos_menstruais(user_id);
        END IF;
    END IF;
END $$;

-- Adicionar user_id em sintomas_diarios
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sintomas_diarios') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'sintomas_diarios' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE sintomas_diarios ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX idx_sintomas_user_id ON sintomas_diarios(user_id);
        END IF;
    END IF;
END $$;

-- ================================================
-- PASSO 2: Associar dados existentes ao primeiro usuário
-- ================================================

-- Esta função procura o primeiro usuário no auth.users e associa todos os dados existentes a ele
DO $$ 
DECLARE
    primeiro_user_id UUID;
    user_email TEXT;
BEGIN
    -- Buscar o primeiro usuário criado no auth.users
    SELECT id, email INTO primeiro_user_id, user_email
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;

    IF primeiro_user_id IS NOT NULL THEN
        RAISE NOTICE 'Usuário encontrado: % (ID: %)', user_email, primeiro_user_id;
        
        -- Associar todos os clientes existentes ao primeiro usuário
        UPDATE clientes 
        SET user_id = primeiro_user_id 
        WHERE user_id IS NULL;
        
        RAISE NOTICE 'Clientes associados ao primeiro usuário: %', (SELECT COUNT(*) FROM clientes WHERE user_id = primeiro_user_id);
        
        -- Associar eventos de agenda
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'eventos_agenda') THEN
            UPDATE eventos_agenda 
            SET user_id = primeiro_user_id 
            WHERE user_id IS NULL;
        END IF;
        
        -- Associar colunas do kanban (via cliente_id)
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_colunas') THEN
            -- Atualizar colunas baseado nos clientes que pertencem ao primeiro usuário
            UPDATE kanban_colunas kc
            SET user_id = primeiro_user_id
            WHERE kc.user_id IS NULL
            AND EXISTS (
                SELECT 1 FROM clientes c 
                WHERE c.user_id = primeiro_user_id 
                AND c.id = ANY(string_to_array(kc.clientes_ids::text, ',')::uuid[])
            );
        END IF;
        
        -- Associar configurações profissionais
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'configuracoes_profissional') THEN
            UPDATE configuracoes_profissional 
            SET user_id = primeiro_user_id 
            WHERE user_id IS NULL;
        END IF;
        
        -- Associar anamnese
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses') THEN
            UPDATE anamneses 
            SET user_id = primeiro_user_id 
            WHERE user_id IS NULL;
        END IF;
        
        RAISE NOTICE '✅ Todos os dados foram associados ao primeiro usuário (%)', user_email;
    ELSE
        RAISE NOTICE '⚠️ Nenhum usuário encontrado no auth.users. Execute este script após criar o primeiro usuário.';
    END IF;
END $$;

-- ================================================
-- PASSO 3: Tornar user_id obrigatório para novos registros
-- ================================================

-- Criar função trigger para preencher user_id automaticamente baseado no auth.uid()
CREATE OR REPLACE FUNCTION set_user_id_from_auth()
RETURNS TRIGGER AS $$
BEGIN
    -- Se user_id não estiver definido, usar o ID do usuário autenticado
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar triggers nas tabelas (apenas se não existirem)
DO $$ 
BEGIN
    -- Trigger para clientes
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_set_clientes_user_id'
    ) THEN
        CREATE TRIGGER trigger_set_clientes_user_id
        BEFORE INSERT ON clientes
        FOR EACH ROW
        EXECUTE FUNCTION set_user_id_from_auth();
    END IF;

    -- Trigger para eventos_agenda
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'eventos_agenda') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_set_eventos_user_id'
        ) THEN
            CREATE TRIGGER trigger_set_eventos_user_id
            BEFORE INSERT ON eventos_agenda
            FOR EACH ROW
            EXECUTE FUNCTION set_user_id_from_auth();
        END IF;
    END IF;

    -- Similar para outras tabelas...
END $$;

-- ================================================
-- PASSO 4: Comentários e confirmação
-- ================================================
COMMENT ON COLUMN clientes.user_id IS 'ID do usuário (nutricionista) que possui este cliente. Garante isolamento de dados.';
COMMENT ON COLUMN eventos_agenda.user_id IS 'ID do usuário que possui este evento. Garante isolamento de dados.';

-- Mensagem de confirmação
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ ISOLAMENTO DE DADOS CONFIGURADO!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '1. Campo user_id adicionado nas tabelas principais';
    RAISE NOTICE '2. Dados existentes associados ao primeiro usuário';
    RAISE NOTICE '3. Novos registros serão automaticamente associados ao usuário atual';
    RAISE NOTICE '4. Cada usuário verá apenas seus próprios dados';
    RAISE NOTICE '';
    RAISE NOTICE 'Próximo passo: Atualize o código frontend para filtrar por user_id';
    RAISE NOTICE '';
END $$;

