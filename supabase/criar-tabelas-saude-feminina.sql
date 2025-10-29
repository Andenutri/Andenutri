-- =====================================================
-- TABELAS PARA SAÚDE FEMININA - ANDENUTRI
-- Sistema de acompanhamento do ciclo menstrual e menopausa
-- =====================================================

-- 1. Tabela de Ciclos Menstruais
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ciclos_menstruais') THEN
    CREATE TABLE public.ciclos_menstruais (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
      data_inicio DATE NOT NULL,
      data_fim DATE,
      duracao_ciclo INTEGER, -- Duração total do ciclo em dias
      duracao_menstruacao INTEGER, -- Duração da menstruação em dias
      intensidade VARCHAR(20) DEFAULT 'normal', -- leve, normal, moderada, intensa
      notas TEXT,
      data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT valid_intensidade CHECK (intensidade IN ('leve', 'normal', 'moderada', 'intensa'))
    );
    
    -- Índices para performance
    CREATE INDEX idx_ciclos_cliente ON public.ciclos_menstruais(cliente_id);
    CREATE INDEX idx_ciclos_data_inicio ON public.ciclos_menstruais(data_inicio);
    
    -- Comentários
    COMMENT ON TABLE public.ciclos_menstruais IS 'Registro de ciclos menstruais dos clientes';
  END IF;
END $$;

-- 2. Tabela de Sintomas Diários
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sintomas_diarios') THEN
    CREATE TABLE public.sintomas_diarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
      data DATE NOT NULL,
      
      -- Sintomas físicos
      colicas BOOLEAN DEFAULT false,
      intensidade_colicas INTEGER, -- 1-5
      dor_cabeca BOOLEAN DEFAULT false,
      inchaco BOOLEAN DEFAULT false,
      sensibilidade_mamas BOOLEAN DEFAULT false,
      dor_lombar BOOLEAN DEFAULT false,
      nauseas BOOLEAN DEFAULT false,
      
      -- Bem-estar emocional
      humor VARCHAR(20) DEFAULT 'normal', -- muito-baixo, baixo, normal, bom, muito-bom
      energia VARCHAR(20) DEFAULT 'media', -- muito-baixa, baixa, media, alta, muito-alta
      libido VARCHAR(20) DEFAULT 'normal', -- muito-baixa, baixa, normal, alta, muito-alta
      ansiedade INTEGER, -- 1-5
      irritabilidade INTEGER, -- 1-5
      
      -- Outros sintomas
      qualidade_sono INTEGER, -- 1-5
      apetite VARCHAR(20), -- muito-baixo, baixo, normal, alto, muito-alto
      acne BOOLEAN DEFAULT false,
      prisao_ventre BOOLEAN DEFAULT false,
      
      -- Notas adicionais
      notas TEXT,
      
      data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_humor CHECK (humor IN ('muito-baixo', 'baixo', 'normal', 'bom', 'muito-bom')),
      CONSTRAINT valid_energia CHECK (energia IN ('muito-baixa', 'baixa', 'media', 'alta', 'muito-alta')),
      CONSTRAINT valid_libido CHECK (libido IN ('muito-baixa', 'baixa', 'normal', 'alta', 'muito-alta')),
      CONSTRAINT valid_apetite CHECK (apetite IS NULL OR apetite IN ('muito-baixo', 'baixo', 'normal', 'alto', 'muito-alto')),
      CONSTRAINT unique_cliente_data UNIQUE (cliente_id, data)
    );
    
    -- Índices
    CREATE INDEX idx_sintomas_cliente ON public.sintomas_diarios(cliente_id);
    CREATE INDEX idx_sintomas_data ON public.sintomas_diarios(data);
    
    COMMENT ON TABLE public.sintomas_diarios IS 'Registro diário de sintomas e bem-estar';
  END IF;
END $$;

