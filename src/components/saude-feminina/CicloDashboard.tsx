'use client';

import { useState, useEffect } from 'react';

interface CicloDashboardProps {
  clienteId: string;
}

export default function CicloDashboard({ clienteId }: CicloDashboardProps) {
  const [currentCycle, setCurrentCycle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    if (clienteId) {
      setLoading(true);
      // Simular carregamento
      setTimeout(() => {
        setCurrentCycle({
          cicloAtual: 25,
          diaCiclo: 12,
          faseAtual: 'Fase Folicular',
          proximaMenstruacao: '2025-01-28',
          periodoFertil: '2025-01-15 a 2025-01-19',
          ovulacaoEsperada: '2025-01-17',
        });
        setLoading(false);
      }, 500);
    }
  }, [clienteId]);

  if (!clienteId) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-pink-300 p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
        <p className="text-gray-500">
          Escolha um cliente no campo acima para visualizar o dashboard de saúde feminina
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border-2 border-pink-200 p-8 md:p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados do ciclo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card: Dia do Ciclo */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📅</span>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm font-semibold">Dia {currentCycle?.diaCiclo || 'N/A'}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1">Ciclo Atual</h3>
          <p className="text-pink-100">{currentCycle?.cicloAtual || 'N/A'} dias</p>
          <p className="text-sm mt-2 opacity-90">{currentCycle?.faseAtual || 'Fase não definida'}</p>
        </div>

        {/* Card: Próxima Menstruação */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">🩸</span>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm font-semibold">Em breve</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1">Próxima Menstruação</h3>
          <p className="text-2xl font-bold mt-2">
            {currentCycle?.proximaMenstruacao 
              ? new Date(currentCycle.proximaMenstruacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
              : 'N/A'
            }
          </p>
        </div>

        {/* Card: Período Fértil */}
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💫</span>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm font-semibold">Ativo</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1">Período Fértil</h3>
          <p className="text-sm mt-2">{currentCycle?.periodoFertil || 'Não calculado'}</p>
          {currentCycle?.ovulacaoEsperada && (
            <p className="text-xs mt-1 opacity-90">
              Ovulação: {new Date(currentCycle.ovulacaoEsperada).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
      </div>

      {/* Seção: Bem-estar do Dia */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💝</span> Bem-estar de Hoje
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Energia', value: 'Média', icon: '⚡', color: 'yellow' },
            { label: 'Humor', value: 'Bom', icon: '😊', color: 'green' },
            { label: 'Cólicas', value: 'Leves', icon: '🤕', color: 'orange' },
            { label: 'Libido', value: 'Normal', icon: '💕', color: 'pink' },
          ].map((item, idx) => (
            <div key={idx} className={`bg-${item.color}-50 border-2 border-${item.color}-200 rounded-lg p-4 text-center`}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-700 text-sm mb-1">{item.label}</div>
              <div className={`text-lg font-bold text-${item.color}-600`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção: Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> Média do Ciclo (Últimos 3 meses)
          </h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Duração Média</div>
              <div className="text-3xl font-bold text-pink-600">28 dias</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Duração da Menstruação</div>
              <div className="text-3xl font-bold text-purple-600">5 dias</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-pink-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> Metas de Bem-estar
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Dias de exercício este mês', value: 8, total: 15, color: 'green' },
              { label: 'Dias com sono adequado', value: 20, total: 28, color: 'blue' },
            ].map((meta, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{meta.label}</span>
                  <span className="font-semibold text-gray-800">{meta.value}/{meta.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${meta.color}-500 h-2 rounded-full transition-all`}
                    style={{ width: `${(meta.value / meta.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-300 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span> Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Registrar Menstruação', icon: '🩸', color: 'red' },
            { label: 'Adicionar Sintoma', icon: '📝', color: 'pink' },
            { label: 'Ver Calendário', icon: '📅', color: 'purple' },
            { label: 'Gerar Relatório', icon: '📊', color: 'blue' },
          ].map((action, idx) => (
            <button
              key={idx}
              className={`bg-white border-2 border-${action.color}-300 rounded-lg p-4 hover:bg-${action.color}-50 transition-colors text-center`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

