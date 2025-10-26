# 📋 Área Administrativa - ANDENUTRI

## 🎯 Visão Geral

A Área Administrativa do sistema ANDENUTRI permite a gestão completa dos clientes através de visualizações Trello/Kanban com informações detalhadas e campos personalizados.

---

## 🏷️ Campos do Card no Kanban

### Status do Cliente
Cada card no Kanban exibe os seguintes status visuais:

1. **Status do Programa**
   - 🟢 Ativo
   - 🔴 Inativo
   - 🟡 Pausado

2. **Status Herbalife**
   - 🟢 Ativo
   - 🔴 Inativo

3. **Status Challenge**
   - ✅ Sim (em challenge)
   - ❌ Não (não está em challenge)

### Informações Principais

1. **Nome do Cliente**
   - Campo principal do card

2. **Meta**
   - Peso Desejado: Mostra o peso objetivo
   - Exemplo: "Meta: 65kg"

3. **Peso Atual**
   - Peso atual do cliente
   - Exemplo: "Peso: 78kg"

4. **Data Próxima Consulta**
   - Data agendada para a próxima consulta
   - Formato: DD/MM/AAAA

5. **Observações Personalizadas**
   - Campo de texto livre para anotações
   - Protocolo específico
   - Observações da última consulta
   - Desafios do cliente
   - Qualquer informação relevante

---

## 📊 Visualização no Kanban

### Estrutura do Card

```
┌─────────────────────────────────┐
│  👤 Maria Silva                  │
│  🟢 Ativo | 🟢 Herbalife Ativo  │
│  ────────────────────────────── │
│  📊 Meta: 65kg                   │
│  ⚖️ Peso Atual: 78kg            │
│  📅 Próxima: 20/02/2025         │
│  ────────────────────────────── │
│  📝 Observações:                │
│  Protocolo: Mudança gradual     │
│  Foco: Redução de carboidrato   │
│  Próxima consulta: Medição      │
└─────────────────────────────────┘
```

### Tags de Status

- **Verde (Ativo)**: Cliente ativo no programa
- **Vermelho (Inativo)**: Cliente inativo
- **Amarelo (Pausado)**: Cliente com programa pausado
- **Herbalife**: Indicador se está ativo na Herbalife

---

## 📝 Campos Editáveis no Modal Administrativo

Quando você clica em um cliente no Kanban, abre o **Modal Administrativo Completo** com:

### 1. Informações Básicas (Sempre Visível)
- Nome, Email, Telefone, WhatsApp, Instagram
- Status do Programa (Ativo/Inativo/Pausado)
- Status Herbalife (Ativo/Inativo)
- Status Challenge (Sim/Não)
- Referred By (Indicado Por)

### 2. Dados da Pré-Consulta (Expandível)
- Peso Atual
- Peso Desejado
- Idade, Altura
- Rotina alimentar completa
- Condições de saúde

### 3. Avaliações Físicas (Expandível)
- Medidas corporais
- Fotos (antes/depois)
- Tipo de avaliação (inicial/reavaliacao/final)

### 4. Avaliações Emocionais (Expandível)
- História da pessoa
- Bloco emocional completo
- Nível de comprometimento

### 5. Consultas Agendadas (Expandível)
- Data da próxima consulta
- Tipo de consulta (videochamada/presencial/seguimento)
- Observações da consulta

### 6. **Campo de Observações Personalizadas** ⭐
**Campo livre para anotar:**
- Protocolo específico do cliente
- Data da última consulta
- Próximos passos
- Observações importantes
- Desafios encontrados
- Motivadores específicos
- Qualquer informação relevante

**Formato:**
- Texto livre (textarea)
- Sem limite de caracteres
- Formatação preservada
- Sempre visível no modal

---

## 🔄 Fluxo de Trabalho

### 1. Visualizar Clientes no Kanban
- Ver todos os status visuais
- Arrastar e soltar entre colunas
- Clicar para ver detalhes completos

### 2. Editar Informações
- Clicar em cliente
- Modal administrativo abre
- Expandir seções necessárias
- Editar campos desejados
- Salvar alterações

