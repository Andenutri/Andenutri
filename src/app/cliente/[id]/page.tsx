'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClienteById, ClienteComFormulario } from '@/data/clientesData';
import ClientDetailsModal from '@/components/ClientDetailsModal';

export default function ClientePage({ params }: { params: { id: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(true); // Abrir modal automaticamente
  const [cliente, setCliente] = useState<ClienteComFormulario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCliente() {
      setLoading(true);
      const clienteData = await getClienteById(params.id);
      setCliente(clienteData || null);
      setLoading(false);
      // Se encontrar o cliente, o modal já está configurado para abrir automaticamente
    }
    loadCliente();
  }, [params.id]);

  // Se ainda está carregando ou não encontrou cliente, mostrar tela de loading/erro
  if (loading || !cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mb-4"></div>
              <p className="text-gray-600">Carregando cliente...</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Cliente não encontrado</h1>
              <p className="text-gray-600">O cliente que você está procurando não existe ou não pertence à sua conta.</p>
              <Link href="/" className="inline-block mt-4 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                Voltar ao Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // Quando encontrar o cliente, mostrar apenas o modal (sem tela intermediária)
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
      {/* Modal completo de dados - abre automaticamente */}
      {isModalOpen && cliente && (
        <ClientDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Redirecionar para dashboard quando fechar
            window.location.href = '/';
          }}
          cliente={cliente}
        />
      )}
    </div>
  );
}
