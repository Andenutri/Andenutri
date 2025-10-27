'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ClientList from '@/components/ClientList';
import TrelloView from '@/components/TrelloView';
import AvaliacoesView from '@/components/AvaliacoesView';

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 relative">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-lg md:text-xl shadow-lg hover:scale-105 transition-all"
      >
        ☰
      </button>
      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setView={setView} />
      
      <div className="pt-16 md:pt-20">
        {view === 'dashboard' && <Dashboard sidebarOpen={sidebarOpen} setView={setView} />}
        {view === 'clientes' && <ClientList sidebarOpen={sidebarOpen} />}
        {view === 'trello' && <TrelloView sidebarOpen={sidebarOpen} />}
        {/* {view === 'agenda' && <AgendaView sidebarOpen={sidebarOpen} />} */}
        {view === 'avaliacoes' && <AvaliacoesView sidebarOpen={sidebarOpen} />}
      </div>
    </div>
  );
}

