// Função helper para calcular vencimento do programa

export function calcularVencimentoPrograma(
  dataCompra: string | Date | null | undefined,
  duracaoDias: number | null | undefined = 90
): Date | null {
  if (!dataCompra) return null;
  
  const data = typeof dataCompra === 'string' ? new Date(dataCompra) : dataCompra;
  const duracao = duracaoDias || 90;
  
  const vencimento = new Date(data);
  vencimento.setDate(vencimento.getDate() + duracao);
  
  return vencimento;
}

export function obterStatusVencimento(vencimento: Date | null): {
  status: 'vencido' | 'proximo' | 'ok';
  diasRestantes: number;
  cor: string;
} {
  if (!vencimento) {
    return { status: 'ok', diasRestantes: Infinity, cor: 'text-gray-600' };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);
  
  const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasRestantes < 0) {
    return { status: 'vencido', diasRestantes: Math.abs(diasRestantes), cor: 'text-red-600' };
  } else if (diasRestantes <= 7) {
    return { status: 'proximo', diasRestantes, cor: 'text-orange-600' };
  } else {
    return { status: 'ok', diasRestantes, cor: 'text-green-600' };
  }
}

