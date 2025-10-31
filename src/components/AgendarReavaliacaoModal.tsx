'use client';

import { useState } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import { saveEvento } from '@/data/agendaData';
import { useAuth } from '@/contexts/AuthContext';

interface AgendarReavaliacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteComFormulario | null;
}

export default function AgendarReavaliacaoModal({ isOpen, onClose, cliente }: AgendarReavaliacaoModalProps) {
  const { user } = useAuth();
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [copied, setCopied] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Gerar código de reavaliação
  const codigo = cliente?.codigo_reavaliacao || (cliente?.id ? cliente.id.substring(0, 8).toUpperCase() : '');
  const url = codigo 
    ? (typeof window !== 'undefined' 
        ? `${window.location.origin}/reavaliacao/${codigo}`
        : `https://andenutri.com/reavaliacao/${codigo}`)
    : '';

  const handleCopiarLink = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        alert(`⚠️ Erro ao copiar. Acesse o link manualmente:\n\n${url}`);
      });
    }
  };

  const handleSalvar = async () => {
    if (!cliente || !data) {
      alert('⚠️ Por favor, selecione uma data para agendar a reavaliação.');
      return;
    }

    setSalvando(true);

    try {
      // Combinar data e hora
      const dataHora = hora 
        ? new Date(`${data}T${hora}`)
        : new Date(`${data}T09:00`); // Default 9h se não especificar hora

      // Criar evento na agenda
      await saveEvento({
        titulo: `Reavaliação - ${cliente.nome}`,
        descricao: observacoes || `Reavaliação agendada para ${cliente.nome}`,
        data: dataHora,
        hora: hora || '09:00',
        cliente: cliente.nome,
        tipo: 'reavaliacao',
        cor: '#10b981', // Verde
        lembrete: '1dia', // Lembrete 1 dia antes
      }, cliente.id);

      alert(`✅ Reavaliação agendada com sucesso para ${data}${hora ? ` às ${hora}` : ''}!\n\n✅ Link copiado automaticamente.`);
      
      // Copiar link automaticamente após salvar
      if (url) {
        navigator.clipboard.writeText(url);
      }

      // Limpar formulário
      setData('');
      setHora('');
      setObservacoes('');
      
      onClose();
    } catch (error) {
      console.error('Erro ao agendar reavaliação:', error);
      alert('❌ Erro ao agendar reavaliação. Verifique o console.');
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-green-700">📅 Agendar Reavaliação</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cliente */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Cliente:</p>
            <p className="text-lg font-bold text-green-700">{cliente.nome}</p>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Data da Reavaliação <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🕐 Hora (opcional)
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Observações (opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Lembrar de perguntar sobre o sono, verificar se está tomando os suplementos..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Link de Reavaliação */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Link de Reavaliação
            </h3>
            
            {codigo ? (
              <>
                <div className="bg-white rounded-lg p-3 mb-3 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 text-sm text-gray-700 break-all font-mono">
                      {url}
                    </code>
                  </div>
                  <p className="text-xs text-gray-600">
                    Código: <span className="font-semibold">{codigo}</span>
                  </p>
                </div>
                
                <button
                  onClick={handleCopiarLink}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copied ? '✅ Link Copiado!' : '📋 Copiar Link'}
                </button>
                
                <p className="text-xs text-gray-600 mt-3">
                  💡 Envie este link para {cliente.nome} preencher antes da consulta.
                </p>
              </>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  ⚠️ Código de reavaliação não encontrado para este cliente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando || !data}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? '💾 Salvando...' : '✅ Agendar e Copiar Link'}
          </button>
        </div>
      </div>
    </div>
  );
}

