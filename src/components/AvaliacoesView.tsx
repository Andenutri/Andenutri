'use client';

import { useState, useEffect } from 'react';
import AvaliacaoEmocionalModal from './AvaliacaoEmocionalModal';
import { getAllClientes, getClientesParaAvaliar, ClienteComFormulario } from '@/data/mockClientes';

interface Avaliacao {
  id: string;
  cliente_nome: string;
  data_avaliacao: string;
}

export default function AvaliacoesView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [showModalEmocional, setShowModalEmocional] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteComFormulario | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  
  useEffect(() => {
    // Carregar avaliações salvas do localStorage
    if (typeof window !== 'undefined') {
      const avaliacoesSalvas = JSON.parse(localStorage.getItem('avaliacoes_emocionais') || '[]');
      setAvaliacoes(avaliacoesSalvas);
    }
  }, [showModalEmocional]); // Recarregar quando o modal fechar
  
  const clientes = getAllClientes();
  const clientesParaAvaliar = getClientesParaAvaliar();
  
  const abrirAvaliacaoEmocional = (cliente: ClienteComFormulario) => {
    setClienteSelecionado(cliente);
    setShowModalEmocional(true);
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div className="ml-24">
          <h1 className="text-3xl font-bold text-amber-700">📏 Avaliações de Bem-Estar</h1>
          <p className="text-gray-600 mt-1">Sistema completo de avaliação física e acompanhamento</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Clientes Aguardando Avaliação */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">⏰ Clientes Aguardando Avaliação</h2>
            <p className="text-gray-600 mb-6">
              {clientesParaAvaliar.length} clientes preencheram o formulário de pré-consulta e aguardam avaliação emocional
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientesParaAvaliar.map((cliente) => (
                <div key={cliente.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-bold text-gray-800 text-lg">{cliente.nome}</div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Aguardando
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📧 {cliente.email}</p>
                    <p>📱 {cliente.whatsapp}</p>
                    {cliente.formulario && (
                      <>
                        <p>⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
                        <p>📍 {cliente.formulario.idade} anos, {cliente.formulario.altura}cm</p>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => abrirAvaliacaoEmocional(cliente)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
                  >
                    💚 Iniciar Avaliação Emocional
                  </button>
                </div>
              ))}
              
              {clientesParaAvaliar.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-lg">Todos os clientes foram avaliados!</p>
                </div>
              )}
            </div>
          </div>

          {/* Histórico de Avaliações */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">📊 Histórico de Avaliações</h2>
            
            {avaliacoes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p>Nenhuma avaliação registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao, index) => {
                  const dataFormatada = new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR');
                  return (
                    <div key={index} className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💚</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-lg">{avaliacao.cliente_nome}</span>
                            <p className="text-sm text-gray-600">{dataFormatada}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                            ✅ Concluída
                          </span>
                        </div>
                      </div>
                      
                      {avaliacao.historia_pessoa && (
                        <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">📖 História</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{avaliacao.historia_pessoa}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Avaliação Emocional */}
      {showModalEmocional && (
        <AvaliacaoEmocionalModal
          isOpen={showModalEmocional}
          onClose={() => {
            setShowModalEmocional(false);
            setClienteSelecionado(null);
          }}
          cliente={clienteSelecionado}
        />
      )}
    </div>
  );
}

