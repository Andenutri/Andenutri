#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANDENUTRI - Backend Init
"""

from flask import Flask
from backend.config import config
from backend.models import db

def create_app(config_name='default'):
    """Factory para criar a aplicação Flask"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Inicializar extensões
    db.init_app(app)
    
    # Criar tabelas
    with app.app_context():
        db.create_all()
    
    # Registrar rotas
    from backend.routes import main
    app.register_blueprint(main)
    
    return app

