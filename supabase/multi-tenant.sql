-- ================================================
-- CONFIGURAÇÃO MULTI-TENANT - ANDENUTRI
-- Execute este script no SQL Editor do Supabase
-- ================================================

-- 1. Criar tabela de TENANTS primeiro (sem dependências)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  dominio_customizado TEXT UNIQUE,
  logo_url TEXT,
  tema_cor TEXT DEFAULT '#d97706', -- Cor padrão âmbar
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar tabela de USUARIOS (depois de tenants)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL, -- Será hash com bcrypt
  nome TEXT NOT NULL,
  plano TEXT DEFAULT 'free', -- free, basic, premium
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 3. Criar tabela de ACESSOS DE CLIENTES
CREATE TABLE IF NOT EXISTS cliente_acessos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL, -- Hash com bcrypt
  ultimo_acesso TIMESTAMP,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- 4. Criar tabela de MATERIAIS
CREATE TABLE IF NOT EXISTS materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT,
  tipo TEXT NOT NULL, -- pdf, video, imagem, link
  visivel_para TEXT DEFAULT 'all', -- all, especificos
  categorias TEXT[], -- ['cardápio', 'treino', 'orientação']
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 5. Criar tabela de ASSINATURAS
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE,
  plano TEXT DEFAULT 'free', -- free, basic, premium
  status TEXT DEFAULT 'trial', -- trial, ativa, cancelada, suspensa
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_fim TIMESTAMP,
  proximo_pagamento TIMESTAMP,
  valor_mensal DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 6. Criar tabela de COMUNICADOS
CREATE TABLE IF NOT EXISTS comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  enviado_para TEXT[], -- IDs ou emails dos clientes
  visualizacoes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- ================================================
-- ADICIONAR tenant_id NAS TABELAS EXISTENTES
-- ================================================

-- Adicionar tenant_id em CLIENTES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'tenant_id') THEN
        ALTER TABLE clientes ADD COLUMN tenant_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_clientes_tenant') THEN
        ALTER TABLE clientes ADD CONSTRAINT fk_clientes_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    END IF;
END $$;

-- Adicionar tenant_id em AVALIACOES_FISICAS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'avaliacoes_fisicas' AND column_name = 'tenant_id') THEN
        ALTER TABLE avaliacoes_fisicas ADD COLUMN tenant_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_avaliacoes_fisicas_tenant') THEN
        ALTER TABLE avaliacoes_fisicas ADD CONSTRAINT fk_avaliacoes_fisicas_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    END IF;
END $$;

-- Adicionar tenant_id em AVALIACOES_EMOCIONAIS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'avaliacoes_emocionais' AND column_name = 'tenant_id') THEN
        ALTER TABLE avaliacoes_emocionais ADD COLUMN tenant_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_avaliacoes_emocionais_tenant') THEN
        ALTER TABLE avaliacoes_emocionais ADD CONSTRAINT fk_avaliacoes_emocionais_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    END IF;
END $$;

-- Adicionar tenant_id em CONSULTAS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultas' AND column_name = 'tenant_id') THEN
        ALTER TABLE consultas ADD COLUMN tenant_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_consultas_tenant') THEN
        ALTER TABLE consultas ADD CONSTRAINT fk_consultas_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    END IF;
END $$;

-- Adicionar tenant_id em CARDAPIOS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cardapios' AND column_name = 'tenant_id') THEN
        ALTER TABLE cardapios ADD COLUMN tenant_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_cardapios_tenant') THEN
        ALTER TABLE cardapios ADD CONSTRAINT fk_cardapios_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    END IF;
END $$;

-- ================================================
-- RLS (Row Level Security) - ISOLAMENTO DE DADOS
-- ================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_acessos ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

-- Política RLS para USUARIOS (cada coach vê apenas sua própria conta)
CREATE POLICY "Usuários podem ver apenas próprio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Política RLS para MATERIAIS (filtrado por tenant_id)
CREATE POLICY "Materiais filtrados por tenant" ON materiais
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM usuarios WHERE id = auth.uid())
  );

-- Política RLS para COMUNICADOS (filtrado por tenant_id)
CREATE POLICY "Comunicados filtrados por tenant" ON comunicados
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM usuarios WHERE id = auth.uid())
  );

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tenant_id ON usuarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_id ON clientes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cliente_acessos_email ON cliente_acessos(email);

-- ================================================
-- DADOS INICIAIS DE TESTE
-- ================================================

-- Criar tenant demo
INSERT INTO tenants (id, nome, tema_cor)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Tenant', '#d97706')
ON CONFLICT DO NOTHING;

-- Criar usuário demo
INSERT INTO usuarios (id, tenant_id, email, senha, nome, plano)
VALUES ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'demo@andenutri.com', 'demo123', 'Demo Coach', 'premium')
ON CONFLICT DO NOTHING;

-- ================================================
-- FIM DO SCRIPT
-- ================================================

