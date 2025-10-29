-- ================================================
-- SCRIPT PARA RESETAR SENHA DA DEISE
-- Este script cria uma função para resetar senha
-- Usar com cuidado e apenas em desenvolvimento
-- ================================================

-- ⚠️ ATENÇÃO: Este método requer permissões de administrador
-- O Supabase Auth não permite atualizar senhas diretamente via SQL
-- O método recomendado é usar o Dashboard do Supabase

-- Verificar se a função auth.uid() está disponível
DO $$ 
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '⚠️ AVISO IMPORTANTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'O Supabase Auth armazena senhas com hash bcrypt';
    RAISE NOTICE 'Não é possível definir senha diretamente via SQL';
    RAISE NOTICE '';
    RAISE NOTICE 'MÉTODOS RECOMENDADOS:';
    RAISE NOTICE '1. Use o Dashboard: Authentication → Users → Reset Password';
    RAISE NOTICE '2. Ou faça a Deise usar "Esqueci minha senha" na tela de login';
    RAISE NOTICE '';
    RAISE NOTICE 'Para definir senha "123456" temporariamente:';
    RAISE NOTICE '1. No Dashboard, vá em Authentication → Users';
    RAISE NOTICE '2. Encontre o usuário da Deise';
    RAISE NOTICE '3. Clique em "Reset Password" ou "Update User"';
    RAISE NOTICE '4. Defina senha: 123456';
    RAISE NOTICE '';
    RAISE NOTICE 'Após o primeiro login, ela pode trocar no sistema.';
    RAISE NOTICE '';
END $$;

-- Função para obter informações do usuário (apenas para verificação)
DO $$ 
DECLARE
    deise_user RECORD;
BEGIN
    -- Buscar usuário por email (substitua pelo email real da Deise)
    SELECT id, email, created_at, confirmed_at
    INTO deise_user
    FROM auth.users
    WHERE email ILIKE '%deise%'
    ORDER BY created_at ASC
    LIMIT 1;

    IF deise_user.id IS NOT NULL THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ Usuário encontrado:';
        RAISE NOTICE '   Email: %', deise_user.email;
        RAISE NOTICE '   ID: %', deise_user.id;
        RAISE NOTICE '   Criado em: %', deise_user.created_at;
        RAISE NOTICE '   Confirmado: %', deise_user.confirmed_at;
        RAISE NOTICE '';
        RAISE NOTICE 'Para resetar senha, use o Dashboard do Supabase.';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '⚠️ Usuário da Deise não encontrado.';
        RAISE NOTICE 'Verifique se ela já fez o registro no sistema.';
    END IF;
END $$;

-- Listar todos os usuários para referência
DO $$ 
DECLARE
    user_rec RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUÁRIOS REGISTRADOS:';
    RAISE NOTICE '========================================';
    
    FOR user_rec IN 
        SELECT id, email, created_at, confirmed_at
        FROM auth.users
        ORDER BY created_at ASC
    LOOP
        RAISE NOTICE 'Email: % | ID: % | Confirmado: %', 
            user_rec.email, 
            LEFT(user_rec.id::text, 8) || '...',
            CASE WHEN user_rec.confirmed_at IS NOT NULL THEN 'Sim' ELSE 'Não' END;
    END LOOP;
    
    RAISE NOTICE '';
END $$;

