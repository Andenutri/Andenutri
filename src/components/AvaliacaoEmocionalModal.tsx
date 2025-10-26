'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';

interface AvaliacaoEmocionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function AvaliacaoEmocionalModal({ isOpen, onClose, cliente }: AvaliacaoEmocionalModalProps) {
  const [dadosFormulario, setDadosFormulario] = useState(cliente?.formulario || {} as any);

  useEffect(() => {
    if (cliente?.formulario) {
      setDadosFormulario(cliente.formulario);
    }
  }, [cliente]);
  
  const [blocoEmocional, setBlocoEmocional] = useState({
    momento_mudanca: '',
    incomoda_espelho: '',
    situacao_corpo: '',
    atrapalha_dia_dia: '',
    maior_medo: '',
    por_que_eliminar_kilos: '',
    tentou_antes: '',
    oque_fara_peso_desejado: '',
    tres_motivos: '',
    nivel_comprometimento: '0',
    conselho_si: '',
  });

  const [historiaPessoa, setHistoriaPessoa] = useState('');
  
  const [blocoComportamental, setBlocoComportamental] = useState({
    ponto_fraco_alimentacao: '',
    organizada_ou_improvisa: '',
    come_por_que: '',
    momentos_dificeis: '',
    prazer_alem_comida: '',
    premia_com_comida: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-amber-700">💚 Avaliação Emocional e Motivacional</h2>
            <p className="text-sm text-gray-600">
              Cliente: {cliente?.nome || 'Selecione um cliente'}
              {cliente && (
                <span className="ml-2 text-xs text-purple-600">
                  • {cliente.formulario?.peso_atual}kg → {cliente.formulario?.peso_desejado}kg
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dados da Pré-Consulta (Editável) */}
          {cliente && cliente.formulario && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-700 mb-4">📋 Dados da Pré-Consulta (Editável)</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input 
                      type="text"
                      value={dadosFormulario.nome_completo || ''}
                      onChange={(e) => setDadosFormulario({...dadosFormulario, nome_completo: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Idade</label>
                    <input 
                      type="text"
                      value={dadosFormulario.idade || ''}
                      onChange={(e) => setDadosFormulario({...dadosFormulario, idade: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Peso Atual (kg)</label>
                    <input 
                      type="text"
                      value={dadosFormulario.peso_atual || ''}
                      onChange={(e) => setDadosFormulario({...dadosFormulario, peso_atual: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Peso Desejado (kg)</label>
                    <input 
                      type="text"
                      value={dadosFormulario.peso_desejado || ''}
                      onChange={(e) => setDadosFormulario({...dadosFormulario, peso_desejado: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* História */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">📖 História</h2>
            <p className="text-sm text-purple-600 mb-4">
              Escreva toda a história da pessoa, contexto de vida, relacionamentos, trabalho, família...
            </p>
            <textarea 
              rows={12}
              value={historiaPessoa}
              onChange={(e) => setHistoriaPessoa(e.target.value)}
              placeholder="Ex: Maria tem 34 anos, trabalha como professora, mãe de 2 filhos..."
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-sm"
            />
          </div>

          {/* Bloco Emocional */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h2 className="text-2xl font-bold text-pink-700 mb-6">🌸 Bloco Emocional e Motivacional</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. O que te fez sentir que agora é o momento de mudar?
                </label>
                <textarea 
                  rows={3}
                  value={blocoEmocional.momento_mudanca}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, momento_mudanca: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10. De 0 a 10, qual é o seu nível de comprometimento?
                  <span className="ml-2 font-bold text-pink-700 text-xl">{blocoEmocional.nivel_comprometimento}/10</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={blocoEmocional.nivel_comprometimento} 
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, nivel_comprometimento: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Bloco Comportamental */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-2xl font-bold text-green-700 mb-6">🌿 Bloco de Reflexão Comportamental</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. Qual seu ponto fraco na alimentação?
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.ponto_fraco_alimentacao}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, ponto_fraco_alimentacao: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button
            onClick={() => alert('Avaliação salva com sucesso!')}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:scale-105 shadow-lg"
          >
            💾 Salvar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}

