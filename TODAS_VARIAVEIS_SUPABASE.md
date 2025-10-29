# 🔑 Todas as Variáveis do Supabase - Explicação

## ✅ Variáveis OBRIGATÓRIAS (Para funcionar o sistema)

Essas duas variáveis são **ESSENCIAIS** para login, registro e todas as funcionalidades:

### 1. `NEXT_PUBLIC_SUPABASE_URL`
**Nome:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Valor:**
```
https://yccvlhgoilrshwtbkmte.supabase.co
```

**Onde configurar:** Vercel → Settings → Environment Variables

---

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Nome:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Valor:**
```
eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi0iJzdXBhYmFzZSIsInJlZiI6InljY3ZsaGdvaWxyc2h3dGJrbXRlIiwicm9sZSI6ImFub24iLCJpYXQi0jE3NjE0NjYzMjMsImV4cCI6MjA3NzA0MjMyM30.03mAHDeXheaSmzGVpXVKpcmvqqdqhKIrgnnqnQ0aGE8
```

**Onde configurar:** Vercel → Settings → Environment Variables

---

## 📋 Variáveis OPCIONAIS (Não obrigatórias para funcionamento básico)

Essas variáveis podem ser úteis mas **NÃO são necessárias** para o sistema funcionar:

### 3. `SUPABASE_SERVICE_ROLE_KEY` (Opcional)

**⚠️ IMPORTANTE**: Esta chave é **MUITO SENSÍVEL** e **NUNCA deve ser exposta no frontend**.

- **Uso**: Apenas para scripts de servidor ou operações administrativas avançadas
- **Segurança**: Nunca use `NEXT_PUBLIC_` antes desta variável
- **Necessário para o sistema atual?**: ❌ NÃO - O sistema atual não usa essa chave
- **Recomendação**: Deixe ela apenas no `.env.local` se precisar, mas NÃO coloque na Vercel a menos que você precise fazer operações administrativas avançadas via API

**Se quiser adicionar (apenas se necessário):**
- **Nome**: `SUPABASE_SERVICE_ROLE_KEY` (SEM `NEXT_PUBLIC_`)
- **Valor**: A chave service_role do seu Supabase
- **Onde encontrar**: Supabase Dashboard → Settings → API → service_role key
- **⚠️ CUIDADO**: Esta chave tem acesso total ao banco de dados!

---

### 4. `SUPABASE_PROJECT_ID` (Opcional)

- **Uso**: Identificador do projeto, geralmente usado para referências internas
- **Necessário para o sistema atual?**: ❌ NÃO - O sistema atual não usa esse ID
- **Pode adicionar?**: ✅ Sim, mas não é necessário

**Se quiser adicionar (opcional):**
- **Nome**: `NEXT_PUBLIC_SUPABASE_PROJECT_ID` (com `NEXT_PUBLIC_` se for usar no frontend)
- **Valor**: `yccvlhgoilrshwtbkmte` (extrai da URL do Supabase)
- **Onde encontrar**: Está na URL do seu projeto (https://**yccvlhgoilrshwtbkmte**.supabase.co)

---

## 🎯 Resumo: O Que Você Precisa Agora

### ✅ Adicionar na Vercel (OBRIGATÓRIO):

1. `NEXT_PUBLIC_SUPABASE_URL` = `https://yccvlhgoilrshwtbkmte.supabase.co`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGci0iJ...` (a chave completa)

### ❌ NÃO precisa adicionar agora:

- `SUPABASE_SERVICE_ROLE_KEY` - Só se precisar fazer scripts administrativos (e SEM `NEXT_PUBLIC_`)
- `SUPABASE_PROJECT_ID` - Não é usado pelo sistema atual

---

## ✅ Checklist Final

- [ ] `NEXT_PUBLIC_SUPABASE_URL` adicionada na Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada na Vercel
- [ ] Ambas marcadas para Production, Preview e Development
- [ ] Redeploy feito
- [ ] Testado e funcionando ✅

---

## 🔐 Segurança

**Lembre-se:**
- ✅ Variáveis com `NEXT_PUBLIC_` ficam visíveis no código frontend (isso é normal e seguro para chaves anon)
- ❌ `SERVICE_ROLE_KEY` **NUNCA** deve ter `NEXT_PUBLIC_` - ela é muito poderosa!
- 🔒 A chave anon (`ANON_KEY`) é projetada para ser pública e segura

---

## 📝 Se Você Tiver Essas Variáveis no `.env.local`

No arquivo local você pode ter:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PROJECT_ID=...
```

Mas na Vercel, você precisa das versões com `NEXT_PUBLIC_`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

A `SERVICE_ROLE_KEY` fica apenas no servidor (sem `NEXT_PUBLIC_`) e só se você realmente precisar dela.

---

## 🎉 Conclusão

**Para o sistema funcionar, você só precisa das 2 variáveis obrigatórias!**

As outras (`SERVICE_ROLE_KEY` e `PROJECT_ID`) são opcionais e só adicione se realmente precisar.

