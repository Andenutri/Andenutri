'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ClientList from '@/components/ClientList';
import TrelloView from '@/components/TrelloView';
import AvaliacoesView from '@/components/AvaliacoesView';
import GerenciarLinksFormulario from '@/components/GerenciarLinksFormulario';
import MeuLinkFormulario from '@/components/MeuLinkFormulario';

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 relative">
      {/* Botão do Menu Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-lg md:text-xl shadow-lg hover:scale-105 transition-all"
      >
        ☰
      </button>
      
      {/* Botões de Acesso Rápido - Temporário */}
      <div className="fixed top-4 right-4 z-50 flex flex-col md:flex-row gap-2 md:gap-3">
        <a
          href="/saude-feminina"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>🌸</span>
          <span className="hidden md:inline">Saúde Feminina</span>
          <span className="md:hidden">Saúde</span>
        </a>
        <a
          href="/ferramentas"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>🔧</span>
          <span className="hidden md:inline">Ferramentas</span>
          <span className="md:hidden">Ferramentas</span>
        </a>
      </div>
      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setView={setView} />
      
      <div className="pt-16 md:pt-20">
        {view === 'dashboard' && <Dashboard sidebarOpen={sidebarOpen} setView={setView} />}
        {view === 'clientes' && <ClientList sidebarOpen={sidebarOpen} />}
        {view === 'trello' && <TrelloView sidebarOpen={sidebarOpen} />}
        {/* {view === 'agenda' && <AgendaView sidebarOpen={sidebarOpen} />} */}
        {view === 'avaliacoes' && <AvaliacoesView sidebarOpen={sidebarOpen} />}
        {view === 'links-formulario' && (
          <div className="p-4 md:p-6">
            <MeuLinkFormulario />
          </div>
        )}
      </div>
    </div>
  );
}

