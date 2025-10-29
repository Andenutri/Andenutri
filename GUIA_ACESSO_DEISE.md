# 🔐 Guia de Acesso - Deise Faula

## ⚠️ ANTES DE TUDO: Configurar Vercel

Se as variáveis de ambiente não estiverem configuradas na Vercel, **nada funcionará em produção**!

**📖 Veja**: `supabase/CONFIGURAR_VERCEL.md` para configurar as variáveis na Vercel.

---

## 📋 Como a Deise Pode Acessar o Sistema

### Opção 1: Se a Deise JÁ criou a conta

1. **Acesse**: `https://andenutri.com/login`
2. **Email**: O email que ela usou no registro
3. **Senha**: 
   - Se a senha foi resetada via Supabase Dashboard: Use a senha definida (ex: `123456`)
   - Se ela definiu no registro: Use a senha que ela criou
4. Clique em **"Entrar"**
5. Será redirecionada automaticamente para o dashboard

### Opção 2: Se a Deise AINDA NÃO criou a conta

1. **Acesse**: `https://andenutri.com/register`
2. Preencha:
   - **Nome Completo**: Deise Faula
   - **Email**: O email dela (ex: `deise@email.com`)
   - **Senha**: Escolha uma senha (mínimo 6 caracteres) - recomendado: `123456` para depois trocar
   - **Confirmar Senha**: Digite novamente
3. Clique em **"Criar Conta"**
4. Após criar, ela será redirecionada automaticamente para dentro do sistema

---

## 🔧 Configurar Senha Temporária "123456"

Se você quiser que a Deise entre com senha `123456` (temporária), faça:

### Método 1: Pelo Supabase Dashboard (Recomendado)

1. Acesse o **Supabase Dashboard** → Seu Projeto
2. Vá em **Authentication** → **Users**
3. Encontre o usuário da Deise (procure pelo email)
4. Clique nos **3 pontos (⋮)** ao lado do usuário
5. Selecione **"Reset Password"** ou **"Edit User"**
6. Se houver opção **"Update Password"** ou **"Set Password"**, defina: `123456`
7. Salve

### Método 2: Executar Script SQL de Verificação

Execute o arquivo `supabase/reset-senha-deise.sql` no SQL Editor do Supabase para verificar informações do usuário.

---

## 📱 URLs de Acesso

### Em Produção (após deploy):
- **Login**: `https://andenutri.com/login`
- **Registro**: `https://andenutri.com/register`
- **Dashboard**: `https://andenutri.com/` (após login)

### Em Desenvolvimento (localhost):
- **Login**: `http://localhost:3001/login`
- **Registro**: `http://localhost:3001/register`
- **Dashboard**: `http://localhost:3001/` (após login)

---

## ✅ Após o Primeiro Login

1. **A Deise verá todos os dados existentes**
   - Isso acontece porque todos os dados foram associados ao primeiro usuário (ela)
   - Verá clientes, avaliações, agenda, etc.

2. **Ela pode começar a usar imediatamente**
   - Adicionar novos clientes
   - Criar eventos na agenda
   - Organizar no Trello/Kanban
   - Usar ferramentas avançadas

3. **Trocar senha (quando implementarmos)**
   - Futuramente, ela poderá trocar a senha em: Configurações → Perfil

---

## 🔍 Verificar se Conta da Deise Existe

### Via Supabase Dashboard:

1. Acesse **Authentication** → **Users**
2. Procure pelo email da Deise na lista
3. Se existir:
   - **Email confirmado?**: Verifique se `confirmed_at` não é null
   - **Status**: Deve estar `active`

### Via SQL (no Supabase SQL Editor):

```sql
SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    CASE 
        WHEN confirmed_at IS NOT NULL THEN 'Confirmado'
        ELSE 'Não confirmado'
    END as status
FROM auth.users
WHERE email ILIKE '%deise%' OR email ILIKE '%faula%'
ORDER BY created_at ASC;
```

---

## 🆘 Problemas Comuns

### Erro: "Email ou senha incorretos"
- **Solução**: Verifique se:
  1. O email está correto (cheque no Supabase Dashboard)
  2. A senha está correta
  3. O email foi confirmado (se confirmação estiver habilitada)

### Erro: "User not confirmed"
- **Solução**: 
  1. No Supabase Dashboard, vá em Authentication → Users
  2. Encontre o usuário da Deise
  3. Clique em "Confirm User" ou reenvie email de confirmação
  4. Ou desabilite confirmação de email em Authentication → Providers → Email

### Não consegue acessar após criar conta
- **Solução**: 
  1. Verifique se o Supabase está configurado corretamente
  2. Verifique se as variáveis de ambiente estão corretas
  3. Tente fazer logout e login novamente

---

## 📝 Checklist para Acesso da Deise

- [ ] Conta criada no sistema (via `/register` ou você criou manualmente)
- [ ] Email da Deise anotado/cadastrado
- [ ] Senha definida (se resetada via Dashboard, use essa)
- [ ] Email confirmado no Supabase (se confirmação estiver habilitada)
- [ ] Variáveis de ambiente configuradas no servidor
- [ ] Supabase habilitado e funcionando

---

## 🎯 Próximos Passos

1. **Deise acessa** via `/login` ou `/register`
2. **Faz login** com as credenciais
3. **Vê todos os dados** existentes (já associados a ela)
4. **Começa a usar** o sistema normalmente

Se precisar de ajuda, verifique os logs do console do navegador para ver mensagens de erro específicas.

