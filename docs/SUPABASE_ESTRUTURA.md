# 📊 Estrutura de Banco de Dados - Supabase

## Nomenclatura e Convenções

### Prefixos de Tabelas
- Nenhum prefixo para tabelas principais
- Tabelas relacionais usam verbo de ação quando necessário

### Convenções de Nomes
- **Tabelas**: `snake_case` (ex: `clientes`, `avaliacoes_fisicas`)
- **Colunas**: `snake_case` (ex: `data_criacao`, `status_plano`)
- **Chaves Estrangeiras**: `{tabela}_id` (ex: `cliente_id`, `avaliacao_id`)
- **Booleanos**: Prefixo `eh_` ou `tem_` (ex: `eh_ativo`, `tem_pagamento`)
- **Datas**: Prefixo `data_` (ex: `data_nascimento`, `data_vencimento`)
- **Status**: `status_{categoria}` (ex: `status_plano`, `status_herbalife`)

---

## 🗂️ Estrutura Completa de Tabelas

### 1. Tabela: `clientes`
Armazena informações básicas dos clientes.

```sql
- id (uuid, PK, default: uuid_generate_v4())
- nome (text, NOT NULL)
- email (text, UNIQUE, NOT NULL)
- telefone (text)
- whatsapp (text)
- instagram (text)
- pais_telefone (text, default: '+55')
- endereco_completo (text)
- pais (text, default: 'Brasil')
- estado (text)
- cidade (text)
- status_programa (text, values: 'ativo'|'inativo'|'pausado', default: 'ativo')
- status_herbalife (text, values: 'ativo'|'inativo', default: 'inativo')
- status_challenge (text, values: 'sim'|'nao', default: 'nao')
- herbalife_usuario (text)
- herbalife_senha (text)
- indicado_por (text)
- data_criacao (timestamp, default: now())
- data_atualizacao (timestamp, default: now())
```

### 2. Tabela: `formularios_pre_consulta`
Dados do formulário de pré-consulta preenchido pelo cliente.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, UNIQUE, NOT NULL)
- nome_completo (text)
- idade (text)
- altura (text)
- peso_atual (text)
- peso_desejado (text)
- conheceu_programa (text)
- trabalho (text)
- horario_trabalho (text)
- dias_trabalho (text)
- hora_acorda (text)
- hora_dorme (text)
- qualidade_sono (text)
- casada (text)
- filhos (text)
- nomes_idades_filhos (text)
- condicao_saude (text)
- uso_medicacao (text)
- medicacao_qual (text)
- restricao_alimentar (text)
- usa_suplemento (text)
- quais_suplementos (text)
- sente_dor (text)
- onde_dor (text)
- cafe_manha (text)
- lanche_manha (text)
- almoco (text)
- lanche_tarde (text)
- jantar (text)
- ceia (text)
- alcool_freq (text)
- consumo_agua (text)
- intestino_vezes_semana (text)
- atividade_fisica (text)
- refeicao_dificil (text)
- belisca_quando (text)
- muda_fins_semana (text)
- escala_cuidado (text)
- data_preenchimento (timestamp, default: now())
- data_criacao (timestamp, default: now())
```

### 3. Tabela: `avaliacoes_fisicas`
Avaliações físicas com medidas e fotos (antes/depois).

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- data_avaliacao (date, NOT NULL)
- peso (decimal)
- altura (decimal)
- braco_esquerdo (decimal)
- braco_direito (decimal)
- peito (decimal)
- cintura (decimal)
- abdomen (decimal)
- quadril (decimal)
- coxa_esquerda (decimal)
- coxa_direita (decimal)
- foto_frente_url (text)
- foto_perfil_url (text)
- foto_costas_url (text)
- observacoes (text)
- tipo_avaliacao (text, values: 'inicial'|'reavaliacao'|'final', default: 'inicial')
- data_criacao (timestamp, default: now())
```

### 4. Tabela: `avaliacoes_emocionais`
Bloco emocional e motivacional da avaliação.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- historia_pessoa (text)
- momento_mudanca (text)
- incomoda_espelho (text)
- situacao_corpo (text)
- atrapalha_dia_dia (text)
- maior_medo (text)
- por_que_eliminar_kilos (text)
- tentou_antes (text)
- oque_fara_peso_desejado (text)
- tres_motivos (text)
- nivel_comprometimento (integer, range: 0-10, default: 0)
- conselho_si (text)
- data_criacao (timestamp, default: now())
```

### 5. Tabela: `avaliacoes_comportamentais`
Bloco comportamental da avaliação.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- ponto_fraco_alimentacao (text)
- organizada_ou_improvisa (text)
- come_por_que (text)
- momentos_dificeis (text)
- prazer_alem_comida (text)
- premia_com_comida (text)
- data_criacao (timestamp, default: now())
```

