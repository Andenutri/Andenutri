'use client';

export default function Dashboard({ sidebarOpen, setView }: { sidebarOpen: boolean; setView: (view: string) => void }) {
  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">🥗 ANDENUTRI</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Coach de Bem-Estar</p>
        </div>
        <div className="bg-amber-50 px-4 py-2 md:px-6 md:py-3 rounded-lg">
          <div className="flex gap-4 md:gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700">12</div>
              <div className="text-xs md:text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">8</div>
              <div className="text-xs md:text-sm text-gray-600">Ativos</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-red-600">4</div>
              <div className="text-xs md:text-sm text-gray-600">Inativos</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-8 md:py-4">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="🔍 Buscar clientes..."
            className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-sm md:text-base"
          />
        </div>
      </div>
      
      <div className="p-4 md:p-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-amber-700 mb-3 md:mb-4">Bem-vindo ao ANDENUTRI! 🥗</h2>
          <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6">Sistema completo de gestão para Coach de Bem-Estar</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            <div 
              onClick={() => setView('clientes')}
              className="bg-amber-50 p-4 md:p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">👥</div>
              <h3 className="font-bold text-amber-700">Clientes</h3>
              <p className="text-xs md:text-sm text-gray-600">Gestão completa</p>
            </div>
            <div 
              onClick={() => setView('trello')}
              className="bg-amber-50 p-4 md:p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">📋</div>
              <h3 className="font-bold text-amber-700">Trello</h3>
              <p className="text-xs md:text-sm text-gray-600">Visualização</p>
            </div>
            <div 
              onClick={() => setView('dashboard')}
              className="bg-amber-50 p-4 md:p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">📊</div>
              <h3 className="font-bold text-amber-700">Dashboard</h3>
              <p className="text-xs md:text-sm text-gray-600">Estatísticas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

