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
              <div className="mb-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{cliente.nome}</h3>
                {/* Bolinhas de Status */}
                <div className="flex gap-3 items-center flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      cliente.status_plano === 'ativo' ? 'bg-green-500' :
                      cliente.status_plano === 'inativo' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs text-gray-600">Programa</span>
                  </div>
                  {(cliente as any).status_herbalife && (
                    <div className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        (cliente as any).status_herbalife === 'ativo' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-600">Herbalife</span>
                    </div>
                  )}
                  {(cliente as any).is_lead && (
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-gray-600">Lead</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">📧 {cliente.email}</p>
              <p className="text-xs md:text-sm text-gray-600 mb-1">📱 {cliente.whatsapp}</p>
              {cliente.formulario && (
                <p className="text-xs md:text-sm text-gray-600 mb-1">⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
              )}
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

