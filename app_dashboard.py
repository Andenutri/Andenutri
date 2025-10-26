#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Dashboard Completo
"""

from flask import Flask, render_template_string, jsonify, request
from backend.models import db, Cliente, Etiqueta
from datetime import datetime, date
import os

app = Flask(__name__)

# Configuração
app.config['SECRET_KEY'] = 'dev-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(os.path.dirname(__file__), "andenutri.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 50%, #ffe0d4 100%);
            min-height: 100vh;
        }

        /* Menu Hambúrguer */
        .hamburger {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 12px;
            font-size: 1.5em;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 160, 122, 0.4);
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
        .sidebar-item:hover { background: #fff8f5; }
        .sidebar-item.active {
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
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
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            padding: 30px 60px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2.5em;
            color: #ff8c69;
            font-weight: bold;
        }
        .stat-label {
            color: #666;
            margin-top: 10px;
        }

        /* Busca */
        .search-bar {
            padding: 20px 30px;
            background: #fff8f5;
        }
        .search-input {
            width: 100%;
            padding: 15px 20px;
            font-size: 1.1em;
            border: 2px solid #ffc0a6;
            border-radius: 10px;
            background: white;
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
            border-left: 4px solid #ffa07a;
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .cliente-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
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
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            border: none;
            font-size: 2em;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 160, 122, 0.4);
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
            border-bottom: 2px solid #ffe0d4;
        }
        .modal-title { color: #ff8c69; font-size: 1.8em; }
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
            border: 2px solid #ffe0d4;
            border-radius: 8px;
            font-size: 1em;
        }
        .btn-submit {
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
            margin-top: 20px;
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
                <h2 style="color: #ff8c69; margin-bottom: 20px;">👥 Todos os Clientes</h2>
                <div class="search-bar">
                    <input type="text" class="search-input" id="searchClientes" 
                           placeholder="🔍 Buscar cliente...">
                </div>
                <div class="clientes-grid" id="clientesListView"></div>
            </div>
        </div>

        <!-- Agenda View -->
        <div id="agenda-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #ff8c69; margin-bottom: 20px;">📅 Agenda</h2>
                <p style="color: #666;">🎂 Aniversários</p>
                <p style="color: #666;">📋 Consultas</p>
                <p style="color: #666;">⏰ Vencimentos</p>
                <p style="color: #999; margin-top: 20px;">Integração com Google Agenda em breve...</p>
            </div>
        </div>

        <!-- Avaliações View -->
        <div id="avaliacoes-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #ff8c69; margin-bottom: 20px;">📏 Avaliações</h2>
                <p style="color: #999;">Sistema de avaliações em desenvolvimento...</p>
            </div>
        </div>

        <!-- Cardápios View -->
        <div id="cardapios-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #ff8c69; margin-bottom: 20px;">🍽️ Cardápios</h2>
                <p style="color: #999;">Sistema de cardápios em desenvolvimento...</p>
            </div>
        </div>

        <!-- Configurações View -->
        <div id="configuracoes-view" class="view" style="display: none;">
            <div style="padding: 30px;">
                <h2 style="color: #ff8c69; margin-bottom: 20px;">⚙️ Configurações</h2>
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
                <div class="form-group">
                    <label>Nome Completo *</label>
                    <input type="text" name="nome" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" name="telefone">
                </div>
                <div class="form-group">
                    <label>WhatsApp</label>
                    <input type="tel" name="whatsapp">
                </div>
                <div class="form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" name="data_nascimento">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="inativo">Inativo</option>
                        <option value="ativo">Ativo</option>
                        <option value="pausado">Pausado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Plano Ativo</label>
                    <input type="text" name="plano_ativo">
                </div>
                <div class="form-group">
                    <label>Data de Vencimento</label>
                    <input type="date" name="data_vencimento">
                </div>
                <div class="form-group">
                    <label>Objetivos</label>
                    <textarea name="objetivos" rows="3"></textarea>
                </div>
                <button type="submit" class="btn-submit">Salvar Cliente</button>
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
                    <h3 style="color: #ff8c69; margin-bottom: 10px;">${cliente.nome}</h3>
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

        // Busca
        document.getElementById('searchInput').addEventListener('input', async (e) => {
            const query = e.target.value;
            if (query.length < 2) { carregarClientes(); return; }
            try {
                const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`);
                const clientes = await response.json();
                exibirClientes(clientes);
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
    print("🎨 Tema: Salmão Suave")
    print("📊 Dashboard completo com navegação lateral")
    print("⏹️  Para parar: Ctrl+C")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=3000, debug=True)

