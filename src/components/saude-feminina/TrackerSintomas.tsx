'use client';

import { useState } from 'react';

interface TrackerSintomasProps {
  clienteId: string;
}

export default function TrackerSintomas({ clienteId }: TrackerSintomasProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sintomas, setSintomas] = useState({
    cólicas: { presente: false, intensidade: 0 },
    dorCabeça: { presente: false, intensidade: 0 },
    humor: { valor: 'normal' },
    energia: { valor: 'media' },
    libido: { valor: 'normal' },
    inchaço: { presente: false },
    sensibilidadeMamas: { presente: false },
    notas: '',
  });

  if (!clienteId) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-pink-300 p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
        <p className="text-gray-500">
          Escolha um cliente para registrar sintomas
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sintomas registrados com sucesso! 📝');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> Tracker de Sintomas Diário
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Formulário de Sintomas */}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Sintomas Físicos */}
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🩺</span> Sintomas Físicos
          </h3>
          
          <div className="space-y-4">
            {/* Cólicas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Cólicas</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sintomas.cólicas.presente}
                    onChange={(e) =>
                      setSintomas({
                        ...sintomas,
                        cólicas: { ...sintomas.cólicas, presente: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-pink-600"
                  />
                  <span className="text-sm">Presente</span>
                </label>
              </div>
              {sintomas.cólicas.presente && (
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sintomas.cólicas.intensidade || 1}
                  onChange={(e) =>
                    setSintomas({
                      ...sintomas,
                      cólicas: { ...sintomas.cólicas, intensidade: parseInt(e.target.value) },
                    })
                  }
                  className="w-full"
                />
              )}
            </div>

            {/* Dor de Cabeça */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Dor de Cabeça</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sintomas.dorCabeça.presente}
                    onChange={(e) =>
                      setSintomas({
                        ...sintomas,
                        dorCabeça: { ...sintomas.dorCabeça, presente: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-pink-600"
                  />
                  <span className="text-sm">Presente</span>
                </label>
              </div>
            </div>

            {/* Inchaço */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-gray-700">Inchaço</span>
              <input
                type="checkbox"
                checked={sintomas.inchaço.presente}
                onChange={(e) =>
                  setSintomas({
                    ...sintomas,
                    inchaço: { presente: e.target.checked },
                  })
                }
                className="w-5 h-5 text-pink-600"
              />
            </label>

            {/* Sensibilidade nos Seios */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-gray-700">Sensibilidade nos Seios</span>
              <input
                type="checkbox"
                checked={sintomas.sensibilidadeMamas.presente}
                onChange={(e) =>
                  setSintomas({
                    ...sintomas,
                    sensibilidadeMamas: { presente: e.target.checked },
                  })
                }
                className="w-5 h-5 text-pink-600"
              />
            </label>
          </div>
        </div>

        {/* Bem-estar Emocional */}
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💝</span> Bem-estar Emocional
          </h3>
          
          <div className="space-y-4">
            {/* Humor */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Humor</label>
              <div className="flex gap-2">
                {['muito-baixo', 'baixo', 'normal', 'bom', 'muito-bom'].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() =>
                      setSintomas({
                        ...sintomas,
                        humor: { valor },
                      })
                    }
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      sintomas.humor.valor === valor
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {valor.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Energia */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Nível de Energia</label>
              <select
                value={sintomas.energia.valor}
                onChange={(e) =>
                  setSintomas({
                    ...sintomas,
                    energia: { valor: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="muito-baixa">Muito Baixa</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="muito-alta">Muito Alta</option>
              </select>
            </div>

            {/* Libido */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Libido</label>
              <select
                value={sintomas.libido.valor}
                onChange={(e) =>
                  setSintomas({
                    ...sintomas,
                    libido: { valor: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="muito-baixa">Muito Baixa</option>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="muito-alta">Muito Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <label className="block font-semibold text-gray-700 mb-2">Notas Adicionais</label>
          <textarea
            value={sintomas.notas}
            onChange={(e) =>
              setSintomas({
                ...sintomas,
                notas: e.target.value,
              })
            }
            placeholder="Adicione qualquer observação sobre como você está se sentindo hoje..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
          />
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg py-4 px-6 font-semibold text-lg hover:scale-105 transition-all shadow-lg"
        >
          💾 Salvar Sintomas do Dia
        </button>
      </form>
    </div>
  );
}

