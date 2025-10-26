'use client';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setView: (view: string) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, setView }: SidebarProps) {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', view: 'dashboard' },
    { icon: '👥', label: 'Clientes', view: 'clientes' },
    { icon: '📋', label: 'Trello/Kanban', view: 'trello' },
    { icon: '📅', label: 'Agenda', view: 'agenda' },
    { icon: '📏', label: 'Avaliações', view: 'avaliacoes' },
    { icon: '🥗', label: 'Cardápios', view: 'cardapios' },
    { icon: '⚙️', label: 'Configurações', view: 'configuracoes' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed left-0 top-0 w-80 h-screen bg-white shadow-xl transition-transform duration-300 z-40 overflow-y-auto pt-20 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-1 p-4">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setView(item.view);
                setSidebarOpen(false);
              }}
              className="px-6 py-5 cursor-pointer border-b border-gray-100 transition-colors flex items-center gap-3 hover:bg-amber-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

