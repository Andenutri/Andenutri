'use client';

import { useState, useEffect } from 'react';
import { 
  getMeusLinks, 
  criarNovoLink, 
  atualizarLink, 
  deletarLink, 
  getUrlFormulario,
  type LinkFormulario 
} from '@/data/linksFormulariosData';
import { useAuth } from '@/contexts/AuthContext';

export default function GerenciarLinksFormulario() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkFormulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    carregarLinks();
  }, []);

  async function carregarLinks() {
    setLoading(true);
    const meusLinks = await getMeusLinks();
    setLinks(meusLinks);
    setLoading(false);
  }

  async function handleCriarLink() {
    setCreating(true);
    const novoLink = await criarNovoLink(user?.email || undefined);
    
    if (novoLink) {
      await carregarLinks();
      // Copiar automaticamente o primeiro link
      if (links.length === 0 && novoLink.codigo) {
        copiarLink(novoLink.codigo, 0);
      }
    } else {
      alert('❌ Erro ao criar link. Tente novamente.');
    }
    setCreating(false);
  }

  async function handleToggleAtivo(link: LinkFormulario) {
    const sucesso = await atualizarLink(link.id, { ativo: !link.ativo });
    
    if (sucesso) {
      await carregarLinks();
    } else {
      alert('❌ Erro ao atualizar link.');
    }
  }

  async function handleDeletarLink(id: string) {
    if (!confirm('Tem certeza que deseja deletar este link?')) {
      return;
    }

    const sucesso = await deletarLink(id);
    
    if (sucesso) {
      await carregarLinks();
    } else {
      alert('❌ Erro ao deletar link.');
    }
  }

  function copiarLink(codigo: string, index: number) {
    const url = getUrlFormulario(codigo);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔗 Links do Formulário</h2>
          <p className="text-gray-600 mt-1">
            Crie e compartilhe links únicos para clientes preencherem seus dados
          </p>
        </div>
        <button
          onClick={handleCriarLink}
          disabled={creating}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold disabled:opacity-50"
        >
          {creating ? '⏳ Criando...' : '➕ Criar Novo Link'}
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum link criado ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Crie seu primeiro link para começar a receber formulários de clientes
          </p>
          <button
            onClick={handleCriarLink}
            disabled={creating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {creating ? '⏳ Criando...' : '➕ Criar Primeiro Link'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => {
            const url = getUrlFormulario(link.codigo);
            const estaCopiado = copiedIndex === index;

            return (
              <div
                key={link.id}
                className={`border-2 rounded-lg p-4 ${
                  link.ativo 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔗</span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          Código: <span className="text-blue-600">{link.codigo}</span>
                        </h3>
                        <p className="text-sm text-gray-600">
                          {link.nutricionista_nome || user?.email || 'Sem nome'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          link.ativo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {link.ativo ? '✅ Ativo' : '⏸️ Inativo'}
                      </span>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-3 border-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-gray-700 break-all">
                          {url}
                        </code>
                        <button
                          onClick={() => copiarLink(link.codigo, index)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            estaCopiado
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {estaCopiado ? '✅ Copiado!' : '📋 Copiar Link'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <div className="text-gray-600">Total de Formulários</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {link.total_submissoes}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <div className="text-gray-600">Criado em</div>
                        <div className="font-semibold text-gray-800">
                          {new Date(link.criado_em).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <div className="text-gray-600">Status</div>
                        <div className="font-semibold">
                          {link.ativo ? (
                            <span className="text-green-600">Recebendo</span>
                          ) : (
                            <span className="text-gray-500">Pausado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleToggleAtivo(link)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        link.ativo
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {link.ativo ? '⏸️ Pausar' : '▶️ Ativar'}
                    </button>
                    <button
                      onClick={() => handleDeletarLink(link.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-semibold"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>

                {/* QR Code Placeholder - pode adicionar depois */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    💡 Dica: Compartilhe este link no WhatsApp, Instagram ou site para receber novos clientes!
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-700 mb-2">📖 Como usar:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Crie um novo link clicando em "Criar Novo Link"</li>
          <li>Copie o link gerado</li>
          <li>Compartilhe o link com seus clientes (WhatsApp, Instagram, email, etc.)</li>
          <li>Quando um cliente preencher o formulário, os dados aparecerão automaticamente no seu dashboard</li>
          <li>Você pode pausar ou reativar links a qualquer momento</li>
        </ol>
      </div>
    </div>
  );
}

