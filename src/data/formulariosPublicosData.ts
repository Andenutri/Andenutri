// Funções para salvar formulário público no Supabase

import { supabase } from '../lib/supabase';

export interface FormularioPublicoData {
  // Dados do cliente
  nome: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  instagram?: string;
  
  // Dados do formulário
  nome_completo: string;
  idade: string;
  altura: string;
  peso_atual: string;
  peso_desejado: string;
  conheceu_programa?: string;
  trabalho?: string;
  horario_trabalho?: string;
  dias_trabalho?: string;
  hora_acorda?: string;
  hora_dorme?: string;
  qualidade_sono?: string;
  casada?: string;
  filhos?: string;
  nomes_idades_filhos?: string;
  condicao_saude?: string;
  uso_medicacao?: string;
  medicacao_qual?: string;
  restricao_alimentar?: string;
  usa_suplemento?: string;
  quais_suplementos?: string;
  sente_dor?: string;
  onde_dor?: string;
  cafe_manha?: string;
  lanche_manha?: string;
  almoco?: string;
  lanche_tarde?: string;
  jantar?: string;
  ceia?: string;
  alcool_freq?: string;
  consumo_agua?: string;
  intestino_vezes_semana?: string;
  atividade_fisica?: string;
  refeicao_dificil?: string;
  belisca_quando?: string;
  muda_fins_semana?: string;
  escala_cuidado?: string;
}

// Salvar formulário público associado a um código de link
export async function salvarFormularioPublico(
  codigoLink: string,
  dados: FormularioPublicoData
): Promise<{ success: boolean; clienteId?: string; error?: string }> {
  try {
    // 1. Buscar o link e obter o user_id
    const { data: link, error: linkError } = await supabase
      .from('links_formularios')
      .select('user_id')
      .eq('codigo', codigoLink.toUpperCase())
      .eq('ativo', true)
      .single();

    if (linkError || !link) {
      return {
        success: false,
        error: 'Link inválido ou inativo',
      };
    }

    const userId = link.user_id;

    // 2. Criar cliente primeiro
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .insert({
        nome: dados.nome || dados.nome_completo,
        email: dados.email,
        telefone: dados.telefone || '',
        whatsapp: dados.whatsapp || '',
        instagram: dados.instagram || '',
        status_programa: 'ativo', // Novo lead sempre inicia como ativo
        is_lead: true, // Marcar como lead
        codigo_link: codigoLink.toUpperCase(), // Rastrear origem
        user_id: userId, // Associar ao nutricionista
      })
      .select()
      .single();

    if (clienteError || !cliente) {
      return {
        success: false,
        error: clienteError?.message || 'Erro ao criar cliente',
      };
    }

    // 3. Criar formulário de pré-consulta
    const { error: formularioError } = await supabase
      .from('formularios_pre_consulta')
      .insert({
        cliente_id: cliente.id,
        nome_completo: dados.nome_completo,
        idade: dados.idade,
        altura: dados.altura,
        peso_atual: dados.peso_atual,
        peso_desejado: dados.peso_desejado,
        conheceu_programa: dados.conheceu_programa,
        trabalho: dados.trabalho,
        horario_trabalho: dados.horario_trabalho,
        dias_trabalho: dados.dias_trabalho,
        hora_acorda: dados.hora_acorda,
        hora_dorme: dados.hora_dorme,
        qualidade_sono: dados.qualidade_sono,
        casada: dados.casada,
        filhos: dados.filhos,
        nomes_idades_filhos: dados.nomes_idades_filhos,
        condicao_saude: dados.condicao_saude,
        uso_medicacao: dados.uso_medicacao,
        medicacao_qual: dados.medicacao_qual,
        restricao_alimentar: dados.restricao_alimentar,
        usa_suplemento: dados.usa_suplemento,
        quais_suplementos: dados.quais_suplementos,
        sente_dor: dados.sente_dor,
        onde_dor: dados.onde_dor,
        cafe_manha: dados.cafe_manha,
        lanche_manha: dados.lanche_manha,
        almoco: dados.almoco,
        lanche_tarde: dados.lanche_tarde,
        jantar: dados.jantar,
        ceia: dados.ceia,
        alcool_freq: dados.alcool_freq,
        consumo_agua: dados.consumo_agua,
        intestino_vezes_semana: dados.intestino_vezes_semana,
        atividade_fisica: dados.atividade_fisica,
        refeicao_dificil: dados.refeicao_dificil,
        belisca_quando: dados.belisca_quando,
        muda_fins_semana: dados.muda_fins_semana,
        escala_cuidado: dados.escala_cuidado,
        data_preenchimento: new Date().toISOString(),
      });

    if (formularioError) {
      // Se erro no formulário, deletar cliente criado
      await supabase.from('clientes').delete().eq('id', cliente.id);
      return {
        success: false,
        error: formularioError.message || 'Erro ao salvar formulário',
      };
    }

    // 4. Incrementar contador de submissões do link
    try {
      // Tentar usar RPC primeiro
      const { error: rpcError } = await supabase.rpc('incrementar_submissoes_link', {
        codigo_link_param: codigoLink.toUpperCase(),
      });
      
      // Se RPC não funcionar, atualizar manualmente
      if (rpcError) {
        const { data: linkAtual } = await supabase
          .from('links_formularios')
          .select('total_submissoes')
          .eq('codigo', codigoLink.toUpperCase())
          .single();
        
        await supabase
          .from('links_formularios')
          .update({ 
            total_submissoes: (linkAtual?.total_submissoes || 0) + 1,
            atualizado_em: new Date().toISOString(),
          })
          .eq('codigo', codigoLink.toUpperCase());
      }
    } catch (err) {
      console.error('Erro ao incrementar contador:', err);
      // Não falhar o processo se o incremento der erro
    }

    return {
      success: true,
      clienteId: cliente.id,
    };
  } catch (error: any) {
    console.error('Erro ao salvar formulário público:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    };
  }
}

