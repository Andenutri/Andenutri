# 🥗 ANDENUTRI - Sistema de Gestão para Coach de Bem-Estar

Sistema completo para gestão de clientes, acompanhamentos, avaliações e cardápios para coaches de bem-estar e nutricionistas.

## ✨ Funcionalidades

### 📊 Dashboard Completo
- Visão geral com estatísticas em tempo real
- Menu hambúrguer com navegação lateral
- Cards visuais de clientes com status coloridos
- Busca inteligente instantânea

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Sistema de status (Ativo/Inativo/Pausado)
- Controle de pagamento e vencimentos
- Etiquetas coloridas (tags visuais)
- Busca por nome, email ou telefone

### 📅 Agenda e Compromissos
- Integração com Google Calendar (em desenvolvimento)
- Aniversários automáticos
- Lembretes de vencimentos
- Agendamento de consultas e exames

### 📏 Avaliações Físicas
- Medidas corporais completas
- Fotos de progresso
- Histórico de evolução
- Gráficos de acompanhamento

### 🍽️ Cardápios
- Criação e envio de cardápios
- Controle de acesso por pagamento
- Envio automático por email
- Histórico de cardápios enviados

### 🔍 Busca Inteligente
- Busca em tempo real
- Filtra por nome, email ou telefone
- Status visual instantâneo

## 🚀 Como Usar

### Requisitos
- Python 3.9+
- pip

### Instalação
```bash
cd andenutri
pip install -r requirements.txt
```

### Executar o Sistema
```bash
python3 app_dashboard.py
```

Acesse: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
andenutri/
├── app_dashboard.py      # Aplicação Flask com Dashboard completo
├── backend/
│   ├── models.py         # Modelos do banco de dados
│   ├── config.py         # Configurações
│   └── routes.py         # Rotas da API
├── config/
│   └── settings.json     # Configurações gerais
├── dados/                # Dados dos clientes
├── ESPECIFICACOES_COMPLETAS.md  # Todas as especificações
├── GOOGLE_AGENDA_SETUP.md       # Setup do Google Calendar
├── DASHBOARD_FEATURES.md         # Funcionalidades do Dashboard
├── requirements.txt      # Dependências
└── README.md            # Este arquivo
```

## 🎨 Design

- **Tema**: Salmão Suave (#ffa07a, #ffc0a6, #ffe0d4)
- **Interface**: Moderna e intuitiva
- **Responsivo**: Desktop e mobile
- **Animações**: Transições suaves

## 🔧 Tecnologias

- **Backend**: Python Flask
- **Database**: SQLite (fácil upgrade para PostgreSQL)
- **ORM**: SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Futuro**: Google Calendar API, Envio de Email

## 📋 Status do Projeto

### ✅ Implementado
- [x] Dashboard com estatísticas
- [x] Menu hambúrguer com navegação
- [x] Cadastro de clientes
- [x] Busca inteligente em tempo real
- [x] Status visual colorido
- [x] Banco de dados estruturado
- [x] API REST

### 🚧 Em Desenvolvimento
- [ ] Sistema de etiquetas coloridas nos cards
- [ ] Envio de cardápio por email
- [ ] Integração com Google Calendar
- [ ] Sistema de avaliações físicas
- [ ] Upload de fotos
- [ ] Controle de acesso por pagamento

### 📝 Planejado
- [ ] App do cliente (visualizar próprio progresso)
- [ ] Sistema de notificações
- [ ] Exportação de relatórios
- [ ] Backup automático
- [ ] Login e autenticação

## 📖 Documentação

- [ESPECIFICACOES_COMPLETAS.md](ESPECIFICACOES_COMPLETAS.md) - Especificações completas
- [GOOGLE_AGENDA_SETUP.md](GOOGLE_AGENDA_SETUP.md) - Configuração Google Calendar
- [DASHBOARD_FEATURES.md](DASHBOARD_FEATURES.md) - Funcionalidades do Dashboard

## 🎯 Próximos Passos

1. Configurar Google Calendar API
2. Implementar envio de email
3. Sistema de avaliações
4. Upload de fotos
5. App do cliente

## 📝 Licença

Este projeto é privado.

## 👤 Desenvolvido para

Sistema personalizado para gestão de clientes de bem-estar.

---

**Status**: 🟢 Em desenvolvimento ativo
**Versão**: 1.0.0
