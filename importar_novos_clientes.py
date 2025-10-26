#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Importa Novos Clientes do Excel
"""

import pandas as pd
import os
from datetime import datetime
from backend.models import db, Cliente
from app_dashboard import app

def importar_clientes():
    arquivo = os.path.expanduser('~/Downloads/43501792C_Novos Clientes Premium_20250219114701.xlsx')
    
    print("📥 Lendo arquivo Excel...")
    df = pd.read_excel(arquivo, skiprows=8)
    
    print(f"✅ {len(df)} clientes encontrados")
    print(f"📋 Colunas: {list(df.columns[:10])}")
    
    # Importar clientes
    clientes_importados = []
    erros = 0
    
    for idx, row in df.iterrows():
        try:
            nome = str(row.get('Nome', '')).strip()
            if not nome or nome == 'nan' or nome == '':
                continue
            
            status_str = str(row.get('Status', 'PB15')).strip()
            # Mapear status para ativo/inativo
            if 'PB15' in status_str or 'PG35' in status_str or 'PS25' in status_str:
                status = 'ativo'
            elif 'BPM' in status_str:
                status = 'inativo'
            else:
                status = 'ativo'
            
            # Criar cliente
            cliente = Cliente(
                nome=nome,
                email=f"cliente_{idx}@importado.com",  # Email temporário
                telefone='',
                whatsapp='',
                status=status,
                plano_ativo='Premium',
                objetivos=f"Status: {status_str}",
                observacoes=f"ID Consultor: {row.get('ID do Consultor', '')}",
                tempo_acesso_ativo=True,
                data_cadastro=datetime.utcnow(),
                atualizado_em=datetime.utcnow()
            )
            
            # Data de cadastro se disponível
            try:
                data_cad = row.get('Data de Cadastro do CI')
                if pd.notna(data_cad):
                    if isinstance(data_cad, str):
                        cliente.data_cadastro = datetime.strptime(data_cad, '%d/%m/%Y')
                    else:
                        cliente.data_cadastro = data_cad
            except:
                pass
            
            clientes_importados.append(cliente)
            
            if (idx + 1) % 100 == 0:
                print(f"  ✓ {idx + 1} clientes processados...")
                
        except Exception as e:
            erros += 1
            if erros < 5:
                print(f"  ⚠️ Erro na linha {idx+2}: {e}")
    
    print(f"\n✅ {len(clientes_importados)} clientes prontos para importar")
    
    if not clientes_importados:
        print("❌ Nenhum cliente válido")
        return False
    
    # Confirmar
    resposta = input(f"\n⚠️  Deseja importar {len(clientes_importados)} clientes? (sim/não): ")
    if resposta.lower() not in ['sim', 's', 'yes', 'y']:
        print("❌ Importação cancelada")
        return False
    
    # Salvar no banco
    try:
        with app.app_context():
            db.session.add_all(clientes_importados)
            db.session.commit()
            
            total = Cliente.query.count()
            print(f"\n🎉 {len(clientes_importados)} clientes importados com sucesso!")
            print(f"📊 Total no banco: {total} clientes")
            
            return True
    except Exception as e:
        db.session.rollback()
        print(f"❌ Erro ao salvar: {e}")
        return False

if __name__ == '__main__':
    importar_clientes()

