# 🚀 Como Fazer Push para o GitHub

## ✅ Preparação Concluída

Já fizemos:
- ✅ `git init`
- ✅ `git add .`
- ✅ `git commit -m "Initial commit..."`
- ✅ `git branch -M main`
- ✅ `git remote add origin https://github.com/Andenutri/Andenutri.git`

## 🔐 Autenticação Necessária

Você precisa autenticar no GitHub. Escolha UMA das opções:

### **Opção 1: GitHub CLI (Recomendado - Mais Fácil)**

```bash
# Instalar GitHub CLI (se não tiver)
brew install gh

# Autenticar
gh auth login

# Fazer push
git push -u origin main
```

### **Opção 2: Personal Access Token**

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Selecione escopos: `repo` (acesso completo aos repositórios)
4. Clique em "Generate token"
5. **Copie o token** (mostrado apenas uma vez!)

Depois execute:
```bash
# Use o token como senha quando pedir
git push -u origin main
# Username: seu-usuario
# Password: cole o token aqui
```

### **Opção 3: SSH (Mais Seguro a Longo Prazo)**

```bash
# Criar chave SSH
ssh-keygen -t ed25519 -C "seu-email@gmail.com"

# Adicionar chave SSH ao GitHub
cat ~/.ssh/id_ed25519.pub
# Copie a saída e adicione em: https://github.com/settings/keys

# Trocar remote para SSH
git remote set-url origin git@github.com:Andenutri/Andenutri.git

# Push
git push -u origin main
```

## 🎯 **COMANDO RÁPIDO (Opção 2 - Token)**

Depois de criar o token, execute:

```bash
cd /Users/air/andenutri
git push -u origin main
```

Quando pedir credenciais:
- **Username**: `Andenutri` (ou seu username do GitHub)
- **Password**: `cole-o-token-aqui` (o token que você criou)

## 📝 Alternativa: Push via GitHub Desktop

1. Instale: https://desktop.github.com/
2. Abra o GitHub Desktop
3. File > Add Local Repository
4. Escolha a pasta `/Users/air/andenutri`
5. Clique em "Publish repository"

## ✅ Após o Push

Seu repositório estará em: **https://github.com/Andenutri/Andenutri**

---

## 🔧 Comandos Git Úteis

```bash
# Ver status
git status

# Ver histórico
git log --oneline

# Ver remote
git remote -v

# Fazer push
git push -u origin main

# Atualizar após mudanças
git add .
git commit -m "Descrição das mudanças"
git push
```

