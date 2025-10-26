'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteParaEditar?: ClienteComFormulario | null;
}

export default function AddClientModal({ isOpen, onClose, clienteParaEditar }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    // Informações Básicas
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    pais_telefone: '+55',
    
    // Endereço
    endereco_completo: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    
    // Status
    status_programa: 'ativo',
    status_herbalife: 'inativo',
    status_challenge: 'nao',
    
    // Herbalife
    herbalife_usuario: '',
    herbalife_senha: '',
    
    // Indicação
    indicado_por: '',
    
    // Dados da Pré-Consulta (se disponível)
    formulario: null as any,
  });

  useEffect(() => {
    if (clienteParaEditar) {
      setFormData({
        nome: clienteParaEditar.nome || '',
        email: clienteParaEditar.email || '',
        telefone: clienteParaEditar.telefone || '',
        whatsapp: clienteParaEditar.whatsapp || '',
        instagram: clienteParaEditar.instagram || '',
        pais_telefone: '+55',
        endereco_completo: clienteParaEditar.formulario?.endereco_completo || '',
        pais: 'Brasil',
        estado: '',
        cidade: '',
        status_programa: clienteParaEditar.status_plano === 'ativo' ? 'ativo' : clienteParaEditar.status_plano === 'inativo' ? 'inativo' : 'pausado',
        status_herbalife: 'inativo',
        status_challenge: 'nao',
        herbalife_usuario: '',
        herbalife_senha: '',
        indicado_por: '',
        formulario: clienteParaEditar.formulario || null,
      });
    }
  }, [clienteParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(clienteParaEditar ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-amber-700">
            {clienteParaEditar ? '✏️ Editar Cliente' : '➕ Adicionar Novo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="border-2 border-amber-200 rounded-xl p-6 bg-amber-50">
            <h3 className="text-lg font-bold text-amber-700 mb-4">👤 Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input 
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.pais_telefone}
                    onChange={(e) => setFormData({...formData, pais_telefone: e.target.value})}
                    className="w-32 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
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
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 98765-4321"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input 
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="(11) 98765-4321"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input 
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  placeholder="@usuario"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 mb-4">📍 Endereço Completo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                <input 
                  type="text"
                  value={formData.endereco_completo}
                  onChange={(e) => setFormData({...formData, endereco_completo: e.target.value})}
                  placeholder="Rua, Número, Apto, Bairro"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <input 
                  type="text"
                  value={formData.pais}
                  onChange={(e) => setFormData({...formData, pais: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <input 
                  type="text"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  placeholder="SP, RJ, MG..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input 
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  placeholder="São Paulo, Rio de Janeiro..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status do Programa */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="text-lg font-bold text-purple-700 mb-4">🏷️ Status do Programa</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
                <select 
                  value={formData.status_programa}
                  onChange={(e) => setFormData({...formData, status_programa: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="ativo">🟢 Ativo</option>
                  <option value="inativo">🔴 Inativo</option>
                  <option value="pausado">🟡 Pausado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Herbalife</label>
                <select 
                  value={formData.status_herbalife}
                  onChange={(e) => setFormData({...formData, status_herbalife: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="ativo">🟢 Ativo</option>
                  <option value="inativo">🔴 Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge</label>
                <select 
                  value={formData.status_challenge}
                  onChange={(e) => setFormData({...formData, status_challenge: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="nao">❌ Não</option>
                  <option value="sim">✅ Sim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Herbalife */}
          {formData.status_herbalife === 'ativo' && (
            <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
              <h3 className="text-lg font-bold text-green-700 mb-4">🥤 Herbalife</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuário Herbalife</label>
                  <input 
                    type="text"
                    value={formData.herbalife_usuario}
                    onChange={(e) => setFormData({...formData, herbalife_usuario: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Herbalife</label>
                  <input 
                    type="password"
                    value={formData.herbalife_senha}
                    onChange={(e) => setFormData({...formData, herbalife_senha: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Indicado Por */}
          <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
            <h3 className="text-lg font-bold text-pink-700 mb-4">👥 Indicação</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indicado Por</label>
              <input 
                type="text"
                value={formData.indicado_por}
                onChange={(e) => setFormData({...formData, indicado_por: e.target.value})}
                placeholder="Nome da pessoa que indicou"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Informação de Pré-Consulta */}
          {clienteParaEditar?.formulario && (
            <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
              <h3 className="text-lg font-bold text-indigo-700 mb-4">📋 Dados da Pré-Consulta Existentes</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Peso Atual:</strong> {clienteParaEditar.formulario.peso_atual} kg</p>
                <p><strong>Peso Desejado:</strong> {clienteParaEditar.formulario.peso_desejado} kg</p>
                {clienteParaEditar.formulario.idade && <p><strong>Idade:</strong> {clienteParaEditar.formulario.idade} anos</p>}
                {clienteParaEditar.formulario.altura && <p><strong>Altura:</strong> {clienteParaEditar.formulario.altura} cm</p>}
              </div>
              <p className="text-xs text-indigo-600 mt-3">
                💡 Os dados completos da pré-consulta estão salvos e podem ser acessados através do botão "Editar Cliente" no modal de detalhes.
              </p>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
            >
              {clienteParaEditar ? '💾 Salvar Alterações' : '➕ Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
