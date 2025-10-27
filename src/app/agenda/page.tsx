'use client';

import { useState } from 'react';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  hora: string;
  cliente: string;
  tipo: 'consulta' | 'reavaliacao' | 'follow-up' | 'outro';
  cor: string;
  lembrete?: string; // tempo antes do evento (5min, 15min, 1h, 1 dia)
  notificado?: boolean;
}

export default function AgendaPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [draggedEvent, setDraggedEvent] = useState<Evento | null>(null);
  
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Consulta - Maria Silva',
      descricao: 'Primeira consulta de acompanhamento - Discussão sobre progresso',
      data: new Date(2025, 1, 20),
      hora: '09:00',
      cliente: 'Maria Silva',
      tipo: 'consulta',
      cor: 'blue',
      lembrete: '1h',
    },
    {
      id: '2',
      titulo: 'Reavaliação - João Santos',
      descricao: 'Reavaliação física mensal - Medições completas',
      data: new Date(2025, 1, 20),
      hora: '14:00',
      cliente: 'João Santos',
      tipo: 'reavaliacao',
      cor: 'green',
      lembrete: '30min',
    },
    {
      id: '3',
      titulo: 'Follow-up - Ana Costa',
      descricao: 'Acompanhamento semanal - Verificação de aderência ao protocolo',
      data: new Date(2025, 1, 21),
      hora: '10:30',
      cliente: 'Ana Costa',
      tipo: 'follow-up',
      cor: 'purple',
      lembrete: '15min',
    },
    {
      id: '4',
      titulo: 'Consulta - Pedro Oliveira',
      descricao: 'Nova consulta inicial - Anamnese completa',
      data: new Date(2025, 1, 21),
      hora: '15:00',
      cliente: 'Pedro Oliveira',
      tipo: 'consulta',
      cor: 'blue',
      lembrete: '1h',
    },
    {
      id: '5',
      titulo: 'Reavaliação - Maria Silva',
      descricao: 'Reavaliação física - Comparação de medidas',
      data: new Date(2025, 1, 22),
      hora: '08:30',
      cliente: 'Maria Silva',
      tipo: 'reavaliacao',
      cor: 'green',
      lembrete: '1h',
    },
    {
      id: '6',
      titulo: 'Follow-up - João Santos',
      descricao: 'Acompanhamento - Discussão sobre alimentação',
      data: new Date(2025, 1, 22),
      hora: '11:00',
      cliente: 'João Santos',
      tipo: 'follow-up',
      cor: 'purple',
    },
    {
      id: '7',
      titulo: 'Consulta - Carla Mendes',
      descricao: 'Consulta de rotina - Ajuste de protocolo',
      data: new Date(2025, 1, 23),
      hora: '09:30',
      cliente: 'Carla Mendes',
      tipo: 'consulta',
      cor: 'blue',
      lembrete: '1dia',
    },
    {
      id: '8',
      titulo: 'Reunião de Equipe',
      descricao: 'Planejamento semanal - Discussão de casos',
      data: new Date(2025, 1, 23),
      hora: '14:00',
      cliente: 'Equipe',
      tipo: 'outro',
      cor: 'gray',
    },
    {
      id: '9',
      titulo: 'Follow-up - Ana Costa',
      descricao: 'Acompanhamento - Motivação e orientações',
      data: new Date(2025, 1, 24),
      hora: '10:00',
      cliente: 'Ana Costa',
      tipo: 'follow-up',
      cor: 'purple',
      lembrete: '30min',
    },
    {
      id: '10',
      titulo: 'Consulta - Rafael Souza',
      descricao: 'Primeira consulta - Início do acompanhamento',
      data: new Date(2025, 1, 24),
      hora: '16:00',
      cliente: 'Rafael Souza',
      tipo: 'consulta',
      cor: 'blue',
      lembrete: '2h',
    },
  ]);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    cliente: '',
    tipo: 'consulta' as const,
    lembrete: '',
  });

  const coresEventos = {
    consulta: 'bg-blue-100 border-blue-500 text-blue-800',
    reavaliacao: 'bg-green-100 border-green-500 text-green-800',
    'follow-up': 'bg-purple-100 border-purple-500 text-purple-800',
    outro: 'bg-gray-100 border-gray-500 text-gray-800',
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    let eventosFiltrados = eventos.filter(evento => {
      const eventDate = new Date(evento.data);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });

    // Aplicar filtros
    if (filtroTipo !== 'todos') {
      eventosFiltrados = eventosFiltrados.filter(ev => ev.tipo === filtroTipo);
    }
    if (filtroCliente) {
      eventosFiltrados = eventosFiltrados.filter(ev => 
        ev.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
      );
    }

    return eventosFiltrados;
  };

  // Drag & Drop handlers
  const handleDragStart = (evento: Evento) => {
    setDraggedEvent(evento);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date) => {
    if (draggedEvent) {
      const newDate = new Date(date);
      const horaParts = draggedEvent.hora.split(':');
      newDate.setHours(parseInt(horaParts[0]), parseInt(horaParts[1]));
      
      setEventos(eventos.map(ev => 
        ev.id === draggedEvent.id ? { ...ev, data: newDate } : ev
      ));
      setDraggedEvent(null);
    }
  };

  const handleAddEvent = () => {
    const novoEvento: Evento = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      descricao: formData.descricao,
      data: new Date(formData.data),
      hora: formData.hora,
      cliente: formData.cliente,
      tipo: formData.tipo,
      cor: formData.tipo,
      lembrete: formData.lembrete || undefined,
    };
    setEventos([...eventos, novoEvento]);
    setShowModal(false);
    setFormData({ titulo: '', descricao: '', data: '', hora: '', cliente: '', tipo: 'consulta', lembrete: '' });
  };

  const handleEditEvent = (evento: Evento) => {
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data.toISOString().split('T')[0],
      hora: evento.hora,
      cliente: evento.cliente,
      tipo: evento.tipo,
      lembrete: evento.lembrete || '',
    });
    setEditingEvent(evento);
    setShowModal(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    setEventos(eventos.map(ev => 
      ev.id === editingEvent.id ? { 
        ...ev, 
        titulo: formData.titulo,
        descricao: formData.descricao,
        data: new Date(formData.data),
        hora: formData.hora,
        cliente: formData.cliente,
        tipo: formData.tipo,
        lembrete: formData.lembrete || undefined
      } : ev
    ));
    setShowModal(false);
    setEditingEvent(null);
    setFormData({ titulo: '', descricao: '', data: '', hora: '', cliente: '', tipo: 'consulta', lembrete: '' });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEventos(eventos.filter(ev => ev.id !== id));
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">📅 Agenda</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Gestão completa de consultas e compromissos</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="/"
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base"
            >
              ← Voltar
            </a>
            <button
              onClick={() => {
                setEditingEvent(null);
                setFormData({ titulo: '', descricao: '', data: '', hora: '', cliente: '', tipo: 'consulta' });
                setShowModal(true);
              }}
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg text-sm md:text-base"
            >
              ➕ Novo Evento
            </button>
          </div>
        </div>
      </div>

      {/* Controles de visualização */}
      <div className="px-4 md:px-8 py-4">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          {/* Filtros */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Filtrar por Cliente</label>
                <input
                  type="text"
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  placeholder="Digite o nome do cliente..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📋 Filtrar por Tipo</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-sm md:text-base"
                >
                  <option value="todos">Todos</option>
                  <option value="consulta">📋 Consulta</option>
                  <option value="reavaliacao">📏 Reavaliação</option>
                  <option value="follow-up">💊 Follow-up</option>
                  <option value="outro">📝 Outro</option>
                </select>
              </div>
              <div className="flex items-end">
                {(filtroTipo !== 'todos' || filtroCliente) && (
                  <button
                    onClick={() => {
                      setFiltroTipo('todos');
                      setFiltroCliente('');
                    }}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm md:text-base"
                  >
                    🗑️ Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm md:text-base"
              >
                ← Anterior
              </button>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 px-4">
                {meses[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm md:text-base"
              >
                Próximo →
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${view === 'month' ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Mês
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${view === 'week' ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Semana
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${view === 'day' ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Dia
              </button>
            </div>
          </div>

          {/* Calendário Mensal */}
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {diasSemana.map((dia) => (
                <div key={dia} className="p-2 md:p-4 text-center font-bold text-gray-700 text-sm md:text-base">
                  {dia}
                </div>
              ))}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2 md:p-4 bg-gray-50 rounded-lg"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                const eventsForDay = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                  return (
                  <div
                    key={day}
                    className={`p-2 md:p-4 min-h-[60px] md:min-h-[100px] bg-white border-2 rounded-lg ${
                      isToday ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(date)}
                  >
                    <div className={`text-sm md:text-base font-bold mb-1 ${isToday ? 'text-amber-700' : 'text-gray-800'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {eventsForDay.slice(0, 2).map((evento) => (
                        <div
                          key={evento.id}
                          draggable
                          onDragStart={() => handleDragStart(evento)}
                          className={`text-xs p-1 rounded truncate ${coresEventos[evento.tipo]} cursor-move hover:opacity-80`}
                        >
                          {evento.hora} - {evento.titulo}
                        </div>
                      ))}
                      {eventsForDay.length > 2 && (
                        <div className="text-xs text-gray-500 font-bold">
                          +{eventsForDay.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lista de Eventos - Visualização Trello (Semana) */}
          {view === 'week' && (
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 overflow-x-auto pb-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date(selectedDate);
                date.setDate(selectedDate.getDate() - selectedDate.getDay() + index);
                const eventsForDay = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full lg:w-72"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(date)}
                  >
                    {/* Header da Coluna */}
                    <div className={`p-3 md:p-4 border-2 rounded-t-lg mb-2 ${
                      isToday ? 'border-amber-500 bg-gradient-to-r from-amber-400 to-amber-500' : 'border-gray-300 bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}>
                      <div className="font-bold text-white text-center">
                        <div className="text-xs md:text-sm uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                        <div className="text-lg md:text-xl">{date.getDate()}</div>
                        <div className="text-xs md:text-sm">{date.toLocaleDateString('pt-BR', { month: 'short' })}</div>
                      </div>
                    </div>
                    
                    {/* Eventos */}
                    <div className={`min-h-[300px] md:min-h-[500px] max-h-[70vh] overflow-y-auto p-2 space-y-2 border-2 rounded-b-lg ${
                      isToday ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      {eventsForDay.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          <div className="text-4xl mb-2">📭</div>
                          <p>Nenhum evento</p>
                        </div>
                      ) : (
                        eventsForDay.map((evento) => (
                          <div
                            key={evento.id}
                            draggable
                            onDragStart={() => handleDragStart(evento)}
                            className={`p-3 rounded-lg shadow-sm ${coresEventos[evento.tipo]} cursor-move hover:shadow-md transition-all border-l-4`}
                          >
                            <div className="font-bold text-sm mb-1">⏰ {evento.hora}</div>
                            <div className="font-semibold text-base mb-1">{evento.titulo}</div>
                            {evento.descricao && (
                              <div className="text-sm opacity-75 mb-1">{evento.descricao}</div>
                            )}
                            <div className="text-xs font-medium opacity-60">👤 {evento.cliente}</div>
                            {evento.lembrete && (
                              <div className="text-xs mt-1 bg-white/50 px-2 py-1 rounded inline-block">
                                🔔 {evento.lembrete}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'day' && (
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-bold">
                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600">Nenhum evento agendado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((evento) => (
                    <div
                      key={evento.id}
                      className={`p-4 rounded-lg ${coresEventos[evento.tipo]}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg">{evento.hora} - {evento.titulo}</div>
                          <div className="text-sm">{evento.descricao}</div>
                          <div className="text-sm mt-1">👤 {evento.cliente}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEvent(evento)}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evento.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold text-amber-700 mb-4">
              {editingEvent ? '✏️ Editar Evento' : '➕ Novo Evento'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: Consulta com Maria Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="consulta">📋 Consulta</option>
                  <option value="reavaliacao">📏 Reavaliação</option>
                  <option value="follow-up">💊 Follow-up</option>
                  <option value="outro">📝 Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🔔 Lembrete</label>
                <select
                  value={formData.lembrete}
                  onChange={(e) => setFormData({...formData, lembrete: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Nenhum lembrete</option>
                  <option value="5min">5 minutos antes</option>
                  <option value="15min">15 minutos antes</option>
                  <option value="30min">30 minutos antes</option>
                  <option value="1h">1 hora antes</option>
                  <option value="2h">2 horas antes</option>
                  <option value="1dia">1 dia antes</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 shadow-lg text-sm md:text-base"
              >
                {editingEvent ? '💾 Salvar' : '➕ Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

