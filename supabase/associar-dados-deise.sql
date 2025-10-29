-- ================================================
-- ASSOCIAR DADOS EXISTENTES À CONTA DA DEISE
-- Execute este script após criar a conta da Deise
-- Email: deisefaula@gmail.com
-- ================================================

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
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_fisicas') THEN
        UPDATE avaliacoes_fisicas 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações físicas associadas: %', registros_atualizados;
    END IF;

    -- Associar AVALIAÇÕES EMOCIONAIS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_emocionais') THEN
        UPDATE avaliacoes_emocionais 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações emocionais associadas: %', registros_atualizados;
    END IF;

    -- Associar AVALIAÇÕES COMPORTAMENTAIS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avaliacoes_comportamentais') THEN
        UPDATE avaliacoes_comportamentais 
        SET user_id = deise_user_id 
        WHERE user_id IS NULL;
        
        GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
        RAISE NOTICE '✅ Avaliações comportamentais associadas: %', registros_atualizados;
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

