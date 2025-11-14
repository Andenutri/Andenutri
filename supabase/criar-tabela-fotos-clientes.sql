-- ================================================
-- CRIAR TABELA: fotos_clientes
-- Para armazenar fotos de antes/depois dos clientes com metadados
-- ================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fotos_clientes') THEN
        CREATE TABLE fotos_clientes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            
            -- Informações da foto
            url TEXT NOT NULL, -- URL da foto no storage
            tipo TEXT NOT NULL CHECK (tipo IN ('antes', 'depois')),
            posicao TEXT DEFAULT 'frente' CHECK (posicao IN ('frente', 'lateral', 'costa', 'outra')),
            
            -- Metadados
            data_foto DATE NOT NULL DEFAULT CURRENT_DATE,
            anotacao TEXT,
            ordem INTEGER DEFAULT 0, -- Para ordenar múltiplas fotos da mesma posição
            
            -- Timestamps
            data_criacao TIMESTAMP DEFAULT NOW(),
            data_atualizacao TIMESTAMP DEFAULT NOW()
        );
        
        RAISE NOTICE '✅ Tabela fotos_clientes criada';
        
        -- Índices para buscas rápidas
        CREATE INDEX idx_fotos_cliente_id ON fotos_clientes(cliente_id);
        CREATE INDEX idx_fotos_user_id ON fotos_clientes(user_id);
        CREATE INDEX idx_fotos_tipo ON fotos_clientes(tipo);
        CREATE INDEX idx_fotos_data ON fotos_clientes(data_foto);
        
        RAISE NOTICE '✅ Índices criados';
        
        -- RLS (Row Level Security)
        ALTER TABLE fotos_clientes ENABLE ROW LEVEL SECURITY;
        
        -- Política: Usuários só podem ver suas próprias fotos
        CREATE POLICY "Usuários podem ver suas próprias fotos"
            ON fotos_clientes FOR SELECT
            USING (auth.uid() = user_id);
        
        -- Política: Usuários podem inserir suas próprias fotos
        CREATE POLICY "Usuários podem inserir suas próprias fotos"
            ON fotos_clientes FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        
        -- Política: Usuários podem atualizar suas próprias fotos
        CREATE POLICY "Usuários podem atualizar suas próprias fotos"
            ON fotos_clientes FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        
        -- Política: Usuários podem deletar suas próprias fotos
        CREATE POLICY "Usuários podem deletar suas próprias fotos"
            ON fotos_clientes FOR DELETE
            USING (auth.uid() = user_id);
        
        RAISE NOTICE '✅ RLS configurado';
        
    ELSE
        RAISE NOTICE '⚠️ Tabela fotos_clientes já existe, ignorando criação.';
    END IF;
END $$;

-- Trigger para atualizar data_atualizacao (fora do bloco DO)
CREATE OR REPLACE FUNCTION atualizar_data_fotos_clientes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger (se a tabela existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fotos_clientes') THEN
        DROP TRIGGER IF EXISTS trigger_atualizar_data_fotos_clientes ON fotos_clientes;
        CREATE TRIGGER trigger_atualizar_data_fotos_clientes
            BEFORE UPDATE ON fotos_clientes
            FOR EACH ROW
            EXECUTE FUNCTION atualizar_data_fotos_clientes();
        
        RAISE NOTICE '✅ Trigger criado';
    END IF;
END $$;

-- Mensagem de sucesso
DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Tabela fotos_clientes configurada com sucesso!';
  RAISE NOTICE '✅ Suporta fotos de antes/depois';
  RAISE NOTICE '✅ Suporta múltiplas posições (frente, lateral, costa, outra)';
  RAISE NOTICE '✅ Suporta anotações e datas';
  RAISE NOTICE '========================================';
END $$;

