# 🌸 Como Configurar Tabelas de Saúde Feminina no Supabase

## 📋 Passos para Configuração

### 1. Executar Script SQL

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Cole o conteúdo completo do arquivo `supabase/criar-tabelas-saude-feminina.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)

✅ Isso criará todas as 4 tabelas necessárias:
- `ciclos_menstruais` - Registro de ciclos menstruais
- `sintomas_diarios` - Sintomas e bem-estar diário
- `menopausa_tracking` - Tracking de menopausa
- `configuracoes_ciclo` - Configurações individuais

### 2. Verificar Tabelas Criadas

1. No Supabase Dashboard, vá em **Table Editor**
2. Você deve ver as novas tabelas na lista
3. Verifique os campos e tipos de dados

### 3. Configurar Políticas RLS (Row Level Security) - Opcional

Se quiser habilitar segurança em nível de linha:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE public.ciclos_menstruais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sintomas_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menopausa_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_ciclo ENABLE ROW LEVEL SECURITY;

-- Criar políticas (exemplo para usuários autenticados)
CREATE POLICY "Usuários podem ver seus próprios ciclos"
  ON public.ciclos_menstruais FOR SELECT
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- Similar para as outras tabelas...
```

⚠️ **Nota:** Por enquanto, as políticas RLS não são obrigatórias. O sistema funcionará mesmo sem elas.

---

## 📊 Estrutura das Tabelas

### `ciclos_menstruais`
- `id` - UUID (chave primária)
- `cliente_id` - UUID (referência para clientes)
- `data_inicio` - DATE
- `data_fim` - DATE (opcional)
- `duracao_ciclo` - INTEGER
- `duracao_menstruacao` - INTEGER
- `intensidade` - VARCHAR (leve, normal, moderada, intensa)
- `notas` - TEXT

### `sintomas_diarios`
- `id` - UUID
- `cliente_id` - UUID
- `data` - DATE
- Sintomas físicos (colicas, dor_cabeca, inchaco, etc.)
- Bem-estar emocional (humor, energia, libido)
- `notas` - TEXT
- **Unique constraint:** Um registro por cliente por dia

### `menopausa_tracking`
- `id` - UUID
- `cliente_id` - UUID
- `data` - DATE
- Sintomas de menopausa (ondas_calor, suores_noturnos, etc.)
- Tratamentos (terapia_hormonal, suplementos)
- `notas` - TEXT

### `configuracoes_ciclo`
- `id` - UUID
- `cliente_id` - UUID (único por cliente)
- Duração média do ciclo
- Status (ciclo-regular, perimenopausa, menopausa)
- Preferências de notificação
- Metas de bem-estar

---

## ✅ Após Executar o SQL

O sistema estará pronto para:
- ✅ Registrar ciclos menstruais
- ✅ Salvar sintomas diários
- ✅ Trackear menopausa
- ✅ Armazenar configurações individuais

Os componentes da área `/saude-feminina` automaticamente conectarão com essas tabelas!

---

## 🔧 Próximos Passos (Opcional)

1. **Criar Views** para relatórios agregados
2. **Configurar Funções** para calcular próximo ciclo automaticamente
3. **Criar Triggers** para notificações
4. **Exportar dados** para análise externa

