# ✅ Como Verificar se o Supabase Está Configurado

## 🔍 Problema: "Failed to fetch" no Registro

Se você está recebendo erro "Failed to fetch" ao tentar se registrar, isso significa que o Supabase **não está configurado** ou as **variáveis de ambiente não estão definidas**.

---

## 📋 Verificação Rápida

### 1. **Verificar Variáveis de Ambiente**

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 2. **Onde Encontrar as Credenciais**

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Vá no seu projeto
3. No menu lateral, clique em **Settings** → **API**
4. Você verá:
   - **Project URL** → Use este valor para `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use este valor para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. **Após Configurar**

1. **Reinicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

2. **Limpe o cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)

3. Tente registrar novamente

---

## ⚠️ Erro Comum

**Erro**: `net::ERR_NAME_NOT_RESOLVED` para `placeholder.supabase.co`

**Causa**: As variáveis de ambiente não foram definidas ou estão incorretas.

**Solução**: 
1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Verifique se as variáveis começam com `NEXT_PUBLIC_`
3. Verifique se os valores não contêm espaços extras ou aspas
4. Reinicie o servidor após salvar

---

## 🧪 Teste Rápido

Para verificar se está configurado, abra o console do navegador e digite:

```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

Se aparecer `undefined` ou `https://placeholder.supabase.co`, as variáveis não estão configuradas.

---

## 📝 Exemplo Correto

**Arquivo `.env.local`** (na raiz do projeto):
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

⚠️ **Importante**: Use os valores REAIS do seu projeto Supabase, não os placeholders!

---

## ✅ Após Configurar

O registro deve funcionar normalmente. Se ainda houver erro, verifique:
1. Se o projeto Supabase está ativo
2. Se o email auth está habilitado (Authentication → Providers → Email)
3. Se as URLs de redirecionamento estão configuradas

