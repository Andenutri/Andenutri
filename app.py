#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Aplicação Principal
"""

from flask import Flask, render_template_string, jsonify, request
from backend.models import db, Cliente, Etiqueta
from datetime import datetime
import os

app = Flask(__name__)

# Configuração
app.config['SECRET_KEY'] = 'dev-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(os.path.dirname(__file__), "andenutri.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar database
db.init_app(app)

# HTML Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ANDENUTRI - Coach de Bem-Estar</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 50%, #ffe0d4 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(255, 160, 122, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .search-bar {
            padding: 20px;
            background: #fff8f5;
            border-bottom: 2px solid #ffe0d4;
        }

        .search-input {
            width: 100%;
            padding: 15px 20px;
            font-size: 1.1em;
            border: 2px solid #ffc0a6;
            border-radius: 10px;
            background: white;
            color: #333;
        }

        .search-input:focus {
            outline: none;
            border-color: #ff8c69;
            box-shadow: 0 0 0 3px rgba(255, 140, 105, 0.1);
        }

        .clientes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 30px;
        }

        .cliente-card {
            background: linear-gradient(135deg, #fff8f5 0%, #ffece6 100%);
            border-left: 4px solid #ffa07a;
            border-radius: 15px;
            padding: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .cliente-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255, 160, 122, 0.2);
        }

        .cliente-status {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .status-ativo {
            background: #90EE90;
            color: #006400;
        }

        .status-inativo {
            background: #FFB6C1;
            color: #8B0000;
        }

        .status-pausado {
            background: #FFD700;
            color: #8B6914;
        }

        .etiquetas {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }

        .etiqueta {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
            color: white;
        }

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

        .add-btn:hover {
            transform: scale(1.1);
        }

        .no-results {
            text-align: center;
            padding: 60px 20px;
            color: #999;
            font-size: 1.2em;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
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
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #ffe0d4;
        }

        .modal-title {
            color: #ff8c69;
            font-size: 1.8em;
        }

        .close {
            color: #999;
            font-size: 2em;
            cursor: pointer;
        }

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

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #ffa07a;
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

        .btn-submit:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥗 ANDENUTRI</h1>
            <p>Sistema de Gestão para Coach de Bem-Estar</p>
        </div>

        <div class="search-bar">
            <input type="text" class="search-input" id="searchInput" placeholder="🔍 Buscar cliente por nome, email ou telefone...">
        </div>

        <div class="clientes-grid" id="clientesGrid">
            <!-- Clientes serão carregados aqui -->
        </div>

        <div class="no-results" id="noResults" style="display: none;">
            Nenhum cliente encontrado
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
                    <label>Data de Início</label>
                    <input type="date" name="data_inicio">
                </div>
                <div class="form-group">
                    <label>Data de Vencimento</label>
                    <input type="date" name="data_vencimento">
                </div>
                <div class="form-group">
                    <label>Objetivos</label>
                    <textarea name="objetivos" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea name="observacoes" rows="3"></textarea>
                </div>
                <button type="submit" class="btn-submit">Salvar Cliente</button>
            </form>
        </div>
    </div>

    <script>
        // Carregar clientes
        async function carregarClientes() {
            try {
                const response = await fetch('/api/clientes');
                const clientes = await response.json();
                exibirClientes(clientes);
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
            }
        }

        // Exibir clientes no grid
        function exibirClientes(clientes) {
            const grid = document.getElementById('clientesGrid');
            const noResults = document.getElementById('noResults');
            
            if (clientes.length === 0) {
                grid.style.display = 'none';
                noResults.style.display = 'block';
                return;
            }
            
            grid.style.display = 'grid';
            noResults.style.display = 'none';
            
            grid.innerHTML = clientes.map(cliente => `
                <div class="cliente-card" onclick="editarCliente(${cliente.id})">
                    <div class="cliente-status status-${cliente.status}">
                        ${cliente.status.toUpperCase()}
                    </div>
                    <h3 style="color: #ff8c69; margin-bottom: 10px;">${cliente.nome}</h3>
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 5px;">📧 ${cliente.email}</p>
                    ${cliente.telefone ? `<p style="color: #666; font-size: 0.9em; margin-bottom: 5px;">📱 ${cliente.telefone}</p>` : ''}
                    ${cliente.plano_ativo ? `<p style="color: #666; font-size: 0.9em;">📋 ${cliente.plano_ativo}</p>` : ''}
                    <div class="etiquetas"></div>
                </div>
            `).join('');
        }

        // Busca em tempo real
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value;
            
            if (query.length < 2) {
                carregarClientes();
                return;
            }
            
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

        // Criar novo cliente
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
                    alert('Cliente cadastrado com sucesso!');
                }
            } catch (error) {
                console.error('Erro ao criar cliente:', error);
                alert('Erro ao criar cliente');
            }
        });

        // Editar cliente (placeholder)
        function editarCliente(id) {
            console.log('Editar cliente:', id);
            // Implementar edição
        }

        // Fechar modal clicando fora
        window.onclick = function(event) {
            const modal = document.getElementById('modalNovoCliente');
            if (event.target === modal) {
                fecharModal();
            }
        }

        // Carregar clientes ao iniciar
        carregarClientes();
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

# Rotas API
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
        data_inicio=datetime.strptime(data['data_inicio'], '%Y-%m-%d').date() if data.get('data_inicio') else None,
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
    
    # Criar etiquetas padrão se não existirem
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
    print("=" * 50)
    print("🥗 ANDENUTRI - Coach de Bem-Estar")
    print("=" * 50)
    print("🌐 Acesse: http://localhost:3000")
    print("🎨 Tema: Salmão Suave")
    print("⏹️  Para parar: Ctrl+C")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=3000, debug=True)

