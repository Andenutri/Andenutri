'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';
import ReavaliacaoModal from './ReavaliacaoModal';
import PlalhaEvolucaoModal from './PlalhaEvolucaoModal';
import EditarInformacoesBasicasModal from './EditarInformacoesBasicasModal';
import EditarPreConsultaModal from './EditarPreConsultaModal';
import EditarAvaliacaoFisicaModal from './EditarAvaliacaoFisicaModal';
import EditarAvaliacaoEmocionalModal from './EditarAvaliacaoEmocionalModal';
import AvaliacaoFisicaEditavel from './AvaliacaoFisicaEditavel';
import LinkReavaliacaoCliente from './LinkReavaliacaoCliente';
import { getReavaliacoesCliente, type ReavaliacaoResposta } from '@/data/reavaliacoesData';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function ClientDetailsModal({ isOpen, onClose, cliente }: ClientDetailsModalProps) {
  const [sectionsExpanded, setSectionsExpanded] = useState({
    basicas: true, // Mantém aberta por padrão
    preconsulta: false, // Fechada por padrão
    avaliacaoFisica: false, // Fechada por padrão
    avaliacaoEmocional: false, // Fechada por padrão
    reavaliacoes: false,
    historico: false,
  });

  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showReavaliacaoModal, setShowReavaliacaoModal] = useState(false);
  const [showPlalhaEvolucaoModal, setShowPlalhaEvolucaoModal] = useState(false);
  const [showEditarBasicasModal, setShowEditarBasicasModal] = useState(false);
  const [showEditarPreConsultaModal, setShowEditarPreConsultaModal] = useState(false);
  const [showEditarAvaliacaoFisicaModal, setShowEditarAvaliacaoFisicaModal] = useState(false);
  const [showEditarAvaliacaoEmocionalModal, setShowEditarAvaliacaoEmocionalModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<string | null>(null);
  const [reavaliacoes, setReavaliacoes] = useState<ReavaliacaoResposta[]>([]);
  const [loadingReavaliacoes, setLoadingReavaliacoes] = useState(false);

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Carregar reavaliações quando expandir a seção
    if (section === 'reavaliacoes' && !sectionsExpanded.reavaliacoes && cliente) {
      carregarReavaliacoes();
    }
  };

  async function carregarReavaliacoes() {
    if (!cliente) return;
    setLoadingReavaliacoes(true);
    const reavals = await getReavaliacoesCliente(cliente.id);
    setReavaliacoes(reavals);
    setLoadingReavaliacoes(false);
  }

  if (!isOpen || !cliente) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] md:max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center z-10">
            <h2 className="text-xl md:text-2xl font-bold text-amber-700">Detalhes do Cliente</h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-4">
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
                  {/* Bolinhas de Status */}
                  <div className="mb-4 p-3 bg-white rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">🔴 Status de Identificação</div>
                    <div className="flex gap-4 items-center flex-wrap">
                      {/* Status do Programa */}
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${
                          cliente.status_plano === 'ativo' ? 'bg-green-500' :
                          cliente.status_plano === 'inativo' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-semibold">Programa: {cliente.status_plano}</span>
                      </div>
                      {/* Status Herbalife */}
                      {(cliente as any).status_herbalife && (
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${
                            (cliente as any).status_herbalife === 'ativo' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-sm font-semibold">Herbalife: {(cliente as any).status_herbalife}</span>
                        </div>
                      )}
                      {/* Status Lead */}
                      {(cliente as any).is_lead && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-semibold text-purple-700">Lead</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Nome:</strong> {cliente.nome}</div>
                      <div><strong>Email:</strong> {cliente.email || '-'}</div>
                      <div><strong>Telefone:</strong> {cliente.telefone}</div>
                      <div><strong>WhatsApp:</strong> {cliente.whatsapp || '-'}</div>
                      {cliente.instagram && (
                        <div><strong>Instagram:</strong> {cliente.instagram}</div>
                      )}
                      {(cliente as any).endereco_completo && (
                        <div className="col-span-2"><strong>Endereço:</strong> {(cliente as any).endereco_completo}</div>
                      )}
                    </div>
                    {/* Campo Perfil/Descrição */}
                    {(cliente as any).perfil && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-amber-700 mb-2">📝 Perfil/Descrição</h4>
                        <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{(cliente as any).perfil}</p>
                        </div>
                      </div>
                    )}
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
                    onClick={() => setShowEditarPreConsultaModal(true)}
                    className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    title="Editar esta seção"
                  >
                    ✏️ Editar
                  </button>
                </div>
                
                {sectionsExpanded.preconsulta && (
                  <div className="p-4 border-t border-blue-200 space-y-4">
                    {/* Informações Gerais */}
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">🔹 Informações Gerais</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Nome Completo:</strong> {cliente.formulario.nome_completo || '-'}</div>
                        <div><strong>Idade:</strong> {cliente.formulario.idade ? `${cliente.formulario.idade} anos` : '-'}</div>
                        <div><strong>Altura:</strong> {cliente.formulario.altura ? `${cliente.formulario.altura} cm` : '-'}</div>
                        <div><strong>Peso Atual:</strong> {cliente.formulario.peso_atual ? `${cliente.formulario.peso_atual} kg` : '-'}</div>
                        <div><strong>Peso Desejado:</strong> {cliente.formulario.peso_desejado ? `${cliente.formulario.peso_desejado} kg` : '-'}</div>
                        <div><strong>Conheceu por:</strong> {cliente.formulario.conheceu_programa || '-'}</div>
                        <div className="col-span-2"><strong>Endereço:</strong> {cliente.formulario.endereco_completo || '-'}</div>
                        <div><strong>WhatsApp:</strong> {cliente.formulario.whatsapp || '-'}</div>
                        <div><strong>Instagram:</strong> {cliente.formulario.instagram || '-'}</div>
                      </div>
                    </div>

                    {/* Família */}
                    {(cliente.formulario.casada || cliente.formulario.filhos || cliente.formulario.nomes_idades_filhos) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">👨‍👩‍👧‍👦 Família</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>É casada?</strong> {cliente.formulario.casada || '-'}</div>
                          <div><strong>Tem filhos?</strong> {cliente.formulario.filhos || '-'}</div>
                          {cliente.formulario.nomes_idades_filhos && (
                            <div className="col-span-2"><strong>Nomes e Idades dos Filhos:</strong> {cliente.formulario.nomes_idades_filhos}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trabalho e Rotina */}
                    {(cliente.formulario.trabalho || cliente.formulario.horario_trabalho || cliente.formulario.dias_trabalho || cliente.formulario.hora_acorda || cliente.formulario.hora_dorme || cliente.formulario.qualidade_sono) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">💼 Trabalho e Rotina</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Trabalho/Profissão:</strong> {cliente.formulario.trabalho || '-'}</div>
                          <div><strong>Horário Trabalho:</strong> {cliente.formulario.horario_trabalho || '-'}</div>
                          <div><strong>Dias Trabalho:</strong> {cliente.formulario.dias_trabalho || '-'}</div>
                          <div><strong>Hora Acorda:</strong> {cliente.formulario.hora_acorda || '-'}</div>
                          <div><strong>Hora Dorme:</strong> {cliente.formulario.hora_dorme || '-'}</div>
                          <div><strong>Qualidade Sono:</strong> {cliente.formulario.qualidade_sono || '-'}</div>
                        </div>
                      </div>
                    )}

                    {/* Saúde */}
                    {(cliente.formulario.condicao_saude || cliente.formulario.uso_medicacao || cliente.formulario.medicacao_qual || cliente.formulario.restricao_alimentar || cliente.formulario.usa_suplemento || cliente.formulario.quais_suplementos || cliente.formulario.sente_dor || cliente.formulario.onde_dor) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🏥 Saúde</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Condição de Saúde:</strong> {cliente.formulario.condicao_saude || '-'}</div>
                          <div><strong>Usa Medicação?</strong> {cliente.formulario.uso_medicacao || '-'}</div>
                          {cliente.formulario.medicacao_qual && (
                            <div className="col-span-2"><strong>Qual Medicação:</strong> {cliente.formulario.medicacao_qual}</div>
                          )}
                          <div><strong>Restrição Alimentar:</strong> {cliente.formulario.restricao_alimentar || '-'}</div>
                          <div><strong>Usa Suplemento?</strong> {cliente.formulario.usa_suplemento || '-'}</div>
                          {cliente.formulario.quais_suplementos && (
                            <div className="col-span-2"><strong>Quais Suplementos:</strong> {cliente.formulario.quais_suplementos}</div>
                          )}
                          <div><strong>Sente dor ou desconforto?</strong> {cliente.formulario.sente_dor || '-'}</div>
                          <div><strong>Onde sente dor?</strong> {cliente.formulario.onde_dor || '-'}</div>
                        </div>
                      </div>
                    )}

                    {/* Rotina Alimentar */}
                    {(cliente.formulario.cafe_manha || cliente.formulario.lanche_manha || cliente.formulario.almoco || cliente.formulario.lanche_tarde || cliente.formulario.jantar || cliente.formulario.ceia) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🍽️ Rotina Alimentar</h4>
                        <div className="text-sm space-y-2">
                          {cliente.formulario.cafe_manha && <p><strong>Café da Manhã:</strong> {cliente.formulario.cafe_manha}</p>}
                          {cliente.formulario.lanche_manha && <p><strong>Lanche Manhã:</strong> {cliente.formulario.lanche_manha}</p>}
                          {cliente.formulario.almoco && <p><strong>Almoço:</strong> {cliente.formulario.almoco}</p>}
                          {cliente.formulario.lanche_tarde && <p><strong>Lanche Tarde:</strong> {cliente.formulario.lanche_tarde}</p>}
                          {cliente.formulario.jantar && <p><strong>Jantar:</strong> {cliente.formulario.jantar}</p>}
                          {cliente.formulario.ceia && <p><strong>Ceia:</strong> {cliente.formulario.ceia}</p>}
                        </div>
                      </div>
                    )}

                    {/* Hábitos e Comportamentos */}
                    {(cliente.formulario.alcool_freq || cliente.formulario.consumo_agua || cliente.formulario.intestino_vezes_semana || cliente.formulario.atividade_fisica || cliente.formulario.refeicao_dificil || cliente.formulario.belisca_quando || cliente.formulario.muda_fins_semana || cliente.formulario.escala_cuidado) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🧠 Hábitos e Comportamentos</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {cliente.formulario.alcool_freq && <div><strong>Álcool/Refrigerante:</strong> {cliente.formulario.alcool_freq}</div>}
                          {cliente.formulario.consumo_agua && <div><strong>Consumo de Água:</strong> {cliente.formulario.consumo_agua}</div>}
                          {cliente.formulario.intestino_vezes_semana && <div><strong>Intestino (vezes/semana):</strong> {cliente.formulario.intestino_vezes_semana}</div>}
                          {cliente.formulario.atividade_fisica && <div><strong>Atividade Física:</strong> {cliente.formulario.atividade_fisica}</div>}
                          {cliente.formulario.refeicao_dificil && <div><strong>Refeição Mais Difícil:</strong> {cliente.formulario.refeicao_dificil}</div>}
                          {cliente.formulario.belisca_quando && <div><strong>Belisca Quando:</strong> {cliente.formulario.belisca_quando}</div>}
                          {cliente.formulario.muda_fins_semana && <div><strong>Muda nos Fins de Semana:</strong> {cliente.formulario.muda_fins_semana}</div>}
                          {cliente.formulario.escala_cuidado && <div><strong>Escala de Cuidado (0-10):</strong> {cliente.formulario.escala_cuidado}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Link de Reavaliação */}
            <div className="border-2 border-green-200 rounded-xl bg-green-50 p-4">
              <LinkReavaliacaoCliente cliente={cliente} />
            </div>

            {/* Reavaliações Preenchidas */}
            <div className="border-2 border-green-100 rounded-xl bg-green-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('reavaliacoes')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
                >
                  <h3>📋 Reavaliações Preenchidas</h3>
                  <span className="text-2xl">{sectionsExpanded.reavaliacoes ? '−' : '+'}</span>
                </button>
              </div>
              
              {sectionsExpanded.reavaliacoes && (
                <div className="p-4 border-t border-green-200">
                  {loadingReavaliacoes ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Carregando reavaliações...</p>
                    </div>
                  ) : reavaliacoes.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-green-300">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-gray-600">Nenhuma reavaliação preenchida ainda</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Compartilhe o link acima com {cliente.nome}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reavaliacoes.map((reaval, index) => (
                        <div key={reaval.id || index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-3 pb-3 border-b">
                            <h4 className="font-semibold text-green-700">
                              Reavaliação #{reavaliacoes.length - index}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {reaval.data_preenchimento 
                                ? new Date(reaval.data_preenchimento).toLocaleDateString('pt-BR')
                                : 'Data não disponível'}
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            {reaval.peso_atual && (
                              <div>
                                <strong className="text-gray-700">⚖️ Peso atual:</strong>
                                <p className="text-gray-600 ml-2">{reaval.peso_atual}</p>
                              </div>
                            )}
                            {reaval.mudancas_corpo_disposicao && (
                              <div>
                                <strong className="text-gray-700">💪 Mudanças percebidas:</strong>
                                <p className="text-gray-600 ml-2">{reaval.mudancas_corpo_disposicao}</p>
                              </div>
                            )}
                            {reaval.energia_dia && (
                              <div>
                                <strong className="text-gray-700">⚡ Energia:</strong>
                                <p className="text-gray-600 ml-2">{reaval.energia_dia}</p>
                              </div>
                            )}
                            {reaval.intestino_sono && (
                              <div>
                                <strong className="text-gray-700">😴 Intestino e sono:</strong>
                                <p className="text-gray-600 ml-2">{reaval.intestino_sono}</p>
                              </div>
                            )}
                            {reaval.rotina_alimentacao_organizada && (
                              <div>
                                <strong className="text-gray-700">🍽️ Rotina alimentar:</strong>
                                <p className="text-gray-600 ml-2">{reaval.rotina_alimentacao_organizada}</p>
                              </div>
                            )}
                            {reaval.o_que_ajudou && (
                              <div>
                                <strong className="text-gray-700">✅ O que ajudou:</strong>
                                <p className="text-gray-600 ml-2">{reaval.o_que_ajudou}</p>
                              </div>
                            )}
                            {reaval.o_que_atrapalhou && (
                              <div>
                                <strong className="text-gray-700">⚠️ O que atrapalhou:</strong>
                                <p className="text-gray-600 ml-2">{reaval.o_que_atrapalhou}</p>
                              </div>
                            )}
                            {reaval.maior_foco_nova_fase && (
                              <div>
                                <strong className="text-gray-700">🎯 Foco para nova fase:</strong>
                                <p className="text-gray-600 ml-2">{reaval.maior_foco_nova_fase}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avaliação Física Editável */}
            <div className="border-2 border-green-100 rounded-xl bg-green-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('avaliacaoFisica')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
                >
                  <h3>💪 Avaliação Física</h3>
                  <span className="text-2xl">{sectionsExpanded.avaliacaoFisica ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowEditarAvaliacaoFisicaModal(true)}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.avaliacaoFisica && (
                <div className="border-t border-green-200">
                  <AvaliacaoFisicaEditavel cliente={cliente} />
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
                  onClick={() => setShowEditarAvaliacaoEmocionalModal(true)}
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
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  setShowPlalhaEvolucaoModal(true);
                }}
                className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
              >
                📊 Planilha de Evolução
              </button>
              <button
                onClick={() => {
                  onClose();
                  setShowEditClientModal(true);
                }}
                className="w-full sm:flex-1 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
              >
                ✏️ Editar Cliente
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
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
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Pré-Consulta */}
      {showEditarPreConsultaModal && (
        <EditarPreConsultaModal
          isOpen={showEditarPreConsultaModal}
          onClose={() => {
            setShowEditarPreConsultaModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Avaliação Física */}
      {showEditarAvaliacaoFisicaModal && (
        <EditarAvaliacaoFisicaModal
          isOpen={showEditarAvaliacaoFisicaModal}
          onClose={() => {
            setShowEditarAvaliacaoFisicaModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Avaliação Emocional */}
      {showEditarAvaliacaoEmocionalModal && (
        <EditarAvaliacaoEmocionalModal
          isOpen={showEditarAvaliacaoEmocionalModal}
          onClose={() => {
            setShowEditarAvaliacaoEmocionalModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}
    </>
  );
}

