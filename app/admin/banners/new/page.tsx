'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBanners } from '@/hooks/admin/useBanners';
import BannerForm from '@/components/admin/banners/BannerForm';

export default function NewBannerPage() {
  const router = useRouter();
  const { create, saving } = useBanners();

  const handleSubmit = async (payload: any) => {
    await create(payload);
    router.push('/admin/banners');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-2">
        <Link href="/admin/banners" className="text-white/50 text-sm hover:text-white transition-colors">
          ← Voltar aos banners
        </Link>
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em] pt-4">Banners</div>
        <h1 className="text-white text-3xl font-black">Novo banner</h1>
        <p className="text-white/50 text-sm">Crie uma nova campanha para o carrossel hero.</p>
      </header>

      <div className="glass-card rounded-2xl p-6">
        <BannerForm onSubmit={handleSubmit} submitting={saving} />
      </div>
    </div>
  );
}
