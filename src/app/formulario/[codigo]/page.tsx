'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getLinkPorCodigo } from '@/data/linksFormulariosData';
import { salvarFormularioPublico, FormularioPublicoData } from '@/data/formulariosPublicosData';
import type { LinkFormulario } from '@/data/linksFormulariosData';

export const dynamic = 'force-dynamic';

export default function FormularioPublicoPage() {
  const params = useParams();
  const codigo = params.codigo as string;

  const [link, setLink] = useState<LinkFormulario | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormularioPublicoData>({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    nome_completo: '',
    idade: '',
    altura: '',
    peso_atual: '',
    peso_desejado: '',
    conheceu_programa: '',
    trabalho: '',
    horario_trabalho: '',
    dias_trabalho: '',
    hora_acorda: '',
    hora_dorme: '',
    qualidade_sono: '',
    casada: '',
    filhos: '',
    nomes_idades_filhos: '',
    condicao_saude: '',
    uso_medicacao: '',
    medicacao_qual: '',
    restricao_alimentar: '',
    usa_suplemento: '',
    quais_suplementos: '',
    sente_dor: '',
    onde_dor: '',
    cafe_manha: '',
    lanche_manha: '',
    almoco: '',
    lanche_tarde: '',
    jantar: '',
    ceia: '',
    alcool_freq: '',
    consumo_agua: '',
    intestino_vezes_semana: '',
    atividade_fisica: '',
    refeicao_dificil: '',
    belisca_quando: '',
    muda_fins_semana: '',
    escala_cuidado: '',
  });

  useEffect(() => {
    async function validarLink() {
      if (!codigo) {
        setError('Código do link não fornecido');
        setLoading(false);
        return;
      }

      const linkData = await getLinkPorCodigo(codigo);
      
      if (!linkData) {
        setError('Link inválido ou inativo');
        setLoading(false);
        return;
      }

      setLink(linkData);
      setLoading(false);
    }

    validarLink();
  }, [codigo]);

  const handleChange = (field: keyof FormularioPublicoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Sincronizar nome_completo com nome se nome_completo estiver vazio
    if (field === 'nome' && !formData.nome_completo) {
      setFormData(prev => ({ ...prev, nome_completo: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validação básica
    if (!formData.nome_completo || !formData.email) {
      setError('Por favor, preencha pelo menos nome completo e email');
      setSubmitting(false);
      return;
    }

    const resultado = await salvarFormularioPublico(codigo.toUpperCase(), formData);

    if (resultado.success) {
      setSuccess(true);
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        whatsapp: '',
        instagram: '',
        nome_completo: '',
        idade: '',
        altura: '',
        peso_atual: '',
        peso_desejado: '',
        conheceu_programa: '',
        trabalho: '',
        horario_trabalho: '',
        dias_trabalho: '',
        hora_acorda: '',
        hora_dorme: '',
        qualidade_sono: '',
        casada: '',
        filhos: '',
        nomes_idades_filhos: '',
        condicao_saude: '',
        uso_medicacao: '',
        medicacao_qual: '',
        restricao_alimentar: '',
        usa_suplemento: '',
        quais_suplementos: '',
        sente_dor: '',
        onde_dor: '',
        cafe_manha: '',
        lanche_manha: '',
        almoco: '',
        lanche_tarde: '',
        jantar: '',
        ceia: '',
        alcool_freq: '',
        consumo_agua: '',
        intestino_vezes_semana: '',
        atividade_fisica: '',
        refeicao_dificil: '',
        belisca_quando: '',
        muda_fins_semana: '',
        escala_cuidado: '',
      });
    } else {
      setError(resultado.error || 'Erro ao enviar formulário. Tente novamente.');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Link Inválido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Verifique se o link está correto ou entre em contato com o nutricionista.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Formulário Enviado!</h1>
          <p className="text-gray-600 mb-6">
            Obrigado por preencher o formulário. Recebemos seus dados e entraremos em contato em breve!
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar Outro Formulário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 Formulário de Pré-Consulta
          </h1>
          <p className="text-gray-600">
            Preencha os dados abaixo para iniciar seu acompanhamento nutricional
          </p>
          {link?.nutricionista_nome && (
            <p className="text-sm text-gray-500 mt-2">
              Nutricionista: <span className="font-semibold">{link.nutricionista_nome}</span>
            </p>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Informações Básicas */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h2 className="text-xl font-bold text-blue-700 mb-4">👤 Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome_completo}
                  onChange={(e) => {
                    handleChange('nome_completo', e.target.value);
                    handleChange('nome', e.target.value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dados Físicos */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-xl font-bold text-green-700 mb-4">⚖️ Dados Físicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="text"
                  value={formData.idade}
                  onChange={(e) => handleChange('idade', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                <input
                  type="text"
                  value={formData.altura}
                  onChange={(e) => handleChange('altura', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Atual (kg)</label>
                <input
                  type="text"
                  value={formData.peso_atual}
                  onChange={(e) => handleChange('peso_atual', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Desejado (kg)</label>
                <input
                  type="text"
                  value={formData.peso_desejado}
                  onChange={(e) => handleChange('peso_desejado', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rotina Alimentar */}
          <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
            <h2 className="text-xl font-bold text-orange-700 mb-4">🍽️ Rotina Alimentar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Café da Manhã</label>
                <textarea
                  value={formData.cafe_manha}
                  onChange={(e) => handleChange('cafe_manha', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Descreva o que você costuma comer no café da manhã"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lanche da Manhã</label>
                <textarea
                  value={formData.lanche_manha}
                  onChange={(e) => handleChange('lanche_manha', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Almoço</label>
                <textarea
                  value={formData.almoco}
                  onChange={(e) => handleChange('almoco', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Descreva o que você costuma comer no almoço"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lanche da Tarde</label>
                <textarea
                  value={formData.lanche_tarde}
                  onChange={(e) => handleChange('lanche_tarde', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jantar</label>
                <textarea
                  value={formData.jantar}
                  onChange={(e) => handleChange('jantar', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ceia</label>
                <textarea
                  value={formData.ceia}
                  onChange={(e) => handleChange('ceia', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consumo de Água (litros/dia)</label>
                  <input
                    type="text"
                    value={formData.consumo_agua}
                    onChange={(e) => handleChange('consumo_agua', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: 2 litros"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Atividade Física</label>
                  <input
                    type="text"
                    value={formData.atividade_fisica}
                    onChange={(e) => handleChange('atividade_fisica', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: Academia 3x por semana"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">📝 Informações Adicionais</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Como conheceu o programa?</label>
                <input
                  type="text"
                  value={formData.conheceu_programa}
                  onChange={(e) => handleChange('conheceu_programa', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trabalho</label>
                  <input
                    type="text"
                    value={formData.trabalho}
                    onChange={(e) => handleChange('trabalho', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Trabalho</label>
                  <input
                    type="text"
                    value={formData.horario_trabalho}
                    onChange={(e) => handleChange('horario_trabalho', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 8h às 17h"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Trabalho</label>
                <input
                  type="text"
                  value={formData.dias_trabalho}
                  onChange={(e) => handleChange('dias_trabalho', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Segunda a Sexta"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário que acorda</label>
                  <input
                    type="text"
                    value={formData.hora_acorda}
                    onChange={(e) => handleChange('hora_acorda', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 6h"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário que dorme</label>
                  <input
                    type="text"
                    value={formData.hora_dorme}
                    onChange={(e) => handleChange('hora_dorme', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 23h"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualidade do Sono</label>
                <input
                  type="text"
                  value={formData.qualidade_sono}
                  onChange={(e) => handleChange('qualidade_sono', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Boa, ruim, interrompido"
                />
              </div>
            </div>
          </div>

          {/* Saúde e Condições */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h2 className="text-xl font-bold text-red-700 mb-4">🏥 Saúde e Condições</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condição de Saúde</label>
                <textarea
                  value={formData.condicao_saude}
                  onChange={(e) => handleChange('condicao_saude', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Descreva qualquer condição de saúde ou doença crônica"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uso de Medicação</label>
                  <input
                    type="text"
                    value={formData.uso_medicacao}
                    onChange={(e) => handleChange('uso_medicacao', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qual Medicação?</label>
                  <input
                    type="text"
                    value={formData.medicacao_qual}
                    onChange={(e) => handleChange('medicacao_qual', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restrição Alimentar</label>
                <input
                  type="text"
                  value={formData.restricao_alimentar}
                  onChange={(e) => handleChange('restricao_alimentar', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Ex: Intolerância à lactose, alergia a glúten"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usa Suplemento?</label>
                  <input
                    type="text"
                    value={formData.usa_suplemento}
                    onChange={(e) => handleChange('usa_suplemento', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quais Suplementos?</label>
                  <input
                    type="text"
                    value={formData.quais_suplementos}
                    onChange={(e) => handleChange('quais_suplementos', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sente Dores?</label>
                  <input
                    type="text"
                    value={formData.sente_dor}
                    onChange={(e) => handleChange('sente_dor', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Onde sente dor?</label>
                  <input
                    type="text"
                    value={formData.onde_dor}
                    onChange={(e) => handleChange('onde_dor', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intestino (vezes por semana)</label>
                <input
                  type="text"
                  value={formData.intestino_vezes_semana}
                  onChange={(e) => handleChange('intestino_vezes_semana', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Ex: Todos os dias, 3x por semana"
                />
              </div>
            </div>
          </div>

          {/* Botão Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '📤 Enviando...' : '✅ Enviar Formulário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

