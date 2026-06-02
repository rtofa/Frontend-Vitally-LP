'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/hooks/admin/useProducts';
import { useCategories } from '@/hooks/admin/useCategories';
import ProductForm from '@/components/admin/products/ProductForm';
import type { ProductCreatePayload } from '@/lib/api-types';

export default function NewProductPage() {
  const router = useRouter();
  const { create, saving } = useProducts();
  const { items: categories } = useCategories(100);

  const handleSubmit = async (payload: ProductCreatePayload) => {
    await create(payload);
    router.push('/admin/products');
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-2">
        <Link href="/admin/products" className="text-white/50 text-sm hover:text-white transition-colors">
          ← Voltar aos produtos
        </Link>
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em] pt-4">Produtos</div>
        <h1 className="text-white text-3xl font-black">Criar novo produto</h1>
        <p className="text-white/50 text-sm">
          Adicione os dados principais do produto e vincule a uma categoria existente.
        </p>
      </header>

      <div className="glass-card rounded-2xl p-6">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </div>
    </div>
  );
}
