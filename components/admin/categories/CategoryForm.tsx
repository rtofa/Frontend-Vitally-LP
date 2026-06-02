'use client';

import { useEffect, useState } from 'react';
import type { Category, CategoryCreatePayload } from '@/lib/api-types';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadField from '@/components/admin/ImageUploadField';

type Props = {
  initialData?: Pick<Category, "name" | "active" | "isActive" | "imageUrl"> | null;
  onSubmit: (payload: CategoryCreatePayload) => Promise<void>;
  submitting?: boolean;
};

export default function CategoryForm({ initialData, onSubmit, submitting }: Props) {
  const [form, setForm] = useState<CategoryCreatePayload>({
    name: '',
    imageUrl: '',
    active: true,
  });

  const { uploading, error: uploadError, handleFileChange } = useImageUpload();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        imageUrl: initialData.imageUrl,
        active: initialData.isActive ?? initialData.active ?? true,
      });
    }
  }, [initialData]);

  const set = (key: keyof CategoryCreatePayload, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    if (!initialData) {
      setForm({ name: '', imageUrl: '', active: true });
    }
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors text-sm';
  const labelClass = 'text-white/60 text-xs font-semibold uppercase tracking-widest';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass}>Nome *</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ex: Máquinas de força"
            className={inputClass}
            required
          />
        </div>

        {/* ── Hop 1: Image Upload ──────────────────────────────────── */}
        <ImageUploadField
          imageUrl={form.imageUrl}
          uploading={uploading}
          error={uploadError}
          onFileChange={(e) =>
            handleFileChange(e, (url) => set('imageUrl', url as string))
          }
          required
          label="Imagem da Categoria *"
        />
      </div>

      <label className="flex items-center gap-3 text-white/70 text-sm font-semibold cursor-pointer">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set('active', e.target.checked)}
          className="h-4 w-4 accent-[#39FF14]"
        />
        Categoria ativa (exibir no site)
      </label>

      {/* ── Hop 2: Submit JSON with the URL from Hop 1 ───────────── */}
      <button
        type="submit"
        disabled={submitting || uploading}
        className="h-11 px-8 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Salvando...' : initialData ? 'Atualizar categoria' : 'Criar categoria'}
      </button>
    </form>
  );
}
