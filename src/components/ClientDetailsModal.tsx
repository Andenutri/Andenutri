'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';
import ReavaliacaoModal from './ReavaliacaoModal';
import PlalhaEvolucaoModal from './PlalhaEvolucaoModal';
import EditarInformacoesBasicasModal from './EditarInformacoesBasicasModal';

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
  const [showReavaliacaoModal, setShowReavaliacaoModal] = useState(false);
  const [showPlalhaEvolucaoModal, setShowPlalhaEvolucaoModal] = useState(false);
  const [showEditarBasicasModal, setShowEditarBasicasModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<string | null>(null);

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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('basicas')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-amber-800 hover:bg-amber-100 transition-colors rounded-xl"
                >
                  <h3>📋 Informações Básicas</h3>
                  <span className="text-2xl">{sectionsExpanded.basicas ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowEditarBasicasModal(true)}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSection('preconsulta')}
                    className="flex-1 flex items-center justify-between p-4 font-bold text-blue-800 hover:bg-blue-100 transition-colors rounded-xl"
                  >
                    <h3>📝 Dados da Pré-Consulta</h3>
                    <span className="text-2xl">{sectionsExpanded.preconsulta ? '−' : '+'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSectionToEdit('preconsulta');
                      setShowEditClientModal(true);
                    }}
                    className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    title="Editar esta seção"
                  >
                    ✏️ Editar
                  </button>
                </div>
                
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('avaliacaoFisica')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
                >
                  <h3>📏 Avaliação Física</h3>
                  <span className="text-2xl">{sectionsExpanded.avaliacaoFisica ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => {
                    setSectionToEdit('avaliacaoFisica');
                    setShowEditClientModal(true);
                  }}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.avaliacaoFisica && (
                <div className="p-4 border-t border-green-200">
                  {/* Dados Mock - Avaliação Física */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-700">📏 Avaliação Inicial - 15/01/2025</h4>
                        <span className="text-xs text-gray-500">Inicial</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Peso:</span>
                          <p className="font-bold text-green-700">75kg</p>
                        </div>
                        <div>
                          <span className="text-gray-600">IMC:</span>
                          <p className="font-bold text-green-700">26.2</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cintura:</span>
                          <p className="font-bold text-green-700">88cm</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Quadril:</span>
                          <p className="font-bold text-green-700">102cm</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Braço:</span>
                          <p className="font-bold text-green-700">32cm</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Coxa:</span>
                          <p className="font-bold text-green-700">58cm</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs text-gray-500">📸 4 fotos anexadas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Avaliação Emocional */}
            <div className="border-2 border-purple-100 rounded-xl bg-purple-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('avaliacaoEmocional')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-purple-800 hover:bg-purple-100 transition-colors rounded-xl"
                >
                  <h3>💚 Avaliação Emocional</h3>
                  <span className="text-2xl">{sectionsExpanded.avaliacaoEmocional ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => {
                    setSectionToEdit('avaliacaoEmocional');
                    setShowEditClientModal(true);
                  }}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.avaliacaoEmocional && (
                <div className="p-4 border-t border-purple-200">
                  {/* Dados Mock - Avaliação Emocional */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-700">💚 Avaliação Emocional - 20/01/2025</h4>
                        <span className="text-xs text-gray-500">Realizada</span>
                      </div>
                      
                      {/* História da Pessoa */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">📖 História</h5>
                        <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                          "Cliente motivada para mudança após se sentir desconfortável em situações sociais. Histórico de tentativas anteriores frustradas. Mãe de dois filhos, buscando melhor qualidade de vida e autoestima."
                        </p>
                      </div>

                      {/* Respostas do Bloco Emocional */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">🌸 Bloco Emocional</h5>
                        <div className="space-y-2 text-sm">
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Momento de mudança:</span>
                            <p className="text-gray-600">"Depois de ver fotos em um evento familiar"</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Nível de comprometimento:</span>
                            <p className="text-gray-600">9/10</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Maior medo:</span>
                            <p className="text-gray-600">"Não conseguir manter a mudança"</p>
                          </div>
                        </div>
                      </div>

                      {/* Respostas do Bloco Comportamental */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">🌿 Bloco Comportamental</h5>
                        <div className="space-y-2 text-sm">
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Ponto fraco alimentação:</span>
                            <p className="text-gray-600">"Doces e ansiedade noturna"</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Come por:</span>
                            <p className="text-gray-600">"Principalmente por emoção (tédio e estresse)"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reavaliações */}
            <div className="border-2 border-indigo-100 rounded-xl bg-indigo-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('reavaliacoes')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-indigo-800 hover:bg-indigo-100 transition-colors rounded-xl"
                >
                  <h3>🔄 Histórico de Reavaliações</h3>
                  <span className="text-2xl">{sectionsExpanded.reavaliacoes ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowReavaliacaoModal(true)}
                  className="mx-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                  title="Adicionar nova reavaliação"
                >
                  ➕ Nova Reavaliação
                </button>
              </div>
              
              {sectionsExpanded.reavaliacoes && (
                <div className="p-4 border-t border-indigo-200">
                  {/* Dados Mock - Reavaliações */}
                  <div className="space-y-4">
                    {/* Reavaliação 1 */}
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-indigo-700">📏 1ª Reavaliação - 15/02/2025</h4>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Progresso</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Peso:</span>
                          <p className="font-bold text-indigo-700">73kg <span className="text-green-600 text-xs">(-2kg)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">IMC:</span>
                          <p className="font-bold text-indigo-700">25.5 <span className="text-green-600 text-xs">(-0.7)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Cintura:</span>
                          <p className="font-bold text-indigo-700">85cm <span className="text-green-600 text-xs">(-3cm)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Quadril:</span>
                          <p className="font-bold text-indigo-700">99cm <span className="text-green-600 text-xs">(-3cm)</span></p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">📝 Observações: "Cliente seguindo protocolo corretamente, aderência 95%"</p>
                      </div>
                    </div>

                    {/* Reavaliação 2 */}
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-indigo-700">📏 2ª Reavaliação - 15/03/2025</h4>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Meta próxima</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Peso:</span>
                          <p className="font-bold text-indigo-700">70kg <span className="text-green-600 text-xs">(-5kg total)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">IMC:</span>
                          <p className="font-bold text-indigo-700">24.4 <span className="text-green-600 text-xs">(-1.8)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Cintura:</span>
                          <p className="font-bold text-indigo-700">82cm <span className="text-green-600 text-xs">(-6cm)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Quadril:</span>
                          <p className="font-bold text-indigo-700">96cm <span className="text-green-600 text-xs">(-6cm)</span></p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">🎯 Meta: "Apenas 3kg para o peso desejado!"</p>
                        <p className="text-xs text-gray-600">📝 Observações: "Muito motivada, sentindo-se mais confiante"</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  setShowPlalhaEvolucaoModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg"
              >
                📊 Planilha de Evolução
              </button>
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
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
            setSectionToEdit(null);
          }}
          clienteParaEditar={cliente}
          defaultSection={sectionToEdit}
        />
      )}

      {/* Modal de Reavaliação */}
      {showReavaliacaoModal && (
        <ReavaliacaoModal
          isOpen={showReavaliacaoModal}
          onClose={() => {
            setShowReavaliacaoModal(false);
          }}
          clienteId={cliente?.id || ''}
          clienteNome={cliente?.nome || ''}
        />
      )}

      {/* Modal de Planilha de Evolução */}
      {showPlalhaEvolucaoModal && (
        <PlalhaEvolucaoModal
          isOpen={showPlalhaEvolucaoModal}
          onClose={() => {
            setShowPlalhaEvolucaoModal(false);
          }}
          clienteId={cliente?.id || ''}
          clienteNome={cliente?.nome || ''}
        />
      )}

      {/* Modal de Editar Informações Básicas */}
      {showEditarBasicasModal && (
        <EditarInformacoesBasicasModal
          isOpen={showEditarBasicasModal}
          onClose={() => {
            setShowEditarBasicasModal(false);
            // Recarregar dados do cliente após edição
            if (cliente?.id) {
              // TODO: Recarregar dados do Supabase/localStorage
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}
    </>
  );
}

