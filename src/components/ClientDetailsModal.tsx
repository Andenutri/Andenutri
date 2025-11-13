'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';
import ReavaliacaoModal from './ReavaliacaoModal';
import PlalhaEvolucaoModal from './PlalhaEvolucaoModal';
import EditarInformacoesBasicasModal from './EditarInformacoesBasicasModal';
import EditarPreConsultaModal from './EditarPreConsultaModal';
import EditarAvaliacaoFisicaModal from './EditarAvaliacaoFisicaModal';
import EditarAvaliacaoEmocionalModal from './EditarAvaliacaoEmocionalModal';
import AvaliacaoFisicaEditavel from './AvaliacaoFisicaEditavel';
import AgendarReavaliacaoModal from './AgendarReavaliacaoModal';
import { getReavaliacoesCliente, type ReavaliacaoResposta } from '@/data/reavaliacoesData';
import { getAvaliacoesByCliente } from '@/data/avaliacoesData';
import { getAvaliacoesEmocionaisCliente, getAvaliacoesComportamentaisCliente } from '@/data/avaliacoesEmocionaisData';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function ClientDetailsModal({ isOpen, onClose, cliente }: ClientDetailsModalProps) {
  const [sectionsExpanded, setSectionsExpanded] = useState({
    basicas: true, // Mantém aberta por padrão
    preconsulta: false, // Fechada por padrão
    avaliacaoFisica: false, // Fechada por padrão
    avaliacaoEmocional: false, // Fechada por padrão
    reavaliacoesPreenchidas: false, // Reavaliações preenchidas pelo cliente
    reavaliacoes: false, // Histórico de reavaliações
  });

  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showReavaliacaoModal, setShowReavaliacaoModal] = useState(false);
  const [showAgendarReavaliacaoModal, setShowAgendarReavaliacaoModal] = useState(false);
  const [showPlalhaEvolucaoModal, setShowPlalhaEvolucaoModal] = useState(false);
  const [showEditarBasicasModal, setShowEditarBasicasModal] = useState(false);
  const [showEditarPreConsultaModal, setShowEditarPreConsultaModal] = useState(false);
  const [showEditarAvaliacaoFisicaModal, setShowEditarAvaliacaoFisicaModal] = useState(false);
  const [showEditarAvaliacaoEmocionalModal, setShowEditarAvaliacaoEmocionalModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<string | null>(null);
  const [reavaliacoes, setReavaliacoes] = useState<ReavaliacaoResposta[]>([]);
  const [loadingReavaliacoes, setLoadingReavaliacoes] = useState(false);
  const [copiando, setCopiando] = useState(false);

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Carregar reavaliações quando expandir a seção de reavaliações preenchidas
    if ((section === 'reavaliacoesPreenchidas' || section === 'reavaliacoes') && !sectionsExpanded[section] && cliente) {
      carregarReavaliacoes();
    }
  };

  async function carregarReavaliacoes() {
    if (!cliente) return;
    setLoadingReavaliacoes(true);
    const reavals = await getReavaliacoesCliente(cliente.id);
    setReavaliacoes(reavals);
    setLoadingReavaliacoes(false);
  }

  // Função para gerar ficha completa em texto
  async function gerarFichaCompleta(): Promise<string> {
    if (!cliente) return '';

    let ficha = `═══════════════════════════════════════════════════════════
FICHA COMPLETA DO CLIENTE
═══════════════════════════════════════════════════════════

📋 INFORMAÇÕES BÁSICAS
───────────────────────────────────────────────────────────
Nome: ${cliente.nome}
Email: ${cliente.email || 'Não informado'}
Telefone: ${cliente.telefone || 'Não informado'}
WhatsApp: ${cliente.whatsapp || 'Não informado'}
Instagram: ${cliente.instagram || 'Não informado'}
Endereço: ${cliente.endereco_completo || 'Não informado'}
Status do Programa: ${cliente.status_plano || 'Não definido'}
${(cliente as any).is_lead ? 'Tipo: LEAD (Ainda não comprou programa de 90 dias)' : 'Tipo: CLIENTE (Comprou programa de 90 dias)'}
${(cliente as any).data_compra_programa ? `Data de Compra do Programa: ${new Date((cliente as any).data_compra_programa).toLocaleDateString('pt-BR')}` : ''}
${cliente.codigo_reavaliacao ? `Código de Reavaliação: ${cliente.codigo_reavaliacao}` : ''}
${cliente.perfil ? `Perfil: ${cliente.perfil}` : ''}

`;

    // Formulário de Pré-Consulta
    if (cliente.formulario_preenchido && cliente.formulario) {
      const form = cliente.formulario;
      ficha += `📝 FORMULÁRIO DE PRÉ-CONSULTA
───────────────────────────────────────────────────────────
Data de Preenchimento: ${form.data_preenchimento ? new Date(form.data_preenchimento).toLocaleDateString('pt-BR') : 'Não informado'}

DADOS FÍSICOS:
• Idade: ${form.idade || 'Não informado'}
• Altura: ${form.altura ? `${form.altura} cm` : 'Não informado'}
• Peso Atual: ${form.peso_atual ? `${form.peso_atual} kg` : 'Não informado'}
• Peso Desejado: ${form.peso_desejado ? `${form.peso_desejado} kg` : 'Não informado'}

INFORMAÇÕES PROFISSIONAIS:
• Como conheceu o programa: ${form.conheceu_programa || 'Não informado'}
• Trabalho: ${form.trabalho || 'Não informado'}
• Horário de trabalho: ${form.horario_trabalho || 'Não informado'}
• Dias de trabalho: ${form.dias_trabalho || 'Não informado'}

ROTINA DE SONO:
• Horário que acorda: ${form.hora_acorda || 'Não informado'}
• Horário que dorme: ${form.hora_dorme || 'Não informado'}
• Qualidade do sono: ${form.qualidade_sono || 'Não informado'}

VIDA PESSOAL:
• É casada: ${form.casada || 'Não informado'}
• Tem filhos: ${form.filhos || 'Não informado'}
${form.nomes_idades_filhos ? `• Nomes e idades dos filhos: ${form.nomes_idades_filhos}` : ''}

SAÚDE E SUPLEMENTAÇÃO:
• Condições de saúde: ${form.condicao_saude || 'Nenhuma'}
• Uso de medicação: ${form.uso_medicacao || 'Não'}
${form.medicacao_qual ? `• Qual medicação: ${form.medicacao_qual}` : ''}
• Restrições alimentares: ${form.restricao_alimentar || 'Nenhuma'}
• Usa suplementos: ${form.usa_suplemento || 'Não'}
${form.quais_suplementos ? `• Quais suplementos: ${form.quais_suplementos}` : ''}
• Sente dor ou desconforto: ${form.sente_dor || 'Não'}
${form.onde_dor ? `• Onde: ${form.onde_dor}` : ''}

ROTINA ALIMENTAR:
• Café da manhã: ${form.cafe_manha || 'Não informado'}
• Lanche da manhã: ${form.lanche_manha || 'Não informado'}
• Almoço: ${form.almoco || 'Não informado'}
• Lanche da tarde: ${form.lanche_tarde || 'Não informado'}
• Jantar: ${form.jantar || 'Não informado'}
• Ceia: ${form.ceia || 'Não informado'}
• Consumo de álcool/refrigerante: ${form.alcool_freq || 'Não informado'}
• Consumo médio de água: ${form.consumo_agua || 'Não informado'}
• Intestino funciona: ${form.intestino_vezes_semana || 'Não informado'}

ATIVIDADE FÍSICA:
• Atividade física: ${form.atividade_fisica || 'Não informado'}

HÁBITOS E COMPORTAMENTOS:
• Refeição mais difícil de manter saudável: ${form.refeicao_dificil || 'Não informado'}
• O que costuma beliscar quando ansiosa/cansada: ${form.belisca_quando || 'Não informado'}
• O que muda na rotina nos finais de semana: ${form.muda_fins_semana || 'Não informado'}
• Escala de cuidado consigo (0-10): ${form.escala_cuidado || 'Não informado'}

`;
    }

    // Buscar avaliações físicas
    try {
      const avaliacoesFisicas = await getAvaliacoesByCliente(cliente.id);
      if (avaliacoesFisicas.length > 0) {
        ficha += `⚖️ AVALIAÇÕES FÍSICAS
───────────────────────────────────────────────────────────
`;
        avaliacoesFisicas.forEach((av, index) => {
          ficha += `Avaliação ${index + 1} - ${av.tipo_avaliacao.toUpperCase()} (${new Date(av.data_avaliacao).toLocaleDateString('pt-BR')}):
`;
          if (av.peso) ficha += `• Peso: ${av.peso} kg\n`;
          if (av.altura) ficha += `• Altura: ${av.altura} cm\n`;
          if (av.percentual_gordura) ficha += `• % Gordura: ${av.percentual_gordura}%\n`;
          if (av.percentual_musculo) ficha += `• % Músculo: ${av.percentual_musculo}%\n`;
          if (av.gordura_visceral) ficha += `• Gordura Visceral: ${av.gordura_visceral}\n`;
          if (av.metabolismo_basal) ficha += `• Metabolismo Basal: ${av.metabolismo_basal} kcal\n`;
          if (av.busto) ficha += `• Busto: ${av.busto} cm\n`;
          if (av.cintura) ficha += `• Cintura: ${av.cintura} cm\n`;
          if (av.barriga) ficha += `• Barriga: ${av.barriga} cm\n`;
          if (av.quadril) ficha += `• Quadril: ${av.quadril} cm\n`;
          if (av.coxa) ficha += `• Coxa: ${av.coxa} cm\n`;
          if (av.braco) ficha += `• Braço: ${av.braco} cm\n`;
          if (av.pescoco) ficha += `• Pescoço: ${av.pescoco} cm\n`;
          if (av.observacoes) ficha += `• Observações: ${av.observacoes}\n`;
          ficha += `\n`;
        });
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações físicas:', error);
    }

    // Buscar avaliações emocionais e comportamentais
    try {
      const avaliacoesEmocionais = await getAvaliacoesEmocionaisCliente(cliente.id);
      const avaliacoesComportamentais = await getAvaliacoesComportamentaisCliente(cliente.id);

      if (avaliacoesEmocionais.length > 0 || avaliacoesComportamentais.length > 0) {
        ficha += `💚 AVALIAÇÕES EMOCIONAIS E COMPORTAMENTAIS
───────────────────────────────────────────────────────────
`;

        if (avaliacoesEmocionais.length > 0) {
          avaliacoesEmocionais.forEach((av, index) => {
            ficha += `Avaliação Emocional ${index + 1} (${av.data_criacao ? new Date(av.data_criacao).toLocaleDateString('pt-BR') : 'Data não informada'}):
`;
            if (av.historia_pessoa) ficha += `• História da Pessoa: ${av.historia_pessoa}\n`;
            if (av.momento_mudanca) ficha += `• Momento da Mudança: ${av.momento_mudanca}\n`;
            if (av.incomoda_espelho) ficha += `• Incomoda no Espelho: ${av.incomoda_espelho}\n`;
            if (av.situacao_corpo) ficha += `• Situação do Corpo: ${av.situacao_corpo}\n`;
            if (av.atrapalha_dia_dia) ficha += `• Atrapalha no Dia a Dia: ${av.atrapalha_dia_dia}\n`;
            if (av.maior_medo) ficha += `• Maior Medo: ${av.maior_medo}\n`;
            if (av.por_que_eliminar_kilos) ficha += `• Por que Eliminar Kilos: ${av.por_que_eliminar_kilos}\n`;
            if (av.tentou_antes) ficha += `• Tentou Antes: ${av.tentou_antes}\n`;
            if (av.oque_fara_peso_desejado) ficha += `• O que Fará ao Peso Desejado: ${av.oque_fara_peso_desejado}\n`;
            if (av.tres_motivos) ficha += `• Três Motivos: ${av.tres_motivos}\n`;
            if (av.nivel_comprometimento) ficha += `• Nível de Comprometimento: ${av.nivel_comprometimento}/10\n`;
            if (av.conselho_si) ficha += `• Conselho para Si: ${av.conselho_si}\n`;
            ficha += `\n`;
          });
        }

        if (avaliacoesComportamentais.length > 0) {
          avaliacoesComportamentais.forEach((av, index) => {
            ficha += `Avaliação Comportamental ${index + 1} (${av.data_criacao ? new Date(av.data_criacao).toLocaleDateString('pt-BR') : 'Data não informada'}):
`;
            if (av.ponto_fraco_alimentacao) ficha += `• Ponto Fraco na Alimentação: ${av.ponto_fraco_alimentacao}\n`;
            if (av.organizada_ou_improvisa) ficha += `• Organizada ou Improvisa: ${av.organizada_ou_improvisa}\n`;
            if (av.come_por_que) ficha += `• Come Por Que: ${av.come_por_que}\n`;
            if (av.momentos_dificeis) ficha += `• Momentos Difíceis: ${av.momentos_dificeis}\n`;
            if (av.prazer_alem_comida) ficha += `• Prazer Além da Comida: ${av.prazer_alem_comida}\n`;
            if (av.premia_com_comida) ficha += `• Premia com Comida: ${av.premia_com_comida}\n`;
            ficha += `\n`;
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações emocionais/comportamentais:', error);
    }

    // Reavaliações
    if (reavaliacoes.length > 0) {
      ficha += `📊 REAVALIAÇÕES PREENCHIDAS PELO CLIENTE
───────────────────────────────────────────────────────────
`;
      reavaliacoes.forEach((reav, index) => {
        ficha += `Reavaliação ${index + 1} (${reav.data_criacao ? new Date(reav.data_criacao).toLocaleDateString('pt-BR') : 'Data não informada'}):
`;
        if (reav.peso_atual) ficha += `• Peso Atual: ${reav.peso_atual} kg\n`;
        if (reav.mudancas_corpo_disposicao) ficha += `• Mudanças no Corpo/Disposição: ${reav.mudancas_corpo_disposicao}\n`;
        if (reav.energia_dia) ficha += `• Energia no Dia: ${reav.energia_dia}\n`;
        if (reav.intestino_sono) ficha += `• Intestino/Sono: ${reav.intestino_sono}\n`;
        if (reav.rotina_alimentacao_organizada) ficha += `• Rotina Alimentação Organizada: ${reav.rotina_alimentacao_organizada}\n`;
        if (reav.refeicoes_faceis) ficha += `• Refeições Fáceis: ${reav.refeicoes_faceis}\n`;
        if (reav.refeicoes_desafiadoras) ficha += `• Refeições Desafiadoras: ${reav.refeicoes_desafiadoras}\n`;
        if (reav.agua_suplementos) ficha += `• Água/Suplementos: ${reav.agua_suplementos}\n`;
        if (reav.atividade_fisica) ficha += `• Atividade Física: ${reav.atividade_fisica}\n`;
        if (reav.o_que_ajudou) ficha += `• O que Ajudou: ${reav.o_que_ajudou}\n`;
        if (reav.o_que_atrapalhou) ficha += `• O que Atrapalhou: ${reav.o_que_atrapalhou}\n`;
        if (reav.programa_ajudou) ficha += `• Programa Ajudou: ${reav.programa_ajudou}\n`;
        if (reav.programa_ajudar_mais) ficha += `• Programa Ajudar Mais: ${reav.programa_ajudar_mais}\n`;
        if (reav.mudar_estrategia) ficha += `• Mudar Estratégia: ${reav.mudar_estrategia}\n`;
        if (reav.maior_foco_nova_fase) ficha += `• Maior Foco Nova Fase: ${reav.maior_foco_nova_fase}\n`;
        ficha += `\n`;
      });
    }

    ficha += `═══════════════════════════════════════════════════════════
Fim da Ficha - Gerado em ${new Date().toLocaleString('pt-BR')}
═══════════════════════════════════════════════════════════`;

    return ficha;
  }

  // Função para copiar ficha para clipboard
  async function copiarFicha() {
    if (!cliente) return;
    
    setCopiando(true);
    try {
      const ficha = await gerarFichaCompleta();
      await navigator.clipboard.writeText(ficha);
      alert('✅ Ficha copiada para a área de transferência! Agora você pode colar no ChatGPT ou em qualquer lugar.');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('❌ Erro ao copiar ficha. Tente novamente.');
    } finally {
      setCopiando(false);
    }
  }

  // Função para exportar ficha como arquivo
  async function exportarFicha() {
    if (!cliente) return;
    
    try {
      const ficha = await gerarFichaCompleta();
      const blob = new Blob([ficha], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ficha_${cliente.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('✅ Ficha exportada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('❌ Erro ao exportar ficha. Tente novamente.');
    }
  }

  if (!isOpen || !cliente) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] md:max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center z-10">
            <h2 className="text-xl md:text-2xl font-bold text-amber-700">Detalhes do Cliente</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={copiarFicha}
                disabled={copiando}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                title="Copiar ficha completa para área de transferência"
              >
                {copiando ? '⏳' : '📋'} {copiando ? 'Copiando...' : 'Copiar Ficha'}
              </button>
              <button
                onClick={exportarFicha}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center gap-2"
                title="Exportar ficha completa como arquivo de texto"
              >
                💾 Exportar
              </button>
              <button
                onClick={onClose}
                className="text-3xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {/* Informações Básicas */}
            <div className="border-2 border-amber-100 rounded-xl bg-amber-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('basicas')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-amber-800 hover:bg-amber-100 transition-colors rounded-xl"
                >
                  <h3>📋 Informações Básicas</h3>
                  <span className="text-2xl">{sectionsExpanded.basicas ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowEditarBasicasModal(true)}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.basicas && (
                <div className="p-4 border-t border-amber-200">
                  {/* Bolinhas de Status */}
                  <div className="mb-4 p-3 bg-white rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">🔴 Status de Identificação</div>
                    <div className="flex gap-4 items-center flex-wrap">
                      {/* Status do Programa */}
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${
                          cliente.status_plano === 'ativo' ? 'bg-green-500' :
                          cliente.status_plano === 'inativo' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-semibold">Programa: {cliente.status_plano}</span>
                      </div>
                      {/* Status Herbalife */}
                      {(cliente as any).status_herbalife && (
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${
                            (cliente as any).status_herbalife === 'ativo' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-sm font-semibold">Herbalife: {(cliente as any).status_herbalife}</span>
                        </div>
                      )}
                      {/* Status Lead */}
                      {(cliente as any).is_lead && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-semibold text-purple-700">Lead</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Nome:</strong> {cliente.nome}</div>
                      <div><strong>Email:</strong> {cliente.email || '-'}</div>
                      <div><strong>Telefone:</strong> {cliente.telefone}</div>
                      <div><strong>WhatsApp:</strong> {cliente.whatsapp || '-'}</div>
                      {cliente.instagram && (
                        <div><strong>Instagram:</strong> {cliente.instagram}</div>
                      )}
                      {(cliente as any).endereco_completo && (
                        <div className="col-span-2"><strong>Endereço:</strong> {(cliente as any).endereco_completo}</div>
                      )}
                    </div>
                    {/* Campo Perfil/Descrição */}
                    {(cliente as any).perfil && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-amber-700 mb-2">📝 Perfil/Descrição</h4>
                        <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{(cliente as any).perfil}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dados da Pré-Consulta / Dados da Primeira Avaliação */}
            {cliente.formulario && (
              <div className="border-2 border-blue-100 rounded-xl bg-blue-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSection('preconsulta')}
                    className="flex-1 flex items-center justify-between p-4 font-bold text-blue-800 hover:bg-blue-100 transition-colors rounded-xl"
                  >
                    <h3>📝 Dados da Primeira Avaliação</h3>
                    <span className="text-2xl">{sectionsExpanded.preconsulta ? '−' : '+'}</span>
                  </button>
                  <button
                    onClick={() => setShowEditarPreConsultaModal(true)}
                    className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    title="Editar esta seção"
                  >
                    ✏️ Editar
                  </button>
                </div>
                
                {sectionsExpanded.preconsulta && (
                  <div className="p-4 border-t border-blue-200 space-y-4">
                    {/* Informações Gerais */}
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">🔹 Informações Gerais</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Nome Completo:</strong> {cliente.formulario.nome_completo || '-'}</div>
                        <div><strong>Idade:</strong> {cliente.formulario.idade ? `${cliente.formulario.idade} anos` : '-'}</div>
                        <div><strong>Altura:</strong> {cliente.formulario.altura ? `${cliente.formulario.altura} cm` : '-'}</div>
                        <div><strong>Peso Atual:</strong> {cliente.formulario.peso_atual ? `${cliente.formulario.peso_atual} kg` : '-'}</div>
                        <div><strong>Peso Desejado:</strong> {cliente.formulario.peso_desejado ? `${cliente.formulario.peso_desejado} kg` : '-'}</div>
                        <div><strong>Conheceu por:</strong> {cliente.formulario.conheceu_programa || '-'}</div>
                        <div className="col-span-2"><strong>Endereço:</strong> {cliente.formulario.endereco_completo || '-'}</div>
                        <div><strong>WhatsApp:</strong> {cliente.formulario.whatsapp || '-'}</div>
                        <div><strong>Instagram:</strong> {cliente.formulario.instagram || '-'}</div>
                      </div>
                    </div>

                    {/* Família */}
                    {(cliente.formulario.casada || cliente.formulario.filhos || cliente.formulario.nomes_idades_filhos) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">👨‍👩‍👧‍👦 Família</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>É casada?</strong> {cliente.formulario.casada || '-'}</div>
                          <div><strong>Tem filhos?</strong> {cliente.formulario.filhos || '-'}</div>
                          {cliente.formulario.nomes_idades_filhos && (
                            <div className="col-span-2"><strong>Nomes e Idades dos Filhos:</strong> {cliente.formulario.nomes_idades_filhos}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trabalho e Rotina */}
                    {(cliente.formulario.trabalho || cliente.formulario.horario_trabalho || cliente.formulario.dias_trabalho || cliente.formulario.hora_acorda || cliente.formulario.hora_dorme || cliente.formulario.qualidade_sono) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">💼 Trabalho e Rotina</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Trabalho/Profissão:</strong> {cliente.formulario.trabalho || '-'}</div>
                          <div><strong>Horário Trabalho:</strong> {cliente.formulario.horario_trabalho || '-'}</div>
                          <div><strong>Dias Trabalho:</strong> {cliente.formulario.dias_trabalho || '-'}</div>
                          <div><strong>Hora Acorda:</strong> {cliente.formulario.hora_acorda || '-'}</div>
                          <div><strong>Hora Dorme:</strong> {cliente.formulario.hora_dorme || '-'}</div>
                          <div><strong>Qualidade Sono:</strong> {cliente.formulario.qualidade_sono || '-'}</div>
                        </div>
                      </div>
                    )}

                    {/* Saúde */}
                    {(cliente.formulario.condicao_saude || cliente.formulario.uso_medicacao || cliente.formulario.medicacao_qual || cliente.formulario.restricao_alimentar || cliente.formulario.usa_suplemento || cliente.formulario.quais_suplementos || cliente.formulario.sente_dor || cliente.formulario.onde_dor) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🏥 Saúde</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Condição de Saúde:</strong> {cliente.formulario.condicao_saude || '-'}</div>
                          <div><strong>Usa Medicação?</strong> {cliente.formulario.uso_medicacao || '-'}</div>
                          {cliente.formulario.medicacao_qual && (
                            <div className="col-span-2"><strong>Qual Medicação:</strong> {cliente.formulario.medicacao_qual}</div>
                          )}
                          <div><strong>Restrição Alimentar:</strong> {cliente.formulario.restricao_alimentar || '-'}</div>
                          <div><strong>Usa Suplemento?</strong> {cliente.formulario.usa_suplemento || '-'}</div>
                          {cliente.formulario.quais_suplementos && (
                            <div className="col-span-2"><strong>Quais Suplementos:</strong> {cliente.formulario.quais_suplementos}</div>
                          )}
                          <div><strong>Sente dor ou desconforto?</strong> {cliente.formulario.sente_dor || '-'}</div>
                          <div><strong>Onde sente dor?</strong> {cliente.formulario.onde_dor || '-'}</div>
                        </div>
                      </div>
                    )}

                    {/* Rotina Alimentar */}
                    {(cliente.formulario.cafe_manha || cliente.formulario.lanche_manha || cliente.formulario.almoco || cliente.formulario.lanche_tarde || cliente.formulario.jantar || cliente.formulario.ceia) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🍽️ Rotina Alimentar</h4>
                        <div className="text-sm space-y-2">
                          {cliente.formulario.cafe_manha && <p><strong>Café da Manhã:</strong> {cliente.formulario.cafe_manha}</p>}
                          {cliente.formulario.lanche_manha && <p><strong>Lanche Manhã:</strong> {cliente.formulario.lanche_manha}</p>}
                          {cliente.formulario.almoco && <p><strong>Almoço:</strong> {cliente.formulario.almoco}</p>}
                          {cliente.formulario.lanche_tarde && <p><strong>Lanche Tarde:</strong> {cliente.formulario.lanche_tarde}</p>}
                          {cliente.formulario.jantar && <p><strong>Jantar:</strong> {cliente.formulario.jantar}</p>}
                          {cliente.formulario.ceia && <p><strong>Ceia:</strong> {cliente.formulario.ceia}</p>}
                        </div>
                      </div>
                    )}

                    {/* Hábitos e Comportamentos */}
                    {(cliente.formulario.alcool_freq || cliente.formulario.consumo_agua || cliente.formulario.intestino_vezes_semana || cliente.formulario.atividade_fisica || cliente.formulario.refeicao_dificil || cliente.formulario.belisca_quando || cliente.formulario.muda_fins_semana || cliente.formulario.escala_cuidado) && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-blue-700 mb-2">🧠 Hábitos e Comportamentos</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {cliente.formulario.alcool_freq && <div><strong>Álcool/Refrigerante:</strong> {cliente.formulario.alcool_freq}</div>}
                          {cliente.formulario.consumo_agua && <div><strong>Consumo de Água:</strong> {cliente.formulario.consumo_agua}</div>}
                          {cliente.formulario.intestino_vezes_semana && <div><strong>Intestino (vezes/semana):</strong> {cliente.formulario.intestino_vezes_semana}</div>}
                          {cliente.formulario.atividade_fisica && <div><strong>Atividade Física:</strong> {cliente.formulario.atividade_fisica}</div>}
                          {cliente.formulario.refeicao_dificil && <div><strong>Refeição Mais Difícil:</strong> {cliente.formulario.refeicao_dificil}</div>}
                          {cliente.formulario.belisca_quando && <div><strong>Belisca Quando:</strong> {cliente.formulario.belisca_quando}</div>}
                          {cliente.formulario.muda_fins_semana && <div><strong>Muda nos Fins de Semana:</strong> {cliente.formulario.muda_fins_semana}</div>}
                          {cliente.formulario.escala_cuidado && <div><strong>Escala de Cuidado (0-10):</strong> {cliente.formulario.escala_cuidado}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Avaliação Física Editável */}
            <div className="border-2 border-green-100 rounded-xl bg-green-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('avaliacaoFisica')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
                >
                  <h3>💪 Avaliação Física</h3>
                  <span className="text-2xl">{sectionsExpanded.avaliacaoFisica ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowEditarAvaliacaoFisicaModal(true)}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.avaliacaoFisica && (
                <div className="border-t border-green-200">
                  <AvaliacaoFisicaEditavel cliente={cliente} />
                </div>
              )}
            </div>

            {/* Avaliação Emocional */}
            <div className="border-2 border-purple-100 rounded-xl bg-purple-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('avaliacaoEmocional')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-purple-800 hover:bg-purple-100 transition-colors rounded-xl"
                >
                  <h3>💚 Avaliação Emocional</h3>
                  <span className="text-2xl">{sectionsExpanded.avaliacaoEmocional ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowEditarAvaliacaoEmocionalModal(true)}
                  className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  title="Editar esta seção"
                >
                  ✏️ Editar
                </button>
              </div>
              
              {sectionsExpanded.avaliacaoEmocional && (
                <div className="p-4 border-t border-purple-200">
                  {/* Dados Mock - Avaliação Emocional */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-700">💚 Avaliação Emocional - 20/01/2025</h4>
                        <span className="text-xs text-gray-500">Realizada</span>
                      </div>
                      
                      {/* História da Pessoa */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">📖 História</h5>
                        <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                          "Cliente motivada para mudança após se sentir desconfortável em situações sociais. Histórico de tentativas anteriores frustradas. Mãe de dois filhos, buscando melhor qualidade de vida e autoestima."
                        </p>
                      </div>

                      {/* Respostas do Bloco Emocional */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">🌸 Bloco Emocional</h5>
                        <div className="space-y-2 text-sm">
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Momento de mudança:</span>
                            <p className="text-gray-600">"Depois de ver fotos em um evento familiar"</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Nível de comprometimento:</span>
                            <p className="text-gray-600">9/10</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Maior medo:</span>
                            <p className="text-gray-600">"Não conseguir manter a mudança"</p>
                          </div>
                        </div>
                      </div>

                      {/* Respostas do Bloco Comportamental */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">🌿 Bloco Comportamental</h5>
                        <div className="space-y-2 text-sm">
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Ponto fraco alimentação:</span>
                            <p className="text-gray-600">"Doces e ansiedade noturna"</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Come por:</span>
                            <p className="text-gray-600">"Principalmente por emoção (tédio e estresse)"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reavaliações Preenchidas */}
            <div className="border-2 border-green-100 rounded-xl bg-green-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('reavaliacoesPreenchidas')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-green-800 hover:bg-green-100 transition-colors rounded-xl"
                >
                  <h3>📋 Reavaliações Preenchidas</h3>
                  <span className="text-2xl">{sectionsExpanded.reavaliacoesPreenchidas ? '−' : '+'}</span>
                </button>
              </div>
              
              {sectionsExpanded.reavaliacoesPreenchidas && (
                <div className="p-4 border-t border-green-200">
                  {loadingReavaliacoes ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Carregando reavaliações...</p>
                    </div>
                  ) : reavaliacoes.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-green-300">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-gray-600">Nenhuma reavaliação preenchida ainda</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Compartilhe o link acima com {cliente.nome}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reavaliacoes.map((reaval, index) => (
                        <div key={reaval.id || index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-3 pb-3 border-b">
                            <h4 className="font-semibold text-green-700">
                              Reavaliação #{reavaliacoes.length - index}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {reaval.data_preenchimento 
                                ? new Date(reaval.data_preenchimento).toLocaleDateString('pt-BR')
                                : 'Data não disponível'}
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            {reaval.peso_atual && (
                              <div>
                                <strong className="text-gray-700">⚖️ Peso atual:</strong>
                                <p className="text-gray-600 ml-2">{reaval.peso_atual}</p>
                              </div>
                            )}
                            {reaval.mudancas_corpo_disposicao && (
                              <div>
                                <strong className="text-gray-700">💪 Mudanças percebidas:</strong>
                                <p className="text-gray-600 ml-2">{reaval.mudancas_corpo_disposicao}</p>
                              </div>
                            )}
                            {reaval.energia_dia && (
                              <div>
                                <strong className="text-gray-700">⚡ Energia:</strong>
                                <p className="text-gray-600 ml-2">{reaval.energia_dia}</p>
                              </div>
                            )}
                            {reaval.intestino_sono && (
                              <div>
                                <strong className="text-gray-700">😴 Intestino e sono:</strong>
                                <p className="text-gray-600 ml-2">{reaval.intestino_sono}</p>
                              </div>
                            )}
                            {reaval.rotina_alimentacao_organizada && (
                              <div>
                                <strong className="text-gray-700">🍽️ Rotina alimentar:</strong>
                                <p className="text-gray-600 ml-2">{reaval.rotina_alimentacao_organizada}</p>
                              </div>
                            )}
                            {reaval.refeicoes_faceis && (
                              <div>
                                <strong className="text-gray-700">✅ Refeições mais fáceis:</strong>
                                <p className="text-gray-600 ml-2">{reaval.refeicoes_faceis}</p>
                              </div>
                            )}
                            {reaval.refeicoes_desafiadoras && (
                              <div>
                                <strong className="text-gray-700">⚠️ Refeições mais desafiadoras:</strong>
                                <p className="text-gray-600 ml-2">{reaval.refeicoes_desafiadoras}</p>
                              </div>
                            )}
                            {reaval.agua_suplementos && (
                              <div>
                                <strong className="text-gray-700">💧 Água e suplementos:</strong>
                                <p className="text-gray-600 ml-2">{reaval.agua_suplementos}</p>
                              </div>
                            )}
                            {reaval.atividade_fisica && (
                              <div>
                                <strong className="text-gray-700">🏃 Atividade física:</strong>
                                <p className="text-gray-600 ml-2">{reaval.atividade_fisica}</p>
                              </div>
                            )}
                            {reaval.o_que_ajudou && (
                              <div>
                                <strong className="text-gray-700">✅ O que ajudou:</strong>
                                <p className="text-gray-600 ml-2">{reaval.o_que_ajudou}</p>
                              </div>
                            )}
                            {reaval.o_que_atrapalhou && (
                              <div>
                                <strong className="text-gray-700">⚠️ O que atrapalhou:</strong>
                                <p className="text-gray-600 ml-2">{reaval.o_que_atrapalhou}</p>
                              </div>
                            )}
                            {reaval.maior_foco_nova_fase && (
                              <div>
                                <strong className="text-gray-700">🎯 Foco para nova fase:</strong>
                                <p className="text-gray-600 ml-2">{reaval.maior_foco_nova_fase}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Histórico de Reavaliações */}
            <div className="border-2 border-indigo-100 rounded-xl bg-indigo-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('reavaliacoes')}
                  className="flex-1 flex items-center justify-between p-4 font-bold text-indigo-800 hover:bg-indigo-100 transition-colors rounded-xl"
                >
                  <h3>🔄 Histórico de Reavaliações</h3>
                  <span className="text-2xl">{sectionsExpanded.reavaliacoes ? '−' : '+'}</span>
                </button>
                <button
                  onClick={() => setShowReavaliacaoModal(true)}
                  className="mx-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                  title="Adicionar nova reavaliação"
                >
                  ➕ Nova Reavaliação
                </button>
              </div>
              
              {sectionsExpanded.reavaliacoes && (
                <div className="p-4 border-t border-indigo-200">
                  {/* Dados Mock - Reavaliações */}
                  <div className="space-y-4">
                    {/* Reavaliação 1 */}
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-indigo-700">📏 1ª Reavaliação - 15/02/2025</h4>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Progresso</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Peso:</span>
                          <p className="font-bold text-indigo-700">73kg <span className="text-green-600 text-xs">(-2kg)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">IMC:</span>
                          <p className="font-bold text-indigo-700">25.5 <span className="text-green-600 text-xs">(-0.7)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Cintura:</span>
                          <p className="font-bold text-indigo-700">85cm <span className="text-green-600 text-xs">(-3cm)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Quadril:</span>
                          <p className="font-bold text-indigo-700">99cm <span className="text-green-600 text-xs">(-3cm)</span></p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">📝 Observações: "Cliente seguindo protocolo corretamente, aderência 95%"</p>
                      </div>
                    </div>

                    {/* Reavaliação 2 */}
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-indigo-700">📏 2ª Reavaliação - 15/03/2025</h4>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Meta próxima</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Peso:</span>
                          <p className="font-bold text-indigo-700">70kg <span className="text-green-600 text-xs">(-5kg total)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">IMC:</span>
                          <p className="font-bold text-indigo-700">24.4 <span className="text-green-600 text-xs">(-1.8)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Cintura:</span>
                          <p className="font-bold text-indigo-700">82cm <span className="text-green-600 text-xs">(-6cm)</span></p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Quadril:</span>
                          <p className="font-bold text-indigo-700">96cm <span className="text-green-600 text-xs">(-6cm)</span></p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">🎯 Meta: "Apenas 3kg para o peso desejado!"</p>
                        <p className="text-xs text-gray-600">📝 Observações: "Muito motivada, sentindo-se mais confiante"</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t">
              <button
                onClick={() => setShowPlalhaEvolucaoModal(true)}
                className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
              >
                📊 Planilha de Evolução
              </button>
              <button
                onClick={() => setShowAgendarReavaliacaoModal(true)}
                className="w-full sm:flex-1 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
              >
                📅 Agendar Reavaliação
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditClientModal && (
        <AddClientModal
          isOpen={showEditClientModal}
          onClose={() => {
            setShowEditClientModal(false);
            setSectionToEdit(null);
          }}
          clienteParaEditar={cliente}
          defaultSection={sectionToEdit}
        />
      )}

      {/* Modal de Reavaliação */}
      {showReavaliacaoModal && (
        <ReavaliacaoModal
          isOpen={showReavaliacaoModal}
          onClose={() => {
            setShowReavaliacaoModal(false);
          }}
          clienteId={cliente?.id || ''}
          clienteNome={cliente?.nome || ''}
        />
      )}

      {/* Modal de Planilha de Evolução */}
      {showPlalhaEvolucaoModal && (
        <PlalhaEvolucaoModal
          isOpen={showPlalhaEvolucaoModal}
          onClose={() => {
            setShowPlalhaEvolucaoModal(false);
          }}
          clienteId={cliente?.id || ''}
          clienteNome={cliente?.nome || ''}
        />
      )}

      {/* Modal de Editar Informações Básicas */}
      {showEditarBasicasModal && (
        <EditarInformacoesBasicasModal
          isOpen={showEditarBasicasModal}
          onClose={() => {
            setShowEditarBasicasModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Pré-Consulta */}
      {showEditarPreConsultaModal && (
        <EditarPreConsultaModal
          isOpen={showEditarPreConsultaModal}
          onClose={() => {
            setShowEditarPreConsultaModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Avaliação Física */}
      {showEditarAvaliacaoFisicaModal && (
        <EditarAvaliacaoFisicaModal
          isOpen={showEditarAvaliacaoFisicaModal}
          onClose={() => {
            setShowEditarAvaliacaoFisicaModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Editar Avaliação Emocional */}
      {showEditarAvaliacaoEmocionalModal && (
        <EditarAvaliacaoEmocionalModal
          isOpen={showEditarAvaliacaoEmocionalModal}
          onClose={() => {
            setShowEditarAvaliacaoEmocionalModal(false);
            if (cliente?.id) {
              window.location.reload();
            }
          }}
          cliente={cliente}
        />
      )}

      {/* Modal de Agendar Reavaliação */}
      {showAgendarReavaliacaoModal && (
        <AgendarReavaliacaoModal
          isOpen={showAgendarReavaliacaoModal}
          onClose={() => setShowAgendarReavaliacaoModal(false)}
          cliente={cliente}
        />
      )}
    </>
  );
}

