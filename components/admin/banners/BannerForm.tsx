'use client';

import { useEffect, useState } from 'react';
import type { Banner } from '@/lib/api-types';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadField from '@/components/admin/ImageUploadField';

type BannerFormPayload = {
  title: string;
  subtitle?: string;
  tag?: string;
  ctaText?: string;
  ctaLink?: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  active?: boolean;
  displayOrder: number;
};

type Props = {
  initialData?: Banner | null;
  onSubmit: (payload: BannerFormPayload) => Promise<void>;
  submitting?: boolean;
};

export default function BannerForm({ initialData, onSubmit, submitting }: Props) {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    tag: '',
    ctaText: '',
    ctaLink: '',
    desktopImageUrl: '',
    mobileImageUrl: '',
    active: true,
    displayOrder: '0',
  });

  const { uploading: uploadingDesktop, error: uploadErrorDesktop, handleFileChange: handleDesktopChange } = useImageUpload();
  const { uploading: uploadingMobile, error: uploadErrorMobile, handleFileChange: handleMobileChange } = useImageUpload();
  const uploading = uploadingDesktop || uploadingMobile;

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        tag: initialData.tag || '',
        ctaText: initialData.ctaText || '',
        ctaLink: initialData.ctaLink || '',
        desktopImageUrl: initialData.desktopImageUrl || '',
        mobileImageUrl: initialData.mobileImageUrl || '',
        active: initialData.active ?? true,
        displayOrder: String(initialData.displayOrder ?? 0),
      });
    }
  }, [initialData]);

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: form.title,
      subtitle: form.subtitle || undefined,
      tag: form.tag || undefined,
      ctaText: form.ctaText || undefined,
      ctaLink: form.ctaLink || undefined,
      desktopImageUrl: form.desktopImageUrl,
      mobileImageUrl: form.mobileImageUrl,
      active: form.active,
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors text-sm';
  const labelClass = 'text-white/60 text-xs font-semibold uppercase tracking-widest';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass}>Título *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Ex: Linha Profissional 2025"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Tag</label>
          <input
            value={form.tag}
            onChange={(e) => set('tag', e.target.value)}
            placeholder="Ex: NOVO"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Subtítulo</label>
        <input
          value={form.subtitle}
          onChange={(e) => set('subtitle', e.target.value)}
          placeholder="Ex: Equipamentos para alta performance"
          className={inputClass}
        />
      </div>

      {/* ── Hop 1: Image Uploads (Desktop + Mobile) ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploadField
          imageUrl={form.desktopImageUrl}
          uploading={uploadingDesktop}
          error={uploadErrorDesktop}
          onFileChange={(e) =>
            handleDesktopChange(e, (url) => set('desktopImageUrl', url))
          }
          required
          label="Imagem Desktop *"
        />
        <ImageUploadField
          imageUrl={form.mobileImageUrl}
          uploading={uploadingMobile}
          error={uploadErrorMobile}
          onFileChange={(e) =>
            handleMobileChange(e, (url) => set('mobileImageUrl', url))
          }
          required
          label="Imagem Mobile *"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass}>Texto do Botão (CTA)</label>
          <input
            value={form.ctaText}
            onChange={(e) => set('ctaText', e.target.value)}
            placeholder="Ex: Ver catálogo"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Link do Botão</label>
          <input
            value={form.ctaLink}
            onChange={(e) => set('ctaLink', e.target.value)}
            placeholder="/shop"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Ordem de Exibição</label>
        <input
          type="number"
          min="0"
          value={form.displayOrder}
          onChange={(e) => set('displayOrder', e.target.value)}
          placeholder="0"
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-3 text-white/70 text-sm font-semibold cursor-pointer">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set('active', e.target.checked)}
          className="h-4 w-4 accent-[#39FF14]"
        />
        Banner ativo (exibir no carrossel)
      </label>

      {/* ── Hop 2: Submit JSON with the URL from Hop 1 ───────────── */}
      <button
        type="submit"
        disabled={submitting || uploading}
        className="h-11 px-8 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Salvando...' : initialData ? 'Atualizar banner' : 'Criar banner'}
      </button>
    </form>
  );
}
