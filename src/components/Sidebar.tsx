'use client';

import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setView: (view: string) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, setView }: SidebarProps) {
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { icon: '📊', label: 'Dashboard', view: 'dashboard', link: '/' },
    { icon: '👥', label: 'Clientes', view: 'clientes', link: '/' },
    { icon: '📋', label: 'Trello/Kanban', view: 'trello', link: '/' },
    { icon: '📅', label: 'Agenda', view: 'agenda', link: '/agenda' },
    { icon: '📏', label: 'Avaliações', view: 'avaliacoes', link: '/' },
    { icon: '🔧', label: 'Ferramentas', view: 'ferramentas', link: '/ferramentas' },
    { icon: '🌸', label: 'Saúde Feminina', view: 'saude-feminina', link: '/saude-feminina' },
    { icon: '🥗', label: 'Cardápios', view: 'cardapios', link: '/' },
    { icon: '⚙️', label: 'Configurações', view: 'configuracoes', link: '/' },
  ];

  const handleLogout = async () => {
    await signOut();
    setSidebarOpen(false);
  };

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
        {/* Informações do usuário */}
        {user && (
          <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
            <p className="text-sm text-gray-600">Logado como:</p>
            <p className="font-semibold text-gray-800 truncate">{user.email}</p>
          </div>
        )}
        
        <div className="space-y-1 p-4">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (item.link && item.link !== '/') {
                  window.location.href = item.link;
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
          
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-6 py-5 cursor-pointer border-2 border-red-200 bg-red-50 text-red-700 rounded-lg transition-colors flex items-center gap-3 hover:bg-red-100 font-semibold"
          >
            <span className="text-2xl">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}

