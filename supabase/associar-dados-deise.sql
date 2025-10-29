-- ================================================
-- ASSOCIAR DADOS EXISTENTES À CONTA DA DEISE
-- Execute este script após criar a conta da Deise
-- Email: deisefaula@gmail.com
-- ================================================

-- ================================================
-- PASSO 0: Adicionar user_id nas tabelas se não existir
-- ================================================

-- Adicionar user_id em avaliacoes_fisicas
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_fisicas') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE avaliacoes_fisicas ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_avaliacoes_fisicas_user_id ON avaliacoes_fisicas(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em avaliacoes_fisicas';
        END IF;
    END IF;
END $$;

-- Adicionar user_id em avaliacoes_emocionais
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_emocionais') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'avaliacoes_emocionais' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE avaliacoes_emocionais ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_avaliacoes_emocionais_user_id ON avaliacoes_emocionais(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em avaliacoes_emocionais';
        END IF;
    END IF;
END $$;

-- Adicionar user_id em avaliacoes_comportamentais
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_comportamentais') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'avaliacoes_comportamentais' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE avaliacoes_comportamentais ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_avaliacoes_comportamentais_user_id ON avaliacoes_comportamentais(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em avaliacoes_comportamentais';
        END IF;
    END IF;
END $$;

-- Adicionar user_id em cardapios
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cardapios') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'cardapios' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE cardapios ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_cardapios_user_id ON cardapios(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em cardapios';
        END IF;
    END IF;
END $$;

-- Adicionar user_id em anamneses_respostas
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses_respostas') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'anamneses_respostas' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE anamneses_respostas ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_anamneses_respostas_user_id ON anamneses_respostas(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em anamneses_respostas';
        END IF;
    END IF;
END $$;

-- Adicionar user_id em menopausa_tracking
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menopausa_tracking') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'menopausa_tracking' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE menopausa_tracking ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_menopausa_tracking_user_id ON menopausa_tracking(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em menopausa_tracking';
        END IF;
    END IF;
END $$;

