'use client';

import { useState } from 'react';

interface EditarAvaliacaoFisicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: any;
}

export default function EditarAvaliacaoFisicaModal({ isOpen, onClose, cliente }: EditarAvaliacaoFisicaModalProps) {
  const [formData, setFormData] = useState({
    data_avaliacao: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    massa_gorda: '',
    massa_magra: '',
    visceral: '',
    busto: '',
    cintura: '',
    abdomen: '',
    quadril: '',
    coxa_esquerda: '',
    coxa_direita: '',
    braco_esquerdo: '',
    braco_direito: '',
    pescoco: '',
    observacoes: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Salvar no Supabase
      console.log('Salvando avaliação física:', formData);
      alert('✅ Avaliação física salva com sucesso!');
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
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
          <h2 className="text-2xl font-bold text-green-700">📏 Editar Avaliação Física</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Data e Medidas Principais */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h3 className="text-lg font-bold text-green-700 mb-4">📊 Medidas Principais</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Data</label>
                <input
                  type="date"
                  value={formData.data_avaliacao}
                  onChange={(e) => setFormData({ ...formData, data_avaliacao: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">⚖️ Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📏 Altura (cm)</label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🧮 IMC</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.altura && formData.peso ? (parseFloat(formData.peso) / ((parseFloat(formData.altura) / 100) ** 2)).toFixed(1) : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">❌ Massa Gorda (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.massa_gorda}
                  onChange={(e) => setFormData({ ...formData, massa_gorda: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">✅ Massa Magra (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.massa_magra}
                  onChange={(e) => setFormData({ ...formData, massa_magra: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🧠 Visceral</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.visceral}
                  onChange={(e) => setFormData({ ...formData, visceral: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Medidas Corporais */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 mb-4">📏 Medidas Corporais (cm)</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👗 Busto</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.busto}
                  onChange={(e) => setFormData({ ...formData, busto: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👗 Cintura</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cintura}
                  onChange={(e) => setFormData({ ...formData, cintura: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Abdômen</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.abdomen}
                  onChange={(e) => setFormData({ ...formData, abdomen: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👖 Quadril</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quadril}
                  onChange={(e) => setFormData({ ...formData, quadril: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🦵 Coxa Esq.</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coxa_esquerda}
                  onChange={(e) => setFormData({ ...formData, coxa_esquerda: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🦵 Coxa Dir.</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coxa_direita}
                  onChange={(e) => setFormData({ ...formData, coxa_direita: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🦾 Braço Esq.</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.braco_esquerdo}
                  onChange={(e) => setFormData({ ...formData, braco_esquerdo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🦾 Braço Dir.</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.braco_direito}
                  onChange={(e) => setFormData({ ...formData, braco_direito: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">👔 Pescoço</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pescoco}
                  onChange={(e) => setFormData({ ...formData, pescoco: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="text-lg font-bold text-purple-700 mb-4">📝 Observações</h3>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={4}
              placeholder="Anotações sobre a avaliação física..."
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold disabled:opacity-50"
            >
              {saving ? '💾 Salvando...' : '✅ Salvar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

