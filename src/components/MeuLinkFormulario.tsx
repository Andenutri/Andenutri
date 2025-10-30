'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function MeuLinkFormulario() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Gerar nome da URL a partir do email
  function gerarNomeUrl(email: string): string {
    if (!email) return '';
    // Ex: deisefaula@gmail.com -> deise-faula
    const parteLocal = email.split('@')[0];
    // Se tiver pontos, substituir por hífens
    return parteLocal.replace(/\./g, '-').toLowerCase();
  }

  const nomeUrl = user?.email ? gerarNomeUrl(user.email) : '';
  const urlCompleta = typeof window !== 'undefined' 
    ? `${window.location.origin}/formulario/${nomeUrl}`
    : `https://andenutri.com/formulario/${nomeUrl}`;

  function copiarLink() {
    navigator.clipboard.writeText(urlCompleta).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!user?.email) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔗 Meu Link do Formulário</h2>
          <p className="text-gray-600 text-sm">
            Compartilhe este link para receber formulários de clientes
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📋</span>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Seu link único:</p>
            <code className="text-sm text-blue-700 break-all font-mono">
              {urlCompleta}
            </code>
          </div>
        </div>
        
        <button
          onClick={copiarLink}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copied ? '✅ Link Copiado!' : '📋 Copiar Link'}
        </button>
      </div>

      <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold text-yellow-800 mb-2">💡 Como usar:</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>Copie o link acima</li>
          <li>Compartilhe no WhatsApp, Instagram ou onde preferir</li>
          <li>Quando um cliente preencher, os dados aparecerão automaticamente na sua lista de clientes</li>
        </ul>
      </div>
    </div>
  );
}

