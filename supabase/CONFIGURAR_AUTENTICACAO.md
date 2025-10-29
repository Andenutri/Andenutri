# 🔐 Como Configurar Autenticação com Supabase

## 📋 Pré-requisitos

1. **Projeto Supabase criado** e configurado
2. Variáveis de ambiente no `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```

---

## 🚀 Passos para Configurar

### 1. **Habilitar Autenticação por Email/Password no Supabase**

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Providers** (no menu lateral)
3. Encontre **Email** na lista de provedores
4. Clique para habilitar
5. **Importante:** Configure as opções:
   - ✅ **Enable email confirmations**: Desabilite se quiser login imediato (ou mantenha habilitado para maior segurança)
   - ✅ **Secure email change**: Habilite para segurança
   - ✅ **Double confirm email changes**: Opcional, para maior segurança

### 2. **Configurar URL de Redirecionamento (se usar confirmação de email)**

1. No **Supabase Dashboard**, vá em **Authentication** → **URL Configuration**
2. Adicione a URL do seu app nas **Site URL** e **Redirect URLs**:
   ```
   http://localhost:3000
   http://localhost:3001
   https://seu-dominio.vercel.app
   ```

### 3. **Testar o Sistema de Autenticação**

1. Acesse `/register` no seu app
2. Crie uma conta com email e senha
3. Se tiver confirmação de email habilitada, você receberá um email para confirmar
4. Após confirmar (ou se estiver desabilitado), faça login em `/login`

---

## 🎯 Funcionalidades Implementadas

✅ **Login com Email/Password**
- Página `/login` com formulário de autenticação
- Integração com Supabase Auth
- Mensagens de erro amigáveis

✅ **Registro de Novo Usuário**
- Página `/register` com formulário de cadastro
- Validação de senhas (mínimo 6 caracteres)
- Suporte a nome do usuário (armazenado nos metadados do usuário)

✅ **Proteção de Rotas**
- Todas as rotas protegidas, exceto `/login` e `/register`
- Redirecionamento automático para login se não autenticado
- Redirecionamento para home se tentar acessar login estando autenticado

✅ **Contexto de Autenticação**
- `AuthContext` gerencia o estado de autenticação globalmente
- Hook `useAuth()` para acessar estado e funções em qualquer componente
- Sessão mantida automaticamente (refresh token)

✅ **Logout**
- Botão de logout no Sidebar
- Exibe email do usuário logado no menu
- Limpa sessão e redireciona para login

---

## 📝 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   ├── AuthGuard.tsx            # Componente de proteção de rotas
│   └── Sidebar.tsx              # Menu lateral com logout
├── app/
│   ├── login/
│   │   └── page.tsx              # Página de login
│   └── register/
│       └── page.tsx             # Página de registro
└── lib/
    └── supabase.ts              # Cliente Supabase
```

---

## 🔧 Personalização

### Adicionar Mais Campos no Registro

Para adicionar mais campos no registro (ex: telefone, empresa):

1. Adicione o campo no formulário de `register/page.tsx`
2. Atualize a chamada de `signUp` para incluir os dados em `options.data`:

```typescript
const { error } = await signUp(email, senha, {
  data: {
    nome: nome,
    telefone: telefone,
    empresa: empresa,
  }
});
```

### Recuperação de Senha

Para implementar recuperação de senha:

1. Crie a página `/recuperar-senha`
2. Use `supabase.auth.resetPasswordForEmail(email)`
3. Configure a URL de redirecionamento no Supabase

---

## ⚠️ Importante

- **Senha mínima:** 6 caracteres (conforme configurado no Supabase)
- **Sessão persistente:** O usuário permanece logado mesmo após fechar o navegador
- **Segurança:** A autenticação é feita via Supabase, que criptografa senhas automaticamente
- **Metadados do usuário:** O nome do usuário é armazenado em `user.user_metadata.nome`

---

## ✅ Pronto!

Agora seu app está protegido com autenticação. Apenas usuários logados podem acessar as rotas protegidas.

Para criar o primeiro usuário, acesse `/register` e faça o cadastro.

