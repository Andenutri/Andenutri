'use client';

export default function Dashboard({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div className="ml-24">
          <h1 className="text-3xl font-bold text-amber-700">🥗 ANDENUTRI</h1>
          <p className="text-gray-600 mt-1">Coach de Bem-Estar</p>
        </div>
        <div className="bg-amber-50 px-6 py-3 rounded-lg">
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-700">12</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-600">Inativos</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-4">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="🔍 Buscar clientes..."
            className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-amber-700 mb-4">Bem-vindo ao ANDENUTRI! 🥗</h2>
          <p className="text-xl text-gray-600 mb-6">Sistema completo de gestão para Coach de Bem-Estar</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-amber-50 p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="font-bold text-amber-700">Clientes</h3>
              <p className="text-sm text-gray-600">Gestão completa</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-bold text-amber-700">Trello</h3>
              <p className="text-sm text-gray-600">Visualização</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-bold text-amber-700">Dashboard</h3>
              <p className="text-sm text-gray-600">Estatísticas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

