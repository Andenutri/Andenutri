-- ================================================
-- TORNAR CAMPOS OPCIONAIS NA TABELA CLIENTES
-- Todos os campos são opcionais EXCETO: nome e telefone
-- ================================================

DO $$ 
BEGIN
    -- 1. Tornar email opcional (remover UNIQUE e NOT NULL)
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'clientes_email_key'
    ) THEN
        ALTER TABLE clientes DROP CONSTRAINT clientes_email_key;
        RAISE NOTICE '✅ Constraint UNIQUE removida do email';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'email' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN email DROP NOT NULL;
        RAISE NOTICE '✅ Campo email agora é opcional';
    END IF;

    -- 2. Garantir que nome continua obrigatório
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'nome' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN nome SET NOT NULL;
        RAISE NOTICE '✅ Campo nome continua obrigatório';
    END IF;

    -- 3. Garantir que telefone é obrigatório
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'telefone' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN telefone SET NOT NULL;
        RAISE NOTICE '✅ Campo telefone é obrigatório';
    END IF;

    -- 4. Tornar whatsapp opcional (já deve ser, mas garantimos)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'whatsapp' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN whatsapp DROP NOT NULL;
        RAISE NOTICE '✅ Campo whatsapp agora é opcional';
    END IF;

    -- 5. Tornar instagram opcional (já deve ser, mas garantimos)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'instagram' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN instagram DROP NOT NULL;
        RAISE NOTICE '✅ Campo instagram agora é opcional';
    END IF;

    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Campos configurados com sucesso!';
    RAISE NOTICE '✅ OBRIGATÓRIOS: nome, telefone';
    RAISE NOTICE '✅ OPCIONAIS: email, whatsapp, instagram e todos os outros';
    RAISE NOTICE '========================================';
END $$;

-- Verificar resultado
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name IN ('nome', 'email', 'telefone', 'whatsapp', 'instagram')
ORDER BY 
    CASE column_name
        WHEN 'nome' THEN 1
        WHEN 'telefone' THEN 2
        WHEN 'email' THEN 3
        WHEN 'whatsapp' THEN 4
        WHEN 'instagram' THEN 5
    END;

