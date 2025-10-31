-- ================================================
-- TORNAR EMAIL OPCIONAL NA TABELA CLIENTES
-- Permite salvar cliente mesmo sem preencher email
-- ================================================

-- Remover constraint UNIQUE e NOT NULL do email
DO $$ 
BEGIN
    -- Remover constraint UNIQUE se existir
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'clientes_email_key'
    ) THEN
        ALTER TABLE clientes DROP CONSTRAINT clientes_email_key;
        RAISE NOTICE '✅ Constraint UNIQUE removida do email';
    END IF;
    
    -- Tornar email nullable se ainda não for
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'email' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN email DROP NOT NULL;
        RAISE NOTICE '✅ Campo email agora é opcional';
    END IF;
    
    RAISE NOTICE '✅ Email agora é opcional. Cliente pode ser salvo sem email.';
END $$;

-- Verificar resultado
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes' 
AND column_name = 'email';

