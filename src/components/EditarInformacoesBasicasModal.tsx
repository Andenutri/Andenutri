'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import { saveCliente } from '@/data/clientesData';

interface EditarInformacoesBasicasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function EditarInformacoesBasicasModal({ isOpen, onClose, cliente }: EditarInformacoesBasicasModalProps) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    whatsapp: cliente?.whatsapp || '',
    instagram: cliente?.instagram || '',
    pais_telefone: '+55',
    endereco_completo: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    status_programa: cliente?.status_plano || 'ativo',
    status_herbalife: 'nao_pertence',
    status_challenge: 'nao_participa',
    herbalife_usuario: '',
    herbalife_senha: '',
    indicado_por: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const clienteData: any = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        endereco_completo: formData.endereco_completo,
        pais: formData.pais,
        estado: formData.estado,
        cidade: formData.cidade,
        status_plano: formData.status_programa as 'ativo' | 'inativo' | 'pausado',
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
                  onChange={(e) => setFormData({ ...formData, status_programa: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, status_herbalife: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="nao_pertence">❌ Não pertence</option>
                  <option value="ativo">✅ Ativo</option>
                  <option value="inativo">⏸️ Inativo</option>
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
            </div>
          </div>

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
    </div>
  );
}

