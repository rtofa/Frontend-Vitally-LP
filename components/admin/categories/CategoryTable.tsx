'use client';

import Link from 'next/link';
import type { Category } from '@/lib/api-types';

type Props = {
  items: Category[];
  loading?: boolean;
  error?: string;
  actionId?: string | null;
  onToggleStatus: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export default function CategoryTable({
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
        <div className="text-white text-sm font-semibold">Categorias cadastradas</div>
        <div className="text-white/40 text-xs">{items.length} item(s)</div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="px-6 py-8 text-center text-rose-400 text-sm">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="px-6 py-8 text-center text-white/40 text-sm">
          Nenhuma categoria encontrada ainda.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {items.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-4 p-4 rounded-xl border border-white/10 bg-black/40 sm:flex-row sm:items-center hover:border-white/20 transition-colors"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{category.name}</div>
                <div className="text-white/40 text-xs mt-1 truncate">{category.id}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    category.active ? 'text-[#39FF14]' : 'text-white/40'
                  }`}
                >
                  {category.active ? 'Ativo' : 'Inativo'}
                </span>
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="h-8 px-3 flex items-center rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-blue-400/60 hover:bg-blue-500/10 transition-colors"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleStatus(category)}
                  disabled={actionId === category.id}
                  className="h-8 px-3 rounded-full border border-white/15 text-white/60 text-xs font-semibold hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {category.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category)}
                  disabled={actionId === category.id}
                  className="h-8 px-3 rounded-full border border-white/15 text-rose-400 text-xs font-semibold hover:text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
