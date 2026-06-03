'use client';

import { useState } from 'react';

import Link from 'next/link';
import type { Banner } from '@/lib/api-types';

// Helper: resolve o status ativo de forma tolerante a inconsistências da API Spring Boot
const resolveBannerActive = (banner: Banner): boolean => {
  const active = banner.isActive ?? banner.active;
  if (typeof active === 'boolean') return active;
  if (banner.status) {
    const normalized = banner.status.toLowerCase();
    if (normalized.includes('active') && !normalized.includes('inactive')) return true;
    if (normalized.includes('inactive')) return false;
  }
  return false;
};

type Props = {
  items: Banner[];
  loading?: boolean;
  error?: string;
  actionId?: string | number | null;
  onToggleStatus: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
};

export default function BannerTable({
  items,
  loading,
  error,
  actionId,
  onToggleStatus,
  onDelete,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const onNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  const onPrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <div className="text-white text-sm font-semibold">Todos os banners</div>
        <div className="text-white/40 text-xs">{items.length} item(s)</div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left whitespace-nowrap">
          <thead className="bg-black/40 text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Tag</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">CTA</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`banner-skeleton-${index}`}>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4 flex justify-end"><div className="h-4 w-32 bg-white/10 rounded animate-pulse" /></td>
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-rose-400 text-sm">{error}</td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/40 text-sm">
                  Nenhum banner encontrado. Clique em &quot;Novo banner&quot; para começar.
                </td>
              </tr>
            )}

            {!loading && !error && paginatedItems.map((banner) => {
              const active = resolveBannerActive(banner);
              return (
                <tr key={banner.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white text-sm font-semibold">{banner.title || 'Sem título'}</div>
                    {banner.subtitle && (
                      <div className="text-white/40 text-xs line-clamp-1">{banner.subtitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">{banner.tag || '--'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase tracking-widest ${
                      active ? 'text-[#39FF14]' : 'text-white/40'
                    }`}>
                      {active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">{banner.ctaText || '--'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/banners/${banner.id}/edit`}
                        className="h-8 px-3 flex items-center justify-center rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-blue-400/60 hover:bg-blue-500/10 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(banner)}
                        disabled={actionId === banner.id}
                        className="h-8 px-3 rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(banner)}
                        disabled={actionId === banner.id}
                        className="h-8 px-3 rounded-full border border-white/15 text-rose-400 text-xs font-semibold hover:text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
