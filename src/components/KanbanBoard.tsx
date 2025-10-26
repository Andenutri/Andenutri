'use client';

export default function KanbanBoard({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">📋 Trello/Kanban</h1>
          <p className="text-gray-600 mt-1">Organize seus clientes</p>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600">Kanban board será implementado aqui...</p>
      </div>
    </div>
  );
}

