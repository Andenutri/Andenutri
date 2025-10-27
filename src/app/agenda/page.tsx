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
}

export default function AgendaPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Consulta - Maria Silva',
      descricao: 'Primeira consulta de acompanhamento',
      data: new Date(2025, 1, 20),
      hora: '14:00',
      cliente: 'Maria Silva',
      tipo: 'consulta',
      cor: 'blue',
    },
    {
      id: '2',
      titulo: 'Reavaliação - João Santos',
      descricao: 'Reavaliação física mensal',
      data: new Date(2025, 1, 22),
      hora: '10:00',
      cliente: 'João Santos',
      tipo: 'reavaliacao',
      cor: 'green',
    },
  ]);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    cliente: '',
    tipo: 'consulta' as const,
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
    return eventos.filter(evento => {
      const eventDate = new Date(evento.data);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const handleAddEvent = () => {
    const novoEvento: Evento = {
      id: Date.now().toString(),
      ...formData,
      data: new Date(formData.data),
    };
    setEventos([...eventos, novoEvento]);
    setShowModal(false);
    setFormData({ titulo: '', descricao: '', data: '', hora: '', cliente: '', tipo: 'consulta' });
  };

  const handleEditEvent = (evento: Evento) => {
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data.toISOString().split('T')[0],
      hora: evento.hora,
      cliente: evento.cliente,
      tipo: evento.tipo,
    });
    setEditingEvent(evento);
    setShowModal(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    setEventos(eventos.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData, data: new Date(formData.data) } : ev));
    setShowModal(false);
    setEditingEvent(null);
    setFormData({ titulo: '', descricao: '', data: '', hora: '', cliente: '', tipo: 'consulta' });
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
                  >
                    <div className={`text-sm md:text-base font-bold mb-1 ${isToday ? 'text-amber-700' : 'text-gray-800'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {eventsForDay.slice(0, 2).map((evento) => (
                        <div
                          key={evento.id}
                          className={`text-xs p-1 rounded truncate ${coresEventos[evento.tipo]}`}
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

          {/* Lista de Eventos */}
          {view === 'week' && (
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date(selectedDate);
                date.setDate(selectedDate.getDate() - selectedDate.getDay() + index);
                const eventsForDay = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-3 md:p-4 border-2 rounded-lg ${
                      isToday ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm md:text-base mb-2">
                      {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    {eventsForDay.length === 0 ? (
                      <div className="text-gray-400 text-sm">Nenhum evento</div>
                    ) : (
                      <div className="space-y-2">
                        {eventsForDay.map((evento) => (
                          <div
                            key={evento.id}
                            className={`p-2 rounded ${coresEventos[evento.tipo]}`}
                          >
                            <div className="font-semibold">{evento.hora} - {evento.titulo}</div>
                            <div className="text-sm">{evento.descricao}</div>
                          </div>
                        ))}
                      </div>
                    )}
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

