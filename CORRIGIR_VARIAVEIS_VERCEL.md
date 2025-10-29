# ⚠️ CORREÇÃO URGENTE: Nomes das Variáveis na Vercel

## 🔴 Problema Identificado

Você configurou as variáveis na Vercel, mas os **nomes estão incorretos** para Next.js!

### ❌ Variáveis Atuais (INCORRETAS):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### ✅ Variáveis Corretas (NECESSÁRIAS):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 Solução Rápida (2 minutos)

### Passo 1: Adicionar Variáveis Corretas

1. Na Vercel, vá em **Settings** → **Environment Variables**
2. Clique em **Add New**
3. Adicione a primeira variável:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: O valor que está em `SUPABASE_URL` (https://yccvlhgoilrshw...)
   - **Environments**: Marque Production, Preview e Development
   - Clique em **Save**

4. Clique em **Add New** novamente
5. Adicione a segunda variável:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: O valor que está em `SUPABASE_ANON_KEY` (eyJhbGci...)
   - **Environments**: Marque Production, Preview e Development
   - Clique em **Save**

### Passo 2: (Opcional) Remover Variáveis Antigas

As variáveis antigas (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) podem ser removidas se não forem usadas em nenhum outro lugar:
- Clique nos 3 pontos (⋮) ao lado de cada variável antiga
- Selecione **Delete**

### Passo 3: Fazer Redeploy

**OBRIGATÓRIO**: Após adicionar/modificar variáveis:
1. Vá em **Deployments**
2. Clique nos 3 pontos (⋮) do último deploy
3. Selecione **Redeploy**
4. Aguarde 1-2 minutos

---

## 🔍 Por Que `NEXT_PUBLIC_`?

No Next.js, **apenas variáveis que começam com `NEXT_PUBLIC_`** são expostas ao código do cliente (browser). Variáveis sem esse prefixo só estão disponíveis no servidor.

Como o Supabase precisa ser usado no frontend (para login, registro, etc.), as variáveis **DEVEM** ter o prefixo `NEXT_PUBLIC_`.

---

## ✅ Após Corrigir

Após adicionar as variáveis corretas e fazer redeploy:

1. ✅ O erro "Supabase não está configurado" desaparecerá
2. ✅ Registro e login funcionarão normalmente
3. ✅ Todas as funcionalidades do Supabase funcionarão

---

## 📋 Checklist

- [ ] Variável `NEXT_PUBLIC_SUPABASE_URL` adicionada (não apenas `SUPABASE_URL`)
- [ ] Variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada (não apenas `SUPABASE_ANON_KEY`)
- [ ] Ambas marcadas para Production, Preview e Development
- [ ] Redeploy feito
- [ ] Testado em produção

---

## 🎯 Resumo

**Problema**: Nomes das variáveis estão errados (`SUPABASE_URL` ao invés de `NEXT_PUBLIC_SUPABASE_URL`)

**Solução**: Adicionar variáveis com os nomes corretos (`NEXT_PUBLIC_*`) e fazer redeploy

