'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { buscarClientePorCodigoReavaliacao, salvarReavaliacao } from '@/data/reavaliacoesData';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ReavaliacaoPage() {
  const params = useParams();
  const codigo = params.codigo as string;

  const [cliente, setCliente] = useState<{ id: string; nome: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [respostas, setRespostas] = useState({
    peso_atual: '',
    mudancas_corpo_disposicao: '',
    energia_dia: '',
    intestino_sono: '',
    rotina_alimentacao_organizada: '',
    refeicoes_faceis: '',
    refeicoes_desafiadoras: '',
    agua_suplementos: '',
    atividade_fisica: '',
    o_que_ajudou: '',
    o_que_atrapalhou: '',
    programa_ajudou: '',
    programa_ajudar_mais: '',
    mudar_estrategia: '',
    maior_foco_nova_fase: '',
  });

  useEffect(() => {
    async function validarCodigo() {
      if (!codigo) {
        setError('Código de reavaliação não fornecido');
        setLoading(false);
        return;
      }

      const clienteData = await buscarClientePorCodigoReavaliacao(codigo);
      
      if (!clienteData) {
        setError('Código de reavaliação inválido');
        setLoading(false);
        return;
      }

      setCliente(clienteData);
      setLoading(false);
    }

    validarCodigo();
  }, [codigo]);

  const handleChange = (field: keyof typeof respostas, value: string) => {
    setRespostas(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Buscar user_id do cliente (através da tabela clientes)
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('user_id')
      .eq('id', cliente!.id)
      .single();

    if (!clienteData?.user_id) {
      setError('Erro ao identificar nutricionista');
      setSubmitting(false);
      return;
    }

    const resultado = await salvarReavaliacao(cliente!.id, clienteData.user_id, respostas);

    if (resultado.success) {
      setSuccess(true);
    } else {
      setError(resultado.error || 'Erro ao salvar reavaliação. Tente novamente.');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (error && !cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Código Inválido</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Reavaliação Enviada!</h1>
          <p className="text-gray-600 mb-6">
            Obrigado, {cliente?.nome}! Suas respostas foram salvas e serão utilizadas na sua próxima consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 Reavaliação - Pré Consulta
          </h1>
          <p className="text-gray-600">
            Olá, <span className="font-semibold">{cliente?.nome}</span>! Preencha o formulário abaixo antes da sua consulta.
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Peso Atual */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-xl font-bold text-green-700 mb-4">⚖️ Peso e Medidas</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quanto está pesando hoje?
              </label>
              <input
                type="text"
                value={respostas.peso_atual}
                onChange={(e) => handleChange('peso_atual', e.target.value)}
                placeholder="Ex: 65.5 kg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mudanças no Corpo */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h2 className="text-xl font-bold text-blue-700 mb-4">💪 Mudanças Percebidas</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Além do peso, quais mudanças você já percebeu no corpo ou na disposição?
              </label>
              <textarea
                value={respostas.mudancas_corpo_disposicao}
                onChange={(e) => handleChange('mudancas_corpo_disposicao', e.target.value)}
                rows={4}
                placeholder="Descreva as mudanças que você percebeu..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Energia */}
          <div className="border-2 border-yellow-200 rounded-xl p-6 bg-yellow-50">
            <h2 className="text-xl font-bold text-yellow-700 mb-4">⚡ Energia e Disposição</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como está sua energia ao longo do dia?
              </label>
              <textarea
                value={respostas.energia_dia}
                onChange={(e) => handleChange('energia_dia', e.target.value)}
                rows={3}
                placeholder="Descreva como está sua energia..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Intestino e Sono */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">😴 Saúde Digestiva e Sono</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como está o intestino e o sono atualmente?
              </label>
              <textarea
                value={respostas.intestino_sono}
                onChange={(e) => handleChange('intestino_sono', e.target.value)}
                rows={3}
                placeholder="Descreva como está funcionando..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rotina Alimentar */}
          <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
            <h2 className="text-xl font-bold text-orange-700 mb-4">🍽️ Rotina Alimentar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Está conseguindo manter uma rotina de alimentação organizada?
                </label>
                <textarea
                  value={respostas.rotina_alimentacao_organizada}
                  onChange={(e) => handleChange('rotina_alimentacao_organizada', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais refeições são mais fáceis de seguir? E quais ainda são mais desafiadoras?
                </label>
                <textarea
                  value={respostas.refeicoes_faceis}
                  onChange={(e) => handleChange('refeicoes_faceis', e.target.value)}
                  rows={2}
                  placeholder="Refeições mais fáceis..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none mb-2"
                />
                <textarea
                  value={respostas.refeicoes_desafiadoras}
                  onChange={(e) => handleChange('refeicoes_desafiadoras', e.target.value)}
                  rows={2}
                  placeholder="Refeições mais desafiadoras..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Água e Suplementos */}
          <div className="border-2 border-cyan-200 rounded-xl p-6 bg-cyan-50">
            <h2 className="text-xl font-bold text-cyan-700 mb-4">💧 Hidratação e Suplementação</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Está conseguindo manter a ingestão de água e o uso dos suplementos?
              </label>
              <textarea
                value={respostas.agua_suplementos}
                onChange={(e) => handleChange('agua_suplementos', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Atividade Física */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h2 className="text-xl font-bold text-pink-700 mb-4">🏃 Atividade Física</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Está conseguindo praticar alguma atividade física? Qual e com que frequência?
              </label>
              <textarea
                value={respostas.atividade_fisica}
                onChange={(e) => handleChange('atividade_fisica', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* O que Ajudou */}
          <div className="border-2 border-emerald-200 rounded-xl p-6 bg-emerald-50">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">✅ Pontos Positivos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  O que mais te ajudou nesse processo?
                </label>
                <textarea
                  value={respostas.o_que_ajudou}
                  onChange={(e) => handleChange('o_que_ajudou', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No que o Programa tem te ajudado?
                </label>
                <textarea
                  value={respostas.programa_ajudou}
                  onChange={(e) => handleChange('programa_ajudou', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Desafios */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h2 className="text-xl font-bold text-red-700 mb-4">⚠️ Desafios</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que mais te atrapalhou nas últimas semanas?
              </label>
              <textarea
                value={respostas.o_que_atrapalhou}
                onChange={(e) => handleChange('o_que_atrapalhou', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">🎯 Próximos Passos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  O que você gostaria que o programa te ajudasse mais?
                </label>
                <textarea
                  value={respostas.programa_ajudar_mais}
                  onChange={(e) => handleChange('programa_ajudar_mais', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tem algo que gostaria de mudar na estratégia (alimentação, treino, suplementação, rotina)?
                </label>
                <textarea
                  value={respostas.mudar_estrategia}
                  onChange={(e) => handleChange('mudar_estrategia', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual será seu maior foco para essa nova fase?
                </label>
                <textarea
                  value={respostas.maior_foco_nova_fase}
                  onChange={(e) => handleChange('maior_foco_nova_fase', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botão Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '📤 Enviando...' : '✅ Enviar Reavaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

