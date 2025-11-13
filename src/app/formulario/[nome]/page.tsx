'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { salvarFormularioPublico, FormularioPublicoData } from '@/data/formulariosPublicosData';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function FormularioPublicoPage() {
  const params = useParams();
  const nomeUrl = params.nome as string;

  const [nutricionistaEmail, setNutricionistaEmail] = useState<string>('');
  const [nutricionistaNome, setNutricionistaNome] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormularioPublicoData>({
    nome_completo: '',
    endereco_completo: '',
    whatsapp: '',
    instagram: '',
    email: '',
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
    async function validarNutricionista() {
      if (!nomeUrl) {
        setError('Nome do nutricionista não fornecido');
        setLoading(false);
        return;
      }

      // Converter nome da URL para email
      // Ex: "deise-faula" -> "deisefaula@gmail.com"
      // Ou buscar pelo nome na URL
      const email = `${nomeUrl.replace(/-/g, '')}@gmail.com`;
      
      // Verificar se usuário existe
      try {
        const { data, error: rpcError } = await supabase.rpc('buscar_user_id_por_email', {
          email_param: email.toLowerCase(),
        });

        if (rpcError || !data) {
          // Tentar outras variações
          const alternativas = [
            email,
            `${nomeUrl}@gmail.com`,
            `deisefaula@gmail.com`, // Fallback para teste
          ];

          let userIdEncontrado = null;
          for (const altEmail of alternativas) {
            const { data: altData } = await supabase.rpc('buscar_user_id_por_email', {
              email_param: altEmail.toLowerCase(),
            });
            if (altData) {
              userIdEncontrado = altData;
              setNutricionistaEmail(altEmail);
              break;
            }
          }

          if (!userIdEncontrado) {
            setError('Nutricionista não encontrado. Verifique a URL.');
            setLoading(false);
            return;
          }
        } else {
          setNutricionistaEmail(email);
        }

        setNutricionistaNome(nomeUrl.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setLoading(false);
      } catch (err) {
        setError('Erro ao validar nutricionista');
        setLoading(false);
      }
    }

    validarNutricionista();
  }, [nomeUrl]);

  const handleChange = (field: keyof FormularioPublicoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 handleSubmit chamado!');
    console.log('📋 Estado atual:', { submitting, loading, nutricionistaEmail });
    
    if (submitting || loading) {
      console.log('⚠️ Já está enviando ou carregando, ignorando...');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.nome_completo || (!formData.email && !formData.whatsapp)) {
        setError('Por favor, preencha pelo menos nome completo e email ou WhatsApp');
        setSubmitting(false);
        return;
      }

      if (!nutricionistaEmail) {
        setError('Erro: Email do nutricionista não encontrado. Verifique a URL.');
        setSubmitting(false);
        return;
      }

      console.log('📤 Enviando formulário...');
      console.log('📋 Dados do formulário:', formData);
      console.log('📧 Email do nutricionista:', nutricionistaEmail);
      
      const resultado = await salvarFormularioPublico(nutricionistaEmail, formData);
      console.log('📥 Resultado do salvamento:', resultado);
      console.log('✅ Success flag:', resultado.success);

      if (resultado.success) {
        console.log('✅ Sucesso! Exibindo mensagem de parabéns...');
        // Limpar formulário primeiro
        setFormData({
          nome_completo: '',
          endereco_completo: '',
          whatsapp: '',
          instagram: '',
          email: '',
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
        // Definir sucesso DEPOIS de limpar o formulário
        setError('');
        setSuccess(true);
        setSubmitting(false);
        console.log('✅ Estado success definido como true');
      } else {
        console.error('❌ Erro ao salvar formulário:', resultado.error);
        setError(resultado.error || 'Erro ao enviar formulário. Tente novamente.');
        setSuccess(false);
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error('❌ Erro inesperado ao enviar formulário:', err);
      setError(err.message || 'Erro inesperado ao enviar formulário. Tente novamente.');
      setSuccess(false);
      setSubmitting(false);
    }
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

  // Verificar sucesso PRIMEIRO (antes de qualquer erro)
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 max-w-lg text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
            Parabéns! 🎊
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-4">
            Seu formulário foi preenchido com sucesso!
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              ✨ Obrigado por preencher o formulário de pré-consulta!<br />
              📋 Recebemos todos os seus dados com sucesso.<br />
              💚 {nutricionistaNome || 'O nutricionista'} entrará em contato em breve para dar continuidade ao seu acompanhamento!
            </p>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            <p>📱 Aguarde nosso contato pelo WhatsApp ou email informado.</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar erro de link inválido DEPOIS do sucesso
  if (error && !nutricionistaEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Link Inválido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
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
          {nutricionistaNome && (
            <p className="text-sm text-gray-500 mt-2">
              Nutricionista: <span className="font-semibold">{nutricionistaNome}</span>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome_completo}
                  onChange={(e) => handleChange('nome_completo', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={formData.endereco_completo}
                  onChange={(e) => handleChange('endereco_completo', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="@seuinstagram"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados Físicos */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-xl font-bold text-green-700 mb-4">⚖️ Dados Físicos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Como Conheceu e Trabalho */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">💼 Informações Profissionais</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Com o que trabalha?</label>
                <input
                  type="text"
                  value={formData.trabalho}
                  onChange={(e) => handleChange('trabalho', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qual seu horário de trabalho e quais dias da semana?</label>
                <input
                  type="text"
                  value={formData.horario_trabalho}
                  onChange={(e) => handleChange('horario_trabalho', e.target.value)}
                  placeholder="Ex: 8h às 17h, Segunda a Sexta"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rotina de Sono */}
          <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">😴 Rotina de Sono</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Que horas acorda?</label>
                <input
                  type="text"
                  value={formData.hora_acorda}
                  onChange={(e) => handleChange('hora_acorda', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: 6h"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Que horas dorme?</label>
                <input
                  type="text"
                  value={formData.hora_dorme}
                  onChange={(e) => handleChange('hora_dorme', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: 23h"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualidade do sono</label>
                <select
                  value={formData.qualidade_sono}
                  onChange={(e) => handleChange('qualidade_sono', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="profundo">Profundo</option>
                  <option value="leve">Leve</option>
                  <option value="acorda à noite">Acorda à noite</option>
                  <option value="insônia">Insônia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vida Pessoal */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h2 className="text-xl font-bold text-pink-700 mb-4">👨‍👩‍👧 Vida Pessoal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">É casada?</label>
                <input
                  type="text"
                  value={formData.casada}
                  onChange={(e) => handleChange('casada', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  placeholder="Sim/Não"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tem filhos? Se sim, nomes e idades</label>
                <textarea
                  value={formData.nomes_idades_filhos}
                  onChange={(e) => handleChange('nomes_idades_filhos', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  placeholder="Ex: João, 8 anos; Maria, 5 anos"
                />
              </div>
            </div>
          </div>

          {/* Saúde e Suplementação */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h2 className="text-xl font-bold text-red-700 mb-4">🔹 SAÚDE E SUPLEMENTAÇÃO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Possui alguma condição de saúde diagnosticada? (pressão, colesterol, tireoide, glicemia, ansiedade...)</label>
                <textarea
                  value={formData.condicao_saude}
                  onChange={(e) => handleChange('condicao_saude', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faz uso de medicação? Qual e para quê?</label>
                  <input
                    type="text"
                    value={formData.uso_medicacao}
                    onChange={(e) => handleChange('uso_medicacao', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qual medicação?</label>
                  <input
                    type="text"
                    value={formData.medicacao_qual}
                    onChange={(e) => handleChange('medicacao_qual', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tem alguma restrição alimentar?</label>
                <input
                  type="text"
                  value={formData.restricao_alimentar}
                  onChange={(e) => handleChange('restricao_alimentar', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usa algum suplemento? Quais?</label>
                  <input
                    type="text"
                    value={formData.usa_suplemento}
                    onChange={(e) => handleChange('usa_suplemento', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quais suplementos?</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sente dor ou desconforto físico? Onde?</label>
                  <input
                    type="text"
                    value={formData.sente_dor}
                    onChange={(e) => handleChange('sente_dor', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Sim/Não"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Onde?</label>
                  <input
                    type="text"
                    value={formData.onde_dor}
                    onChange={(e) => handleChange('onde_dor', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rotina Alimentar */}
          <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
            <h2 className="text-xl font-bold text-orange-700 mb-4">🔹 ROTINA ALIMENTAR</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Café da manhã:</label>
                <textarea
                  value={formData.cafe_manha}
                  onChange={(e) => handleChange('cafe_manha', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lanche da manhã:</label>
                <textarea
                  value={formData.lanche_manha}
                  onChange={(e) => handleChange('lanche_manha', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Almoço:</label>
                <textarea
                  value={formData.almoco}
                  onChange={(e) => handleChange('almoco', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lanche da tarde:</label>
                <textarea
                  value={formData.lanche_tarde}
                  onChange={(e) => handleChange('lanche_tarde', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jantar:</label>
                <textarea
                  value={formData.jantar}
                  onChange={(e) => handleChange('jantar', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ceia:</label>
                <textarea
                  value={formData.ceia}
                  onChange={(e) => handleChange('ceia', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Costuma beber álcool ou refrigerante? Qual e com que frequência?</label>
                <input
                  type="text"
                  value={formData.alcool_freq}
                  onChange={(e) => handleChange('alcool_freq', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: Vinho tinto, 2x por semana"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consumo médio de água por dia:</label>
                  <input
                    type="text"
                    value={formData.consumo_agua}
                    onChange={(e) => handleChange('consumo_agua', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: 2 litros"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intestino funciona quantas vezes por semana?</label>
                  <input
                    type="text"
                    value={formData.intestino_vezes_semana}
                    onChange={(e) => handleChange('intestino_vezes_semana', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: Todos os dias"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Faz atividade física? Qual e com que frequência?</label>
                <input
                  type="text"
                  value={formData.atividade_fisica}
                  onChange={(e) => handleChange('atividade_fisica', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: Academia, 3x por semana"
                />
              </div>
            </div>
          </div>

          {/* Hábitos e Comportamentos */}
          <div className="border-2 border-teal-200 rounded-xl p-6 bg-teal-50">
            <h2 className="text-xl font-bold text-teal-700 mb-4">🔹 HÁBITOS E COMPORTAMENTOS</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qual refeição é mais difícil de manter saudável?</label>
                <input
                  type="text"
                  value={formData.refeicao_dificil}
                  onChange={(e) => handleChange('refeicao_dificil', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que costuma beliscar quando está ansiosa ou cansada?</label>
                <textarea
                  value={formData.belisca_quando}
                  onChange={(e) => handleChange('belisca_quando', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que costuma mudar na rotina nos finais de semana?</label>
                <textarea
                  value={formData.muda_fins_semana}
                  onChange={(e) => handleChange('muda_fins_semana', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Em uma escala de 0 a 10, quanto sente que está cuidando de si hoje?</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.escala_cuidado}
                  onChange={(e) => handleChange('escala_cuidado', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  placeholder="0 a 10"
                />
              </div>
            </div>
          </div>

          {/* Botão Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting || loading}
              onClick={(e) => {
                // Fallback: se o form não disparar o submit, tentar manualmente
                if (!e.defaultPrevented) {
                  console.log('🖱️ Botão clicado - disparando submit manual');
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(formEvent);
                  }
                }
              }}
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

