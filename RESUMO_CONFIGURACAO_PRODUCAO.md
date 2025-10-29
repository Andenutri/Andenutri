# 🚀 Resumo: Configuração para Produção (Vercel)

## ⚠️ Problema Atual

A aplicação está funcionando localmente, mas em **produção (andenutri.com)** aparece o erro:

> "Supabase não está configurado. Por favor, configure as variáveis de ambiente..."

## ✅ Solução: 3 Passos

### 1️⃣ **Configurar Variáveis na Vercel** (CRÍTICO)

**📖 Guia Completo**: `supabase/CONFIGURAR_VERCEL.md`

**Resumo rápido**:
1. Acesse [vercel.com](https://vercel.com) → Seu Projeto → **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Sua URL do Supabase (ex: `https://abc123.supabase.co`)
   - **Environments**: Marque Production, Preview e Development
3. Adicione:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Sua chave anon do Supabase (começa com `eyJhbG...`)
   - **Environments**: Marque Production, Preview e Development
4. **IMPORTANTE**: Faça um **Redeploy** após adicionar:
   - Vá em **Deployments** → Clique nos **3 pontos** do último deploy → **Redeploy**

### 2️⃣ **Criar Conta da Deise**

**📖 Guia Completo**: `supabase/CRIAR_CONTA_DEISE.md`

**Resumo rápido**:
1. Acesse Supabase Dashboard → **Authentication** → **Users**
2. Clique em **"Add User"** ou **"Create New User"**
3. Preencha:
   - **Email**: `deisefaula@gmail.com`
   - **Password**: `1234546`
   - **Auto Confirm User**: ✅ Marque
4. Salve

### 3️⃣ **Associar Dados Existentes**

**📖 Guia Completo**: `supabase/COMO_ASSOCIAR_DADOS_DEISE.md`

**Resumo rápido**:
1. Execute `supabase/configurar-isolamento-usuarios.sql` (se ainda não executou)
2. Execute `supabase/associar-dados-deise.sql` no SQL Editor do Supabase

---

## 🔍 Outros Problemas Identificados (Não Críticos)

### Ícone PWA não encontrado (`icon-192.png`)

O `manifest.json` referencia `icon-192.png` que não existe em `public/`.

**Solução**:
- Criar o ícone ou ajustar a referência no `manifest.json`
- **Temporariamente**: Este erro não impede o funcionamento, só aparece no console

### Rotas não encontradas (`recuperar-senha`, `termos`)

O sistema tenta carregar rotas que não existem.

**Solução**:
- Criar essas páginas quando necessário
- **Temporariamente**: Não são críticas para login/registro

---

## ✅ Checklist Completo

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Redeploy feito após configurar variáveis
- [ ] Conta da Deise criada no Supabase
- [ ] Script de isolamento executado (`configurar-isolamento-usuarios.sql`)
- [ ] Script de associação executado (`associar-dados-deise.sql`)
- [ ] Teste de login em produção (`https://andenutri.com/login`)
- [ ] Deise consegue acessar e ver seus dados

---

## 🆘 Se Ainda Não Funcionar

### Verificar se variáveis foram aplicadas:

1. Na Vercel, vá em **Deployments** → Clique no último deploy
2. Veja os **Environment Variables** usados no build
3. Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão presentes

### Verificar no console do navegador:

1. Abra `https://andenutri.com/login`
2. Abra o Console (F12)
3. Procure por erros relacionados ao Supabase
4. Se aparecer "Failed to fetch" ou erros de CORS, as variáveis podem estar incorretas

---

## 📝 Ordem de Execução Recomendada

1. ✅ **Configurar Vercel** (variáveis de ambiente)
2. ✅ **Redeploy** da aplicação
3. ✅ **Criar conta da Deise** no Supabase
4. ✅ **Executar scripts SQL** (isolamento + associação)
5. ✅ **Testar** login em produção

---

## 🎯 Próximos Passos Após Configurar

Depois que tudo estiver funcionando:
- [ ] Continuar integração do "Saúde Feminina" com Supabase
- [ ] Criar páginas faltantes (`recuperar-senha`, `termos`) se necessário
- [ ] Criar ícone PWA (`icon-192.png`)

