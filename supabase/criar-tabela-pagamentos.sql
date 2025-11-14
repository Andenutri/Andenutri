-- ================================================
-- CRIAR TABELA DE PAGAMENTOS
-- Para registrar pagamentos dos clientes
-- ================================================

CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  valor DECIMAL(10,2) NOT NULL,
  forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN (
    'dinheiro',
    'pix',
    'cartao_credito',
    'cartao_debito',
    'transferencia',
    'boleto',
    'outro'
  )),
  data_pagamento DATE NOT NULL,
  observacoes TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_cliente ON pagamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_user ON pagamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON pagamentos(data_pagamento);
CREATE INDEX IF NOT EXISTS idx_pagamentos_forma ON pagamentos(forma_pagamento);

-- RLS (Row Level Security)
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios pagamentos
CREATE POLICY "Users can view their own payments"
  ON pagamentos FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir seus próprios pagamentos
CREATE POLICY "Users can insert their own payments"
  ON pagamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios pagamentos
CREATE POLICY "Users can update their own payments"
  ON pagamentos FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios pagamentos
CREATE POLICY "Users can delete their own payments"
  ON pagamentos FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_pagamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pagamentos_updated_at
  BEFORE UPDATE ON pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_pagamentos_updated_at();

-- Trigger para preencher user_id automaticamente
CREATE OR REPLACE FUNCTION set_pagamentos_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_pagamentos_user_id
  BEFORE INSERT ON pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION set_pagamentos_user_id();

-- Mensagem de sucesso
DO $$ 
BEGIN
  RAISE NOTICE '✅ Tabela pagamentos criada com sucesso!';
  RAISE NOTICE '✅ Índices criados';
  RAISE NOTICE '✅ RLS configurado';
  RAISE NOTICE '✅ Triggers criados';
END $$;

