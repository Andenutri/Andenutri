# 🔐 Guia de Acesso - Deise Faula

## ⚠️ ANTES DE TUDO: Configurar Vercel

Se as variáveis de ambiente não estiverem configuradas na Vercel, **nada funcionará em produção**!

**📖 Veja**: `supabase/CONFIGURAR_VERCEL.md` para configurar as variáveis na Vercel.

---

## 👤 Dados da Conta

- **Nome**: Deise Faula
- **Email**: `deisefaula@gmail.com`
- **Senha**: `1234546`

**📖 Para criar esta conta**: Veja `supabase/CRIAR_CONTA_DEISE.md`

---

## 📋 Como a Deise Pode Acessar o Sistema

### Opção 1: Acessar com Conta Já Criada

1. **Acesse**: `https://andenutri.com/login`
2. **Email**: `deisefaula@gmail.com`
3. **Senha**: `1234546`
4. Clique em **"Entrar"**
5. Será redirecionada automaticamente para o dashboard

### Opção 2: Criar Conta Nova (se ainda não existe)

1. **Acesse**: `https://andenutri.com/register`
2. Preencha:
   - **Nome Completo**: Deise Faula
   - **Email**: `deisefaula@gmail.com`
   - **Senha**: `1234546`
   - **Confirmar Senha**: `1234546`
3. Clique em **"Criar Conta"**
4. Após criar, ela será redirecionada automaticamente para dentro do sistema

---

## 🔧 Configurar Conta da Deise

Para criar ou redefinir a conta da Deise com os dados acima, veja o guia completo:

**📖 `supabase/CRIAR_CONTA_DEISE.md`**

Este guia contém:
- Como criar a conta via Dashboard do Supabase
- Como verificar se a conta foi criada
- Como associar dados existentes
- Troubleshooting de problemas comuns

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

