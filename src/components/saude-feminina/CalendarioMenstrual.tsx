'use client';

import { useState } from 'react';

interface CalendarioMenstrualProps {
  clienteId: string;
}

export default function CalendarioMenstrual({ clienteId }: CalendarioMenstrualProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!clienteId) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-pink-300 p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Selecione um cliente</h3>
        <p className="text-gray-500">
          Escolha um cliente para visualizar o calendário menstrual
        </p>
      </div>
    );
  }

  // Gerar dias do mês atual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  // Preencher dias vazios do início
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Adicionar dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Mock: Simular dias de menstruação (exemplo)
  const menstruacaoDays = [1, 2, 3, 4, 5]; // Dias 1-5 do mês
  const fertilDays = [12, 13, 14, 15, 16]; // Período fértil
  const ovulacaoDay = 14; // Dia de ovulação

  const getDayStatus = (day: number | null) => {
    if (day === null) return '';
    if (menstruacaoDays.includes(day)) return 'menstruacao';
    if (day === ovulacaoDay) return 'ovulacao';
    if (fertilDays.includes(day)) return 'fertil';
    return 'normal';
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header do Calendário */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Menstruação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-300 rounded"></div>
            <span>Período Fértil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span>Ovulação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Normal</span>
          </div>
        </div>

        {/* Calendário */}
        <div className="grid grid-cols-7 gap-2">
          {/* Dias da semana */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 p-2 text-sm md:text-base">
              {day}
            </div>
          ))}

          {/* Dias do mês */}
          {days.map((day, idx) => {
            const status = getDayStatus(day);
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;
            
            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDate(new Date(year, month, day))}
                className={`
                  p-2 md:p-3 rounded-lg text-sm md:text-base font-semibold transition-all
                  ${day === null ? 'bg-transparent' : ''}
                  ${status === 'menstruacao' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${status === 'fertil' ? 'bg-pink-300 text-white hover:bg-pink-400' : ''}
                  ${status === 'ovulacao' ? 'bg-purple-500 text-white hover:bg-purple-600 rounded-full' : ''}
                  ${status === 'normal' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                  ${isSelected ? 'ring-4 ring-pink-400' : ''}
                `}
                disabled={day === null}
              >
                {day || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Informações do dia selecionado */}
      {selectedDate && (
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-300 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📌 {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <div className="space-y-2">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-2">Fase do Ciclo</div>
              <div className="text-pink-600 font-bold">Fase Folicular - Dia 12</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-2">Sintomas Registrados</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm">Energia Média</span>
                <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">Humor Bom</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão para adicionar/editar ciclo */}
      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg py-3 px-6 font-semibold hover:scale-105 transition-all shadow-lg">
          ➕ Registrar Início da Menstruação
        </button>
        <button className="flex-1 bg-white border-2 border-pink-300 text-pink-600 rounded-lg py-3 px-6 font-semibold hover:bg-pink-50 transition-all">
          📝 Editar Ciclo
        </button>
      </div>
    </div>
  );
}

