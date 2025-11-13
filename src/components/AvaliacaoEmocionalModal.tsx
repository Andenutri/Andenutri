'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import { salvarAvaliacaoEmocional, salvarAvaliacaoComportamental, updateAvaliacaoEmocional, updateAvaliacaoComportamental, getAvaliacoesComportamentaisCliente } from '@/data/avaliacoesEmocionaisData';
import { salvarFormularioPublico } from '@/data/formulariosPublicosData';
import { useAuth } from '@/contexts/AuthContext';

interface AvaliacaoEmocionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
  avaliacaoExistente?: any; // Avaliação existente para edição (opcional)
}

export default function AvaliacaoEmocionalModal({ isOpen, onClose, cliente, avaliacaoExistente }: AvaliacaoEmocionalModalProps) {
  const { user } = useAuth();
  const [dadosFormulario, setDadosFormulario] = useState(cliente?.formulario || {} as any);

  useEffect(() => {
    if (cliente?.formulario) {
      // Carregar dados do formulário automaticamente quando o modal abrir
      setDadosFormulario(cliente.formulario);
    }
  }, [cliente]);

  // Carregar avaliação existente se for edição
  useEffect(() => {
    if (avaliacaoExistente) {
      setHistoriaPessoa(avaliacaoExistente.historia_pessoa || '');
      setBlocoEmocional({
        momento_mudanca: avaliacaoExistente.momento_mudanca || '',
        incomoda_espelho: avaliacaoExistente.incomoda_espelho || '',
        situacao_corpo: avaliacaoExistente.situacao_corpo || '',
        atrapalha_dia_dia: avaliacaoExistente.atrapalha_dia_dia || '',
        maior_medo: avaliacaoExistente.maior_medo || '',
        por_que_eliminar_kilos: avaliacaoExistente.por_que_eliminar_kilos || '',
        tentou_antes: avaliacaoExistente.tentou_antes || '',
        oque_fara_peso_desejado: avaliacaoExistente.oque_fara_peso_desejado || '',
        tres_motivos: avaliacaoExistente.tres_motivos || '',
        nivel_comprometimento: String(avaliacaoExistente.nivel_comprometimento || '0'),
        conselho_si: avaliacaoExistente.conselho_si || '',
      });
    }
  }, [avaliacaoExistente]);
  
  const [blocoEmocional, setBlocoEmocional] = useState({
    momento_mudanca: '',
    incomoda_espelho: '',
    situacao_corpo: '',
    atrapalha_dia_dia: '',
    maior_medo: '',
    por_que_eliminar_kilos: '',
    tentou_antes: '',
    oque_fara_peso_desejado: '',
    tres_motivos: '',
    nivel_comprometimento: '0',
    conselho_si: '',
  });

  const [historiaPessoa, setHistoriaPessoa] = useState('');
  
  const [blocoComportamental, setBlocoComportamental] = useState({
    ponto_fraco_alimentacao: '',
    organizada_ou_improvisa: '',
    come_por_que: '',
    momentos_dificeis: '',
    prazer_alem_comida: '',
    premia_com_comida: '',
  });

  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!cliente) return;
    
    setSalvando(true);
    
    try {
      // 1. Salvar ou atualizar avaliação emocional no Supabase
      const dadosEmocional = {
        historia_pessoa: historiaPessoa || undefined,
        momento_mudanca: blocoEmocional.momento_mudanca || undefined,
        incomoda_espelho: blocoEmocional.incomoda_espelho || undefined,
        situacao_corpo: blocoEmocional.situacao_corpo || undefined,
        atrapalha_dia_dia: blocoEmocional.atrapalha_dia_dia || undefined,
        maior_medo: blocoEmocional.maior_medo || undefined,
        por_que_eliminar_kilos: blocoEmocional.por_que_eliminar_kilos || undefined,
        tentou_antes: blocoEmocional.tentou_antes || undefined,
        oque_fara_peso_desejado: blocoEmocional.oque_fara_peso_desejado || undefined,
        tres_motivos: blocoEmocional.tres_motivos || undefined,
        nivel_comprometimento: parseInt(blocoEmocional.nivel_comprometimento || '0'),
        conselho_si: blocoEmocional.conselho_si || undefined,
      };

      let resultadoEmocional;
      if (avaliacaoExistente?.id) {
        // Atualizar avaliação existente
        resultadoEmocional = await updateAvaliacaoEmocional(avaliacaoExistente.id, dadosEmocional);
      } else {
        // Criar nova avaliação
        resultadoEmocional = await salvarAvaliacaoEmocional({
          cliente_id: cliente.id,
          ...dadosEmocional,
        });
      }

      if (!resultadoEmocional.success) {
        alert(`❌ Erro ao ${avaliacaoExistente?.id ? 'atualizar' : 'salvar'} avaliação emocional: ${resultadoEmocional.error}`);
        return;
      }

      // 2. Salvar ou atualizar avaliação comportamental no Supabase
      const dadosComportamental = {
        ponto_fraco_alimentacao: blocoComportamental.ponto_fraco_alimentacao || undefined,
        organizada_ou_improvisa: blocoComportamental.organizada_ou_improvisa || undefined,
        come_por_que: blocoComportamental.come_por_que || undefined,
        momentos_dificeis: blocoComportamental.momentos_dificeis || undefined,
        prazer_alem_comida: blocoComportamental.prazer_alem_comida || undefined,
        premia_com_comida: blocoComportamental.premia_com_comida || undefined,
      };

      let resultadoComportamental;
      if (avaliacaoExistente?.id) {
        // Buscar avaliação comportamental existente
        const avaliacoesComportamentais = await getAvaliacoesComportamentaisCliente(cliente.id);
        const avaliacaoComportamentalExistente = avaliacoesComportamentais.find(av => av.cliente_id === cliente.id);
        
        if (avaliacaoComportamentalExistente?.id) {
          // Atualizar avaliação comportamental existente
          resultadoComportamental = await updateAvaliacaoComportamental(avaliacaoComportamentalExistente.id, dadosComportamental);
        } else {
          // Criar nova avaliação comportamental
          resultadoComportamental = await salvarAvaliacaoComportamental({
            cliente_id: cliente.id,
            ...dadosComportamental,
          });
        }
      } else {
        // Criar nova avaliação comportamental
        resultadoComportamental = await salvarAvaliacaoComportamental({
          cliente_id: cliente.id,
          ...dadosComportamental,
        });
      }

      if (!resultadoComportamental.success) {
        alert(`❌ Erro ao ${avaliacaoExistente?.id ? 'atualizar' : 'salvar'} avaliação comportamental: ${resultadoComportamental.error}`);
        return;
      }

      // 3. Se os dados do formulário foram editados, atualizar no Supabase
      if (user?.email && dadosFormulario) {
        // Atualizar formulário no Supabase através da função existente
        // Isso vai atualizar o cliente e o formulário_pre_consulta
        try {
          await salvarFormularioPublico(user.email, {
            nome_completo: dadosFormulario.nome_completo || cliente.nome || '',
            endereco_completo: dadosFormulario.endereco_completo || '',
            whatsapp: dadosFormulario.whatsapp || cliente.whatsapp || '',
            instagram: dadosFormulario.instagram || cliente.instagram || '',
            idade: dadosFormulario.idade || '',
            altura: dadosFormulario.altura || '',
            peso_atual: dadosFormulario.peso_atual || '',
            peso_desejado: dadosFormulario.peso_desejado || '',
            conheceu_programa: dadosFormulario.conheceu_programa || '',
            trabalho: dadosFormulario.trabalho || '',
            horario_trabalho: dadosFormulario.horario_trabalho || '',
            dias_trabalho: dadosFormulario.dias_trabalho || '',
            hora_acorda: dadosFormulario.hora_acorda || '',
            hora_dorme: dadosFormulario.hora_dorme || '',
            qualidade_sono: dadosFormulario.qualidade_sono || '',
            casada: dadosFormulario.casada || '',
            filhos: dadosFormulario.filhos || '',
            nomes_idades_filhos: dadosFormulario.nomes_idades_filhos || '',
            condicao_saude: dadosFormulario.condicao_saude || '',
            uso_medicacao: dadosFormulario.uso_medicacao || '',
            medicacao_qual: dadosFormulario.medicacao_qual || '',
            restricao_alimentar: dadosFormulario.restricao_alimentar || '',
            usa_suplemento: dadosFormulario.usa_suplemento || '',
            quais_suplementos: dadosFormulario.quais_suplementos || '',
            sente_dor: dadosFormulario.sente_dor || '',
            onde_dor: dadosFormulario.onde_dor || '',
            cafe_manha: dadosFormulario.cafe_manha || '',
            lanche_manha: dadosFormulario.lanche_manha || '',
            almoco: dadosFormulario.almoco || '',
            lanche_tarde: dadosFormulario.lanche_tarde || '',
            jantar: dadosFormulario.jantar || '',
            ceia: dadosFormulario.ceia || '',
            alcool_freq: dadosFormulario.alcool_freq || '',
            consumo_agua: dadosFormulario.consumo_agua || '',
            intestino_vezes_semana: dadosFormulario.intestino_vezes_semana || '',
            atividade_fisica: dadosFormulario.atividade_fisica || '',
            refeicao_dificil: dadosFormulario.refeicao_dificil || '',
            belisca_quando: dadosFormulario.belisca_quando || '',
            muda_fins_semana: dadosFormulario.muda_fins_semana || '',
            escala_cuidado: dadosFormulario.escala_cuidado || '',
          });
        } catch (error) {
          console.warn('Erro ao atualizar formulário (pode ser normal se cliente não existir ainda):', error);
          // Não bloquear se falhar, pois pode ser que o formulário não exista ainda
        }
      }

      alert(`✅ Avaliação emocional e comportamental ${avaliacaoExistente?.id ? 'atualizadas' : 'salvas'} com sucesso!`);
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('❌ Erro ao salvar avaliação. Verifique o console.');
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-amber-700">💚 Avaliação Emocional e Motivacional</h2>
            <p className="text-sm text-gray-600">
              Cliente: {cliente?.nome || 'Selecione um cliente'}
              {cliente && (
                <span className="ml-2 text-xs text-purple-600">
                  • {cliente.formulario?.peso_atual}kg → {cliente.formulario?.peso_desejado}kg
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dados da Pré-Consulta (Editável) - TODOS OS CAMPOS */}
          {cliente && cliente.formulario && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-700 mb-4">📋 Dados da Pré-Consulta (Editáveis)</h2>
              
              <div className="space-y-6">
                {/* Informações Gerais */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">🔹 Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input 
                        type="text"
                        value={dadosFormulario.nome_completo || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, nome_completo: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Idade</label>
                      <input 
                        type="text"
                        value={dadosFormulario.idade || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, idade: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Altura (cm)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.altura || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, altura: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Peso Atual (kg)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.peso_atual || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, peso_atual: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Peso Desejado (kg)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.peso_desejado || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, peso_desejado: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Conheceu por</label>
                      <input 
                        type="text"
                        value={dadosFormulario.conheceu_programa || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, conheceu_programa: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Endereço Completo</label>
                      <input 
                        type="text"
                        value={dadosFormulario.endereco_completo || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, endereco_completo: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
                      <input 
                        type="text"
                        value={dadosFormulario.whatsapp || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, whatsapp: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
                      <input 
                        type="text"
                        value={dadosFormulario.instagram || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, instagram: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Família */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">👨‍👩‍👧‍👦 Família</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">É casada?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.casada || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, casada: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tem filhos?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.filhos || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, filhos: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nomes e Idades dos Filhos</label>
                      <input 
                        type="text"
                        value={dadosFormulario.nomes_idades_filhos || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, nomes_idades_filhos: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotina e Trabalho */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">💼 Trabalho e Rotina</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Trabalho/Profissão</label>
                      <input 
                        type="text"
                        value={dadosFormulario.trabalho || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, trabalho: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Horário Trabalho</label>
                      <input 
                        type="text"
                        value={dadosFormulario.horario_trabalho || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, horario_trabalho: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dias Trabalho</label>
                      <input 
                        type="text"
                        value={dadosFormulario.dias_trabalho || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, dias_trabalho: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hora Acorda</label>
                      <input 
                        type="text"
                        value={dadosFormulario.hora_acorda || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, hora_acorda: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hora Dorme</label>
                      <input 
                        type="text"
                        value={dadosFormulario.hora_dorme || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, hora_dorme: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Qualidade Sono</label>
                      <input 
                        type="text"
                        value={dadosFormulario.qualidade_sono || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, qualidade_sono: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Saúde */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">🏥 Saúde</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Condição de Saúde</label>
                      <input 
                        type="text"
                        value={dadosFormulario.condicao_saude || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, condicao_saude: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Usa Medicação?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.uso_medicacao || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, uso_medicacao: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Qual Medicação?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.medicacao_qual || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, medicacao_qual: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Restrição Alimentar</label>
                      <input 
                        type="text"
                        value={dadosFormulario.restricao_alimentar || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, restricao_alimentar: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Usa Suplemento?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.usa_suplemento || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, usa_suplemento: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quais Suplementos?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.quais_suplementos || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, quais_suplementos: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sente dor ou desconforto?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.sente_dor || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, sente_dor: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Onde sente dor?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.onde_dor || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, onde_dor: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotina Alimentar */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">🍽️ Rotina Alimentar</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Café da Manhã</label>
                      <textarea 
                        value={dadosFormulario.cafe_manha || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, cafe_manha: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Lanche Manhã</label>
                      <textarea 
                        value={dadosFormulario.lanche_manha || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, lanche_manha: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Almoço</label>
                      <textarea 
                        value={dadosFormulario.almoco || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, almoco: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Lanche Tarde</label>
                      <textarea 
                        value={dadosFormulario.lanche_tarde || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, lanche_tarde: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Jantar</label>
                      <textarea 
                        value={dadosFormulario.jantar || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, jantar: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ceia</label>
                      <textarea 
                        value={dadosFormulario.ceia || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, ceia: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Álcool ou Refrigerante (tipo e frequência)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.alcool_freq || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, alcool_freq: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Consumo de Água (litros/dia)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.consumo_agua || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, consumo_agua: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Intestino (vezes/semana)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.intestino_vezes_semana || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, intestino_vezes_semana: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Atividade Física (tipo e frequência)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.atividade_fisica || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, atividade_fisica: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hábitos e Comportamentos */}
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">🧠 Hábitos e Comportamentos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Qual refeição é mais difícil de manter saudável?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.refeicao_dificil || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, refeicao_dificil: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">O que costuma beliscar quando está ansiosa/cansada?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.belisca_quando || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, belisca_quando: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">O que muda na rotina nos finais de semana?</label>
                      <input 
                        type="text"
                        value={dadosFormulario.muda_fins_semana || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, muda_fins_semana: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Escala de cuidado (0 a 10)</label>
                      <input 
                        type="text"
                        value={dadosFormulario.escala_cuidado || ''}
                        onChange={(e) => setDadosFormulario({...dadosFormulario, escala_cuidado: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                        placeholder="0-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* História */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">📖 História</h2>
            <p className="text-sm text-purple-600 mb-4">
              Escreva toda a história da pessoa, contexto de vida, relacionamentos, trabalho, família...
            </p>
            <textarea 
              rows={12}
              value={historiaPessoa}
              onChange={(e) => setHistoriaPessoa(e.target.value)}
              placeholder="Ex: Maria tem 34 anos, trabalha como professora, mãe de 2 filhos..."
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-sm"
            />
          </div>

          {/* Bloco Emocional - TODAS AS PERGUNTAS */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h2 className="text-2xl font-bold text-pink-700 mb-6">🌸 Bloco Emocional e Motivacional</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. O que te fez sentir que agora é o momento de mudar?
                </label>
                <textarea 
                  rows={3}
                  value={blocoEmocional.momento_mudanca}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, momento_mudanca: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Quando se olha no espelho, o que mais te incomoda ou te entristece hoje?
                </label>
                <textarea 
                  rows={2}
                  value={blocoEmocional.incomoda_espelho}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, incomoda_espelho: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. Teve alguma situação que te deixou chateada com o corpo?
                </label>
                <textarea 
                  rows={2}
                  value={blocoEmocional.situacao_corpo}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, situacao_corpo: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  4. O que mais te atrapalha no dia a dia por estar com esse peso?
                </label>
                <textarea 
                  rows={2}
                  value={blocoEmocional.atrapalha_dia_dia}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, atrapalha_dia_dia: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  5. Você sente medo de não conseguir emagrecer? Qual seria seu maior medo?
                </label>
                <textarea 
                  rows={3}
                  value={blocoEmocional.maior_medo}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, maior_medo: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6. Por que você quer eliminar esses quilos agora?
                </label>
                <textarea 
                  rows={2}
                  value={blocoEmocional.por_que_eliminar_kilos}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, por_que_eliminar_kilos: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  7. O que você já tentou fazer para emagrecer e não conseguiu manter? Por quê?
                </label>
                <textarea 
                  rows={3}
                  value={blocoEmocional.tentou_antes}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, tentou_antes: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  8. Quando estiver no peso desejado, o que é a primeira coisa que vai querer fazer ou usar sem culpa?
                </label>
                <textarea 
                  rows={2}
                  value={blocoEmocional.oque_fara_peso_desejado}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, oque_fara_peso_desejado: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  9. Quais são os 3 motivos mais fortes que te fazem querer mudar?
                </label>
                <textarea 
                  rows={4}
                  value={blocoEmocional.tres_motivos}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, tres_motivos: e.target.value})}
                  placeholder="Anote os 3 motivos..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10. De 0 a 10, qual é o seu nível de comprometimento com essa mudança?
                  <span className="ml-2 font-bold text-pink-700 text-xl">{blocoEmocional.nivel_comprometimento}/10</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={blocoEmocional.nivel_comprometimento} 
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, nivel_comprometimento: e.target.value})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  11. Se você pudesse dar um conselho para si mesma hoje, qual seria?
                </label>
                <textarea 
                  rows={3}
                  value={blocoEmocional.conselho_si}
                  onChange={(e) => setBlocoEmocional({...blocoEmocional, conselho_si: e.target.value})}
                  placeholder="Anote o conselho..."
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bloco Comportamental - TODAS AS PERGUNTAS */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-2xl font-bold text-green-700 mb-6">🌿 Bloco de Reflexão Comportamental</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. Qual seu ponto fraco na alimentação? (doce, pão, ansiedade noturna…)
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.ponto_fraco_alimentacao}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, ponto_fraco_alimentacao: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Você se considera organizada com a comida ou costuma improvisar?
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.organizada_ou_improvisa}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, organizada_ou_improvisa: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. Você sente que come por fome ou por emoção?
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.come_por_que}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, come_por_que: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  4. Quais momentos do dia são mais difíceis de controlar a alimentação?
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.momentos_dificeis}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, momentos_dificeis: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  5. O que te daria mais prazer do que comer nesses momentos de ansiedade?
                </label>
                <textarea 
                  rows={3}
                  value={blocoComportamental.prazer_alem_comida}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, prazer_alem_comida: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6. Você costuma se premiar com comida?
                </label>
                <textarea 
                  rows={2}
                  value={blocoComportamental.premia_com_comida}
                  onChange={(e) => setBlocoComportamental({...blocoComportamental, premia_com_comida: e.target.value})}
                  placeholder="Anote as respostas..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? '💾 Salvando...' : '💾 Salvar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}
