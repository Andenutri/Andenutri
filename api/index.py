#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Vercel Serverless Entry Point
"""

from flask import Flask, request, jsonify
from backend.models import db, Cliente
from datetime import datetime
import os
import json

app = Flask(__name__)

# Configuração
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///andenutri.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar database
db.init_app(app)

# Criar tabelas
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    """Endpoint raiz"""
    return jsonify({
        'status': 'ok',
        'message': 'ANDENUTRI API está funcionando!',
        'version': '1.0.0'
    })

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    """Listar todos os clientes"""
    try:
        clientes = Cliente.query.all()
        return jsonify([c.to_dict() for c in clientes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes', methods=['POST'])
def criar_cliente():
    """Criar novo cliente"""
    try:
        data = request.get_json()
        
        cliente = Cliente(
            nome=data.get('nome'),
            email=data.get('email'),
            pais_telefone=data.get('pais_telefone', '+55'),
            telefone=data.get('telefone'),
            whatsapp=data.get('whatsapp'),
            pais=data.get('pais'),
            estado=data.get('estado'),
            cidade=data.get('cidade'),
            endereco=data.get('endereco'),
            data_nascimento=datetime.strptime(data.get('data_nascimento'), '%Y-%m-%d').date() if data.get('data_nascimento') else None,
            status=data.get('status', 'inativo'),
            plano_ativo=data.get('plano_ativo'),
            status_plano=data.get('status_plano'),
            compra_herbalife=data.get('compra_herbalife', 'nao'),
            status_herbalife=data.get('status_herbalife'),
            usuario_herbalife=data.get('usuario_herbalife'),
            senha_herbalife=data.get('senha_herbalife'),
            foi_indicacao=data.get('foi_indicacao', 'nao'),
            indicado_por=data.get('indicado_por'),
            esta_desafio=data.get('esta_desafio', 'nao'),
            objetivos=data.get('objetivos'),
            observacoes=data.get('observacoes')
        )
        
        db.session.add(cliente)
        db.session.commit()
        
        return jsonify(cliente.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    """Obter cliente específico"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        return jsonify(cliente.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/search', methods=['GET'])
def buscar_clientes():
    """Buscar clientes por nome ou email"""
    try:
        query = request.args.get('q', '')
        clientes = Cliente.query.filter(
            Cliente.nome.contains(query) | 
            Cliente.email.contains(query)
        ).all()
        return jsonify([c.to_dict() for c in clientes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Export para Vercel
handler = app

