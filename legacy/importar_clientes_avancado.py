#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Importador Avançado - Suporta Excel e CSV
"""

import sys
import os
import csv
import pandas as pd
from datetime import datetime
from backend.models import db, Cliente
from app_dashboard import app

def detectar_formato(arquivo):
    """Detecta formato do arquivo"""
    ext = arquivo.lower().split('.')[-1]
    return ext

def ler_arquivo(arquivo):
    """Lê arquivo Excel ou CSV"""
    try:
        if detectar_formato(arquivo) == 'csv':
            return pd.read_csv(arquivo, encoding='utf-8')
        else:
            # Tenta abrir o primeiro sheet do Excel
            return pd.read_excel(arquivo, engine='openpyxl', nrows=None)
    except Exception as e:
        print(f"❌ Erro ao ler arquivo: {e}")
        return None

def mostrar_preview(df, arquivo):
    """Mostra preview do arquivo"""
    print(f"\n📄 Arquivo: {arquivo}")
    print(f"📊 Total de linhas: {len(df)}")
    print(f"📋 Total de colunas: {len(df.columns)}\n")
    
    print("📋 Colunas encontradas:")
    for col in df.columns:
        tipo = df[col].dtype
        nao_vazios = df[col].notna().sum()
        print(f"  - {col} ({tipo}) - {nao_vazios} preenchidos")
    
    print("\n📝 Primeiras 3 linhas:\n")
    print(df.head(3).to_string())
    
    print(f"\n💡 Total de linhas para importar: {len(df)}\n")

def importar_cliente(row):
    """Importa um cliente da linha do dataframe"""
    
    # Criar dicionário com as colunas
    dados = {}
    for col in row.index:
        valor = row[col]
        if pd.isna(valor):
            dados[col.lower()] = ''
        else:
            # Limpar espaços e converter para string
            dados[col.lower()] = str(valor).strip()
    
    # Mapear colunas (flexível - aceita variações)
    cliente = Cliente()
    
    # Nome (obrigatório)
    nome = dados.get('nome', '') or dados.get('name', '') or dados.get('cliente', '')
    if not nome:
        return None
    cliente.nome = nome
    
    # Email
    cliente.email = dados.get('email', '') or dados.get('e-mail', '') or f"cliente_{cliente.nome.lower().replace(' ', '_')}@sememail.com"
    
    # Telefone
    cliente.telefone = dados.get('telefone', '') or dados.get('fone', '') or dados.get('tel', '')
    
    # WhatsApp
    cliente.whatsapp = dados.get('whatsapp', '') or dados.get('whats', '') or dados.get('wa', '')
    
    # Status
    status = dados.get('status', 'ativo').lower()
    if status not in ['ativo', 'inativo', 'pausado']:
        status = 'ativo'
    cliente.status = status
    
    # Plano
    cliente.plano_ativo = dados.get('plano', '') or dados.get('plano_ativo', '')
    
    # Objetivos
    cliente.objetivos = dados.get('objetivos', '') or dados.get('objetivo', '')
    
    # Observações
    cliente.observacoes = dados.get('observações', '') or dados.get('observacoes', '') or dados.get('obs', '') or dados.get('observa', '')
    
    # Datas (opcional)
    try:
        if dados.get('data_nascimento') or dados.get('nascimento'):
            data_nasc_str = dados.get('data_nascimento') or dados.get('nascimento')
            if data_nasc_str:
                # Tenta vários formatos
                for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%d/%m/%y', '%Y-%m-%d %H:%M:%S']:
                    try:
                        cliente.data_nascimento = datetime.strptime(data_nasc_str.split()[0], fmt).date()
                        break
                    except:
                        pass
    except:
        pass
    
    try:
        if dados.get('data_vencimento') or dados.get('vencimento'):
            data_venc_str = dados.get('data_vencimento') or dados.get('vencimento')
            if data_venc_str:
                for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%d/%m/%y', '%Y-%m-%d %H:%M:%S']:
                    try:
                        cliente.data_vencimento = datetime.strptime(data_venc_str.split()[0], fmt).date()
                        break
                    except:
                        pass
    except:
        pass
    
    cliente.tempo_acesso_ativo = True
    cliente.data_cadastro = datetime.utcnow()
    cliente.atualizado_em = datetime.utcnow()
    
    return cliente

def importar_clientes(arquivo):
    """Importa clientes do arquivo"""
    df = ler_arquivo(arquivo)
    
    if df is None or len(df) == 0:
        print("❌ Arquivo vazio ou com erro")
        return False
    
    print(f"\n📥 Iniciando importação de {len(df)} clientes...\n")
    
    clientes = []
    erros = 0
    
    for idx, row in df.iterrows():
        try:
            cliente = importar_cliente(row)
            if cliente:
                clientes.append(cliente)
        except Exception as e:
            print(f"⚠️  Erro na linha {idx+2}: {e}")
            erros += 1
    
    if not clientes:
        print("❌ Nenhum cliente válido para importar")
        return False
    
    # Confirmar
    print(f"\n✅ {len(clientes)} clientes prontos para importar")
    if erros > 0:
        print(f"⚠️  {erros} linhas com erro ignoradas")
    
    # Inserir no banco
    try:
        with app.app_context():
            db.session.add_all(clientes)
            db.session.commit()
            print(f"\n🎉 {len(clientes)} clientes importados com sucesso!")
            print(f"📊 Total no banco agora: {Cliente.query.count()} clientes")
            return True
    except Exception as e:
        db.session.rollback()
        print(f"\n❌ Erro ao salvar no banco: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("""
🥗 Importador Avançado de Clientes ANDENUTRI
============================================

Uso:
  python3 importar_clientes_avancado.py preview arquivo.xlsx
  python3 importar_clientes_avancado.py import arquivo.xlsx

Formato suportado:
  - Excel (.xlsx, .xls)
  - CSV (.csv)
        """)
        sys.exit(1)
    
    comando = sys.argv[1]
    arquivo = sys.argv[2]
    
    if not os.path.exists(arquivo):
        print(f"❌ Arquivo não encontrado: {arquivo}")
        sys.exit(1)
    
    if comando == 'preview':
        df = ler_arquivo(arquivo)
        if df is not None:
            mostrar_preview(df, arquivo)
    elif comando == 'import':
        df = ler_arquivo(arquivo)
        if df is not None:
            mostrar_preview(df, arquivo)
            resposta = input(f"\n⚠️  Deseja importar {len(df)} linhas? (sim/não): ")
            if resposta.lower() in ['sim', 's', 'yes', 'y', 'ok']:
                importar_clientes(arquivo)
            else:
                print("❌ Importação cancelada")
    else:
        print("❌ Comando inválido. Use 'preview' ou 'import'")

