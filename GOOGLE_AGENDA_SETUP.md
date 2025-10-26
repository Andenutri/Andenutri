# 📅 Configuração da Integração com Google Agenda

## 🔗 Links Importantes

- **Google Cloud Console**: https://console.cloud.google.com
- **Google Calendar API**: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- **Credenciais OAuth**: https://console.cloud.google.com/apis/credentials

## 📋 Passo a Passo para Configuração

### 1️⃣ Criar um Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Clique em "Criar Projeto" ou "Create Project"
3. Nome do projeto: `ANDENUTRI` (ou outro nome de sua preferência)
4. Clique em "Criar"

### 2️⃣ Habilitar Google Calendar API

1. No menu lateral, vá em **APIs e Serviços** > **Biblioteca**
2. Pesquise por "Google Calendar API"
3. Clique em **Ativar** ou **Enable**

### 3️⃣ Criar Credenciais OAuth 2.0

1. Vá em **APIs e Serviços** > **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS**
3. Selecione **ID do cliente OAuth**
4. Se for a primeira vez, configure a **Tela de consentimento OAuth**:
   - Tipo de usuário: **Externo**
   - Nome do app: **ANDENUTRI**
   - Email de suporte: seu email
   - Clique em **Salvar e Continuar**
   - Escopo: por enquanto, deixe padrão e clique **Continuar**
   - Usuários de teste: adicione seu email
   - Clique em **Voltar ao Painel**

### 4️⃣ Configurar OAuth 2.0

1. Vá em **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS** > **ID do cliente OAuth**
3. Tipo de aplicativo: **Aplicativo da Web**
4. Nome: `ANDENUTRI Web Client`
5. **URIs de redirecionamento autorizados**: adicione:
   ```
   http://localhost:3000/oauth2callback
   http://localhost:3000
   ```
6. Clique em **Criar**
7. **Importante**: Copie o **ID do Cliente** e **Segredo do Cliente**

### 5️⃣ Configurar no ANDENUTRI

Você precisará definir estas variáveis de ambiente:

```bash
# No arquivo .env (que vamos criar)
GOOGLE_CALENDAR_ENABLED=true
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_CALENDAR_ID=primary  # ou seu ID de calendário específico
```

### 6️⃣ Configurar Email (para envio de cardápios)

Para enviar emails, você precisa configurar SMTP:

```bash
# Gmail (usando Senha de App)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app  # ⚠️ Use Senha de App, não sua senha normal!
MAIL_DEFAULT_SENDER=seu-email@gmail.com
```

#### Como criar Senha de App no Gmail:

1. Acesse: https://myaccount.google.com/security
2. Ative **Verificação em duas etapas** (se não tiver)
3. Vá em https://myaccount.google.com/apppasswords
4. Selecione **E-mail** e **Outro (personalizado)**
5. Digite: "ANDENUTRI"
6. Clique em **Gerar**
7. Copie a senha de 16 caracteres (use essa senha no MAIL_PASSWORD)

## 🚀 Próximos Passos no Código

Após configurar as credenciais, implementaremos:

1. ✅ Sistema de autenticação OAuth com Google
2. ✅ Sincronização automática de eventos:
   - 🎂 Aniversários dos clientes
   - 📅 Consultas/agendamentos
   - 🏥 Exames e compromissos
3. ✅ Envio de cardápio por email
4. ✅ Controle de acesso (bloquear cardápio se cliente não pagar)

## 📝 Arquivo .env de Exemplo

```env
# Google Calendar
GOOGLE_CALENDAR_ENABLED=true
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_CALENDAR_ID=primary

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_DEFAULT_SENDER=seu-email@gmail.com

# Flask
SECRET_KEY=sua-chave-secreta-aqui
```

---

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env` com suas credenciais no Git
- Mantenha as credenciais seguras
- Use `.gitignore` para ignorar arquivos sensíveis

