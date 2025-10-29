'use client';

export default function RelatoriosSaude({ clienteId }: { clienteId: string }) {
  if (!clienteId) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-pink-300 p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
        <p className="text-gray-500">
          Escolha um cliente para visualizar relatórios
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <span>📈</span> Relatórios e Estatísticas
        </h2>
        <p className="text-pink-100">
          Análises detalhadas do ciclo menstrual e bem-estar
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Exportar PDF', icon: '📄', color: 'red' },
          { label: 'Enviar por Email', icon: '📧', color: 'blue' },
          { label: 'Compartilhar', icon: '🔗', color: 'green' },
          { label: 'Imprimir', icon: '🖨️', color: 'purple' },
        ].map((action, idx) => (
          <button
            key={idx}
            className={`bg-gradient-to-r from-${action.color}-400 to-${action.color}-600 text-white rounded-lg py-3 px-4 font-semibold hover:scale-105 transition-all shadow-lg text-sm md:text-base`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            {action.label}
          </button>
        ))}
      </div>

      {/* Resumo do Período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Ciclos Registrados', value: '12', subtitle: 'Últimos 12 meses' },
          { label: 'Duração Média', value: '28 dias', subtitle: 'Variação: 26-30' },
          { label: 'Regularidade', value: 'Regular', subtitle: '85% consistente' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-pink-600 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Gráficos e Visualizações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Gráfico de Duração do Ciclo */}
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Duração do Ciclo (Últimos 6 meses)</h3>
          <div className="space-y-2">
            {[
              { month: 'Jul', days: 28, bar: 70 },
              { month: 'Ago', days: 27, bar: 67 },
              { month: 'Set', days: 29, bar: 72 },
              { month: 'Out', days: 28, bar: 70 },
              { month: 'Nov', days: 30, bar: 75 },
              { month: 'Dez', days: 28, bar: 70 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 text-sm font-semibold text-gray-700">{item.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-pink-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${item.bar}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{item.days}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Intensidade de Sintomas */}
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Intensidade de Sintomas (Últimos 3 meses)</h3>
          <div className="space-y-3">
            {[
              { symptom: 'Cólicas', avg: 3, max: 5 },
              { symptom: 'Humor', avg: 4, max: 5 },
              { symptom: 'Energia', avg: 3.5, max: 5 },
              { symptom: 'Libido', avg: 4, max: 5 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">{item.symptom}</span>
                  <span className="text-pink-600 font-bold">{item.avg}/{item.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(item.avg / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico de Ciclos</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pink-50">
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Data Início</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Duração</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Intensidade</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Sintomas</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: '15/12/2024', duration: '5 dias', intensity: 'Moderada', symptoms: 'Cólicas, Humor baixo' },
              { date: '17/11/2024', duration: '4 dias', intensity: 'Leve', symptoms: 'Nenhum' },
              { date: '20/10/2024', duration: '6 dias', intensity: 'Intensa', symptoms: 'Cólicas, Dor cabeça' },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-pink-50">
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.intensity === 'Leve' ? 'bg-green-100 text-green-700' :
                    row.intensity === 'Moderada' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {row.intensity}
                  </span>
                </td>
                <td className="px-4 py-3">{row.symptoms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

