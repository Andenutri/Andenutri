'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';

interface LinkReavaliacaoClienteProps {
  cliente: ClienteComFormulario | null;
}

export default function LinkReavaliacaoCliente({ cliente }: LinkReavaliacaoClienteProps) {
  const [copied, setCopied] = useState(false);
  const [codigo, setCodigo] = useState<string>('');

  useEffect(() => {
    if (cliente?.codigo_reavaliacao) {
      setCodigo(cliente.codigo_reavaliacao);
    } else if (cliente?.id) {
      // Se não tem código, usar parte do ID como fallback temporário
      setCodigo(cliente.id.substring(0, 8).toUpperCase());
    }
  }, [cliente]);

  function getUrlReavaliacao(codigoReavaliacao: string): string {
    if (typeof window === 'undefined') {
      return `https://andenutri.com/reavaliacao/${codigoReavaliacao}`;
    }
    return `${window.location.origin}/reavaliacao/${codigoReavaliacao}`;
  }

  function copiarLink() {
    if (codigo) {
      const url = getUrlReavaliacao(codigo);
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  if (!cliente) return null;

  const url = codigo ? getUrlReavaliacao(codigo) : '';

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
      <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        Link de Reavaliação
      </h3>
      
      {codigo ? (
        <>
          <div className="bg-white rounded-lg p-3 mb-3 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <code className="flex-1 text-sm text-gray-700 break-all font-mono">
                {url}
              </code>
            </div>
            <p className="text-xs text-gray-600">
              Código: <span className="font-semibold">{codigo}</span>
            </p>
          </div>
          
          <button
            onClick={copiarLink}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {copied ? '✅ Link Copiado!' : '📋 Copiar Link de Reavaliação'}
          </button>
          
          <p className="text-xs text-gray-600 mt-3">
            💡 Envie este link para {cliente.nome} preencher antes da consulta.
          </p>
        </>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">
            ⚠️ Código de reavaliação não encontrado. Execute o script SQL para gerar códigos.
          </p>
        </div>
      )}
    </div>
  );
}

