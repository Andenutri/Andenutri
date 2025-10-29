# 🎨 Como Configurar Branding no Supabase

## 🎯 Objetivo

Este guia explica como criar a tabela de configurações para personalização de relatórios com logo e informações de contato.

---

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Vá para https://supabase.com/dashboard
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### 2. Executar o Script SQL

1. Clique em **"New query"**
2. Abra o arquivo `supabase/criar-tabela-configuracoes.sql` no seu projeto
3. Copie **TODO** o conteúdo do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** (ou pressione Cmd/Ctrl + Enter)

✅ **Resultado esperado**: 
- Tabela `configuracoes_profissional` criada
- Índice único criado

### 3. Verificar a Tabela

1. Vá para **Table Editor** (no menu lateral)
2. Você deve ver a nova tabela:
   - ✅ `configuracoes_profissional`

---

## 📊 Estrutura da Tabela

### Tabela `configuracoes_profissional`
Armazena as configurações de branding e informações do profissional.

**Campos principais:**
- `id` (UUID) - Identificador único
- `logo_url` (TEXT) - URL do logo
- `nome_profissional` (TEXT) - Nome do profissional
- `nome_empresa` (TEXT) - Nome da empresa/clínica
- `email`, `telefone`, `whatsapp`, `instagram` (TEXT) - Contatos
- `endereco`, `cidade`, `estado`, `cep` (TEXT) - Endereço
- `site` (TEXT) - Site do profissional
- `cores_tema` (JSONB) - Cores personalizadas
- `assinatura_digital` (TEXT) - URL da assinatura (opcional)

---

## 🎯 Como Usar

Após criar a tabela:

1. Acesse `/ferramentas` na aplicação
2. Vá para a aba **"Branding"**
3. Configure:
   - Upload do logo
   - Informações de contato
   - Endereço
   - Cores do tema (opcional)
4. Clique em **"Salvar Configurações"**

As configurações serão automaticamente aplicadas nos relatórios gerados!

---

## ✅ Pronto!

Agora você pode personalizar os relatórios com seu branding!

---

## 📝 Nota

O logo será armazenado no Supabase Storage (bucket `client-photos` na pasta `branding/`). Se preferir usar um bucket separado para branding, você pode criar um novo bucket chamado `branding` e atualizar a função `uploadLogo` em `src/data/configuracoesData.ts`.

