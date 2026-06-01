'use client';

import Link from 'next/link';
import { useBanners } from '@/hooks/admin/useBanners';
import BannerTable from '@/components/admin/banners/BannerTable';
import type { Banner } from '@/lib/api-types';

export default function BannersPage() {
  const { items, loading, error, actionId, load, toggleStatus, remove } = useBanners();

  const handleDelete = async (banner: Banner) => {
    if (typeof banner.id === 'undefined') return;
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este banner? Esta ação é irreversível.'
    );
    if (!confirmed) return;
    await remove(banner.id);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Banners</div>
          <h1 className="text-white text-3xl font-black">Campanhas</h1>
          <p className="text-white/50 text-sm">Controle as promoções do carrossel hero.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="h-11 px-4 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:text-[#39FF14] hover:border-[#39FF14]/40 transition-colors"
          >
            Atualizar
          </button>
          <Link
            href="/admin/banners/new"
            className="h-11 px-6 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors"
          >
            Novo banner
          </Link>
        </div>
      </header>

      <BannerTable
        items={items}
        loading={loading}
        error={error}
        actionId={actionId}
        onToggleStatus={toggleStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}