'use client';

import { useState, useEffect } from 'react';
import { getAllClientes } from '@/data/mockClientes';

interface Evento {
  id: string;
  titulo: string;
  data: string; // ISO string
  hora?: string;
  tipo: 'aniversario' | 'vencimento' | 'consulta' | 'compromisso';
  cliente_id?: string;
  cliente_nome?: string;
  descricao?: string;
}

export default function AgendaView({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [visualizacao, setVisualizacao] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [dataAtual, setDataAtual] = useState(new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesVisualizacao, setMesVisualizacao] = useState(new Date().getMonth());
  const [anoVisualizacao, setAnoVisualizacao] = useState(new Date().getFullYear());
  const [showAddEventoModal, setShowAddEventoModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [novoEvento, setNovoEvento] = useState({
    titulo: '',
    data: '',
    hora: '',
    tipo: 'compromisso' as const,
    cliente_id: '',
    descricao: '',
  });

  const clientes = getAllClientes();

  useEffect(() => {
    // Buscar eventos do localStorage
    if (typeof window !== 'undefined') {
      const eventosSalvos = JSON.parse(localStorage.getItem('eventos_agenda') || '[]');
      setEventos(eventosSalvos);

      // Adicionar aniversários dos clientes
      const aniversarios = clientes.map(cliente => {
        // Simular data de nascimento (em produção viria do banco)
        const dataNascimento = new Date(1990, 0, 1); // exemplo
        return {
          id: `aniversario-${cliente.id}`,
          titulo: `🎂 Aniversário de ${cliente.nome}`,
          data: `${anoVisualizacao}-${String(mesVisualizacao + 1).padStart(2, '0')}-${String(dataNascimento.getDate()).padStart(2, '0')}`,
          tipo: 'aniversario' as const,
          cliente_id: cliente.id,
          cliente_nome: cliente.nome,
        };
      });

      setEventos([...aniversarios, ...eventosSalvos]);
    }
  }, [mesVisualizacao, anoVisualizacao]);

  const proximoMes = () => {
    if (mesVisualizacao === 11) {
      setMesVisualizacao(0);
      setAnoVisualizacao(anoVisualizacao + 1);
    } else {
      setMesVisualizacao(mesVisualizacao + 1);
    }
  };

  const mesAnterior = () => {
    if (mesVisualizacao === 0) {
      setMesVisualizacao(11);
      setAnoVisualizacao(anoVisualizacao - 1);
    } else {
      setMesVisualizacao(mesVisualizacao - 1);
    }
  };

  const hoje = () => {
    setMesVisualizacao(new Date().getMonth());
    setAnoVisualizacao(new Date().getFullYear());
  };

  const adicionarEvento = () => {
    if (!novoEvento.titulo || !novoEvento.data) {
      alert('Por favor, preencha título e data');
      return;
    }

    const evento: Evento = {
      id: Date.now().toString(),
      titulo: novoEvento.titulo,
      data: novoEvento.data,
      hora: novoEvento.hora || undefined,
      tipo: novoEvento.tipo,
      descricao: novoEvento.descricao,
    };

    // Salvar no localStorage
    const eventosAtuais = JSON.parse(localStorage.getItem('eventos_agenda') || '[]');
    eventosAtuais.push(evento);
    localStorage.setItem('eventos_agenda', JSON.stringify(eventosAtuais));

    // Atualizar lista
    setEventos([...eventos, evento]);
    
    // Limpar formulário
    setNovoEvento({
      titulo: '',
      data: '',
      hora: '',
      tipo: 'compromisso',
      cliente_id: '',
      descricao: '',
    });

    setShowAddEventoModal(false);
    alert('✅ Evento salvo com sucesso!');
  };

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const primeiroDiaDoMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
  const ultimoDiaDoMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();
  const diasDoMes = Array.from({ length: ultimoDiaDoMes }, (_, i) => i + 1);

  // Adicionar espaços vazios para começar na semana correta
  const diasComEspacos = [
    ...Array(primeiroDiaDoMes).fill(null),
    ...diasDoMes
  ];

  const obterEventosDoDia = (dia: number) => {
    const dataStr = `${anoVisualizacao}-${String(mesVisualizacao + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(e => e.data.startsWith(dataStr));
  };

  const getCorEvento = (tipo: string) => {
    const cores = {
      'aniversario': 'bg-pink-100 border-pink-300 text-pink-800',
      'vencimento': 'bg-red-100 border-red-300 text-red-800',
      'consulta': 'bg-blue-100 border-blue-300 text-blue-800',
      'compromisso': 'bg-purple-100 border-purple-300 text-purple-800',
    };
    return cores[tipo as keyof typeof cores] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const isHoje = (dia: number) => {
    const hoje = new Date();
    return (
      dia === hoje.getDate() &&
      mesVisualizacao === hoje.getMonth() &&
      anoVisualizacao === hoje.getFullYear()
    );
  };


  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
      <div className="bg-white shadow-md px-8 py-6 flex items-center justify-between">
        <div className="ml-24">
          <h1 className="text-3xl font-bold text-amber-700">📅 Agenda</h1>
          <p className="text-gray-600 mt-1">Calendário completo de eventos e compromissos</p>
        </div>
        <button
          onClick={() => setShowAddEventoModal(true)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all shadow-lg"
        >
          ➕ Novo Evento
        </button>
      </div>

      <div className="p-6">
        {/* Botões de Visualização */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setVisualizacao('hoje')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                visualizacao === 'hoje'
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Hoje
            </button>
            <button
              onClick={() => setVisualizacao('semana')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                visualizacao === 'semana'
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📆 Semana
            </button>
            <button
              onClick={() => setVisualizacao('mes')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                visualizacao === 'mes'
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Mês
            </button>
            <button
              onClick={() => setVisualizacao('ano')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                visualizacao === 'ano'
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Ano
            </button>
          </div>
        </div>

        {/* Conteúdo baseado na visualização selecionada */}
        {visualizacao === 'hoje' && renderizarHoje()}
        {visualizacao === 'semana' && renderizarSemana()}
        {visualizacao === 'mes' && renderizarMes()}
        {visualizacao === 'ano' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Ano {anoVisualizacao}</h2>
            <div className="grid grid-cols-12 gap-4">
              {meses.map((mes, idx) => {
                const totalEventos = eventos.filter(e => new Date(e.data).getMonth() === idx).length;
                return (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-all">
                    <h3 className="font-bold text-sm mb-2">{mes}</h3>
                    <p className="text-2xl font-bold text-amber-600">{totalEventos}</p>
                    <p className="text-xs text-gray-500">eventos</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de Próximos Eventos - Visível sempre */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔔 Próximos Eventos</h2>
          
          {eventos.slice(0, 10).map((evento, idx) => {
            const dataEvento = new Date(evento.data);
            const hoje = new Date();
            const diasRestantes = Math.ceil((dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 mb-3 cursor-pointer hover:shadow-md transition-all ${
                  getCorEvento(evento.tipo)
                }`}
                onClick={() => {
                  setEventoSelecionado(evento);
                  setShowDetailsModal(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{evento.titulo}</h3>
                    <p className="text-sm text-gray-600">
                      {dataEvento.toLocaleDateString('pt-BR')} {evento.hora && `às ${evento.hora}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {diasRestantes >= 0 ? `Em ${diasRestantes} dias` : 'Passado'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Adicionar Evento */}
      {showAddEventoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">➕ Novo Evento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={novoEvento.titulo}
                  onChange={(e) => setNovoEvento({...novoEvento, titulo: e.target.value})}
                  placeholder="Ex: Consulta com Maria"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={novoEvento.data}
                    onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={novoEvento.hora}
                    onChange={(e) => setNovoEvento({...novoEvento, hora: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={novoEvento.tipo}
                  onChange={(e) => setNovoEvento({...novoEvento, tipo: e.target.value as any})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="compromisso">Compromisso</option>
                  <option value="consulta">Consulta</option>
                  <option value="vencimento">Vencimento</option>
                  <option value="aniversario">Aniversário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (opcional)</label>
                <textarea
                  value={novoEvento.descricao}
                  onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddEventoModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarEvento}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 shadow-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Funções de renderização para cada visualização
  function renderizarHoje() {
    const hoje = new Date();
    const eventosDeHoje = eventos.filter(e => e.data.startsWith(hoje.toISOString().split('T')[0]));
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">📅 Hoje - {hoje.toLocaleDateString('pt-BR')}</h2>
        
        {eventosDeHoje.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg">Nenhum evento hoje</p>
          </div>
        ) : (
          <div className="space-y-3">
            {eventosDeHoje.map((evento) => (
              <div key={evento.id} className={`p-4 rounded-lg border-l-4 ${getCorEvento(evento.tipo)}`}>
                <h3 className="font-bold text-gray-800">{evento.titulo}</h3>
                {evento.hora && <p className="text-sm text-gray-600">⏰ {evento.hora}</p>}
                {evento.descricao && <p className="text-sm text-gray-600 mt-2">{evento.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderizarSemana() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const diasSemana = Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      return dia;
    });

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📆 Semana Atual</h2>
        
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((dia, idx) => {
            const eventosDoDia = eventos.filter(e => e.data.startsWith(dia.toISOString().split('T')[0]));
            const ehHoje = dia.toDateString() === new Date().toDateString();
            
            return (
              <div key={idx} className={`border rounded-lg p-3 min-h-[100px] ${ehHoje ? 'bg-amber-50 border-amber-400' : 'bg-white border-gray-200'}`}>
                <div className={`font-bold text-sm mb-2 ${ehHoje ? 'text-amber-700' : 'text-gray-800'}`}>
                  {diasDaSemana[dia.getDay()]}
                </div>
                <div className="text-xs text-gray-600 mb-2">{dia.getDate()}/{dia.getMonth() + 1}</div>
                <div className="space-y-1">
                  {eventosDoDia.slice(0, 2).map(evento => (
                    <div key={evento.id} className={`text-xs px-2 py-1 rounded truncate ${getCorEvento(evento.tipo)}`}>
                      {evento.titulo}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderizarMes() {
    const primeiroDiaDoMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
    const ultimoDiaDoMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();
    const diasDoMes = Array.from({ length: ultimoDiaDoMes }, (_, i) => i + 1);
    const diasComEspacos = [...Array(primeiroDiaDoMes).fill(null), ...diasDoMes];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
            <button
              onClick={mesAnterior}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ‹ Anterior
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {meses[mesVisualizacao]} {anoVisualizacao}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={hoje}
                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={proximoMes}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Próximo ›
              </button>
            </div>
          </div>

          {/* Grid do Calendário */}
          <div className="grid grid-cols-7 gap-2">
            {/* Cabeçalho dos Dias */}
            {diasDaSemana.map((dia, index) => (
              <div
                key={index}
                className="text-center font-bold text-gray-600 py-2 border-b border-gray-200"
              >
                {dia}
              </div>
            ))}

            {/* Dias do Mês */}
            {diasComEspacos.map((dia, index) => {
              if (dia === null) {
                return <div key={`empty-${index}`} className="min-h-[80px] border border-gray-100"></div>;
              }

              const eventosDoDia = obterEventosDoDia(dia);
              const hoje = isHoje(dia);

              return (
                <div
                  key={dia}
                  className={`min-h-[80px] border border-gray-200 rounded-lg p-2 ${
                    hoje ? 'bg-amber-50 border-amber-400' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`font-semibold mb-1 ${hoje ? 'text-amber-700' : 'text-gray-800'}`}>
                    {dia}
                  </div>
                  <div className="space-y-1">
                    {eventosDoDia.slice(0, 3).map((evento, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded border ${
                          getCorEvento(evento.tipo)
                        } truncate cursor-pointer hover:scale-105 transition-transform`}
                        onClick={() => {
                          setEventoSelecionado(evento);
                          setShowDetailsModal(true);
                        }}
                        title={evento.titulo}
                      >
                        {evento.titulo}
                      </div>
                    ))}
                    {eventosDoDia.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{eventosDoDia.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

    </div>
  );
}
