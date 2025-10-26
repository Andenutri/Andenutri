#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Rotas da API
"""

from flask import Blueprint, request, jsonify, render_template
from datetime import datetime
from backend.models import db, Cliente, Etiqueta, ClienteEtiqueta, Avaliacao, Consulta, Cardapio

main = Blueprint('main', __name__)


@main.route('/')
def index():
    """Página inicial"""
    return render_template('index.html')


@main.route('/api/clientes', methods=['GET'])
def listar_clientes():
    """Lista todos os clientes"""
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])


@main.route('/api/clientes/<int:id>', methods=['GET'])
def obter_cliente(id):
    """Obtém um cliente específico"""
    cliente = Cliente.query.get_or_404(id)
    return jsonify(cliente.to_dict())


@main.route('/api/clientes', methods=['POST'])
def criar_cliente():
    """Cria um novo cliente"""
    data = request.json
    
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
        tempo_acesso_ativo=data.get('tempo_acesso_ativo', True),
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


@main.route('/api/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente(id):
    """Atualiza um cliente"""
    cliente = Cliente.query.get_or_404(id)
    data = request.json
    
    cliente.nome = data.get('nome', cliente.nome)
    cliente.email = data.get('email', cliente.email)
    cliente.telefone = data.get('telefone', cliente.telefone)
    cliente.whatsapp = data.get('whatsapp', cliente.whatsapp)
    cliente.status = data.get('status', cliente.status)
    cliente.plano_ativo = data.get('plano_ativo', cliente.plano_ativo)
    cliente.objetivos = data.get('objetivos', cliente.objetivos)
    cliente.observacoes = data.get('observacoes', cliente.observacoes)
    cliente.atualizado_em = datetime.utcnow()
    
    if data.get('data_nascimento'):
        cliente.data_nascimento = datetime.strptime(data['data_nascimento'], '%Y-%m-%d').date()
    if data.get('data_vencimento'):
        cliente.data_vencimento = datetime.strptime(data['data_vencimento'], '%Y-%m-%d').date()
        # Atualizar tempo de acesso baseado em vencimento
        if datetime.utcnow().date() > cliente.data_vencimento:
            cliente.tempo_acesso_ativo = False
    
    try:
        db.session.commit()
        return jsonify(cliente.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@main.route('/api/clientes/<int:id>', methods=['DELETE'])
def deletar_cliente(id):
    """Deleta um cliente"""
    cliente = Cliente.query.get_or_404(id)
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({'message': 'Cliente deletado com sucesso'})


@main.route('/api/buscar', methods=['GET'])
def buscar():
    """Busca inteligente de clientes"""
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify([])
    
    # Busca por nome, email, telefone
    clientes = Cliente.query.filter(
        (Cliente.nome.ilike(f'%{query}%')) |
        (Cliente.email.ilike(f'%{query}%')) |
        (Cliente.telefone.ilike(f'%{query}%'))
    ).all()
    
    # Adiciona etiquetas a cada cliente
    resultado = []
    for cliente in clientes:
        cli_dict = cliente.to_dict()
        cli_dict['etiquetas'] = [et.etiqueta.to_dict() for et in cliente.etiquetas]
        resultado.append(cli_dict)
    
    return jsonify(resultado)


@main.route('/api/etiquetas', methods=['GET'])
def listar_etiquetas():
    """Lista todas as etiquetas"""
    etiquetas = Etiqueta.query.all()
    return jsonify([et.to_dict() for et in etiquetas])


@main.route('/api/etiquetas', methods=['POST'])
def criar_etiqueta():
    """Cria uma nova etiqueta"""
    data = request.json
    etiqueta = Etiqueta(
        nome=data.get('nome'),
        cor=data.get('cor'),
        categoria=data.get('categoria'),
        descricao=data.get('descricao')
    )
    db.session.add(etiqueta)
    db.session.commit()
    return jsonify(etiqueta.to_dict()), 201


@main.route('/api/clientes/<int:cliente_id>/etiquetas/<int:etiqueta_id>', methods=['POST'])
def adicionar_etiqueta_cliente(cliente_id, etiqueta_id):
    """Adiciona etiqueta a um cliente"""
    # Verifica se já existe
    existe = ClienteEtiqueta.query.filter_by(
        cliente_id=cliente_id, etiqueta_id=etiqueta_id
    ).first()
    
    if existe:
        return jsonify({'message': 'Etiqueta já adicionada'})
    
    cliente_etiqueta = ClienteEtiqueta(
        cliente_id=cliente_id,
        etiqueta_id=etiqueta_id
    )
    db.session.add(cliente_etiqueta)
    db.session.commit()
    return jsonify({'message': 'Etiqueta adicionada'})

