#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Importar Clientes do Excel/CSV para ANDENUTRI
"""

import csv
import sys
from datetime import datetime
from backend.models import db, Cliente
from app import app

def importar_cliente(row):
    """Importa um cliente do CSV/Excel"""
    
    # Mapeamento de colunas (ajuste conforme sua planilha)
    cliente = Cliente(
        nome=row.get('Nome', row.get('nome', '')),
        email=row.get('Email', row.get('email', '')),
        telefone=row.get('Telefone', row.get('telefone', '')),
        whatsapp=row.get('WhatsApp', row.get('whatsapp', '')),
        status=row.get('Status', row.get('status', 'ativo')).lower(),
        plano_ativo=row.get('Plano', row.get('plano', '')),
        objetivos=row.get('Objetivos', row.get('objetivos', '')),
        observacoes=row.get('Observações', row.get('observacoes', ''))
    )
    
    # Datas opcionais
    if row.get('Data Nascimento') or row.get('data_nascimento'):
        try:
            data_nasc = row.get('Data Nascimento') or row.get('data_nascimento')
            cliente.data_nascimento = datetime.strptime(data_nasc, '%Y-%m-%d').date()
        except:
            pass
    
    if row.get('Data Vencimento') or row.get('data_vencimento'):
        try:
            data_venc = row.get('Data Vencimento') or row.get('data_vencimento')
            cliente.data_vencimento = datetime.strptime(data_venc, '%Y-%m-%d').date()
        except:
            pass
    
    return cliente

def importar_csv(nome_arquivo):
    """Importa clientes de arquivo CSV"""
    with open(nome_arquivo, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        clientes = []
        for row in reader:
            try:
                cliente = importar_cliente(row)
                clientes.append(cliente)
            except Exception as e:
                print(f"❌ Erro ao importar linha: {e}")
                continue
        
        # Inserir no banco
        try:
            with app.app_context():
                db.session.add_all(clientes)
                db.session.commit()
                print(f"✅ {len(clientes)} clientes importados com sucesso!")
                return True
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar: {e}")
            return False

def preview_csv(nome_arquivo):
    """Mostra preview do CSV antes de importar"""
    print(f"\n📄 Preview do arquivo: {nome_arquivo}\n")
    
    with open(nome_arquivo, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
        # Mostrar colunas
        print("📋 Colunas encontradas:")
        for col in reader.fieldnames:
            print(f"  - {col}")
        
        print(f"\n📊 Total de linhas: {len(rows)}")
        
        # Mostrar primeiras 3 linhas como exemplo
        print("\n📝 Primeiras linhas:")
        for i, row in enumerate(rows[:3]):
            print(f"\n  Linha {i+1}:")
            for key, value in list(row.items())[:5]:
                print(f"    {key}: {value}")
        
        if len(rows) > 3:
            print(f"\n  ... e mais {len(rows) - 3} linhas")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("""
🥗 Importador de Clientes ANDENUTRI
===================================

Uso:
  python3 importar_clientes.py preview arquivo.csv   # Ver preview
  python3 importar_clientes.py import arquivo.csv     # Importar dados

Exemplo:
  python3 importar_clientes.py import clientes.csv
        """)
        sys.exit(1)
    
    comando = sys.argv[1]
    arquivo = sys.argv[2] if len(sys.argv) > 2 else None
    
    if comando == 'preview' and arquivo:
        preview_csv(arquivo)
    elif comando == 'import' and arquivo:
        resposta = input(f"\n⚠️  Deseja importar {arquivo}? (sim/não): ")
        if resposta.lower() in ['sim', 's', 'yes', 'y']:
            importar_csv(arquivo)
        else:
            print("❌ Importação cancelada")
    else:
        print("❌ Comando inválido. Use 'preview' ou 'import'")

