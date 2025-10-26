from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/api':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'status': 'ok',
                'message': 'ANDENUTRI API está funcionando!',
                'version': '1.0.0',
                'deploy': 'vercel'
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path.startswith('/api/clientes'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'message': 'Cliente criado com sucesso',
                'cliente': json.loads(post_data.decode('utf-8'))
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

