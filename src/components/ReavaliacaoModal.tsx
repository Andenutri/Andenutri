'use client';

import { useState } from 'react';

interface ReavaliacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNome: string;
}

export default function ReavaliacaoModal({ isOpen, onClose, clienteId, clienteNome }: ReavaliacaoModalProps) {
  const [formData, setFormData] = useState({
    data_avaliacao: new Date().toISOString().split('T')[0],
    peso_atual: '',
    altura: '',
    cintura: '',
    quadril: '',
    braco_esquerdo: '',
    braco_direito: '',
    coxa_esquerda: '',
    coxa_direita: '',
    abdomen: '',
    pescoco: '',
    imc: '',
    fotos_antes: null as FileList | null,
    fotos_depois: null as FileList | null,
    observacoes: '',
    protocolo_aplicado: '',
    proxima_avaliacao: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Salvar reavaliação no banco de dados
    console.log('Salvando reavaliação:', formData);
    
    alert('✅ Reavaliação salva com sucesso!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-amber-700">
            📏 Nova Reavaliação - {clienteNome}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Data da Avaliação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Data da Avaliação *
              </label>
              <input
                type="date"
                value={formData.data_avaliacao}
                onChange={(e) => setFormData({ ...formData, data_avaliacao: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Próxima Avaliação
              </label>
              <input
                type="date"
                value={formData.proxima_avaliacao}
                onChange={(e) => setFormData({ ...formData, proxima_avaliacao: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Medidas Corporais */}
          <div className="border-2 border-amber-100 rounded-xl p-6 bg-amber-50">
            <h3 className="text-lg font-bold text-amber-700 mb-4">📏 Medidas Corporais</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚖️ Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso_atual}
                  onChange={(e) => setFormData({ ...formData, peso_atual: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📏 Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🧮 IMC
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.imc}
                  onChange={(e) => setFormData({ ...formData, imc: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👗 Cintura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cintura}
                  onChange={(e) => setFormData({ ...formData, cintura: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👖 Quadril (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quadril}
                  onChange={(e) => setFormData({ ...formData, quadril: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🦾 Braço Esq. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.braco_esquerdo}
                  onChange={(e) => setFormData({ ...formData, braco_esquerdo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🦾 Braço Dir. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.braco_direito}
                  onChange={(e) => setFormData({ ...formData, braco_direito: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🦵 Coxa Esq. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coxa_esquerda}
                  onChange={(e) => setFormData({ ...formData, coxa_esquerda: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🦵 Coxa Dir. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coxa_direita}
                  onChange={(e) => setFormData({ ...formData, coxa_direita: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Abdômen (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.abdomen}
                  onChange={(e) => setFormData({ ...formData, abdomen: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👔 Pescoço (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pescoco}
                  onChange={(e) => setFormData({ ...formData, pescoco: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="border-2 border-purple-100 rounded-xl p-6 bg-purple-50">
            <h3 className="text-lg font-bold text-purple-700 mb-4">📸 Fotografias</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📷 Fotos Antes
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, fotos_antes: e.target.files })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Pode selecionar múltiplas fotos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📷 Fotos Depois
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, fotos_depois: e.target.files })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Pode selecionar múltiplas fotos</p>
              </div>
            </div>
          </div>

          {/* Observações e Protocolo */}
          <div className="border-2 border-blue-100 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 mb-4">📝 Informações Adicionais</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🧬 Protocolo Aplicado
                </label>
                <input
                  type="text"
                  value={formData.protocolo_aplicado}
                  onChange={(e) => setFormData({ ...formData, protocolo_aplicado: e.target.value })}
                  placeholder="Ex: Protocolo Herbalife 21 dias"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Anotações sobre a evolução, desafios, aderência ao protocolo..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
            >
              ✅ Salvar Reavaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

