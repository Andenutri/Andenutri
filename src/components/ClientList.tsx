'use client';

import { useState } from 'react';
import { getAllClientes } from '@/data/mockClientes';
import AddClientModal from './AddClientModal';

export default function ClientList({ sidebarOpen }: { sidebarOpen: boolean }) {
  const clientes = getAllClientes();
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">👥 Clientes</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Gestão completa de clientes</p>
        </div>
        <button 
          onClick={() => setShowAddClientModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
        >
          ➕ Adicionar Cliente
        </button>
      </div>
      
      <div className="p-4 md:p-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {clientes.map((cliente) => (
            <a
              key={cliente.id}
              href={`/cliente/${cliente.id}`}
              className="block bg-white rounded-xl shadow-lg p-4 md:p-6 hover:scale-105 transition-transform cursor-pointer border-l-4 border-amber-500"
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{cliente.nome}</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-1">📧 {cliente.email}</p>
              <p className="text-xs md:text-sm text-gray-600 mb-1">📱 {cliente.whatsapp}</p>
              {cliente.formulario && (
                <p className="text-xs md:text-sm text-gray-600 mb-1">⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
              )}
              <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
                cliente.status_plano === 'ativo' ? 'bg-green-100 text-green-700' :
                cliente.status_plano === 'inativo' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {cliente.status_plano}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Modal Adicionar Cliente */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
      />
    </div>
  );
}