### 3. Adicionar Observações
- Abrir modal do cliente
- Ir até "Campo de Observações"
- Anotar informações importantes
- Salvar

### 4. Atualizar Próxima Consulta
- Definir data da próxima consulta
- Adicionar observações específicas para essa consulta
- Salvar

### 5. Mudar Status
- Arrastar card entre colunas
- Ou editar no modal
- Status atualiza automaticamente

---

## 🎨 Cores e Visualização

### Colunas Padrão
1. **✅ Ativo** (Verde)
   - Clientes ativos no programa
   - Estado: Em acompanhamento

2. **❌ Inativo** (Vermelho)
   - Clientes inativos
   - Estado: Sem acompanhamento ativo

3. **⏸️ Pausado** (Amarelo)
   - Clientes com programa pausado
   - Estado: Temporariamente pausado

### Colunas Personalizadas
Você pode criar colunas personalizadas como:
- Primeira Consulta
- Em Avaliação
- Acompanhamento Ativo
- Reavaliação Pendente
- Concluído
- etc.

---

## 📊 Informações por Seção

### Cada Card Exibe:
✅ Nome do cliente
✅ Status do programa
✅ Status Herbalife
✅ Meta (peso desejado)
✅ Peso atual
✅ Data da próxima consulta
✅ Observações personalizadas (resumo)
✅ Botão para ver detalhes completos

### Modal Completo Exibe:
✅ Todas as informações do card
✅ Informações básicas completas
✅ Dados da pré-consulta (expandível)
✅ Avaliações físicas (expandível)
✅ Avaliações emocionais (expandível)
✅ Histórico de reavaliações (expandível)
✅ Consultas agendadas (expandível)
✅ **Campo de observações personalizadas** (sempre visível)

---

## 💡 Dicas de Uso

### 1. Usando Observações
- Use para protocolos específicos
- Anote datas importantes
- Registre mudanças de comportamento
- Documente progressos

### 2. Organizando no Kanban
- Arraste clientes entre colunas conforme o progresso
- Crie colunas personalizadas para seu fluxo de trabalho
- Use cores diferentes para visualização rápida

### 3. Editando Dados
- Clique em qualquer cliente para editar
- Todos os campos são opcionais
- Salve apenas o que é relevante

### 4. Criando Colunas Personalizadas
- Clique em "Nova Coluna"
- Escolha nome e cor
- Comece a organizar seus clientes

---

## 🔐 Sincronização

### Integração com Supabase
- Todos os dados são salvos automaticamente
- Mudanças são sincronizadas em tempo real
- Histórico completo de alterações

### Backup
- Todos os dados ficam armazenados no Supabase
- Backup automático diário
- Sem risco de perda de dados

---

## 📱 Responsividade

### Desktop
- Visualização completa do Kanban
- 3+ colunas visíveis simultaneamente
- Modais em tamanho grande

### Tablet
- 2-3 colunas visíveis
- Modais ajustados automaticamente

### Mobile
- 1 coluna por vez
- Scroll horizontal
- Modais em tela cheia

---

## ✅ Checklist Área Administrativa

- [x] Visualização Kanban com status visuais
- [x] Drag & drop entre colunas
- [x] Modal administrativo completo
- [x] Seções expansíveis
- [x] Campo de observações personalizadas
- [x] Data de próxima consulta
- [x] Status do programa
- [x] Status Herbalife
- [x] Status Challenge
- [x] Informações de meta/peso
- [x] Todas as informações editáveis
- [x] Nenhum campo obrigatório
- [x] Salvar dados parciais
- [x] Criar colunas personalizadas

---

## 🚀 Próximas Funcionalidades

### Planejadas
- [ ] Integração com Google Calendar
- [ ] Notificações de próximas consultas
- [ ] Gráficos de evolução
- [ ] Exportação de relatórios
- [ ] Sistema de tags visuais (bolinhas coloridas)
- [ ] Busca avançada
- [ ] Filtros por status
- [ ] Histórico de alterações

---

**📝 Nota**: Esta área administrativa está sendo desenvolvida continuamente para atender todas as suas necessidades de gestão de clientes.

