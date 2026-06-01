'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/hooks/admin/useCategories';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import type { Category, CategoryCreatePayload } from '@/lib/api-types';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { findById, edit, saving } = useCategories();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    findById(id)
      .then(setCategory)
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (payload: CategoryCreatePayload) => {
    await edit(id, payload);
    router.push('/admin/categories');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-2">
        <Link href="/admin/categories" className="text-white/50 text-sm hover:text-white transition-colors">
          ← Voltar às categorias
        </Link>
        <div className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] pt-4">Edição</div>
        <h1 className="text-white text-3xl font-black">Editar categoria</h1>
        {category && (
          <p className="text-white/50 text-sm">Modificando: <span className="text-white">{category.name}</span></p>
        )}
      </header>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-11 bg-white/10 rounded-xl w-full" />
            <div className="h-11 bg-white/10 rounded-xl w-full" />
          </div>
        ) : category ? (
          <CategoryForm initialData={category} onSubmit={handleSubmit} submitting={saving} />
        ) : (
          <div className="text-rose-400 text-sm">Categoria não encontrada.</div>
        )}
      </div>
    </div>
  );
}
