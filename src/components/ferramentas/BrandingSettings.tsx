'use client';

import { useState, useEffect } from 'react';
import {
  getConfiguracaoAtual,
  saveConfiguracao,
  uploadLogo,
  ConfiguracaoProfissional,
} from '@/data/configuracoesData';

export default function BrandingSettings() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoProfissional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      const config = await getConfiguracaoAtual();
      setConfiguracao(config);
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl && configuracao) {
        const updated = { ...configuracao, logo_url: logoUrl };
        setConfiguracao(updated);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('❌ Erro ao fazer upload do logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!configuracao) return;

    setSaving(true);
    try {
      const saved = await saveConfiguracao(configuracao);
      if (saved) {
        setConfiguracao(saved);
        alert('✅ Configurações salvas com sucesso!');
      } else {
        alert('❌ Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ConfiguracaoProfissional, value: any) => {
    if (!configuracao) return;
    setConfiguracao({ ...configuracao, [field]: value });
  };

  const updateCorTema = (cor: string, value: string) => {
    if (!configuracao) return;
    setConfiguracao({
      ...configuracao,
      cores_tema: {
        ...configuracao.cores_tema,
        [cor]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando configurações...</p>
      </div>
    );
  }

  if (!configuracao) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Erro ao carregar configurações</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">🎨 Logo</h3>
        <div className="space-y-4">
          {configuracao.logo_url && (
            <div className="flex items-center gap-4">
              <img
                src={configuracao.logo_url}
                alt="Logo"
                className="h-20 object-contain border-2 border-gray-200 rounded p-2"
              />
              <div>
                <p className="text-sm text-gray-600 mb-2">Logo atual</p>
                <button
                  onClick={() => updateField('logo_url', '')}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {configuracao.logo_url ? 'Substituir Logo' : 'Upload de Logo'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
            {uploadingLogo && (
              <p className="text-sm text-gray-500 mt-2">⏳ Enviando logo...</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formato recomendado: PNG ou SVG transparente, até 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Profissional
            </label>
            <input
              type="text"
              value={configuracao.nome_profissional || ''}
              onChange={(e) => updateField('nome_profissional', e.target.value)}
              placeholder="Ex: Dr. João Silva"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome da Empresa/Clínica
            </label>
            <input
              type="text"
              value={configuracao.nome_empresa || ''}
              onChange={(e) => updateField('nome_empresa', e.target.value)}
              placeholder="Ex: Clínica Andenutri"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contatos */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📞 Informações de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={configuracao.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="contato@exemplo.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
            <input
              type="tel"
              value={configuracao.telefone || ''}
              onChange={(e) => updateField('telefone', e.target.value)}
              placeholder="(11) 98765-4321"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
            <input
              type="tel"
              value={configuracao.whatsapp || ''}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              placeholder="(11) 98765-4321"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
            <input
              type="text"
              value={configuracao.instagram || ''}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="@seu_instagram"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site</label>
            <input
              type="url"
              value={configuracao.site || ''}
              onChange={(e) => updateField('site', e.target.value)}
              placeholder="https://www.exemplo.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📍 Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço Completo</label>
            <input
              type="text"
              value={configuracao.endereco || ''}
              onChange={(e) => updateField('endereco', e.target.value)}
              placeholder="Rua, número, complemento"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
            <input
              type="text"
              value={configuracao.cidade || ''}
              onChange={(e) => updateField('cidade', e.target.value)}
              placeholder="São Paulo"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
            <input
              type="text"
              value={configuracao.estado || ''}
              onChange={(e) => updateField('estado', e.target.value)}
              placeholder="SP"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CEP</label>
            <input
              type="text"
              value={configuracao.cep || ''}
              onChange={(e) => updateField('cep', e.target.value)}
              placeholder="01234-567"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cores do Tema */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">🎨 Cores do Tema (opcional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Personalize as cores usadas nos relatórios gerados
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Primária</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={configuracao.cores_tema?.primaria || '#3b82f6'}
                onChange={(e) => updateCorTema('primaria', e.target.value)}
                className="w-16 h-12 border-2 border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={configuracao.cores_tema?.primaria || '#3b82f6'}
                onChange={(e) => updateCorTema('primaria', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Secundária</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={configuracao.cores_tema?.secundaria || '#8b5cf6'}
                onChange={(e) => updateCorTema('secundaria', e.target.value)}
                className="w-16 h-12 border-2 border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={configuracao.cores_tema?.secundaria || '#8b5cf6'}
                onChange={(e) => updateCorTema('secundaria', e.target.value)}
                placeholder="#8b5cf6"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor de Destaque</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={configuracao.cores_tema?.destaque || '#10b981'}
                onChange={(e) => updateCorTema('destaque', e.target.value)}
                className="w-16 h-12 border-2 border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={configuracao.cores_tema?.destaque || '#10b981'}
                onChange={(e) => updateCorTema('destaque', e.target.value)}
                placeholder="#10b981"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor de Fundo</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={configuracao.cores_tema?.fundo || '#f9fafb'}
                onChange={(e) => updateCorTema('fundo', e.target.value)}
                className="w-16 h-12 border-2 border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={configuracao.cores_tema?.fundo || '#f9fafb'}
                onChange={(e) => updateCorTema('fundo', e.target.value)}
                placeholder="#f9fafb"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 md:p-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-3"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

