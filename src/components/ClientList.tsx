'use client';

import { getAllClientes } from '@/data/mockClientes';

export default function ClientList({ sidebarOpen }: { sidebarOpen: boolean }) {
  const clientes = getAllClientes();

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">👥 Clientes</h1>
          <p className="text-gray-600 mt-1">Gestão completa de clientes</p>
        </div>
        <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg">
          ➕ Adicionar Cliente
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border-l-4 border-amber-500">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{cliente.nome}</h3>
              <p className="text-sm text-gray-600 mb-1">📧 {cliente.email}</p>
              <p className="text-sm text-gray-600 mb-1">📱 {cliente.whatsapp}</p>
              {cliente.formulario && (
                <p className="text-sm text-gray-600 mb-1">⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
              )}
              <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
                cliente.status_plano === 'ativo' ? 'bg-green-100 text-green-700' :
                cliente.status_plano === 'inativo' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {cliente.status_plano}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

