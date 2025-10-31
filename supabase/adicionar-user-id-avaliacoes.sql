-- Adicionar coluna user_id nas tabelas de avaliações emocionais e comportamentais

-- 1. Adicionar user_id em avaliacoes_emocionais
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_emocionais' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE avaliacoes_emocionais 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        CREATE INDEX IF NOT EXISTS idx_avaliacoes_emocionais_user_id 
        ON avaliacoes_emocionais(user_id);
        
        RAISE NOTICE '✅ Coluna user_id adicionada em avaliacoes_emocionais';
    ELSE
        RAISE NOTICE '⚠️ Coluna user_id já existe em avaliacoes_emocionais';
    END IF;
END $$;

-- 2. Adicionar user_id em avaliacoes_comportamentais
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'avaliacoes_comportamentais' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE avaliacoes_comportamentais 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        CREATE INDEX IF NOT EXISTS idx_avaliacoes_comportamentais_user_id 
        ON avaliacoes_comportamentais(user_id);
        
        RAISE NOTICE '✅ Coluna user_id adicionada em avaliacoes_comportamentais';
    ELSE
        RAISE NOTICE '⚠️ Coluna user_id já existe em avaliacoes_comportamentais';
    END IF;
END $$;

-- 3. Associar avaliações existentes ao primeiro usuário (se necessário)
DO $$
DECLARE
    primeiro_user_id UUID;
BEGIN
    -- Pegar o primeiro usuário cadastrado
    SELECT id INTO primeiro_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- Se houver usuário e avaliações sem user_id, associar
    IF primeiro_user_id IS NOT NULL THEN
        UPDATE avaliacoes_emocionais 
        SET user_id = primeiro_user_id 
        WHERE user_id IS NULL;
        
        UPDATE avaliacoes_comportamentais 
        SET user_id = primeiro_user_id 
        WHERE user_id IS NULL;
        
        RAISE NOTICE '✅ Avaliações existentes associadas ao primeiro usuário';
    END IF;
END $$;

