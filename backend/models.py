#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Models do Banco de Dados
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Cliente(db.Model):
    """Modelo de Cliente"""
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    whatsapp = db.Column(db.String(20))
    data_nascimento = db.Column(db.Date)
    foto = db.Column(db.String(500))  # URL da foto
    
    # Status e plano
    status = db.Column(db.String(20), default='inativo')  # ativo, inativo, pausado
    plano_ativo = db.Column(db.String(100))
    data_inicio = db.Column(db.Date)
    data_vencimento = db.Column(db.Date)
    tempo_acesso_ativo = db.Column(db.Boolean, default=True)  # True = acesso liberado
    
    # Objetivos e observações
    objetivos = db.Column(db.Text)
    observacoes = db.Column(db.Text)
    
    # Timestamps
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    avaliacoes = db.relationship('Avaliacao', backref='cliente', lazy=True, cascade='all, delete-orphan')
    etiquetas = db.relationship('ClienteEtiqueta', backref='cliente', lazy=True, cascade='all, delete-orphan')
    consultas = db.relationship('Consulta', backref='cliente', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'whatsapp': self.whatsapp,
            'data_nascimento': self.data_nascimento.strftime('%Y-%m-%d') if self.data_nascimento else None,
            'foto': self.foto,
            'status': self.status,
            'plano_ativo': self.plano_ativo,
            'data_inicio': self.data_inicio.strftime('%Y-%m-%d') if self.data_inicio else None,
            'data_vencimento': self.data_vencimento.strftime('%Y-%m-%d') if self.data_vencimento else None,
            'tempo_acesso_ativo': self.tempo_acesso_ativo,
            'objetivos': self.objetivos,
            'observacoes': self.observacoes,
            'data_cadastro': self.data_cadastro.strftime('%Y-%m-%d %H:%M:%S') if self.data_cadastro else None,
        }


class Etiqueta(db.Model):
    """Modelo de Etiqueta/Tag"""
    __tablename__ = 'etiquetas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    cor = db.Column(db.String(7), nullable=False)  # Hex color
    categoria = db.Column(db.String(50))  # status, tipo, personalizado
    descricao = db.Column(db.String(200))
    
    clientes = db.relationship('ClienteEtiqueta', backref='etiqueta', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cor': self.cor,
            'categoria': self.categoria,
            'descricao': self.descricao
        }


class ClienteEtiqueta(db.Model):
    """Tabela de relacionamento Cliente-Etiqueta"""
    __tablename__ = 'cliente_etiquetas'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    etiqueta_id = db.Column(db.Integer, db.ForeignKey('etiquetas.id'), nullable=False)
    
    db.UniqueConstraint('cliente_id', 'etiqueta_id', name='uq_cliente_etiqueta')


class Avaliacao(db.Model):
    """Modelo de Avaliação Física"""
    __tablename__ = 'avaliacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    
    # Medidas
    peso = db.Column(db.Float)
    altura = db.Column(db.Float)
    imc = db.Column(db.Float)
    cintura = db.Column(db.Float)
    quadril = db.Column(db.Float)
    braco = db.Column(db.Float)
    coxa = db.Column(db.Float)
    pescoco = db.Column(db.Float)
    
    # Fotos
    foto_frente = db.Column(db.String(500))
    foto_lateral = db.Column(db.String(500))
    foto_costa = db.Column(db.String(500))
    
    # Observações
    observacoes = db.Column(db.Text)
    queixas = db.Column(db.Text)
    
    # Timestamps
    data_avaliacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'peso': self.peso,
            'altura': self.altura,
            'imc': self.imc,
            'cintura': self.cintura,
            'quadril': self.quadril,
            'braco': self.braco,
            'coxa': self.coxa,
            'pescoco': self.pescoco,
            'foto_frente': self.foto_frente,
            'foto_lateral': self.foto_lateral,
            'foto_costa': self.foto_costa,
            'observacoes': self.observacoes,
            'queixas': self.queixas,
            'data_avaliacao': self.data_avaliacao.strftime('%Y-%m-%d %H:%M:%S') if self.data_avaliacao else None
        }


class Consulta(db.Model):
    """Modelo de Consulta/Sessão"""
    __tablename__ = 'consultas'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    
    data_hora = db.Column(db.DateTime, nullable=False)
    tipo = db.Column(db.String(50))  # presencial, online, retorno
    status = db.Column(db.String(20), default='agendada')  # agendada, realizada, cancelada
    observacoes = db.Column(db.Text)
    
    # Integração com Google
    evento_google_id = db.Column(db.String(100))
    sincronizado_google = db.Column(db.Boolean, default=False)
    
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'data_hora': self.data_hora.strftime('%Y-%m-%d %H:%M:%S') if self.data_hora else None,
            'tipo': self.tipo,
            'status': self.status,
            'observacoes': self.observacoes,
            'sincronizado_google': self.sincronizado_google
        }


class Cardapio(db.Model):
    """Modelo de Cardápio"""
    __tablename__ = 'cardapios'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    
    titulo = db.Column(db.String(200))
    conteudo = db.Column(db.Text)  # HTML ou texto do cardápio
    data_inicio = db.Column(db.Date)
    data_fim = db.Column(db.Date)
    
    # Envio
    enviado_por_email = db.Column(db.Boolean, default=False)
    data_envio = db.Column(db.DateTime)
    
    # Acesso
    cliente_tem_acesso = db.Column(db.Boolean, default=True)
    
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'data_inicio': self.data_inicio.strftime('%Y-%m-%d') if self.data_inicio else None,
            'data_fim': self.data_fim.strftime('%Y-%m-%d') if self.data_fim else None,
            'enviado_por_email': self.enviado_por_email,
            'cliente_tem_acesso': self.cliente_tem_acesso
        }

