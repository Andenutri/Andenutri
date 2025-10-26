# 🚀 Como Configurar o Supabase - Guia Completo

## 📋 Pré-requisitos

1. Conta no Supabase: https://supabase.com
2. Projeto criado no Supabase
3. URL e API Key do projeto

---

## 🔧 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Vá para https://supabase.com/dashboard
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: Andenutri
   - **Database Password**: (escolha uma senha forte)
   - **Region**: Escolha a região mais próxima (ex: South America)
5. Clique em "Create new project"

### 2. Executar o Schema SQL

1. No Dashboard do Supabase, vá para **SQL Editor** (no menu lateral)
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql`
4. Copie TODO o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (ou pressione Cmd/Ctrl + Enter)

✅ **Resultado esperado**: Todas as 10 tabelas criadas com sucesso

### 3. Verificar as Tabelas

1. Vá para **Table Editor** (no menu lateral)
2. Você deve ver as seguintes tabelas:
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

### 4. Obter Credenciais do Projeto

1. Vá para **Project Settings** (ícone de engrenagem no menu lateral)
2. Clique em **API**
3. Copie as seguintes informações:

```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Configurar no Projeto

1. No projeto local, abra o arquivo `.env.local`
2. Adicione as credenciais:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Verificar Conexão

Execute no terminal:

```bash
npm run dev
```

Acesse http://localhost:3000 e verifique se está funcionando.

---

## 📊 Estrutura das Tabelas

### Tabela: `clientes`
Armazena informações básicas dos clientes.

**Campos principais:**
- `nome`, `email`, `telefone`, `whatsapp`
- `status_programa`, `status_herbalife`, `status_challenge`
- `herbalife_usuario`, `herbalife_senha`
- `data_criacao`, `data_atualizacao`

### Tabela: `formularios_pre_consulta`
Dados do formulário de pré-consulta preenchido pelo cliente.

**Campos principais:**
- Dados pessoais: `nome_completo`, `idade`, `altura`, `peso_atual`, `peso_desejado`
- Trabalho: `trabalho`, `horario_trabalho`, `dias_trabalho`
- Saúde: `condicao_saude`, `uso_medicacao`, `restricao_alimentar`
- Rotina alimentar: `cafe_manha`, `almoco`, `jantar`, etc.

### Tabela: `avaliacoes_fisicas`
Medidas e fotos das avaliações físicas.

**Campos principais:**
- Medidas: `peso`, `altura`, `braco_esquerdo`, `cintura`, `quadril`, etc.
- Fotos: `foto_frente_url`, `foto_perfil_url`, `foto_costas_url`
- `tipo_avaliacao`: 'inicial' | 'reavaliacao' | 'final'

### Tabela: `avaliacoes_emocionais`
Bloco emocional e motivacional da avaliação.

**Campos principais:**
- `historia_pessoa`
- `momento_mudanca`, `incomoda_espelho`, `atrapalha_dia_dia`
- `nivel_comprometimento` (0-10)
- `conselho_si`

### Tabela: `avaliacoes_comportamentais`
Bloco comportamental da avaliação.

**Campos principais:**
- `ponto_fraco_alimentacao`
- `organizada_ou_improvisa`
- `come_por_que`
- `premia_com_comida`

### Tabela: `cardapios`
Cardápios enviados aos clientes.

**Campos principais:**
- `titulo`, `descricao`, `texto_cardapio`
- `tipo_cardapio`: 'perda_peso' | 'ganho_massa' | 'manutencao' | 'detox'
- `data_inicio`, `data_fim`
- `enviado_por_email`

### Tabela: `kanban_colunas`
Colunas do kanban/trello.

**Campos principais:**
- `nome`, `cor`, `ordem`
- `clientes_ids` (JSONB array)

### Tabela: `planos_assinatura`
Planos e assinaturas dos clientes.

**Campos principais:**
- `tipo_plano`: 'basico' | 'premium' | 'vip'
- `data_inicio`, `data_vencimento`
- `valor_mensal`
- `status_pagamento`: 'pago' | 'pendente' | 'atrasado' | 'cancelado'

### Tabela: `consultas`
Agendamentos e consultas.

**Campos principais:**
- `data_consulta` (timestamp)
- `tipo_consulta`: 'videochamada' | 'presencial' | 'seguimento'
- `status`: 'agendada' | 'realizada' | 'cancelada'

### Tabela: `reavaliacoes`
Histórico de reavaliações.

**Campos principais:**
- `avaliacao_fisica_id`, `avaliacao_emocional_id`, `avaliacao_comportamental_id`
- `data_reavaliacao`
- `observacoes`, `progresso`

---

## 🔐 Segurança (Row Level Security)

Todas as tabelas têm RLS habilitado com políticas que permitem acesso total para usuários autenticados.

**Para produção**, você deve:
1. Restringir acesso por usuário
2. Adicionar verificações de role
3. Criar políticas específicas

Exemplo:
```sql
CREATE POLICY "Users can only see their own data" ON clientes
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 🚀 Próximos Passos

### 1. Exportar Tipos TypeScript

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 2. Criar Hooks de Dados

Crie hooks React Query para buscar dados:

```typescript
// src/hooks/useClientes.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

### 3. Implementar Mutations

```typescript
// src/hooks/useClientesMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCreateCliente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (novoCliente: Cliente) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert([novoCliente])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
}
```

---

## 🛠️ Troubleshooting

### Erro: "relation does not exist"
**Solução**: Execute o schema SQL novamente

### Erro: "permission denied"
**Solução**: Verifique as políticas RLS no Supabase Dashboard

### Erro: "duplicate key"
**Solução**: Verifique se há constraints UNIQUE violadas

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Client](https://github.com/supabase/supabase-js)

---

## ✅ Checklist de Configuração

- [ ] Criado projeto no Supabase
- [ ] Executado schema SQL
- [ ] Verificado criação das 10 tabelas
- [ ] Configurado .env.local com credenciais
- [ ] Exportado tipos TypeScript
- [ ] Implementado hooks de dados
- [ ] Testado conexão no frontend

---

**Pronto!** Agora você tem um banco de dados completo para o sistema ANDENUTRI! 🎉

