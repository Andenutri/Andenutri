'use client';

export default function MenopausaTracking({ clienteId }: { clienteId: string }) {
  if (!clienteId) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-pink-300 p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">🔄</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
        <p className="text-gray-500">
          Escolha um cliente para acompanhar menopausa
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <span>🔄</span> Acompanhamento de Menopausa
        </h2>
        <p className="text-purple-100">
          Track de sintomas e bem-estar durante a perimenopausa e menopausa
        </p>
      </div>

      {/* Cards de Sintomas Comuns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Ondas de Calor', icon: '🔥', intensity: 'Moderada', frequency: '3-5x/dia' },
          { label: 'Suores Noturnos', icon: '💧', intensity: 'Leve', frequency: '2x/semana' },
          { label: 'Distúrbios do Sono', icon: '😴', intensity: 'Moderada', frequency: 'Diário' },
          { label: 'Mudanças de Humor', icon: '😔', intensity: 'Leve', frequency: 'Ocasional' },
          { label: 'Secura Vaginal', icon: '🌸', intensity: 'Moderada', frequency: 'Frequente' },
          { label: 'Fadiga', icon: '😴', intensity: 'Moderada', frequency: 'Diário' },
        ].map((sintoma, idx) => (
          <div key={idx} className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">{sintoma.icon}</div>
              <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                {sintoma.intensity}
              </div>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{sintoma.label}</h3>
            <div className="text-sm text-gray-600">
              <div>Frequência: {sintoma.frequency}</div>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  defaultValue="3"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tracker Diário */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> Tracker Diário de Sintomas
        </h3>
        
        <div className="space-y-4">
          {[
            'Ondas de calor hoje',
            'Qualidade do sono',
            'Nível de energia',
            'Humor geral',
            'Ansiedade/irritabilidade',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">{item}</span>
              <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Nenhum</option>
                <option>Leve</option>
                <option>Moderado</option>
                <option>Intenso</option>
              </select>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-3 px-6 font-semibold hover:scale-105 transition-all shadow-lg">
          💾 Salvar Registro do Dia
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> Tendência dos Sintomas (Último Mês)
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Ondas de calor</span>
                <span className="font-semibold">Moderada</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Qualidade do sono</span>
                <span className="font-semibold">Regular</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💊</span> Tratamentos e Terapias
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-gray-800">Terapia Hormonal (TH)</div>
              <div className="text-sm text-gray-600">Iniciado em: Jan/2024</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="font-semibold text-gray-800">Suplementos</div>
              <div className="text-sm text-gray-600">Vitamina D, Cálcio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

