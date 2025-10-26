# 📊 Como Importar Seus Clientes Reais

## ✅ Status Atual
- ✅ Banco de dados criado
- ✅ Sistema de importação pronto
- ✅ Base vazia (aguardando seus dados)

## 📋 Passo a Passo

### 1️⃣ Prepare sua planilha

**Formato aceito:** CSV (Excel pode salvar como CSV)

**Colunas aceitas (não precisa ter todas):**

| Coluna | Obrigatório | Exemplo |
|--------|-------------|---------|
| Nome | ✅ Sim | João Silva |
| Email | ✅ Sim | joao@email.com |
| Telefone | ❌ Opcional | (11) 99999-9999 |
| WhatsApp | ❌ Opcional | (11) 99999-9999 |
| Status | ❌ Opcional | ativo, inativo, pausado |
| Plano | ❌ Opcional | Plano Mensal |
| Objetivos | ❌ Opcional | Emagrecimento, definição |
| Observações | ❌ Opcional | Alergia a lactose |
| Data Nascimento | ❌ Opcional | 1990-01-15 |
| Data Vencimento | ❌ Opcional | 2025-12-31 |

### 2️⃣ Visualizar antes de importar

```bash
cd /Users/air/andenutri
python3 importar_clientes.py preview sua_planilha.csv
```

Isso vai mostrar:
- Quais colunas foram encontradas
- Quantas linhas tem
- Preview das primeiras linhas

### 3️⃣ Importar os dados

```bash
python3 importar_clientes.py import sua_planilha.csv
```

O sistema vai perguntar confirmação e então importar tudo!

### 4️⃣ Verificar no Dashboard

Abra: **http://localhost:3000**

Você verá todos os clientes importados! 🎉

## 🔧 Se as colunas da sua planilha forem diferentes

Se sua planilha tiver nomes diferentes (ex: "Name" ao invés de "Nome"), editamos o arquivo `importar_clientes.py` na linha 20.

Exemplo:
```python
cliente = Cliente(
    nome=row.get('Nome Completo', ''),  # ← ajuste aqui
    email=row.get('E-mail', ''),        # ← ajuste aqui
    telefone=row.get('Tel', ''),        # ← ajuste aqui
    ...
)
```

## 📝 Exemplo de planilha

Crie um arquivo CSV assim:

```csv
Nome,Email,Telefone,WhatsApp,Status,Plano,Objetivos
João Silva,joao@email.com,(11) 99999-9999,(11) 99999-9999,ativo,Plano Mensal,Emagrecimento
Maria Santos,maria@email.com,(11) 88888-8888,(11) 88888-8888,ativo,Plano Trimestral,Ganho de massa
```

## 🎯 Próximos passos

1. ✅ Envie sua planilha ou me diga onde está
2. ✅ Vou fazer preview pra você ver como ficou
3. ✅ Confirma e eu importo!
4. ✅ Atualiza o Dashboard automaticamente!

---

**Dica:** Coloque o arquivo CSV na pasta `/Users/air/andenutri/` para facilitar!

