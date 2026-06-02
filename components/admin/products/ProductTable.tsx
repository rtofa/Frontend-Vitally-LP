'use client';

import Link from 'next/link';
import type { ApiProduct } from '@/lib/api-types';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getProductName = (product: ApiProduct) =>
  product.productName ?? product.name ?? 'Produto sem nome';

const getStatus = (product: ApiProduct) => {
  const active = product.isActive ?? product.active;
  if (typeof active === 'boolean') {
    return active
      ? { label: 'Ativo', className: 'text-[#39FF14] bg-[#39FF14]/10' }
      : { label: 'Inativo', className: 'text-rose-400 bg-rose-500/10' };
  }
  if (product.status) return { label: product.status, className: 'text-white/60 bg-white/5' };
  return { label: 'Desconhecido', className: 'text-white/40 bg-white/5' };
};

type Props = {
  items: ApiProduct[];
  loading?: boolean;
  error?: string;
  actionId?: string | number | null;
  onToggleStatus: (product: ApiProduct) => void;
  onDelete: (product: ApiProduct) => void;
};

export default function ProductTable({
  items,
  loading,
  error,
  actionId,
  onToggleStatus,
  onDelete,
}: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <div className="text-white text-sm font-semibold">Produtos cadastrados</div>
        <div className="text-white/40 text-xs">{items.length} item(s)</div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left">
          <thead className="bg-black/40 text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Preço</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`product-skeleton-${i}`}>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-white/10 rounded animate-pulse ml-auto" /></td>
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
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}

            {!loading && !error && items.map((product) => {
              const status = getStatus(product);
              const active = product.isActive ?? product.active;
              return (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white text-sm font-semibold">{getProductName(product)}</div>
                    {product.productDescription && (
                      <div className="text-white/40 text-xs line-clamp-1">{product.productDescription}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {product.category && typeof product.category !== 'string'
                      ? product.category.name
                      : product.category || '--'}
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">
                    {Number.isFinite(product.price) ? formatPrice(product.price) : '--'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="h-8 px-3 flex items-center rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-blue-400/60 hover:bg-blue-500/10 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(product)}
                        disabled={active === undefined || actionId === product.id}
                        className="h-8 px-3 rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        disabled={actionId === product.id}
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
    </div>
  );
}
