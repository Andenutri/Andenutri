# 🏗️ Arquitetura Multi-Tenant - ANDENUTRI SaaS

## 🎯 OBJETIVO
Transformar ANDENUTRI em uma **plataforma SaaS** vendida para múltiplas coaches de bem-estar, onde cada coach tem seu próprio ambiente isolado.

## 📐 ESTRUTURA PROPOSTA

### 1. **AUTENTICAÇÃO E MULTI-TENANCY**

#### Modelo de Dados:
```
USERS (Coaches)
├── id, email, senha
├── tenant_id (único para cada coach)
├── plano (free, basic, premium)
└── data_cadastro

TENANTS (Organizações das Coaches)
├── tenant_id
├── nome_da_coach
├── domínio_customizado (opcional)
├── configuracao_tema (cores, logo)
└── limite_clientes (segundo plano)
```

#### Isolamento de Dados:
- **Coaches:** Cada coach vê SOMENTE seus próprios clientes
- **Clientes:** Cada cliente vê SOMENTE os dados do coach que o acompanha
- **RLS (Row Level Security):** Supabase filtra automaticamente por `tenant_id`

---

### 2. **ÁREA ADMINISTRATIVA (para Coaches)**

#### Funcionalidades:
1. **Login/Registro** ✅ Criar
2. **Dashboard Personalizado** ✅ Adaptar atual
3. **Configurações da Conta**
   - Mudar nome, email, senha
   - Upload logo personalizado
   - Escolher tema/cores
   - Configurar domínio customizado
4. **Gerenciar Plano**
   - Ver plano atual
   - Upgrade/Downgrade
   - Histórico de pagamentos
5. **Configurações Gerais**
   - Textos padronizados (ex: saudação)
   - Email templates
   - Integrações (Google Calendar, WhatsApp)

#### O que precisa criar:
```
/login          → Página de login
/register       → Página de registro
/dashboard      → Dashboard da coach (já temos)
/configuracoes  → Configurações da conta
/planos         → Gerenciar plano de assinatura
```

---

### 3. **ÁREA DO CLIENTE (Portal do Cliente)**

#### Funcionalidades:
1. **Login do Cliente** 
   - Acesso com email/senha único
   - Recuperação de senha
2. **Dashboard do Cliente**
   - Ver progresso atual
   - Próxima consulta
   - Próximo pagamento (se aplicável)
3. **Avaliações e Evolução**
   - Ver histórico de avaliações
   - Ver fotos antes/depois
   - Gráficos de evolução (peso, medidas)
4. **Cardápios e Plano Alimentar**
   - Visualizar cardápio atual
   - Histórico de cardápios anteriores
   - Download em PDF
5. **Material e Comunicações**
   - Receber comunicados do coach
   - Baixar materiais (PDFs, vídeos)
   - Ver protocolos e orientações
6. **Agenda e Consultas**
   - Ver próximas consultas agendadas
   - Cancelar/Reagendar
   - Ver histórico de consultas
7. **Pagamentos (Opcional)**
   - Ver fatura atual
   - Histórico de pagamentos
   - Método de pagamento

#### O que precisa criar:
```
/cliente/login
/cliente/dashboard
/cliente/avaliacoes
/cliente/cardapios
/cliente/material
/cliente/agenda
/cliente/perfil
```

---

### 4. **SISTEMA DE PERMISSÕES**

```
Coach:
├── Visualizar próprio dashboard
├── Gerenciar próprios clientes
├── Criar avaliações
├── Enviar cardápios
├── Configurar própria conta
└── Ver estatísticas dos próprios clientes

Cliente:
├── Visualizar próprio progresso
├── Baixar materiais disponíveis
├── Ver cardápios atribuídos
├── Ver próxima consulta
└── Editar próprio perfil (limitado)
```

---

### 5. **INFRAESTRUTURA NECESSÁRIA**

#### Supabase - Novas Tabelas:
```sql
-- Tabela de usuários (coaches)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  email TEXT UNIQUE,
  senha TEXT, -- hash
  nome TEXT,
  plano TEXT, -- free, basic, premium
  created_at TIMESTAMP
);

-- Tabela de tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  nome TEXT,
  dominio_customizado TEXT,
  logo_url TEXT,
  tema_cor TEXT,
  created_at TIMESTAMP
);

-- Tabela de acesso de clientes
CREATE TABLE cliente_acessos (
  id UUID PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id),
  email TEXT,
  senha TEXT, -- hash
  ultimo_acesso TIMESTAMP,
  ativo BOOLEAN
);

-- Tabela de materiais/comunicados
CREATE TABLE materiais (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  titulo TEXT,
  arquivo_url TEXT,
  tipo TEXT, -- pdf, video, imagem
  visivel_para TEXT, -- all, especificos
  created_at TIMESTAMP
);

-- Tabela de planos e assinaturas
CREATE TABLE assinaturas (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  plano TEXT,
  status TEXT, -- ativa, cancelada, trial
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  proximo_pagamento TIMESTAMP
);
```

#### Atualizar Tabelas Existentes:
```sql
-- Adicionar tenant_id em todas as tabelas
ALTER TABLE clientes ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE avaliacoes_fisicas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE avaliacoes_emocionais ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE consultas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE cardapios ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- etc...
```

---

### 6. **FLUXO DE USO**

#### Para Coaches:
1. **Cadastro** → Registrar conta → Login
2. **Onboarding** → Configurar perfil → Escolher plano
3. **Usar** → Gerenciar clientes, avaliações, etc.

#### Para Clientes (Futuro):
1. **Coach envia link** → Cliente acessa portal
2. **Cadastro** → Criar senha → Login
3. **Acompanhar** → Ver progresso, baixar materiais

---

### 7. **PRIORIDADE DE IMPLEMENTAÇÃO**

#### FASE 1 - Multi-Tenant Básico (CRÍTICO)
1. ✅ Sistema de Login/Registro para coaches
2. ✅ Adicionar `tenant_id` em todas as tabelas
3. ✅ Isolar dados com RLS no Supabase
4. ✅ Criar página de configurações da conta
5. ✅ Testar isolamento de dados

#### FASE 2 - Dashboard do Cliente
1. Criar área de login do cliente
2. Dashboard básico com progresso
3. Visualizar avaliações e medidas
4. Download de cardápios

#### FASE 3 - Material e Comunicações
1. CRUD de materiais (coach)
2. Visualização de materiais (cliente)
3. Sistema de comunicados

#### FASE 4 - Sistema de Pagamento
1. Stripe/PagSeguro integration
2. Planos de assinatura
3. Faturamento automático

---

### 8. **SEGURANÇA**

- **Autenticação:** NextAuth.js ou Supabase Auth
- **RLS:** Row Level Security no Supabase (filtrar por tenant_id)
- **Senhas:** Hash com bcrypt
- **SSL:** HTTPS obrigatório
- **Rate Limiting:** Prevenir abuso

---

### 9. **PRÓXIMOS PASSOS IMEDIATOS**

1. Criar tabelas de `usuarios` e `tenants`
2. Implementar login/registro
3. Adicionar `tenant_id` nas tabelas existentes
4. Criar página de configurações
5. Implementar RLS no Supabase

---

**Status:** 🟢 Projeto pronto para implementação multi-tenant
**Próximo:** Criar sistema de autenticação

