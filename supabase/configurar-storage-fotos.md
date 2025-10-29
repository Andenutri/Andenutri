# 📸 Configurar Storage para Fotos no Supabase

## 🎯 Objetivo

Este documento explica como configurar o bucket de Storage no Supabase para armazenar as fotos de progresso dos clientes.

---

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Vá para https://supabase.com/dashboard
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **Storage**

### 2. Criar Novo Bucket

1. Clique no botão **"New bucket"**
2. Preencha os dados:
   - **Name**: `client-photos`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (para que as fotos sejam acessíveis via URL pública)
   - **File size limit**: `10 MB` (ou o valor que preferir)
   - **Allowed MIME types**: `image/*` (ou deixe vazio para aceitar todos)

3. Clique em **"Create bucket"**

### 3. Configurar Políticas (RLS - Row Level Security)

**IMPORTANTE**: Para o desenvolvimento inicial, vamos desabilitar o RLS no bucket para facilitar os testes.

1. No bucket criado, vá em **"Policies"**
2. Se o RLS estiver habilitado, você pode:
   - **Opção 1 (Recomendada para desenvolvimento)**: Desabilitar RLS temporariamente
     - Vá em **"Settings"** do bucket
     - Desmarque **"Enforce RLS"**
   
   - **Opção 2 (Produção)**: Criar políticas que permitam acesso público para leitura:
     ```sql
     -- Política para permitir leitura pública
     CREATE POLICY "Permitir leitura pública de fotos"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'client-photos');
     
     -- Política para permitir upload (requer autenticação)
     CREATE POLICY "Permitir upload de fotos autenticadas"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'client-photos');
     ```

### 4. Testar Upload (Opcional)

Você pode testar o upload diretamente no Dashboard:
1. Clique no bucket `client-photos`
2. Clique em **"Upload file"**
3. Selecione uma foto de teste
4. Verifique se o arquivo aparece na lista

---

## ✅ Verificação

Após configurar o bucket, você pode verificar se está funcionando:

1. Acesse a aplicação em `/ferramentas`
2. Vá para a aba **"Fotos"**
3. Selecione um cliente
4. Tente fazer upload de uma foto
5. Se aparecer a mensagem de sucesso, está tudo configurado! 🎉

---

## 🚨 Problemas Comuns

### Erro: "Bucket not found"
- **Solução**: Certifique-se de que o bucket foi criado com o nome exato `client-photos`

### Erro: "Access denied"
- **Solução**: Verifique se o bucket está marcado como público ou se as políticas RLS estão configuradas corretamente

### Erro: "File too large"
- **Solução**: Aumente o limite de tamanho de arquivo nas configurações do bucket

---

## 📝 Nota de Segurança

**Para produção**, recomenda-se:
- Habilitar RLS com políticas apropriadas
- Restringir upload apenas para usuários autenticados
- Implementar validação de tipo e tamanho de arquivo no frontend e backend
- Configurar CORS adequadamente se necessário

---

## 🎯 Estrutura de Pastas

As fotos serão armazenadas na seguinte estrutura:

```
client-photos/
├── clientes/
│   └── {cliente_id}/
│       ├── avaliacoes/
│       │   └── {avaliacao_id}/
│       │       ├── frente_1234567890_foto.jpg
│       │       ├── lateral_1234567890_foto.jpg
│       │       └── costa_1234567890_foto.jpg
│       └── outra_1234567890_foto.jpg
```

Esta estrutura permite:
- Organização por cliente
- Agrupamento por avaliação
- Fácil identificação do tipo de foto

---

## ✅ Pronto!

Agora você pode usar o sistema de upload de fotos na aplicação! 📸

