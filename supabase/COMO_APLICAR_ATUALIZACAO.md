# 📝 Como Aplicar Atualizações no Supabase

## 🎯 O que foi implementado hoje

1. **Sistema de Agenda** - Calendário completo tipo Google Calendar
2. **Avaliação Física Completa** - 13 campos editáveis
3. **Layout Mobile-First** - Totalmente responsivo
4. **Rotas Dedicadas** - `/cliente/[id]` e `/agenda`

## 📋 Scripts Disponíveis

### 1. `schema.sql` (Base completa)
Todas as tabelas principais do sistema:
- ✅ clientes
- ✅ formularios_pre_consulta
- ✅ avaliacoes_fisicas
- ✅ avaliacoes_emocionais
- ✅ avaliacoes_comportamentais
- ✅ cardapios
- ✅ kanban_colunas
- ✅ planos_assinatura
- ✅ consultas
- ✅ reavaliacoes

### 2. `atualizar-tabelas-2025.sql` (RECOMENDADO ⭐)
**USE ESTE PARA ATUALIZAR O BANCO EXISTENTE**

Adiciona:
- ✅ Tabela `eventos_agenda` (nova)
- ✅ Novos campos na tabela `avaliacoes_fisicas`:
  - percentual_gordura
  - percentual_musculo
  - gordura_visceral
  - metabolismo_basal
  - barriga
  - braco
  - coxa

### 3. `adicionar-campos-novos.sql`
Adiciona campos extras na tabela avaliacoes_fisicas:
- massa_gorda
- massa_magra
- visceral
- busto
- pescoco
- protocolo_aplicado

## 🚀 Como Aplicar no Supabase

### Opção 1: Via Dashboard do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo do arquivo `atualizar-tabelas-2025.sql`
5. Clique em **Run**

### Opção 2: Via CLI do Supabase

```bash
# Se tiver o Supabase CLI instalado
supabase db execute -f supabase/atualizar-tabelas-2025.sql
```

### Opção 3: Copiar e Colar

1. Abra o arquivo `supabase/atualizar-tabelas-2025.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

## 📊 Estrutura da Tabela `eventos_agenda`

```sql
CREATE TABLE eventos_agenda (
  id UUID PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento TIMESTAMP NOT NULL,
  hora TEXT,
  tipo_evento TEXT,  -- consulta | reavaliacao | follow-up | outro
  lembrete TEXT,     -- 5min | 15min | 30min | 1h | 2h | 1dia
  status TEXT,       -- agendado | realizado | cancelado
  cor TEXT,
  notificado BOOLEAN,
  data_notificacao TIMESTAMP,
  data_criacao TIMESTAMP,
  data_atualizacao TIMESTAMP
);
```

## ✨ Funcionalidades Implementadas

### Agenda (`/agenda`)
- ✅ Visualização Mensal, Semanal e Diária
- ✅ Layout Trello na semana (colunas lado a lado)
- ✅ Criação, edição e exclusão de eventos
- ✅ Drag & Drop para mover eventos
- ✅ Filtros por cliente e tipo
- ✅ Sistema de lembretes (5min, 15min, 30min, 1h, 2h, 1dia)
- ✅ Cores diferentes por tipo de evento

### Avaliação Física Editável
- ✅ 13 campos completos
- ✅ Visualização em cards coloridos
- ✅ Editar qualquer avaliação existente
- ✅ Adicionar novas avaliações
- ✅ Excluir avaliações
- ✅ Histórico de evolução

### Página do Cliente (`/cliente/[id]`)
- ✅ Área dedicada para cada cliente
- ✅ Visão geral com métricas
- ✅ Atalhos para todas as ações
- ✅ Avaliação física editável integrada

## ⚠️ Importante

- O script `atualizar-tabelas-2025.sql` é **idempotente** (pode rodar várias vezes sem problemas)
- Ele verifica se os campos já existem antes de criar
- Não vai apagar dados existentes
- É seguro executar múltiplas vezes

## 🎉 Próximos Passos

Após aplicar o script:
1. Conecte o Supabase no código
2. Atualize as funções em `src/data/clientesData.ts`
3. Teste a sincronização
4. Dados mock ainda funcionam até conectar