-- 3. Tabela de Tracking de Menopausa
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menopausa_tracking') THEN
    CREATE TABLE public.menopausa_tracking (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
      data DATE NOT NULL,
      
      -- Sintomas comuns da menopausa
      ondas_calor BOOLEAN DEFAULT false,
      intensidade_ondas_calor INTEGER, -- 1-5
      frequencia_ondas_calor VARCHAR(50), -- ex: "3-5x/dia", "2x/semana"
      
      suores_noturnos BOOLEAN DEFAULT false,
      intensidade_suores INTEGER,
      
      disturbios_sono BOOLEAN DEFAULT false,
      qualidade_sono INTEGER, -- 1-5
      
      mudancas_humor BOOLEAN DEFAULT false,
      intensidade_humor INTEGER,
      
      secura_vaginal BOOLEAN DEFAULT false,
      intensidade_secura INTEGER,
      
      fadiga BOOLEAN DEFAULT false,
      intensidade_fadiga INTEGER,
      
      ansiedade BOOLEAN DEFAULT false,
      intensidade_ansiedade INTEGER,
      
      irritabilidade BOOLEAN DEFAULT false,
      intensidade_irritabilidade INTEGER,
      
      esquecimento BOOLEAN DEFAULT false,
      dores_articulacoes BOOLEAN DEFAULT false,
      ganho_peso BOOLEAN DEFAULT false,
      perda_cabelo BOOLEAN DEFAULT false,
      
      -- Tratamentos
      terapia_hormonal BOOLEAN DEFAULT false,
      suplementos TEXT,
      medicamentos TEXT,
      
      -- Notas
      notas TEXT,
      
      data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT unique_cliente_data_menopausa UNIQUE (cliente_id, data)
    );
    
    -- Índices
    CREATE INDEX idx_menopausa_cliente ON public.menopausa_tracking(cliente_id);
    CREATE INDEX idx_menopausa_data ON public.menopausa_tracking(data);
    
    COMMENT ON TABLE public.menopausa_tracking IS 'Tracking de sintomas de menopausa e perimenopausa';
  END IF;
END $$;

-- 4. Tabela de Configurações do Ciclo (opcional - para armazenar preferências)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'configuracoes_ciclo') THEN
    CREATE TABLE public.configuracoes_ciclo (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL UNIQUE REFERENCES public.clientes(id) ON DELETE CASCADE,
      
      -- Duração média do ciclo
      duracao_ciclo_media INTEGER DEFAULT 28,
      duracao_menstruacao_media INTEGER DEFAULT 5,
      
      -- Status atual
      status VARCHAR(20) DEFAULT 'ciclo-regular', -- ciclo-regular, perimenopausa, menopausa
      
      -- Preferências de notificação
      notificar_proxima_menstruacao BOOLEAN DEFAULT true,
      notificar_periodo_fertil BOOLEAN DEFAULT true,
      notificar_ovulacao BOOLEAN DEFAULT true,
      
      -- Metas de bem-estar
      meta_exercicios_mes INTEGER,
      meta_sono_horas DECIMAL(4,1),
      
      data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_status CHECK (status IN ('ciclo-regular', 'perimenopausa', 'menopausa'))
    );
    
    CREATE INDEX idx_config_ciclo_cliente ON public.configuracoes_ciclo(cliente_id);
    
    COMMENT ON TABLE public.configuracoes_ciclo IS 'Configurações e preferências do ciclo menstrual por cliente';
  END IF;
END $$;

-- Triggers para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
DO $$ 
BEGIN
  -- Ciclos menstruais
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ciclos_updated_at'
  ) THEN
    CREATE TRIGGER update_ciclos_updated_at
      BEFORE UPDATE ON public.ciclos_menstruais
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Sintomas diários
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_sintomas_updated_at'
  ) THEN
    CREATE TRIGGER update_sintomas_updated_at
      BEFORE UPDATE ON public.sintomas_diarios
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Menopausa tracking
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_menopausa_updated_at'
  ) THEN
    CREATE TRIGGER update_menopausa_updated_at
      BEFORE UPDATE ON public.menopausa_tracking
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Configurações ciclo
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_config_ciclo_updated_at'
  ) THEN
    CREATE TRIGGER update_config_ciclo_updated_at
      BEFORE UPDATE ON public.configuracoes_ciclo
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Comentários finais
COMMENT ON TABLE public.ciclos_menstruais IS 'Registro de ciclos menstruais completos';
COMMENT ON TABLE public.sintomas_diarios IS 'Sintomas e bem-estar registrados diariamente';
COMMENT ON TABLE public.menopausa_tracking IS 'Acompanhamento de sintomas de menopausa';
COMMENT ON TABLE public.configuracoes_ciclo IS 'Configurações e preferências individuais do ciclo';

