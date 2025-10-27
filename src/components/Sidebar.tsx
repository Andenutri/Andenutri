'use client';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setView: (view: string) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, setView }: SidebarProps) {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', view: 'dashboard', link: '/' },
    { icon: '👥', label: 'Clientes', view: 'clientes', link: '/' },
    { icon: '📋', label: 'Trello/Kanban', view: 'trello', link: '/' },
    { icon: '📅', label: 'Agenda', view: 'agenda', link: '/agenda' },
    { icon: '📏', label: 'Avaliações', view: 'avaliacoes', link: '/' },
    { icon: '🥗', label: 'Cardápios', view: 'cardapios', link: '/' },
    { icon: '⚙️', label: 'Configurações', view: 'configuracoes', link: '/' },
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
            <a
              key={idx}
              href={item.link || '#'}
              onClick={() => {
                if (item.link && item.link !== '/') {
                  setSidebarOpen(false);
                } else {
                  setView(item.view);
                  setSidebarOpen(false);
                }
              }}
              className="block px-6 py-5 cursor-pointer border-b border-gray-100 transition-colors flex items-center gap-3 hover:bg-amber-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

