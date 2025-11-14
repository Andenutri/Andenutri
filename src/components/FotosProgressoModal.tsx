'use client';

import { useState, useEffect } from 'react';
import { 
  FotoCliente, 
  TipoFoto, 
  PosicaoFoto,
  getFotosAgrupadas, 
  uploadFotoStorage, 
  saveFotoCliente, 
  deleteFotoCliente 
} from '@/data/fotosClientesData';

interface FotosProgressoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNome: string;
}

const POSICOES: { value: PosicaoFoto; label: string; icon: string }[] = [
  { value: 'frente', label: 'Frente', icon: '👤' },
  { value: 'lateral', label: 'Lateral', icon: '↔️' },
  { value: 'costa', label: 'Costa', icon: '🔙' },
  { value: 'outra', label: 'Outra', icon: '📸' },
];

export default function FotosProgressoModal({ isOpen, onClose, clienteId, clienteNome }: FotosProgressoModalProps) {
  const [fotosAgrupadas, setFotosAgrupadas] = useState<{
    antes: Record<PosicaoFoto, FotoCliente[]>;
    depois: Record<PosicaoFoto, FotoCliente[]>;
  }>({
    antes: { frente: [], lateral: [], costa: [], outra: [] },
    depois: { frente: [], lateral: [], costa: [], outra: [] },
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFoto, setEditingFoto] = useState<FotoCliente | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<TipoFoto>('antes');
  const [selectedPosicao, setSelectedPosicao] = useState<PosicaoFoto>('frente');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataFoto, setDataFoto] = useState(new Date().toISOString().split('T')[0]);
  const [anotacao, setAnotacao] = useState('');

  useEffect(() => {
    if (isOpen && clienteId) {
      loadFotos();
    }
  }, [isOpen, clienteId]);

  const loadFotos = async () => {
    setLoading(true);
    try {
      const agrupadas = await getFotosAgrupadas(clienteId);
      setFotosAgrupadas(agrupadas);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      alert('❌ Erro ao carregar fotos. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('❌ Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ A imagem deve ter no máximo 10MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile && !editingFoto) {
      alert('❌ Por favor, selecione uma foto.');
      return;
    }

    setUploading(true);
    try {
      let url = editingFoto?.url;

      // Se é uma nova foto, fazer upload
      if (selectedFile && !editingFoto) {
        url = await uploadFotoStorage(clienteId, selectedFile, selectedTipo, selectedPosicao);
        if (!url) {
          alert('❌ Erro ao fazer upload da foto.');
          return;
        }
      }

      if (!url) {
        alert('❌ URL da foto não encontrada.');
        return;
      }

      await saveFotoCliente({
        id: editingFoto?.id,
        cliente_id: clienteId,
        url,
        tipo: editingFoto?.tipo || selectedTipo,
        posicao: editingFoto?.posicao || selectedPosicao,
        data_foto: dataFoto,
        anotacao: anotacao || null,
        ordem: 0,
      });

      alert('✅ Foto salva com sucesso!');
      await loadFotos();
      handleCloseAddModal();
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      alert('❌ Erro ao salvar foto. Verifique o console.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fotoId: string) => {
    if (!confirm('⚠️ Tem certeza que deseja excluir esta foto?')) {
      return;
    }

    try {
      await deleteFotoCliente(fotoId);
      alert('✅ Foto excluída com sucesso!');
      await loadFotos();
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      alert('❌ Erro ao excluir foto. Verifique o console.');
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingFoto(null);
    setSelectedFile(null);
    setDataFoto(new Date().toISOString().split('T')[0]);
    setAnotacao('');
    setSelectedTipo('antes');
    setSelectedPosicao('frente');
  };

  const handleEdit = (foto: FotoCliente) => {
    setEditingFoto(foto);
    setSelectedTipo(foto.tipo);
    setSelectedPosicao(foto.posicao);
    setDataFoto(foto.data_foto);
    setAnotacao(foto.anotacao || '');
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const renderFotos = (tipo: TipoFoto, posicao: PosicaoFoto) => {
    const fotos = fotosAgrupadas[tipo][posicao];
    if (fotos.length === 0) return null;

    return (
      <div key={`${tipo}-${posicao}`} className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">
          {tipo === 'antes' ? '📸 Antes' : '✨ Depois'} - {POSICOES.find(p => p.value === posicao)?.label}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map(foto => (
            <div key={foto.id} className="bg-white rounded-lg p-3 shadow-md border-2 border-gray-200">
              <div className="relative mb-2">
                <img
                  src={foto.url}
                  alt={`${tipo} - ${posicao}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDelete(foto.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Excluir foto"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                📅 {new Date(foto.data_foto).toLocaleDateString('pt-BR')}
              </div>
              {foto.anotacao && (
                <div className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {foto.anotacao}
                </div>
              )}
              <button
                onClick={() => handleEdit(foto)}
                className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-md">
            <div>
              <h2 className="text-2xl font-bold text-amber-700">📸 Fotos de Progresso</h2>
              <p className="text-sm text-gray-600">{clienteNome}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setEditingFoto(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
              >
                ➕ Adicionar Foto
              </button>
              <button
                onClick={onClose}
                className="text-3xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando fotos...</p>
              </div>
            ) : (
              <div>
                {POSICOES.map(pos => (
                  <div key={pos.value} className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      {pos.icon} {pos.label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Antes */}
                      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                        <h4 className="font-semibold text-red-700 mb-3">📸 Antes</h4>
                        {fotosAgrupadas.antes[pos.value].length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">Nenhuma foto de antes</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {fotosAgrupadas.antes[pos.value].map(foto => (
                              <div key={foto.id} className="bg-white rounded-lg p-2 shadow-sm">
                                <img
                                  src={foto.url}
                                  alt="Antes"
                                  className="w-full h-24 object-cover rounded mb-1"
                                />
                                <div className="text-xs text-gray-600 mb-1">
                                  {new Date(foto.data_foto).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEdit(foto)}
                                    className="flex-1 text-xs bg-blue-500 text-white px-1 py-0.5 rounded"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(foto.id)}
                                    className="text-xs bg-red-500 text-white px-1 py-0.5 rounded"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Depois */}
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                        <h4 className="font-semibold text-green-700 mb-3">✨ Depois</h4>
                        {fotosAgrupadas.depois[pos.value].length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">Nenhuma foto de depois</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {fotosAgrupadas.depois[pos.value].map(foto => (
                              <div key={foto.id} className="bg-white rounded-lg p-2 shadow-sm">
                                <img
                                  src={foto.url}
                                  alt="Depois"
                                  className="w-full h-24 object-cover rounded mb-1"
                                />
                                <div className="text-xs text-gray-600 mb-1">
                                  {new Date(foto.data_foto).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEdit(foto)}
                                    className="flex-1 text-xs bg-blue-500 text-white px-1 py-0.5 rounded"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(foto.id)}
                                    className="text-xs bg-red-500 text-white px-1 py-0.5 rounded"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Adicionar/Editar Foto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-amber-700 mb-4">
              {editingFoto ? '✏️ Editar Foto' : '➕ Adicionar Foto'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={selectedTipo}
                  onChange={(e) => setSelectedTipo(e.target.value as TipoFoto)}
                  disabled={!!editingFoto}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="antes">📸 Antes</option>
                  <option value="depois">✨ Depois</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                <select
                  value={selectedPosicao}
                  onChange={(e) => setSelectedPosicao(e.target.value as PosicaoFoto)}
                  disabled={!!editingFoto}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {POSICOES.map(pos => (
                    <option key={pos.value} value={pos.value}>
                      {pos.icon} {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              {!editingFoto && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                  {selectedFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data da Foto</label>
                <input
                  type="date"
                  value={dataFoto}
                  onChange={(e) => setDataFoto(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anotação</label>
                <textarea
                  value={anotacao}
                  onChange={(e) => setAnotacao(e.target.value)}
                  placeholder="Adicione uma anotação sobre esta foto..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCloseAddModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={uploading || (!selectedFile && !editingFoto)}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

