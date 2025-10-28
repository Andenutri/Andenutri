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
      percentual_musculo: '45',
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
    {
      id: '2',
      data: '15/02/2025',
      peso: '73',
      percentual_gordura: '26',
      percentual_musculo: '46',
      gordura_visceral: '10',
      metabolismo_basal: '1630',
      busto: '91',
      cintura: '85',
      barriga: '89',
      quadril: '99',
      coxa: '57',
      braco: '31',
      pescoco: '36',
    },
    {
      id: '3',
      data: '15/03/2025',
      peso: '70',
      percentual_gordura: '24',
      percentual_musculo: '48',
      gordura_visceral: '9',
      metabolismo_basal: '1610',
      busto: '90',
      cintura: '82',
      barriga: '86',
      quadril: '96',
      coxa: '56',
      braco: '31',
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


          {/* Tabela/Planilha de Avaliações */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg border-2 border-green-200 overflow-hidden">
          {/* Cabeçalho fixo */}
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-green-800 border-b sticky left-0 bg-green-100 z-10 min-w-[120px]">Data</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Peso (kg)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">% Gordura</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">% Músculo</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Gordura Visceral</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Metabolismo (kcal)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Busto (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Cintura (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Barriga (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Quadril (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Coxa (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Braço (cm)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-green-800 border-b">Pescoço (cm)</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-green-800 border-b sticky right-0 bg-green-100 z-10">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Linha para Adicionar Nova Avaliação */}
            {isAdding && (
              <tr className="bg-green-50 border-2 border-green-300">
                <td className="px-4 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    placeholder="15/01/2025"
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.peso}
                    onChange={(e) => setFormData({...formData, peso: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.percentual_gordura}
                    onChange={(e) => setFormData({...formData, percentual_gordura: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.percentual_musculo}
                    onChange={(e) => setFormData({...formData, percentual_musculo: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.gordura_visceral}
                    onChange={(e) => setFormData({...formData, gordura_visceral: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.metabolismo_basal}
                    onChange={(e) => setFormData({...formData, metabolismo_basal: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.busto}
                    onChange={(e) => setFormData({...formData, busto: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.cintura}
                    onChange={(e) => setFormData({...formData, cintura: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.barriga}
                    onChange={(e) => setFormData({...formData, barriga: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.quadril}
                    onChange={(e) => setFormData({...formData, quadril: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.coxa}
                    onChange={(e) => setFormData({...formData, coxa: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 border-r border-green-200">
                  <input
                    type="text"
                    value={formData.braco}
                    onChange={(e) => setFormData({...formData, braco: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={formData.pescoco}
                    onChange={(e) => setFormData({...formData, pescoco: e.target.value})}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                  />
                </td>
                <td className="sticky right-0 bg-green-50 px-2 py-2 z-10">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAdd}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      ✓ Salvar
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            )}
            
            {avaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id} className="border-b hover:bg-green-50 transition-colors">
                {editing === avaliacao.id ? (
                  // Modo Edição - Linha completa
                  <>
                    <td className="px-4 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.data}
                        onChange={(e) => setFormData({...formData, data: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.peso}
                        onChange={(e) => setFormData({...formData, peso: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.percentual_gordura}
                        onChange={(e) => setFormData({...formData, percentual_gordura: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.percentual_musculo}
                        onChange={(e) => setFormData({...formData, percentual_musculo: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.gordura_visceral}
                        onChange={(e) => setFormData({...formData, gordura_visceral: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.metabolismo_basal}
                        onChange={(e) => setFormData({...formData, metabolismo_basal: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.busto}
                        onChange={(e) => setFormData({...formData, busto: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.cintura}
                        onChange={(e) => setFormData({...formData, cintura: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.barriga}
                        onChange={(e) => setFormData({...formData, barriga: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.quadril}
                        onChange={(e) => setFormData({...formData, quadril: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.coxa}
                        onChange={(e) => setFormData({...formData, coxa: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-green-200">
                      <input
                        type="text"
                        value={formData.braco}
                        onChange={(e) => setFormData({...formData, braco: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={formData.pescoco}
                        onChange={(e) => setFormData({...formData, pescoco: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-green-300 rounded"
                      />
                    </td>
                    <td className="sticky right-0 bg-green-50 px-2 py-2 z-10">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(avaliacao.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // Modo Visualização
                  <>
                    <td className="px-4 py-2 font-semibold sticky left-0 bg-white border-r border-green-200">{avaliacao.data}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.peso}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.percentual_gordura}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.percentual_musculo}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.gordura_visceral}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.metabolismo_basal}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.busto}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.cintura}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.barriga}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.quadril}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.coxa}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.braco}</td>
                    <td className="px-3 py-2 text-center">{avaliacao.pescoco}</td>
                    <td className="sticky right-0 bg-white px-2 py-2 z-10">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(avaliacao)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(avaliacao.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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

