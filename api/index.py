from flask import Flask, request, jsonify
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def handler(path):
    """Handler universal"""
    if path == '' or path == '/':
        return jsonify({
            'status': 'ok',
            'message': 'ANDENUTRI API está funcionando!',
            'version': '1.0.0',
            'deploy': 'vercel'
        })
    
    elif path.startswith('api/clientes'):
        if request.method == 'GET':
            # Listar clientes
            if 'q' in request.args:
                query = request.args.get('q', '')
                return jsonify({
                    'query': query,
                    'resultados': [],
                    'message': 'Busca funcionando'
                })
            else:
                return jsonify({
                    'message': 'Endpoint funcionando',
                    'clientes': []
                })
        
        elif request.method == 'POST':
            data = request.get_json()
            return jsonify({
                'message': 'Cliente criado com sucesso',
                'cliente': data
            }), 201
    
    return jsonify({'error': 'Not found'}), 404

