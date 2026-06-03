'use client';

import { useState } from 'react';

import type { Lead } from '@/lib/api-types';

const formatDate = (value?: string) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatLocation = (city?: string, state?: string) => {
  if (city && state) return `${city} - ${state}`;
  if (city) return city;
  if (state) return state;
  return '--';
};

type Props = {
  items: Lead[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
};

export default function LeadsTable({ items, loading, error, onRefresh }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const onNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  const onPrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-white text-sm font-semibold">Caixa de Entrada</div>
          <div className="text-white/40 text-xs">{items.length} item(s)</div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-[#39FF14] transition-colors"
          >
            Atualizar
          </button>
        )}
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left whitespace-nowrap">
          <thead className="bg-black/40 text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">E-mail</th>
              <th className="px-6 py-3">Telefone</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Localização</th>
              <th className="px-6 py-3">Mensagem</th>
              <th className="px-6 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`lead-skeleton-${i}`}>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-48 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-white/10 rounded animate-pulse" /></td>
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-rose-400 text-sm">{error}</td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-white/40 text-sm">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}

            {!loading && !error && paginatedItems.map((lead, index) => (
              <tr
                key={lead.id ?? `${lead.email}-${index}`}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 text-white/80 text-sm font-medium">{lead.name ?? '--'}</td>
                <td className="px-6 py-4 text-white/60 text-sm">{lead.email ?? '--'}</td>
                <td className="px-6 py-4 text-white/60 text-sm">{lead.phone ?? '--'}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold tracking-wider ${
                      lead.type === 'QUOTE'
                        ? 'bg-[#39FF14]/10 text-[#39FF14]'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {lead.type ?? 'CONTACT'}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm">
                  {formatLocation(lead.city, lead.state)}
                </td>
                <td className="px-6 py-4 text-white/60 text-sm max-w-[250px]">
                  <div className="truncate cursor-default" title={lead.message}>
                    {lead.message ?? '--'}
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-white/40 text-xs font-medium">
            Página {currentPage + 1} de {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 0}
              className="h-8 px-4 rounded-full border border-white/15 text-white/70 text-xs font-semibold hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Página anterior
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage >= totalPages - 1}
              className="h-8 px-4 rounded-full border border-white/15 text-white/70 text-xs font-semibold hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próxima página
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
