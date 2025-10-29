# 👤 Criar Conta da Deise Faula

## 📋 Informações da Conta

- **Nome**: Deise Faula
- **Email**: `deisefaula@gmail.com`
- **Senha**: `1234546`

---

## 🚀 Método 1: Criar via Dashboard (Recomendado)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - [app.supabase.com](https://app.supabase.com)
   - Faça login no seu projeto

2. **Vá em Authentication → Users**
   - No menu lateral, clique em **Authentication**
   - Depois clique em **Users**

3. **Criar Novo Usuário**
   - Clique no botão **"Add User"** ou **"Invite User"** (no topo)
   - Ou clique em **"Create New User"**

4. **Preencher Dados**
   - **Email**: `deisefaula@gmail.com`
   - **Password**: `1234546`
   - **Auto Confirm User**: ✅ Marque esta opção (para não precisar confirmar email)
   - **Send Invite Email**: ❌ Desmarque (não é necessário)

5. **Salvar**
   - Clique em **"Create User"** ou **"Save"**
   - Pronto! A conta estará criada

---

## 🚀 Método 2: Via SQL Script (Alternativo)

Se preferir usar SQL, execute este script no **SQL Editor** do Supabase:

```sql
-- Verificar se a função de criar usuário existe
-- Se não existir, o Supabase criará automaticamente via API

-- NOTA: Para criar via SQL, você precisaria usar a Admin API
-- O método mais seguro é criar via Dashboard

-- Mas você pode verificar se o usuário foi criado com:
SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    raw_user_meta_data->>'nome' as nome
FROM auth.users
WHERE email = 'deisefaula@gmail.com';
```

---

## ⚙️ Método 3: Via Admin API (Programático)

Se você tiver a `SERVICE_ROLE_KEY` do Supabase, pode criar via script Node.js:

**⚠️ ATENÇÃO**: A `SERVICE_ROLE_KEY` é muito sensível. Não compartilhe publicamente!

```javascript
// criar-conta-deise.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'SUA_URL_DO_SUPABASE';
const serviceRoleKey = 'SUA_SERVICE_ROLE_KEY'; // MUITO SECRETA!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function criarContaDeise() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'deisefaula@gmail.com',
    password: '1234546',
    email_confirm: true, // Confirmar email automaticamente
    user_metadata: {
      nome: 'Deise Faula'
    }
  });

  if (error) {
    console.error('Erro ao criar usuário:', error);
  } else {
    console.log('✅ Usuário criado com sucesso!', data.user);
  }
}

criarContaDeise();
```

---

## ✅ Verificar se Conta foi Criada

Execute no **SQL Editor** do Supabase:

```sql
SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    CASE 
        WHEN confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '❌ Não confirmado'
    END as status
FROM auth.users
WHERE email = 'deisefaula@gmail.com';
```

**Resultado esperado:**
- Deve retornar 1 linha com o email `deisefaula@gmail.com`
- `confirmed_at` deve estar preenchido (se marcou "Auto Confirm")
- `id` será um UUID (ex: `a1b2c3d4-e5f6-...`)

---

## 🔗 Após Criar a Conta

### 1. **Associar Dados Existentes**

Se já existirem dados no sistema (clientes, avaliações, etc.), eles podem precisar ser associados ao `user_id` da Deise.

Execute o script `supabase/configurar-isolamento-usuarios.sql` para associar dados existentes:

1. Abra o **SQL Editor** no Supabase
2. Cole o conteúdo de `supabase/configurar-isolamento-usuarios.sql`
3. **ANTES DE EXECUTAR**, atualize a query que associa dados existentes:

```sql
-- Encontre o ID da Deise
DO $$
DECLARE
    deise_user_id UUID;
BEGIN
    -- Buscar o ID do usuário da Deise
    SELECT id INTO deise_user_id
    FROM auth.users
    WHERE email = 'deisefaula@gmail.com'
    LIMIT 1;

    -- Associar dados existentes à Deise
    UPDATE clientes
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    UPDATE avaliacoes_fisicas
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    UPDATE eventos_agenda
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    UPDATE kanban_colunas
    SET user_id = deise_user_id
    WHERE user_id IS NULL;

    -- E assim por diante para outras tabelas...
END $$;
```

### 2. **Primeiro Login**

Após criar a conta:

1. Acesse: `https://andenutri.com/login` (ou `http://localhost:3001/login` em dev)
2. **Email**: `deisefaula@gmail.com`
3. **Senha**: `1234546`
4. Clique em **"Entrar"**
5. Será redirecionada automaticamente para o dashboard

---

## 🔒 Segurança

- ✅ **Senha temporária**: `1234546` é apenas para primeiro acesso
- ⚠️ **IMPORTANTE**: Recomendado trocar para uma senha mais forte o quanto antes
- 🔐 A senha será armazenada com hash (bcrypt) no Supabase automaticamente
- 🚫 **NUNCA** compartilhe a `SERVICE_ROLE_KEY` publicamente

---

## 📝 Checklist

- [ ] Conta criada no Supabase (`deisefaula@gmail.com`)
- [ ] Email confirmado automaticamente (se usado Dashboard)
- [ ] Senha definida: `1234546`
- [ ] Dados existentes associados ao `user_id` da Deise (se houver)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Testado login em produção (`https://andenutri.com/login`)
- [ ] Deise consegue acessar e ver seus dados

---

## 🆘 Problemas Comuns

### Erro: "User already exists"
**Solução**: A conta já existe. Use **Método 1** (Dashboard) → **Edit User** → **Update Password** para definir a senha.

### Erro: "Email not confirmed"
**Solução**: No Dashboard, vá em **Users** → encontre o usuário → **Edit User** → marque **"Auto Confirm"** ou clique em **"Confirm User"**.

### Não consegue fazer login após criar
**Soluções**:
1. Verifique se o email está correto: `deisefaula@gmail.com`
2. Verifique se a senha está correta: `1234546`
3. Verifique se o email foi confirmado (deve ter `confirmed_at` preenchido)
4. Limpe o cache do navegador e tente novamente
5. Verifique se as variáveis de ambiente estão configuradas na Vercel

---

## ✅ Pronto!

Após seguir os passos acima, a Deise poderá:
- ✅ Fazer login com `deisefaula@gmail.com` / `1234546`
- ✅ Ver todos os dados associados a ela
- ✅ Criar novos clientes, avaliações, eventos
- ✅ Usar todas as funcionalidades do sistema

