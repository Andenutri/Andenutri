'use client';

import { useState } from 'react';
import AvaliacaoEmocionalModal from './AvaliacaoEmocionalModal';
import { getAllClientes, getClientesParaAvaliar, ClienteComFormulario } from '@/data/mockClientes';

interface Avaliacao {
  id: string;
  cliente: string;
  data: string;
}

export default function AvaliacoesView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [showModalEmocional, setShowModalEmocional] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteComFormulario | null>(null);
  const [avaliacoes] = useState<Avaliacao[]>([]);
  
  const clientes = getAllClientes();
  const clientesParaAvaliar = getClientesParaAvaliar();
  
  const abrirAvaliacaoEmocional = (cliente: ClienteComFormulario) => {
    setClienteSelecionado(cliente);
    setShowModalEmocional(true);
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div>
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
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{avaliacao.cliente}</span>
                      <span className="text-sm text-gray-600">{avaliacao.data}</span>
                    </div>
                  </div>
                ))}
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

