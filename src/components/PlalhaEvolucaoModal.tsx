'use client';

import { useState } from 'react';

interface EvolucaoData {
  id: string;
  data: string;
  peso: number;
  massa_gorda: number;
  massa_magra: number;
  visceral: number;
  busto: number;
  cintura: number;
  barriga: number;
  quadril: number;
  coxa: number;
  braco: number;
  pescoco: number;
}

interface PlalhaEvolucaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNome: string;
}

export default function PlalhaEvolucaoModal({ isOpen, onClose, clienteId, clienteNome }: PlalhaEvolucaoModalProps) {
  // Dados mock - em produção viria do Supabase
  const [evolucoes, setEvolucoes] = useState<EvolucaoData[]>([
    {
      id: '1',
      data: '2025-01-15',
      peso: 75.0,
      massa_gorda: 25.5,
      massa_magra: 49.5,
      visceral: 8.5,
      busto: 95,
      cintura: 88,
      barriga: 95,
      quadril: 102,
      coxa: 58,
      braco: 32,
      pescoco: 35
    },
    {
      id: '2',
      data: '2025-02-15',
      peso: 73.0,
      massa_gorda: 23.8,
      massa_magra: 50.2,
      visceral: 7.2,
      busto: 93,
      cintura: 85,
      barriga: 90,
      quadril: 99,
      coxa: 56,
      braco: 31.5,
      pescoco: 34.5
    },
    {
      id: '3',
      data: '2025-03-15',
      peso: 70.5,
      massa_gorda: 22.1,
      massa_magra: 48.4,
      visceral: 6.5,
      busto: 92,
      cintura: 82,
      barriga: 87,
      quadril: 96,
      coxa: 55,
      braco: 31,
      pescoco: 34
    }
  ]);

  const calcularDiferenca = (atual: number, anterior: number) => {
    const diff = atual - anterior;
    return diff;
  };

  const formatarDiferenca = (diff: number) => {
    if (diff > 0) return `+${diff.toFixed(1)}`;
    if (diff < 0) return `${diff.toFixed(1)}`;
    return '0.0';
  };

  const getColorClass = (diff: number) => {
    if (diff < 0) return 'text-green-600 bg-green-50'; // Redução = bom
    if (diff > 0) return 'text-red-600 bg-red-50'; // Aumento
    return 'text-gray-600 bg-gray-50';
  };

  const calcularPercentualPerda = (atual: number, inicial: number) => {
    return ((atual - inicial) / inicial * 100).toFixed(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
          <div>
            <h2 className="text-2xl font-bold text-amber-700">
              📊 Planilha de Evolução - {clienteNome}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Acompanhamento detalhado do progresso do cliente</p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Métricas Gerais */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Peso Total</div>
              <div className="text-2xl font-bold text-blue-700">
                {evolucoes.length > 0 ? evolucoes[evolucoes.length - 1].peso : 0}kg
              </div>
              <div className={`text-xs mt-1 ${evolucoes.length > 1 ? 
                getColorClass(evolucoes[evolucoes.length - 1].peso - evolucoes[evolucoes.length - 2].peso) : 
                'text-gray-500'
              } px-2 py-1 rounded`}>
                {evolucoes.length > 1 ? 
                  `${formatarDiferenca(evolucoes[evolucoes.length - 1].peso - evolucoes[evolucoes.length - 2].peso)}kg`
                  : 'Sem comparação'
                }
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Massa Gorda</div>
              <div className="text-2xl font-bold text-purple-700">
                {evolucoes.length > 0 ? evolucoes[evolucoes.length - 1].massa_gorda : 0}%
              </div>
              <div className={`text-xs mt-1 ${evolucoes.length > 1 ? 
                getColorClass(evolucoes[evolucoes.length - 1].massa_gorda - evolucoes[evolucoes.length - 2].massa_gorda) : 
                'text-gray-500'
              } px-2 py-1 rounded`}>
                {evolucoes.length > 1 ? 
                  `${formatarDiferenca(evolucoes[evolucoes.length - 1].massa_gorda - evolucoes[evolucoes.length - 2].massa_gorda)}%`
                  : 'Sem comparação'
                }
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Massa Magra</div>
              <div className="text-2xl font-bold text-green-700">
                {evolucoes.length > 0 ? evolucoes[evolucoes.length - 1].massa_magra : 0}%
              </div>
              <div className={`text-xs mt-1 ${evolucoes.length > 1 ? 
                getColorClass(evolucoes[evolucoes.length - 2].massa_magra - evolucoes[evolucoes.length - 1].massa_magra) : 
                'text-gray-500'
              } px-2 py-1 rounded`}>
                {evolucoes.length > 1 ? 
                  `${formatarDiferenca(evolucoes[evolucoes.length - 1].massa_magra - evolucoes[evolucoes.length - 2].massa_magra)}%`
                  : 'Sem comparação'
                }
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border-2 border-amber-200">
              <div className="text-sm text-gray-600 mb-1">Visceral</div>
              <div className="text-2xl font-bold text-amber-700">
                {evolucoes.length > 0 ? evolucoes[evolucoes.length - 1].visceral : 0}
              </div>
              <div className={`text-xs mt-1 ${evolucoes.length > 1 ? 
                getColorClass(evolucoes[evolucoes.length - 1].visceral - evolucoes[evolucoes.length - 2].visceral) : 
                'text-gray-500'
              } px-2 py-1 rounded`}>
                {evolucoes.length > 1 ? 
                  `${formatarDiferenca(evolucoes[evolucoes.length - 1].visceral - evolucoes[evolucoes.length - 2].visceral)}`
                  : 'Sem comparação'
                }
              </div>
            </div>
          </div>

          {/* Tabela de Evolução */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                    <th className="px-4 py-3 text-left font-bold">Data</th>
                    <th className="px-3 py-3 text-center font-bold">Peso (kg)</th>
                    <th className="px-3 py-3 text-center font-bold">M. Gorda (%)</th>
                    <th className="px-3 py-3 text-center font-bold">M. Magra (%)</th>
                    <th className="px-3 py-3 text-center font-bold">Visceral</th>
                    <th className="px-3 py-3 text-center font-bold">Busto</th>
                    <th className="px-3 py-3 text-center font-bold">Cintura</th>
                    <th className="px-3 py-3 text-center font-bold">Barriga</th>
                    <th className="px-3 py-3 text-center font-bold">Quadril</th>
                    <th className="px-3 py-3 text-center font-bold">Coxa</th>
                    <th className="px-3 py-3 text-center font-bold">Braço</th>
                    <th className="px-3 py-3 text-center font-bold">Pescoço</th>
                  </tr>
                </thead>
                <tbody>
                  {evolucoes.map((evolucao, index) => {
                    const anterior = index > 0 ? evolucoes[index - 1] : null;
                    return (
                      <tr key={evolucao.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-semibold">
                          {new Date(evolucao.data).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.peso.toFixed(1)}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.peso - anterior.peso)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.peso - anterior.peso)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.massa_gorda.toFixed(1)}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.massa_gorda - anterior.massa_gorda)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.massa_gorda - anterior.massa_gorda)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.massa_magra.toFixed(1)}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.massa_magra - anterior.massa_magra)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.massa_magra - anterior.massa_magra)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.visceral.toFixed(1)}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.visceral - anterior.visceral)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.visceral - anterior.visceral)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.busto}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.busto - anterior.busto)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.busto - anterior.busto)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.cintura}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.cintura - anterior.cintura)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.cintura - anterior.cintura)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.barriga}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.barriga - anterior.barriga)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.barriga - anterior.barriga)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.quadril}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.quadril - anterior.quadril)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.quadril - anterior.quadril)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.coxa}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.coxa - anterior.coxa)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.coxa - anterior.coxa)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.braco}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.braco - anterior.braco)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.braco - anterior.braco)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{evolucao.pescoco}</span>
                            {anterior && (
                              <span className={`text-xs ${getColorClass(evolucao.pescoco - anterior.pescoco)} px-2 py-0.5 rounded`}>
                                {formatarDiferenca(evolucao.pescoco - anterior.pescoco)}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo de Perda Total */}
          {evolucoes.length > 1 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-700 mb-4">📈 Resumo de Perda Total</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Peso Total Perdido</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatarDiferenca(evolucoes[evolucoes.length - 1].peso - evolucoes[0].peso)}kg
                  </div>
                  <div className="text-xs text-gray-500">
                    {calcularPercentualPerda(evolucoes[evolucoes.length - 1].peso, evolucoes[0].peso)}% de redução
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Cintura Reduzida</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatarDiferenca(evolucoes[evolucoes.length - 1].cintura - evolucoes[0].cintura)}cm
                  </div>
                  <div className="text-xs text-gray-500">
                    De {evolucoes[0].cintura}cm para {evolucoes[evolucoes.length - 1].cintura}cm
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Quadril Reduzido</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatarDiferenca(evolucoes[evolucoes.length - 1].quadril - evolucoes[0].quadril)}cm
                  </div>
                  <div className="text-xs text-gray-500">
                    De {evolucoes[0].quadril}cm para {evolucoes[evolucoes.length - 1].quadril}cm
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dias de Acompanhamento</div>
                  <div className="text-2xl font-bold text-green-700">
                    {Math.floor((new Date(evolucoes[evolucoes.length - 1].data).getTime() - new Date(evolucoes[0].data).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </div>
                  <div className="text-xs text-gray-500">
                    Desde {new Date(evolucoes[0].data).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão Fechar */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

