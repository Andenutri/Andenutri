# 🔐 Como Entrar com a Conta da Deise Faula

## 📋 Dados de Login

- **Email**: `deisefaula@gmail.com`
- **Senha**: `1234546` (ou a senha que foi definida)
- **URL**: `https://andenutri.com/login`

---

## ✅ Passo a Passo para Fazer Login

### 1. Acessar a Página de Login

Abra o navegador e acesse:
```
https://andenutri.com/login
```

Ou, se estiver testando localmente:
```
http://localhost:3001/login
```

---

### 2. Preencher os Dados

**Na página de login:**

1. **Campo Email**: Digite `deisefaula@gmail.com`
2. **Campo Senha**: Digite `1234546`
3. Clique no botão **"Entrar"** ou pressione **Enter**

---

### 3. Após o Login

✅ **Sucesso!** Você será redirecionada automaticamente para o dashboard.

**Você verá:**
- ✅ Todos os clientes cadastrados
- ✅ Todas as avaliações existentes
- ✅ Agenda com eventos
- ✅ Kanban/Trello organizados
- ✅ Todos os dados que já estavam no sistema

---

## 🔍 Se Não Conseguiu Entrar

### Problema 1: "Email ou senha incorretos"

**Soluções:**

1. **Verifique se a conta existe:**
   - Vá no Supabase Dashboard
   - **Authentication** → **Users**
   - Procure por `deisefaula@gmail.com`
   - Se não existir, veja como criar: `supabase/CRIAR_CONTA_DEISE.md`

2. **Redefina a senha no Supabase:**
   - No Supabase Dashboard: **Authentication** → **Users**
   - Encontre o usuário `deisefaula@gmail.com`
   - Clique nos **3 pontos (⋮)** ao lado do usuário
   - Selecione **"Reset Password"** ou **"Update Password"**
   - Defina uma nova senha (ex: `1234546`)
   - Tente fazer login novamente

3. **Se a conta não existir:**
   - Veja o guia completo: `supabase/CRIAR_CONTA_DEISE.md`

---

### Problema 2: "Email não confirmado"

**Solução:**

1. No Supabase Dashboard: **Authentication** → **Users**
2. Encontre `deisefaula@gmail.com`
3. Clique nos **3 pontos (⋮)** → **"Confirm User"**
4. Ou desabilite a confirmação de email:
   - **Authentication** → **Providers** → **Email**
   - Desabilite **"Enable email confirmations"**
   - Salve

---

### Problema 3: "Failed to fetch" ou erro de conexão

**Soluções:**

1. **Verificar variáveis de ambiente no Vercel:**
   - Veja: `supabase/CONFIGURAR_VERCEL.md`
   - Garanta que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas

2. **Verificar console do navegador:**
   - Pressione **F12** no navegador
   - Aba **Console**
   - Veja se há mensagens de erro
   - Envie os erros para diagnóstico

---

## 🆘 Criar Conta Se Não Existir

Se a conta da Deise ainda não foi criada:

### Opção 1: Criar pela Interface (Mais Fácil)

1. Acesse: `https://andenutri.com/register`
2. Preencha:
   - **Nome**: Deise Faula
   - **Email**: `deisefaula@gmail.com`
   - **Senha**: `1234546`
   - **Confirmar Senha**: `1234546`
3. Clique em **"Criar Conta"**
4. Pronto! Você será redirecionada para o dashboard

**⚠️ IMPORTANTE**: Se você criou a conta pela interface, os dados existentes precisam ser associados manualmente. Veja: `supabase/associar-dados-deise.sql`

---

### Opção 2: Criar pelo Supabase Dashboard (Recomendado)

1. Acesse o Supabase Dashboard
2. **Authentication** → **Users**
3. Clique em **"Add User"** ou **"Create New User"**
4. Preencha:
   - **Email**: `deisefaula@gmail.com`
   - **Password**: `1234546`
   - **Auto Confirm User**: ✅ Marque esta opção
5. Clique em **"Create User"**
6. Pronto! Agora você pode fazer login

**📖 Guia completo**: `supabase/CRIAR_CONTA_DEISE.md`

---

## 🔗 Associar Dados Existentes

Se você criou a conta da Deise **AGORA** e já existiam dados no sistema, você precisa associá-los:

### 1. Encontrar o ID da Deise

No Supabase SQL Editor, execute:

```sql
SELECT id, email, created_at
FROM auth.users
WHERE email = 'deisefaula@gmail.com';
```

Anote o `id` que aparecer (um UUID como `a1b2c3d4-e5f6-...`)

---

### 2. Associar Dados (SQL Script)

Execute no Supabase SQL Editor:

```sql
-- Substituir 'ID_DA_DEISE_AQUI' pelo ID real que você copiou acima
DO $$
DECLARE
    deise_user_id UUID := 'ID_DA_DEISE_AQUI';
BEGIN
    -- Associar clientes
    UPDATE clientes
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- Associar avaliações físicas
    UPDATE avaliacoes_fisicas
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- Associar avaliações emocionais
    UPDATE avaliacoes_emocionais
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- Associar eventos da agenda
    UPDATE eventos_agenda
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- Associar colunas do Kanban
    UPDATE kanban_colunas
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- Associar configurações
    UPDATE configuracoes_profissional
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- E assim por diante para outras tabelas...
END $$;
```

**📖 Script completo**: Veja `supabase/associar-dados-deise.sql`

---

## ✅ Checklist Rápido

- [ ] Acessei `https://andenutri.com/login`
- [ ] Digitei email: `deisefaula@gmail.com`
- [ ] Digitei senha: `1234546`
- [ ] Cliquei em "Entrar"
- [ ] Fui redirecionada para o dashboard
- [ ] Consigo ver os dados existentes

---

## 🎯 Resumo Super Rápido

1. **URL**: `https://andenutri.com/login`
2. **Email**: `deisefaula@gmail.com`
3. **Senha**: `1234546`
4. **Clique**: "Entrar"
5. **Pronto!** ✅

Se não funcionar, veja a seção "🔍 Se Não Conseguiu Entrar" acima.

---

## 📞 Precisa de Ajuda?

Verifique também:
- `GUIA_ACESSO_DEISE.md` - Guia completo de acesso
- `supabase/CRIAR_CONTA_DEISE.md` - Como criar a conta
- `supabase/CONFIGURAR_VERCEL.md` - Configurar variáveis de ambiente

