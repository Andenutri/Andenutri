'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';

interface EditarPreConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function EditarPreConsultaModal({ isOpen, onClose, cliente }: EditarPreConsultaModalProps) {
  const [formData, setFormData] = useState({
    nome_completo: cliente?.formulario?.nome_completo || '',
    idade: cliente?.formulario?.idade || '',
    altura: cliente?.formulario?.altura || '',
    peso_atual: cliente?.formulario?.peso_atual || '',
    peso_desejado: cliente?.formulario?.peso_desejado || '',
    cafe_manha: cliente?.formulario?.cafe_manha || '',
    almoco: cliente?.formulario?.almoco || '',
    jantar: cliente?.formulario?.jantar || '',
    consumo_agua: cliente?.formulario?.consumo_agua || '',
    atividade_fisica: cliente?.formulario?.atividade_fisica || '',
    condicao_saude: cliente?.formulario?.condicao_saude || '',
    restricao_alimentar: cliente?.formulario?.restricao_alimentar || '',
    uso_medicacao: cliente?.formulario?.uso_medicacao || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Salvar no Supabase
      console.log('Salvando dados da pré-consulta:', formData);
      alert('✅ Dados da pré-consulta atualizados com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
          <h2 className="text-2xl font-bold text-blue-700">📝 Editar Dados da Pré-Consulta</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Gerais */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 mb-4">👤 Informações Gerais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="text"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                <input
                  type="text"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Atual (kg)</label>
                <input
                  type="text"
                  value={formData.peso_atual}
                  onChange={(e) => setFormData({ ...formData, peso_atual: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Desejado (kg)</label>
                <input
                  type="text"
                  value={formData.peso_desejado}
                  onChange={(e) => setFormData({ ...formData, peso_desejado: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rotina Alimentar */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h3 className="text-lg font-bold text-green-700 mb-4">🍽️ Rotina Alimentar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Café da Manhã</label>
                <textarea
                  value={formData.cafe_manha}
                  onChange={(e) => setFormData({ ...formData, cafe_manha: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Almoço</label>
                <textarea
                  value={formData.almoco}
                  onChange={(e) => setFormData({ ...formData, almoco: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jantar</label>
                <textarea
                  value={formData.jantar}
                  onChange={(e) => setFormData({ ...formData, jantar: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consumo de Água</label>
                  <input
                    type="text"
                    value={formData.consumo_agua}
                    onChange={(e) => setFormData({ ...formData, consumo_agua: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Atividade Física</label>
                  <input
                    type="text"
                    value={formData.atividade_fisica}
                    onChange={(e) => setFormData({ ...formData, atividade_fisica: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Saúde e Condições */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h3 className="text-lg font-bold text-red-700 mb-4">🏥 Saúde e Condições</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condição de Saúde</label>
                <textarea
                  value={formData.condicao_saude}
                  onChange={(e) => setFormData({ ...formData, condicao_saude: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restrição Alimentar</label>
                  <input
                    type="text"
                    value={formData.restricao_alimentar}
                    onChange={(e) => setFormData({ ...formData, restricao_alimentar: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uso de Medicação</label>
                  <input
                    type="text"
                    value={formData.uso_medicacao}
                    onChange={(e) => setFormData({ ...formData, uso_medicacao: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold disabled:opacity-50"
            >
              {saving ? '💾 Salvando...' : '✅ Salvar Dados'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

