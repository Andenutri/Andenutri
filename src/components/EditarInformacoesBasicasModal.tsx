'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import { saveCliente } from '@/data/clientesData';
import { 
  getPagamentosByCliente, 
  createPagamento,
  updatePagamento,
  deletePagamento,
  FORMAS_PAGAMENTO,
  type Pagamento 
} from '@/data/pagamentosData';

interface EditarInformacoesBasicasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function EditarInformacoesBasicasModal({ isOpen, onClose, cliente }: EditarInformacoesBasicasModalProps) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || cliente?.formulario?.nome_completo || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    whatsapp: cliente?.whatsapp || cliente?.formulario?.whatsapp || '',
    instagram: cliente?.instagram || cliente?.formulario?.instagram || '',
    pais_telefone: '+55',
    perfil: (cliente as any)?.perfil || '',
    endereco_completo: cliente?.endereco_completo || cliente?.formulario?.endereco_completo || '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    status_programa: cliente?.status_plano || 'ativo',
    status_herbalife: (cliente as any)?.status_herbalife || 'nao_pertence',
    status_challenge: (cliente as any)?.status_challenge || 'nao_participa',
    herbalife_usuario: (cliente as any)?.herbalife_usuario || '',
    herbalife_senha: (cliente as any)?.herbalife_senha || '',
    indicado_por: (cliente as any)?.indicado_por || '',
    is_lead: (cliente as any)?.is_lead || false,
    data_proxima_consulta: (cliente as any)?.data_proxima_consulta || '',
    suplementos: (cliente as any)?.suplementos || '',
    data_compra_programa: (cliente as any)?.data_compra_programa || '',
    duracao_programa_dias: (cliente as any)?.duracao_programa_dias || 90,
  });

  const [saving, setSaving] = useState(false);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loadingPagamentos, setLoadingPagamentos] = useState(false);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);
  const [pagamentoEditando, setPagamentoEditando] = useState<Pagamento | null>(null);
  const [pagamentoFormData, setPagamentoFormData] = useState({
    valor: '',
    forma_pagamento: 'pix' as Pagamento['forma_pagamento'],
    data_pagamento: new Date().toISOString().split('T')[0],
    descricao: '',
  });

  // Carregar pagamentos quando o modal abrir
  useEffect(() => {
    if (isOpen && cliente?.id) {
      loadPagamentos();
    }
  }, [isOpen, cliente?.id]);

  // Atualizar formData quando o cliente mudar ou o modal abrir
  useEffect(() => {
    if (isOpen && cliente) {
      setFormData({
        nome: cliente?.nome || cliente?.formulario?.nome_completo || '',
        email: cliente?.email || '',
        telefone: cliente?.telefone || '',
        whatsapp: cliente?.whatsapp || cliente?.formulario?.whatsapp || '',
        instagram: cliente?.instagram || cliente?.formulario?.instagram || '',
        pais_telefone: '+55',
        perfil: (cliente as any)?.perfil || '',
        endereco_completo: cliente?.endereco_completo || cliente?.formulario?.endereco_completo || '',
        pais: 'Brasil',
        estado: '',
        cidade: '',
        status_programa: cliente?.status_plano || 'ativo',
        status_herbalife: (cliente as any)?.status_herbalife || 'nao_pertence',
        status_challenge: (cliente as any)?.status_challenge || 'nao_participa',
        herbalife_usuario: (cliente as any)?.herbalife_usuario || '',
        herbalife_senha: (cliente as any)?.herbalife_senha || '',
        indicado_por: (cliente as any)?.indicado_por || '',
        is_lead: (cliente as any)?.is_lead || false,
        data_proxima_consulta: (cliente as any)?.data_proxima_consulta || '',
        suplementos: (cliente as any)?.suplementos || '',
        data_compra_programa: (cliente as any)?.data_compra_programa || '',
        duracao_programa_dias: (cliente as any)?.duracao_programa_dias || 90,
      });
    }
  }, [isOpen, cliente]);

  const loadPagamentos = async () => {
    if (!cliente?.id) return;
    setLoadingPagamentos(true);
    try {
      const pagamentosData = await getPagamentosByCliente(cliente.id);
      setPagamentos(pagamentosData);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoadingPagamentos(false);
    }
  };

  const handleSalvarPagamento = async () => {
    if (!cliente?.id) return;
    if (!pagamentoFormData.valor || !pagamentoFormData.data_pagamento) {
      alert('❌ Preencha valor e data do pagamento.');
      return;
    }

    try {
      const valorNumerico = parseFloat(pagamentoFormData.valor.replace(',', '.'));
      if (isNaN(valorNumerico)) {
        alert('❌ Valor inválido.');
        return;
      }

      const pagamentoData = {
        cliente_id: cliente.id,
        valor: valorNumerico,
        forma_pagamento: pagamentoFormData.forma_pagamento,
        data_pagamento: new Date(pagamentoFormData.data_pagamento).toISOString(),
        observacoes: pagamentoFormData.descricao || undefined,
      };

      if (pagamentoEditando?.id) {
        await updatePagamento(pagamentoEditando.id, pagamentoData);
      } else {
        await createPagamento(pagamentoData);
      }
      
      alert('✅ Pagamento salvo com sucesso!');
      await loadPagamentos();
      handleFecharPagamentoModal();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      alert('❌ Erro ao salvar pagamento. Verifique o console.');
    }
  };

  const handleExcluirPagamento = async (pagamentoId: string) => {
    if (!confirm('⚠️ Tem certeza que deseja excluir este pagamento?')) {
      return;
    }

    try {
      await deletePagamento(pagamentoId);
      alert('✅ Pagamento excluído com sucesso!');
      await loadPagamentos();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      alert('❌ Erro ao excluir pagamento. Verifique o console.');
    }
  };

  const handleFecharPagamentoModal = () => {
    setShowPagamentoModal(false);
    setPagamentoEditando(null);
    setPagamentoFormData({
      valor: '',
      forma_pagamento: 'pix',
      data_pagamento: new Date().toISOString().split('T')[0],
      descricao: '',
    });
  };

  const handleEditarPagamento = (pagamento: Pagamento) => {
    setPagamentoEditando(pagamento);
    setPagamentoFormData({
      valor: pagamento.valor.toString(),
      forma_pagamento: pagamento.forma_pagamento,
      data_pagamento: new Date(pagamento.data_pagamento).toISOString().split('T')[0],
      descricao: pagamento.observacoes || '',
    });
    setShowPagamentoModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // PROTEÇÃO: Se cliente tem data_compra_programa, NUNCA pode ser lead
      const temDataCompra = (cliente as any)?.data_compra_programa;
      let isLeadFinal = formData.is_lead;
      
      if (temDataCompra && formData.is_lead === true) {
        alert('⚠️ Este cliente comprou o programa de 90 dias. Não é possível marcá-lo como Lead. Ele permanecerá como Cliente (mesmo que inativo).');
        isLeadFinal = false;
      }

      const clienteData: any = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        perfil: formData.perfil || undefined,
        endereco_completo: formData.endereco_completo,
        pais: formData.pais,
        estado: formData.estado,
        cidade: formData.cidade,
        status_plano: formData.status_programa as 'ativo' | 'inativo' | 'pausado',
        status_herbalife: formData.status_herbalife,
        herbalife_usuario: formData.herbalife_usuario || undefined,
        herbalife_senha: formData.herbalife_senha || undefined,
        indicado_por: formData.indicado_por || undefined,
        is_lead: isLeadFinal,
        data_proxima_consulta: formData.data_proxima_consulta || undefined,
        suplementos: formData.suplementos || undefined,
        data_compra_programa: formData.data_compra_programa || undefined,
        duracao_programa_dias: formData.duracao_programa_dias || 90,
      };

      if (cliente?.id) {
        clienteData.id = cliente.id;
      }

      await saveCliente(clienteData);
      alert('✅ Informações básicas atualizadas com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar informações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
          <h2 className="text-2xl font-bold text-amber-700">✏️ Editar Informações Básicas</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações de Contato */}
          <div className="border-2 border-amber-200 rounded-xl p-6 bg-amber-50">
            <h3 className="text-lg font-bold text-amber-700 mb-4">📞 Informações de Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <div className="flex gap-2">
                  <select
                    value={formData.pais_telefone}
                    onChange={(e) => setFormData({ ...formData, pais_telefone: e.target.value })}
                    className="w-32 px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                  </select>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@usuario"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">👤 Perfil/Anotações</label>
                <textarea
                  value={formData.perfil}
                  onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                  placeholder="Digite informações importantes sobre esta pessoa para te lembrar (ex: interesses, personalidade, observações, etc.)"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">📝 Use este campo para anotações pessoais sobre o cliente</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">💊 Suplementos</label>
                <textarea
                  value={formData.suplementos}
                  onChange={(e) => setFormData({ ...formData, suplementos: e.target.value })}
                  placeholder="Informe os suplementos que o cliente está usando (ex: Whey protein, creatina, multivitamínico, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">💊 Preencha livremente as informações sobre suplementos do cliente</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 mb-4">📍 Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                <input
                  type="text"
                  value={formData.endereco_completo}
                  onChange={(e) => setFormData({ ...formData, endereco_completo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <select
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="Brasil">🇧🇷 Brasil</option>
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Itália">🇮🇹 Itália</option>
                  <option value="Reino Unido">🇬🇧 Reino Unido</option>
                  <option value="Espanha">🇪🇸 Espanha</option>
                  <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <input
                  type="text"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h3 className="text-lg font-bold text-green-700 mb-4">🎯 Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status no Programa</label>
                <select
                  value={formData.status_programa}
                  onChange={(e) => setFormData({ ...formData, status_programa: e.target.value as 'ativo' | 'inativo' | 'pausado' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="ativo">✅ Ativo</option>
                  <option value="inativo">⏸️ Inativo</option>
                  <option value="pausado">⏸️ Pausado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Herbalife</label>
                <select
                  value={formData.status_herbalife}
                  onChange={(e) => setFormData({ ...formData, status_herbalife: e.target.value as 'nao_pertence' | 'ativo' | 'inativo' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="nao_pertence">❌ Não pertence</option>
                  <option value="ativo">✅ Ativo</option>
                  <option value="inativo">⏸️ Inativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Challenge</label>
                <select
                  value={formData.status_challenge}
                  onChange={(e) => setFormData({ ...formData, status_challenge: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="nao_participa">❌ Não participa</option>
                  <option value="participa">✅ Participa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuário Herbalife</label>
                <input
                  type="text"
                  value={formData.herbalife_usuario}
                  onChange={(e) => setFormData({ ...formData, herbalife_usuario: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha Herbalife</label>
                <input
                  type="password"
                  value={formData.herbalife_senha}
                  onChange={(e) => setFormData({ ...formData, herbalife_senha: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Indicado por</label>
                <input
                  type="text"
                  value={formData.indicado_por}
                  onChange={(e) => setFormData({ ...formData, indicado_por: e.target.value })}
                  placeholder="Nome de quem indicou o cliente"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className={`flex items-center gap-2 ${(cliente as any)?.data_compra_programa ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={formData.is_lead}
                    disabled={!!(cliente as any)?.data_compra_programa}
                    onChange={(e) => {
                      if (!(cliente as any)?.data_compra_programa) {
                        setFormData({ ...formData, is_lead: e.target.checked });
                      }
                    }}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    📊 É Lead (Cliente em potencial)
                    {(cliente as any)?.data_compra_programa && (
                      <span className="ml-2 text-xs text-red-600 font-semibold">
                        (Cliente que comprou programa não pode ser Lead)
                      </span>
                    )}
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Próxima Consulta</label>
                <input
                  type="date"
                  value={formData.data_proxima_consulta ? new Date(formData.data_proxima_consulta).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, data_proxima_consulta: e.target.value || undefined })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Defina a data da próxima consulta com este cliente</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Data de Compra do Programa</label>
                <input
                  type="date"
                  value={formData.data_compra_programa ? new Date(formData.data_compra_programa).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, data_compra_programa: e.target.value || undefined })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Data em que o cliente comprou o programa</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">⏱️ Duração do Programa (dias)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.duracao_programa_dias}
                  onChange={(e) => setFormData({ ...formData, duracao_programa_dias: parseInt(e.target.value) || 90 })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Duração do programa em dias (ex: 30, 60, 90 dias)</p>
              </div>
            </div>
          </div>

          {/* Pagamentos */}
          {cliente?.id && (
            <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-700">💰 Pagamentos</h3>
                <button
                  type="button"
                  onClick={() => {
                    setPagamentoEditando(null);
                    setPagamentoFormData({
                      valor: '',
                      forma_pagamento: 'pix',
                      data_pagamento: new Date().toISOString().split('T')[0],
                      descricao: '',
                    });
                    setShowPagamentoModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                >
                  ➕ Adicionar Pagamento
                </button>
              </div>

              {loadingPagamentos ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
                </div>
              ) : pagamentos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum pagamento registrado</p>
              ) : (
                <div className="space-y-2">
                  {pagamentos.map((pagamento) => {
                    const formaPagamento = FORMAS_PAGAMENTO.find(f => f.value === pagamento.forma_pagamento);
                    return (
                      <div
                        key={pagamento.id}
                        className="bg-white rounded-lg p-3 border-2 border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              R$ {Number(pagamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {formaPagamento?.label || pagamento.forma_pagamento}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            📅 {new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}
                            {pagamento.observacoes && (
                              <span className="ml-2">• {pagamento.observacoes}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditarPagamento(pagamento)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExcluirPagamento(pagamento.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total:</span>
                      <span className="text-lg font-bold text-purple-700">
                        R$ {pagamentos.reduce((sum, p) => sum + Number(p.valor), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold disabled:opacity-50"
            >
              {saving ? '💾 Salvando...' : '✅ Salvar Informações'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Pagamento */}
      {showPagamentoModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-purple-700 mb-4">
              {pagamentoEditando ? '✏️ Editar Pagamento' : '➕ Adicionar Pagamento'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                <input
                  type="text"
                  value={pagamentoFormData.valor}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,.-]/g, '');
                    setPagamentoFormData({ ...pagamentoFormData, valor: value });
                  }}
                  placeholder="0,00"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                <select
                  value={pagamentoFormData.forma_pagamento}
                  onChange={(e) => setPagamentoFormData({ ...pagamentoFormData, forma_pagamento: e.target.value as Pagamento['forma_pagamento'] })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  {FORMAS_PAGAMENTO.map(forma => (
                    <option key={forma.value} value={forma.value}>
                      {forma.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data do Pagamento</label>
                <input
                  type="date"
                  value={pagamentoFormData.data_pagamento}
                  onChange={(e) => setPagamentoFormData({ ...pagamentoFormData, data_pagamento: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={pagamentoFormData.descricao}
                  onChange={(e) => setPagamentoFormData({ ...pagamentoFormData, descricao: e.target.value })}
                  placeholder="Observações sobre o pagamento..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleFecharPagamentoModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarPagamento}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

