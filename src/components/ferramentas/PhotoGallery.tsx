'use client';

import { useState, useEffect } from 'react';
import { getPhotosByCliente, PhotoInfo, PhotoType } from '@/data/photosData';

interface PhotoGalleryProps {
  clienteId: string;
}

export default function PhotoGallery({ clienteId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'compare'>('gallery');
  const [comparePhotos, setComparePhotos] = useState<[PhotoInfo | null, PhotoInfo | null]>([null, null]);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      const photosData = await getPhotosByCliente(clienteId);
      setPhotos(photosData);
      setLoading(false);
    }

    if (clienteId) {
      loadPhotos();
    }
  }, [clienteId]);

  const getPhotoTypeLabel = (tipo: PhotoType) => {
    const labels = {
      frente: 'Frente',
      lateral: 'Lateral',
      costa: 'Costa',
      outra: 'Outra',
    };
    return labels[tipo];
  };

  const groupPhotosByType = () => {
    const grouped: Record<PhotoType, PhotoInfo[]> = {
      frente: [],
      lateral: [],
      costa: [],
      outra: [],
    };

    photos.forEach((photo) => {
      grouped[photo.tipo].push(photo);
    });

    return grouped;
  };

  const selectForCompare = (photo: PhotoInfo, position: 0 | 1) => {
    const newCompare = [...comparePhotos];
    newCompare[position] = photo;
    setComparePhotos(newCompare as [PhotoInfo | null, PhotoInfo | null]);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando fotos...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-bold mb-2">Nenhuma foto encontrada</h3>
        <p className="text-gray-600">Este cliente ainda não possui fotos de progresso.</p>
      </div>
    );
  }

  const groupedPhotos = groupPhotosByType();

  return (
    <div className="space-y-6">
      {/* Toggle de Visualização */}
      <div className="flex gap-2 bg-white p-2 rounded-lg border-2 border-pink-200">
        <button
          onClick={() => setViewMode('gallery')}
          className={`flex-1 px-4 py-2 rounded transition-colors ${
            viewMode === 'gallery'
              ? 'bg-pink-500 text-white font-semibold'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📷 Galeria
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`flex-1 px-4 py-2 rounded transition-colors ${
            viewMode === 'compare'
              ? 'bg-pink-500 text-white font-semibold'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⚖️ Comparar
        </button>
      </div>

      {viewMode === 'gallery' ? (
        /* Modo Galeria */
        <div className="space-y-6">
          {Object.entries(groupedPhotos).map(([tipo, tipoPhotos]) => {
            if (tipoPhotos.length === 0) return null;

            return (
              <div key={tipo} className="bg-white rounded-lg border-2 border-pink-200 p-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  {getPhotoTypeLabel(tipo as PhotoType)} ({tipoPhotos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tipoPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedPhoto(photo.url)}
                    >
                      <img
                        src={photo.url}
                        alt={`Foto ${getPhotoTypeLabel(photo.tipo)}`}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 hover:border-pink-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-opacity flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-2xl">
                          👁️
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-b-lg">
                        {new Date(photo.data_upload).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Modo Comparar */
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-pink-200 p-4">
            <h3 className="text-lg font-bold mb-4">Selecione fotos para comparar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Antes */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
                <h4 className="font-semibold mb-3 text-gray-700">📷 Antes</h4>
                {comparePhotos[0] ? (
                  <div className="relative">
                    <img
                      src={comparePhotos[0].url}
                      alt="Antes"
                      className="w-full rounded-lg border-2 border-blue-200"
                    />
                    <button
                      onClick={() => selectForCompare(comparePhotos[0]!, 0)}
                      className="mt-2 w-full px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      Trocar foto
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm">Selecione uma foto</p>
                  </div>
                )}
              </div>

              {/* Depois */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
                <h4 className="font-semibold mb-3 text-gray-700">📸 Depois</h4>
                {comparePhotos[1] ? (
                  <div className="relative">
                    <img
                      src={comparePhotos[1].url}
                      alt="Depois"
                      className="w-full rounded-lg border-2 border-green-200"
                    />
                    <button
                      onClick={() => selectForCompare(comparePhotos[1]!, 1)}
                      className="mt-2 w-full px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      Trocar foto
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-sm">Selecione uma foto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Fotos para Seleção */}
            {!(comparePhotos[0] && comparePhotos[1]) && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-700">Selecione da galeria:</h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        if (!comparePhotos[0]) {
                          selectForCompare(photo, 0);
                        } else if (!comparePhotos[1]) {
                          selectForCompare(photo, 1);
                        }
                      }}
                      className="relative aspect-square overflow-hidden rounded border-2 border-gray-200 hover:border-pink-500 transition-colors"
                    >
                      <img
                        src={photo.url}
                        alt={getPhotoTypeLabel(photo.tipo)}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

