# 🔒 Como Configurar Isolamento de Dados por Usuário

## 📋 Objetivo

Este script configura o isolamento de dados para que:
- ✅ **Dados existentes** sejam associados ao primeiro usuário (Deise Faula)
- ✅ **Novos usuários** vejam apenas seus próprios dados
- ✅ **Isolamento automático** de todos os registros criados

---

## 🚀 Passos para Executar

### 1. **Executar Script SQL**

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Cole o conteúdo completo do arquivo `supabase/configurar-isolamento-usuarios.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)

✅ Isso irá:
- Adicionar campo `user_id` nas tabelas principais
- Associar TODOS os dados existentes ao primeiro usuário do sistema
- Criar triggers para associar automaticamente novos dados ao usuário atual

---

### 2. **Verificar o Primeiro Usuário**

Para verificar qual usuário foi associado aos dados existentes:

```sql
-- Ver o primeiro usuário criado
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at ASC 
LIMIT 1;

-- Ver quantos clientes pertencem a cada usuário
SELECT 
    u.email,
    COUNT(c.id) as total_clientes
FROM auth.users u
LEFT JOIN clientes c ON c.user_id = u.id
GROUP BY u.email
ORDER BY u.created_at ASC;
```

---

### 3. **Como Funciona**

Após executar o script:

1. **Campo `user_id`** é adicionado nas tabelas:
   - `clientes`
   - `eventos_agenda`
   - `kanban_colunas`
   - `configuracoes_profissional`
   - `anamneses`
   - `ciclos_menstruais`
   - `sintomas_diarios`

2. **Dados existentes** são associados ao primeiro usuário:
   - Todos os clientes sem `user_id` recebem o ID do primeiro usuário
   - Todos os eventos, colunas kanban, etc. também são associados

3. **Novos registros** automaticamente:
   - Quando um usuário criar um cliente, o `user_id` será preenchido automaticamente
   - Não é necessário passar `user_id` manualmente no código

4. **Triggers automáticos**:
   - Função `set_user_id_from_auth()` preenche `user_id` com o ID do usuário autenticado
   - Funciona para INSERTs em todas as tabelas configuradas

---

## ⚠️ Importante

- **O script é idempotente**: Pode ser executado múltiplas vezes sem problemas
- **Não apaga dados**: Apenas adiciona colunas e associa dados existentes
- **Segurança**: Usa `SECURITY DEFINER` para que os triggers funcionem corretamente

---

## ✅ Após Executar

O código frontend será atualizado automaticamente para:
- Filtrar dados por `user_id` do usuário autenticado
- Garantir que cada usuário veja apenas seus próprios dados
- Novos registros serão automaticamente associados ao usuário correto

---

## 🔍 Verificação

Para verificar se funcionou:

```sql
-- Ver clientes por usuário
SELECT 
    u.email as usuario,
    COUNT(c.id) as total_clientes
FROM auth.users u
LEFT JOIN clientes c ON c.user_id = u.id
GROUP BY u.id, u.email
ORDER BY u.created_at ASC;
```

Você deve ver:
- **Primeiro usuário (Deise Faula)**: Todos os clientes existentes
- **Outros usuários**: 0 clientes (até criarem os seus)

---

## 📝 Próximos Passos

Após executar este script, o código frontend será atualizado para:
1. Filtrar todas as queries por `user_id` do usuário autenticado
2. Garantir que novos registros incluam o `user_id` correto
3. Mostrar apenas dados do usuário atual em todas as telas

