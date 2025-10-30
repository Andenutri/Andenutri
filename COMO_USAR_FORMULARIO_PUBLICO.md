# 📋 Como Usar o Formulário Público

## 🎯 Visão Geral

Cada nutricionista tem seu próprio link único para receber formulários de clientes. Quando um cliente preenche o formulário através do seu link, os dados são automaticamente associados à sua conta.

---

## ✅ Passo a Passo para Nutricionista

### 1. **Criar seu Link Único**

1. Faça login no sistema
2. No menu lateral, clique em **"🔗 Links do Formulário"**
3. Clique em **"➕ Criar Novo Link"**
4. Um código único será gerado (ex: `ABC123`)
5. Seu link será: `https://andenutri.com/formulario/ABC123`

---

### 2. **Compartilhar o Link**

Após criar o link, você verá:
- **URL completa** do formulário
- Botão **"📋 Copiar Link"** para copiar facilmente
- Estatísticas do link (total de formulários recebidos)

**Formas de compartilhar:**
- ✅ WhatsApp
- ✅ Instagram (bio, stories)
- ✅ Email
- ✅ Site pessoal
- ✅ Cartão de visita (QR Code - futuro)

---

### 3. **Receber Formulários**

Quando um cliente preenche seu formulário:
- ✅ Um novo cliente é criado automaticamente
- ✅ O formulário de pré-consulta é salvo
- ✅ Tudo é associado ao seu `user_id`
- ✅ O cliente aparece na sua lista de clientes
- ✅ O contador de submissões do link é incrementado

---

### 4. **Gerenciar Links**

Você pode:
- **▶️ Ativar/Pausar**: Pausar um link temporariamente sem deletá-lo
- **🗑️ Deletar**: Remover um link permanentemente
- **📊 Ver Estatísticas**: Quantos formulários cada link recebeu
- **📋 Copiar Link**: Copiar URL para compartilhar

---

## 🔒 Segurança e Privacidade

- ✅ Cada nutricionista só vê seus próprios links
- ✅ Cada cliente só consegue preencher através de um link válido
- ✅ Dados são automaticamente associados ao `user_id` correto
- ✅ Links inativos não aceitam novos formulários

---

## 📝 Estrutura no Supabase

### Tabela: `links_formularios`
```sql
- id: UUID
- codigo: TEXT (único) -- Ex: "ABC123"
- user_id: UUID (referência ao nutricionista)
- nutricionista_nome: TEXT
- ativo: BOOLEAN
- total_submissoes: INTEGER
- criado_em: TIMESTAMP
- atualizado_em: TIMESTAMP
```

### Fluxo de Dados:
1. Cliente acessa `/formulario/ABC123`
2. Sistema busca `links_formularios` onde `codigo = 'ABC123'`
3. Obtém o `user_id` do nutricionista
4. Cria cliente em `clientes` com `user_id` e `codigo_link = 'ABC123'`
5. Cria formulário em `formularios_pre_consulta` ligado ao cliente
6. Incrementa `total_submissoes` do link

---

## 🚀 Configuração Inicial

### 1. Executar Script SQL

No Supabase SQL Editor, execute:
```
supabase/criar-tabela-links-formularios.sql
```

Isso criará:
- Tabela `links_formularios`
- Coluna `codigo_link` em `clientes` (para rastreamento)
- Funções e triggers necessários
- Políticas RLS para segurança

### 2. Criar Link para Usuários Existentes

Para a Deise Faula (ou outros usuários existentes):

```sql
INSERT INTO links_formularios (codigo, user_id, nutricionista_nome, ativo)
SELECT 'DISE123', id, email, true
FROM auth.users
WHERE email = 'deisefaula@gmail.com'
ON CONFLICT (codigo) DO NOTHING;
```

Ou usar a interface do sistema (mais fácil).

---

## 📱 URL do Formulário

**Formato:** `https://andenutri.com/formulario/[CODIGO]`

**Exemplos:**
- `https://andenutri.com/formulario/DISE123`
- `https://andenutri.com/formulario/ABC123`
- `https://andenutri.com/formulario/MARIA456`

---

## ❓ Perguntas Frequentes

### P: Posso ter múltiplos links?
**R:** Sim! Cada nutricionista pode criar quantos links quiser. Útil para:
- Rastrear origem (ex: Instagram vs WhatsApp)
- Campanhas específicas
- Diferentes nichos/serviços

### P: O que acontece se eu deletar um link?
**R:** O link não aceitará mais formulários, mas os dados já recebidos continuam na sua conta.

### P: Como sei se um cliente veio pelo formulário?
**R:** Clientes criados via formulário têm `is_lead = true` e `codigo_link` preenchido.

### P: Posso pausar um link?
**R:** Sim! Use o botão "⏸️ Pausar" para desativar temporariamente sem deletar.

---

## ✅ Checklist

- [ ] Executou o script SQL no Supabase
- [ ] Criou seu primeiro link no sistema
- [ ] Copiou o link gerado
- [ ] Testou acessando o link em modo anônimo
- [ ] Compartilhou o link com clientes
- [ ] Verificou que os dados chegam corretamente na lista de clientes

---

## 🎉 Pronto!

Agora você pode receber formulários de clientes automaticamente. Cada cliente que preencher seu link terá seus dados salvos e associados à sua conta!

