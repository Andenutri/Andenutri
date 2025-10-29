'use client';

import { useState } from 'react';
import { CampoAnamnese, CampoType, createAnamnese, updateAnamnese, Anamnese } from '@/data/anamnesesData';

interface AnamneseBuilderProps {
  anamnese?: Anamnese;
  onSave?: (anamnese: Anamnese) => void;
}

export default function AnamneseBuilder({ anamnese, onSave }: AnamneseBuilderProps) {
  const [nome, setNome] = useState(anamnese?.nome || '');
  const [descricao, setDescricao] = useState(anamnese?.descricao || '');
  const [campos, setCampos] = useState<CampoAnamnese[]>(anamnese?.campos || []);
  const [saving, setSaving] = useState(false);

  const tiposDisponiveis: { value: CampoType; label: string; icon: string }[] = [
    { value: 'texto', label: 'Texto', icon: '📝' },
    { value: 'numero', label: 'Número', icon: '🔢' },
    { value: 'data', label: 'Data', icon: '📅' },
    { value: 'select', label: 'Seleção', icon: '📋' },
    { value: 'checkbox', label: 'Múltipla Escolha', icon: '☑️' },
    { value: 'textarea', label: 'Texto Longo', icon: '📄' },
    { value: 'escala', label: 'Escala', icon: '📊' },
  ];

  const adicionarCampo = (tipo: CampoType) => {
    const novoCampo: CampoAnamnese = {
      id: `campo_${Date.now()}`,
      tipo,
      label: 'Novo campo',
      obrigatorio: false,
    };

    // Valores padrão por tipo
    if (tipo === 'select' || tipo === 'checkbox') {
      novoCampo.opcoes = ['Opção 1', 'Opção 2'];
    }
    if (tipo === 'escala') {
      novoCampo.min = 1;
      novoCampo.max = 10;
    }

    setCampos([...campos, novoCampo]);
  };

  const removerCampo = (index: number) => {
    setCampos(campos.filter((_, i) => i !== index));
  };

  const atualizarCampo = (index: number, updates: Partial<CampoAnamnese>) => {
    const novosCampos = [...campos];
    novosCampos[index] = { ...novosCampos[index], ...updates };
    setCampos(novosCampos);
  };

  const moverCampo = (index: number, direcao: 'up' | 'down') => {
    if (direcao === 'up' && index === 0) return;
    if (direcao === 'down' && index === campos.length - 1) return;

    const novosCampos = [...campos];
    const [removido] = novosCampos.splice(index, 1);
    novosCampos.splice(direcao === 'up' ? index - 1 : index + 1, 0, removido);
    setCampos(novosCampos);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      alert('Por favor, informe um nome para a anamnese');
      return;
    }

    setSaving(true);

    try {
      const anamneseData: Partial<Anamnese> = {
        nome,
        descricao,
        campos,
        ativo: true,
      };

      let saved;
      if (anamnese?.id) {
        saved = await updateAnamnese(anamnese.id, anamneseData);
      } else {
        saved = await createAnamnese(anamneseData);
      }

      if (saved) {
        alert('✅ Anamnese salva com sucesso!');
        if (onSave) {
          onSave(saved);
        }
      } else {
        alert('❌ Erro ao salvar anamnese');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar anamnese');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Informações da Anamnese</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome da Anamnese *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Anamnese Inicial, Questionário de Saúde..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição sobre esta anamnese..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Campos do Formulário */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">📝 Campos do Formulário</h3>
          <button
            onClick={handleSave}
            disabled={saving || !nome.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {saving ? '💾 Salvando...' : '💾 Salvar Anamnese'}
          </button>
        </div>

        {/* Botões de Adicionar Campo */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {tiposDisponiveis.map((tipo) => (
            <button
              key={tipo.value}
              onClick={() => adicionarCampo(tipo.value)}
              className="px-3 py-2 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
            >
              <span className="text-lg">{tipo.icon}</span>
              <div className="text-xs mt-1">{tipo.label}</div>
            </button>
          ))}
        </div>

        {/* Lista de Campos */}
        <div className="space-y-4">
          {campos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>Nenhum campo adicionado ainda. Clique nos botões acima para adicionar.</p>
            </div>
          )}

          {campos.map((campo, index) => (
            <div key={campo.id} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {tiposDisponiveis.find((t) => t.value === campo.tipo)?.icon}
                  </span>
                  <span className="font-semibold text-gray-700">
                    Campo {index + 1}: {campo.label || 'Sem nome'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moverCampo(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                    title="Mover para cima"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moverCampo(index, 'down')}
                    disabled={index === campos.length - 1}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                    title="Mover para baixo"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => removerCampo(index)}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Label do Campo *
                  </label>
                  <input
                    type="text"
                    value={campo.label}
                    onChange={(e) => atualizarCampo(index, { label: e.target.value })}
                    placeholder="Ex: Nome completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Placeholder (opcional)
                  </label>
                  <input
                    type="text"
                    value={campo.placeholder || ''}
                    onChange={(e) => atualizarCampo(index, { placeholder: e.target.value })}
                    placeholder="Ex: Digite seu nome"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                {campo.tipo !== 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={campo.obrigatorio || false}
                      onChange={(e) => atualizarCampo(index, { obrigatorio: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">Campo obrigatório</label>
                  </div>
                )}

                {/* Opções para Select e Checkbox */}
                {(campo.tipo === 'select' || campo.tipo === 'checkbox') && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Opções (uma por linha)
                    </label>
                    <textarea
                      value={campo.opcoes?.join('\n') || ''}
                      onChange={(e) =>
                        atualizarCampo(index, {
                          opcoes: e.target.value.split('\n').filter((o) => o.trim()),
                        })
                      }
                      placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}

                {/* Valores Min/Max para Escala */}
                {campo.tipo === 'escala' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Valor Mínimo
                      </label>
                      <input
                        type="number"
                        value={campo.min || 1}
                        onChange={(e) => atualizarCampo(index, { min: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Valor Máximo
                      </label>
                      <input
                        type="number"
                        value={campo.max || 10}
                        onChange={(e) => atualizarCampo(index, { max: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview do Formulário */}
      {campos.length > 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">👁️ Preview do Formulário</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-300">
            {campos.map((campo) => (
              <div key={campo.id} className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {campo.label}
                  {campo.obrigatorio && <span className="text-red-500"> *</span>}
                </label>
                {/* Renderizar preview baseado no tipo */}
                {campo.tipo === 'texto' && (
                  <input
                    type="text"
                    placeholder={campo.placeholder}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                )}
                {campo.tipo === 'numero' && (
                  <input
                    type="number"
                    placeholder={campo.placeholder}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                )}
                {campo.tipo === 'data' && (
                  <input
                    type="date"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                )}
                {campo.tipo === 'select' && (
                  <select disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50">
                    <option>{campo.placeholder || 'Selecione...'}</option>
                    {campo.opcoes?.map((op) => (
                      <option key={op}>{op}</option>
                    ))}
                  </select>
                )}
                {campo.tipo === 'checkbox' && (
                  <div className="space-y-2">
                    {campo.opcoes?.map((op) => (
                      <label key={op} className="flex items-center gap-2">
                        <input type="checkbox" disabled className="w-4 h-4" />
                        <span className="text-sm">{op}</span>
                      </label>
                    ))}
                  </div>
                )}
                {campo.tipo === 'textarea' && (
                  <textarea
                    placeholder={campo.placeholder}
                    rows={campo.rows || 4}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                )}
                {campo.tipo === 'escala' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{campo.min || 1}</span>
                    <input
                      type="range"
                      min={campo.min || 1}
                      max={campo.max || 10}
                      disabled
                      className="flex-1"
                    />
                    <span className="text-sm">{campo.max || 10}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

