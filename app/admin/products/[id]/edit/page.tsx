'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/hooks/admin/useProducts';
import { useCategories } from '@/hooks/admin/useCategories';
import ProductForm from '@/components/admin/products/ProductForm';
import type { ApiProduct, ProductCreatePayload } from '@/lib/api-types';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { findById, edit, saving } = useProducts();
  const { items: categories } = useCategories();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    findById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (payload: ProductCreatePayload) => {
    await edit(id, payload as any);
    router.push('/admin/products');
  };

  const productName = product?.productName ?? product?.name ?? '';

  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-2">
        <Link href="/admin/products" className="text-white/50 text-sm hover:text-white transition-colors">
          ← Voltar aos produtos
        </Link>
        <div className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] pt-4">Edição</div>
        <h1 className="text-white text-3xl font-black">Editar produto</h1>
        {productName && (
          <p className="text-white/50 text-sm">Modificando: <span className="text-white">{productName}</span></p>
        )}
      </header>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-11 bg-white/10 rounded-xl w-full" />
            <div className="h-11 bg-white/10 rounded-xl w-full" />
            <div className="h-32 bg-white/10 rounded-xl w-full" />
            <div className="h-11 bg-white/10 rounded-xl w-full" />
          </div>
        ) : product ? (
          <ProductForm
            categories={categories}
            initialData={product}
            onSubmit={handleSubmit}
            submitting={saving}
          />
        ) : (
          <div className="text-rose-400 text-sm">Produto não encontrado.</div>
        )}
      </div>
    </div>
  );
}
