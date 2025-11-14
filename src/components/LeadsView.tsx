'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/mockClientes';
import { getAllClientes, saveCliente } from '@/data/clientesData';
import { supabase } from '@/lib/supabase';
import ClientDetailsModal from './ClientDetailsModal';

export default function LeadsView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [leads, setLeads] = useState<ClienteComFormulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClienteComFormulario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLeads();
    
    // Recarregar a cada 10 segundos
    const interval = setInterval(loadLeads, 10000);
    
    // Recarregar quando a janela ganha foco
    const handleFocus = () => loadLeads();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const todosClientes = await getAllClientes();
      // Filtrar apenas leads (is_lead = true)
      const leadsFiltrados = todosClientes.filter(cliente => 
        (cliente as any).is_lead === true
      );
      setLeads(leadsFiltrados);
      console.log(`📋 Leads carregados: ${leadsFiltrados.length}`);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const converterLeadEmCliente = async (lead: ClienteComFormulario) => {
    if (!confirm(`Deseja converter ${lead.nome} de Lead para Cliente?\n\nIsso significa que ele(a) comprou o programa de 90 dias.`)) {
      return;
    }

    try {
      // Atualizar no Supabase: is_lead = false e data_compra_programa = agora
      const { error } = await supabase
        .from('clientes')
        .update({
          is_lead: false,
          data_compra_programa: new Date().toISOString(),
        })
        .eq('id', lead.id);

      if (error) {
        console.error('Erro ao converter lead:', error);
        alert('Erro ao converter lead. Tente novamente.');
        return;
      }

      console.log(`✅ Lead ${lead.nome} convertido para Cliente`);
      alert(`✅ ${lead.nome} foi convertido(a) para Cliente com sucesso!`);
      
      // Recarregar leads
      await loadLeads();
    } catch (error) {
      console.error('Erro ao converter lead:', error);
      alert('Erro ao converter lead. Tente novamente.');
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.nome.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.whatsapp?.toLowerCase().includes(query) ||
      (lead as any).instagram?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando leads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div className="ml-24">
          <h1 className="text-3xl font-bold text-purple-700">📋 Leads e Prospectos</h1>
          <p className="text-gray-600 mt-1">Pessoas que preencheram formulário/avaliação mas ainda não compraram o programa</p>
        </div>
        <button
          onClick={loadLeads}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Atualizar</span>
        </button>
      </div>

      <div className="p-6">
        {/* Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{leads.length}</div>
            <div className="text-sm text-gray-600">Total de Leads</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {leads.filter(l => l.formulario_preenchido).length}
            </div>
            <div className="text-sm text-gray-600">Com Formulário</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {leads.filter(l => l.avaliacao_feita).length}
            </div>
            <div className="text-sm text-gray-600">Com Avaliação</div>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-lg">
                {searchQuery ? 'Nenhum lead encontrado com essa busca' : 'Nenhum lead cadastrado ainda'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer"
                  onClick={() => setSelectedClient(lead)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-bold text-gray-800 text-lg">{lead.nome}</div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                      LEAD
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {lead.email && <p>📧 {lead.email}</p>}
                    {lead.whatsapp && <p>📱 {lead.whatsapp}</p>}
                    {lead.formulario && (
                      <>
                        <p>⚖️ {lead.formulario.peso_atual}kg → {lead.formulario.peso_desejado}kg</p>
                        {lead.formulario.idade && (
                          <p>📍 {lead.formulario.idade} anos, {lead.formulario.altura}cm</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 mb-3">
                    {lead.formulario_preenchido && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        ✅ Formulário
                      </span>
                    )}
                    {lead.avaliacao_feita && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        ✅ Avaliação
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      converterLeadEmCliente(lead);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-sm"
                  >
                    💰 Converter em Cliente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedClient && (
        <ClientDetailsModal
          isOpen={!!selectedClient}
          onClose={async () => {
            // Recarregar leads antes de fechar para garantir dados atualizados
            await loadLeads();
            setSelectedClient(null);
          }}
          cliente={selectedClient}
        />
      )}
    </div>
  );
}

