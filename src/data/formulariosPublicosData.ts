// Funções para salvar formulário público no Supabase

import { supabase } from '../lib/supabase';

export interface FormularioPublicoData {
  // Dados do cliente
  nome_completo: string;
  endereco_completo?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  
  // Dados do formulário
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
  qualidade_sono?: string; // profundo / leve / acorda à noite / insônia
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
  alcool_freq?: string; // álcool ou refrigerante e frequência
  consumo_agua?: string;
  intestino_vezes_semana?: string;
  atividade_fisica?: string;
  refeicao_dificil?: string;
  belisca_quando?: string;
  muda_fins_semana?: string;
  escala_cuidado?: string; // 0 a 10
}

// Buscar usuário por email (nome na URL será parte do email)
export async function buscarUsuarioPorEmail(email: string): Promise<{ id: string; email: string } | null> {
  try {
    // Buscar em auth.users através de uma função RPC ou query pública
    // Como não podemos acessar auth.users diretamente, vamos criar uma função helper
    const { data, error } = await supabase
      .from('clientes') // Usar tabela clientes temporariamente para buscar user_id
      .select('user_id')
      .limit(1)
      .single();
    
    // Na verdade, vamos criar uma função que busca o user_id pelo email
    // Usando uma tabela auxiliar ou função RPC
    return null; // Implementar depois
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// Buscar user_id pelo email do nutricionista (usando função RPC)
export async function buscarUserIdPorEmail(email: string): Promise<string | null> {
  try {
    // Criar função RPC no Supabase que busca user_id por email
    // Por enquanto, vamos usar uma abordagem diferente
    // Vamos buscar direto via auth se possível, ou criar uma view/tabela auxiliar
    
    // Solução temporária: buscar em clientes que têm o mesmo padrão de email
    // Ou criar uma tabela que mapeia email -> user_id
    return null;
  } catch (error) {
    console.error('Erro ao buscar user_id:', error);
    return null;
  }
}

// Salvar formulário público associado ao email do nutricionista
export async function salvarFormularioPublico(
  emailNutricionista: string,
  dados: FormularioPublicoData
): Promise<{ success: boolean; clienteId?: string; error?: string }> {
  try {
    // 1. Buscar o user_id pelo email do nutricionista
    // Por enquanto, vamos buscar diretamente na tabela auth.users via RPC
    // ou criar uma função que faz isso
    
    // Solução: Criar função RPC no Supabase que busca user_id por email
    const { data: userIdData, error: userIdError } = await supabase.rpc('buscar_user_id_por_email', {
      email_param: emailNutricionista.toLowerCase(),
    });

    let userId: string | null = null;

    if (userIdError || !userIdData) {
      // Fallback: tentar buscar diretamente de clientes existentes deste usuário
      // Se não encontrar, retornar erro
      return {
        success: false,
        error: 'Nutricionista não encontrado. Verifique o email.',
      };
    }

    userId = userIdData as string;

    // 2. Verificar se cliente já existe (por email ou whatsapp)
    let clienteId: string;
    
    if (dados.email || dados.whatsapp) {
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id, nome, email, whatsapp, instagram, endereco_completo')
        .or(
          (dados.email && dados.whatsapp)
            ? `email.eq.${dados.email},whatsapp.eq.${dados.whatsapp}`
            : dados.email
            ? `email.eq.${dados.email}`
            : `whatsapp.eq.${dados.whatsapp}`
        )
        .eq('user_id', userId)
        .maybeSingle();

      if (clienteExistente) {
        // Atualizar cliente existente com dados do formulário
        clienteId = clienteExistente.id;
        
        const dadosAtualizacao: any = {};
        
        // Sincronizar dados: atualizar apenas campos que estão vazios no cliente
        if (!clienteExistente.nome && dados.nome_completo) {
          dadosAtualizacao.nome = dados.nome_completo;
        }
        if (!clienteExistente.email && dados.email) {
          dadosAtualizacao.email = dados.email;
        }
        if (!clienteExistente.whatsapp && dados.whatsapp) {
          dadosAtualizacao.whatsapp = dados.whatsapp;
        }
        if (!clienteExistente.instagram && dados.instagram) {
          dadosAtualizacao.instagram = dados.instagram;
        }
        if (!clienteExistente.endereco_completo && dados.endereco_completo) {
          dadosAtualizacao.endereco_completo = dados.endereco_completo;
        }
        
        // Atualizar dados que vieram do formulário (sobrescrever se necessário)
        if (dados.nome_completo) dadosAtualizacao.nome = dados.nome_completo;
        if (dados.email) dadosAtualizacao.email = dados.email;
        if (dados.whatsapp) dadosAtualizacao.whatsapp = dados.whatsapp;
        if (dados.instagram) dadosAtualizacao.instagram = dados.instagram;
        if (dados.endereco_completo) dadosAtualizacao.endereco_completo = dados.endereco_completo;
        
        // Atualizar cliente existente
        const { error: updateError } = await supabase
          .from('clientes')
          .update(dadosAtualizacao)
          .eq('id', clienteId);
          
        if (updateError) {
          console.error('Erro ao atualizar cliente:', updateError);
        }
      } else {
        // Criar novo cliente
        const { data: novoCliente, error: clienteError } = await supabase
          .from('clientes')
          .insert({
            nome: dados.nome_completo,
            email: dados.email || '',
            whatsapp: dados.whatsapp || '',
            instagram: dados.instagram || '',
            endereco_completo: dados.endereco_completo || '',
            status_programa: 'ativo',
            is_lead: true,
            user_id: userId,
          })
          .select()
          .single();

        if (clienteError || !novoCliente) {
          return {
            success: false,
            error: clienteError?.message || 'Erro ao criar cliente',
          };
        }
        
        clienteId = novoCliente.id;
      }
    } else {
      // Se não tem email nem whatsapp, criar novo cliente
      const { data: novoCliente, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nome: dados.nome_completo,
          email: '',
          whatsapp: '',
          instagram: dados.instagram || '',
          endereco_completo: dados.endereco_completo || '',
          status_programa: 'ativo',
          is_lead: true,
          user_id: userId,
        })
        .select()
        .single();

      if (clienteError || !novoCliente) {
        return {
          success: false,
          error: clienteError?.message || 'Erro ao criar cliente',
        };
      }
      
      clienteId = novoCliente.id;
    }

    // 3. Verificar se formulário já existe para este cliente
    const { data: formularioExistente } = await supabase
      .from('formularios_pre_consulta')
      .select('id')
      .eq('cliente_id', clienteId)
      .maybeSingle();

    // 4. Criar ou atualizar formulário de pré-consulta
    const dadosFormulario = {
      cliente_id: clienteId,
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
    };

    let formularioError;
    
    if (formularioExistente) {
      // Atualizar formulário existente (mesclar dados: manter o que já existe, adicionar novos)
      const { error } = await supabase
        .from('formularios_pre_consulta')
        .update(dadosFormulario)
        .eq('id', formularioExistente.id);
      formularioError = error;
    } else {
      // Criar novo formulário
      const { error } = await supabase
        .from('formularios_pre_consulta')
        .insert(dadosFormulario);
      formularioError = error;
    }

    if (formularioError) {
      // Não deletar cliente se formulário falhar - pode ser atualização
      return {
        success: false,
        error: formularioError.message || 'Erro ao salvar formulário',
      };
    }

    return {
      success: true,
      clienteId: clienteId,
    };
  } catch (error: any) {
    console.error('Erro ao salvar formulário público:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    };
  }
}
