# 📋 Como Usar o Sistema de Reavaliação

## 🎯 Visão Geral

Cada cliente tem um **código único de reavaliação**. Quando o cliente acessa o link e preenche as perguntas, as respostas são automaticamente salvas na ficha dele.

---

## ✅ Passo a Passo para Nutricionista

### 1. **Executar Script SQL no Supabase**

**Importante**: Execute primeiro para gerar os códigos:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase/criar-tabela-reavaliacoes.sql`
4. Clique em **Run**

Isso irá:
- ✅ Adicionar campo `codigo_reavaliacao` na tabela `clientes`
- ✅ Gerar códigos únicos para todos os clientes existentes
- ✅ Criar trigger para gerar código automaticamente em novos clientes
- ✅ Criar tabela `reavaliacoes_respostas` para armazenar as respostas

---

### 2. **Compartilhar Link de Reavaliação**

1. Abra o perfil do cliente (clique no cliente na lista)
2. No modal de detalhes, você verá a seção **"📋 Link de Reavaliação"**
3. Copie o link gerado automaticamente
4. Compartilhe com o cliente via WhatsApp, email, etc.

**Formato do link**: `https://andenutri.com/reavaliacao/[CODIGO]`

**Exemplo**: `https://andenutri.com/reavaliacao/ABC12345`

---

### 3. **Cliente Preenche o Formulário**

Quando o cliente acessa o link:
- ✅ Sistema identifica automaticamente qual cliente é (pelo código)
- ✅ Mostra o nome do cliente: "Olá, [Nome]! Preencha o formulário..."
- ✅ Cliente responde todas as 15 perguntas
- ✅ Dados são salvos automaticamente na ficha do cliente

---

### 4. **Ver Respostas da Reavaliação**

1. Abra o perfil do cliente
2. Expanda a seção **"📋 Reavaliações Preenchidas"**
3. Veja todas as reavaliações já preenchidas pelo cliente
4. Cada reavaliação mostra:
   - Data de preenchimento
   - Todas as respostas fornecidas
   - Histórico completo de reavaliações

---

## 📝 Perguntas da Reavaliação

O formulário contém exatamente as 15 perguntas que você especificou:

1. **Quanto está pesando hoje?**
2. **Além do peso, quais mudanças você já percebeu no corpo ou na disposição?**
3. **Como está sua energia ao longo do dia?**
4. **Como está o intestino e o sono atualmente?**
5. **Está conseguindo manter uma rotina de alimentação organizada?**
6. **Quais refeições são mais fáceis de seguir? E quais ainda são mais desafiadoras?**
7. **Está conseguindo manter a ingestão de água e o uso dos suplementos?**
8. **Está conseguindo praticar alguma atividade física? Qual e com que frequência?**
9. **O que mais te ajudou nesse processo?**
10. **O que mais te atrapalhou nas últimas semanas?**
11. **No que o Programa tem te ajudado?**
12. **O que você gostaria que o programa te ajudasse mais?**
13. **Tem algo que gostaria de mudar na estratégia (alimentação, treino, suplementação, rotina)?**
14. **Qual será seu maior foco para essa nova fase?**

---

## 🔒 Como Funciona a Identificação

### Sistema de Código Único

- Cada cliente recebe automaticamente um **código único** (ex: `ABC12345`)
- Código é gerado automaticamente quando:
  - Cliente é criado via formulário público
  - Cliente é criado manualmente
  - Script SQL é executado (para clientes existentes)

### Identificação no Link

1. Cliente acessa: `/reavaliacao/ABC12345`
2. Sistema busca na tabela `clientes` onde `codigo_reavaliacao = 'ABC12345'`
3. Identifica o cliente automaticamente
4. Mostra nome do cliente no formulário
5. Salva respostas associadas ao `cliente_id` correto

---

## 📊 Estrutura no Supabase

### Campo na Tabela `clientes`:
```sql
codigo_reavaliacao TEXT UNIQUE
```

### Tabela `reavaliacoes_respostas`:
```sql
- id: UUID
- cliente_id: UUID (referência ao cliente)
- user_id: UUID (referência ao nutricionista)
- peso_atual: TEXT
- mudancas_corpo_disposicao: TEXT
- energia_dia: TEXT
- intestino_sono: TEXT
- rotina_alimentacao_organizada: TEXT
- refeicoes_faceis: TEXT
- refeicoes_desafiadoras: TEXT
- agua_suplementos: TEXT
- atividade_fisica: TEXT
- o_que_ajudou: TEXT
- o_que_atrapalhou: TEXT
- programa_ajudou: TEXT
- programa_ajudar_mais: TEXT
- mudar_estrategia: TEXT
- maior_foco_nova_fase: TEXT
- data_preenchimento: TIMESTAMP
```

---

## ✅ Checklist de Uso

- [ ] Executei o script SQL `criar-tabela-reavaliacoes.sql` no Supabase
- [ ] Verifiquei que os clientes têm `codigo_reavaliacao` preenchido
- [ ] Testei abrindo o perfil de um cliente e vi o link de reavaliação
- [ ] Copiei o link e testei acessando como cliente
- [ ] Preenchi o formulário de teste
- [ ] Verifiquei que as respostas apareceram na seção "Reavaliações Preenchidas"

---

## 🎉 Pronto!

Agora você pode:
- ✅ Compartilhar link único de reavaliação com cada cliente
- ✅ Cliente preenche antes da consulta
- ✅ Respostas aparecem automaticamente na ficha do cliente
- ✅ Ver histórico completo de todas as reavaliações
- ✅ Ter controle total do processo de reavaliação

---

## 💡 Dica

**Envie o link de reavaliação junto com o convite da consulta:**
- "Olá [Nome]! Antes da nossa consulta, por favor preencha este formulário: [link]"
- Isso garante que você já terá as informações quando o cliente chegar!

