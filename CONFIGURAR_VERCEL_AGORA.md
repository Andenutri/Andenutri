# ⚡ URGENTE: Configurar Vercel Agora

## ❌ Problema

A aplicação em produção (`andenutri.com`) está mostrando:
> "Supabase não está configurado. Por favor, configure as variáveis de ambiente..."

Isso acontece porque as variáveis de ambiente **NÃO estão configuradas na Vercel**.

## ✅ Solução Rápida (5 minutos)

### 1. Acesse a Vercel
- Vá em [vercel.com](https://vercel.com)
- Faça login
- Abra o projeto **Andenutri**

### 2. Configure as Variáveis
1. Clique em **Settings** (no topo)
2. Clique em **Environment Variables** (menu lateral esquerdo)
3. Clique no botão **Add New**

**Primeira variável**:
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Cole a URL do seu projeto Supabase (ex: `https://abc123xyz.supabase.co`)
- **Environments**: Marque todas as opções (Production, Preview, Development)
- Clique em **Save**

**Segunda variável**:
- Clique em **Add New** novamente
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Cole sua chave anon do Supabase (string longa que começa com `eyJhbG...`)
- **Environments**: Marque todas as opções
- Clique em **Save**

### 3. Onde Encontrar as Credenciais?
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Abra seu projeto
3. Vá em **Settings** → **API**
4. Você verá:
   - **Project URL** → Use para `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Fazer Redeploy (OBRIGATÓRIO)
Após adicionar as variáveis, você **DEVE** fazer um redeploy:

1. Na Vercel, vá em **Deployments** (menu superior)
2. Encontre o último deploy
3. Clique nos **3 pontos (⋮)** ao lado do deploy
4. Selecione **Redeploy**
5. Aguarde o deploy completar (1-2 minutos)

### 5. Testar
Após o redeploy:
1. Acesse `https://andenutri.com/register`
2. O aviso de "Supabase não configurado" deve sumir
3. Tente criar uma conta ou fazer login

---

## ✅ Depois que Funcionar

Depois que as variáveis estiverem configuradas:

1. **Criar conta da Deise** (veja `supabase/CRIAR_CONTA_DEISE.md`)
   - Email: `deisefaula@gmail.com`
   - Senha: `1234546`

2. **Associar dados existentes** (veja `supabase/COMO_ASSOCIAR_DADOS_DEISE.md`)
   - Executar `associar-dados-deise.sql` no Supabase

---

## 🆘 Se Ainda Não Funcionar

### Verificar se as variáveis foram aplicadas:
1. Vá em **Deployments** na Vercel
2. Clique no último deploy
3. Role até a seção **"Environment Variables"**
4. Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` aparecem lá

### Verificar no Console:
1. Abra `https://andenutri.com/register`
2. Abra o Console (F12)
3. Procure por erros relacionados ao Supabase
4. Se aparecer "Failed to fetch", pode ser problema de CORS ou URL incorreta

---

## 📝 Checklist

- [ ] Variável `NEXT_PUBLIC_SUPABASE_URL` adicionada na Vercel
- [ ] Variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada na Vercel
- [ ] Ambas marcadas para Production, Preview e Development
- [ ] Redeploy feito
- [ ] Testado registro/login em produção
- [ ] Deise consegue acessar

---

## 🎯 Resumo

**O problema é simples**: As variáveis de ambiente precisam estar na Vercel, não apenas no `.env.local` (que só funciona localmente).

Após configurar na Vercel e fazer redeploy, tudo funcionará! ✅

