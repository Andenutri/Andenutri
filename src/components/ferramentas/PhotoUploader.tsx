'use client';

import { useState, useRef } from 'react';
import { uploadPhoto, PhotoType } from '@/data/photosData';

interface PhotoUploaderProps {
  clienteId: string;
  avaliacaoId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export default function PhotoUploader({ clienteId, avaliacaoId, onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<{ file: File; tipo: PhotoType; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Criar previews
    const newPreviews = files.map((file) => {
      const tipo = 'frente' as PhotoType; // Default, pode ser mudado pelo usuário
      return {
        file,
        tipo,
        preview: URL.createObjectURL(file),
      };
    });

    setPreviews([...previews, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const updatePhotoType = (index: number, tipo: PhotoType) => {
    const newPreviews = [...previews];
    newPreviews[index].tipo = tipo;
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < previews.length; i++) {
        const { file, tipo } = previews[i];
        setProgress(((i + 1) / previews.length) * 100);

        const url = await uploadPhoto(clienteId, avaliacaoId || null, file, tipo);

        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }

      // Limpar previews
      previews.forEach((p) => URL.revokeObjectURL(p.preview));
      setPreviews([]);
      
      alert(`✅ ${uploadedUrls.length} foto(s) enviada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('❌ Erro ao fazer upload das fotos');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botão de Seleção */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-4xl mb-2">📸</div>
        <p className="text-gray-600 font-semibold">Clique para selecionar fotos</p>
        <p className="text-sm text-gray-500 mt-1">Ou arraste as fotos aqui</p>
      </div>

      {/* Previews das Fotos */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Fotos selecionadas ({previews.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-3">
                <div className="relative mb-2">
                  <img
                    src={preview.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => removePreview(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                <select
                  value={preview.tipo}
                  onChange={(e) => updatePhotoType(index, e.target.value as PhotoType)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="frente">Frente</option>
                  <option value="lateral">Lateral</option>
                  <option value="costa">Costa</option>
                  <option value="outra">Outra</option>
                </select>
              </div>
            ))}
          </div>

          {/* Barra de Progresso */}
          {uploading && (
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300 text-white text-xs flex items-center justify-center"
                style={{ width: `${progress}%` }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          )}

          {/* Botão de Upload */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Enviar {previews.length} foto(s)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

