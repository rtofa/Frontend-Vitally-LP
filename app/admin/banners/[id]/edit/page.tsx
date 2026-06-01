'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBanners } from '@/hooks/admin/useBanners';
import BannerForm from '@/components/admin/banners/BannerForm';
import type { Banner } from '@/lib/api-types';

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { findById, edit, saving } = useBanners();

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    findById(id)
      .then(setBanner)
      .catch(() => setBanner(null))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (payload: any) => {
    await edit(id, payload);
    router.push('/admin/banners');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-2">
        <Link href="/admin/banners" className="text-white/50 text-sm hover:text-white transition-colors">
          ← Voltar aos banners
        </Link>
        <div className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] pt-4">Edição</div>
        <h1 className="text-white text-3xl font-black">Alterar banner</h1>
        <p className="text-white/50 text-sm">Modifique as informações do seu carrossel.</p>
      </header>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-11 bg-white/10 rounded-xl w-full" />
            <div className="h-11 bg-white/10 rounded-xl w-full" />
            <div className="h-11 bg-white/10 rounded-xl w-full" />
          </div>
        ) : banner ? (
          <BannerForm initialData={banner} onSubmit={handleSubmit} submitting={saving} />
        ) : (
          <div className="text-rose-400 text-sm">Banner não encontrado.</div>
        )}
      </div>
    </div>
  );
}
