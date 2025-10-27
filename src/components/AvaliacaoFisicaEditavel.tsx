'use client';

import { useState } from 'react';

interface AvaliacaoFisica {
  id: string;
  data: string;
  peso: string;
  percentual_gordura: string;
  percentual_musculo: string;
  gordura_visceral: string;
  metabolismo_basal: string;
  busto: string;
  cintura: string;
  barriga: string;
  quadril: string;
  coxa: string;
  braco: string;
  pescoco: string;
}

interface AvaliacaoFisicaEditavelProps {
  cliente: any;
}

export default function AvaliacaoFisicaEditavel({ cliente }: AvaliacaoFisicaEditavelProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Mock data - depois substituir por dados reais
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([
    {
      id: '1',
      data: '15/01/2025',
      peso: '75',
      percentual_gordura: '28',
      percentual_musculo: '25',
      gordura_visceral: '12',
      metabolismo_basal: '1650',
      busto: '92',
      cintura: '88',
      barriga: '92',
      quadril: '102',
      coxa: '58',
      braco: '32',
      pescoco: '36',
    },
  ]);

  const [formData, setFormData] = useState<AvaliacaoFisica>({
    id: '',
    data: new Date().toLocaleDateString('pt-BR'),
    peso: '',
    percentual_gordura: '',
    percentual_musculo: '',
    gordura_visceral: '',
    metabolismo_basal: '',
    busto: '',
    cintura: '',
    barriga: '',
    quadril: '',
    coxa: '',
    braco: '',
    pescoco: '',
  });

  const handleAdd = () => {
    const novaAvaliacao = { ...formData, id: Date.now().toString() };
    setAvaliacoes([novaAvaliacao, ...avaliacoes]);
    setIsAdding(false);
    setFormData({
      id: '',
      data: new Date().toLocaleDateString('pt-BR'),
      peso: '',
      percentual_gordura: '',
      percentual_musculo: '',
      gordura_visceral: '',
      metabolismo_basal: '',
      busto: '',
      cintura: '',
      barriga: '',
      quadril: '',
      coxa: '',
      braco: '',
      pescoco: '',
    });
  };

  const handleSave = (id: string) => {
    setAvaliacoes(avaliacoes.map(av => av.id === id ? formData : av));
    setEditing(null);
  };

  const handleEdit = (avaliacao: AvaliacaoFisica) => {
    setFormData(avaliacao);
    setEditing(avaliacao.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setAvaliacoes(avaliacoes.filter(av => av.id !== id));
    }
  };

  return (
    <div className="bg-green-50 rounded-xl border-2 border-green-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-green-800">📏 Avaliação Física</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base flex items-center gap-2"
          >
            ➕ Nova Avaliação
          </button>
        )}
      </div>

      {/* Nova Avaliação Form */}
      {isAdding && (
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border-2 border-green-300">
          <h4 className="text-lg font-bold text-green-800 mb-4">➕ Nova Avaliação Física</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="text"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="DD/MM/AAAA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="text"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% Gordura</label>
              <input
                type="text"
                value={formData.percentual_gordura}
                onChange={(e) => setFormData({...formData, percentual_gordura: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% Músculo</label>
              <input
                type="text"
                value={formData.percentual_musculo}
                onChange={(e) => setFormData({...formData, percentual_musculo: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gordura Visceral</label>
              <input
                type="text"
                value={formData.gordura_visceral}
                onChange={(e) => setFormData({...formData, gordura_visceral: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metabolismo Basal</label>
              <input
                type="text"
                value={formData.metabolismo_basal}
                onChange={(e) => setFormData({...formData, metabolismo_basal: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Busto (cm)</label>
              <input
                type="text"
                value={formData.busto}
                onChange={(e) => setFormData({...formData, busto: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cintura (cm)</label>
              <input
                type="text"
                value={formData.cintura}
                onChange={(e) => setFormData({...formData, cintura: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barriga (cm)</label>
              <input
                type="text"
                value={formData.barriga}
                onChange={(e) => setFormData({...formData, barriga: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quadril (cm)</label>
              <input
                type="text"
                value={formData.quadril}
                onChange={(e) => setFormData({...formData, quadril: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coxa (cm)</label>
              <input
                type="text"
                value={formData.coxa}
                onChange={(e) => setFormData({...formData, coxa: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Braço (cm)</label>
              <input
                type="text"
                value={formData.braco}
                onChange={(e) => setFormData({...formData, braco: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pescoço (cm)</label>
              <input
                type="text"
                value={formData.pescoco}
                onChange={(e) => setFormData({...formData, pescoco: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {avaliacoes.map((avaliacao) => (
          <div key={avaliacao.id} className="bg-white rounded-lg p-4 md:p-6 border-2 border-green-200">
            {editing === avaliacao.id ? (
              // Modo Edição
              <div>
                <h4 className="text-lg font-bold text-green-800 mb-4">📝 Editando Avaliação - {avaliacao.data}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="text"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="text"
                      value={formData.peso}
                      onChange={(e) => setFormData({...formData, peso: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">% Gordura</label>
                    <input
                      type="text"
                      value={formData.percentual_gordura}
                      onChange={(e) => setFormData({...formData, percentual_gordura: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">% Músculo</label>
                    <input
                      type="text"
                      value={formData.percentual_musculo}
                      onChange={(e) => setFormData({...formData, percentual_musculo: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gordura Visceral</label>
                    <input
                      type="text"
                      value={formData.gordura_visceral}
                      onChange={(e) => setFormData({...formData, gordura_visceral: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metabolismo Basal</label>
                    <input
                      type="text"
                      value={formData.metabolismo_basal}
                      onChange={(e) => setFormData({...formData, metabolismo_basal: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Busto (cm)</label>
                    <input
                      type="text"
                      value={formData.busto}
                      onChange={(e) => setFormData({...formData, busto: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cintura (cm)</label>
                    <input
                      type="text"
                      value={formData.cintura}
                      onChange={(e) => setFormData({...formData, cintura: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barriga (cm)</label>
                    <input
                      type="text"
                      value={formData.barriga}
                      onChange={(e) => setFormData({...formData, barriga: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quadril (cm)</label>
                    <input
                      type="text"
                      value={formData.quadril}
                      onChange={(e) => setFormData({...formData, quadril: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coxa (cm)</label>
                    <input
                      type="text"
                      value={formData.coxa}
                      onChange={(e) => setFormData({...formData, coxa: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Braço (cm)</label>
                    <input
                      type="text"
                      value={formData.braco}
                      onChange={(e) => setFormData({...formData, braco: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pescoço (cm)</label>
                    <input
                      type="text"
                      value={formData.pescoco}
                      onChange={(e) => setFormData({...formData, pescoco: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleSave(avaliacao.id)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo Visualização
              <>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800">📏 Avaliação - {avaliacao.data}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(avaliacao)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(avaliacao.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600">Peso</div>
                    <div className="font-bold text-blue-700">{avaliacao.peso} kg</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs text-gray-600">% Gordura</div>
                    <div className="font-bold text-orange-700">{avaliacao.percentual_gordura}%</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-gray-600">% Músculo</div>
                    <div className="font-bold text-purple-700">{avaliacao.percentual_musculo}%</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xs text-gray-600">Gordura Visceral</div>
                    <div className="font-bold text-yellow-700">{avaliacao.gordura_visceral}</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="text-xs text-gray-600">Metabolismo</div>
                    <div className="font-bold text-indigo-700">{avaliacao.metabolismo_basal} kcal</div>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <div className="text-xs text-gray-600">Pescoço</div>
                    <div className="font-bold text-pink-700">{avaliacao.pescoco} cm</div>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <div className="text-xs text-gray-600">Busto</div>
                    <div className="font-bold text-cyan-700">{avaliacao.busto} cm</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-gray-600">Cintura</div>
                    <div className="font-bold text-green-700">{avaliacao.cintura} cm</div>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="text-xs text-gray-600">Barriga</div>
                    <div className="font-bold text-teal-700">{avaliacao.barriga} cm</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="text-xs text-gray-600">Quadril</div>
                    <div className="font-bold text-amber-700">{avaliacao.quadril} cm</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-600">Coxa</div>
                    <div className="font-bold text-red-700">{avaliacao.coxa} cm</div>
                  </div>
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <div className="text-xs text-gray-600">Braço</div>
                    <div className="font-bold text-violet-700">{avaliacao.braco} cm</div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {avaliacoes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📏</div>
          <p className="text-gray-600">Nenhuma avaliação física registrada ainda</p>
        </div>
      )}
    </div>
  );
}

