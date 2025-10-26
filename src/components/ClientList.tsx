'use client';

export default function ClientList({ sidebarOpen }: { sidebarOpen: boolean }) {
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
        <p className="text-gray-600">Lista de clientes será exibida aqui...</p>
      </div>
    </div>
  );
}

