# 📋 Revisão Completa - Estrutura Supabase e Integração

## ✅ O QUE FOI FEITO:

### 1. **Script de Verificação e Correção SQL**
Criado: `supabase/verificar-e-corrigir-estrutura.sql`
- ✅ Verifica todos os campos necessários em `clientes`
- ✅ Adiciona campos faltantes (`user_id`, `perfil`, `is_lead`, `codigo_reavaliacao`)
- ✅ Cria tabela `reavaliacoes_respostas` se não existir
- ✅ Gera códigos de reavaliação para clientes sem código
- ✅ Mostra resumo da estrutura atual

### 2. **Função de Sanitização no Código**
Criada função `sanitizarDadosCliente()` em `src/data/clientesData.ts`
- ✅ Remove campos inválidos antes de enviar ao Supabase
- ✅ Lista branca de campos válidos
- ✅ **Garante que `column_id` nunca seja enviado**

### 3. **Busca Inteligente de Duplicados**
Implementada função `verificarClienteExistente()`
- ✅ Busca por email (exato)
- ✅ Busca por WhatsApp (normalizado)
- ✅ Busca por nome similar
- ✅ Evita duplicados automaticamente

---

## 🔧 PRÓXIMOS PASSOS:

### 1. **Execute o Script SQL no Supabase:**
```
1. Acesse Supabase Dashboard
2. Vá em SQL Editor
3. Cole o conteúdo de: supabase/verificar-e-corrigir-estrutura.sql
4. Execute (Run)
```

### 2. **Reinicie o Servidor Next.js:**
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 3. **Limpe o Cache do Navegador:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 📊 CAMPOS VÁLIDOS NA TABELA `clientes`:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | ID único do cliente |
| `nome` | TEXT | Sim | Nome do cliente |
| `email` | TEXT | Sim | Email (único) |
| `telefone` | TEXT | Não | Telefone |
| `whatsapp` | TEXT | Não | WhatsApp |
| `instagram` | TEXT | Não | Instagram |
| `pais_telefone` | TEXT | Não | Código do país (+55) |
| `endereco_completo` | TEXT | Não | Endereço completo |
| `pais` | TEXT | Não | País (default: Brasil) |
| `estado` | TEXT | Não | Estado |
| `cidade` | TEXT | Não | Cidade |
| `status_programa` | TEXT | Não | ativo/inativo/pausado |
| `status_herbalife` | TEXT | Não | ativo/inativo |
| `status_challenge` | TEXT | Não | sim/nao |
| `herbalife_usuario` | TEXT | Não | Usuário Herbalife |
| `herbalife_senha` | TEXT | Não | Senha Herbalife |
| `indicado_por` | TEXT | Não | Quem indicou |
| `perfil` | TEXT | Não | Perfil do cliente |
| `is_lead` | BOOLEAN | Não | É lead? |
| `user_id` | UUID | Não | ID do nutricionista |
| `codigo_reavaliacao` | TEXT | Não | Código para reavaliação |
| `data_criacao` | TIMESTAMP | Não | Data de criação |
| `data_atualizacao` | TIMESTAMP | Não | Data de atualização |

---

## ❌ CAMPOS QUE NÃO EXISTEM (NÃO ENVIAR):

- ❌ `column_id` - Usado apenas no frontend (Kanban)
- ❌ `status_plano` - Use `status_programa` em vez disso
- ❌ `formulario_preenchido` - Calculado dinamicamente
- ❌ `avaliacao_feita` - Calculado dinamicamente

---

## 🎯 RESULTADO ESPERADO:

Após executar o script SQL e reiniciar o servidor:
- ✅ Clientes podem ser salvos sem erro
- ✅ Sem duplicados (busca inteligente)
- ✅ Todos os dados integrados no mesmo ID
- ✅ Nutricionista vê tudo unificado

---

## 🔍 VERIFICAÇÃO:

Execute esta query no Supabase para verificar a estrutura:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clientes'
ORDER BY ordinal_position;
```