-- Verificar/adicionar user_id nas outras tabelas principais (se não existir)
DO $$ 
BEGIN
    -- clientes
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clientes') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'clientes' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE clientes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em clientes';
        END IF;
    END IF;

    -- eventos_agenda
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'eventos_agenda') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'eventos_agenda' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE eventos_agenda ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_eventos_user_id ON eventos_agenda(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em eventos_agenda';
        END IF;
    END IF;

    -- kanban_colunas
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_colunas') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'kanban_colunas' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE kanban_colunas ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_kanban_colunas_user_id ON kanban_colunas(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em kanban_colunas';
        END IF;
    END IF;

    -- configuracoes_profissional
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'configuracoes_profissional') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'configuracoes_profissional' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE configuracoes_profissional ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_config_profissional_user_id ON configuracoes_profissional(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em configuracoes_profissional';
        END IF;
    END IF;

    -- anamneses
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'anamneses' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE anamneses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_anamneses_user_id ON anamneses(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em anamneses';
        END IF;
    END IF;

    -- ciclos_menstruais
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ciclos_menstruais') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'ciclos_menstruais' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE ciclos_menstruais ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_ciclos_user_id ON ciclos_menstruais(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em ciclos_menstruais';
        END IF;
    END IF;

    -- sintomas_diarios
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sintomas_diarios') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'sintomas_diarios' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE sintomas_diarios ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            CREATE INDEX IF NOT EXISTS idx_sintomas_user_id ON sintomas_diarios(user_id);
            RAISE NOTICE '✅ Coluna user_id adicionada em sintomas_diarios';
        END IF;
    END IF;
END $$;

-- ================================================
-- PASSO 1: Buscar ID da Deise
-- ================================================

DO $$ 
DECLARE
    deise_user_id UUID;
    registros_atualizados INTEGER := 0;
BEGIN
    -- Buscar o ID da Deise pelo email
    SELECT id INTO deise_user_id
    FROM auth.users
    WHERE email = 'deisefaula@gmail.com'
    LIMIT 1;

    -- Verificar se encontrou o usuário
    IF deise_user_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário com email deisefaula@gmail.com não encontrado! Primeiro crie a conta da Deise.';
    END IF;

    RAISE NOTICE '✅ Usuário encontrado: % (ID: %)', 'deisefaula@gmail.com', deise_user_id;

    -- ================================================
    -- PASSO 2: Associar dados existentes
    -- ================================================

    -- Associar CLIENTES
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clientes') THEN
        UPDATE clientes 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Clientes associados: %', registros_atualizados;
    END IF;

    -- Associar AVALIAÇÕES FÍSICAS
    -- Primeiro associar diretamente por user_id IS NULL
    -- Depois associar através dos clientes que pertencem à Deise
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_fisicas') THEN
        -- Associação direta
        UPDATE avaliacoes_fisicas 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações físicas associadas (direto): %', registros_atualizados;
        
        -- Associação através dos clientes
        UPDATE avaliacoes_fisicas af
        SET user_id = deise_user_id
        WHERE af.user_id IS NULL
        AND EXISTS (
            SELECT 1 FROM clientes c
            WHERE c.id = af.cliente_id
            AND c.user_id = deise_user_id
        );
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações físicas associadas (via clientes): %', registros_atualizados;
    END IF;

    -- Associar AVALIAÇÕES EMOCIONAIS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_emocionais') THEN
        -- Associação direta
        UPDATE avaliacoes_emocionais 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações emocionais associadas (direto): %', registros_atualizados;
        
        -- Associação através dos clientes
        UPDATE avaliacoes_emocionais ae
        SET user_id = deise_user_id
        WHERE ae.user_id IS NULL
        AND EXISTS (
            SELECT 1 FROM clientes c
            WHERE c.id = ae.cliente_id
            AND c.user_id = deise_user_id
        );
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações emocionais associadas (via clientes): %', registros_atualizados;
    END IF;

    -- Associar AVALIAÇÕES COMPORTAMENTAIS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_comportamentais') THEN
        -- Associação direta
        UPDATE avaliacoes_comportamentais 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações comportamentais associadas (direto): %', registros_atualizados;
        
        -- Associação através dos clientes
        UPDATE avaliacoes_comportamentais ac
        SET user_id = deise_user_id
        WHERE ac.user_id IS NULL
        AND EXISTS (
            SELECT 1 FROM clientes c
            WHERE c.id = ac.cliente_id
            AND c.user_id = deise_user_id
        );
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações comportamentais associadas (via clientes): %', registros_atualizados;
    END IF;

    -- Associar EVENTOS DA AGENDA
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'eventos_agenda') THEN
        UPDATE eventos_agenda 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Eventos da agenda associados: %', registros_atualizados;
    END IF;

    -- Associar COLUNAS DO KANBAN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_colunas') THEN
        UPDATE kanban_colunas 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Colunas do Kanban associadas: %', registros_atualizados;
    END IF;

    -- Associar CARDÁPIOS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cardapios') THEN
        UPDATE cardapios 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Cardápios associados: %', registros_atualizados;
    END IF;

    -- Associar ANAMNESES
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses') THEN
        UPDATE anamneses 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Anamneses associadas: %', registros_atualizados;
    END IF;

    -- Associar RESPOSTAS DE ANAMNESES
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamneses_respostas') THEN
        UPDATE anamneses_respostas 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Respostas de anamneses associadas: %', registros_atualizados;
    END IF;

    -- Associar CONFIGURAÇÕES PROFISSIONAL
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'configuracoes_profissional') THEN
        UPDATE configuracoes_profissional 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Configurações profissionais associadas: %', registros_atualizados;
    END IF;

    -- Associar CICLOS MENSTRUAIS (Saúde Feminina)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ciclos_menstruais') THEN
        UPDATE ciclos_menstruais 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Ciclos menstruais associados: %', registros_atualizados;
    END IF;

    -- Associar SINTOMAS DIÁRIOS (Saúde Feminina)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sintomas_diarios') THEN
        UPDATE sintomas_diarios 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Sintomas diários associados: %', registros_atualizados;
    END IF;

    -- Associar MENOPAUSA TRACKING (Saúde Feminina)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menopausa_tracking') THEN
        UPDATE menopausa_tracking 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Menopausa tracking associado: %', registros_atualizados;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '🎉 Concluído! Todos os dados existentes foram associados à Deise Faula (%)', deise_user_id;
    RAISE NOTICE '📋 A Deise agora poderá ver todos esses dados ao fazer login no sistema.';

END $$;

-- ================================================
-- VERIFICAÇÃO: Ver quantos dados foram associados
-- ================================================

-- Descomente as queries abaixo para verificar os resultados:

/*
-- Ver resumo por tabela
SELECT 
    'clientes' as tabela,
    COUNT(*) as total,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as com_user_id
FROM clientes
UNION ALL
SELECT 
    'avaliacoes_fisicas',
    COUNT(*),
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END)
FROM avaliacoes_fisicas
UNION ALL
SELECT 
    'eventos_agenda',
    COUNT(*),
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END)
FROM eventos_agenda
UNION ALL
SELECT 
    'kanban_colunas',
    COUNT(*),
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END)
FROM kanban_colunas;

-- Ver dados da Deise especificamente
SELECT 
    'Clientes' as tipo,
    COUNT(*) as quantidade
FROM clientes
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'deisefaula@gmail.com')
UNION ALL
SELECT 
    'Avaliações Físicas',
    COUNT(*)
FROM avaliacoes_fisicas
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'deisefaula@gmail.com')
UNION ALL
SELECT 
    'Eventos Agenda',
    COUNT(*)
FROM eventos_agenda
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'deisefaula@gmail.com');
*/

