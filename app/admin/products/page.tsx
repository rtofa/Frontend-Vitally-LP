'use client';

import Link from 'next/link';
import { useProducts } from '@/hooks/admin/useProducts';
import ProductTable from '@/components/admin/products/ProductTable';
import type { ApiProduct } from '@/lib/api-types';

export default function ProductsPage() {
  const {
    items,
    page,
    setPage,
    totalPages,
    totalElements,
    canPrev,
    canNext,
    loading,
    error,
    actionId,
    toggleStatus,
    remove,
  } = useProducts(true); // paginated=true

  const handleDelete = async (product: ApiProduct) => {
    if (typeof product.id === 'undefined') return;
    const confirmed = window.confirm(
      'Excluir este produto? Esta ação não pode ser desfeita.'
    );
    if (!confirmed) return;
    await remove(product.id);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Produtos</div>
          <h1 className="text-white text-3xl font-black">Catálogo</h1>
          <p className="text-white/50 text-sm">
            Gerencie sua linha de equipamentos high-ticket.
            {totalElements > 0 && (
              <span className="ml-2 text-white/40">({totalElements} produtos)</span>
            )}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-11 px-6 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors"
        >
          Novo produto
        </Link>
      </header>

      <ProductTable
        items={items}
        loading={loading}
        error={error}
        actionId={actionId}
        onToggleStatus={toggleStatus}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={!canPrev || loading}
          className="h-10 px-5 rounded-full border border-white/15 text-white/60 text-sm font-semibold hover:text-white hover:border-[#39FF14]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Página anterior
        </button>
        <div className="text-white/40 text-xs uppercase tracking-widest">
          {totalPages > 0 ? page + 1 : 1} / {Math.max(totalPages, 1)}
        </div>
        <button
          onClick={() => setPage((prev) => (canNext ? prev + 1 : prev))}
          disabled={!canNext || loading}
          className="h-10 px-5 rounded-full border border-white/15 text-white/60 text-sm font-semibold hover:text-white hover:border-[#39FF14]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próxima página
        </button>
      </div>
    </div>
  );
}
