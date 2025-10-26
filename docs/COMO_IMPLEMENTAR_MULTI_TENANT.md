# 🚀 Como Implementar Multi-Tenant - ANDENUTRI

## ✅ O QUE JÁ FOI CRIADO

### 1. **Páginas de Autenticação**
- ✅ `/login` - Login de coaches
- ✅ `/register` - Registro de novas coaches
- ✅ Middleware de autenticação básico

### 2. **Script SQL**
- ✅ `supabase/multi-tenant.sql` - Todas as tabelas necessárias
- ✅ Estrutura de usuários, tenants, materiais, assinaturas
- ✅ Adição de `tenant_id` nas tabelas existentes
- ✅ Políticas RLS para isolamento de dados

---

## 📋 PASSOS PARA IMPLEMENTAR

### PASSO 1: Executar Script SQL

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo de `supabase/multi-tenant.sql`
5. Clique em **Run**

✅ Isso criará todas as tabelas necessárias!

---

### PASSO 2: Configurar Autenticação do Supabase

Atualmente, o login usa **localStorage** (temporário). Para produção:

1. **Habilitar Email Auth no Supabase:**
   - Dashboard → Authentication → Providers
   - Habilitar "Email"

2. **Instalar NextAuth ou Supabase Auth:**
```bash
npm install @supabase/supabase-js next-auth
```

3. **Atualizar páginas de login/registro:**
   - Substituir localStorage por Supabase Auth
   - Implementar JWT tokens
   - Adicionar refresh tokens

---

### PASSO 3: Proteger Rotas

Atualmente, o middleware é básico. Aprimorar:

1. **Verificar autenticação em cada página:**
```typescript
// Em src/app/page.tsx
'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user_logged_in');
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }, []);

  // ... resto do código
}
```

2. **Criar hook de autenticação:**
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user_logged_in');
    if (userData) {
      // Buscar dados do usuário
      setUser(JSON.parse(userData));
    }
  }, []);

  return { user };
}
```

---

### PASSO 4: Isolar Dados por Tenant

1. **Todas as queries devem filtrar por tenant_id:**
```typescript
// Exemplo: buscar clientes
const { data } = await supabase
  .from('clientes')
  .select('*')
  .eq('tenant_id', currentTenantId);
```

2. **RLS no Supabase fará o filtro automaticamente**

---

### PASSO 5: Criar Área de Configurações

Criar página `/configuracoes` com:
- Mudar nome, email
- Upload de logo
- Configurar cores do tema
- Gerenciar plano de assinatura

---

### PASSO 6: Implementar Portal do Cliente

1. **Criar páginas:**
   - `/cliente/login`
   - `/cliente/dashboard`
   - `/cliente/avaliacoes`
   - `/cliente/cardapios`
   - `/cliente/material`
   - `/cliente/agenda`

2. **Sistema de acesso:**
   - Coach envia link único para o cliente
   - Cliente cria senha
   - Acesso ao portal com dados isolados

---

## 🔧 COMANDOS ÚTEIS

### Testar Login:
```
http://localhost:3001/login

Email: demo@andenutri.com
Senha: demo123
```

### Testar Registro:
```
http://localhost:3001/register
```

### Limpar Dados (se necessário):
```javascript
// No console do navegador
localStorage.clear();
```

---

## 📊 STATUS ATUAL

- ✅ Estrutura criada
- ✅ Páginas de login/registro prontas
- ✅ Script SQL pronto
- ⏳ Aguardando execução do script SQL no Supabase
- ⏳ Aguardando configuração de autenticação real
- ⏳ Aguardando implementação do portal do cliente

---

## 🎯 PRÓXIMOS PASSOS

1. **Execute o script SQL** no Supabase
2. **Teste o login** em localhost:3001/login
3. **Criar página de configurações**
4. **Implementar portal do cliente**

---

**Quando executar o script SQL, me avise para continuarmos!**

