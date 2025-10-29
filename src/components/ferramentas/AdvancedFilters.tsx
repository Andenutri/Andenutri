'use client';

import { useState, useEffect } from 'react';
import { ClienteComFormulario } from '@/data/clientesData';

export interface FilterOptions {
  genero?: 'masculino' | 'feminino' | 'outro' | '';
  idadeMin?: number;
  idadeMax?: number;
  statusPrograma?: 'ativo' | 'inativo' | '';
  statusHerbalife?: 'ativo' | 'inativo' | '';
  isLead?: boolean | null;
  columnId?: string;
  periodoSemAvaliacao?: number; // dias sem avaliação
  dataUltimaAvaliacaoDesde?: string;
  dataUltimaAvaliacaoAte?: string;
}

interface AdvancedFiltersProps {
  clientes: ClienteComFormulario[];
  columns?: Array<{ id: string; nome: string }>;
  onFilterChange: (filteredClientes: ClienteComFormulario[]) => void;
}

export default function AdvancedFilters({ clientes, columns = [], onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClientes, setFilteredClientes] = useState<ClienteComFormulario[]>(clientes);

  // Inicializar com todos os clientes
  useEffect(() => {
    setFilteredClientes(clientes);
    onFilterChange(clientes);
  }, [clientes]);

  // Calcular idade a partir da data de nascimento
  const calcularIdade = (dataNascimento?: string): number | null => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Aplicar filtros
  const aplicarFiltros = (filtros: FilterOptions) => {
    let filtered = [...clientes];

    // Filtro por gênero
    if (filtros.genero) {
      filtered = filtered.filter((cliente) => {
        // Assumindo que há um campo genero ou inferindo de outro campo
        // Se não houver, pode pular este filtro
        return true; // Por enquanto, retornar true pois não temos campo genero implementado
      });
    }

    // Filtro por idade
    if (filtros.idadeMin !== undefined || filtros.idadeMax !== undefined) {
      filtered = filtered.filter((cliente) => {
        const idade = calcularIdade((cliente as any).data_nascimento);
        if (idade === null) return false;
        if (filtros.idadeMin !== undefined && idade < filtros.idadeMin) return false;
        if (filtros.idadeMax !== undefined && idade > filtros.idadeMax) return false;
        return true;
      });
    }

    // Filtro por status do programa
    if (filtros.statusPrograma) {
      filtered = filtered.filter((cliente) => {
        // Suporta tanto status_plano quanto status_programa (do Supabase)
        const status = cliente.status_plano || (cliente as any).status_programa;
        return status === filtros.statusPrograma;
      });
    }

    // Filtro por status Herbalife
    if (filtros.statusHerbalife) {
      filtered = filtered.filter((cliente) => {
        return (cliente as any).status_herbalife === filtros.statusHerbalife;
      });
    }

    // Filtro por Lead
    if (filtros.isLead !== null && filtros.isLead !== undefined) {
      filtered = filtered.filter((cliente) => {
        return (cliente as any).is_lead === filtros.isLead;
      });
    }

    // Filtro por coluna do Trello
    if (filtros.columnId) {
      // Este filtro seria aplicado no contexto do Kanban, não aqui
      // Mas podemos deixar a estrutura pronta
    }

    setFilteredClientes(filtered);
    onFilterChange(filtered);
  };

  // Atualizar filtro individual
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    aplicarFiltros(newFilters);
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilters({});
    setFilteredClientes(clientes);
    onFilterChange(clientes);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== '' && v !== false
  );

  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">🔍 Filtros Avançados</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold text-sm"
        >
          {showFilters ? '▲ Esconder' : '▼ Mostrar'}
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4">
          {/* Filtros em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Idade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Idade</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.idadeMin || ''}
                  onChange={(e) =>
                    updateFilter('idadeMin', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.idadeMax || ''}
                  onChange={(e) =>
                    updateFilter('idadeMax', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Status Programa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💪 Status Programa
              </label>
              <select
                value={filters.statusPrograma || ''}
                onChange={(e) => updateFilter('statusPrograma', e.target.value || undefined)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              >
                <option value="">Todos</option>
                <option value="ativo">✅ Ativo</option>
                <option value="inativo">❌ Inativo</option>
              </select>
            </div>

            {/* Status Herbalife */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🥗 Status Herbalife
              </label>
              <select
                value={filters.statusHerbalife || ''}
                onChange={(e) => updateFilter('statusHerbalife', e.target.value || undefined)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              >
                <option value="">Todos</option>
                <option value="ativo">✅ Ativo</option>
                <option value="inativo">❌ Inativo</option>
              </select>
            </div>

            {/* Lead */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Lead</label>
              <select
                value={
                  filters.isLead === null || filters.isLead === undefined
                    ? ''
                    : filters.isLead
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => {
                  const value = e.target.value;
                  updateFilter('isLead', value === '' ? null : value === 'true');
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              >
                <option value="">Todos</option>
                <option value="true">✅ É Lead</option>
                <option value="false">❌ Não é Lead</option>
              </select>
            </div>

            {/* Coluna Trello (se tiver colunas disponíveis) */}
            {columns.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📋 Coluna Trello
                </label>
                <select
                  value={filters.columnId || ''}
                  onChange={(e) => updateFilter('columnId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                >
                  <option value="">Todas</option>
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Período sem Avaliação */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⏰ Sem avaliação há
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Dias"
                  value={filters.periodoSemAvaliacao || ''}
                  onChange={(e) =>
                    updateFilter(
                      'periodoSemAvaliacao',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                />
                <span className="text-sm text-gray-600 py-2">dias ou mais</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Limpar Filtros</span>
            </button>
            <div className="flex-1"></div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold">
                {filteredClientes.length}
              </span>
              <span>de {clientes.length} cliente(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Resumo quando filtros estão ativos mas escondidos */}
      {!showFilters && hasActiveFilters && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            ✅ Filtros ativos - {Object.keys(filters).filter((k) => filters[k as keyof FilterOptions]).length} filtro(s) aplicado(s)
          </p>
        </div>
      )}
    </div>
  );
}

