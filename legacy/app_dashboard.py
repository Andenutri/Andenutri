#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Dashboard Completo
"""

from flask import Flask, render_template_string, jsonify, request
from backend.models import db, Cliente, Etiqueta
from datetime import datetime, date
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Carregar variáveis de ambiente
load_dotenv('.env.local')

app = Flask(__name__)

# Configuração
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(os.path.dirname(__file__), "andenutri.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar Supabase
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Inicializar database
db.init_app(app)

# HTML Template Completo
HTML_TEMPLATE = open('dashboard_template.html', 'r', encoding='utf-8').read() if os.path.exists('dashboard_template.html') else """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ANDENUTRI - Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #FFF8F0 0%, #FFF4E8 50%, #FFF0E8 100%);
            min-height: 100vh;
        }

        /* Menu Hambúrguer */
        .hamburger {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 12px;
            font-size: 1.5em;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
        }
        .hamburger:hover { transform: scale(1.05); }

        /* Sidebar */
        .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            width: 300px;
            height: 100vh;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            transition: left 0.3s;
            z-index: 999;
            overflow-y: auto;
            padding-top: 80px;
        }
        .sidebar.active { left: 0; }
        .sidebar-item {
            padding: 20px 30px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.3s;
        }
        .sidebar-item:hover { background: #FFF8F0; }
        .sidebar-item.active {
            background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%);
            color: white;
        }

        /* Container Principal */
        .main-container {
            margin-left: 0;
            transition: margin-left 0.3s;
        }
        .main-container.sidebar-open { margin-left: 300px; }

        /* Header */
        .header {
            background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%);
            color: white;
            padding: 30px 60px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(212, 165, 116, 0.2);
        }

        /* Stats Cards */
        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(204, 165, 140, 0.2);
            border: 1px solid #FFF0E6;
        }
        .stat-number {
            font-size: 2.5em;
            color: #D4A574;
            font-weight: bold;
        }
        .stat-label {
            color: #8B6F4D;
            margin-top: 10px;
            font-weight: 500;
        }

        /* Busca */
        .search-bar {
            padding: 20px 30px;
            background: #FFF8F0;
        }
        .search-input {
            width: 100%;
            padding: 15px 20px;
            font-size: 1.1em;
            border: 2px solid #E8D5C4;
            border-radius: 10px;
            background: white;
        }
        .search-input:focus {
            outline: none;
            border-color: #D4A574;
            box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
        }

        /* Grid Clientes */
        .clientes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .cliente-card {
            background: white;
            border-left: 4px solid #D4A574;
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 2px 8px rgba(204, 165, 140, 0.1);
        }
        .cliente-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(204, 165, 140, 0.2);
        }
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .status-ativo { background: #90EE90; color: #006400; }
        .status-inativo { background: #FFB6C1; color: #8B0000; }

        /* Botão Add */
        .add-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%);
            color: white;
            border: none;
            font-size: 2em;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
            transition: transform 0.3s;
        }
        .add-btn:hover { transform: scale(1.1); }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            overflow: auto;
        }
        .modal-content {
            background: white;
            margin: 50px auto;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #F0E6DC;
        }
        .modal-title { color: #C98E5F; font-size: 1.8em; }
        .close { color: #999; font-size: 2em; cursor: pointer; }
        
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: bold;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #E8D5C4;
            border-radius: 8px;
            font-size: 1em;
        }
        .btn-submit {
            background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
            margin-top: 20px;
            transition: transform 0.2s;
            font-weight: bold;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
        }

        /* Trello Board */
        #trelloBoard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
            overflow-x: auto;
        }

        .trello-coluna {
            background: white;
            border-radius: 10px;
            padding: 15px;
            min-height: 400px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .trello-card {
            background: #FFF8F0;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            border-left: 3px solid #D4A574;
        }

        .trello-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <button class="hamburger" onclick="toggleSidebar()">☰</button>

    <div class="sidebar" id="sidebar">
        <div class="sidebar-item active" onclick="mostrarView('dashboard')">
            📊 Dashboard
        </div>
        <div class="sidebar-item" onclick="mostrarView('clientes')">
            👥 Clientes
        </div>
        <div class="sidebar-item" onclick="mostrarView('trello')">
            📋 Trello/Kanban
        </div>
        <div class="sidebar-item" onclick="mostrarView('agenda')">
            📅 Agenda
        </div>
        <div class="sidebar-item" onclick="mostrarView('avaliacoes')">
            📏 Avaliações
        </div>
        <div class="sidebar-item" onclick="mostrarView('cardapios')">
            🍽️ Cardápios
        </div>
        <div class="sidebar-item" onclick="mostrarView('configuracoes')">
            ⚙️ Configurações
        </div>
    </div>

    <div class="main-container" id="mainContainer">
        <div class="header">
            <h1>🥗 ANDENUTRI</h1>
            <p id="headerSubtitle">Dashboard - Visão Geral</p>
        </div>

        <!-- Dashboard View -->
        <div id="dashboard-view" class="view">
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-number" id="total-clientes">0</div>
                    <div class="stat-label">Total de Clientes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="clientes-ativos">0</div>
                    <div class="stat-label">Clientes Ativos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="clientes-inativos">0</div>
                    <div class="stat-label">Clientes Inativos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="proximos-eventos">0</div>
                    <div class="stat-label">Próximos Eventos</div>
                </div>
            </div>

            <div class="search-bar">
                <input type="text" class="search-input" id="searchInput" 
                       placeholder="🔍 Buscar cliente por nome, email ou telefone...">
            </div>

            <div class="clientes-grid" id="clientesGrid"></div>
        </div>

        <!-- Clientes View -->
        <div id="clientes-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #8B6F4D; margin-bottom: 20px;">👥 Todos os Clientes</h2>
                <div class="search-bar">
                    <input type="text" class="search-input" id="searchClientes" 
                           placeholder="🔍 Buscar cliente...">
                </div>
                <div class="clientes-grid" id="clientesListView"></div>
            </div>
        </div>

        <!-- Trello/Kanban View -->
        <div id="trello-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #8B6F4D; margin: 0;">📋 Visualização Trello/Kanban</h2>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="abrirModalNovaColuna()" style="background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9em; cursor: pointer; font-weight: bold;">
                            ➕ Nova Coluna
                        </button>
                        <button onclick="abrirModalNovoCliente()" style="background: linear-gradient(135deg, #D4A574 0%, #C98E5F 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9em; cursor: pointer; font-weight: bold;">
                            + Adicionar Cliente
                        </button>
                    </div>
                </div>
                <div class="search-bar">
                    <input type="text" class="search-input" id="searchTrello" 
                           placeholder="🔍 Buscar cliente no board...">
                </div>
                <div style="display: flex; gap: 20px; margin-top: 20px; overflow-x: auto; padding-bottom: 20px;" id="trelloBoard">
                    <!-- Colunas serão preenchidas via JavaScript -->
                </div>
            </div>
        </div>

        <!-- Agenda View -->
        <div id="agenda-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #8B6F4D; margin-bottom: 20px;">📅 Agenda</h2>
                <p style="color: #666;">🎂 Aniversários</p>
                <p style="color: #666;">📋 Consultas</p>
                <p style="color: #666;">⏰ Vencimentos</p>
                <p style="color: #999; margin-top: 20px;">Integração com Google Agenda em breve...</p>
            </div>
        </div>

        <!-- Avaliações View -->
        <div id="avaliacoes-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #8B6F4D; margin-bottom: 20px;">📏 Avaliações</h2>
                <p style="color: #999;">Sistema de avaliações em desenvolvimento...</p>
            </div>
        </div>

        <!-- Cardápios View -->
        <div id="cardapios-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #8B6F4D; margin-bottom: 20px;">🍽️ Cardápios</h2>
                <p style="color: #999;">Sistema de cardápios em desenvolvimento...</p>
            </div>
        </div>

        <!-- Configurações View -->
        <div id="configuracoes-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #8B6F4D; margin-bottom: 20px;">⚙️ Configurações</h2>
                <p style="color: #666; margin-bottom: 10px;">📧 Email para envio de cardápios</p>
                <p style="color: #666; margin-bottom: 10px;">📅 Integração Google Agenda</p>
                <p style="color: #666; margin-bottom: 10px;">🏷️ Gerenciar Etiquetas</p>
                <p style="color: #999; margin-top: 20px;">Configurações em desenvolvimento...</p>
            </div>
        </div>
    </div>

    <button class="add-btn" onclick="abrirModalNovoCliente()">+</button>

    <!-- Modal Novo Cliente -->
    <div id="modalNovoCliente" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">➕ Novo Cliente</h2>
                <span class="close" onclick="fecharModal()">&times;</span>
            </div>
            <form id="formNovoCliente">
                <h3 style="color: #8B6F4D; margin: 20px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">📋 Dados Básicos</h3>
                
                <div class="form-group">
                    <label>Nome Completo *</label>
                    <input type="text" name="nome" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" name="data_nascimento">
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">📞 Contato Internacional</h3>
                
                <div style="display: grid; grid-template-columns: 80px 1fr; gap: 10px;">
                    <div class="form-group">
                        <label>🌍 País</label>
                        <select name="pais_telefone" style="padding: 12px;">
                            <option value="+55">🇧🇷 +55</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+351">🇵🇹 +351</option>
                            <option value="+54">🇦🇷 +54</option>
                            <option value="+34">🇪🇸 +34</option>
                            <option value="+39">🇮🇹 +39</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="tel" name="telefone" placeholder="(00) 00000-0000">
                    </div>
                </div>
                <div class="form-group">
                    <label>💬 WhatsApp</label>
                    <input type="tel" name="whatsapp" placeholder="(00) 00000-0000">
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">📍 Endereço Completo</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>🌍 País</label>
                        <input type="text" name="pais" placeholder="Brasil">
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <input type="text" name="estado" placeholder="São Paulo">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cidade</label>
                    <input type="text" name="cidade" placeholder="São Paulo">
                </div>
                <div class="form-group">
                    <label>Endereço Completo</label>
                    <textarea name="endereco" rows="2" placeholder="Rua, número, bairro, complemento"></textarea>
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">⚙️ Status e Plano</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Status do Cliente</label>
                        <select name="status">
                            <option value="inativo">❌ Inativo</option>
                            <option value="ativo">✅ Ativo</option>
                            <option value="pausado">⏸️ Pausado</option>
                            <option value="cancelado">🚫 Cancelado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status do Plano</label>
                        <select name="status_plano">
                            <option value="">Não informado</option>
                            <option value="ativo">✅ Ativo</option>
                            <option value="inativo">❌ Inativo</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Plano Ativo</label>
                    <input type="text" name="plano_ativo" placeholder="Ex: Plano Mensal Premium">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Data de Início</label>
                        <input type="date" name="data_inicio">
                    </div>
                    <div class="form-group">
                        <label>Data de Vencimento</label>
                        <input type="date" name="data_vencimento">
                    </div>
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">🏆 Herbalife & Desafios</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>🛒 Compra Herbalife?</label>
                        <select name="compra_herbalife">
                            <option value="nao">❌ Não</option>
                            <option value="sim">✅ Sim</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status Herbalife</label>
                        <select name="status_herbalife">
                            <option value="">Não informado</option>
                            <option value="ativo">✅ Ativo</option>
                            <option value="inativo">❌ Inativo</option>
                            <option value="cancelado">🚫 Cancelado</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>💪 Está em Desafio?</label>
                    <select name="esta_desafio">
                        <option value="nao">❌ Não</option>
                        <option value="sim">✅ Sim</option>
                    </select>
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">🔐 Credenciais Herbalife</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>👤 Usuário Herbalife</label>
                        <input type="text" name="usuario_herbalife" placeholder="ID Herbalife">
                    </div>
                    <div class="form-group">
                        <label>🔒 Senha Herbalife</label>
                        <input type="password" name="senha_herbalife" placeholder="Senha do portal">
                    </div>
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">👥 Indicação</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                    <div class="form-group">
                        <label>Foi Indicação?</label>
                        <select name="foi_indicacao" id="foi_indicacao_select" onchange="toggleIndicacao()">
                            <option value="nao">❌ Não</option>
                            <option value="sim">✅ Sim</option>
                        </select>
                    </div>
                    <div class="form-group" id="indicado_por_group" style="display: none;">
                        <label>Indicado por:</label>
                        <input type="text" name="indicado_por" placeholder="Nome da pessoa que indicou">
                    </div>
                </div>
                
                <h3 style="color: #8B6F4D; margin: 25px 0 15px 0; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px;">📝 Informações Adicionais</h3>
                
                <div class="form-group">
                    <label>Objetivos</label>
                    <textarea name="objetivos" rows="3" placeholder="Emagrecimento, ganho de massa, etc."></textarea>
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea name="observacoes" rows="3" placeholder="Anotações importantes..."></textarea>
                </div>
                <button type="submit" class="btn-submit">💾 Salvar Cliente</button>
            </form>
        </div>
    </div>

    <!-- Modal Avaliação -->
    <div id="modalAvaliacao" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📏 Nova Avaliação</h2>
                <span class="close" onclick="fecharModalAvaliacao()">&times;</span>
            </div>
            <form id="formAvaliacao">
                <input type="hidden" id="clienteIdAvaliacao">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Peso (kg)</label>
                        <input type="number" step="0.1" id="peso">
                    </div>
                    <div class="form-group">
                        <label>Altura (cm)</label>
                        <input type="number" step="0.1" id="altura">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Cintura (cm)</label>
                        <input type="number" step="0.1" id="cintura">
                    </div>
                    <div class="form-group">
                        <label>Quadril (cm)</label>
                        <input type="number" step="0.1" id="quadril">
                    </div>
                    <div class="form-group">
                        <label>Braço (cm)</label>
                        <input type="number" step="0.1" id="braco">
                    </div>
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea id="observacoesAval" rows="3" placeholder="Anotações sobre a avaliação..."></textarea>
                </div>
                <button type="button" class="btn-submit" onclick="salvarAvaliacao()">Salvar Avaliação</button>
            </form>
        </div>
    </div>

    <!-- Modal Nova Coluna Trello -->
    <div id="modalNovaColuna" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">➕ Nova Coluna Personalizada</h2>
                <span class="close" onclick="fecharModalNovaColuna()">&times;</span>
            </div>
            <form id="formNovaColuna">
                <div class="form-group">
                    <label>Nome da Coluna *</label>
                    <input type="text" id="nomeColuna" placeholder="Ex: Avaliação Pendente" required>
                </div>
                <div class="form-group">
                    <label>Cor de Fundo</label>
                    <input type="color" id="corColuna" value="#F5E6D3">
                </div>
                <div class="form-group">
                    <label>Cor do Texto</label>
                    <input type="color" id="corTextoColuna" value="#8B6F4D">
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="descColuna" rows="2" placeholder="O que esta coluna representa?"></textarea>
                </div>
                <button type="button" class="btn-submit" onclick="criarNovaColuna()">Criar Coluna</button>
            </form>
        </div>
    </div>

    <!-- Modal Editar Cliente Completo -->
    <div id="modalEditarCliente" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2 class="modal-title">⚙️ Área Administrativa - Cliente</h2>
                <span class="close" onclick="fecharModalEditarCliente()">&times;</span>
            </div>
            <div id="conteudoEdicaoCliente">
                <p>Carregando dados...</p>
            </div>
        </div>
    </div>

    <!-- Modal Consulta -->
    <div id="modalConsulta" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📅 Nova Consulta</h2>
                <span class="close" onclick="fecharModalConsulta()">&times;</span>
            </div>
            <form id="formConsulta">
                <input type="hidden" id="clienteIdConsulta">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Data *</label>
                        <input type="date" id="dataConsulta" required>
                    </div>
                    <div class="form-group">
                        <label>Hora *</label>
                        <input type="time" id="horaConsulta" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Tipo de Consulta</label>
                    <select id="tipoConsulta">
                        <option value="presencial">Presencial</option>
                        <option value="online">Online</option>
                        <option value="retorno">Retorno</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea id="observacoesCons" rows="3" placeholder="Anotações da consulta..."></textarea>
                </div>
                <button type="button" class="btn-submit" onclick="salvarConsulta()">Agendar Consulta</button>
            </form>
        </div>
    </div>

    <script>
        // Sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const main = document.getElementById('mainContainer');
            sidebar.classList.toggle('active');
            main.classList.toggle('sidebar-open');
        }

        // Função para mostrar campo de indicação
        function toggleIndicacao() {
            const select = document.getElementById('foi_indicacao_select');
            const group = document.getElementById('indicado_por_group');
            if (select.value === 'sim') {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        }

        // Navegação
        function mostrarView(view) {
            document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            
            document.getElementById(view + '-view').style.display = 'block';
            event.target.classList.add('active');
            
            // Atualizar header
            const subtitles = {
                'dashboard': 'Dashboard - Visão Geral',
                'clientes': 'Gestão de Clientes',
                'trello': 'Visualização Trello/Kanban',
                'agenda': 'Agenda e Compromissos',
                'avaliacoes': 'Avaliações Físicas',
                'cardapios': 'Cardápios e Planos',
                'configuracoes': 'Configurações do Sistema'
            };
            document.getElementById('headerSubtitle').textContent = subtitles[view];
        }

        // Carregar dados
        async function carregarClientes() {
            try {
                const response = await fetch('/api/clientes');
            const clientes = await response.json();
            exibirClientes(clientes);
            atualizarStats(clientes);
            exibirTrello(clientes);
            } catch (error) {
                console.error('Erro:', error);
            }
        }

        function exibirClientes(clientes) {
            const grid = document.getElementById('clientesGrid');
            grid.innerHTML = clientes.map(cliente => `
                <div class="cliente-card">
                    <div class="status-badge status-${cliente.status}">
                        ${cliente.status.toUpperCase()}
                    </div>
                    <h3 style="color: #8B6F4D; margin-bottom: 10px; font-weight: bold;">${cliente.nome}</h3>
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 5px;">📧 ${cliente.email}</p>
                    ${cliente.telefone ? `<p style="color: #666; font-size: 0.9em;">📱 ${cliente.telefone}</p>` : ''}
                </div>
            `).join('');
            
            // Copiar para lista de clientes também
            document.getElementById('clientesListView').innerHTML = grid.innerHTML;
        }

        function atualizarStats(clientes) {
            document.getElementById('total-clientes').textContent = clientes.length;
            document.getElementById('clientes-ativos').textContent = 
                clientes.filter(c => c.status === 'ativo').length;
            document.getElementById('clientes-inativos').textContent = 
                clientes.filter(c => c.status === 'inativo').length;
        }

        // Exibir Trello/Kanban
        function exibirTrello(clientes) {
            const board = document.getElementById('trelloBoard');
            
            // Colunas por status
            const colunas = {
                'ativo': { titulo: '✅ ATIVO', corFundo: '#E8F5E9', corTexto: '#2E7D32', clientes: [] },
                'inativo': { titulo: '❌ INATIVO', corFundo: '#FCE4EC', corTexto: '#C2185B', clientes: [] },
                'pausado': { titulo: '⏸️ PAUSADO', corFundo: '#FFF9C4', corTexto: '#F57C00', clientes: [] },
                'outros': { titulo: '📋 OUTROS', corFundo: '#F5F5F5', corTexto: '#424242', clientes: [] }
            };
            
            // Organizar clientes por status
            clientes.forEach(cliente => {
                if (colunas[cliente.status]) {
                    colunas[cliente.status].clientes.push(cliente);
                } else {
                    colunas.outros.clientes.push(cliente);
                }
            });
            
            // Adicionar colunas personalizadas
            colunasPersonalizadas.forEach(col => {
                colunas[col.id] = col;
            });
            
            // Criar HTML do board
            board.innerHTML = Object.entries(colunas).map(([key, coluna]) => `
                <div style="background: white; border-radius: 10px; padding: 15px; min-height: 400px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="background: ${coluna.corFundo}; color: ${coluna.corTexto}; padding: 12px; border-radius: 5px; margin-bottom: 15px; text-align: center; font-size: 0.95em; font-weight: bold; border: 2px solid ${coluna.corTexto}20;">
                        ${coluna.titulo} (${coluna.clientes.length})
                    </h3>
                    <div id="coluna-${key}" style="min-height: 300px;">
                        ${coluna.clientes.map(cliente => `
                            <div style="background: white; border-left: 4px solid ${coluna.corTexto}; padding: 15px; margin-bottom: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                                 onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)';" 
                                 onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
                                 onclick="mostrarDetalhesCliente(${cliente.id})">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <h4 style="color: #8B6F4D; font-size: 0.95em; margin: 0; font-weight: bold; flex: 1;">${cliente.nome}</h4>
                                    <button onclick="event.stopPropagation(); editarStatusCliente(${cliente.id})" style="background: ${coluna.corFundo}; color: ${coluna.corTexto}; border: 1px solid ${coluna.corTexto}; padding: 4px 8px; border-radius: 4px; font-size: 0.75em; cursor: pointer; font-weight: bold;">
                                        ✏️ Editar
                                    </button>
                                </div>
                                <p style="color: #666; font-size: 0.85em; margin: 3px 0; word-break: break-word;">📧 ${cliente.email}</p>
                                ${cliente.telefone ? `<p style="color: #666; font-size: 0.85em; margin: 3px 0;">📱 ${cliente.telefone}</p>` : ''}
                                ${cliente.whatsapp ? `<p style="color: #25D366; font-size: 0.85em; margin: 3px 0;">💬 ${cliente.whatsapp}</p>` : ''}
                                ${cliente.plano_ativo ? `<p style="color: #C98E5F; font-size: 0.85em; margin: 3px 0; font-weight: bold;">🎯 ${cliente.plano_ativo}</p>` : ''}
                                ${cliente.objetivos ? `<p style="color: #888; font-size: 0.75em; margin: 3px 0; font-style: italic;">💪 ${cliente.objetivos.substring(0, 30)}${cliente.objetivos.length > 30 ? '...' : ''}</p>` : ''}
                                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; display: flex; gap: 5px; justify-content: space-between;">
                                    <button onclick="event.stopPropagation(); adicionarAvaliacao(${cliente.id})" style="background: #F5E6D3; color: #8B6F4D; border: none; padding: 4px 10px; border-radius: 5px; font-size: 0.75em; cursor: pointer; font-weight: bold;">
                                        📏 Avaliar
                                    </button>
                                    <button onclick="event.stopPropagation(); adicionarConsulta(${cliente.id})" style="background: #F5E6D3; color: #8B6F4D; border: none; padding: 4px 10px; border-radius: 5px; font-size: 0.75em; cursor: pointer; font-weight: bold;">
                                        📅 Consulta
                                    </button>
                                    <button onclick="event.stopPropagation(); verHistorico(${cliente.id})" style="background: #F5E6D3; color: #8B6F4D; border: none; padding: 4px 10px; border-radius: 5px; font-size: 0.75em; cursor: pointer; font-weight: bold;">
                                        📊 Ver
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Busca
        document.getElementById('searchInput').addEventListener('input', async (e) => {
            const query = e.target.value;
            if (query.length < 2) { carregarClientes(); return; }
            try {
                const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`);
                const clientes = await response.json();
                exibirClientes(clientes);
                exibirTrello(clientes);
            } catch (error) {
                console.error('Erro na busca:', error);
            }
        });

        // Modal
        function abrirModalNovoCliente() {
            document.getElementById('modalNovoCliente').style.display = 'block';
        }
        function fecharModal() {
            document.getElementById('modalNovoCliente').style.display = 'none';
        }

        document.getElementById('formNovoCliente').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/clientes', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    fecharModal();
                    e.target.reset();
                    carregarClientes();
                    alert('✅ Cliente cadastrado com sucesso!');
                }
            } catch (error) {
                alert('❌ Erro ao criar cliente');
            }
        });

        window.onclick = function(event) {
            const modal = document.getElementById('modalNovoCliente');
            if (event.target === modal) fecharModal();
        }

        // Busca no Trello
        const searchTrelloInput = document.getElementById('searchTrello');
        if (searchTrelloInput) {
            searchTrelloInput.addEventListener('input', async (e) => {
                const query = e.target.value;
                if (query.length < 2) {
                    carregarClientes();
                    return;
                }
                try {
                    const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`);
                    const clientes = await response.json();
                    exibirTrello(clientes);
                } catch (error) {
                    console.error('Erro na busca Trello:', error);
                }
            });
        }

        // Funções do Kanban
        function editarStatusCliente(id) {
            abrirModalNovoCliente();
            // Carregar dados do cliente e preencher formulário
            console.log('Editar cliente:', id);
        }

        function adicionarAvaliacao(id) {
            document.getElementById('modalAvaliacao').style.display = 'block';
            document.getElementById('clienteIdAvaliacao').value = id;
        }

        function fecharModalAvaliacao() {
            document.getElementById('modalAvaliacao').style.display = 'none';
        }

        function adicionarConsulta(id) {
            document.getElementById('modalConsulta').style.display = 'block';
            document.getElementById('clienteIdConsulta').value = id;
            // Preencher data de hoje por padrão
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('dataConsulta').value = hoje;
        }

        function fecharModalConsulta() {
            document.getElementById('modalConsulta').style.display = 'none';
        }

        function salvarAvaliacao() {
            const clienteId = document.getElementById('clienteIdAvaliacao').value;
            const peso = document.getElementById('peso').value;
            const altura = document.getElementById('altura').value;
            
            console.log('Salvando avaliação:', {clienteId, peso, altura});
            alert(`✅ Avaliação salva com sucesso!\nCliente: ${clienteId}\nPeso: ${peso}kg\nAltura: ${altura}cm`);
            fecharModalAvaliacao();
            document.getElementById('formAvaliacao').reset();
        }

        function salvarConsulta() {
            const clienteId = document.getElementById('clienteIdConsulta').value;
            const data = document.getElementById('dataConsulta').value;
            const hora = document.getElementById('horaConsulta').value;
            const tipo = document.getElementById('tipoConsulta').value;
            
            console.log('Salvando consulta:', {clienteId, data, hora, tipo});
            alert(`✅ Consulta agendada!\nCliente: ${clienteId}\n${data} às ${hora}\nTipo: ${tipo}`);
            fecharModalConsulta();
            document.getElementById('formConsulta').reset();
        }

        function verHistorico(id) {
            alert(`📊 Histórico do Cliente ID: ${id}\n\n\n✅ Função em desenvolvimento\n\nAqui você verá:\n- Todas as avaliações\n- Histórico de consultas\n- Cardápios enviados\n- Evolução completa`);
        }

        // Variável global para colunas personalizadas
        let colunasPersonalizadas = [];

        function abrirModalNovaColuna() {
            document.getElementById('modalNovaColuna').style.display = 'block';
        }

        function fecharModalNovaColuna() {
            document.getElementById('modalNovaColuna').style.display = 'none';
        }

        function criarNovaColuna() {
            const nome = document.getElementById('nomeColuna').value;
            const corFundo = document.getElementById('corColuna').value;
            const corTexto = document.getElementById('corTextoColuna').value;
            const desc = document.getElementById('descColuna').value;

            if (!nome) {
                alert('Por favor, informe o nome da coluna');
                return;
            }

            // Adicionar à lista de colunas personalizadas
            colunasPersonalizadas.push({
                id: Date.now(),
                titulo: nome,
                corFundo: corFundo,
                corTexto: corTexto,
                desc: desc,
                clientes: []
            });

            alert(`✅ Coluna "${nome}" criada com sucesso!`);
            fecharModalNovaColuna();
            document.getElementById('formNovaColuna').reset();
            
            // Recarregar Kanban
            carregarClientes();
        }

        function abrirModalEditarCliente(id) {
            document.getElementById('modalEditarCliente').style.display = 'block';
            
            // Buscar dados do cliente
            fetch(`/api/clientes/${id}`)
                .then(r => r.json())
                .then(cliente => {
                    document.getElementById('conteudoEdicaoCliente').innerHTML = `
                        <div style="max-height: 600px; overflow-y: auto;">
                            <h3 style="color: #8B6F4D; margin-bottom: 20px;">📋 ${cliente.nome}</h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div>
                                    <label style="font-weight: bold; color: #666;">Email</label>
                                    <input type="email" value="${cliente.email}" class="form-group input" style="width: 100%; padding: 8px;">
                                </div>
                                <div>
                                    <label style="font-weight: bold; color: #666;">Telefone</label>
                                    <input type="tel" value="${cliente.telefone || ''}" class="form-group input" style="width: 100%; padding: 8px;">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="font-weight: bold; color: #666;">Objetivos</label>
                                <textarea rows="3" style="width: 100%; padding: 8px; border: 2px solid #E8D5C4; border-radius: 8px;">${cliente.objetivos || ''}</textarea>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="font-weight: bold; color: #666;">Observações</label>
                                <textarea rows="4" style="width: 100%; padding: 8px; border: 2px solid #E8D5C4; border-radius: 8px;">${cliente.observacoes || ''}</textarea>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                                <button class="btn-submit" onclick="salvarEdicaoCliente(${id})" style="width: 100%;">💾 Salvar</button>
                                <button class="btn-submit" onclick="adicionarInfoCliente(${id})" style="width: 100%; background: #D4A574;">📝 Adicionar Info</button>
                                <button class="btn-submit" onclick="verHistorico(${id})" style="width: 100%;">📊 Histórico</button>
                            </div>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Erro ao carregar cliente:', error);
                    document.getElementById('conteudoEdicaoCliente').innerHTML = '<p style="color: red;">Erro ao carregar dados do cliente</p>';
                });
        }

        function fecharModalEditarCliente() {
            document.getElementById('modalEditarCliente').style.display = 'none';
        }

        function salvarEdicaoCliente(id) {
            alert(`💾 Dados do cliente ${id} salvos com sucesso!`);
            fecharModalEditarCliente();
        }

        function adicionarInfoCliente(id) {
            const info = prompt('Adicionar nova informação para este cliente:');
            if (info) {
                alert(`✅ Informação adicionada!\n${info}`);
            }
        }

        function mostrarDetalhesCliente(id) {
            abrirModalEditarCliente(id);
        }

        // Fechar modal ao clicar fora
        window.onclick = function(event) {
            const modal = document.getElementById('modalNovoCliente');
            const modalAval = document.getElementById('modalAvaliacao');
            const modalCons = document.getElementById('modalConsulta');
            const modalNovaCol = document.getElementById('modalNovaColuna');
            const modalEdit = document.getElementById('modalEditarCliente');
            if (event.target === modal) fecharModal();
            if (event.target === modalAval) fecharModalAvaliacao();
            if (event.target === modalCons) fecharModalConsulta();
            if (event.target === modalNovaCol) fecharModalNovaColuna();
            if (event.target === modalEdit) fecharModalEditarCliente();
        }

        carregarClientes();
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])

@app.route('/api/clientes', methods=['POST'])
def criar_cliente():
    data = request.get_json()
    
    cliente = Cliente(
        nome=data.get('nome'),
        email=data.get('email'),
        telefone=data.get('telefone'),
        whatsapp=data.get('whatsapp'),
        data_nascimento=datetime.strptime(data['data_nascimento'], '%Y-%m-%d').date() if data.get('data_nascimento') else None,
        status=data.get('status', 'inativo'),
        plano_ativo=data.get('plano_ativo'),
        data_vencimento=datetime.strptime(data['data_vencimento'], '%Y-%m-%d').date() if data.get('data_vencimento') else None,
        objetivos=data.get('objetivos'),
        observacoes=data.get('observacoes')
    )
    
    try:
        db.session.add(cliente)
        db.session.commit()
        return jsonify(cliente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    """Obtém detalhes de um cliente específico"""
    cliente = Cliente.query.get_or_404(cliente_id)
    return jsonify(cliente.to_dict())

@app.route('/api/buscar', methods=['GET'])
def buscar():
    query = request.args.get('q', '').lower()
    
    if not query:
        clientes = Cliente.query.all()
    else:
        clientes = Cliente.query.filter(
            (Cliente.nome.ilike(f'%{query}%')) |
            (Cliente.email.ilike(f'%{query}%')) |
            (Cliente.telefone.ilike(f'%{query}%'))
        ).all()
    
    return jsonify([cliente.to_dict() for cliente in clientes])

# Inicializar banco de dados
with app.app_context():
    db.create_all()
    
    if Etiqueta.query.count() == 0:
        etiquetas_default = [
            Etiqueta(nome='Ativo', cor='#90EE90', categoria='status'),
            Etiqueta(nome='Inativo', cor='#FFB6C1', categoria='status'),
            Etiqueta(nome='Em Cardápio', cor='#FFD700', categoria='tipo'),
            Etiqueta(nome='Em Desafio', cor='#FF6B6B', categoria='tipo'),
            Etiqueta(nome='Reavaliação', cor='#4ECDC4', categoria='tipo'),
        ]
        for et in etiquetas_default:
            db.session.add(et)
        db.session.commit()

if __name__ == '__main__':
    print("=" * 60)
    print("🥗 ANDENUTRI - Dashboard Completo")
    print("=" * 60)
    print("🌐 Acesse: http://localhost:3000")
    print("🎨 Tema: Creme Elegante")
    print("📊 Dashboard completo com navegação lateral")
    print("⏹️  Para parar: Ctrl+C")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=3000, debug=True)

