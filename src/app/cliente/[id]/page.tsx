'use client';

import { useState } from 'react';
import { getAllClientes } from '@/data/mockClientes';
import ClientDetailsModal from '@/components/ClientDetailsModal';
import AvaliacaoFisicaEditavel from '@/components/AvaliacaoFisicaEditavel';

export default function ClientePage({ params }: { params: { id: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allClientes = getAllClientes();
  const cliente = allClientes.find(c => c.id === params.id);

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cliente não encontrado</h1>
          <p className="text-gray-600">O cliente que você está procurando não existe.</p>
          <a href="/" className="inline-block mt-4 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">👤 {cliente.nome}</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              📧 {cliente.email} • 📱 {cliente.whatsapp}
            </p>
          </div>
          <a 
            href="/clientes"
            className="px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base"
          >
            ← Voltar
          </a>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Card de visão geral */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {cliente.formulario && (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-blue-700">
                      {cliente.formulario.peso_atual}kg
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">Peso Atual</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-green-700">
                      {cliente.formulario.peso_desejado}kg
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">Meta</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-purple-700">
                      {cliente.formulario.peso_atual - cliente.formulario.peso_desejado < 0 
                        ? 'Meta atingida! 🎉' 
                        : `${Math.abs(cliente.formulario.peso_atual - cliente.formulario.peso_desejado)}kg`}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">Diferença</div>
                  </div>
                </>
              )}
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className={`text-sm md:text-base font-bold px-3 py-1 rounded-full inline-block ${
                  cliente.status_plano === 'ativo' ? 'bg-green-100 text-green-700' :
                  cliente.status_plano === 'inativo' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {cliente.status_plano === 'ativo' ? '🟢 Ativo' : cliente.status_plano === 'inativo' ? '🔴 Inativo' : '🟡 Pausado'}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-2">Status</div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
            >
              📋 Ver Todos os Dados
            </button>
            <button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
            >
              ➕ Nova Reavaliação
            </button>
            <button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
            >
              📊 Planilha de Evolução
            </button>
            <a
              href="/trello"
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base flex items-center justify-center text-center"
            >
              📋 Trello Board
            </a>
          </div>

          {/* Avaliação Física Editável */}
          <div className="mb-6">
            <AvaliacaoFisicaEditavel cliente={cliente} />
          </div>

          {/* Informações rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Próximas Ações</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Reavaliação</div>
                    <div className="text-sm text-gray-600">20/02/2025</div>
                  </div>
                  <span className="text-2xl">📏</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Consulta de Acompanhamento</div>
                    <div className="text-sm text-gray-600">27/02/2025</div>
                  </div>
                  <span className="text-2xl">💊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Resumo</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">Avaliações realizadas:</span>
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">Protocolo:</span>
                  <span className="font-bold text-green-600">Mudança Gradual</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">Formulário:</span>
                  <span className="font-bold text-purple-600">✓ Preenchido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal completo de dados */}
      {isModalOpen && (
        <ClientDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cliente={cliente}
        />
      )}
    </div>
  );
}

