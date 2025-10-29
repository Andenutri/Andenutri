# 🔐 Como Configurar Senha da Deise Faula

## 📋 Método 1: Pelo Supabase Dashboard (Recomendado)

### Para o primeiro login da Deise:

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Users** (no menu lateral)
3. Encontre o usuário **Deise Faula** (procure pelo email que ela usou no registro)
4. Clique nos **3 pontos (⋮)** ao lado do usuário
5. Selecione **Reset Password**
6. Isso enviará um email de redefinição para ela

### Ou definir senha diretamente (se disponível):

1. No mesmo menu, clique em **Edit User**
2. Procure por **Update Password** ou **Set Password**
3. Defina a senha: `123456`
4. Salve

---

## 📋 Método 2: Criar Script SQL (Alternativo)

Se o método acima não funcionar, você pode usar a função de reset de senha via SQL, mas o Supabase precisa ter essa função habilitada.

---

## 📝 Próximos Passos

Após a Deise fazer login com a senha `123456`:

1. Ela pode acessar **Configurações** → **Perfil** no sistema
2. Lá poderá alterar a senha para uma mais segura
3. A nova senha será salva no Supabase Auth automaticamente

---

## ⚠️ Importante

- **Senha temporária**: `123456` é apenas para primeiro acesso
- **Recomendado**: Trocar para uma senha forte o quanto antes
- **Segurança**: Depois de definir, a senha fica armazenada com hash (bcrypt) no Supabase

