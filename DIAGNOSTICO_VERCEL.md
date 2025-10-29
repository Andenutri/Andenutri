# 🔍 Diagnóstico: Variáveis na Vercel

## ✅ Verificar se Está Tudo Configurado

Mesmo que as variáveis estejam configuradas na Vercel, pode haver alguns problemas. Siga este checklist:

---

## 📋 Checklist de Diagnóstico

### 1. **Verificar se as Variáveis Estão na Vercel**

1. Acesse [vercel.com](https://vercel.com) → Seu Projeto
2. Vá em **Settings** → **Environment Variables**
3. Verifique se você vê:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbG...` (string longa)

### 2. **Verificar se Estão Marcadas para Production**

As variáveis devem estar marcadas para:
- ✅ **Production** (obrigatório!)
- ✅ **Preview** (recomendado)
- ✅ **Development** (opcional)

**⚠️ IMPORTANTE**: Se a variável não estiver marcada para Production, ela NÃO será usada em produção!

### 3. **Verificar o Último Deploy**

1. Na Vercel, vá em **Deployments**
2. Clique no último deploy
3. Role até a seção **"Environment Variables"**
4. Confirme que as variáveis aparecem lá:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ PROBLEMA COMUM**: Se você adicionou as variáveis DEPOIS do último deploy, elas não foram aplicadas! Faça um redeploy!

### 4. **Fazer Redeploy Obrigatório**

Após adicionar/modificar variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos **3 pontos (⋮)** do último deploy
3. Selecione **Redeploy**
4. Aguarde 1-2 minutos
5. Teste novamente

---

## 🔧 Problemas Comuns e Soluções

### Problema 1: Variáveis Adicionadas mas Não Funciona

**Causa**: Deploy foi feito ANTES de adicionar as variáveis.

**Solução**: 
1. Verifique se as variáveis estão em **Settings** → **Environment Variables**
2. Faça um **Redeploy** obrigatório
3. Aguarde o deploy completar
4. Teste novamente

### Problema 2: Variáveis no Deploy mas Não Funciona

**Causa**: Variáveis podem estar com valores errados ou vazios.

**Solução**:
1. Verifique no **Deployments** → último deploy → **Environment Variables**
2. Confirme que:
   - `NEXT_PUBLIC_SUPABASE_URL` começa com `https://` e termina com `.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` é uma string longa que começa com `eyJ`
3. Se estiverem vazias ou incorretas, edite em **Settings** → **Environment Variables**
4. Faça um novo redeploy

### Problema 3: Funciona Local mas Não em Produção

**Causa**: Variáveis estão no `.env.local` mas não na Vercel.

**Solução**:
1. Copie as variáveis do `.env.local`
2. Adicione na Vercel em **Settings** → **Environment Variables**
3. Marque para **Production**
4. Faça um redeploy

### Problema 4: Erro "Failed to fetch"

**Causa**: URL ou Key incorretas, ou CORS não configurado.

**Solução**:
1. Verifique se a URL está correta (copie exatamente do Supabase Dashboard)
2. Verifique se a chave está correta (sem espaços extras)
3. No Supabase Dashboard, vá em **Settings** → **API** → Verifique se a URL está correta

---

## 🧪 Teste Rápido

### Teste 1: Verificar Variáveis no Deploy

1. Na Vercel, vá em **Deployments**
2. Abra o último deploy
3. Veja a seção **"Environment Variables"**
4. Confirme que aparecem:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

### Teste 2: Verificar no Console do Navegador

1. Acesse `https://andenutri.com/register`
2. Abra o Console (F12)
3. Digite:
   ```javascript
   console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida');
   ```
4. Se aparecer `undefined` ou `https://placeholder.supabase.co`, as variáveis não estão sendo injetadas.

---

## 📝 Ordem Correta de Execução

1. ✅ Adicionar variáveis em **Settings** → **Environment Variables**
2. ✅ Marcar para **Production** (e Preview)
3. ✅ **SALVAR** (clique em Save)
4. ✅ Ir em **Deployments** → **Redeploy** (obrigatório!)
5. ✅ Aguardar deploy completar (1-2 minutos)
6. ✅ Testar em `https://andenutri.com/register`

---

## 🆘 Se Nada Funcionar

### Passo 1: Verificar Build Logs

1. Na Vercel, vá em **Deployments**
2. Clique no último deploy
3. Veja os **Build Logs**
4. Procure por:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` nos logs
   - ❌ Erros relacionados a variáveis de ambiente

### Passo 2: Verificar se o Build Está Usando as Variáveis

No build log da Vercel, você deve ver algo como:
```
Creating an optimized production build
Compiled successfully
```

Se houver erros sobre variáveis de ambiente, aparecerão aqui.

### Passo 3: Contatar Suporte Vercel

Se tudo acima estiver correto mas ainda não funcionar:
1. Verifique os logs de erro
2. Documente o problema
3. Considere contatar suporte da Vercel

---

## ✅ Checklist Final

- [ ] Variáveis adicionadas em Settings → Environment Variables
- [ ] Variáveis marcadas para Production
- [ ] Variáveis aparecem no último deploy (seção Environment Variables)
- [ ] Redeploy feito após adicionar/modificar variáveis
- [ ] Deploy completou sem erros
- [ ] Testado em produção e funcionou

---

## 🎯 Resumo

**90% dos problemas são**:
1. ❌ Variáveis adicionadas mas redeploy não foi feito
2. ❌ Variáveis não marcadas para Production
3. ❌ Valores incorretos (URL ou Key erradas)

**Solução mais comum**: Fazer um redeploy após configurar as variáveis!

