#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SaaS Coach de Bem-Estar - Interface Web Rosa
"""

from flask import Flask, render_template_string
import os

app = Flask(__name__)

HTML_ROSA = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 SaaS Coach de Bem-Estar</title>
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
            max-width: 1200px;
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

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .welcome {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome h2 {
            color: #ff8c69;
            font-size: 2em;
            margin-bottom: 10px;
        }

        .welcome p {
            color: #666;
            font-size: 1.1em;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .feature {
            background: linear-gradient(135deg, #fff8f5 0%, #ffece6 100%);
            padding: 25px;
            border-radius: 15px;
            border-left: 4px solid #ffa07a;
            transition: transform 0.3s;
        }

        .feature:hover {
            transform: translateY(-5px);
        }

        .feature h3 {
            color: #ff8c69;
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .feature p {
            color: #666;
            line-height: 1.6;
        }

        .btn {
            background: linear-gradient(135deg, #ffa07a 0%, #ffc0a6 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
            transition: transform 0.3s;
            margin: 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .status {
            text-align: center;
            padding: 20px;
            background: #fff8f5;
            border-radius: 10px;
            margin-top: 30px;
        }

        .status h3 {
            color: #ff8c69;
            margin-bottom: 10px;
        }

        .coming-soon {
            text-align: center;
            color: #ff8c69;
            font-size: 1.5em;
            margin-top: 40px;
            padding: 20px;
            background: #fff8f5;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥗 SaaS Coach de Bem-Estar</h1>
            <p>Sistema completo para gestão de clientes e acompanhamentos</p>
        </div>

        <div class="content">
            <div class="welcome">
                <h2>Bem-vindo ao seu sistema! 💪</h2>
                <p>Sua plataforma completa para gerenciar clientes de bem-estar</p>
            </div>

            <div class="features">
                <div class="feature">
                    <h3>👤 Cadastro de Clientes</h3>
                    <p>Crie e gerencie perfis completos dos seus clientes</p>
                </div>

                <div class="feature">
                    <h3>📋 Avaliação Inicial</h3>
                    <p>Registre medidas, objetivos e informações importantes</p>
                </div>

                <div class="feature">
                    <h3>📈 Acompanhamentos</h3>
                    <p>Registre sessões e acompanhe evolução dos clientes</p>
                </div>

                <div class="feature">
                    <h3>📊 Dashboard</h3>
                    <p>Visualize estatísticas e resultados em tempo real</p>
                </div>

                <div class="feature">
                    <h3>🔍 Busca Inteligente</h3>
                    <p>Encontre clientes e dados rapidamente</p>
                </div>

                <div class="feature">
                    <h3>📱 WhatsApp Integration</h3>
                    <p>Automate seus atendimentos e comunicações</p>
                </div>
            </div>

            <div class="status">
                <h3>✅ Sistema em desenvolvimento</h3>
                <p>Base criada - Pronto para desenvolvimento completo</p>
            </div>

            <div class="coming-soon">
                🚀 Em breve: Login, Dashboard e todas as funcionalidades!
            </div>
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_ROSA)

if __name__ == '__main__':
    print("=" * 50)
    print("🥗 SaaS Coach de Bem-Estar")
    print("=" * 50)
    print("🌐 Acesse: http://localhost:3000")
    print("🎨 Tema: Rosa")
    print("⏹️  Para parar: Ctrl+C")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=3000, debug=True)
