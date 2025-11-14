'use client';

import { useState, useEffect } from 'react';
import { 
  getAllPagamentos, 
  getPagamentosByPeriodo, 
  createPagamento, 
  updatePagamento, 
  deletePagamento,
  calcularTotalPagamentos,
  FORMAS_PAGAMENTO,
  type Pagamento 
} from '@/data/pagamentosData';
import { getAllClientes } from '@/data/clientesData';

interface FinanceiroViewProps {
  sidebarOpen: boolean;
}

export default function FinanceiroView({ sidebarOpen }: FinanceiroViewProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'mes' | 'ano' | 'periodo'>('todos');
  const [filtroMes, setFiltroMes] = useState<number>(new Date().getMonth() + 1);
  const [filtroAno, setFiltroAno] = useState<number>(new Date().getFullYear());
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('');
  const [filtroDataFim, setFiltroDataFim] = useState<string>('');
  const [filtroFormaPagamento, setFiltroFormaPagamento] = useState<string>('todos');
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [pagamentoEditando, setPagamentoEditando] = useState<Pagamento | null>(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    valor: '',
    forma_pagamento: 'pix' as Pagamento['forma_pagamento'],
    data_pagamento: new Date().toISOString().split('T')[0],
    observacoes: '',
  });

  // Carregar dados
  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    loadPagamentos();
  }, [filtroTipo, filtroMes, filtroAno, filtroDataInicio, filtroDataFim, filtroFormaPagamento]);

  async function loadClientes() {
    const clientesData = await getAllClientes();
    setClientes(clientesData);
  }

  async function loadPagamentos() {
    setLoading(true);
    try {
      let pagamentosData: Pagamento[] = [];

      if (filtroTipo === 'todos') {
        pagamentosData = await getAllPagamentos();
      } else if (filtroTipo === 'mes') {
        pagamentosData = await getPagamentosByPeriodo(undefined, undefined, filtroMes, filtroAno);
      } else if (filtroTipo === 'ano') {
        pagamentosData = await getPagamentosByPeriodo(undefined, undefined, undefined, filtroAno);
      } else if (filtroTipo === 'periodo') {
        if (filtroDataInicio && filtroDataFim) {
          pagamentosData = await getPagamentosByPeriodo(filtroDataInicio, filtroDataFim);
        } else {
          pagamentosData = await getAllPagamentos();
        }
      }

      // Filtrar por forma de pagamento se necessário
      if (filtroFormaPagamento !== 'todos') {
        pagamentosData = pagamentosData.filter(p => p.forma_pagamento === filtroFormaPagamento);
      }

      setPagamentos(pagamentosData);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalNovo() {
    setPagamentoEditando(null);
    setFormData({
      cliente_id: '',
      valor: '',
      forma_pagamento: 'pix',
      data_pagamento: new Date().toISOString().split('T')[0],
      observacoes: '',
    });
    setShowModal(true);
  }

  function abrirModalEditar(pagamento: Pagamento) {
    setPagamentoEditando(pagamento);
    setFormData({
      cliente_id: pagamento.cliente_id,
      valor: pagamento.valor.toString(),
      forma_pagamento: pagamento.forma_pagamento,
      data_pagamento: pagamento.data_pagamento,
      observacoes: pagamento.observacoes || '',
    });
    setShowModal(true);
  }

  async function handleSalvar() {
    if (!formData.cliente_id || !formData.valor || !formData.data_pagamento) {
      alert('❌ Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const pagamentoData = {
        cliente_id: formData.cliente_id,
        valor: parseFloat(formData.valor),
        forma_pagamento: formData.forma_pagamento,
        data_pagamento: formData.data_pagamento,
        observacoes: formData.observacoes || undefined,
      };

      if (pagamentoEditando) {
        await updatePagamento(pagamentoEditando.id, pagamentoData);
      } else {
        await createPagamento(pagamentoData);
      }

      setShowModal(false);
      loadPagamentos();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
    }
  }

  async function handleDeletar(pagamentoId: string) {
    if (!confirm('Tem certeza que deseja excluir este pagamento?')) {
      return;
    }

    const sucesso = await deletePagamento(pagamentoId);
    if (sucesso) {
      loadPagamentos();
    }
  }

  const totalEntradas = calcularTotalPagamentos(pagamentos);
  const clienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="md:ml-24">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">💰 Financeiro</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Gestão de entradas e pagamentos</p>
          </div>
          <button
            onClick={abrirModalNovo}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-sm md:text-base"
          >
            ➕ Novo Pagamento
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Card de Total */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm md:text-base opacity-90">Total de Entradas</p>
              <p className="text-3xl md:text-4xl font-bold mt-2">
                R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-2 opacity-90">
                {pagamentos.length} {pagamentos.length === 1 ? 'pagamento' : 'pagamentos'}
              </p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tipo de Filtro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Filtro</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              >
                <option value="todos">Todos</option>
                <option value="mes">Por Mês</option>
                <option value="ano">Por Ano</option>
                <option value="periodo">Por Período</option>
              </select>
            </div>

            {/* Filtro por Mês */}
            {filtroTipo === 'mes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                  <select
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                      <option key={mes} value={mes}>
                        {new Date(2024, mes - 1).toLocaleString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                  <input
                    type="number"
                    value={filtroAno}
                    onChange={(e) => setFiltroAno(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                    min="2020"
                    max="2100"
                  />
                </div>
              </>
            )}

            {/* Filtro por Ano */}
            {filtroTipo === 'ano' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                <input
                  type="number"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  min="2020"
                  max="2100"
                />
              </div>
            )}

            {/* Filtro por Período */}
            {filtroTipo === 'periodo' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Filtro por Forma de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
              <select
                value={filtroFormaPagamento}
                onChange={(e) => setFiltroFormaPagamento(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              >
                <option value="todos">Todas</option>
                {FORMAS_PAGAMENTO.map(forma => (
                  <option key={forma.value} value={forma.value}>{forma.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pagamentos */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Entradas</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
              <p className="mt-4 text-gray-600">Carregando pagamentos...</p>
            </div>
          ) : pagamentos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum pagamento encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Forma de Pagamento</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Observações</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((pagamento) => (
                    <tr key={pagamento.id} className="border-b border-gray-100 hover:bg-amber-50">
                      <td className="py-3 px-4">
                        {new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 font-medium">{clienteNome(pagamento.cliente_id)}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        R$ {Number(pagamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        {FORMAS_PAGAMENTO.find(f => f.value === pagamento.forma_pagamento)?.label || pagamento.forma_pagamento}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {pagamento.observacoes || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModalEditar(pagamento)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeletar(pagamento.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar/Editar Pagamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-amber-700 mb-4">
              {pagamentoEditando ? '✏️ Editar Pagamento' : '➕ Novo Pagamento'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento *</label>
                <select
                  value={formData.forma_pagamento}
                  onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value as Pagamento['forma_pagamento'] })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                >
                  {FORMAS_PAGAMENTO.map(forma => (
                    <option key={forma.value} value={forma.value}>{forma.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data do Pagamento *</label>
                <input
                  type="date"
                  value={formData.data_pagamento}
                  onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  rows={3}
                  placeholder="Observações sobre o pagamento (opcional)"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
              >
                {pagamentoEditando ? '💾 Salvar' : '✅ Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

