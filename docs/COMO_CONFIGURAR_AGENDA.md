# 📅 Como Configurar a Agenda ANDENUTRI

## 🎯 OBJETIVO

Criar um sistema de Agenda completo que:
- Exibe aniversários dos clientes
- Mostra vencimentos de planos
- Permite adicionar compromissos personalizados
- Integra com Google Calendar (futuro)

---

## 📋 PASSO 1: Configurar Supabase RLS (IMPORTANTE!)

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com
- Entre na sua conta
- Abra o projeto "Andenutri"

### 2. Execute o Script RLS
- Vá em: **SQL Editor** (menu lateral esquerdo)
- Clique em **New Query**
- Cole o conteúdo completo do arquivo: `supabase/corrigir-rls.sql`
- Clique em **Run** (botão verde no canto inferior direito)

✅ Isso vai permitir que você salve clientes sem erro 401!

---

## 📋 PASSO 2: Estrutura da Tabela de Agenda

A tabela `consultas` já existe e inclui os campos necessários:
- `id` - ID único
- `cliente_id` - ID do cliente
- `tipo` - Tipo de evento (aniversário, vencimento, compromisso, etc)
- `titulo` - Título do evento
- `data` - Data do evento
- `hora` - Hora do evento (opcional)
- `descricao` - Descrição adicional
- `cor` - Cor do evento para visualização
- `data_criacao` - Data de criação

---

## 📋 PASSO 3: Criar Componente de Agenda

Vou criar o componente `AgendaView.tsx` que vai:
1. **Buscar eventos do Supabase** (consultas, aniversários, vencimentos)
2. **Exibir calendário mensal** com eventos marcados
3. **Mostrar lista de eventos** do mês atual
4. **Permitir adicionar novos eventos**
5. **Destacar próximos vencimentos/aniversários**

---

## 📋 PASSO 4: Implementar Lógica de Busca

A agenda vai buscar:
1. **Aniversários** - calcular a partir da data de nascimento dos clientes
2. **Vencimentos** - buscar do campo `data_vencimento` dos clientes
3. **Compromissos** - buscar da tabela `consultas`
4. **Consultas agendadas** - buscar da tabela `consultas` com tipo='consulta'

---

## 🚀 PRÓXIMOS PASSOS

Depois de configurar o Supabase RLS, a próxima etapa é:

1. **Criar o componente AgendaView.tsx**
2. **Adicionar a agenda no Sidebar**
3. **Implementar função de adicionar eventos**
4. **Implementar visualização de calendário**
5. **Adicionar integração com Google Calendar (futuro)**

---

## ⚠️ IMPORTANTE

**Execute o script RLS ANTES de testar!**
Sem isso, você vai continuar recebendo erro 401 ao tentar salvar dados.

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas sobre como executar o script SQL no Supabase, me avise!
