// Busca inteligente de clientes por nome, email ou whatsapp
// Evita duplicados e integra dados automaticamente

import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../utils/authHelpers';

export interface ClienteSimilar {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  similaridade: number; // 0-100
}

/**
 * Busca clientes similares por nome, email ou whatsapp
 * Usa busca fuzzy para encontrar nomes parecidos
 */
export async function buscarClientesSimilares(
  nome?: string,
  email?: string,
  whatsapp?: string
): Promise<ClienteSimilar[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const clientesSimilares: ClienteSimilar[] = [];

    // Buscar por email (exato)
    if (email) {
      const { data: porEmail } = await supabase
        .from('clientes')
        .select('id, nome, email, whatsapp')
        .eq('user_id', userId)
        .ilike('email', `%${email}%`)
        .limit(5);

      if (porEmail) {
        porEmail.forEach(cliente => {
          if (!clientesSimilares.find(c => c.id === cliente.id)) {
            const similaridade = cliente.email.toLowerCase() === email.toLowerCase() ? 100 : 80;
            clientesSimilares.push({
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email || '',
              whatsapp: cliente.whatsapp || '',
              similaridade,
            });
          }
        });
      }
    }

    // Buscar por whatsapp (exato)
    if (whatsapp) {
      const whatsappLimpo = whatsapp.replace(/\D/g, ''); // Remove caracteres não numéricos
      
      const { data: porWhatsapp } = await supabase
        .from('clientes')
        .select('id, nome, email, whatsapp')
        .eq('user_id', userId)
        .limit(10);

      if (porWhatsapp) {
        porWhatsapp.forEach(cliente => {
          const clienteWhatsappLimpo = (cliente.whatsapp || '').replace(/\D/g, '');
          if (clienteWhatsappLimpo === whatsappLimpo && clienteWhatsappLimpo) {
            if (!clientesSimilares.find(c => c.id === cliente.id)) {
              clientesSimilares.push({
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email || '',
                whatsapp: cliente.whatsapp || '',
                similaridade: 100,
              });
            }
          }
        });
      }
    }

    // Buscar por nome (similar)
    if (nome) {
      const nomeNormalizado = nome.trim().toLowerCase();
      const palavrasNome = nomeNormalizado.split(' ').filter(p => p.length > 2);

      const { data: todosClientes } = await supabase
        .from('clientes')
        .select('id, nome, email, whatsapp')
        .eq('user_id', userId)
        .limit(50); // Buscar mais para comparar similaridade

      if (todosClientes) {
        todosClientes.forEach(cliente => {
          const clienteNomeNormalizado = cliente.nome.toLowerCase();
          
          // Cálculo de similaridade simples
          let similaridade = 0;
          
          // Nome exato
          if (clienteNomeNormalizado === nomeNormalizado) {
            similaridade = 100;
          }
          // Nome contém o nome buscado ou vice-versa
          else if (clienteNomeNormalizado.includes(nomeNormalizado) || nomeNormalizado.includes(clienteNomeNormalizado)) {
            similaridade = 85;
          }
          // Primeiro nome igual
          else if (palavrasNome.length > 0 && clienteNomeNormalizado.includes(palavrasNome[0])) {
            similaridade = 70;
          }
          // Nome muito parecido (diferença de poucas letras)
          else {
            const distancia = calcularDistanciaLevenshtein(nomeNormalizado, clienteNomeNormalizado);
            const maiorNome = Math.max(nomeNormalizado.length, clienteNomeNormalizado.length);
            similaridade = maiorNome > 0 ? Math.round((1 - distancia / maiorNome) * 60) : 0;
          }

          // Adicionar se similaridade >= 60
          if (similaridade >= 60 && !clientesSimilares.find(c => c.id === cliente.id)) {
            clientesSimilares.push({
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email || '',
              whatsapp: cliente.whatsapp || '',
              similaridade,
            });
          }
        });
      }
    }

    // Ordenar por similaridade (maior primeiro)
    return clientesSimilares.sort((a, b) => b.similaridade - a.similaridade);
  } catch (error) {
    console.error('Erro ao buscar clientes similares:', error);
    return [];
  }
}

/**
 * Calcula a distância de Levenshtein entre duas strings
 * (quantidade de edições necessárias para transformar uma na outra)
 */
function calcularDistanciaLevenshtein(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          matrix[i][j - 1] + 1,     // inserção
          matrix[i - 1][j] + 1      // deleção
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Busca o cliente mais similar e sugere mesclagem
 */
export async function buscarClienteParaMesclar(
  nome?: string,
  email?: string,
  whatsapp?: string
): Promise<ClienteSimilar | null> {
  const similares = await buscarClientesSimilares(nome, email, whatsapp);
  
  // Retornar o mais similar se tiver alta confiança (>= 80)
  if (similares.length > 0 && similares[0].similaridade >= 80) {
    return similares[0];
  }
  
  return null;
}