### 6. Tabela: `cardapios`
Cardápios enviados aos clientes.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- titulo (text, NOT NULL)
- descricao (text)
- texto_cardapio (text)
- tipo_cardapio (text, values: 'perda_peso'|'ganho_massa'|'manutencao'|'detox')
- data_inicio (date)
- data_fim (date)
- enviado_por_email (boolean, default: false)
- data_envio (timestamp)
- data_criacao (timestamp, default: now())
```

### 7. Tabela: `kanban_colunas`
Colunas do kanban/trello personalizadas.

```sql
- id (uuid, PK)
- nome (text, NOT NULL)
- cor (text, NOT NULL)
- ordem (integer, NOT NULL)
- clientes_ids (jsonb, default: '[]'::jsonb)
- data_criacao (timestamp, default: now())
```

### 8. Tabela: `planos_assinatura`
Planos e assinaturas dos clientes.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- tipo_plano (text, values: 'basico'|'premium'|'vip')
- data_inicio (date, NOT NULL)
- data_vencimento (date, NOT NULL)
- valor_mensal (decimal)
- status_pagamento (text, values: 'pago'|'pendente'|'atrasado'|'cancelado')
- metodo_pagamento (text)
- data_criacao (timestamp, default: now())
```

### 9. Tabela: `consultas`
Agendamentos e consultas.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- data_consulta (timestamp, NOT NULL)
- tipo_consulta (text, values: 'videochamada'|'presencial'|'seguimento')
- titulo (text)
- observacoes (text)
- status (text, values: 'agendada'|'realizada'|'cancelada', default: 'agendada')
- data_criacao (timestamp, default: now())
```

### 10. Tabela: `reavaliacoes`
Histórico de reavaliações ao longo do tempo.

```sql
- id (uuid, PK)
- cliente_id (uuid, FK -> clientes.id, NOT NULL)
- avaliacao_fisica_id (uuid, FK -> avaliacoes_fisicas.id)
- avaliacao_emocional_id (uuid, FK -> avaliacoes_emocionais.id)
- avaliacao_comportamental_id (uuid, FK -> avaliacoes_comportamentais.id)
- data_reavaliacao (date, NOT NULL)
- observacoes (text)
- progresso (text)
- data_criacao (timestamp, default: now())
```

---

## 🔗 Relacionamentos

### Clientes
- 1:N com `formularios_pre_consulta`
- 1:N com `avaliacoes_fisicas`
- 1:N com `avaliacoes_emocionais`
- 1:N com `avaliacoes_comportamentais`
- 1:N com `cardapios`
- 1:N com `planos_assinatura`
- 1:N com `consultas`
- 1:N com `reavaliacoes`

### Reavaliações
- N:1 com `avaliacoes_fisicas`
- N:1 com `avaliacoes_emocionais`
- N:1 com `avaliacoes_comportamentais`

---

## 🎯 Tipos de Dados Sugeridos

### Text
- Para campos curtos: `text`
- Para campos longos: `text`
- Para JSON: `jsonb`

### Numeric
- Para medidas: `decimal(5,2)`
- Para porcentagens: `integer` ou `decimal(5,2)`

### Datas
- Apenas data: `date`
- Data e hora: `timestamp`
- Com timezone: `timestamptz`

### Boolean
- Usar `boolean` (true/false)

---

## 🚀 Índices Recomendados

```sql
-- Índices para performance
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_status ON clientes(status_programa);
CREATE INDEX idx_formularios_cliente ON formularios_pre_consulta(cliente_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes_fisicas(cliente_id);
CREATE INDEX idx_consultas_data ON consultas(data_consulta);
CREATE INDEX idx_planos_vencimento ON planos_assinatura(data_vencimento);
```

---

## 📝 Notas de Implementação

1. **UUID vs SERIAL**: Usando UUID para melhor distribuição e privacidade
2. **Timestamps**: Toda tabela tem `data_criacao` para auditoria
3. **Soft Delete**: Adicionar `deleted_at` timestamp quando necessário
4. **Row Level Security**: Configurar RLS no Supabase para segurança
5. **Triggers**: Atualizar `data_atualizacao` automaticamente

---

## 🔐 Row Level Security (RLS)

Todas as tabelas devem ter RLS habilitado:

```sql
-- Habilitar RLS
ALTER TABLE nome_da_tabela ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas usuários autenticados podem ver seus dados
CREATE POLICY "Users can view own data" ON nome_da_tabela
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy: Usuários podem inserir seus próprios dados
CREATE POLICY "Users can insert own data" ON nome_da_tabela
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 📊 Views Recomendadas

### View: `clientes_completos`
```sql
CREATE VIEW clientes_completos AS
SELECT 
  c.*,
  f.*,
  COUNT(DISTINCT af.id) as total_avaliacoes_fisicas,
  COUNT(DISTINCT ae.id) as total_avaliacoes_emocionais,
  COUNT(DISTINCT cp.id) as total_cardapios
FROM clientes c
LEFT JOIN formularios_pre_consulta f ON c.id = f.cliente_id
LEFT JOIN avaliacoes_fisicas af ON c.id = af.cliente_id
LEFT JOIN avaliacoes_emocionais ae ON c.id = ae.cliente_id
LEFT JOIN cardapios cp ON c.id = cp.cliente_id
GROUP BY c.id, f.id;
```

---

## 🎨 Convenções de Frontend

### Hooks Supabase
```typescript
// src/hooks/useClientes.ts
import { useQuery } from '@tanstack/react-query';

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}
```

### Tipos TypeScript
```typescript
// src/types/database.ts
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  // ... todos os campos
  data_criacao: string;
  data_atualizacao: string;
}
```

---

## 📦 Próximos Passos

1. Executar scripts SQL no Supabase Dashboard
2. Configurar RLS para todas as tabelas
3. Criar funções SQL para triggers (update_at)
4. Exportar tipos do Supabase (`npx supabase gen types typescript`)
5. Implementar hooks de dados no frontend
6. Criar mutations (insert, update, delete) com React Query

