# 📋 Como Configurar Tabelas de Anamnese no Supabase

## 🎯 Objetivo

Este guia explica como criar as tabelas necessárias para o sistema de Anamnese Personalizada.

---

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Vá para https://supabase.com/dashboard
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### 2. Executar o Script SQL

1. Clique em **"New query"**
2. Abra o arquivo `supabase/criar-tabelas-anamnese.sql` no seu projeto
3. Copie **TODO** o conteúdo do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** (ou pressione Cmd/Ctrl + Enter)

✅ **Resultado esperado**: 
- Tabela `anamneses` criada
- Tabela `anamneses_respostas` criada
- Índices criados

### 3. Verificar as Tabelas

1. Vá para **Table Editor** (no menu lateral)
2. Você deve ver as novas tabelas:
   - ✅ `anamneses`
   - ✅ `anamneses_respostas`

---

## 📊 Estrutura das Tabelas

### Tabela `anamneses`
Armazena os modelos de formulários criados pelo profissional.

**Campos principais:**
- `id` (UUID) - Identificador único
- `nome` (TEXT) - Nome da anamnese
- `descricao` (TEXT) - Descrição opcional
- `campos` (JSONB) - Array de campos do formulário
- `ativo` (BOOLEAN) - Se está ativa ou não

### Tabela `anamneses_respostas`
Armazena as respostas preenchidas pelos clientes.

**Campos principais:**
- `id` (UUID) - Identificador único
- `anamnese_id` (UUID) - Referência à anamnese
- `cliente_id` (UUID) - Referência ao cliente (opcional)
- `respostas` (JSONB) - Respostas do formulário
- `token_acesso` (TEXT) - Token para acesso público
- `data_preenchimento` (TIMESTAMP) - Data de preenchimento

---

## 🎯 Tipos de Campo Disponíveis

O sistema suporta os seguintes tipos de campo:

- **texto**: Campo de texto livre
- **numero**: Campo numérico
- **data**: Seleção de data
- **select**: Seleção única (dropdown)
- **checkbox**: Múltipla seleção
- **textarea**: Texto longo
- **escala**: Escala numérica (ex: 1-10)

---

## ✅ Pronto!

Agora você pode usar o sistema de Anamnese Personalizada na aplicação!

**Como testar:**
1. Acesse `/ferramentas` na aplicação
2. Vá para a aba **"Anamnese"**
3. Clique em **"Criar Nova Anamnese"**
4. Adicione campos e salve!

---

## 📝 Nota

As tabelas são criadas **sem RLS (Row Level Security)** para facilitar o desenvolvimento. 

**Para produção**, você deve habilitar RLS e criar políticas apropriadas para proteger os dados.

