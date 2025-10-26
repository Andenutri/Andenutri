#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Vercel Serverless Entry Point
"""

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Configuração
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

@app.route('/')
def index():
    """Endpoint raiz"""
    return jsonify({
        'status': 'ok',
        'message': 'ANDENUTRI API está funcionando!',
        'version': '1.0.0',
        'deploy': 'vercel'
    })

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    """Listar todos os clientes"""
    try:
        # Por enquanto retornar mock - depois integrar com Supabase
        return jsonify({
            'message': 'Endpoint funcionando, aguardando integração com Supabase',
            'clientes': []
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes', methods=['POST'])
def criar_cliente():
    """Criar novo cliente"""
    try:
        data = request.get_json()
        return jsonify({
            'message': 'Cliente criado com sucesso',
            'cliente': data
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    """Obter cliente específico"""
    try:
        return jsonify({
            'id': cliente_id,
            'message': 'Cliente encontrado'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/search', methods=['GET'])
def buscar_clientes():
    """Buscar clientes por nome ou email"""
    try:
        query = request.args.get('q', '')
        return jsonify({
            'query': query,
            'resultados': []
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Export para Vercel
handler = app

