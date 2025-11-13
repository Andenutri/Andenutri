'use client';

import { useState, useEffect } from 'react';
import AvaliacaoEmocionalModal from './AvaliacaoEmocionalModal';
import AddClientModal from './AddClientModal';
import { ClienteComFormulario } from '@/data/mockClientes';
import { getAllClientes } from '@/data/clientesData';
import { getAllAvaliacoesEmocionais, deleteAvaliacaoEmocional, deleteAvaliacaoComportamental, getAvaliacoesComportamentaisCliente } from '@/data/avaliacoesEmocionaisData';
import type { AvaliacaoEmocional } from '@/data/avaliacoesEmocionaisData';

interface Avaliacao {
  id: string;
  cliente_id: string;
  cliente_nome: string;
  data_avaliacao: string;
  data_criacao?: string;
  historia_pessoa?: string;
  bloco_emocional?: any;
  bloco_comportamental?: any;
}

export default function AvaliacoesView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [showModalEmocional, setShowModalEmocional] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteComFormulario | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [clientes, setClientes] = useState<ClienteComFormulario[]>([]);
  const [clientesParaAvaliar, setClientesParaAvaliar] = useState<ClienteComFormulario[]>([]);
  const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState<AvaliacaoEmocional | null>(null);
  const [clienteParaEditar, setClienteParaEditar] = useState<ClienteComFormulario | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  
  const carregarAvaliacoes = async () => {
    try {
      const avaliacoesDoSupabase = await getAllAvaliacoesEmocionais();
      const avaliacoesFormatadas: Avaliacao[] = avaliacoesDoSupabase.map(av => ({
        id: av.id || '',
        cliente_id: av.cliente_id,
        cliente_nome: av.cliente_nome || 'Cliente não encontrado',
        data_avaliacao: av.data_criacao || new Date().toISOString(),
        data_criacao: av.data_criacao,
        historia_pessoa: av.historia_pessoa || undefined,
      }));
      setAvaliacoes(avaliacoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  useEffect(() => {
    carregarAvaliacoes();
  }, [showModalEmocional]); // Recarregar quando o modal de avaliação fechar
  
  useEffect(() => {
    // Carregar clientes inicialmente e quando modal de adicionar cliente fechar
    const loadClientes = async () => {
      console.log('🔄 Carregando clientes para avaliação...');
      const todosClientes = await getAllClientes();
      console.log(`📊 Total de clientes carregados: ${todosClientes.length}`);
      
      // Filtrar LEADS que precisam de avaliação (têm formulário preenchido mas não têm avaliação)
      // Apenas leads (is_lead = true), não clientes
      const paraAvaliar = todosClientes.filter(cliente => {
        const isLead = (cliente as any).is_lead === true;
        const temFormulario = cliente.formulario_preenchido;
        const temAvaliacao = cliente.avaliacao_feita;
        const precisaAvaliar = isLead && temFormulario && !temAvaliacao;
        
        if (precisaAvaliar) {
          console.log(`⏰ Lead aguardando avaliação: ${cliente.nome} (ID: ${cliente.id})`);
        }
        
        return precisaAvaliar;
      });
      
      console.log(`✅ Clientes aguardando avaliação: ${paraAvaliar.length}`);
      if (paraAvaliar.length > 0) {
        console.log('📝 Nomes:', paraAvaliar.map(c => c.nome));
      }
      
      setClientes(todosClientes);
      setClientesParaAvaliar(paraAvaliar);
    };
    
    loadClientes();
    
    // Recarregar a cada 10 segundos para pegar novos formulários
    const interval = setInterval(loadClientes, 10000);
    
    // Recarregar quando a janela ganha foco (usuário volta para a aba)
    const handleFocus = () => {
      console.log('👁️ Janela ganhou foco, recarregando clientes...');
      loadClientes();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [showAddClientModal]); // Recarregar quando o modal de adicionar cliente fechar
  
  const abrirAvaliacaoEmocional = (cliente: ClienteComFormulario) => {
    setClienteSelecionado(cliente);
    setAvaliacaoParaEditar(null);
    setShowModalEmocional(true);
  };

  const editarAvaliacao = async (avaliacao: Avaliacao) => {
    // Buscar cliente
    const cliente = clientes.find(c => c.id === avaliacao.cliente_id);
    if (!cliente) {
      alert('❌ Cliente não encontrado');
      return;
    }

    // Buscar avaliação completa do Supabase
    const { getAvaliacoesEmocionaisCliente } = await import('@/data/avaliacoesEmocionaisData');
    const avaliacoesEmocionais = await getAvaliacoesEmocionaisCliente(avaliacao.cliente_id);
    const avaliacaoCompleta = avaliacoesEmocionais.find(av => av.id === avaliacao.id);
    
    if (!avaliacaoCompleta) {
      alert('❌ Avaliação não encontrada');
      return;
    }

    setAvaliacaoParaEditar(avaliacaoCompleta);
    setClienteParaEditar(cliente);
    setShowModalEmocional(true);
  };

  const excluirAvaliacao = async (avaliacao: Avaliacao) => {
    if (!confirm(`Tem certeza que deseja excluir a avaliação de ${avaliacao.cliente_nome}?`)) {
      return;
    }

    setExcluindo(avaliacao.id);
    try {
      // Deletar avaliação emocional
      const resultadoEmocional = await deleteAvaliacaoEmocional(avaliacao.id);
      
      if (!resultadoEmocional.success) {
        alert(`❌ Erro ao excluir avaliação emocional: ${resultadoEmocional.error}`);
        return;
      }

      // Buscar e deletar avaliação comportamental associada (se existir)
      const { getAvaliacoesComportamentaisCliente } = await import('@/data/avaliacoesEmocionaisData');
      const avaliacoesComportamentais = await getAvaliacoesComportamentaisCliente(avaliacao.cliente_id);
      const avaliacaoComportamental = avaliacoesComportamentais.find(av => av.cliente_id === avaliacao.cliente_id);
      
      if (avaliacaoComportamental?.id) {
        await deleteAvaliacaoComportamental(avaliacaoComportamental.id);
      }

      alert('✅ Avaliação excluída com sucesso!');
      await carregarAvaliacoes();
      
      // Recarregar clientes para atualizar status de avaliação
      const todosClientes = await getAllClientes();
      const paraAvaliar = todosClientes.filter(cliente => {
        const isLead = (cliente as any).is_lead === true;
        return isLead && cliente.formulario_preenchido && !cliente.avaliacao_feita;
      });
      setClientes(todosClientes);
      setClientesParaAvaliar(paraAvaliar);
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      alert('❌ Erro ao excluir avaliação. Verifique o console.');
    } finally {
      setExcluindo(null);
    }
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div className="ml-24">
          <h1 className="text-3xl font-bold text-amber-700">📏 Avaliações de Bem-Estar</h1>
          <p className="text-gray-600 mt-1">Sistema completo de avaliação física e acompanhamento</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Clientes Aguardando Avaliação */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-2">⏰ Leads Aguardando Avaliação</h2>
                <p className="text-gray-600">
                  {clientesParaAvaliar.length} {clientesParaAvaliar.length === 1 ? 'lead preencheu' : 'leads preencheram'} o formulário de pré-consulta e {clientesParaAvaliar.length === 1 ? 'aguarda' : 'aguardam'} avaliação emocional
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    console.log('🔄 Atualização manual solicitada...');
                    const todosClientes = await getAllClientes();
                    const paraAvaliar = todosClientes.filter(cliente => {
                      const isLead = (cliente as any).is_lead === true;
                      return isLead && cliente.formulario_preenchido && !cliente.avaliacao_feita;
                    });
                    setClientes(todosClientes);
                    setClientesParaAvaliar(paraAvaliar);
                    console.log(`✅ Atualizado: ${paraAvaliar.length} leads aguardando avaliação`);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-base flex items-center gap-2"
                  title="Atualizar lista de clientes"
                >
                  🔄 Atualizar
                </button>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold text-base flex items-center gap-2"
                >
                  ➕ Adicionar Cliente
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientesParaAvaliar.map((cliente) => (
                <div key={cliente.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-bold text-gray-800 text-lg">{cliente.nome}</div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Aguardando
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📧 {cliente.email}</p>
                    <p>📱 {cliente.whatsapp}</p>
                    {cliente.formulario && (
                      <>
                        <p>⚖️ {cliente.formulario.peso_atual}kg → {cliente.formulario.peso_desejado}kg</p>
                        <p>📍 {cliente.formulario.idade} anos, {cliente.formulario.altura}cm</p>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => abrirAvaliacaoEmocional(cliente)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg font-semibold"
                  >
                    💚 Iniciar Avaliação Emocional
                  </button>
                </div>
              ))}
              
              {clientesParaAvaliar.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-lg">Todos os leads foram avaliados!</p>
                </div>
              )}
            </div>
          </div>

          {/* Histórico de Avaliações */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">📊 Histórico de Avaliações</h2>
            
            {avaliacoes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p>Nenhuma avaliação registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao, index) => {
                  const dataFormatada = new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR');
                  const estaExcluindo = excluindo === avaliacao.id;
                  return (
                    <div key={avaliacao.id || index} className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💚</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-lg">{avaliacao.cliente_nome}</span>
                            <p className="text-sm text-gray-600">{dataFormatada}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                            ✅ Concluída
                          </span>
                          <button
                            onClick={() => editarAvaliacao(avaliacao)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center gap-1"
                            title="Editar avaliação"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => excluirAvaliacao(avaliacao)}
                            disabled={estaExcluindo}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold flex items-center gap-1 disabled:opacity-50"
                            title="Excluir avaliação"
                          >
                            {estaExcluindo ? '⏳' : '🗑️'} {estaExcluindo ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </div>
                      </div>
                      
                      {avaliacao.historia_pessoa && (
                        <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">📖 História</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{avaliacao.historia_pessoa}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Avaliação Emocional */}
      {showModalEmocional && (
        <AvaliacaoEmocionalModal
          isOpen={showModalEmocional}
          onClose={async () => {
            setShowModalEmocional(false);
            setClienteSelecionado(null);
            setAvaliacaoParaEditar(null);
            setClienteParaEditar(null);
            // Recarregar leads após fechar o modal de avaliação
            const todosClientes = await getAllClientes();
            const paraAvaliar = todosClientes.filter(cliente => {
              const isLead = (cliente as any).is_lead === true;
              return isLead && cliente.formulario_preenchido && !cliente.avaliacao_feita;
            });
            setClientes(todosClientes);
            setClientesParaAvaliar(paraAvaliar);
            await carregarAvaliacoes();
          }}
          cliente={clienteParaEditar || clienteSelecionado}
          avaliacaoExistente={avaliacaoParaEditar}
        />
      )}

      {/* Modal de Adicionar Cliente */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={async (_data) => {
          setShowAddClientModal(false);
          // Recarregar leads após adicionar lead
          const todosClientes = await getAllClientes();
          const paraAvaliar = todosClientes.filter(cliente => {
            const isLead = (cliente as any).is_lead === true;
            return isLead && cliente.formulario_preenchido && !cliente.avaliacao_feita;
          });
          setClientes(todosClientes);
          setClientesParaAvaliar(paraAvaliar);
        }}
      />
    </div>
  );
}

