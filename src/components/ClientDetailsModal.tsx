'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function ClientDetailsModal({ isOpen, onClose, cliente }: ClientDetailsModalProps) {
  const [sectionsExpanded, setSectionsExpanded] = useState({
    basicas: true,
    preconsulta: true,
    avaliacaoFisica: false,
    avaliacaoEmocional: false,
    reavaliacoes: false,
    historico: false,
  });

  const [showEditClientModal, setShowEditClientModal] = useState(false);

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen || !cliente) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-amber-700">Detalhes do Cliente</h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Informações Básicas */}
            <div className="border-2 border-amber-100 rounded-xl bg-amber-50">
              <button
                onClick={() => toggleSection('basicas')}
                className="w-full flex items-center justify-between p-4 font-bold text-amber-800 hover:bg-amber-100 transition-colors rounded-xl"
              >
                <h3>📋 Informações Básicas</h3>
                <span className="text-2xl">{sectionsExpanded.basicas ? '−' : '+'}</span>
              </button>
              
              {sectionsExpanded.basicas && (
                <div className="p-4 border-t border-amber-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Nome:</strong> {cliente.nome}</div>
                    <div><strong>Email:</strong> {cliente.email}</div>
                    <div><strong>Telefone:</strong> {cliente.telefone}</div>
                    <div><strong>WhatsApp:</strong> {cliente.whatsapp}</div>
                    {cliente.instagram && (
                      <div><strong>Instagram:</strong> {cliente.instagram}</div>
                    )}
                    <div>
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        cliente.status_plano === 'ativo' ? 'bg-green-100 text-green-700' :
                        cliente.status_plano === 'inativo' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {cliente.status_plano}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dados da Pré-Consulta */}
            {cliente.formulario && (
              <div className="border-2 border-blue-100 rounded-xl bg-blue-50">
                <button
                  onClick={() => toggleSection('preconsulta')}
                  className="w-full flex items-center justify-between p-4 font-bold text-blue-800 hover:bg-blue-100 transition-colors rounded-xl"
                >
                  <h3>📝 Dados da Pré-Consulta</h3>
                  <span className="text-2xl">{sectionsExpanded.preconsulta ? '−' : '+'}</span>
                </button>
                
                {sectionsExpanded.preconsulta && (
                  <div className="p-4 border-t border-blue-200 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Nome Completo:</strong> {cliente.formulario.nome_completo}</div>
                      <div><strong>Idade:</strong> {cliente.formulario.idade} anos</div>
                      <div><strong>Altura:</strong> {cliente.formulario.altura} cm</div>
                      <div><strong>Peso Atual:</strong> {cliente.formulario.peso_atual} kg</div>
                      <div><strong>Peso Desejado:</strong> {cliente.formulario.peso_desejado} kg</div>
                      <div className="col-span-2"><strong>Endereço:</strong> {cliente.formulario.endereco_completo}</div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Rotina Alimentar</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Café da Manhã:</strong> {cliente.formulario.cafe_manha}</p>
                        <p><strong>Almoço:</strong> {cliente.formulario.almoco}</p>
                        <p><strong>Jantar:</strong> {cliente.formulario.jantar}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Avaliação Física */}
            <div className="border-2 border-green-100 rounded-xl bg-green-50">
              <button
                onClick={() => toggleSection('avaliacaoFisica')}
                className="w-full flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
              >
                <h3>📏 Avaliação Física</h3>
                <span className="text-2xl">{sectionsExpanded.avaliacaoFisica ? '−' : '+'}</span>
              </button>
              
              {sectionsExpanded.avaliacaoFisica && (
                <div className="p-4 border-t border-green-200">
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-4xl mb-2">📏</div>
                    <p>Nenhuma avaliação física registrada ainda</p>
                  </div>
                </div>
              )}
            </div>

            {/* Avaliação Emocional */}
            <div className="border-2 border-purple-100 rounded-xl bg-purple-50">
              <button
                onClick={() => toggleSection('avaliacaoEmocional')}
                className="w-full flex items-center justify-between p-4 font-bold text-purple-800 hover:bg-purple-100 transition-colors rounded-xl"
              >
                <h3>💚 Avaliação Emocional</h3>
                <span className="text-2xl">{sectionsExpanded.avaliacaoEmocional ? '−' : '+'}</span>
              </button>
              
              {sectionsExpanded.avaliacaoEmocional && (
                <div className="p-4 border-t border-purple-200">
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-4xl mb-2">💚</div>
                    <p>Nenhuma avaliação emocional registrada ainda</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reavaliações */}
            <div className="border-2 border-indigo-100 rounded-xl bg-indigo-50">
              <button
                onClick={() => toggleSection('reavaliacoes')}
                className="w-full flex items-center justify-between p-4 font-bold text-indigo-800 hover:bg-indigo-100 transition-colors rounded-xl"
              >
                <h3>🔄 Histórico de Reavaliações</h3>
                <span className="text-2xl">{sectionsExpanded.reavaliacoes ? '−' : '+'}</span>
              </button>
              
              {sectionsExpanded.reavaliacoes && (
                <div className="p-4 border-t border-indigo-200">
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Nenhuma reavaliação registrada ainda</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  setShowEditClientModal(true);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg"
              >
                ✏️ Editar Cliente
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditClientModal && (
        <AddClientModal
          isOpen={showEditClientModal}
          onClose={() => {
            setShowEditClientModal(false);
          }}
          clienteParaEditar={cliente}
        />
      )}
    </>
  );
}

