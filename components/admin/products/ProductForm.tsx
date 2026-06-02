'use client';

import { useEffect, useState } from 'react';
import type { Category, ProductCreatePayload } from '@/lib/api-types';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadField from '@/components/admin/ImageUploadField';

type Props = {
  categories: Category[];
  initialData?: {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    displayOrder?: number;
    category?: string | { id: string; name: string };
  } | null;
  onSubmit: (payload: ProductCreatePayload) => Promise<void>;
  submitting?: boolean;
};

export default function ProductForm({ categories, initialData, onSubmit, submitting }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    displayOrder: '0',
    categoryId: '',
  });

  const { uploading, error: uploadError, handleFileChange } = useImageUpload();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        price: String(initialData.price ?? ''),
        displayOrder: String(initialData.displayOrder ?? 0),
        categoryId:
          typeof initialData.category === 'string'
            ? initialData.category
            : initialData.category?.id || '',
      });
    }
  }, [initialData]);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tratamento condicional do preço: se vazio ou 0, envia null para respeitar a anotação @Positive no backend
    const priceValue = form.price.trim() === '' ? null : Number(form.price);
    const parsedPrice = priceValue === 0 ? null : priceValue;

    await onSubmit({
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      price: parsedPrice,
      displayOrder: Number(form.displayOrder),
      categoryId: form.categoryId,
    });
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
            placeholder="Ex: Esteira Profissional XT900"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="Ex: 12999.90"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Descrição</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Descrição detalhada do produto"
          className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors text-sm resize-none"
          rows={4}
        />
      </div>

      {/* ── Hop 1: Image Upload ──────────────────────────────────── */}
      <ImageUploadField
        imageUrl={form.imageUrl}
        uploading={uploading}
        error={uploadError}
        onFileChange={(e) =>
          handleFileChange(e, (url) => set('imageUrl', url))
        }
        required
        label="Imagem do Produto *"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass}>Categoria *</label>
          <select
            value={form.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
      </div>

      {/* ── Hop 2: Submit JSON with the URL from Hop 1 ───────────── */}
      <button
        type="submit"
        disabled={submitting || uploading}
        className="h-11 px-8 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Salvando...' : initialData ? 'Atualizar produto' : 'Criar produto'}
      </button>
    </form>
  );
}
