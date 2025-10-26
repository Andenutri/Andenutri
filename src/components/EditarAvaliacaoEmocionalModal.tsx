'use client';

import { useState } from 'react';

interface EditarAvaliacaoEmocionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: any;
}

export default function EditarAvaliacaoEmocionalModal({ isOpen, onClose, cliente }: EditarAvaliacaoEmocionalModalProps) {
  const [formData, setFormData] = useState({
    historia_pessoa: '',
    // Bloco Emocional
    momento_mudanca: '',
    insatisfacao_espelho: '',
    situacao_chateada: '',
    atrapalha_dia_dia: '',
    medo_falhar: '',
    maior_medo: '',
    por_que_agora: '',
    ja_tentou: '',
    primeira_coisa_peso: '',
    tres_motivos: '',
    nivel_comprometimento: '',
    conselho_si_mesma: '',
    // Bloco Comportamental
    ponto_fraco: '',
    organizacao_comida: '',
    come_por: '',
    momento_dificil: '',
    prazer_alem_comida: '',
    se_premia_comida: '',
    observacoes: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Salvar no Supabase
      console.log('Salvando avaliação emocional:', formData);
      alert('✅ Avaliação emocional salva com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
          <h2 className="text-2xl font-bold text-purple-700">💚 Editar Avaliação Emocional</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* História da Pessoa */}
          <div className="border-2 border-amber-200 rounded-xl p-6 bg-amber-50">
            <h3 className="text-lg font-bold text-amber-700 mb-4">📖 História da Pessoa</h3>
            <textarea
              value={formData.historia_pessoa}
              onChange={(e) => setFormData({ ...formData, historia_pessoa: e.target.value })}
              rows={6}
              placeholder="Escreva a história, contexto, motivações e desafios da pessoa..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Bloco Emocional */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h3 className="text-lg font-bold text-pink-700 mb-4">🌸 Bloco Emocional e Motivacional</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que te fez sentir que agora é o momento de mudar?</label>
                <textarea
                  value={formData.momento_mudanca}
                  onChange={(e) => setFormData({ ...formData, momento_mudanca: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quando se olha no espelho, o que mais te incomoda ou te entristece hoje?</label>
                <textarea
                  value={formData.insatisfacao_espelho}
                  onChange={(e) => setFormData({ ...formData, insatisfacao_espelho: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teve alguma situação que te deixou chateada com o corpo?</label>
                <textarea
                  value={formData.situacao_chateada}
                  onChange={(e) => setFormData({ ...formData, situacao_chateada: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que mais te atrapalha no seu dia a dia por estar com esse peso?</label>
                <textarea
                  value={formData.atrapalha_dia_dia}
                  onChange={(e) => setFormData({ ...formData, atrapalha_dia_dia: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Você sente medo de não conseguir emagrecer? Qual seria o seu maior medo nesse processo?</label>
                <textarea
                  value={formData.maior_medo}
                  onChange={(e) => setFormData({ ...formData, maior_medo: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Por que você quer eliminar esses quilos agora?</label>
                <textarea
                  value={formData.por_que_agora}
                  onChange={(e) => setFormData({ ...formData, por_que_agora: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que você já tentou fazer para emagrecer e não conseguiu manter? Por quê?</label>
                <textarea
                  value={formData.ja_tentou}
                  onChange={(e) => setFormData({ ...formData, ja_tentou: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quando estiver no seu peso desejado, o que é a primeira coisa que vai querer fazer ou usar sem culpa?</label>
                <textarea
                  value={formData.primeira_coisa_peso}
                  onChange={(e) => setFormData({ ...formData, primeira_coisa_peso: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quais 3 motivos mais fortes te fazem querer mudar?</label>
                <textarea
                  value={formData.tres_motivos}
                  onChange={(e) => setFormData({ ...formData, tres_motivos: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">De 0 a 10, qual é o seu nível de comprometimento com essa mudança?</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.nivel_comprometimento}
                    onChange={(e) => setFormData({ ...formData, nivel_comprometimento: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Se você pudesse dar um conselho pra si mesma hoje, qual seria?</label>
                  <textarea
                    value={formData.conselho_si_mesma}
                    onChange={(e) => setFormData({ ...formData, conselho_si_mesma: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bloco Comportamental */}
          <div className="border-2 border-emerald-200 rounded-xl p-6 bg-emerald-50">
            <h3 className="text-lg font-bold text-emerald-700 mb-4">🌿 Bloco de Reflexão Comportamental</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qual seu ponto fraco na alimentação? (doce, pão, ansiedade noturna…)</label>
                <textarea
                  value={formData.ponto_fraco}
                  onChange={(e) => setFormData({ ...formData, ponto_fraco: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Você se considera organizada com a comida ou costuma improvisar?</label>
                <textarea
                  value={formData.organizacao_comida}
                  onChange={(e) => setFormData({ ...formData, organizacao_comida: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Você sente que come por fome ou por emoção?</label>
                <textarea
                  value={formData.come_por}
                  onChange={(e) => setFormData({ ...formData, come_por: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quais momentos do dia são mais difíceis de controlar a alimentação?</label>
                <textarea
                  value={formData.momento_dificil}
                  onChange={(e) => setFormData({ ...formData, momento_dificil: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que te daria mais prazer do que comer nesses momentos de ansiedade?</label>
                <textarea
                  value={formData.prazer_alem_comida}
                  onChange={(e) => setFormData({ ...formData, prazer_alem_comida: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Você costuma se premiar com comida?</label>
                <textarea
                  value={formData.se_premia_comida}
                  onChange={(e) => setFormData({ ...formData, se_premia_comida: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="text-lg font-bold text-purple-700 mb-4">📝 Observações Adicionais</h3>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={4}
              placeholder="Anotações adicionais sobre a avaliação emocional..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold disabled:opacity-50"
            >
              {saving ? '💾 Salvando...' : '✅ Salvar Avaliação Emocional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

