'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAvaliacoesByCliente, AvaliacaoFisica } from '@/data/avaliacoesData';
import { getAllClientes, ClienteComFormulario } from '@/data/clientesData';
import { getConfiguracaoAtual, ConfiguracaoProfissional } from '@/data/configuracoesData';

interface ClientProgressReportProps {
  clienteId: string;
}

export default function ClientProgressReport({ clienteId }: ClientProgressReportProps) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
  const [cliente, setCliente] = useState<ClienteComFormulario | null>(null);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoProfissional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [avaliacoesData, clientesData, configData] = await Promise.all([
        getAvaliacoesByCliente(clienteId),
        getAllClientes(),
        getConfiguracaoAtual(),
      ]);

      setAvaliacoes(avaliacoesData);
      const clienteFound = clientesData.find((c) => c.id === clienteId);
      setCliente(clienteFound || null);
      setConfiguracao(configData);
      setLoading(false);
    }

    if (clienteId) {
      loadData();
    }
  }, [clienteId]);

  // Preparar dados para os gráficos
  const chartData = avaliacoes.map((av) => ({
    data: new Date(av.data_avaliacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    }),
    peso: av.peso ? Number(av.peso) : null,
    gordura: av.percentual_gordura ? Number(av.percentual_gordura) : null,
    musculo: av.percentual_musculo ? Number(av.percentual_musculo) : null,
    visceral: av.gordura_visceral ? Number(av.gordura_visceral) : null,
    metabolismo: av.metabolismo_basal ? Number(av.metabolismo_basal) : null,
    cintura: av.cintura ? Number(av.cintura) : null,
    quadril: av.quadril ? Number(av.quadril) : null,
    busto: av.busto ? Number(av.busto) : null,
    coxa: av.coxa ? Number(av.coxa) : null,
    braco: av.braco ? Number(av.braco) : null,
  }));

  // Calcular evolução
  const primeiraAvaliacao = avaliacoes[0];
  const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1];

  const evolucao = primeiraAvaliacao && ultimaAvaliacao ? {
    peso: ultimaAvaliacao.peso && primeiraAvaliacao.peso
      ? Number(ultimaAvaliacao.peso) - Number(primeiraAvaliacao.peso)
      : null,
    gordura: ultimaAvaliacao.percentual_gordura && primeiraAvaliacao.percentual_gordura
      ? Number(ultimaAvaliacao.percentual_gordura) - Number(primeiraAvaliacao.percentual_gordura)
      : null,
    musculo: ultimaAvaliacao.percentual_musculo && primeiraAvaliacao.percentual_musculo
      ? Number(ultimaAvaliacao.percentual_musculo) - Number(primeiraAvaliacao.percentual_musculo)
      : null,
  } : null;

  // Calcular IMC
  const calcularIMC = (peso: number | null, altura: number | null): number | null => {
    if (!peso || !altura) return null;
    return Number((peso / (altura * altura)).toFixed(1));
  };

  // Determinar status IMC
  const getIMCStatus = (imc: number | null) => {
    if (!imc) return { status: 'N/A', color: 'gray', label: 'Sem dados' };
    if (imc < 18.5) return { status: 'abaixo', color: 'yellow', label: 'Abaixo do peso' };
    if (imc < 25) return { status: 'normal', color: 'green', label: 'Peso normal' };
    if (imc < 30) return { status: 'sobrepeso', color: 'orange', label: 'Sobrepeso' };
    return { status: 'obesidade', color: 'red', label: 'Obesidade' };
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Cliente não encontrado</p>
      </div>
    );
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold mb-2">Nenhuma avaliação encontrada</h3>
        <p className="text-gray-600">Este cliente ainda não possui avaliações físicas registradas.</p>
      </div>
    );
  }

  const imcAtual = calcularIMC(ultimaAvaliacao?.peso || null, ultimaAvaliacao?.altura || null);
  const imcStatus = getIMCStatus(imcAtual);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header do Relatório com Logo */}
      <div 
        className="bg-gradient-to-r text-white p-6 rounded-xl"
        style={{
          background: configuracao?.cores_tema?.primaria && configuracao?.cores_tema?.secundaria
            ? `linear-gradient(to right, ${configuracao.cores_tema.primaria}, ${configuracao.cores_tema.secundaria})`
            : 'linear-gradient(to right, #2563eb, #9333ea)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          {configuracao?.logo_url && (
            <img
              src={configuracao.logo_url}
              alt={configuracao.nome_empresa || 'Logo'}
              className="h-16 md:h-20 object-contain bg-white/10 p-2 rounded-lg"
            />
          )}
          <div className="flex-1 ml-4">
            {configuracao?.nome_empresa && (
              <p className="text-sm md:text-base opacity-90 mb-1">{configuracao.nome_empresa}</p>
            )}
            {configuracao?.nome_profissional && !configuracao?.nome_empresa && (
              <p className="text-sm md:text-base opacity-90 mb-1">{configuracao.nome_profissional}</p>
            )}
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{cliente.nome}</h2>
        <p className="text-blue-100 opacity-90">
          Relatório de Progresso - {avaliacoes.length} avaliação{avaliacoes.length > 1 ? 'ões' : ''} registrada{avaliacoes.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Evolução de Peso</div>
          <div className={`text-2xl font-bold ${
            evolucao?.peso !== null && evolucao.peso !== undefined && evolucao.peso < 0 ? 'text-green-600' : 
            evolucao?.peso !== null && evolucao.peso !== undefined && evolucao.peso > 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {evolucao?.peso !== null && evolucao.peso !== undefined
              ? `${evolucao.peso > 0 ? '+' : ''}${evolucao.peso.toFixed(1)} kg`
              : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {primeiraAvaliacao?.peso} kg → {ultimaAvaliacao?.peso} kg
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">IMC Atual</div>
          <div className={`text-2xl font-bold ${
            imcStatus.color === 'green' ? 'text-green-600' :
            imcStatus.color === 'yellow' ? 'text-yellow-600' :
            imcStatus.color === 'orange' ? 'text-orange-600' :
            imcStatus.color === 'red' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {imcAtual || 'N/A'}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
            imcStatus.color === 'green' ? 'bg-green-100 text-green-700' :
            imcStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
            imcStatus.color === 'orange' ? 'bg-orange-100 text-orange-700' :
            imcStatus.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {imcStatus.label}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Período de Acompanhamento</div>
          <div className="text-xl font-bold text-gray-800">
            {primeiraAvaliacao && ultimaAvaliacao
              ? `${Math.ceil(
                  (new Date(ultimaAvaliacao.data_avaliacao).getTime() -
                    new Date(primeiraAvaliacao.data_avaliacao).getTime()) /
                    (1000 * 60 * 60 * 24)
                )} dias`
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Gráfico de Peso */}
      {chartData.some((d) => d.peso !== null) && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">📈 Evolução do Peso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Peso (kg)"
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Gordura vs Músculo */}
      {chartData.some((d) => d.gordura !== null || d.musculo !== null) && (
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">📊 Composição Corporal (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="gordura"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                name="% Gordura"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="musculo"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                name="% Músculo"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Medidas */}
      {chartData.some((d) => d.cintura !== null || d.quadril !== null) && (
        <div className="bg-white border-2 border-green-200 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">📏 Evolução de Medidas (cm)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData.some((d) => d.cintura !== null) && (
                <Line
                  type="monotone"
                  dataKey="cintura"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Cintura"
                  dot={{ r: 4 }}
                />
              )}
              {chartData.some((d) => d.quadril !== null) && (
                <Line
                  type="monotone"
                  dataKey="quadril"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Quadril"
                  dot={{ r: 4 }}
                />
              )}
              {chartData.some((d) => d.busto !== null) && (
                <Line
                  type="monotone"
                  dataKey="busto"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Busto"
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Indicadores Visuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Indicador IMC */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-bold mb-3 text-gray-700">🎯 IMC - Indicador</h3>
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute h-full transition-all duration-500 ${
                imcStatus.color === 'green' ? 'bg-green-500' :
                imcStatus.color === 'yellow' ? 'bg-yellow-500' :
                imcStatus.color === 'orange' ? 'bg-orange-500' :
                imcStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
              }`}
              style={{
                width: imcAtual ? `${Math.min((imcAtual / 40) * 100, 100)}%` : '0%',
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-gray-600">18.5</span>
            <span className="text-gray-600">25</span>
            <span className="text-gray-600">30</span>
          </div>
          <div className="mt-2 text-center">
            <span className="font-semibold text-gray-800">
              {imcAtual || 'Sem dados'} - {imcStatus.label}
            </span>
          </div>
        </div>

        {/* Indicador Gordura Visceral */}
        {ultimaAvaliacao?.gordura_visceral && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold mb-3 text-gray-700">🔴 Gordura Visceral</h3>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute h-full transition-all duration-500 ${
                  Number(ultimaAvaliacao.gordura_visceral) <= 10
                    ? 'bg-green-500'
                    : Number(ultimaAvaliacao.gordura_visceral) <= 13
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min((Number(ultimaAvaliacao.gordura_visceral) / 20) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <div className="mt-2 text-center">
              <span className="font-semibold text-gray-800">
                {ultimaAvaliacao.gordura_visceral} -{' '}
                {Number(ultimaAvaliacao.gordura_visceral) <= 10
                  ? 'Normal'
                  : Number(ultimaAvaliacao.gordura_visceral) <= 13
                  ? 'Atenção'
                  : 'Alto Risco'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Compartilhamento */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📤 Compartilhar Relatório</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const texto = `Relatório de Progresso - ${cliente.nome}`;
              const url = `whatsapp://send?text=${encodeURIComponent(texto)}`;
              window.open(url, '_blank');
            }}
            className="flex-1 min-w-[150px] px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span>📱</span>
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => {
              const assunto = `Relatório de Progresso - ${cliente.nome}`;
              const body = `Olá, segue o relatório de progresso de ${cliente.nome}.`;
              const url = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(body)}`;
              window.open(url);
            }}
            className="flex-1 min-w-[150px] px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span>📧</span>
            <span>Email</span>
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 min-w-[150px] px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            <span>Imprimir/PDF</span>
          </button>
        </div>
      </div>

      {/* Rodapé com Informações de Contato */}
      {configuracao && (configuracao.email || configuracao.telefone || configuracao.whatsapp || configuracao.instagram || configuracao.site || configuracao.endereco) && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6 mt-6">
          <h3 className="text-sm font-bold mb-3 text-gray-700 uppercase tracking-wide">
            Informações de Contato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            {configuracao.email && (
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a href={`mailto:${configuracao.email}`} className="hover:text-blue-600">
                  {configuracao.email}
                </a>
              </div>
            )}
            {configuracao.telefone && (
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${configuracao.telefone}`} className="hover:text-blue-600">
                  {configuracao.telefone}
                </a>
              </div>
            )}
            {configuracao.whatsapp && (
              <div className="flex items-center gap-2">
                <span>💬</span>
                <a
                  href={`https://wa.me/${configuracao.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600"
                >
                  {configuracao.whatsapp}
                </a>
              </div>
            )}
            {configuracao.instagram && (
              <div className="flex items-center gap-2">
                <span>📸</span>
                <a
                  href={`https://instagram.com/${configuracao.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600"
                >
                  {configuracao.instagram}
                </a>
              </div>
            )}
            {configuracao.site && (
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <a
                  href={configuracao.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {configuracao.site}
                </a>
              </div>
            )}
            {configuracao.endereco && (
              <div className="flex items-start gap-2 md:col-span-2">
                <span>📍</span>
                <span>
                  {configuracao.endereco}
                  {configuracao.cidade && `, ${configuracao.cidade}`}
                  {configuracao.estado && ` - ${configuracao.estado}`}
                  {configuracao.cep && ` - CEP: ${configuracao.cep}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

