'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ClientList from '@/components/ClientList';
import TrelloView from '@/components/TrelloView';
import AvaliacoesView from '@/components/AvaliacoesView';
import AgendaView from '@/components/AgendaView';

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-5 left-5 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-3 rounded-xl text-xl shadow-lg hover:scale-105 transition-all"
      >
        ☰
      </button>
      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setView={setView} />
      
      {view === 'dashboard' && <Dashboard sidebarOpen={sidebarOpen} setView={setView} />}
      {view === 'clientes' && <ClientList sidebarOpen={sidebarOpen} />}
      {view === 'trello' && <TrelloView sidebarOpen={sidebarOpen} />}
      {view === 'agenda' && <AgendaView sidebarOpen={sidebarOpen} />}
      {view === 'avaliacoes' && <AvaliacoesView sidebarOpen={sidebarOpen} />}
    </div>
  );
}

