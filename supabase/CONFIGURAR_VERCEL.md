# 🚀 Como Configurar Variáveis de Ambiente na Vercel

## ⚠️ Importante

As variáveis de ambiente do `.env.local` funcionam apenas em **desenvolvimento local**. Para funcionar em **produção (Vercel)**, você precisa configurá-las diretamente no painel da Vercel.

---

## 📋 Passo a Passo

### 1. **Acessar o Painel da Vercel**

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Vá no seu projeto **Andenutri**
3. Clique em **Settings** (no topo)
4. No menu lateral, clique em **Environment Variables**

### 2. **Adicionar Variáveis de Ambiente**

Para cada variável, faça:

1. Clique em **Add New**
2. Preencha:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Cole a URL do seu projeto Supabase (ex: `https://abc123.supabase.co`)
   - **Environment**: Selecione **Production**, **Preview** e **Development** (ou marque todas)
3. Clique em **Save**

Repita para a segunda variável:

1. Clique em **Add New** novamente
2. Preencha:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Cole sua chave anon do Supabase (começa com `eyJhbG...`)
   - **Environment**: Selecione **Production**, **Preview** e **Development**
3. Clique em **Save**

### 3. **Onde Encontrar as Credenciais do Supabase**

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Abra seu projeto
3. Vá em **Settings** → **API**
4. Você verá:
   - **Project URL** → Use para `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Verificar se Está Configurado

### Na Vercel Dashboard:

1. Vá em **Settings** → **Environment Variables**
2. Você deve ver:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbG...`

### Após Configurar:

1. **IMPORTANTE**: Faça um novo deploy ou "Redeploy" para aplicar as variáveis
2. Vá em **Deployments** → Clique nos **3 pontos** do último deploy → **Redeploy**

---

## 🔄 Após Adicionar Variáveis

### Opção 1: Triggerar Novo Deploy Automaticamente

Faça um commit e push pequeno para forçar novo deploy:

```bash
git commit --allow-empty -m "trigger: Forçar redeploy com novas variáveis de ambiente"
git push
```

### Opção 2: Redeploy Manual

1. Na Vercel, vá em **Deployments**
2. Clique nos **3 pontos (⋮)** do último deploy
3. Selecione **Redeploy**
4. Confirme o redeploy

---

## ⚠️ Importante

- **Variáveis com `NEXT_PUBLIC_`** ficam visíveis no frontend (isso é normal e esperado)
- **Nunca compartilhe** sua chave anon publicamente em repositórios
- **Cada ambiente** (Production, Preview, Development) pode ter valores diferentes
- **Após adicionar variáveis**, SEMPRE faça redeploy

---

## 🧪 Testar após Configurar

1. Acesse `https://andenutri.com/login`
2. Tente fazer login ou criar conta
3. Se aparecer erro "Supabase não configurado", as variáveis não foram aplicadas
4. Se funcionar normalmente, está tudo certo! ✅

---

## 📝 Checklist

- [ ] Variável `NEXT_PUBLIC_SUPABASE_URL` adicionada na Vercel
- [ ] Variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada na Vercel
- [ ] Variáveis marcadas para os 3 ambientes (Production, Preview, Development)
- [ ] Redeploy feito após adicionar variáveis
- [ ] Testado registro/login em produção

---

## 🆘 Problemas Comuns

### Variáveis adicionadas mas ainda não funciona

**Solução**: 
1. Verifique se fez redeploy após adicionar
2. Aguarde 1-2 minutos após o deploy
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Erro "Supabase não configurado" em produção

**Solução**:
1. Verifique se as variáveis estão na Vercel (não apenas no `.env.local`)
2. Verifique se os nomes estão EXATAMENTE: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Faça um redeploy

### Variáveis aparecem no código fonte (isso é normal!)

**IMPORTANTE**: Variáveis que começam com `NEXT_PUBLIC_` são injetadas no código JavaScript do frontend. Isso é **intencional e seguro** para chaves públicas (anon key). A chave anon é projetada para ser pública.

---

## ✅ Pronto!

Após configurar as variáveis na Vercel e fazer redeploy, o sistema funcionará em produção e a Deise poderá acessar normalmente!

